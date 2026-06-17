import type {
  Supplier, PurchaseOrder, SKU, ProcurementSuggestion,
  ProductionSchedule, RiskEvent, ChainNode, AlertEvent,
  KPIData, BalanceScenario, SeasonFactor, DeliveryRecord
} from '@/types'

export const suppliers: Supplier[] = [
  { id: 'SUP001', name: '华信钢材', category: '原材料', onTimeRate: 0.92, leadTime: 7, quality: 95, cost: 85 },
  { id: 'SUP002', name: '东方电子', category: '元器件', onTimeRate: 0.88, leadTime: 10, quality: 92, cost: 78 },
  { id: 'SUP003', name: '利达包装', category: '包装材料', onTimeRate: 0.95, leadTime: 5, quality: 90, cost: 92 },
  { id: 'SUP004', name: '恒盛化工', category: '化工原料', onTimeRate: 0.78, leadTime: 14, quality: 88, cost: 70 },
  { id: 'SUP005', name: '精密模具', category: '模具配件', onTimeRate: 0.85, leadTime: 12, quality: 97, cost: 82 },
  { id: 'SUP006', name: '宏达物流', category: '运输服务', onTimeRate: 0.91, leadTime: 3, quality: 88, cost: 90 },
]

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO20240601', supplierId: 'SUP001', supplierName: '华信钢材', status: 'delivered', orderDate: '2024-05-15', expectedDate: '2024-05-22', actualDate: '2024-05-23', items: 5, totalAmount: 128000 },
  { id: 'PO20240602', supplierId: 'SUP002', supplierName: '东方电子', status: 'shipped', orderDate: '2024-06-01', expectedDate: '2024-06-11', items: 12, totalAmount: 85600 },
  { id: 'PO20240603', supplierId: 'SUP004', supplierName: '恒盛化工', status: 'delayed', orderDate: '2024-05-20', expectedDate: '2024-06-03', items: 3, totalAmount: 45000 },
  { id: 'PO20240604', supplierId: 'SUP003', supplierName: '利达包装', status: 'confirmed', orderDate: '2024-06-05', expectedDate: '2024-06-10', items: 8, totalAmount: 32000 },
  { id: 'PO20240605', supplierId: 'SUP005', supplierName: '精密模具', status: 'pending', orderDate: '2024-06-08', expectedDate: '2024-06-20', items: 2, totalAmount: 96000 },
  { id: 'PO20240606', supplierId: 'SUP001', supplierName: '华信钢材', status: 'confirmed', orderDate: '2024-06-10', expectedDate: '2024-06-17', items: 4, totalAmount: 105000 },
]

const monthlyDemandBase = [320, 280, 350, 420, 480, 520, 490, 450, 380, 340, 360, 410]

export const skus: SKU[] = [
  {
    id: 'SKU001', name: '冷轧钢板 2mm', category: '原材料', currentStock: 1200, safetyStock: 500,
    reorderPoint: 800, maxStock: 2000, turnoverRate: 6.8, unitCost: 45, abcClass: 'A',
    monthlyDemand: monthlyDemandBase.map(v => v + Math.floor(Math.random() * 80 - 40)),
    consumptionFreq: 95, annualValue: 560000
  },
  {
    id: 'SKU002', name: 'MCU芯片 STM32', category: '元器件', currentStock: 8500, safetyStock: 3000,
    reorderPoint: 5000, maxStock: 15000, turnoverRate: 8.2, unitCost: 12, abcClass: 'A',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 2.5 + Math.random() * 200 - 100)),
    consumptionFreq: 98, annualValue: 420000
  },
  {
    id: 'SKU003', name: '瓦楞纸箱 50x40', category: '包装材料', currentStock: 15000, safetyStock: 5000,
    reorderPoint: 8000, maxStock: 25000, turnoverRate: 12.5, unitCost: 3, abcClass: 'B',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 8 + Math.random() * 500 - 250)),
    consumptionFreq: 90, annualValue: 180000
  },
  {
    id: 'SKU004', name: '环氧树脂 EP-200', category: '化工原料', currentStock: 380, safetyStock: 400,
    reorderPoint: 600, maxStock: 1500, turnoverRate: 4.1, unitCost: 85, abcClass: 'A',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 0.3 + Math.random() * 30 - 15)),
    consumptionFreq: 85, annualValue: 380000
  },
  {
    id: 'SKU005', name: '注塑模具 A型', category: '模具配件', currentStock: 45, safetyStock: 20,
    reorderPoint: 30, maxStock: 80, turnoverRate: 3.2, unitCost: 280, abcClass: 'A',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 0.05 + Math.random() * 5)),
    consumptionFreq: 72, annualValue: 290000
  },
  {
    id: 'SKU006', name: '不锈钢螺栓 M8', category: '紧固件', currentStock: 25000, safetyStock: 10000,
    reorderPoint: 15000, maxStock: 40000, turnoverRate: 15.3, unitCost: 0.8, abcClass: 'C',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 20 + Math.random() * 2000 - 1000)),
    consumptionFreq: 99, annualValue: 48000
  },
  {
    id: 'SKU007', name: '导热硅脂 TG-50', category: '辅材', currentStock: 220, safetyStock: 150,
    reorderPoint: 200, maxStock: 500, turnoverRate: 7.5, unitCost: 25, abcClass: 'B',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 0.2 + Math.random() * 15)),
    consumptionFreq: 80, annualValue: 96000
  },
  {
    id: 'SKU008', name: '铝合金型材 6063', category: '原材料', currentStock: 680, safetyStock: 300,
    reorderPoint: 500, maxStock: 1200, turnoverRate: 5.6, unitCost: 62, abcClass: 'B',
    monthlyDemand: monthlyDemandBase.map(v => Math.floor(v * 0.4 + Math.random() * 40 - 20)),
    consumptionFreq: 88, annualValue: 150000
  },
]

