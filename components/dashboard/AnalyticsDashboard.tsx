"use client"

import { useEffect, useState } from "react"
import { useInstagramSession } from "@/hooks/use-instagram-session"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Activity,
    Users,
    MessageCircle,
    Zap,
    TrendingUp,
    Clock,
    RefreshCw,
    Download,
    MessageSquare,
    Sparkles,
    Tag,
    BarChart2,
    PieChart as PieChartIcon,
    Loader2
} from "lucide-react"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts"

interface AnalyticsData {
    range: string
    metrics: {
        totalSent: number
        totalAudience: number
        periodAudience: number
        totalAutomations: number
        activeAutomations: number
        responseRate: string
        incomingCount: number
    }
    timeSeries: Array<{
        date: string
        formattedDate: string
        dms: number
        comments: number
        stories: number
        total: number
    }>
    channelDistribution: Array<{
        name: string
        key: string
        count: number
        percent: number
        color: string
    }>
    hourlyCounts: Array<{
        hour: string
        count: number
    }>
    topAutomations: Array<{
        id: string
        name: string
        triggerValue: string
        triggerSource: string
        isActive: boolean
        triggersFired: number
        conversionRate: string
        createdAt: string
    }>
    topKeywords: Array<{
        word: string
        count: number
    }>
    recentActivity: Array<{
        id: string
        content: string
        created_at: string
        sender_username?: string
        conversation?: {
            recipient_username: string
        }
    }>
}

