import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useRef } from "react";

const CaruselCategory = () => {
    const sliderRef = useRef<Slider>(null);
    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <ArrowButton direction="next" onClick={() => sliderRef.current?.slickNext()} />,
        prevArrow: <ArrowButton direction="prev" onClick={() => sliderRef.current?.slickPrev()} />,
        responsive: [
            {
                breakpoint: 1024, // Tablet view
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768, // Mobile view
                settings: {
                    slidesToShow: 4, // Show only 3 items on mobile
                },
            },
            {
                breakpoint: 480, // Smaller mobile screens
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

  return (
    <div className="px-2 mb-3">
          <div className="relative">
              <h2 className="text-2xl font-bold text-left py-5">Featured Category</h2>
          </div>

        <Slider {...settings} className="slider-category">
          <div className="px-2 text-center">
                <img src="https://api.spicezgold.com/download/file_1734525204708_fash.png" alt="Slide 1" />
                <p>
                    Fashion
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525218436_ele.png" alt="Slide 1" />
                <p>
                    Electronics
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525231018_bag.png" alt="Slide 1" />
                <p>
                    Bags
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525239704_foot.png" alt="Slide 3" />
                <p>
                    Footwear
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525248057_gro.png" alt="Slide 1" />
                <p>
                    Groceries
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525255799_beauty.png" alt="Slide 2" />
                <p>
                    Beauty
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525275367_well.png" alt="Slide 3" />
                <p>
                    Wellness
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1734525286186_jw.png" alt="Slide 1" />
                <p>
                    Jewelry
                </p>
            </div>
            <div className="px-2">
                <img src="https://api.spicezgold.com/download/file_1743331383201_d1.jpeg" alt="Slide 2" />
                <p>
                    Shoe
                </p>
            </div>
        </Slider>
    </div>
  );
};

// Arrow Button Component (Inside Same File)
const ArrowButton = ({ direction, onClick }: { direction: "next" | "prev"; onClick: () => void }) => (
    <button
      className={`absolute top-[-35px] ${direction === "next" ? "right-4" : "right-20"} transform -translate-y-1/2 bg-black/20 hover:bg-black/50 p-2 rounded-full z-10`}
      onClick={onClick}
    >
      {direction === "next" ? <ArrowRight size={24} className="text-white" /> : <ArrowLeft size={24} className="text-white" />}
    </button>
  );


export default CaruselCategory;