export const chainNodes: ChainNode[] = [
  { id: 'N1', name: '原材料采购', stage: 'procurement', status: 'warning', healthScore: 72, throughput: 85, utilization: 0.88, waitTime: 3.2, processTime: 7, bottleneckIndex: 1.28 },
  { id: 'N2', name: '来料检验', stage: 'procurement', status: 'normal', healthScore: 88, throughput: 92, utilization: 0.72, waitTime: 0.8, processTime: 1.5, bottleneckIndex: 0.94 },
  { id: 'N3', name: '原料仓储', stage: 'warehouse', status: 'warning', healthScore: 68, throughput: 78, utilization: 0.91, waitTime: 2.5, processTime: 2, bottleneckIndex: 1.25 },
  { id: 'N4', name: '生产加工', stage: 'production', status: 'critical', healthScore: 52, throughput: 65, utilization: 0.96, waitTime: 5.8, processTime: 8, bottleneckIndex: 1.65 },
  { id: 'N5', name: '质量检测', stage: 'production', status: 'normal', healthScore: 85, throughput: 90, utilization: 0.68, waitTime: 1.0, processTime: 2.5, bottleneckIndex: 0.87 },
  { id: 'N6', name: '成品仓储', stage: 'warehouse', status: 'normal', healthScore: 90, throughput: 88, utilization: 0.65, waitTime: 0.5, processTime: 1.5, bottleneckIndex: 0.72 },
  { id: 'N7', name: '物流运输', stage: 'logistics', status: 'warning', healthScore: 70, throughput: 80, utilization: 0.85, waitTime: 2.8, processTime: 3, bottleneckIndex: 1.19 },
  { id: 'N8', name: '客户交付', stage: 'delivery', status: 'normal', healthScore: 92, throughput: 95, utilization: 0.60, waitTime: 0.3, processTime: 1, bottleneckIndex: 0.58 },
]

export const riskEvents: RiskEvent[] = [
  { id: 'R1', nodeId: 'N4', nodeName: '生产加工', type: 'capacity', severity: 'critical', probability: 0.85, impact: 0.92, description: '产线A设备老化，产能利用率达96%，存在宕机风险', stage: 'production' },
  { id: 'R2', nodeId: 'N1', nodeName: '原材料采购', type: 'supply', severity: 'high', probability: 0.65, impact: 0.80, description: '钢材市场供应紧张，上游供应商交期延长', stage: 'procurement' },
  { id: 'R3', nodeId: 'N3', nodeName: '原料仓储', type: 'capacity', severity: 'high', probability: 0.70, impact: 0.75, description: '仓储空间利用率91%，旺季可能溢出', stage: 'procurement' },
  { id: 'R4', nodeId: 'N7', nodeName: '物流运输', type: 'delay', severity: 'medium', probability: 0.55, impact: 0.60, description: '台风季即将到来，可能影响东南沿海物流', stage: 'delivery' },
  { id: 'R5', nodeId: 'N1', nodeName: '原材料采购', type: 'quality', severity: 'medium', probability: 0.40, impact: 0.65, description: '新供应商质量稳定性待验证', stage: 'procurement' },
  { id: 'R6', nodeId: 'N4', nodeName: '生产加工', type: 'delay', severity: 'high', probability: 0.60, impact: 0.85, description: '关键工序依赖单一设备，无备用产线', stage: 'production' },
  { id: 'R7', nodeId: 'N7', nodeName: '物流运输', type: 'logistics', severity: 'low', probability: 0.35, impact: 0.40, description: '末端配送区域部分路段施工中', stage: 'delivery' },
]

