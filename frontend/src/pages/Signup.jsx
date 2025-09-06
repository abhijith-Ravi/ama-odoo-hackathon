import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuthStore } from '../store/auth'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [pw, setPw] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)

    const onSubmit = async (e) => {
        e.preventDefault()
        setErr(''); setLoading(true)
        try {
            await api.signup(email, pw, username)
            // optional auto-login convenience:
            const { token } = await api.login(email, pw)
            localStorage.setItem('eco_token', token)
            const me = await api.me()
            setAuth(token, me)
            nav('/', { replace: true })
        } catch (e) {
            setErr(e?.response?.data?.error || 'Signup failed')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Sign up</h1>
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
                <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password (min 8 chars)" minLength={8} type="password" required
                    style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8 }} />
                {err && <div style={{ color: '#dc2626', fontSize: 14 }}>{err}</div>}
                <button disabled={loading}
                    style={{ padding: '10px 12px', background: '#1DB954', color: '#fff', borderRadius: 8 }}>
                    {loading ? 'Creating…' : 'Create account'}
                </button>
            </form>
        </div>
    )
}