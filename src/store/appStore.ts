import { create } from 'zustand'
import type { AlertEvent, ChainBreakAlert, AlertStatus } from '@/types'
import { alertEvents as initialAlerts, chainBreakAlerts as initialChainBreakAlerts } from '@/data/mockData'

interface AppState {
  sidebarCollapsed: boolean
  selectedAlertFilter: string
  alerts: AlertEvent[]
  chainBreakAlerts: ChainBreakAlert[]
  toggleSidebar: () => void
  setAlertFilter: (filter: string) => void
  dismissAlert: (id: string) => void
  updateChainBreakAlertStatus: (id: string, status: AlertStatus, note?: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedAlertFilter: 'all',
  alerts: initialAlerts,
  chainBreakAlerts: initialChainBreakAlerts,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setAlertFilter: (filter) => set({ selectedAlertFilter: filter }),
  dismissAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  updateChainBreakAlertStatus: (id, status, note) =>
    set((state) => ({
      chainBreakAlerts: state.chainBreakAlerts.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              handledAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              handledNote: note,
            }
          : a
      ),
    })),
}))
