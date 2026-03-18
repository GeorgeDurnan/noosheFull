import styles from "./footer.module.css"

/**
 * Join component displays a subscription form for the email newsletter.
 * Allows users to sign up for updates and perks.
 */
export const Join = () => {
    return (<div className={styles.footerContainer}>
        <div className={styles.joinBox}>
            <h1 className={styles.title}>Join Nooshé & Treat Yourself!</h1>
            <h3 className={styles.body}>Sign up for sweet perks and surprises.</h3>
            <h3 className={styles.body}>🎁 Subscribe to the Nooshé family and receive a free cookie box with your next purchase.</h3>
            <form className={styles.joinForm}>
                <label htmlFor="first">First name*</label>
                <input type="text" id="first" name="first" className={styles.line} />
                <label htmlFor="last">Last Name</label>
                <input type="text" id="last" name="last" className={styles.line} />
                <label htmlFor="birthday" >Birthday</label>
                <input type="date" id="birthday" name="birthday" className={styles.line} />
                <label htmlFor="email" >Email</label>
                <div className={styles.emailCon}>
                    <input type="email" id="email" name="email" className={styles.email} />
                </div>
                <input type="submit" value="Subscribe" className={styles.submit} />
                <div className={styles.subscribe}>
                    <input type="checkbox" id="subscribe" name="subscribe" value="yes" />
                    <label htmlFor="subscribe" >I want to subscribe to your mailing list.</label>
                </div>
            </form>
        </div>
    </div>)
}