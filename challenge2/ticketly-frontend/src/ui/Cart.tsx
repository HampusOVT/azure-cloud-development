import { useState } from 'react'
import { createOrder } from '../api'
import { useCart } from '../state/CartContext'
const ORDERS_KEY='ticketly.orders.v1'
export default function Cart(){
  const { items, remove, clear, total } = useCart()
  const [msg,setMsg]=useState<string|null>(null)
  const [loading,setLoading]=useState(false)
  const empty = items.length===0
  async function checkout(){
    setLoading(true)
    try{
      const payload = items.map(i=>({eventId:i.event.id, qty:i.qty}))
      const res = await createOrder(payload)
      const prev = JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')
      localStorage.setItem(ORDERS_KEY, JSON.stringify([res.orderId,...prev]))
      setMsg(`Order ${res.orderId} created!`)
      clear()
    }catch(e:any){ setMsg(e.message||'Checkout failed') } finally{ setLoading(false) }
  }
  return (<div>
    <h2>Cart</h2>
    {empty && <p>Your cart is empty.</p>}
    {!empty && <div>
      {items.map(it=> (<div key={it.event.id} style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid #eee'}}>
        <div><b>{it.event.name}</b> × {it.qty}</div>
        <div>${it.event.price*it.qty} <button onClick={()=>remove(it.event.id)} style={{marginLeft:8}}>remove</button></div>
      </div>))}
      <p style={{textAlign:'right'}}><b>Total:</b> ${total}</p>
      <button disabled={loading} onClick={checkout}>{loading ? 'Processing...' : 'Checkout'}</button>
      <button disabled={loading} onClick={clear} style={{marginLeft:8}}>Clear</button>
      {msg && <p style={{color:'green'}}>{msg}</p>}
    </div>}
  </div>)
}