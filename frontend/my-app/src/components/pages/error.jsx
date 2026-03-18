import { Page } from "../page"

/**
 * Error component used to display a 404 Not Found message.
 * It renders the generic Page component with a specific title and body.
 */
export const Error = ()=>{
    const title = "Error"
    const body = "404"
    return (
        <Page title = {title} body = {body}/>
    )
}