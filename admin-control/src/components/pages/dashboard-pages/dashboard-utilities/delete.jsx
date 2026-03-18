/**
 * Component to handle deleting a user.
 * Renders a button that, when clicked, sends a DELETE request.
 * 
 * @param {Object} props
 * @param {number|string} props.id - The ID of the user to be deleted.
 * @param {number|string} props.userId - The ID of the currently logged-in user (to prevent self-deletion).
 * @param {Function} props.setMsg - State setter for the feedback message.
 */
export const Delete = ({ id, setMsg, userId }) => {
    async function handleClick() {
        if (userId === id) {
            setMsg("You cannot delete your own user")
            return
        }
        const options = {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'

        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, options)
        if (process.env.REACT_APP_POSTRESPONSE === "true") {
            console.log(response)
        }
        if (!response.ok) {
            setMsg("User not deleted")
        } else {
            setMsg(`User with id: ${id} deleted`)
        }
    }
    return (
        <button onClick={handleClick}>Delete user</button>
    )
}