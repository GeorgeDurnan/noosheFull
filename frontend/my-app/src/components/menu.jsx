import styles from "./menu.module.css"
import { Link } from "react-router-dom"
export const Menu = ({ setSelf }) => {
    const handleClick = () => {
        setSelf(false)
    }
    return (
        <div className={styles.links} >
            <Link onClick={handleClick} className={`${styles.link} ${window.location.pathname === "/" ? styles.active : ""}`} to="/">Home</Link>
            <Link onClick={handleClick} className={`${styles.link} ${window.location.pathname === "/online-ordering" ? styles.active : ""}`} to="/online-ordering">Online Order</Link>
            <Link onClick={handleClick} className={`${styles.link} ${window.location.pathname === "/trade-order" ? styles.active : ""}`} to="/trade-order">Wholesale</Link>
            <Link onClick={handleClick} className={`${styles.link} ${window.location.pathname === "/about-us" ? styles.active : ""}`} to="/about-us">About us</Link>
        </div >
    )
}