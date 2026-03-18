import { SERVER_BASE_URL } from "../../config" 

/**
 * Sends a basic setting (address) to the server.
 * 
 * @param {string} address - The address string to be sent to the backend.
 * @returns {Promise<Response>} The fetch API response object.
 */
export const setBasic = async (address) => {
    const url = SERVER_BASE_URL
    const response = await fetch(url + "basic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"address": address }),
        credentials: 'include'
    }) 
    console.log(response)
    return response
}    