import "fslightbox" 
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules' 
import { Swiper, SwiperSlide } from 'swiper/react' 
import data from "../data/images.json"
import styles from "./carousel.module.css"
// Import Swiper styles
import 'swiper/css' 
import 'swiper/css/scrollbar' 

/**
 * Carousel component displaying images using Swiper.
 * Loads image data from a JSON file.
 * 
 */
export const Carousel = () => {
    const images = data.images
    return (
        <div id={styles.carouselContainer}>
            <Swiper
                modules={[A11y, Autoplay]}
                autoplay={{
                    delay: 50,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                }}
                loop={true}
                scrollbar={{ draggable: true }}
                freeMode={true}
                allowTouchMove={true}
                spaceBetween={10}
                speed={3000}
                breakpoints={{
                    320: { slidesPerView: 3 },
                    480: { slidesPerView: 5 },
                    768: { slidesPerView: 5 },
                    1024: { slidesPerView: 8 }
                }}

                className={styles.carousel}
            >
                {images.map((image) => {
                    return <SwiperSlide className={styles.carouselSlide}><img className={styles.image} src={image.link} alt={image.header} /></SwiperSlide>
                })}
            </Swiper >
        </div >
    ) 
} 