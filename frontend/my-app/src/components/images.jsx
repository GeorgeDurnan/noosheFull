import { useState, useEffect } from "react"
import styles from "./item.module.css"
/**
 * Renders images with navigation controls.
 * Preloads images for smoother transitions.
 * 
 * @param {Object} props - The component props.
 * @param {Array<{url: string}>} props.images - Array of image objects containing URLs.
 * @returns {JSX.Element|undefined} The carousel component or undefined if no images.
 */
export const Images = ({ images }) => {
    const [count, setCount] = useState(0)

    // Preload images when the component mounts or images prop changes
    useEffect(() => {
        if (!images || images.length === 0) return 
        images.forEach((img) => {
            const preloadImg = new window.Image() 
            preloadImg.src = img.url 
        }) 
    }, [images]) 
    useEffect(() => {
        console.log(count)
    }, [count])

    /**
     * Decrement the current image index, wrapping to the last image if necessary.
     */
    function handlePrev() {
        setCount((prev) => {
            const next = prev - 1
            return next < 0 ? images.length - 1 : next
        })
    }

    /**
     * Increment the current image index, wrapping to the first image if necessary.
     */
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
            {/* Render all images but only display the visible one based on count state */}
            {images.map((image, index) => {
                return (<img key={index} className={styles.image} style={{ display: count === index ? "block" : "none" }}
                    src={image.url} alt="Cake picture" />)
            })}

            {images.length > 1 && <>
                <button className={styles.nextBtn} onClick={handlePrev}>&lt </button>
                <button className={styles.prevBtn} onClick={handleNext}>&gt </button></>}
        </div>
    )
}
