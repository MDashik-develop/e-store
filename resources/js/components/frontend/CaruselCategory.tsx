import { ArrowLeft, ArrowRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import { useRef } from 'react';
import { dot } from 'node:test/reporters';

type Category = {
    id: number;
    name: string;
    image: string;
};

interface Props {
    categories: Category[];
}

const CaruselCategory: React.FC<Props> = ({ categories }) => {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <ArrowButton direction="next" onClick={() => sliderRef.current?.slickNext()} />,
        prevArrow: <ArrowButton direction="prev" onClick={() => sliderRef.current?.slickPrev()} />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="mb-3 px-2">
            <div className="relative">
                <h2 className="py-5 text-left text-2xl font-bold">Featured Category</h2>
            </div>

            <Slider  {...settings} className="slider-category">
                {categories.map((cat) => (
                    <div key={cat.id} className="px-2 text-center">
                        <img
                            src={`/storage/${cat.image}`}
                            alt={cat.name}
                            className="mx-auto h-24 w-24 border-0 rounded-full object-cover"
                        />
                        <p className="mt-2 text-sm font-medium">{cat.name}</p>
                    </div>
                ))}
                                {categories.map((cat) => (
                    <div key={cat.id} className="item px-2 text-center">
                        <img
                            src={`/storage/${cat.image}`}
                            alt={cat.name}
                            className="mx-auto h-24 w-24 border-0 rounded-full object-cover"
                        />
                        <p className="mt-2 text-sm font-medium">{cat.name}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const ArrowButton = ({
    direction,
    onClick,
}: {
    direction: 'next' | 'prev';
    onClick: () => void;
}) => (
    <button
        className={`absolute top-[-35px] ${
            direction === 'next' ? 'right-4' : 'right-20'
        } z-10 -translate-y-1/2 transform rounded-full bg-black/20 p-2 hover:bg-black/50`}
        onClick={onClick}
    >
        {direction === 'next' ? (
            <ArrowRight size={24} className="text-white" />
        ) : (
            <ArrowLeft size={24} className="text-white" />
        )}
    </button>
);

export default CaruselCategory;
