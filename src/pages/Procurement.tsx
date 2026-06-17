import { useState, useMemo } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, LineChart
} from 'recharts'
import { ShoppingCart, TrendingUp, Calendar, Calculator } from 'lucide-react'
import { historicalPurchaseData, seasonFactors, procurementSuggestions, costSimData } from '@/data/mockData'
import type { ProcurementSuggestion, SeasonFactor } from '@/types'

const movingAvg = (data: number[], window = 3) =>
  data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - Math.floor(window / 2)), i + Math.ceil(window / 2))
    return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length)
  })

const trendData = (() => {
  const d = historicalPurchaseData
  const ma = movingAvg(d.map(v => v.actual))
  return d.map((v, i) => ({ ...v, movingAvg: ma[i] }))
})()

function TrendChart() {
  return (
    <div className="card-static animate-fade-in-up stagger-1">
      <h3 className="section-title"><TrendingUp className="w-4 h-4" />历史采购趋势</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#1E2538', border: '1px solid #2A3352', borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="actual" name="实际采购量" fill="rgba(245,158,11,0.5)" radius={[2, 2, 0, 0]} />
          <Line type="monotone" dataKey="forecast" name="预测量" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="movingAvg" name="3月均线" stroke="var(--accent-green)" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

function SeasonChart() {
  return (
    <div className="card-static animate-fade-in-up stagger-2">
      <h3 className="section-title"><Calendar className="w-4 h-4" />季节因子分析</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={seasonFactors}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} domain={[0.5, 1.5]} />
          <Tooltip contentStyle={{ background: '#1E2538', border: '1px solid #2A3352', borderRadius: 8, fontSize: 12 }} />
          <ReferenceLine y={1} stroke="var(--accent-red)" strokeDasharray="4 4" label={{ value: '基准线', position: 'right', fill: 'var(--accent-red)', fontSize: 10 }} />
          <Bar dataKey="factor" name="季节因子" radius={[4, 4, 0, 0]}>
            {seasonFactors.map((s: SeasonFactor) => (
              <rect key={s.month} fill={s.isPeak ? 'var(--accent-amber)' : 'var(--accent-cyan)'} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-amber)' }}>
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--accent-amber)' }} />旺季
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent-cyan)' }}>
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--accent-cyan)' }} />淡季
        </span>
      </div>
    </div>
  )
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 0.9 ? 'var(--accent-green)' : value >= 0.8 ? 'var(--accent-amber)' : 'var(--accent-red)'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-primary)' }}>
        <div className="h-full rounded-full" style={{ width: `${value * 100}%`, background: color }} />
      </div>
      <span className="font-mono text-xs w-10 text-right" style={{ color }}>{(value * 100).toFixed(0)}%</span>
    </div>
  )
}

function SuggestionTable() {
  return (
    <div className="card-static animate-fade-in-up stagger-3 overflow-auto">
      <h3 className="section-title"><ShoppingCart className="w-4 h-4" />采购推荐清单</h3>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ color: 'var(--text-muted)' }}>
            <th className="text-left py-2 px-2">物料名称</th>
            <th className="text-right py-2 px-2">当前库存</th>
            <th className="text-right py-2 px-2">安全库存</th>
            <th className="text-right py-2 px-2">推荐采购量</th>
            <th className="py-2 px-2 w-28">置信度</th>
            <th className="text-right py-2 px-2">季节因子</th>
            <th className="text-right py-2 px-2">总成本</th>
            <th className="text-left py-2 px-2">推荐理由</th>
          </tr>
        </thead>
        <tbody>
          {procurementSuggestions.map((s: ProcurementSuggestion) => (
            <tr key={s.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
              <td className="py-2 px-2 font-medium" style={{ color: 'var(--text-primary)' }}>{s.skuName}</td>
              <td className="text-right py-2 px-2 font-mono" style={{ color: s.currentStock < s.safetyStock ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {s.currentStock}
              </td>
              <td className="text-right py-2 px-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{s.safetyStock}</td>
              <td className="text-right py-2 px-2 font-mono font-bold" style={{ color: 'var(--accent-amber)' }}>{s.recommendedQty}</td>
              <td className="py-2 px-2"><ConfidenceBar value={s.confidence} /></td>
              <td className="text-right py-2 px-2 font-mono" style={{ color: s.seasonFactor > 1 ? 'var(--accent-amber)' : 'var(--accent-cyan)' }}>
                {s.seasonFactor.toFixed(2)}
              </td>
              <td className="text-right py-2 px-2 font-mono" style={{ color: 'var(--text-primary)' }}>¥{s.totalCost.toLocaleString()}</td>
              <td className="py-2 px-2 max-w-[200px] truncate" style={{ color: 'var(--text-muted)' }}>{s.reasoning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CostSimulator() {
  const [qty, setQty] = useState(600)
  const selected = useMemo(() => {
    const closest = costSimData.reduce((prev, cur) =>
      Math.abs(cur.qty - qty) < Math.abs(prev.qty - qty) ? cur : prev
    )
    return closest
  }, [qty])

  return (
    <div className="card-static animate-fade-in-up stagger-5">
      <h3 className="section-title"><Calculator className="w-4 h-4" />成本模拟器</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={costSimData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="qty" tick={{ fontSize: 10 }} label={{ value: '采购量', position: 'insideBottom', offset: -2, fill: 'var(--text-muted)', fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#1E2538', border: '1px solid #2A3352', borderRadius: 8, fontSize: 12 }} />
          <Line type="monotone" dataKey="purchaseCost" name="采购成本" stroke="var(--accent-amber)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="storageCost" name="仓储成本" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="shortageRisk" name="缺货风险" stroke="var(--accent-red)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="totalCost" name="总成本" stroke="var(--accent-green)" strokeWidth={2.5} dot={false} />
          <ReferenceLine x={selected.qty} stroke="var(--text-muted)" strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>调节采购量</span>
            <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent-amber)' }}>{selected.qty}</span>
          </div>
          <input
            type="range" min={200} max={1150} step={50} value={selected.qty}
            onChange={e => setQty(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: 'var(--border-color)', accentColor: 'var(--accent-amber)' }}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs min-w-[260px] p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
          <span style={{ color: 'var(--text-muted)' }}>采购成本</span>
          <span className="font-mono text-right" style={{ color: 'var(--accent-amber)' }}>¥{selected.purchaseCost.toLocaleString()}</span>
          <span style={{ color: 'var(--text-muted)' }}>仓储成本</span>
          <span className="font-mono text-right" style={{ color: 'var(--accent-cyan)' }}>¥{selected.storageCost.toLocaleString()}</span>
          <span style={{ color: 'var(--text-muted)' }}>缺货风险成本</span>
          <span className="font-mono text-right" style={{ color: 'var(--accent-red)' }}>¥{selected.shortageRisk.toLocaleString()}</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>总成本</span>
          <span className="font-mono text-right font-bold" style={{ color: 'var(--accent-green)' }}>¥{selected.totalCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default function Procurement() {
  return (
    <div className="p-6 space-y-4 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-xl font-bold animate-fade-in-up" style={{ color: 'var(--text-primary)' }}>
        智能采购建议
      </h1>
      <TrendChart />
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2"><SeasonChart /></div>
        <div className="col-span-3"><SuggestionTable /></div>
      </div>
      <CostSimulator />
    </div>
  )
}
