export type TicketType = {
  id: string
  name: string
  popular: boolean
  prices: {
    adult: {
      foreign: number
      national: number
    }
    child: {
      foreign: number
      national: number
    }
  }
}