
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { GetAddress } from "./getAddress"
import { AddressSearch } from "../address"
import { setAddress } from "../../../features/slices/addressSlice"
import { SERVER_BASE_URL } from "../../../config"
import { setBasic } from "../../../features/hooks/setBasic"
export const AddressModal = ({ setShow }) => {
    const dispatch = useDispatch()
    const url = SERVER_BASE_URL
    const [response, setResponse] = useState(null)
    const [address, setTheAddress] = useState({})
    const modalRef = useRef(null)
    function handleClick() {
        setShow(false)
    }
    async function handleClickAddAddress() {
        setShow(false)
        const response = await setBasic(address)
        if(response.status == 201){
            dispatch(setAddress(address))
        }else{
            console.log("something went wrong with address")
        }
        
    }
    return (
        <div>
            <div className="modal-container" >
                <div className="modal" ref={modalRef}>
                    <button className="btn-top" onClick={handleClick}>X</button>
                    <AddressSearch setResponse={setResponse} setTheAddress={setTheAddress} />
                    {(!response && response !== null) && <h2>"Sorry there is no delivery for that location"</h2>}
                    <button className={response ? "save-btn" : "notEnabled"} onClick={response ? handleClickAddAddress : () => { }}>Save</button>
                </div>
            </div>
        </div>

    )
}