export function AnalyticsDashboard() {
    const { userId, isLoading: isSessionLoading } = useInstagramSession()
    const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchAnalytics = async (selectedRange = range, isManualRefresh = false) => {
        if (!userId) return
        if (isManualRefresh) setRefreshing(true)
        else setLoading(true)

        try {
            const res = await fetch(`/api/dashboard/analytics?userId=${userId}&range=${selectedRange}`)
            const json = await res.json()
            if (res.ok && json && !json.error) {
                setData(json)
                if (isManualRefresh) toast.success("Analytics updated successfully")
            } else {
                toast.error("Failed to load analytics data")
            }
        } catch (err) {
            console.error("Analytics fetch error:", err)
            toast.error("An error occurred while connecting to the server")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchAnalytics(range)
        }
    }, [userId, range])

    const handleExportReport = () => {
        if (!data) return
        const reportContent = {
            range: data.range,
            generatedAt: new Date().toISOString(),
            metrics: data.metrics,
            topAutomations: data.topAutomations,
            topKeywords: data.topKeywords
        }
        const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `insta-p8-analytics-${data.range}-${formatDate(new Date())}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Analytics report exported successfully")
    }

    if (isSessionLoading || (loading && !data)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse font-medium">Fetching analytics and processing insights...</p>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500" dir="ltr">
            {/* Top Bar Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border/60">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-1">
                        <Activity className="w-4 h-4" />
                        <span>Advanced Analytics</span>
                    </div>
                    <h1 className="font-serif-display text-3xl md:text-4xl text-foreground font-bold">
                        Automation & Insights
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track auto-replies performance, conversion rates, and audience growth in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Date Range Selector */}
                    <div className="inline-flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-medium">
                        <button
                            onClick={() => setRange("7d")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                range === "7d"
                                    ? "bg-background text-foreground font-bold shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            7 Days
                        </button>
                        <button
                            onClick={() => setRange("30d")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                range === "30d"
                                    ? "bg-background text-foreground font-bold shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            30 Days
                        </button>
                        <button
                            onClick={() => setRange("90d")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                                range === "90d"
                                    ? "bg-background text-foreground font-bold shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            90 Days
                        </button>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAnalytics(range, true)}
                        disabled={refreshing}
                        className="h-9 px-3 gap-2 text-xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleExportReport}
                        className="h-9 px-3 gap-2 text-xs"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Report</span>
                    </Button>
                </div>
            </div>

            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard
                    title="Total Auto-Replies"
                    value={data?.metrics.totalSent.toLocaleString() || "0"}
                    subtitle={`In the past ${range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}`}
                    badge="+12% growth"
                    icon={<MessageCircle className="w-5 h-5 text-blue-500" />}
                />

                <KpiCard
                    title="Response Rate"
                    value={data?.metrics.responseRate || "0%"}
                    subtitle="Successful trigger execution ratio"
                    badge="Optimal"
                    icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
                />

                <KpiCard
                    title="Audience Reached"
                    value={data?.metrics.totalAudience.toLocaleString() || "0"}
                    subtitle={`${data?.metrics.periodAudience || 0} new users in period`}
                    badge="Active Growth"
                    icon={<Users className="w-5 h-5 text-purple-500" />}
                />

                <KpiCard
                    title="Active Automations"
                    value={`${data?.metrics.activeAutomations || 0} / ${data?.metrics.totalAutomations || 0}`}
                    subtitle="Currently enabled automation rules"
                    badge="Live Now"
                    icon={<Zap className="w-5 h-5 text-amber-500" />}
                />
            </div>

            {/* Main Section: Line Area Chart for Reply Trends */}
            <Card className="p-6 bg-card border-border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-primary" />
                            <span>Auto-Reply Volume Trend</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Daily breakdown of automated replies and messages sent over the selected timeframe.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                            <span className="text-muted-foreground">Total Replies</span>
                        </div>
                    </div>
                </div>

                <div className="h-[320px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.timeSeries || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary, #3B82F6)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--primary, #3B82F6)" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
                            <XAxis
                                dataKey="formattedDate"
                                stroke="var(--muted-foreground, #888888)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="var(--muted-foreground, #888888)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--background, #09090b)",
                                    borderColor: "var(--border, #27272a)",
                                    borderRadius: "0.75rem",
                                    fontSize: "12px",
                                    color: "var(--foreground, #fafafa)"
                                }}
                                formatter={(val: any) => [`${val} replies`, "Volume"]}
                                labelFormatter={(label: string) => `Date: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="var(--primary, #3B82F6)"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Grid 2: Channel Breakdown & Peak Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Channel Distribution */}
                <Card className="p-6 bg-card border-border shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                <PieChartIcon className="w-4 h-4 text-purple-500" />
                                <span>Automation Channel Breakdown</span>
                            </h3>
                            <Badge variant="outline" className="text-[10px] font-mono-ui">
                                {data?.metrics.totalAutomations || 0} Automations
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-6">
                            Percentage distribution of automation rules split by trigger source.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {(data?.channelDistribution || []).map((ch) => (
                            <div key={ch.key} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-foreground flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                                        {ch.name}
                                    </span>
                                    <span className="font-mono-ui text-muted-foreground font-bold">
                                        {ch.count} ({ch.percent}%)
                                    </span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${ch.percent}%`, backgroundColor: ch.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50 text-left">
                        <p className="text-xs text-muted-foreground">
                            Top Performing Trigger: <span className="font-bold text-foreground">Post Comments</span>
                        </p>
                    </div>
                </Card>

                {/* Peak Hours Distribution */}
                <Card className="p-6 bg-card border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span>Peak Engagement Hours</span>
                        </h3>
                        <Badge variant="secondary" className="text-[10px]">24-Hour Cycle</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-6">
                        Distribution of automated responses executed throughout the day to identify active follower hours.
                    </p>

                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.hourlyCounts || []} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.1)" />
                                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--background)",
                                        borderColor: "var(--border)",
                                        borderRadius: "0.5rem",
                                        fontSize: "12px"
                                    }}
                                    formatter={(val: any) => [`${val} triggers`, "Hour"]}
                                />
                                <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Top Automations Table */}
            <Card className="p-6 bg-card border-border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span>Top Performing Automations</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Detailed execution counts and conversion rates per automation rule.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-border/80 text-muted-foreground uppercase font-mono-ui text-[10px]">
                                <th className="py-3 px-4 text-left">Automation Name</th>
                                <th className="py-3 px-4 text-left">Trigger Keyword</th>
                                <th className="py-3 px-4 text-left">Source</th>
                                <th className="py-3 px-4 text-center">Executions</th>
                                <th className="py-3 px-4 text-center">Conversion Rate</th>
                                <th className="py-3 px-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {(data?.topAutomations || []).length > 0 ? (
                                data?.topAutomations.map((auto) => (
                                    <tr key={auto.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-foreground">
                                            {auto.name}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <Badge variant="outline" className="bg-muted font-mono-ui text-[10px]">
                                                {auto.triggerValue}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <Badge variant="secondary" className="text-[10px]">
                                                {auto.triggerSource === "comment" ? "Comment" : auto.triggerSource === "dm" ? "Direct Message" : "Story Mention"}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 px-4 text-center font-bold font-mono-ui text-foreground">
                                            {auto.triggersFired}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="inline-flex items-center gap-1 font-bold text-emerald-500 font-mono-ui">
                                                {auto.conversionRate}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            {auto.isActive ? (
                                                <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px]">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    Paused
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No active automations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Grid 3: Top Keywords & Recent Execution Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Trigger Keywords Cloud */}
                <Card className="p-6 bg-card border-border shadow-sm">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span>Top Trigger Keywords</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mb-5">
                        Most frequently used keywords by followers in comments and messages.
                    </p>

                    <div className="flex flex-wrap gap-2.5">
                        {(data?.topKeywords || []).length > 0 ? (
                            data?.topKeywords.map((kw, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent border border-border hover:border-primary/50 transition-colors"
                                >
                                    <span className="text-xs font-bold text-foreground font-mono-ui">#{kw.word}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                                        {kw.count} rules
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-muted-foreground py-4">No trigger keywords registered yet.</p>
                        )}
                    </div>
                </Card>

                {/* Recent Activity Live Feed */}
                <Card className="p-6 bg-card border-border shadow-sm">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Live Executions Feed</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mb-5">
                        Real-time stream of recent auto-replies sent to followers.
                    </p>

                    <div className="space-y-3">
                        {(data?.recentActivity || []).length > 0 ? (
                            data?.recentActivity.map((msg) => (
                                <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between text-xs mb-0.5">
                                            <span className="font-bold text-foreground">
                                                @{msg.conversation?.recipient_username || "user"}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground font-mono-ui">
                                                {formatDate(new Date(msg.created_at))}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-muted-foreground py-4 text-center">No recent auto-replies found.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

function KpiCard({
    title,
    value,
    subtitle,
    badge,
    icon
}: {
    title: string
    value: string
    subtitle: string
    badge: string
    icon: React.ReactNode
}) {
    return (
        <Card className="p-5 bg-card border-border hover:border-foreground/20 transition-all duration-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-muted border border-border/60">{icon}</div>
                <Badge variant="secondary" className="text-[10px] font-medium bg-muted">
                    {badge}
                </Badge>
            </div>

            <div className="mt-4">
                <p className="text-3xl font-bold font-serif-display text-foreground leading-none">{value}</p>
                <p className="text-xs font-bold text-foreground mt-2">{title}</p>
                <p className="text-[11px] text-muted-foreground mt-1 truncate">{subtitle}</p>
            </div>
        </Card>
    )
}

function formatDate(d: Date): string {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}
