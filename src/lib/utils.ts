import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
  AlternativeSupplier, Supplier, RecommendationScores,
  AlternativeSupplierRecommendation
} from '@/types'
import { alternativeSuppliers, suppliers } from '@/data/mockData'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function calculateQualificationMatch(
  alt: AlternativeSupplier,
  atRiskSupplier: Supplier
): number {
  let score = 0
  score += (alt.quality / 100) * 30
  score += (alt.certification.length / 5) * 20
  score += Math.min(alt.capacity / 50000, 1) * 20
  score += alt.hasEmergencyResponse ? 15 : 5
  score += Math.min(alt.cooperationYears / 10, 1) * 15
  return Math.round(score)
}

function calculateDeliveryPerformance(
  alt: AlternativeSupplier,
  atRiskSupplier: Supplier
): number {
  let score = 0
  score += alt.onTimeRate * 35
  score += Math.max(0, 1 - alt.averageDelayDays / 5) * 25
  score += Math.min(alt.historicalDeliveryCount / 500, 1) * 20
  score += Math.max(0, 1 - Math.abs(alt.leadTime - atRiskSupplier.leadTime) / 14) * 20
  return Math.round(score)
}

function calculatePriceCompetitiveness(
  alt: AlternativeSupplier,
  atRiskSupplier: Supplier
): number {
  const currentSupplier = suppliers.find(s => s.id === atRiskSupplier.id)
  const basePrice = currentSupplier ?
    (currentSupplier.cost / 100) * alt.pricePerUnit * 1.1 : alt.pricePerUnit

  let score = 0
  const priceRatio = basePrice / alt.pricePerUnit
  score += Math.min(priceRatio, 1.2) * 40
  score += (alt.cost / 100) * 30
  score += Math.max(0, 1 - alt.minimumOrderQty / 10000) * 20
  score += Math.max(0, 1 - Math.abs(alt.pricePerUnit - basePrice) / basePrice) * 10
  return Math.round(Math.min(score, 100))
}

function calculateSwitchingCost(
  alt: AlternativeSupplier,
  atRiskSupplier: Supplier
): number {
  let score = 100
  score -= Math.abs(alt.leadTime - atRiskSupplier.leadTime) * 3
  score -= alt.minimumOrderQty / 1000 * 2
  score -= alt.hasEmergencyResponse ? 0 : 10
  score -= Math.min(alt.cooperationYears, 5) * 5
  score += (alt.quality - atRiskSupplier.quality) * 0.5
  return Math.round(Math.max(0, Math.min(score, 100)))
}

function calculateOverallScore(scores: RecommendationScores): number {
  const weights = {
    qualificationMatch: 0.30,
    deliveryPerformance: 0.35,
    priceCompetitiveness: 0.20,
    switchingCost: 0.15
  }
  return Math.round(
    scores.qualificationMatch * weights.qualificationMatch +
    scores.deliveryPerformance * weights.deliveryPerformance +
    scores.priceCompetitiveness * weights.priceCompetitiveness +
    scores.switchingCost * weights.switchingCost
  )
}

function generateSwitchingPhases(
  alt: AlternativeSupplier,
  urgency: 'high' | 'medium' | 'low'
): Array<{ phase: string; duration: number; description: string }> {
  const urgencyMultiplier = urgency === 'high' ? 0.5 : urgency === 'medium' ? 0.75 : 1
  const phases = [
    {
      phase: '资质审核',
      duration: Math.round(3 * urgencyMultiplier),
      description: '审核供应商资质认证、质量体系文件、过往合作记录'
    },
    {
      phase: '样品测试',
      duration: Math.round(7 * urgencyMultiplier),
      description: '寄送样品进行质量检测、工艺验证、小批量试产'
    },
    {
      phase: '合同谈判',
      duration: Math.round(5 * urgencyMultiplier),
      description: '商务条款谈判、价格确认、服务水平协议签署'
    },
    {
      phase: '系统对接',
      duration: Math.round(3 * urgencyMultiplier),
      description: 'ERP系统供应商录入、物料编码映射、采购流程配置'
    },
    {
      phase: '首批交付',
      duration: alt.leadTime,
      description: '首单采购下达、生产跟踪、到货检验、入库验收'
    }
  ]
  return phases
}

