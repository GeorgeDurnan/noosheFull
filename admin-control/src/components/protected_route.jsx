import { useEffect, useState } from 'react';
import {Outlet } from 'react-router-dom';
import { Login } from './pages/login';
export const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/me', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                setIsAuthenticated(response.status === 200);
            } catch (e) {
                console.error("Authentication error", e);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        return (
            <div>
                <a href="/">Login here</a>
            </div>
        );
    } else {
        return (<Outlet />);
    }

    // 3. If authenticated, render the child routes

};