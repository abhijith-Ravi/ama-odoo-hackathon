import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import Protected from './protected'
import { useAuthStore } from '../store/auth'

function Header() {
    const { user, logout } = useAuthStore()
    return (
        <header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>EcoFinds</Link>
                <nav style={{ display: 'flex', gap: 12 }}>
                    <Link to="/">Home</Link>
                    {user ? (
                        <>
                            <span style={{ color: '#475569' }}>Hi, {user.username}</span>
                            <button onClick={logout} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}>Log in</Link>
                            <Link to="/signup" style={{ padding: '6px 10px', background: '#1DB954', color: '#fff', borderRadius: 6 }}>Sign up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default function AppRoutes() {
    const pageWrap = (el) => (
        <div>
            <Header />
            <main style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>{el}</main>
        </div>
    )
    return (
        <Routes>
            <Route path="/" element={pageWrap(<Home />)} />
            <Route path="/login" element={pageWrap(<Login />)} />
            <Route path="/signup" element={pageWrap(<Signup />)} />
            {/* Example protected route placeholder */}
            <Route path="/protected" element={<Protected>{pageWrap(<div>Protected content</div>)}</Protected>} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}