export const alertEvents: AlertEvent[] = [
  { id: 'A1', timestamp: '2024-06-17 14:32', level: 'critical', title: '生产产线A设备告警', description: '设备温度异常升高，已触发预警阈值', source: '生产加工', stage: 'production' },
  { id: 'A2', timestamp: '2024-06-17 13:15', level: 'error', title: '恒盛化工交付延误', description: '采购订单PO20240603已延误2天，预计再延迟3天', source: '原材料采购', stage: 'procurement' },
  { id: 'A3', timestamp: '2024-06-17 11:45', level: 'warning', title: '环氧树脂库存低于安全水位', description: '当前库存380，安全库存400，建议立即补货', source: '原料仓储', stage: 'warehouse' },
  { id: 'A4', timestamp: '2024-06-17 10:20', level: 'warning', title: '仓储空间接近上限', description: '原料仓库利用率已达91%，建议安排出库', source: '原料仓储', stage: 'warehouse' },
  { id: 'A5', timestamp: '2024-06-17 09:00', level: 'info', title: '东方电子订单已发货', description: '采购订单PO20240602已从供应商发出，预计6/11到达', source: '原材料采购', stage: 'procurement' },
  { id: 'A6', timestamp: '2024-06-16 16:30', level: 'warning', title: '物流路线调整', description: '因天气原因，东南方向配送路线临时调整', source: '物流运输', stage: 'logistics' },
  { id: 'A7', timestamp: '2024-06-16 14:00', level: 'info', title: '周度库存盘点完成', description: '本周盘点差异率0.3%，在合理范围内', source: '成品仓储', stage: 'warehouse' },
  { id: 'A8', timestamp: '2024-06-16 10:15', level: 'error', title: '生产排期冲突', description: '6月20日A产线同时排了两个订单，需协调', source: '生产加工', stage: 'production' },
]

export const kpiData: KPIData[] = [
  {
    label: '库存周转率', value: 7.8, unit: '次/年', trend: 5.2,
    trendData: [6.5, 6.8, 7.0, 7.2, 7.1, 7.4, 7.6, 7.5, 7.8, 7.9, 7.7, 7.8],
    status: 'good'
  },
  {
    label: '准时交付率', value: 91.5, unit: '%', trend: -2.3,
    trendData: [93, 92.5, 94, 93.8, 92.5, 93.2, 91.8, 92, 91.5, 91.2, 92, 91.5],
    status: 'warning'
  },
  {
    label: '平均采购周期', value: 8.5, unit: '天', trend: 1.2,
    trendData: [7.2, 7.5, 7.8, 8.0, 7.6, 8.2, 8.5, 8.3, 8.8, 8.5, 8.4, 8.5],
    status: 'warning'
  },
  {
    label: '在途物料', value: 156, unit: '批', trend: 12,
    trendData: [120, 125, 130, 128, 135, 140, 138, 145, 148, 150, 155, 156],
    status: 'good'
  },
]

