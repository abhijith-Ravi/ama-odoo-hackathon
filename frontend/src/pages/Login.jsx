import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth'

export default function Login() {
    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    const loc = useLocation()
    const from = loc.state?.from || '/'
    const setAuth = useAuthStore((s) => s.setAuth)

    const onSubmit = async (e) => {
        e.preventDefault()
        setErr(''); setLoading(true)
        try {
            const { token } = await api.login(email, pw)
            // fetch user profile via /auth/me
            const me = await (async () => {
                // Temporarily store token to call /me
                localStorage.setItem('eco_token', token)
                try { return await api.me() } finally { /* will be overwritten by store below */ }
            })()
            setAuth(token, me)
            nav(from, { replace: true })
        } catch (e) {
            setErr(e?.response?.data?.error || 'Login failed')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Log in</h1>
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
                <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" type="password" required
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
                {err && <div style={{ color: '#dc2626', fontSize: 14 }}>{err}</div>}
                <button disabled={loading}
                    style={{ padding: '10px 12px', background: '#1DB954', color: '#fff', borderRadius: 8 }}>
                    {loading ? 'Signing in…' : 'Log in'}
                </button>
                <div style={{ fontSize: 14 }}>No account? <Link to="/signup" style={{ color: '#1DB954' }}>Sign up</Link></div>
            </form>
        </div>
    )
}