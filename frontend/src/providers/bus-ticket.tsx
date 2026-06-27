"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

export interface BookingData {
  travelType: "roundtrip" | "oneway-go" | "oneway-return" | null
  departureDate: string | null
  returnDate: string | null
  passengers: number
  productCode?: string | null
  ticketCounts?: Record<string, number>
  ticketTypeId?: string | null
  passengerDetails: Array<{
    name: string
    email: string
    phone: string
    ticketType?: string
    documentType?: "dni" | "passport" | "ce"
    documentNumber?: string
    nationality?: "foreign" | "national"
  }>
}

interface BookingContextType {
  booking: BookingData
  setBooking: (data: BookingData) => void
  updateBooking: (partial: Partial<BookingData>) => void
  resetBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

const defaultBooking: BookingData = {
  travelType: null,
  departureDate: null,
  returnDate: null,
  passengers: 1,
  productCode: null,
  ticketTypeId: null,
  ticketCounts: { ADULT: 1, CHILD: 0 },
  passengerDetails: [],
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingData>(defaultBooking)
  const [isClient, setIsClient] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem("booking")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setBooking(parsed)
      } catch (error) {
        console.error("Failed to parse booking data:", error)
      }
    }
  }, [])

  // Save to localStorage whenever booking changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("booking", JSON.stringify(booking))
    }
  }, [booking, isClient])

  const updateBooking = (partial: Partial<BookingData>) => {
    setBooking(prev => ({ ...prev, ...partial }))
  }

  const resetBooking = () => {
    setBooking(defaultBooking)
    if (typeof window !== "undefined") {
      localStorage.removeItem("booking")
    }
  }

  return (
    <BookingContext.Provider value={{ booking, setBooking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider")
  }
  return context
}