function estimateCostIncrease(
  alt: AlternativeSupplier,
  atRiskSupplier: Supplier
): number {
  const currentSupplier = suppliers.find(s => s.id === atRiskSupplier.id)
  if (!currentSupplier) return 0
  const currentPrice = (currentSupplier.cost / 100) * alt.pricePerUnit * 1.1
  const priceDiff = (alt.pricePerUnit - currentPrice) / currentPrice
  return Math.round(priceDiff * 100)
}

function generateRiskMitigation(
  alt: AlternativeSupplier,
  scores: RecommendationScores
): string[] {
  const mitigations: string[] = []
  if (scores.deliveryPerformance < 80) {
    mitigations.push('建议设置10%安全库存缓冲交付波动')
  }
  if (scores.priceCompetitiveness < 75) {
    mitigations.push('建议锁定6个月采购价格以规避涨价风险')
  }
  if (scores.qualificationMatch < 85) {
    mitigations.push('建议增加来料检验抽检比例至30%')
  }
  if (scores.switchingCost < 70) {
    mitigations.push('建议与原供应商保持30%订单量平稳过渡')
  }
  if (alt.hasEmergencyResponse) {
    mitigations.push('供应商具备应急响应能力，可应对突发订单')
  }
  if (alt.cooperationYears >= 5) {
    mitigations.push('合作历史较长，信任基础较好')
  }
  if (mitigations.length === 0) {
    mitigations.push('各维度评分优秀，可按正常流程切换')
  }
  return mitigations
}

export function generateAlternativeRecommendations(
  atRiskSupplier: Supplier,
  riskIndex: number,
  onTimeRate?: number,
  consecutiveDelays?: number,
  alertId?: string
): AlternativeSupplierRecommendation | null {
  const matchingAlternatives = alternativeSuppliers.filter(
    alt => alt.category === atRiskSupplier.category
  )
  if (matchingAlternatives.length === 0) return null

  const urgency = riskIndex >= 85 ? 'high' : riskIndex >= 70 ? 'medium' : 'low'

  const triggerReason = [
    riskIndex >= 70 && `风险评分${riskIndex}分（阈值70分）`,
    onTimeRate !== undefined && onTimeRate < 0.85 && `准时交付率${(onTimeRate * 100).toFixed(0)}%（低于85%）`,
    consecutiveDelays !== undefined && consecutiveDelays >= 2 && `连续${consecutiveDelays}次交付延迟`
  ].filter(Boolean).join(' + ')

  const scored = matchingAlternatives.map(alt => {
    const qualificationMatch = calculateQualificationMatch(alt, atRiskSupplier)
    const deliveryPerformance = calculateDeliveryPerformance(alt, atRiskSupplier)
    const priceCompetitiveness = calculatePriceCompetitiveness(alt, atRiskSupplier)
    const switchingCost = calculateSwitchingCost(alt, atRiskSupplier)
    const overallScore = calculateOverallScore({
      qualificationMatch, deliveryPerformance, priceCompetitiveness,
      switchingCost, overallScore: 0
    })

    const switchingPhases = generateSwitchingPhases(alt, urgency)
    const estimatedSwitchingDays = switchingPhases.reduce((sum, p) => sum + p.duration, 0)
    const estimatedCostIncrease = estimateCostIncrease(alt, atRiskSupplier)
    const riskMitigation = generateRiskMitigation(alt, {
      qualificationMatch, deliveryPerformance, priceCompetitiveness,
      switchingCost, overallScore
    })

    return {
      supplier: alt,
      scores: {
        qualificationMatch,
        deliveryPerformance,
        priceCompetitiveness,
        switchingCost,
        overallScore
      },
      estimatedSwitchingDays,
      switchingPhases,
      estimatedCostIncrease,
      riskMitigation
    }
  })

  scored.sort((a, b) => b.scores.overallScore - a.scores.overallScore)

  return {
    id: `REC-${alertId || Date.now()}`,
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-'),
    atRiskSupplierId: atRiskSupplier.id,
    atRiskSupplierName: atRiskSupplier.name,
    triggerReason,
    triggerDetails: {
      riskIndex,
      onTimeRate,
      consecutiveDelays
    },
    recommendations: scored.slice(0, 3).map((item, index) => ({
      rank: index + 1,
      ...item
    }))
  }
}

