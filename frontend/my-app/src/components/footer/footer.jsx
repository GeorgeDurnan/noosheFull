import { Address } from "./address"
import { FooterLinks } from "./footerLinks"
import { Join } from "./join"
import styles from "./footer.module.css"
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