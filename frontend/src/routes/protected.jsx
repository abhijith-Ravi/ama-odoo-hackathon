import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export default function Protected({ children }) {
    const { token } = useAuthStore()
    const loc = useLocation()
    if (!token) return <Navigate to="/login" state={{ from: loc.pathname }} replace />
    return children
}