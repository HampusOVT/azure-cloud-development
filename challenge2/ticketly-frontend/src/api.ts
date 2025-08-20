import type { Event, OrderItem, Order } from './types'

const API_BASE: string = import.meta.env.API_BASE ?? '/api'


export async function getEvents(): Promise<Event[]> {
    const res = await fetch(`${API_BASE}/events`)
    if (!res.ok) throw new Error('Failed to load events')
    return res.json()
}

export async function getEvent(id: string): Promise<Event> {
    const res = await fetch(`${API_BASE}/events/${id}`)
    if (!res.ok) throw new Error('Failed to load event')
    return res.json()
}

export async function createOrder(items: OrderItem[]): Promise<{ orderId: string; status: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
    })
    if (!res.ok) throw new Error('Failed to create order')
    return res.json()
}

export async function getOrder(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`)
    if (!res.ok) throw new Error('Failed to load order')
    return res.json()
}

/**
 * Upload an image for a specific event using SAS + notify the backend.
 * Returns the queued job info.
 */
export async function uploadImage(eventId: string, file: File): Promise<{ queued: boolean; eventId: string; blobPath: string }> {
    // 1) ask backend for a SAS URL to upload this file
    const ext = '.' + (file.name.split('.').pop() || 'jpg')
    const sasRes = await fetch(`${API_BASE}/events/${eventId}/image/sas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extension: ext, contentType: file.type || 'application/octet-stream' })
    })
    if (!sasRes.ok) throw new Error('Failed to get SAS')
    const { uploadUrl, blobPath } = await sasRes.json()

    // 2) upload directly to Blob Storage using the SAS
    const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': file.type || 'application/octet-stream'
        },
        body: file
    })
    if (!putRes.ok) throw new Error('Upload failed')

    // 3) notify backend so the queue worker can generate a thumbnail
    const notifyRes = await fetch(`${API_BASE}/events/${eventId}/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blobPath, contentType: file.type || 'application/octet-stream' })
    })
    if (!notifyRes.ok) throw new Error('Failed to notify upload')
    return notifyRes.json()
}