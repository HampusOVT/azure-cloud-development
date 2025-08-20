import {useEffect, useState} from 'react'
import {getOrder} from '../api'

const ORDERS_KEY = 'ticketly.orders.v1'
export default function Orders() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const ids: string[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
        if (ids.length === 0) {
            setLoading(false);
            return
        }
        Promise.all(ids.map(id => getOrder(id).catch(() => ({
            id,
            status: 'Unknown'
        })))).then(setOrders).finally(() => setLoading(false))
    }, [])
    if (loading) return <p>Loading...</p>
    if (orders.length === 0) return <p>No recent orders yet.</p>
    return (<div><h2>My Orders</h2>
        <div style={{display: 'grid', gap: 8}}>{orders.map(o => (
            <div key={o.id} style={{border: '1px solid #eee', padding: 12, borderRadius: 8}}>
                <div><b>Order ID:</b> {o.id}</div>
                <div><b>Status:</b> {o.status}</div>
            </div>))}</div>
    </div>)
}