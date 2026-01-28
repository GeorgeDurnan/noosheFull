import { Address } from "./address"
import { Contact } from "../contact"
import { FooterLinks } from "./footerLinks"
import { Join } from "./join"
export const Footer = () => {
    return (<div id="footer">
        <Join/>
        <Address/>
        <FooterLinks/>

    </div>)
}  