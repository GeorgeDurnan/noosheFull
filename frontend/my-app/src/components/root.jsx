import { Nav } from "./nav"
import { Outlet } from "react-router-dom"
import { Footer } from "./footer/footer"
import { Header } from "./header"
import { Contact } from "./contact"
import { useGetCakes } from "../features/hooks/getCakes"
import { useEffect } from "react"
import { useLoadCart } from "../utilities/carts/useLoadCart"
export const Root = () => {
    useGetCakes()
    useLoadCart()
    return (<>
        <Nav />
        <Header id="header" />
        <Outlet />
        <Footer />
        <Contact />
    </>)

}