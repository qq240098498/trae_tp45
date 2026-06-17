import { useMemo, useState, useEffect } from 'react'
import {
  Area, AreaChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart3, Clock, Timer,
  Truck, AlertTriangle, AlertCircle, Info, X, ArrowRight
} from 'lucide-react'
import { kpiData, chainNodes } from '@/data/mockData'
import type { KPIData } from '@/types'
import { useAppStore } from '@/store/appStore'

const kpiIcons = [BarChart3, Clock, Timer, Truck]

const trendSuffix = (unit: string) =>
  unit === '天' || unit === '批' ? unit : '%'

function KPICard({ data, index }: { data: KPIData; index: number }) {
  const Icon = kpiIcons[index]
  const isUp = data.trend > 0
  const color = data.status === 'good' ? 'var(--accent-green)' : 'var(--accent-red)'
  const TrendIcon = isUp ? TrendingUp : TrendingDown
  const sparkData = data.trendData.map((v) => ({ v }))

  return (
    <div className={`card animate-fade-in-up stagger-${index + 1} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{data.label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{data.value}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{data.unit}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon className="w-3 h-3" style={{ color }} />
            <span className="text-xs font-mono" style={{ color }}>
              {isUp ? '+' : ''}{data.trend}{trendSuffix(data.unit)}
            </span>
          </div>
        </div>
        <div className="w-20 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <span className={`badge badge-${data.status}`}>
        {data.status === 'good' ? '正常' : data.status === 'warning' ? '警告' : '严重'}
      </span>
    </div>
  )
}

function ChainFlow() {
  const scoreColor = (s: number) =>
    s >= 80 ? 'var(--accent-green)' : s >= 60 ? 'var(--accent-amber)' : 'var(--accent-red)'

  return (
    <div className="card-static p-4 animate-fade-in-up stagger-5">
      <h3 className="section-title mb-4">供应链流转</h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {chainNodes.map((node, i) => (
          <div key={node.id} className="flex items-center flex-shrink-0">
            <div
              className="flex flex-col items-center min-w-[80px] p-2 rounded-lg"
              style={{ background: 'var(--bg-primary)' }}
            >
              <span className={`status-dot status-${node.status} mb-1`} />
              <span className="text-xs mb-1" style={{ color: 'var(--text-primary)' }}>{node.name}</span>
              <span className="font-mono text-xs font-bold" style={{ color: scoreColor(node.healthScore) }}>
                {node.healthScore}
              </span>
            </div>
            {i < chainNodes.length - 1 && (
              <ArrowRight className="w-4 h-4 mx-1 flex-shrink-0" style={{ color: 'var(--border-color)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertStream() {
  const { selectedAlertFilter, setAlertFilter, alerts, dismissAlert } = useAppStore()

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'critical', label: '严重' },
    { key: 'warning', label: '警告' },
    { key: 'info', label: '信息' },
  ]

  const filtered = useMemo(() => {
    if (selectedAlertFilter === 'all') return alerts
    if (selectedAlertFilter === 'critical')
      return alerts.filter((a) => a.level === 'critical' || a.level === 'error')
    return alerts.filter((a) => a.level === selectedAlertFilter)
  }, [selectedAlertFilter, alerts])

  const levelIcon = (level: string) => {
    if (level === 'critical' || level === 'error')
      return <AlertTriangle className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
    if (level === 'warning')
      return <AlertCircle className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} />
    return <Info className="w-4 h-4" style={{ color: 'var(--accent-cyan)' }} />
  }

  return (
    <div className="card-static p-4 flex flex-col h-full animate-fade-in-up stagger-8">
      <h3 className="section-title mb-3">告警流</h3>
      <div className="flex gap-2 mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setAlertFilter(t.key)}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{
              color: selectedAlertFilter === t.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
              background: selectedAlertFilter === t.key ? 'rgba(6,182,212,0.1)' : 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-2 p-2 rounded"
            style={{ background: 'var(--bg-primary)' }}
          >
            <div className="mt-0.5">{levelIcon(alert.level)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {alert.title}
                </span>
                <button onClick={() => dismissAlert(alert.id)} className="ml-1 flex-shrink-0">
                  <X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                {alert.description}
              </p>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                {alert.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HealthRadar() {
  const radarData = useMemo(() => {
    const groups: Record<string, number[]> = {}
    chainNodes.forEach((n) => {
      if (!groups[n.stage]) groups[n.stage] = []
      groups[n.stage].push(n.healthScore)
    })
    const labels: Record<string, string> = {
      procurement: '采购',
      production: '生产',
      warehouse: '仓储',
      logistics: '物流',
    }
    return Object.entries(groups).map(([stage, scores]) => ({
      subject: labels[stage],
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
  }, [])

  return (
    <div className="card-static p-4 h-full animate-fade-in-up stagger-6">
      <h3 className="section-title mb-2">健康雷达</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          <Radar
            name="健康度"
            dataKey="score"
            stroke="var(--accent-cyan)"
            fill="var(--accent-cyan)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Dashboard() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const dateStr = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`

  return (
    <div className="p-6 space-y-4 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between animate-fade-in-up">
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>全局监控仪表盘</h1>
        <span className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <KPICard key={kpi.label} data={kpi} index={i} />
        ))}
      </div>

      <ChainFlow />

      <div className="grid grid-cols-5 gap-4" style={{ minHeight: 320 }}>
        <div className="col-span-2">
          <HealthRadar />
        </div>
        <div className="col-span-3">
          <AlertStream />
        </div>
      </div>
    </div>
  )
}
