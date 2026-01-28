export const Join = () => {
    return (<div className="footer-container">
        <h1>Join Nooshé & Treat Yourself!</h1>
        <h3>Sign up for sweet perks and surprises.</h3>
        <h3>🎁 Subscribe to the Nooshé family and receive a free cookie box with your next purchase.</h3>
        <form id="join-form">
            <label htmlFor="first">First name*</label>
            <input type="text" id="first" name="first" />
            <label htmlFor="last">Last Name</label>
            <input type="text" id="last" name="last" />
            <label htmlFor="birthday" >Birthday</label>
            <input type="date" id="birthday" name="birthday" />
            <div id="submit-line">
                <label htmlFor="email" >Email</label>
                <input type="email" id="email" name="email" />
                <input type="submit" value="Subscribe" />
            </div>
            <label htmlFor="subscribe" >I want to subscribe to your mailing list.</label>
            <input type="checkbox" id="subscribe" name="subscribe" value="yes" />

        </form>
    </div>)
}