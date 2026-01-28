import { Nav } from "./nav"
import { Outlet } from "react-router-dom"
import { Footer } from "./footer/footer"
import { Header } from "./header"
import { Contact } from "./contact"
import { useGetCakes } from "../features/hooks/getCakes"
export const Root = () => {
    useGetCakes()
    return (<>
        <Nav />
        <Header id="header"/>
        <Outlet/>
        <Footer/>
        <Contact/>
    </>)

}