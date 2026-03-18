import { Page } from "../page"

/**
 * Disclaimer page component.
 * Renders the website disclaimer, including general disclaimer, external links policy, and contact information.
 * 
 */
export const Disclaimer = () => {
    return (
        <div className="page">
            <h1 className="title">Website Disclaimer</h1>
            <div>
                <h3>General Disclaimer:</h3>
                <h3>All content provided on our website is for informational purposes only. We strive for accuracy but do not guarantee that the information is complete or up-to-date.</h3>
                <h3>External Links:</h3>
                <h3>Our website may contain links to third-party sites. We are not responsible for their content or privacy practices.</h3>
                <h3>Contact Us:</h3>
                <h3>If you have any questions regarding these policies, please contact us: Email: info@nooshe.co.uk</h3>
            </div>
        </div>
    )
}