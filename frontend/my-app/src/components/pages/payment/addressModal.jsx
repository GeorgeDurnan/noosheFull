
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { GetAddress } from "./getAddress"
import { AddressSearch } from "../address"
import { setAddress } from "../../../features/slices/addressSlice"
import { SERVER_BASE_URL } from "../../../config"
import { setBasic } from "../../../features/hooks/setBasic"
import { useNoScroll, useClickOutside } from "../../../features/hooks/modalUtilities"
import { addItem } from "../../../features/slices/cartSlice"
export const AddressModal = ({ setShow, show, order }) => {
    const dispatch = useDispatch()
    const url = SERVER_BASE_URL
    const [response, setResponse] = useState(null)
    const [address, setTheAddress] = useState({})
    function handleClick() {
        setShow(false)
    }
    async function handleClickAddAddress() {
        setShow(false)
        const response = await setBasic(address)
        if (response.status == 201) {
            dispatch(setAddress(address))
            dispatch(addItem(order))
        } else {
            console.log("something went wrong with address")
        }

    }
    useNoScroll(show)
    const modalRef = useClickOutside(show, setShow)
    return (
        <div>
            <div className="modal-container modal-con-item" >
                <div className="modal modal-item" ref={modalRef}>
                    <button className="btn-top" onClick={handleClick}>X</button>
                    <AddressSearch setResponse={setResponse} setTheAddress={setTheAddress} />
                    {(!response && response !== null) && <h2>"Sorry there is no delivery for that location"</h2>}
                    <button className={response ? "save-btn" : "notEnabled"} onClick={response ? handleClickAddAddress : () => { }}>Save</button>
                </div>
            </div>
        </div>

    )
}