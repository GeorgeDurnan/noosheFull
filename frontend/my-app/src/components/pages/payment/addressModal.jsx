
import { useDispatch } from "react-redux"
import { useState } from "react"
import { AddressSearch } from "../address"
import { setAddress } from "../../../features/slices/addressSlice"
import { SERVER_BASE_URL } from "../../../config"
import { setBasic } from "../../../features/hooks/setBasic"
import { useNoScroll, useClickOutside } from "../../../features/hooks/modalUtilities"
import { addItem } from "../../../features/slices/cartSlice"
import modalStyle from "../../modals.module.css"
import addressStyle from "./address.module.css"
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
            <div className={`${modalStyle.modalContainer} ${modalStyle.modalConAddress}`} >
                <div className={`${modalStyle.modal} ${modalStyle.modalAddress}`} ref={modalRef}>
                    <div className={addressStyle.header}>
                        <h2>How would you like to recieve your order</h2>
                        <button className={`${addressStyle.btnTop} `} onClick={handleClick}>X</button>
                    </div>
                    <div className={addressStyle.middle}>
                        <h2>Deliver to:</h2>
                        <AddressSearch setResponse={setResponse} setTheAddress={setTheAddress} />
                        {(!response && response !== null) && <h2>"Sorry there is no delivery for that location"</h2>}
                    </div>
                    <div className={addressStyle.btnCon}>
                        <button className={`${response ? addressStyle.saveBtn : addressStyle.notEnabled} ${addressStyle.btn}`} onClick={response ? handleClickAddAddress : () => { }}>Save</button>
                    </div>
                </div>
            </div>
        </div>

    )
}