import { create } from 'zustand'
import type { AlertEvent } from '@/types'
import { alertEvents as initialAlerts } from '@/data/mockData'

interface AppState {
  sidebarCollapsed: boolean
  selectedAlertFilter: string
  alerts: AlertEvent[]
  toggleSidebar: () => void
  setAlertFilter: (filter: string) => void
  dismissAlert: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedAlertFilter: 'all',
  alerts: initialAlerts,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setAlertFilter: (filter) => set({ selectedAlertFilter: filter }),
  dismissAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}))
