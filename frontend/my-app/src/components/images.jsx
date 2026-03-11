import { useState, useEffect } from "react"
import styles from "./item.module.css"
export const Images = ({ images }) => {
    const [count, setCount] = useState(0)

    // Preload images
    useEffect(() => {
        if (!images || images.length === 0) return;
        images.forEach((img) => {
            const preloadImg = new window.Image();
            preloadImg.src = img.url;
        });
    }, [images]);
    useEffect(() => {
        console.log(count)
    }, [count])
    function handlePrev() {
        setCount((prev) => {
            const next = prev - 1
            return next < 0 ? images.length - 1 : next
        })
    }
    function handleNext() {
        console.log("click")
        setCount((prev) => {
            const next = prev + 1
            return next >= images.length ? 0 : next
        })
    }
    if (images.length == 0) {
        return
    }
    return (
        <div className={styles.imageCon}>
            {images.map((image, index) => {
                return (<img key={index} className={styles.image} style={{ display: count === index ? "block" : "none" }}
                    src={image.url} alt="Cake picture" />)
            })}

            {images.length > 1 && <>
                <button className={styles.nextBtn} onClick={handlePrev}>&lt;</button>
                <button className={styles.prevBtn} onClick={handleNext}>&gt;</button></>}
        </div>
    )
}
