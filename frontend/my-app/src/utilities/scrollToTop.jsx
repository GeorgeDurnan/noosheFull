import { useEffect } from "react" 
import { useLocation } from "react-router-dom" 

/**
 * Component that automatically scrolls the window to the top whenever the route pathname changes.
 * This ensures that users start at the top of the page when navigating between routes.
 */
export const ScrollToTop = () => {
    const { pathname } = useLocation() 

    useEffect(() => {
        // Scroll to top-left corner with smooth animation
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" }) 
    }, [pathname]) 

    return null 
}