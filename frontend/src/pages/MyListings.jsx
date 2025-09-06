import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth'
import { useParams } from 'react-router-dom'
import Protected from '../routes/protected'

function MyListingsInner() {
  const nav = useNavigate()
  const { id } = useParams()
  const { user } = useAuthStore()
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const [err,setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.getProducts(id)
      .then((all) => {
        if (!cancelled) {
          const mine = (user?.id) ? all.filter(p => p.userId === user.id) : []
          setItems(mine)
        }
      })
      .catch((e) => { if (!cancelled) setErr(e?.response?.data?.error || String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user?.email])

  if (loading) return <div>Loading…</div>
  if (err) return <div style={{color:'#dc2626'}}>{err}</div>
  console.log(items);

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
        <h1 style={{fontSize:20, fontWeight:800}}>My Listings</h1>
        <button onClick={()=>nav('/products/new')} style={{padding:'8px 12px', background:'#1DB954', color:'#fff', borderRadius:8}}>+ Add</button>
      </div>
      <div style={{display:'grid', gap:12}}>
        {items.map((l, i) => (
          <div key={l.id || i} style={{padding:12, border:'1px solid #e5e7eb', borderRadius:8, background:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>{l.title || 'Untitled'}</div>
              <div style={{color:'#475569'}}>${Number(l.price || 0).toFixed(2)} • {l.category}</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>nav(`/products/${l.id }`)} style={{padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:6}}>View</button>
              <button onClick={()=>nav(`/products/new?id=${l.id }`)} style={{padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:6}}>Edit</button>
              <button onClick={async ()=>{
                if (!l.id) return alert('No ID to delete yet.')
                await api.deleteProduct(l.id)
                location.reload()
              }} style={{padding:'6px 10px', border:'1px solid #fecaca', color:'#dc2626', borderRadius:6}}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div>You don’t have any listings yet.</div>}
      </div>
    </div>
  )
}

export default function MyListings() {
  return (
    <Protected>
      <MyListingsInner />
    </Protected>
  )
}