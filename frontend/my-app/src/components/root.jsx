import { Nav } from "./nav"
import { Outlet } from "react-router-dom"
import { Footer } from "./footer/footer"
import { Header } from "./header"
import { Contact } from "./contact"
import { useGetCakes } from "../features/hooks/getCakes"
import { useLoadCart } from "../utilities/carts/useLoadCart"
import { useGetBasic } from "../features/hooks/getBasic"
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom"
export const Root = () => {
    useGetCakes()
    useLoadCart()
    useGetBasic()
    const location = useLocation()
    const outlet = useOutlet()
    return (<>
        <Nav />
        <Header id="header" />
        <AnimatePresence mode="wait">
            <motion.div
                className="main"
                key={location.pathname}
                initial={{ x: "100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100vw", opacity: 0 }}
                transition={{ type: "tween", duration: 1 }}
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
        <Footer />
        <Contact />
    </>)

}