import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "./dashboard-pages/dashboard-utilities/query";
import { Results } from "./dashboard-pages/dashboard-utilities/results";
import { Users } from "./dashboard-pages/users/users";
export const Dashboard = () => {
    const [name, setName] = useState("loading...");
    const [userId, setUserId] = useState("")
    const navigate = useNavigate()
    async function handleLogout(event) {
        event.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            });
            if (response.ok) {
                navigate("/")
            }

        } catch (err) {
            console.log("log out error ->" + err)
        }
    };
    useEffect(() => {
        async function getName() {
            const response = await fetch('http://localhost:5000/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
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
    function handleProducts(){
         navigate("/products", { state: { name } })
    }
    return (<div>
        <h1 id="welcome"></h1>
        <h1 onClick={handleProfile}>{name}</h1>
        <h1>Welcome to Nooshe</h1>
        <h1 onClick={handleClick}>Go to users</h1>
        <h1 onClick={handleProducts}>Go to products</h1>
        <form onSubmit={handleLogout}>
            <button type="submit">Sign out</button>
        </form>

    </div >)
}
