
/**
 * Page component to display a title and body.
 * Mostly used for testing and add temporary pages
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the page.
 * @param {string} props.body - The body content of the page.
 */
export const Page = (props) => {
    const { body, title } = props
    return (<>
        <h1>{title}</h1>
        <h2>{body}</h2>
    </>
    )

}