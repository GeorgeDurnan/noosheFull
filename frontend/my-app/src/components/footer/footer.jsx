import { Address } from "./address"
import { FooterLinks } from "./footerLinks"
import { Join } from "./join"
import styles from "./footer.module.css"

/**
 * Footer component that displays the site's footer section.
 * Renders the newsletter join form, business address, and navigation links.
 */
export const Footer = () => {
    return (<div className={styles.footer}>
        <div className={styles.footBox}>
            <Join />
        </div>
        <div className={styles.footBox}>
            <Address />
        </div>
        <div className={styles.footBox}>
            <FooterLinks />
        </div>

    </div>)
}  