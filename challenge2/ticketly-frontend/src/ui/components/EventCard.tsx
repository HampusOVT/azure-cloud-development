import {Link} from 'react-router-dom'

export default function EventCard({e}: { e: { id: string; name: string; date: string; price: number } }) {
    return (<div style={{border: '1px solid #eee', padding: 16, borderRadius: 12}}>
        <h3 style={{marginTop: 0}}>{e.name}</h3>
        <p><b>Date:</b> {e.date}</p>
        <p><b>Price:</b> ${e.price}</p>
        <Link to={`/events/${e.id}`}>View</Link>
    </div>)
}