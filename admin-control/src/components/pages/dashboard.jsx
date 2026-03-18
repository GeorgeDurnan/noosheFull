import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
/**
 * Component to display the main dashboard for logged-in users.
 * Fetches the current user's details and provides navigation to different administrative sections
 * like Users, Products, and Orders. Also handles user logout.
 * 
 * TODO: Replace all onClick navigation elements with proper Link components or buttons for accessibility.
 */
export const Dashboard = () => {
    const [name, setName] = useState("loading...")
    const [userId, setUserId] = useState("")
    const navigate = useNavigate()
    async function handleLogout(event) {
        event.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            })
            // Log response for debugging if environment variable is set
            if (process.env.REACT_APP_POSTRESPONSE === "true") {
                console.log(response)
            }

            if (response.ok) {
                navigate("/")
            }

        } catch (err) {
            console.log("log out error ->" + err)
        }
    }
    useEffect(() => {
        async function getName() {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            if (process.env.REACT_APP_POSTRESPONSE === "true") {
                console.log(response)
            }
            const data = await response.json()
            setName(data.username)
            setUserId(data.id)
        }
        getName()

    }, [])
    function handleClick() {
        navigate("/users", { state: { userId } })
    }
    function handleProfile() {
        navigate("/profile", { state: { name } })
    }
    function handleProducts() {
        navigate("/products", { state: { name } })
    }
    return (<div>
        <h1 id="welcome"></h1>
        <h1 onClick={handleProfile}>{name}</h1>
        <h1>Welcome to Nooshe</h1>
        <h1 onClick={handleClick}>Go to users</h1>
        <h1 onClick={handleProducts}>Go to products</h1>
        <Link to="/orders">Orders</Link>
        <form onSubmit={handleLogout}>
            <button type="submit">Sign out</button>
        </form>

    </div >)
}
