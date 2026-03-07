import { SERVER_BASE_URL } from "../../config";
export const setBasic = async (address) => {
    const url = SERVER_BASE_URL
    const response = await fetch(url + "basic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"address": address }),
        credentials: 'include'
    });
    console.log(response)
    return response
}    