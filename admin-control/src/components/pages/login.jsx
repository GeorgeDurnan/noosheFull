import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Login = () => {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [error, setError] = useState("")
    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: user,
                    password: password
                })

            });
            console.log(response.status + "Login") 
            navigate("/dashboard")
        } catch (err) {
            console.error("Authentication error", err);
            setError("Wrong username or password")
        }
    };


    return (
        <div>
            <h1>{error}</h1>
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <section>
                    <label for="user">Username</label>
                    <input type="text" id="user" name="user" value={user} onChange={(e) => setUser(e.target.value)} />
                </section>
                <section>
                    <label for="current-password">Password</label>
                    <input type="text" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </section>
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}
