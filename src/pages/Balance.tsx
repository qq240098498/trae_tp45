import { useMemo } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend
} from 'recharts'
import { Star, ShieldCheck, Clock, DollarSign } from 'lucide-react'
import { balanceScenarios } from '@/data/mockData'
import type { BalanceScenario } from '@/types'

const scenarioColors = [
  { stroke: '#F59E0B', fill: '#F59E0B' },
  { stroke: '#06B6D4', fill: '#06B6D4' },
  { stroke: '#EF4444', fill: '#EF4444' },
  { stroke: '#22C55E', fill: '#22C55E' },
]

function BalanceRadar() {
  const radarData = useMemo(() => [
    { dimension: '成本', ...Object.fromEntries(balanceScenarios.map((s, i) => [`s${i}`, s.costScore])) },
    { dimension: '时效', ...Object.fromEntries(balanceScenarios.map((s, i) => [`s${i}`, s.timelinessScore])) },
    { dimension: '风险', ...Object.fromEntries(balanceScenarios.map((s, i) => [`s${i}`, s.riskScore])) },
  ], [])

  return (
    <div className="card-static p-4 h-full animate-fade-in-up stagger-1">
      <h3 className="section-title">三维度雷达图</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: 'var(--text-primary)', fontSize: 14 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
          {balanceScenarios.map((s, i) => (
            <Radar
              key={s.id}
              name={s.name}
              dataKey={`s${i}`}
              stroke={scenarioColors[i].stroke}
              fill={scenarioColors[i].fill}
              fillOpacity={0.08}
              strokeWidth={s.isRecommended ? 3 : 1.5}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

function scoreBadge(score: number) {
  if (score >= 80) return 'badge-good'
  if (score >= 65) return 'badge-warning'
  return 'badge-critical'
}

function ComparisonTable() {
  const maxCost = Math.max(...balanceScenarios.map(s => s.costScore))
  const maxTime = Math.max(...balanceScenarios.map(s => s.timelinessScore))
  const maxRisk = Math.max(...balanceScenarios.map(s => s.riskScore))

  return (
    <div className="card-static p-4 h-full animate-fade-in-up stagger-2">
      <h3 className="section-title">方案对比</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--text-muted)' }} className="text-xs border-b" >
              <th className="text-left py-2 px-2 font-medium">方案名称</th>
              <th className="text-center py-2 px-2 font-medium">成本得分</th>
              <th className="text-center py-2 px-2 font-medium">时效得分</th>
              <th className="text-center py-2 px-2 font-medium">风险得分</th>
              <th className="text-center py-2 px-2 font-medium">综合评分</th>
              <th className="text-center py-2 px-2 font-medium">推荐</th>
            </tr>
          </thead>
          <tbody>
            {balanceScenarios.map((s) => (
              <tr
                key={s.id}
                className="border-b transition-colors"
                style={{
                  borderColor: 'var(--border-color)',
                  background: s.isRecommended ? 'rgba(245,158,11,0.06)' : 'transparent'
                }}
              >
                <td className="py-2.5 px-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {s.isRecommended && <Star className="w-3 h-3 inline mr-1" style={{ color: 'var(--accent-amber)' }} />}
                  {s.name}
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`badge ${s.costScore === maxCost ? 'badge-good' : ''}`}>
                    {s.costScore}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`badge ${s.timelinessScore === maxTime ? 'badge-good' : ''}`}>
                    {s.timelinessScore}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`badge ${s.riskScore === maxRisk ? 'badge-good' : ''}`}>
                    {s.riskScore}
                  </span>
                </td>
                <td className="text-center py-2.5 px-2">
                  <span className={`badge ${scoreBadge(s.overallScore)}`}>{s.overallScore}</span>
                </td>
                <td className="text-center py-2.5 px-2">
                  {s.isRecommended && (
                    <Star className="w-4 h-4 mx-auto" style={{ color: 'var(--accent-amber)' }} fill="var(--accent-amber)" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const dimensions = [
  { key: 'cost' as const, label: '成本', score: 80, icon: DollarSign, insight: '当前成本控制良好，主要节省来自批量采购折扣和仓储优化' },
  { key: 'timeliness' as const, label: '时效', score: 82, icon: Clock, insight: '准时交付率需提升，关键瓶颈在生产加工环节，建议增加产线弹性' },
  { key: 'risk' as const, label: '风险', score: 82, icon: ShieldCheck, insight: '整体风险可控，需关注供应商集中度风险和台风季物流影响' },
]

function DimensionCards() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {dimensions.map((dim, i) => {
        const color = dim.score >= 80 ? 'var(--accent-green)' : dim.score >= 65 ? 'var(--accent-amber)' : 'var(--accent-red)'
        return (
          <div key={dim.key} className={`card-static p-4 animate-fade-in-up stagger-${i + 3}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <dim.icon className="w-4 h-4" style={{ color }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{dim.label}</span>
              </div>
              <span className="font-mono text-2xl font-bold" style={{ color }}>{dim.score}</span>
            </div>
            <div className="w-full h-2 rounded-full mb-2" style={{ background: 'var(--bg-primary)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${dim.score}%`, background: color }}
              />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{dim.insight}</p>
          </div>
        )
      })}
    </div>
  )
}

function RecommendationCard() {
  const recommended = balanceScenarios.find(s => s.isRecommended) as BalanceScenario

  const bars = [
    { label: '成本', value: recommended.costScore, color: 'var(--accent-amber)' },
    { label: '时效', value: recommended.timelinessScore, color: 'var(--accent-cyan)' },
    { label: '风险', value: recommended.riskScore, color: 'var(--accent-green)' },
  ]

  return (
    <div
      className="card-static p-5 h-full flex flex-col animate-fade-in-up stagger-6"
      style={{ borderColor: 'var(--accent-amber)', borderWidth: 1 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--accent-amber)' }}>
          推荐方案
        </span>
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{recommended.name}</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{recommended.description}</p>
      <div className="space-y-3 mb-4">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
              <span className="font-mono font-bold" style={{ color: b.color }}>{b.value}</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
              <div className="h-full rounded-full" style={{ width: `${b.value}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>综合评分</span>
        <span className="font-mono text-3xl font-bold" style={{ color: 'var(--accent-amber)' }}>
          {recommended.overallScore}
        </span>
      </div>
      <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
        综合考量成本、时效、风险三维度，推荐方案在保持合理成本水平的同时，显著提升了时效和风险抵御能力。动态安全库存策略可根据需求波动自动调整，多源采购降低供应中断风险，弹性排产保障产能柔性。
      </p>
      <button
        className="w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:brightness-110"
        style={{ background: 'var(--accent-amber)', color: '#0F1419' }}
      >
        确认采纳
      </button>
    </div>
  )
}

export default function Balance() {
  return (
    <div className="p-6 space-y-4 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-xl font-bold animate-fade-in-up" style={{ color: 'var(--text-primary)' }}>
        三维度平衡分析
      </h1>
      <div className="grid grid-cols-5 gap-4" style={{ minHeight: 380 }}>
        <div className="col-span-3">
          <BalanceRadar />
        </div>
        <div className="col-span-2">
          <ComparisonTable />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4" style={{ minHeight: 380 }}>
        <div className="col-span-2">
          <DimensionCards />
        </div>
        <div className="col-span-3">
          <RecommendationCard />
        </div>
      </div>
    </div>
  )
}
