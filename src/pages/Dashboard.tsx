import { useMemo, useState, useEffect } from 'react'
import {
  Area, AreaChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, BarChart3, Clock, Timer,
  Truck, AlertTriangle, AlertCircle, Info, X, ArrowRight,
  Database, RefreshCw, Calculator, Archive
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

      <DataSourcePanel />
    </div>
  )
}
