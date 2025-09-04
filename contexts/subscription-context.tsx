"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

interface SubscriptionContextType {
  currentPlan: string
  subscribe: (plan: string) => void
  isSubscribed: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [currentPlan, setCurrentPlan] = useState("Free")

  // Load subscription status from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const savedPlan = localStorage.getItem(`subscription_${user.id}`)
      if (savedPlan) {
        setCurrentPlan(savedPlan)
      }
    }
  }, [user?.id])

  const subscribe = (plan: string) => {
    setCurrentPlan(plan)
    // Save to localStorage for persistence
    if (user?.id) {
      localStorage.setItem(`subscription_${user.id}`, plan)
    }
  }

  const isSubscribed = currentPlan !== "Free"

  return (
    <SubscriptionContext.Provider value={{ currentPlan, subscribe, isSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
