import "fslightbox";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import data from "../data/images.json"
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
export const Carousel = () => {
    const images = data.images
    return (
        <div id="carousel-container">
            <Swiper
                modules={[Navigation, Pagination, A11y, Autoplay]}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: true,
                }}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                /*onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}*/
                freeMode={true}
                allowTouchMove={true}
                slidesPerView={5}
                spaceBetween={32}
                speed={10000}

                id="carousel"
            >
                {images.map((image) => {
                    return <SwiperSlide><img src={image.link} alt={image.header} /></SwiperSlide>
                })}
            </Swiper >
        </div >
    );
};