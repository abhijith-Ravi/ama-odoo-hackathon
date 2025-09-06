
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Feed() {
  const [q,setQ] = useState('')
  const [cat,setCat] = useState(null)
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api.getProducts({ q, category: cat || undefined })
      .then((res) => { if (!cancelled) setItems(res) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [q, cat])

  return (
    <div>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title…"
               style={{flex:1, padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}/>
        <Link to="/product/new" style={{padding:'10px 12px', background:'#1DB954', color:'#fff', borderRadius:8}}>+ Add</Link>
      </div>

      <div style={{margin:'12px 0', display:'flex', gap:8, flexWrap:'wrap'}}>
        {['All','Clothing','Electronics','Home','Books','Toys','Other'].map(c => {
          const active = cat === (c === 'All' ? null : c)
          return (
            <button key={c} onClick={()=>setCat(c==='All'? null : c)}
              style={{
                padding:'6px 12px', border:'1px solid #cbd5e1', borderRadius:999,
                background: active ? '#1DB954' : '#fff', color: active ? '#fff' : '#111'
              }}>{c}</button>
          )
        })}
      </div>

      {loading ? <div>Loading…</div> : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16}}>
          {items.map((it, i) => (
            <div key={it.id || i} style={{border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden', background:'#fff'}}>
              <Link to={`/product/${it.id || i}`} style={{display:'block'}}>
                {it.image ? (
                  <img 
                    src={it.image} 
                    alt={it.title || 'Product'} 
                    style={{width:'100%', height:176, objectFit:'cover'}}
                  />
                ) : (
                  <div style={{height:176, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    Image Placeholder
                  </div>
                )}
              </Link>
              <div style={{padding:12}}>
                <div style={{fontWeight:600}}>{it.title || 'Untitled'}</div>
                <div style={{color:'#1DB954', fontWeight:600}}>${Number(it.price || 0).toFixed(2)}</div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div>No products yet.</div>}
        </div>
      )}
    </div>
  )
}
