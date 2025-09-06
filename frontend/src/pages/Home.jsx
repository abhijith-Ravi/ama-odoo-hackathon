import { useAuthStore } from '../store/auth'

export default function Home() {
    const { user, token } = useAuthStore()
    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Welcome to EcoFinds</h1>
            {user ? (
                <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
                    <div><b>Logged in as:</b> {user.username} ({user.email})</div>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#475569' }}>Token present: {token ? 'yes' : 'no'}</div>
                </div>
            ) : (
                <div>Please log in or sign up to continue.</div>
            )}
        </div>
    )
}