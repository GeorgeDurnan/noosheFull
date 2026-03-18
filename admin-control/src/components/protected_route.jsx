import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
/**
 * Component that guards protected routes.
 * Checks if the user is authenticated via the API.
 * Renders child routes via <Outlet /> if authenticated, otherwise shows a login link.
 */
export const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)  // null = loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                })
                // Log response for debugging if environment variable is set
                if (process.env.REACT_APP_POSTRESPONSE === "true") {
                    console.log(response)
                }
                setIsAuthenticated(response.status === 200)
            } catch (e) {
                console.error("Authentication error", e)
                setIsAuthenticated(false)
            }
        }
        checkAuth()
    }, [])

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return (
            <div>
                <a href="/">Login here</a>
            </div>
        )
    } else {
        return (<Outlet />)
    }
} 