export const procurementSuggestions: ProcurementSuggestion[] = [
  {
    id: 'PS1', skuId: 'SKU004', skuName: '环氧树脂 EP-200', category: '化工原料',
    currentStock: 380, safetyStock: 400, recommendedQty: 600, confidence: 0.92,
    seasonFactor: 1.15, unitCost: 85, totalCost: 51000,
    reasoning: '当前库存低于安全水位，且6-8月为需求旺季（季节因子1.15），建议立即补货600单位',
    historicalAvg: 480, seasonalAdjusted: 552
  },
  {
    id: 'PS2', skuId: 'SKU001', skuName: '冷轧钢板 2mm', category: '原材料',
    currentStock: 1200, safetyStock: 500, recommendedQty: 800, confidence: 0.85,
    seasonFactor: 1.08, unitCost: 45, totalCost: 36000,
    reasoning: '库存高于安全水位但即将进入旺季，考虑提前备货锁定价格，建议采购800单位',
    historicalAvg: 400, seasonalAdjusted: 432
  },
  {
    id: 'PS3', skuId: 'SKU002', skuName: 'MCU芯片 STM32', category: '元器件',
    currentStock: 8500, safetyStock: 3000, recommendedQty: 5000, confidence: 0.88,
    seasonFactor: 1.12, unitCost: 12, totalCost: 60000,
    reasoning: '芯片供应链波动频繁，当前库存虽在安全线以上，但旺季需求增长12%，建议预防性采购',
    historicalAvg: 4200, seasonalAdjusted: 4704
  },
  {
    id: 'PS4', skuId: 'SKU005', skuName: '注塑模具 A型', category: '模具配件',
    currentStock: 45, safetyStock: 20, recommendedQty: 30, confidence: 0.78,
    seasonFactor: 0.95, unitCost: 280, totalCost: 8400,
    reasoning: '当前库存充裕，但模具定制周期长（12天），建议按需少量补货维持安全库存',
    historicalAvg: 25, seasonalAdjusted: 24
  },
  {
    id: 'PS5', skuId: 'SKU008', skuName: '铝合金型材 6063', category: '原材料',
    currentStock: 680, safetyStock: 300, recommendedQty: 400, confidence: 0.82,
    seasonFactor: 1.05, unitCost: 62, totalCost: 24800,
    reasoning: '库存接近再订货点，铝材价格近期小幅上涨，建议适度提前采购',
    historicalAvg: 350, seasonalAdjusted: 368
  },
]

export const productionSchedules: ProductionSchedule[] = [
  { id: 'PS1', line: '产线A', product: '控制器模组 X1', startDate: '2024-06-15', endDate: '2024-06-22', status: 'in_progress', progress: 45, quantity: 500, supplierDependency: 'SUP002' },
  { id: 'PS2', line: '产线A', product: '控制器模组 X2', startDate: '2024-06-22', endDate: '2024-06-28', status: 'planned', progress: 0, quantity: 300, supplierDependency: 'SUP002' },
  { id: 'PS3', line: '产线B', product: '传感器组件 S1', startDate: '2024-06-16', endDate: '2024-06-25', status: 'in_progress', progress: 30, quantity: 800, supplierDependency: 'SUP001' },
  { id: 'PS4', line: '产线B', product: '传感器组件 S2', startDate: '2024-06-25', endDate: '2024-07-02', status: 'planned', progress: 0, quantity: 600 },
  { id: 'PS5', line: '产线C', product: '电源模块 P1', startDate: '2024-06-14', endDate: '2024-06-20', status: 'delayed', progress: 75, quantity: 400, supplierDependency: 'SUP004' },
  { id: 'PS6', line: '产线C', product: '电源模块 P2', startDate: '2024-06-20', endDate: '2024-06-27', status: 'planned', progress: 0, quantity: 350, supplierDependency: 'SUP004' },
]

export const balanceScenarios: BalanceScenario[] = [
  {
    id: 'SC1', name: '保守方案', costScore: 62, timelinessScore: 85, riskScore: 90, overallScore: 78.2,
    description: '增加10%安全库存，选择高可靠性供应商，降低缺货风险但增加仓储成本'
  },
  {
    id: 'SC2', name: '均衡方案', costScore: 78, timelinessScore: 76, riskScore: 75, overallScore: 76.5,
    description: '维持当前库存水平，优化采购批次，平衡成本与时效'
  },
  {
    id: 'SC3', name: '激进方案', costScore: 92, timelinessScore: 58, riskScore: 45, overallScore: 65.1,
    description: 'JIT模式最小化库存，压缩采购周期，追求成本最优但风险较高'
  },
  {
    id: 'SC4', name: '推荐方案', costScore: 80, timelinessScore: 82, riskScore: 82, overallScore: 81.4,
    description: '动态安全库存+多源采购+弹性排产，综合平衡三维度指标', isRecommended: true
  },
]

export const seasonFactors: SeasonFactor[] = [
  { month: '1月', factor: 0.82, demand: 320, isPeak: false },
  { month: '2月', factor: 0.72, demand: 280, isPeak: false },
  { month: '3月', factor: 0.90, demand: 350, isPeak: false },
  { month: '4月', factor: 1.05, demand: 420, isPeak: true },
  { month: '5月', factor: 1.18, demand: 480, isPeak: true },
  { month: '6月', factor: 1.28, demand: 520, isPeak: true },
  { month: '7月', factor: 1.22, demand: 490, isPeak: true },
  { month: '8月', factor: 1.12, demand: 450, isPeak: true },
  { month: '9月', factor: 0.95, demand: 380, isPeak: false },
  { month: '10月', factor: 0.88, demand: 340, isPeak: false },
  { month: '11月', factor: 0.92, demand: 360, isPeak: false },
  { month: '12月', factor: 1.02, demand: 410, isPeak: false },
]

