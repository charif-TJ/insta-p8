import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

/**
 * POST /api/instagram/send-message
 * Send a DM to an Instagram user, or a Private Reply to a specific comment.
 *
 * Request body:
 * {
 *   "user_id": 123456,
 *   "recipient_id": 789012,       // required — the Instagram user ID
 *   "message": "Your reply text",  // required
 *   "comment_id": "COMMENT_ID"    // optional — when provided, sends a Private Reply
 *                                  //            to the comment (required for first-time
 *                                  //            commenters with no prior DM conversation).
 * }
 *
 * Per Meta's documentation:
 *   To initiate a Private Reply to a comment, the recipient MUST be specified
 *   as { "comment_id": "<COMMENT_ID>" } rather than { "id": "<USER_ID>" }.
 *   Using user_id alone fails silently for users who have never messaged
 *   this account before.
 *   Ref: https://developers.facebook.com/docs/messenger-platform/instagram/private-replies
 */
export async function POST(request: NextRequest) {
  try {
    const { user_id, recipient_id, message, comment_id } = await request.json()

    if (!user_id || !recipient_id || !message) {
      return NextResponse.json({ error: "Missing required fields: user_id, recipient_id, message" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Get user's access token
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("access_token, username")
      .eq("id", user_id)
      .single()

    if (userError || !user) {
      console.error("[send-message] Failed to get user:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Determine the correct recipient format.
    // IMPORTANT: For Private Replies (initial contact with a commenter),
    // comment_id MUST be used. Using user_id alone will fail for first-time
    // commenters because Meta requires the comment context to open a new thread.
    const recipient = comment_id
      ? { comment_id: comment_id.toString() }
      : { id: recipient_id.toString() }

    if (comment_id) {
      console.log(`[send-message] Sending Private Reply via comment_id=${comment_id} to user=${recipient_id}`)
    } else {
      console.log(`[send-message] Sending DM from ${user.username} to ${recipient_id}`)
    }

    // Send message via Instagram Graph API
    const sendUrl = `https://graph.instagram.com/v24.0/me/messages?access_token=${encodeURIComponent(user.access_token)}`

    const response = await fetch(sendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient,
        message: { text: message },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[send-message] Failed to send message:", data)
      return NextResponse.json({ error: data.error?.message || "Failed to send message" }, { status: 400 })
    }

    console.log("[send-message] Message sent successfully:", data.message_id)

    // Store the sent message in database (if conversation exists)
    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_id", user_id)
      .eq("recipient_id", recipient_id)
      .single()

    if (conversation) {
      await supabase.from("messages").insert({
        id: data.message_id,
        conversation_id: conversation.id,
        user_id,
        sender_id: user_id,
        sender_username: user.username,
        content: message,
        is_from_instagram: false,
      })
    }

    return NextResponse.json({
      success: true,
      message_id: data.message_id,
    })
  } catch (error) {
    console.error("[send-message] Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
