import { Link } from 'react-router-dom'
import { useCart } from '../../state/CartContext'
export default function Navbar(){
  const { items } = useCart(); const count = items.reduce((s,i)=>s+i.qty,0)
  return (<header style={{display:'flex',gap:16,alignItems:'center',marginBottom:24}}>
    <h1 style={{margin:0}}>🎫 Ticketly</h1>
    <nav style={{display:'flex',gap:12}}>
      <Link to='/'>Events</Link>
      <Link to='/orders'>My Orders</Link>
      <Link to='/cart'>Cart ({count})</Link>
      <Link to='/upload'>Upload</Link>
    </nav>
  </header>)
}