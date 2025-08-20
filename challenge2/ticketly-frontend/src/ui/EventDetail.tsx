import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEvent } from '../api'
import { useCart } from '../state/CartContext'
export default function EventDetail(){
  const { id } = useParams()
  const [event,setEvent]=useState<any|null>(null)
  const [loading,setLoading]=useState(true)
  const [msg,setMsg]=useState<string|null>(null)
  const { add } = useCart()
  useEffect(()=>{ if(!id) return; getEvent(id).then(setEvent).finally(()=>setLoading(false)) },[id])
  if(loading) return <p>Loading...</p>
  if(!event) return <p>Not found</p>
  return (<div style={{display:'grid',gap:8}}>
    <Link to='/'>← back</Link>
    <h2 style={{margin:'8px 0'}}>{event.name}</h2>
    <p><b>Date:</b> {event.date}</p>
    <p><b>Price:</b> ${event.price}</p>
    <button onClick={()=>{ add(event); setMsg('Added to cart')}}>Add to cart</button>
    {msg && <p style={{color:'green'}}>{msg}</p>}
  </div>)
}