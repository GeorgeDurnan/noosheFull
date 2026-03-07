import { SERVER_BASE_URL } from "../../config"
import { useDispatch } from "react-redux";
import { setAddress } from "../slices/addressSlice";
export const useGetBasic = async () => {
    const url = SERVER_BASE_URL
    const dispatch = useDispatch()
    const response = await fetch(url + "basic", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    });
    console.log(response)
    const text = await response.json()
    dispatch(setAddress(text.address))
}