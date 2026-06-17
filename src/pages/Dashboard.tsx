import { useMemo, useState, useEffect } from 'react'
import {
  Area, AreaChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import type { LucideIcon } from 'lucide-react'
import {
  TrendingUp, TrendingDown, BarChart3, Clock, Timer,
  Truck, AlertTriangle, AlertCircle, Info, X, ArrowRight,
  Database, RefreshCw, Calculator, Archive,
  Factory, MapPin, CalendarDays, ShieldAlert,
  Gauge, AlertOctagon, Zap, Package, ChevronDown, ChevronUp,
  Flame, FileText, Users, Eye, CheckCheck, CircleSlash2
} from 'lucide-react'
import {
  kpiData, chainNodes, supplierRiskMonitors,
  regionEvents
} from '@/data/mockData'
import type {
  KPIData, RegionEvent, ChainBreakAlert,
  AffectedMaterial, AlertStatus
} from '@/types'
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
    <div className="card-static p-4 flex flex-col h-full animate-fade-in-up stagger-10">
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
    <div className="card-static p-4 h-full animate-fade-in-up stagger-9">
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

function DataSourcePanel() {
  const dataSources = [
    {
      icon: Database,
      label: '数据采集范围',
      content: '覆盖 6 家核心供应商、3 条主要产线、8 种 SKU 的全链路数据',
      accent: 'var(--accent-cyan)',
    },
    {
      icon: Archive,
      label: '历史数据窗口',
      content: '基于 2022年6月 - 2024年6月 共 24 个月的历史交易与库存数据',
      accent: 'var(--accent-amber)',
    },
    {
      icon: Calculator,
      label: 'KPI 计算公式',
      content: '周转率 = 年度销售成本 / 平均库存；准时交付率 = 准时交付单数 / 总交付单数 × 100%',
      accent: 'var(--accent-green)',
    },
    {
      icon: RefreshCw,
      label: '数据更新频率',
      content: '实时数据每分钟刷新，KPI 趋势按日汇总，季节性因子按月校准',
      accent: 'var(--accent-blue)',
    },
  ]

  const statItems = [
    { name: '供应商总数', value: '6', unit: '家' },
    { name: 'SKU 品类数', value: '8', unit: '类' },
    { name: '链路监测节点', value: '8', unit: '个' },
    { name: '风险规则数', value: '4', unit: '条' },
    { name: '采购订单样本', value: '6', unit: '单' },
    { name: '排程计划数', value: '6', unit: '条' },
  ]

  return (
    <div className="card-static animate-fade-in-up stagger-7">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">
          <Info className="w-4 h-4" />
          数据统计来源说明
        </h3>
        <span className="badge badge-info">演示数据模式</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {dataSources.map((item, i) => (
          <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-4 h-4" style={{ color: item.accent }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {item.label}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {item.content}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Database className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          当前数据集统计
        </span>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {statItems.map((item, i) => (
          <div key={i} className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
            <div className="font-mono text-lg font-bold" style={{ color: 'var(--accent-amber)' }}>
              {item.value}
              <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>
                {item.unit}
              </span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <span className="font-medium" style={{ color: 'var(--accent-cyan)' }}>说明：</span>
          当前系统运行于演示模式，所有数据均为基于真实业务场景构建的模拟数据，用于展示供应链优化系统的分析能力与决策建议。
          接入实际业务系统时，可通过配置 ERP/WMS/MES 等数据源接口实现真实数据同步，数据源模块位于{' '}
          <code className="font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-amber)' }}>
            src/data/mockData.ts
          </code>
          ，推荐算法位于{' '}
          <code className="font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-amber)' }}>
            src/lib/utils.ts
          </code>
          。
        </p>
      </div>
    </div>
  )
}

function SupplierRiskPanel() {
  const getRiskColor = (level: string) => {
    if (level === 'critical') return 'var(--accent-red)'
    if (level === 'warning') return 'var(--accent-amber)'
    return 'var(--accent-green)'
  }

  const getProgressColor = (val: number, invert = false) => {
    const effective = invert ? 1 - val : val
    if (effective >= 0.85) return 'var(--accent-red)'
    if (effective >= 0.70) return 'var(--accent-amber)'
    return 'var(--accent-green)'
  }

  return (
    <div className="card-static p-4 animate-fade-in-up stagger-7 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">
          <Factory className="w-4 h-4" />
          供应商风险监控
        </h3>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <RefreshCw className="w-3 h-3" />
          实时更新
        </div>
      </div>
      <div className="space-y-3">
        {supplierRiskMonitors.map((s) => (
          <div key={s.supplierId} className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${s.riskLevel}`} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.supplierName}</span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)' }}>
                  {s.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5" style={{ color: getRiskColor(s.riskLevel) }} />
                <span className="font-mono text-sm font-bold" style={{ color: getRiskColor(s.riskLevel) }}>
                  {s.riskIndex}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>准时交付率</span>
                  <span className="text-xs font-mono" style={{ color: getProgressColor(s.onTimeRate, true) }}>
                    {(s.onTimeRate * 100).toFixed(0)}%
                    {s.onTimeRateTrend !== 0 && (
                      <span className="ml-1" style={{ color: s.onTimeRateTrend < 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                        {s.onTimeRateTrend > 0 ? '+' : ''}{s.onTimeRateTrend}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.onTimeRate * 100}%`, background: getProgressColor(s.onTimeRate, true) }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>产能利用率</span>
                  <span className="text-xs font-mono" style={{ color: getProgressColor(s.capacityUtilization) }}>
                    {(s.capacityUtilization * 100).toFixed(0)}%
                    {s.capacityTrend !== 0 && (
                      <span className="ml-1" style={{ color: s.capacityTrend > 3 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                        {s.capacityTrend > 0 ? '+' : ''}{s.capacityTrend}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.capacityUtilization * 100}%`, background: getProgressColor(s.capacityUtilization) }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <MapPin className="w-3 h-3" />
                <span>{s.region}</span>
                <span
                  className={`status-dot ml-1 status-${s.regionRisk}`}
                  style={{ width: 6, height: 6 }}
                />
              </div>
              <span className="font-mono" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                {s.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegionEventPanel() {
  const eventTypeMap: Record<RegionEvent['type'], { label: string; icon: LucideIcon; color: string }> = {
    natural_disaster: { label: '自然灾害', icon: Flame, color: 'var(--accent-red)' },
    policy_change: { label: '政策变化', icon: FileText, color: 'var(--accent-amber)' },
    logistics_disruption: { label: '物流中断', icon: Truck, color: 'var(--accent-blue)' },
  }

  const severityBadge = (s: RegionEvent['severity']) => {
    const map = { low: 'badge-good', medium: 'badge-info', high: 'badge-warning', critical: 'badge-critical' }
    const label = { low: '低', medium: '中', high: '高', critical: '严重' }
    return { cls: map[s], label: label[s] }
  }

  return (
    <div className="card-static p-4 animate-fade-in-up stagger-8 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">
          <MapPin className="w-4 h-4" />
          区域事件监控
        </h3>
        <span className="badge badge-critical">{regionEvents.filter(r => r.severity === 'critical' || r.severity === 'high').length} 项紧急</span>
      </div>
      <div className="space-y-3">
        {regionEvents.map((evt) => {
          const type = eventTypeMap[evt.type]
          const Icon = type.icon
          const sev = severityBadge(evt.severity)
          return (
            <div key={evt.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="flex items-start gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${type.color}20` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: type.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{evt.region}</span>
                    <span className={`badge ${sev.cls}`}>{sev.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: type.color }}>{type.label}</span>
                </div>
              </div>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {evt.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <CalendarDays className="w-3 h-3" />
                  <span>{evt.startDate} ~ {evt.expectedEndDate}</span>
                </div>
                <div className="flex items-center gap-1" style={{ color: 'var(--accent-cyan)' }}>
                  <Users className="w-3 h-3" />
                  <span>影响 {evt.affectedSuppliers.length} 家供应商</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChainBreakAlertCard({ alert }: { alert: ChainBreakAlert }) {
  const [expanded, setExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const { updateChainBreakAlertStatus } = useAppStore()

  const riskColor = alert.riskLevel === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)'
  const triggerLabel: Record<ChainBreakAlert['triggerType'], string> = {
    on_time_rate: '准时交付率',
    capacity_utilization: '产能利用率',
    region_event: '区域事件',
  }

  const statusConfig: Record<AlertStatus, { label: string; badge: string; icon: LucideIcon; color: string }> = {
    pending: { label: '待处理', badge: 'badge-warning', icon: AlertCircle, color: 'var(--accent-amber)' },
    acknowledged: { label: '已知晓', badge: 'badge-info', icon: Eye, color: 'var(--accent-cyan)' },
    resolved: { label: '已处理', badge: 'badge-good', icon: CheckCheck, color: 'var(--accent-green)' },
    false_alarm: { label: '误报', badge: 'badge-info', icon: CircleSlash2, color: 'var(--text-muted)' },
  }

  const impactColor = (level: AffectedMaterial['impactLevel']) => {
    if (level === 'high') return 'var(--accent-red)'
    if (level === 'medium') return 'var(--accent-amber)'
    return 'var(--accent-green)'
  }

  const handleStatusChange = (e: React.MouseEvent, status: AlertStatus) => {
    e.stopPropagation()
    updateChainBreakAlertStatus(alert.id, status)
    setShowActions(false)
  }

  const currentStatus = statusConfig[alert.status]
  const StatusIcon = currentStatus.icon

  return (
    <div
      className="rounded-lg border overflow-hidden transition-all"
      style={{
        background: 'var(--bg-primary)',
        borderColor: alert.status === 'resolved' || alert.status === 'false_alarm'
          ? 'var(--border-color)'
          : alert.riskLevel === 'critical' ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.3)',
        opacity: alert.status === 'false_alarm' ? 0.6 : 1,
      }}
    >
      <div
        className="p-3 cursor-pointer transition-colors"
        style={{
          background: alert.status === 'resolved' || alert.status === 'false_alarm'
            ? 'transparent'
            : alert.riskLevel === 'critical' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.04)'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 mb-2">
          {alert.riskLevel === 'critical' ? (
            <AlertOctagon className="w-4 h-4 flex-shrink-0" style={{ color: riskColor }} />
          ) : (
            <ShieldAlert className="w-4 h-4 flex-shrink-0" style={{ color: riskColor }} />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{alert.supplierName}</span>
              <span className={`badge ${alert.riskLevel === 'critical' ? 'badge-critical' : 'badge-warning'}`}>
                {alert.riskLevel === 'critical' ? '严重告警' : '风险预警'}
              </span>
              <span className={`badge ${currentStatus.badge}`}>
                <StatusIcon className="w-3 h-3 inline mr-0.5" />
                {currentStatus.label}
              </span>
              {alert.handledAt && (
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  @ {alert.handledAt}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="font-mono text-sm font-bold" style={{ color: riskColor }}>
                风险指数 {alert.riskIndex}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                阈值 {alert.threshold}
              </div>
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowActions(!showActions)}
                className="px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>操作</span>
                {showActions ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {showActions && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-lg border shadow-lg z-10 overflow-hidden"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', minWidth: 140 }}
                >
                  {(['acknowledged', 'resolved', 'false_alarm', 'pending'] as AlertStatus[]).map((status) => {
                    if (status === alert.status) return null
                    const cfg = statusConfig[status]
                    const Icon = cfg.icon
                    return (
                      <button
                        key={status}
                        onClick={(e) => handleStatusChange(e, status)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                        style={{
                          color: 'var(--text-secondary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-secondary)'
                          e.currentTarget.style.color = cfg.color
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = 'var(--text-secondary)'
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>标记为{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {expanded ? (
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs mb-1">
          <Zap className="w-3 h-3" style={{ color: riskColor }} />
          <span style={{ color: 'var(--text-muted)' }}>触发：</span>
          <span style={{ color: 'var(--text-secondary)' }}>{triggerLabel[alert.triggerType]}</span>
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <span style={{ color: 'var(--text-secondary)' }}>{alert.triggerDescription}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" style={{ color: 'var(--accent-cyan)' }} />
            <span style={{ color: 'var(--text-muted)' }}>影响物料：</span>
            <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{alert.affectedMaterials.length} 项</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" style={{ color: 'var(--accent-amber)' }} />
            <span style={{ color: 'var(--text-muted)' }}>预计断供：</span>
            <span className="font-mono" style={{ color: 'var(--accent-amber)' }}>
              {alert.estimatedStockoutWindow.start} ~ {alert.estimatedStockoutWindow.end}
            </span>
          </div>
          <div className="flex-1" />
          <span className="font-mono" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{alert.timestamp}</span>
        </div>
      </div>

      {expanded && (
        <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }} onClick={() => setShowActions(false)}>
          <div className="mb-3">
            <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Package className="w-3.5 h-3.5" />
              受影响物料清单
            </div>
            <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'var(--bg-card)' }}>
                    <th className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>物料名称</th>
                    <th className="text-left px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>分类</th>
                    <th className="text-right px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>当前库存</th>
                    <th className="text-right px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>日消耗</th>
                    <th className="text-right px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>可支持天数</th>
                    <th className="text-center px-3 py-2 font-medium" style={{ color: 'var(--text-muted)' }}>影响等级</th>
                  </tr>
                </thead>
                <tbody>
                  {alert.affectedMaterials.map((m) => (
                    <tr key={m.skuId} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>{m.skuName}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>{m.category}</td>
                      <td className="px-3 py-2 text-right font-mono" style={{ color: 'var(--text-primary)' }}>{m.currentStock}</td>
                      <td className="px-3 py-2 text-right font-mono" style={{ color: 'var(--text-secondary)' }}>{m.dailyConsumption}</td>
                      <td className="px-3 py-2 text-right font-mono" style={{ color: m.stockoutDays <= 25 ? 'var(--accent-red)' : m.stockoutDays <= 35 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                        {m.stockoutDays} 天
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className="inline-block px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: `${impactColor(m.impactLevel)}20`,
                            color: impactColor(m.impactLevel),
                          }}
                        >
                          {m.impactLevel === 'high' ? '高' : m.impactLevel === 'medium' ? '中' : '低'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--accent-amber)' }} />
              推荐应对措施
            </div>
            <div className="space-y-2">
              {alert.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded" style={{ background: 'var(--bg-secondary)' }}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(245,158,11,0.15)' }}
                  >
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent-amber)' }}>{i + 1}</span>
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ChainBreakAlertPanel() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'pending' | 'acknowledged' | 'resolved' | 'false_alarm'>('all')
  const { chainBreakAlerts } = useAppStore()

  const filtered = useMemo(() => {
    if (filter === 'all') return chainBreakAlerts
    if (filter === 'critical') return chainBreakAlerts.filter(a => a.riskLevel === 'critical')
    if (filter === 'warning') return chainBreakAlerts.filter(a => a.riskLevel === 'warning')
    return chainBreakAlerts.filter(a => a.status === filter)
  }, [filter, chainBreakAlerts])

  const pendingCount = chainBreakAlerts.filter(a => a.status === 'pending').length
  const ackCount = chainBreakAlerts.filter(a => a.status === 'acknowledged').length
  const resolvedCount = chainBreakAlerts.filter(a => a.status === 'resolved').length
  const falseAlarmCount = chainBreakAlerts.filter(a => a.status === 'false_alarm').length

  const tabs = [
    { key: 'all', label: `全部 ${chainBreakAlerts.length}` },
    { key: 'pending', label: `待处理 ${pendingCount}`, badge: 'badge-warning' },
    { key: 'acknowledged', label: `已知晓 ${ackCount}`, badge: 'badge-info' },
    { key: 'resolved', label: `已处理 ${resolvedCount}`, badge: 'badge-good' },
    { key: 'false_alarm', label: `误报 ${falseAlarmCount}`, badge: 'badge-info' },
  ] as const

  return (
    <div className="card-static p-4 flex flex-col animate-fade-in-up stagger-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">
          <AlertOctagon className="w-4 h-4" style={{ color: 'var(--accent-red)' }} />
          断链预警告警
          <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            实时监控供应商准时率、产能利用率与区域突发事件
          </span>
        </h3>
        <div className="flex items-center gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1"
              style={{
                color: filter === t.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
                background: filter === t.key ? 'rgba(6,182,212,0.1)' : 'transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>
            当前筛选条件下无告警记录
          </div>
        ) : (
          filtered.map((alert) => (
            <ChainBreakAlertCard key={alert.id} alert={alert} />
          ))
        )}
      </div>
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

      <ChainBreakAlertPanel />

      <div className="grid grid-cols-5 gap-4" style={{ minHeight: 360 }}>
        <div className="col-span-1">
          <SupplierRiskPanel />
        </div>
        <div className="col-span-1">
          <RegionEventPanel />
        </div>
        <div className="col-span-1">
          <HealthRadar />
        </div>
        <div className="col-span-2">
          <AlertStream />
        </div>
      </div>

      <DataSourcePanel />
    </div>
  )
}
