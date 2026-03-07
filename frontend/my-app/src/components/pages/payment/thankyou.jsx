import { useEffect } from "react"
import { Page } from "../../page"
import { useState } from "react"
import { Link } from "react-router-dom"
export const Thankyou = () => {
    const title = "Thank you "
    const body = "Enjoy nooshe"
    const [paid, setPaid] = useState(null)
    useEffect(() => {
        async function checkPay() {
            const params = new URLSearchParams(window.location.search)
            const session_id = params.get("session_id")
            const request = await fetch("http://localhost:5000/verify-pay", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ "sessionId": session_id })

            })
            if(request.status === 200){
                setPaid(true)
            }else{
                setPaid(false)
            }

        }
        checkPay()

    },[])
    if (paid === null) {
        return (
            <h1>Loading...</h1>
        )
    } else if (paid === false) {
        return (
            <Link to="/checkout">Payment failed return back to checkout?</Link>
        )
    } else {
        return (
            <Page title={title} body={body} />
        )
    }

}