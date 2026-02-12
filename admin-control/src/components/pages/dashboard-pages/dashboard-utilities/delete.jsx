export const Delete = ({id, setMsg, setCount, pk}) => {
    function handleClick() {
        async function deleteItem() {
            if(pk === id){
                setMsg("Cannot delete yourself dige")
                return
            }
            const options = {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'

            }


            const response = await fetch(`http://localhost:5000/users/${id}`, options)
            const data = await response.text()
            if (response.status == 404) {
                setMsg("User not deleted error: " + data)
            } else {
                setMsg(data)
            }
        }
        deleteItem()
    }
return (
    <button onClick={handleClick}>Delete user</button>
)
}