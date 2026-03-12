import { Link } from "react-router-dom"
import styles from "./footer.module.css"
export const FooterLinks = () => {
    return (<div className={styles.footerContainer}>
        <Link to="/english-privacy-policy">Privacy Policy</Link>
        <Link to="/accessibility-statement">Accesibility Statement</Link>
        <Link to="/english-shipping-policy">Shipping Policy</Link>
        <Link to="/english-terms-conditions">Terms & Conditions</Link>
        <Link to="/english-refund-policy">Refund Policy</Link>
        <Link to="/website-disclaimer">Website Disclaimer</Link>
    </div>)
}