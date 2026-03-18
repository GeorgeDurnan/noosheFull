import { useState } from "react"
import { CartModal } from "./cart/cartModal"
import { Link } from "react-router-dom"
import styles from "./nav.module.css"
import { ShoppingCart } from "../images/svgs/shoppingCartIcon"
import { HomeIcon } from "../images/svgs/homeIcon"
import { MenuIcon } from "../images/svgs/menuIcon"
import { MenuModal } from "./menuModal"
export const Nav = () => {
    // State to toggle the visibility of the cart and menu modals
    const [cart, setCart] = useState(false)
    const [menu, setMenu] = useState(false)

    // Toggle cart modal visibility
    function handleCartClick() {
        setCart(prev => !prev)
    }

    // Toggle mobile menu modal visibility
    function handleMenuClick() {
        setMenu(prev => !prev)
    }

    return (<div className={styles.nav}>
        {/* Desktop Navigation */}
        <div className={styles.linkContainer}>
            <div className={styles.links}>
                <Link className={styles.link} to="/">Home</Link>
                <Link className={styles.link} to="/online-ordering">Online Order</Link>
                <Link className={styles.link} to="/trade-order">Wholesale</Link>
                <Link className={styles.link} to="/about-us">About us</Link>
            </div>
            <div className={`${styles.icon}`} onClick={handleCartClick}>
                <ShoppingCart />
            </div>
        </div>

        {/* Mobile Navigation */}
        <div className={styles.icons}>
            <div>
                <Link className={`${styles.icon} ${styles.right}`} to="/"><HomeIcon /></Link>
            </div>
            <div className={`${styles.right}`}>
                <div className={`${styles.icon}`} onClick={handleCartClick}>
                    <ShoppingCart />
                </div>
                <div className={`${styles.icon}`} onClick={handleMenuClick}>
                    <MenuIcon />
                </div>
            </div>
        </div>
        {menu && <MenuModal setShow={setMenu} show={menu} />}
        {cart && <CartModal setShow={setCart} show={cart} />}
    </div>)
}  