import {useEffect, useState} from 'react'
import {getEvents} from '../api'
import EventCard from './components/EventCard'

export default function Home() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        getEvents().then(setEvents).catch(e => setError(e.message)).finally(() => setLoading(false))
    }, [])
    if (loading) return <p>Loading events...</p>
    if (error) return <p style={{color: 'red'}}>{error}</p>
    return (<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16}}>
        {events.map(e => <EventCard key={e.id} e={e}/>)}
    </div>)
}