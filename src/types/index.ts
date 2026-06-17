export interface Supplier {
  id: string
  name: string
  category: string
  onTimeRate: number
  leadTime: number
  quality: number
  cost: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  supplierName: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'delayed'
  orderDate: string
  expectedDate: string
  actualDate?: string
  items: number
  totalAmount: number
}

export interface SKU {
  id: string
  name: string
  category: string
  currentStock: number
  safetyStock: number
  reorderPoint: number
  maxStock: number
  turnoverRate: number
  unitCost: number
  abcClass: 'A' | 'B' | 'C'
  monthlyDemand: number[]
  consumptionFreq: number
  annualValue: number
}

export interface InventoryRecord {
  id: string
  skuId: string
  quantity: number
  recordDate: string
  abcClass: string
}

export interface ProcurementSuggestion {
  id: string
  skuId: string
  skuName: string
  category: string
  currentStock: number
  safetyStock: number
  recommendedQty: number
  confidence: number
  seasonFactor: number
  unitCost: number
  totalCost: number
  reasoning: string
  historicalAvg: number
  seasonalAdjusted: number
}

export interface ProductionSchedule {
  id: string
  line: string
  product: string
  startDate: string
  endDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'delayed'
  progress: number
  quantity: number
  supplierDependency?: string
}

export interface RiskEvent {
  id: string
  nodeId: string
  nodeName: string
  type: 'delay' | 'quality' | 'capacity' | 'supply' | 'logistics'
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: number
  impact: number
  description: string
  stage: 'procurement' | 'production' | 'delivery'
}

export interface ChainNode {
  id: string
  name: string
  stage: 'procurement' | 'production' | 'warehouse' | 'logistics' | 'delivery'
  status: 'normal' | 'warning' | 'critical'
  healthScore: number
  throughput: number
  utilization: number
  waitTime: number
  processTime: number
  bottleneckIndex: number
}

export interface AlertEvent {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  title: string
  description: string
  source: string
  stage: string
}

export interface KPIData {
  label: string
  value: number
  unit: string
  trend: number
  trendData: number[]
  status: 'good' | 'warning' | 'critical'
}

export interface BalanceScenario {
  id: string
  name: string
  costScore: number
  timelinessScore: number
  riskScore: number
  overallScore: number
  description: string
  isRecommended?: boolean
}

export interface SeasonFactor {
  month: string
  factor: number
  demand: number
  isPeak: boolean
}

export interface DeliveryRecord {
  supplierId: string
  supplierName: string
  promisedDate: string
  actualDate: string | null
  status: 'on_time' | 'delayed' | 'early' | 'pending'
  delayDays: number
  orderNo: string
}

export interface RegionEvent {
  id: string
  type: 'natural_disaster' | 'policy_change' | 'logistics_disruption'
  severity: 'low' | 'medium' | 'high' | 'critical'
  region: string
  description: string
  startDate: string
  expectedEndDate: string
  affectedSuppliers: string[]
}

export interface AffectedMaterial {
  skuId: string
  skuName: string
  category: string
  currentStock: number
  dailyConsumption: number
  stockoutDays: number
  impactLevel: 'high' | 'medium' | 'low'
}

export interface SupplierRiskMonitor {
  supplierId: string
  supplierName: string
  category: string
  onTimeRate: number
  onTimeRateTrend: number
  capacityUtilization: number
  capacityTrend: number
  riskIndex: number
  riskLevel: 'normal' | 'warning' | 'critical'
  region: string
  regionRisk: 'normal' | 'warning' | 'critical'
  lastUpdated: string
}

export interface ChainBreakAlert {
  id: string
  timestamp: string
  supplierId: string
  supplierName: string
  riskIndex: number
  threshold: number
  riskLevel: 'warning' | 'critical'
  triggerType: 'on_time_rate' | 'capacity_utilization' | 'region_event'
  triggerDescription: string
  affectedMaterials: AffectedMaterial[]
  estimatedStockoutWindow: {
    start: string
    end: string
  }
  recommendedActions: string[]
  isAcknowledged: boolean
}
