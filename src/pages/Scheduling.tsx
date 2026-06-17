import { useMemo } from 'react'
import { Truck, CalendarDays, AlertTriangle, Lightbulb, Clock, Zap } from 'lucide-react'
import { deliveryRecords, productionSchedules } from '@/data/mockData'
import type { ProductionSchedule, DeliveryRecord } from '@/types'

const BASE_DATE = new Date('2024-06-14')
const TOTAL_DAYS = 22
const DAY_WIDTH = 40

function dayOffset(dateStr: string) {
  const d = new Date(dateStr)
  return Math.round((d.getTime() - BASE_DATE.getTime()) / 86400000)
}

const statusBadge: Record<DeliveryRecord['status'], string> = {
  on_time: 'badge-good',
  delayed: 'badge-critical',
  early: 'badge-info',
  pending: 'badge-warning',
}
const statusLabel: Record<DeliveryRecord['status'], string> = {
  on_time: '准时',
  delayed: '延误',
  early: '提前',
  pending: '待交付',
}

const barColor: Record<ProductionSchedule['status'], string> = {
  in_progress: 'var(--accent-cyan)',
  planned: 'var(--accent-amber)',
  completed: 'var(--accent-green)',
  delayed: 'var(--accent-red)',
}

function DeliveryTimeline() {
  return (
    <div className="card-static p-4 animate-fade-in-up stagger-1">
      <h3 className="section-title"><Truck className="w-4 h-4" /> 供应商交付时间线</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {deliveryRecords.map((r, i) => (
          <div
            key={r.orderNo}
            className={`flex-shrink-0 min-w-[180px] p-3 rounded-lg border animate-fade-in-up stagger-${i + 1}`}
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
          >
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{r.supplierName}</div>
            <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span>承诺日期</span>
                <span className="font-mono">{r.promisedDate.slice(5)}</span>
              </div>
              <div className="flex justify-between">
                <span>实际日期</span>
                <span className="font-mono">{r.actualDate ? r.actualDate.slice(5) : '待交付'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`badge ${statusBadge[r.status]}`}>{statusLabel[r.status]}</span>
              {r.delayDays > 0 && (
                <span className="text-xs font-mono" style={{ color: 'var(--accent-red)' }}>+{r.delayDays}天</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GanttChart() {
  const lines = useMemo(() => {
    const map = new Map<string, ProductionSchedule[]>()
    productionSchedules.forEach((s) => {
      if (!map.has(s.line)) map.set(s.line, [])
      map.get(s.line)!.push(s)
    })
    return Array.from(map.entries())
  }, [])

  const conflicts = useMemo(() => {
    const result: string[] = []
    lines.forEach(([, orders]) => {
      for (let i = 0; i < orders.length; i++) {
        for (let j = i + 1; j < orders.length; j++) {
          const a = orders[i], b = orders[j]
          const aStart = dayOffset(a.startDate), aEnd = dayOffset(a.endDate)
          const bStart = dayOffset(b.startDate), bEnd = dayOffset(b.endDate)
          if (aStart < bEnd && bStart < aEnd) {
            result.push(a.id, b.id)
          }
        }
      }
    })
    return new Set(result)
  }, [lines])

  const axisDays = Array.from({ length: TOTAL_DAYS }, (_, i) => i)

  return (
    <div className="card-static p-4 animate-fade-in-up stagger-3">
      <h3 className="section-title"><CalendarDays className="w-4 h-4" /> 生产排程甘特图</h3>
      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: 100 + TOTAL_DAYS * DAY_WIDTH }}>
          <div className="flex" style={{ paddingLeft: 100 }}>
            {axisDays.map((d) => (
              <div
                key={d}
                className="text-xs font-mono text-center border-l"
                style={{ width: DAY_WIDTH, borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
              >
                {d % 3 === 0 ? `6/${14 + d}` : ''}
              </div>
            ))}
          </div>
          {lines.map(([line, orders]) => (
            <div key={line} className="flex items-center" style={{ height: 52 }}>
              <div
                className="text-xs font-medium flex-shrink-0 text-right pr-3"
                style={{ width: 100, color: 'var(--text-secondary)' }}
              >
                {line}
              </div>
              <div className="relative" style={{ width: TOTAL_DAYS * DAY_WIDTH, height: 40 }}>
                {axisDays.map((d) => (
                  <div
                    key={d}
                    className="absolute top-0 h-full border-l"
                    style={{ left: d * DAY_WIDTH, borderColor: 'rgba(42,51,82,0.4)' }}
                  />
                ))}
                {orders.map((o) => {
                  const start = dayOffset(o.startDate)
                  const end = dayOffset(o.endDate)
                  const left = start * DAY_WIDTH
                  const width = Math.max((end - start) * DAY_WIDTH, DAY_WIDTH)
                  const isConflict = conflicts.has(o.id)
                  return (
                    <div
                      key={o.id}
                      className="absolute top-1 rounded flex items-center justify-center gap-1 overflow-hidden text-xs font-medium"
                      style={{
                        left,
                        width,
                        height: 32,
                        background: barColor[o.status],
                        opacity: o.status === 'planned' ? 0.5 : 0.85,
                        border: isConflict ? '2px solid var(--accent-red)' : 'none',
                        color: '#fff',
                      }}
                    >
                      <span className="truncate">{o.product}</span>
                      <span className="font-mono flex-shrink-0">{o.progress}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mt-3">
        {[
          { label: '进行中', color: 'var(--accent-cyan)' },
          { label: '计划中', color: 'var(--accent-amber)' },
          { label: '已完成', color: 'var(--accent-green)' },
          { label: '延误', color: 'var(--accent-red)' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-3 h-3 rounded-sm" style={{ background: l.color, opacity: 0.8 }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

const conflictData = [
  {
    severity: 'critical' as const,
    desc: '产线C电源模块P1延误，依赖恒盛化工(SUP004)交付，预计影响3天',
    line: '产线C',
    action: '联系供应商加急或启用备选供应商',
  },
  {
    severity: 'high' as const,
    desc: '产线A控制器模组X2排期紧接X1，若X1延期将产生连锁影响',
    line: '产线A',
    action: '在X1与X2间预留1天缓冲',
  },
  {
    severity: 'critical' as const,
    desc: '产线C电源模块P2依赖恒盛化工原料，当前该供应商已延误',
    line: '产线C',
    action: '将P2排期延后3天等待原料到达',
  },
]

const sevBadge: Record<string, string> = { critical: 'badge-critical', high: 'badge-warning', medium: 'badge-info' }
const sevLabel: Record<string, string> = { critical: '严重', high: '高', medium: '中' }

function ConflictPanel() {
  return (
    <div className="card-static p-4 animate-fade-in-up stagger-5 h-full">
      <h3 className="section-title"><AlertTriangle className="w-4 h-4" /> 冲突检测</h3>
      <div className="space-y-3">
        {conflictData.map((c, i) => (
          <div
            key={i}
            className="p-3 rounded-lg"
            style={{ background: 'var(--bg-primary)', borderLeft: `3px solid ${c.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)'}` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge ${sevBadge[c.severity]}`}>{sevLabel[c.severity]}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{c.line}</span>
            </div>
            <p className="text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-cyan)' }}>
              <Zap className="w-3 h-3" />
              <span>{c.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const suggestions = [
  {
    title: '调整产线C排期',
    desc: '将P2排期延后3天，等待原料到达',
    cost: '+2.1万',
    time: '+3天',
    costPositive: true,
    timePositive: true,
  },
  {
    title: '启用备选供应商',
    desc: '对恒盛化工的关键物料启用备选供应商鑫达化工',
    cost: '+1.5万',
    time: '-2天',
    costPositive: true,
    timePositive: false,
  },
  {
    title: '加班赶工产线A',
    desc: '增加周末加班赶工控制器模组X1',
    cost: '+0.8万',
    time: '-1天',
    costPositive: true,
    timePositive: false,
  },
]

function SuggestionCards() {
  return (
    <div className="card-static p-4 animate-fade-in-up stagger-6 h-full">
      <h3 className="section-title"><Lightbulb className="w-4 h-4" /> 协调建议</h3>
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="p-3 rounded-lg"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
          >
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{s.title}</div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-xs font-mono">
                <span style={{ color: s.costPositive ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  成本: {s.cost}
                </span>
                <span style={{ color: s.timePositive ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  时效: {s.time}
                </span>
              </div>
              <button
                className="text-xs px-3 py-1 rounded-md font-medium transition-colors"
                style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)' }}
              >
                采纳
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Scheduling() {
  return (
    <div className="p-6 space-y-4 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center gap-2 animate-fade-in-up">
        <Clock className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} />
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>排程协调中心</h1>
      </div>

      <DeliveryTimeline />

      <GanttChart />

      <div className="grid grid-cols-2 gap-4">
        <ConflictPanel />
        <SuggestionCards />
      </div>
    </div>
  )
}
