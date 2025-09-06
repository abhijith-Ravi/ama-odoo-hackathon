import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth'

export default function ProductForm() {
  const nav = useNavigate()
  const { token } = useAuthStore()
  const [title,setTitle] = useState('')
  const [description,setDescription] = useState('')
  const [category,setCategory] = useState('Other')
  const [price,setPrice] = useState('')
  const [location,setLocation] = useState('')
  const [condition,setCondition] = useState('Good')
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')
  const [image, setImage] = useState(null);


  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      if (!token) throw new Error('Please log in first.')
      await api.createProduct({
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price) || 0,
        images: [image],
        location: location.trim(),
        condition,
      })
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error || String(e))
    } finally { setLoading(false) }
  }

  return (
    <div style={{maxWidth:640, margin:'0 auto'}}>
      <h1 style={{fontSize:22, fontWeight:800, marginBottom:12}}>Add New Product</h1>
      <form onSubmit={submit} style={{display:'grid', gap:12}}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Product Title" required
               style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}/>
        <select value={category} onChange={(e)=>setCategory(e.target.value)} style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}>
          {['Clothing','Electronics','Home','Books','Toys','Other'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} placeholder="Description" required
                  style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}/>
        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" required
               style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}/>
        <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Location (optional)"
               style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}/>
        <select value={condition} onChange={(e)=>setCondition(e.target.value)} style={{padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8}}>
          {['New','Like New','Good','Fair','Poor'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]); // store the file in state
            }
          }}
          style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }}
        />
        <button disabled={loading} style={{padding:'10px 12px', background:'#1DB954', color:'#fff', borderRadius:8}}>
          {loading ? 'Submitting…' : 'Submit Listing'}
        </button>
        {err && <div style={{color:'#dc2626'}}>{err}</div>}
      </form>
    </div>
  )
}