import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'

type Event = { id: string; name: string; date: string; price: number }
type CartItem = { event: Event; qty: number }
type Ctx = {
    items: CartItem[];
    add: (e: Event, qty?: number) => void;
    remove: (id: string) => void;
    clear: () => void;
    total: number
}
const Cart = createContext<Ctx | null>(null)
const KEY = 'ticketly.cart.v1'

export function CartProvider({children}: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    useEffect(() => {
        const raw = localStorage.getItem(KEY);
        if (raw) setItems(JSON.parse(raw))
    }, [])
    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(items))
    }, [items])
    const add = (event: Event, qty = 1) => setItems(p => {
        const i = p.findIndex(x => x.event.id === event.id);
        if (i >= 0) {
            const c = [...p];
            c[i] = {event, qty: c[i].qty + qty};
            return c
        }
        return [...p, {event, qty}]
    })
    const remove = (id: string) => setItems(p => p.filter(x => x.event.id !== id))
    const clear = () => setItems([])
    const total = useMemo(() => items.reduce((s, i) => s + i.event.price * i.qty, 0), [items])
    return <Cart.Provider value={{items, add, remove, clear, total}}>{children}</Cart.Provider>
}

export function useCart() {
    const ctx = useContext(Cart);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx
}