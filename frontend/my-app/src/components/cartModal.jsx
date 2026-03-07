import { SERVER_BASE_URL } from "../config"
import { Cart } from "./cart"
import { useNoScroll, useClickOutside } from "../features/hooks/modalUtilities"
export const CartModal = ({ setShow, show }) => {
    const url = SERVER_BASE_URL
    useNoScroll(show)
    const modalRef = useClickOutside(show, setShow)
    function handleClick() {
        setShow(false)
    }
    return (
        <div>
            <div className="modal-container modal-con-cart" >
                <div className="modal modal-cart" ref={modalRef}>
                    <button className="btn-top" onClick={handleClick}>X</button>
                    <Cart setSelf={setShow}/>
                </div>
            </div>
        </div>

    )
}