'use client'

import { createContext, useCallback, useState } from 'react'

export const AdminDataContext = createContext()

export function AdminDataProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerDashboardRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  return (
    <AdminDataContext.Provider value={{ refreshTrigger, triggerDashboardRefresh }}>
      {children}
    </AdminDataContext.Provider>
  )
}
