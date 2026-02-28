import { Nav } from "./nav"
import { Outlet } from "react-router-dom"
import { Footer } from "./footer/footer"
import { Header } from "./header"
import { Contact } from "./contact"
import { useGetCakes } from "../features/hooks/getCakes"
import { useEffect } from "react"
import { useLoadCart } from "../utilities/carts/useLoadCart"
import { useSelector } from "react-redux"
import { getCakes } from "../features/slices/cakeSlice"
import { getCartItems } from "../features/slices/cartSlice"
import { useDispatch } from "react-redux"
import { loadUpCakes } from "../features/slices/cartSlice"
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