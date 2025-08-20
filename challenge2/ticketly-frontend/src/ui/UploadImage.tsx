import { useState } from 'react'
import { uploadImage } from '../api'
export default function UploadImage(){
  const [file,setFile]=useState<File|null>(null)
  const [msg,setMsg]=useState<string|null>(null)
  const [busy,setBusy]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(!file) return setMsg('Select a file first')
    setBusy(true); setMsg(null)
    try{
      const res = await uploadImage(file)
      setMsg(`Uploaded! Blob path: ${res.blobPath}. Thumbnail job enqueued.`)
    }catch(err:any){ setMsg(err.message||'Upload failed') } finally{ setBusy(false) }
  }
  return (<div>
    <h2>Upload Event Image</h2>
    <form onSubmit={submit} style={{display:'grid',gap:12,maxWidth:480}}>
      <input type='file' accept='image/*' onChange={e=>setFile(e.target.files?.[0]||null)}/>
      <button disabled={busy||!file} type='submit'>{busy?'Uploading...':'Upload'}</button>
    </form>
    {msg && <p style={{marginTop:12}}>{msg}</p>}
    <p style={{fontSize:12,color:'#666'}}>Sends the image to <code>/api/uploadImage</code>, stores it in Blob Storage, and enqueues a thumbnail job.</p>
  </div>)
}