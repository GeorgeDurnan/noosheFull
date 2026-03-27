import { useNavigate } from "react-router-dom" 
import styles from "./cartPage.module.css" 

/**
 * CheckoutBtn Component
 * 
 * This component renders a button that navigates the user to the checkout page.
 * It is designed to be reusable across different parts of the cart interface.
 * 
 * @param {Object} props 
 * @param {string} [props.className] - Optional additional CSS classes for styling
 * @returns {JSX.Element} The rendered checkout button
 */
export const CheckoutBtn = ({ className }) => {
    // Initialize the navigate function from react-router-dom to handle client-side navigation
    const navigate = useNavigate() 

    /**
     * Handles the click event for the checkout button.
     * When clicked, it navigates the user to the '/checkout' route.
     */
    const handleClick = () => {
        // Navigate to the checkout page
        navigate('/checkout') 
    } 

    return (
        // Render the button with the base style and any optional classes passed via props
        <button 
            className={`${styles.btn} ${className || ''}`} 
            onClick={handleClick}
            aria-label="Proceed to checkout"
        >
            Checkout
        </button>
    ) 
} 
