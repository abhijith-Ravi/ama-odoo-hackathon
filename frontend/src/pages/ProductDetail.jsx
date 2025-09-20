import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, resolveImageUrl } from '../api/client'

export default function ProductDetail() {
  const { id } = useParams()
  const [item,setItem] = useState(null)
  const [loading,setLoading] = useState(true)
  const [err,setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.getProduct(id)
      .then((res) => { if (!cancelled) setItem(res) })
      .catch((e) => { if (!cancelled) setErr(e?.response?.data?.error || String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <div>Loading…</div>
  if (err) return <div style={{color:'#dc2626'}}>{err}</div>
  if (!item) return <div>Not found</div>

  const img = resolveImageUrl(item.image)

  return (
    <div style={{maxWidth:800, margin:'0 auto'}}>
      {img ? (
        <img src={img} alt={item.title || 'Product'} style={{width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:12}} />
      ) : (
        <div style={{aspectRatio:'16/9', background:'#e2e8f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>Image Placeholder</div>
      )}
      <h1 style={{fontSize:24, fontWeight:800, marginTop:12}}>{item.title || `Product ${id}`}</h1>
      <div style={{color:'#1DB954', fontWeight:700}}>${Number(item.price || 0).toFixed(2)}</div>
      <div style={{color:'#475569'}}>{item.category}</div>
      <p style={{marginTop:8}}>{item.description}</p>
      <div style={{marginTop:8, color:'#64748b'}}>Owner: {item.user?.username || item.userId}</div>
    </div>
  )
}