import { useState } from "react"
export const Images = ({ images }) => {
    const [count, setCount] = useState(0)
    function handlePrev() {
        setCount((prev) => {
            const next = prev - 1
            return next < 0 ? images.length - 1 : next
        })
    }
    function handleNext() {
        setCount((prev) => {
            const next = prev + 1
            return next >= images.length ? 0 : next
        })
    }
    if (images.length == 0) {
        return
    }
    return (
        <div>
            <img src={images[count].url} alt="Cake picture" />

            {images.length > 1 && <><button onClick={handlePrev}>&lt;</button>
                <button onClick={handleNext}>&gt;</button></>}
        </div>
    )
}