export const deliveryRecords: DeliveryRecord[] = [
  { supplierId: 'SUP001', supplierName: '华信钢材', promisedDate: '2024-06-10', actualDate: '2024-06-11', status: 'delayed', delayDays: 1, orderNo: 'PO-D001' },
  { supplierId: 'SUP002', supplierName: '东方电子', promisedDate: '2024-06-08', actualDate: '2024-06-08', status: 'on_time', delayDays: 0, orderNo: 'PO-D002' },
  { supplierId: 'SUP004', supplierName: '恒盛化工', promisedDate: '2024-06-05', actualDate: null, status: 'pending', delayDays: 0, orderNo: 'PO-D003' },
  { supplierId: 'SUP003', supplierName: '利达包装', promisedDate: '2024-06-12', actualDate: '2024-06-11', status: 'early', delayDays: -1, orderNo: 'PO-D004' },
  { supplierId: 'SUP005', supplierName: '精密模具', promisedDate: '2024-06-15', actualDate: '2024-06-17', status: 'delayed', delayDays: 2, orderNo: 'PO-D005' },
  { supplierId: 'SUP001', supplierName: '华信钢材', promisedDate: '2024-06-20', actualDate: null, status: 'pending', delayDays: 0, orderNo: 'PO-D006' },
  { supplierId: 'SUP006', supplierName: '宏达物流', promisedDate: '2024-06-18', actualDate: null, status: 'pending', delayDays: 0, orderNo: 'PO-D007' },
  { supplierId: 'SUP002', supplierName: '东方电子', promisedDate: '2024-06-22', actualDate: null, status: 'pending', delayDays: 0, orderNo: 'PO-D008' },
]

export const historicalPurchaseData = Array.from({ length: 24 }, (_, i) => {
  const month = i % 12
  const year = i < 12 ? '2022' : '2023'
  const baseDemand = [320, 280, 350, 420, 480, 520, 490, 450, 380, 340, 360, 410]
  return {
    month: `${year}-${String(month + 1).padStart(2, '0')}`,
    actual: baseDemand[month] + Math.floor(Math.random() * 60 - 30),
    forecast: baseDemand[month] + Math.floor(Math.random() * 40 - 20),
  }
})

export const turnoverRateTrend = [
  { month: '2023-07', rate: 6.2, industry: 5.8 },
  { month: '2023-08', rate: 6.5, industry: 5.9 },
  { month: '2023-09', rate: 6.8, industry: 6.0 },
  { month: '2023-10', rate: 6.6, industry: 5.7 },
  { month: '2023-11', rate: 7.0, industry: 6.1 },
  { month: '2023-12', rate: 7.2, industry: 6.2 },
  { month: '2024-01', rate: 7.1, industry: 6.0 },
  { month: '2024-02', rate: 7.4, industry: 6.3 },
  { month: '2024-03', rate: 7.6, industry: 6.4 },
  { month: '2024-04', rate: 7.5, industry: 6.2 },
  { month: '2024-05', rate: 7.8, industry: 6.5 },
  { month: '2024-06', rate: 7.8, industry: 6.6 },
]

export const riskHeatmapData = [
  { stage: '原材料采购', delay: 0.65, quality: 0.40, capacity: 0.30, supply: 0.70, logistics: 0.20 },
  { stage: '生产加工', delay: 0.60, quality: 0.25, capacity: 0.85, supply: 0.35, logistics: 0.15 },
  { stage: '仓储管理', delay: 0.20, quality: 0.15, capacity: 0.70, supply: 0.10, logistics: 0.25 },
  { stage: '物流运输', delay: 0.55, quality: 0.10, capacity: 0.45, supply: 0.20, logistics: 0.60 },
  { stage: '客户交付', delay: 0.30, quality: 0.10, capacity: 0.20, supply: 0.15, logistics: 0.35 },
]

export const costSimData = Array.from({ length: 20 }, (_, i) => {
  const qty = 200 + i * 50
  const unitCost = 85 - (i * 0.5)
  const storageCost = qty * 0.08
  const purchaseCost = qty * unitCost
  const shortageRisk = Math.max(0, (600 - qty) * 120)
  return { qty, totalCost: purchaseCost + storageCost + shortageRisk, purchaseCost, storageCost, shortageRisk }
})
