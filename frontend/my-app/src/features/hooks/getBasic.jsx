import { SERVER_BASE_URL } from "../../config"
import { useDispatch } from "react-redux" 
import { setAddress } from "../slices/addressSlice" 
/**
 * Fetches basic configuration (address) from the server and updates the Redux store.
 */
export const useGetBasic = async () => {
    const url = SERVER_BASE_URL
    const dispatch = useDispatch()

    // Fetch the 'basic' endpoint with credentials
    const response = await fetch(url + "basic", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    }) 
    console.log(response)

    // Extract data and dispatch to store
    const text = await response.json()
    dispatch(setAddress(text.address))
}