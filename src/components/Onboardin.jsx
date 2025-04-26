import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Onboarding = () => {
  const slides = [
    {
      img: "https://c.top4top.io/p_2020eq9aa1.png",
      title: "Boost Productivity",
      paragraph: "Foc.io helps you boost your productivity on a different level",
    },
    {
      img: "https://e.top4top.io/p_2020mx8xt3.png",
      title: "Work Seamlessly",
      paragraph: "Get your work done seamlessly without interruption",
    },
    {
      img: "https://d.top4top.io/p_20200jsuo2.png",
      title: "Achieve Higher Goals",
      paragraph: "By boosting your productivity we help you achieve higher goals",
    },
  ];

  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  // When finished becomes true, we’ll trigger navigation.
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    arrows: false,
  };

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      // Set the finished flag; do not call slider methods
      setFinished(true);
    } else {
      sliderRef.current.slickNext();
    }
  };

  useEffect(() => {
    if (finished) {
      // Optional: add any fade-out animations or state changes here
      localStorage.setItem('onboarded', 'true');
      // Trigger navigation immediately once finished is true.
      navigate('/', { replace: true });
    }
  }, [finished, navigate]);

  return (
    <div
      id="onboarding-wrapper"
      className="relative w-full max-w-[356px] bg-gray-800 rounded-[1.25rem] py-12 text-center overflow-hidden transition-opacity duration-500 ease-in-out"
    >
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="px-4">
            <img src={slide.img} alt="illustration" className="w-[90%] mx-auto" />
            <div className="px-9">
              <h2 className="text-xl font-semibold">{slide.title}</h2>
              <p className="text-sm font-light mt-1">{slide.paragraph}</p>
            </div>
          </div>
        ))}
      </Slider>

      <button
        onClick={handleNext}
        aria-label="to get next slide"
        className="bg-orange-500 text-white rounded px-6 py-3 text-lg my-5 transition-all duration-300 hover:opacity-80"
      >
        {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
      </button>
    </div>
  );
};

export default Onboarding;