import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, Cell, ZAxis } from 'recharts'
import { AlertTriangle, Package, TrendingUp, BarChart3 } from 'lucide-react'
import { turnoverRateTrend, skus } from '@/data/mockData'
import type { SKU } from '@/types'

const abcColor: Record<string, string> = { A: '#F59E0B', B: '#06B6D4', C: '#22C55E' }

const waterLevelData = skus.map(s => ({
  name: s.name,
  currentStock: s.currentStock,
  safetyStock: s.safetyStock,
  reorderPoint: s.reorderPoint,
  maxStock: s.maxStock,
  zone: s.currentStock < s.safetyStock ? 'critical' : s.currentStock < s.reorderPoint ? 'warning' : 'good'
}))

const scatterData = skus.map(s => ({
  name: s.name,
  consumptionFreq: s.consumptionFreq,
  annualValue: s.annualValue,
  stock: s.currentStock,
  abcClass: s.abcClass
}))

const alertSkus = skus.filter(s => s.currentStock < s.safetyStock || s.currentStock > s.maxStock * 0.9)

function getAlertInfo(sku: SKU) {
  if (sku.currentStock < sku.safetyStock) {
    const gap = sku.safetyStock - sku.currentStock
    return { status: 'critical' as const, gap: `-${gap}`, suggest: gap + (sku.reorderPoint - sku.safetyStock) }
  }
  const over = sku.currentStock - Math.floor(sku.maxStock * 0.9)
  return { status: 'warning' as const, gap: `+${over}`, suggest: 0 }
}

export default function Inventory() {
  return (
    <div className="p-6 space-y-4 h-full overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      <h1 className="text-xl font-bold animate-fade-in-up" style={{ color: 'var(--text-primary)' }}>
        库存分析中心
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="card animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h2 className="section-title">周转率趋势</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={turnoverRateTrend}>
              <defs>
                <linearGradient id="gradRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradIndustry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: 'var(--border-color)' }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: 'var(--border-color)' }} domain={[4, 9]} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: '#E2E8F0' }} />
              <Area type="monotone" dataKey="rate" stroke="#06B6D4" fill="url(#gradRate)" strokeWidth={2} name="本企业周转率" />
              <Area type="monotone" dataKey="industry" stroke="#F59E0B" fill="url(#gradIndustry)" strokeWidth={2} name="行业平均" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} style={{ color: 'var(--accent-amber)' }} />
            <h2 className="section-title">安全库存水位</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={waterLevelData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'var(--border-color)' }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={{ stroke: 'var(--border-color)' }} width={90} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: '#E2E8F0' }} />
              <Bar dataKey="safetyStock" fill="#EF4444" opacity={0.35} name="安全库存" stackId="a" />
              <Bar dataKey="reorderPoint" fill="#F59E0B" opacity={0.35} name="再订货点" stackId="a" />
              <Bar dataKey="maxStock" fill="#22C55E" opacity={0.2} name="最大库存" stackId="a" />
              <Bar dataKey="currentStock" name="当前库存">
                {waterLevelData.map((entry, i) => (
                  <Cell key={i} fill={entry.zone === 'critical' ? '#EF4444' : entry.zone === 'warning' ? '#F59E0B' : '#22C55E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card animate-fade-in-up stagger-3">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} style={{ color: 'var(--accent-green)' }} />
            <h2 className="section-title">ABC分类矩阵</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" dataKey="consumptionFreq" name="消耗频率" unit="%" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: 'var(--border-color)' }} domain={[60, 100]} label={{ value: '消耗频率(%)', position: 'bottom', fill: '#94A3B8', fontSize: 11, offset: -2 }} />
              <YAxis type="number" dataKey="annualValue" name="年价值" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: 'var(--border-color)' }} label={{ value: '年价值', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} />
              <ZAxis type="number" dataKey="stock" range={[80, 600]} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, color: '#E2E8F0' }} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} name="SKU">
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={abcColor[entry.abcClass]} fillOpacity={0.8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center text-xs" style={{ color: '#94A3B8' }}>
            <span><span style={{ color: '#F59E0B' }}>●</span> A类</span>
            <span><span style={{ color: '#06B6D4' }}>●</span> B类</span>
            <span><span style={{ color: '#22C55E' }}>●</span> C类</span>
          </div>
        </div>

        <div className="card animate-fade-in-up stagger-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} style={{ color: 'var(--accent-red)' }} />
            <h2 className="section-title">库存预警</h2>
          </div>
          <div className="overflow-auto" style={{ maxHeight: 290 }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#94A3B8', borderBottom: '1px solid var(--border-color)' }}>
                  <th className="text-left py-2 px-2">SKU名称</th>
                  <th className="text-right py-2 px-2">当前库存</th>
                  <th className="text-right py-2 px-2">安全库存</th>
                  <th className="text-right py-2 px-2">缺口/超出</th>
                  <th className="text-right py-2 px-2">建议补货</th>
                  <th className="text-center py-2 px-2">状态</th>
                </tr>
              </thead>
              <tbody>
                {alertSkus.map(sku => {
                  const info = getAlertInfo(sku)
                  return (
                    <tr key={sku.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-[var(--bg-card-hover)]">
                      <td className="py-2 px-2 font-mono">{sku.name}</td>
                      <td className="text-right py-2 px-2 font-mono">{sku.currentStock}</td>
                      <td className="text-right py-2 px-2 font-mono">{sku.safetyStock}</td>
                      <td className="text-right py-2 px-2 font-mono" style={{ color: info.status === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{info.gap}</td>
                      <td className="text-right py-2 px-2 font-mono">{info.suggest || '-'}</td>
                      <td className="text-center py-2 px-2">
                        <span className={`badge ${info.status === 'critical' ? 'badge-critical' : 'badge-warning'}`}>
                          {info.status === 'critical' ? '低于安全线' : '接近上限'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
