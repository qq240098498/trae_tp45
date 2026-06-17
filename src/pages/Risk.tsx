import { chainNodes, riskEvents, riskHeatmapData } from '@/data/mockData'
import type { ChainNode, RiskEvent } from '@/types'

function getNodeColor(node: ChainNode) {
  if (node.bottleneckIndex > 1.2) return 'var(--accent-red)'
  if (node.bottleneckIndex > 1.0) return 'var(--accent-amber)'
  return 'var(--accent-green)'
}

function getNodeSize(node: ChainNode) {
  return 24 + node.bottleneckIndex * 12
}

function getSeverityBadge(severity: RiskEvent['severity']) {
  const map = { low: 'badge-good', medium: 'badge-info', high: 'badge-warning', critical: 'badge-critical' }
  const label = { low: '低', medium: '中', high: '高', critical: '严重' }
  return { cls: map[severity], label: label[severity] }
}

function getHeatColor(val: number) {
  if (val >= 0.7) return 'var(--accent-red)'
  if (val >= 0.4) return 'var(--accent-amber)'
  return 'var(--accent-green)'
}

function getHeatBg(val: number) {
  if (val >= 0.7) return 'rgba(239,68,68,0.2)'
  if (val >= 0.4) return 'rgba(245,158,11,0.15)'
  return 'rgba(34,197,94,0.12)'
}

const delayRisks = riskEvents.filter(e => e.type === 'delay' || e.probability >= 0.55)

const heatmapColumns = [
  { key: 'delay', label: '延误' },
  { key: 'quality', label: '质量' },
  { key: 'capacity', label: '产能' },
  { key: 'supply', label: '供应' },
  { key: 'logistics', label: '物流' },
] as const

const alertRules = [
  { name: '库存低于安全水位', condition: '当前库存 < 安全库存', action: '自动触发采购建议', enabled: true },
  { name: '供应商交付延误 > 2天', condition: '实际交期 - 承诺交期 > 2', action: '升级告警', enabled: true },
  { name: '产能利用率 > 90%', condition: '利用率 > 0.90', action: '产能预警', enabled: true },
  { name: '物流路线异常', condition: '路线偏离/延误检测', action: '自动切换备选路线', enabled: true },
]

function ChainDiagram() {
  const svgW = 900
  const svgH = 120
  const padX = 60
  const gap = (svgW - padX * 2) / (chainNodes.length - 1)
  const cy = svgH / 2

  return (
    <div className="card-static animate-fade-in-up stagger-1">
      <div className="section-title">
        <span className="status-dot" style={{ background: 'var(--accent-cyan)' }} />
        供应链瓶颈流向
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[700px]" style={{ maxHeight: 140 }}>
          {chainNodes.map((node, i) => {
            if (i === 0) return null
            const prev = chainNodes[i - 1]
            const x1 = padX + (i - 1) * gap
            const x2 = padX + i * gap
            const severity = Math.max(node.bottleneckIndex, prev.bottleneckIndex)
            const strokeW = 1.5 + (severity - 0.5) * 3
            const color = severity > 1.2 ? 'var(--accent-red)' : severity > 1.0 ? 'var(--accent-amber)' : 'var(--border-color)'
            return (
              <line key={`line-${i}`} x1={x1} y1={cy} x2={x2} y2={cy}
                stroke={color} strokeWidth={strokeW} strokeOpacity={0.6} />
            )
          })}
          {chainNodes.map((node, i) => {
            const cx = padX + i * gap
            const r = getNodeSize(node) / 2
            const color = getNodeColor(node)
            return (
              <g key={node.id}>
                {node.bottleneckIndex > 1.2 && (
                  <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.4}>
                    <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} />
                <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={11} fontFamily="JetBrains Mono, monospace" fontWeight={600}>
                  {node.bottleneckIndex.toFixed(2)}
                </text>
                <text x={cx} y={cy + r + 18} textAnchor="middle" fill="var(--text-secondary)" fontSize={11}>
                  {node.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function DelayRiskTable() {
  return (
    <div className="card-static animate-fade-in-up stagger-2">
      <div className="section-title">
        <span className="status-dot status-warning" />
        延误风险评估
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ borderColor: 'var(--border-color)' }}>
              <th className="pb-3 pr-4 font-medium" style={{ color: 'var(--text-muted)' }}>节点名称</th>
              <th className="pb-3 pr-4 font-medium" style={{ color: 'var(--text-muted)' }}>延误概率</th>
              <th className="pb-3 pr-4 font-medium" style={{ color: 'var(--text-muted)' }}>影响范围</th>
              <th className="pb-3 pr-4 font-medium" style={{ color: 'var(--text-muted)' }}>风险等级</th>
              <th className="pb-3 font-medium" style={{ color: 'var(--text-muted)' }}>风险描述</th>
            </tr>
          </thead>
          <tbody>
            {delayRisks.map(evt => {
              const sev = getSeverityBadge(evt.severity)
              return (
                <tr key={evt.id} className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="py-3 pr-4" style={{ color: 'var(--text-primary)' }}>{evt.nodeName}</td>
                  <td className="py-3 pr-4 font-mono" style={{ color: evt.probability >= 0.7 ? 'var(--accent-red)' : evt.probability >= 0.5 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                    {(evt.probability * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 pr-4 font-mono" style={{ color: evt.impact >= 0.8 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    {(evt.impact * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 pr-4"><span className={`badge ${sev.cls}`}>{sev.label}</span></td>
                  <td className="py-3" style={{ color: 'var(--text-secondary)' }}>{evt.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RiskHeatmap() {
  return (
    <div className="card-static animate-fade-in-up stagger-3">
      <div className="section-title">
        <span className="status-dot" style={{ background: 'var(--accent-amber)' }} />
        风险热力图
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="pb-3 pr-3 text-left font-medium" style={{ color: 'var(--text-muted)' }}>阶段</th>
            {heatmapColumns.map(col => (
              <th key={col.key} className="pb-3 px-2 text-center font-medium" style={{ color: 'var(--text-muted)' }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {riskHeatmapData.map(row => (
            <tr key={row.stage}>
              <td className="py-2 pr-3" style={{ color: 'var(--text-primary)' }}>{row.stage}</td>
              {heatmapColumns.map(col => {
                const val = row[col.key]
                return (
                  <td key={col.key} className="py-2 px-2 text-center">
                    <div className="rounded-md py-1.5 font-mono text-xs font-medium"
                      style={{ background: getHeatBg(val), color: getHeatColor(val) }}>
                      {(val * 100).toFixed(0)}%
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AlertRuleCards() {
  return (
    <div className="animate-fade-in-up stagger-4">
      <div className="section-title">
        <span className="status-dot status-critical" />
        预警规则
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertRules.map((rule, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{rule.name}</span>
              <span className="badge badge-good">已启用</span>
            </div>
            <div className="mb-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>触发条件：</span>
              <span className="text-xs font-mono" style={{ color: 'var(--accent-cyan)' }}>{rule.condition}</span>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>执行动作：</span>
              <span className="text-xs" style={{ color: 'var(--accent-amber)' }}>{rule.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Risk() {
  return (
    <div className="p-6 space-y-4 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-xl font-bold animate-fade-in-up" style={{ color: 'var(--text-primary)' }}>
        风险与瓶颈识别
      </h1>
      <ChainDiagram />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DelayRiskTable />
        <RiskHeatmap />
      </div>
      <AlertRuleCards />
    </div>
  )
}
