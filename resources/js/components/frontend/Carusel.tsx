import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Lucide Icons

import { useRef } from "react";

const Carusel = () => {
    const sliderRef = useRef<Slider>(null);
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      nextArrow: <ArrowButton direction="next" onClick={() => sliderRef.current?.slickNext()} />,
      prevArrow: <ArrowButton direction="prev" onClick={() => sliderRef.current?.slickPrev()} />,
    };

  return (
      <div className="overflow-hidden relative mb-3">

          <Slider {...settings} className="slider-home">
                <div>
                    <img src="https://api.spicezgold.com/download/file_1734525002307_1723967638078_slideBanner1.6bbeed1a0c8ffb494f7c.jpg" alt="Slide 1" />
                </div>
                <div>
                    <img src="https://api.spicezgold.com/download/file_1734524985581_NewProject(11).jpg" alt="Slide 2" />
                </div>
                {/* <div>
                    <img src="https://placehold.co/1200x500" alt="Slide 3" />
                </div> */}
      </Slider>
    </div>
  );
};

// Arrow Button Component (Inside Same File)
const ArrowButton = ({ direction, onClick }: { direction: "next" | "prev"; onClick: () => void }) => (
    <button
      className={`absolute top-1/2 ${direction === "next" ? "right-4" : "left-4"} transform -translate-y-1/2 bg-black/50 hover:bg-black/80 p-2 rounded-full z-10`}
      onClick={onClick}
    >
      {direction === "next" ? <ArrowRight size={24} className="text-white" /> : <ArrowLeft size={24} className="text-white" />}
    </button>
  );


export default Carusel;
