export type Event = { id: string; name: string; date: string; price: number }
export type OrderItem = { eventId: string; qty: number }
export type Order = { id: string; status: string }