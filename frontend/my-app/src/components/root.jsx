import { Nav } from "./nav"
import { Outlet } from "react-router-dom"
import { Footer } from "./footer/footer"
import { Header } from "./header"
import { Contact } from "./contact"
import { useGetCakes } from "../features/hooks/getCakes"
import { useLoadCart } from "../utilities/carts/useLoadCart"
import { useGetBasic } from "../features/hooks/getBasic"
import { AnimatePresence, motion } from "framer-motion" 
import ErrorBoundary from "./ErrorBoundary"
import { useLocation, useOutlet } from "react-router-dom"
import { ScrollToTop } from "../utilities/scrollToTop"

/**
 * Root component serving as the main layout wrapper for the application.
 * Handles initial data fetching, navigation, and page transition animations.
 */
export const Root = () => {
    // Initialize data fetching hooks to load application state
    useGetCakes()
    useLoadCart()
    useGetBasic()
    const location = useLocation()
    const outlet = useOutlet()
    return (<>
        <ScrollToTop />
        <Nav />
        <Header id="header" />
        {/* Wrap outlet in AnimatePresence for page transitions */}
        <AnimatePresence mode="wait">
            <ErrorBoundary>
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
            </ErrorBoundary>
        </AnimatePresence>
        <Footer />
        <Contact />
    </>)

}