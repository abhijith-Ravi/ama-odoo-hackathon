
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import Feed from '../pages/Feed'
import ProductForm from '../pages/ProductForm'
import ProductDetail from '../pages/ProductDetail'
import MyListings from '../pages/MyListings'
import Protected from './protected'
import { useAuthStore } from '../store/auth'

function Header() {
  const { user, logout } = useAuthStore()
  const link = (to, label) => <Link to={to} style={{padding:'6px 10px', borderRadius:6}}>{label}</Link>
  return (
    <header style={{borderBottom:'1px solid #e5e7eb', background:'#fff'}}>
      <div style={{maxWidth:960, margin:'0 auto', padding:16, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Link to="/" style={{fontWeight:800, fontSize:20, color:'#111'}}>EcoFinds</Link>
        <nav style={{display:'flex', gap:8}}>
          {link('/', 'Home')}
          {link('/feed', 'Feed')}
          {link('/my-listings', 'My Listings')}
        </nav>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          {user ? (
            <>
              <span style={{color:'#475569'}}>Hi, {user.username}</span>
              <button onClick={logout} style={{padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:6}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:6}}>Log in</Link>
              <Link to="/signup" style={{padding:'6px 10px', background:'#1DB954', color:'#fff', borderRadius:6}}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default function AppRoutes() {
  const wrap = (el) => (<><Header /><main style={{maxWidth:960, margin:'0 auto', padding:16}}>{el}</main></>)
  return (
    <Routes>
      <Route path="/" element={wrap(<Home />)} />
      <Route path="/feed" element={wrap(<Feed />)} />
      <Route path="/products/new" element={<Protected>{wrap(<ProductForm />)}</Protected>} />
      <Route path="/products/:id" element={<Protected>{wrap(<ProductDetail />)} </Protected>}/>
      <Route path="/my-listings" element={<Protected>{wrap(<MyListings />)}</Protected>} />
      <Route path="/login" element={wrap(<Login />)} />
      <Route path="/signup" element={wrap(<Signup />)} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}