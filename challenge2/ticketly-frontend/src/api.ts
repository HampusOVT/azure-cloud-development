const API_BASE = import.meta.env.VITE_API_BASE || '/api';
export async function getEvents(){ const r=await fetch(`${API_BASE}/events`); if(!r.ok) throw new Error('Failed'); return r.json();}
export async function getEvent(id){ const r=await fetch(`${API_BASE}/events/${id}`); if(!r.ok) throw new Error('Failed'); return r.json();}
export async function createOrder(items){ const r=await fetch(`${API_BASE}/orders`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})}); if(!r.ok) throw new Error('Failed'); return r.json();}
export async function getOrder(id){ const r=await fetch(`${API_BASE}/orders/${id}`); if(!r.ok) throw new Error('Failed'); return r.json();}
export async function uploadImage(file){ const f=new FormData(); f.append('file', file); const r=await fetch(`${API_BASE}/uploadImage`,{method:'POST', body:f}); if(!r.ok) throw new Error('Upload failed'); return r.json();}