import React, { useState, useEffect, useRef } from 'react';

const Onboarding = () => {
  // Refs for DOM elements
  const wrapperRef = useRef(null);
  const slidesAreaRef = useRef(null);
  const nextButtonRef = useRef(null);
  const paginationsAreaRef = useRef(null);

  // Slides data
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

  const slidesCount = slides.length;
  const slidesCountMinusOne = slidesCount - 1;
  const unit = 'px';

  // States for slide position and move value
  const [slidePosition, setSlidePosition] = useState(0);
  const [moveValue, setMoveValue] = useState(0);

  // Update the slides area width based on the wrapper's width
  const updateWrapperWidth = (width) => {
    if (!width && wrapperRef.current) {
      width = wrapperRef.current.offsetWidth;
    }
    if (slidesAreaRef.current) {
      slidesAreaRef.current.style.width = `${width * slidesCount}${unit}`;
    }
    if (slidePosition > 0 && wrapperRef.current && slidesAreaRef.current) {
      const newMoveValue = width;
      setMoveValue(newMoveValue);
      slidesAreaRef.current.style.marginLeft = `-${newMoveValue}${unit}`;
      if (slidePosition === slidesCountMinusOne) {
        slidesAreaRef.current.style.marginLeft = `-${width * slidesCountMinusOne}${unit}`;
      }
    }
  };

  // Update the Next button's style and text content
  const updateNextButton = () => {
    if (nextButtonRef.current) {
      // Add fade effect (using Tailwind classes)
      nextButtonRef.current.classList.add('opacity-30', 'pointer-events-none', 'blur-sm');
      setTimeout(() => {
        nextButtonRef.current.classList.remove('opacity-30', 'pointer-events-none', 'blur-sm');
      }, 500);
      setTimeout(() => {
        nextButtonRef.current.textContent =
          slidePosition === slidesCountMinusOne ? 'Get Started' : 'Next';
      }, 550);
    }
  };

  // Create pagination dots based on the slide count
  const createPaginationItems = () => {
    if (paginationsAreaRef.current) {
      paginationsAreaRef.current.innerHTML = '';
      for (let i = 0; i < slidesCount; i++) {
        const span = document.createElement('span');
        // Base styling for each dot using Tailwind
        span.className =
          'inline-block w-2 h-1.5 bg-gray-400 rounded-full mr-1';
        if (i === slidePosition) {
          // Active dot
          span.classList.add('w-6', 'bg-white');
        }
        paginationsAreaRef.current.appendChild(span);
      }
    }
  };

  // Actions for when onboarding is finished (last slide)
  const getStartedActions = () => {
    document.body.style.backgroundColor = '#22201E'; // approximate for var(--color-dark)
    if (wrapperRef.current) {
      wrapperRef.current.classList.add('opacity-0', 'invisible');
    }
  };

  // Handle Next button click
  const moveToNextSlide = () => {
    const wrapperWidth = wrapperRef.current ? wrapperRef.current.offsetWidth : 0;
    if (slidePosition === slidesCountMinusOne) {
      getStartedActions();
    } else {
      const newSlidePosition = slidePosition + 1;
      setSlidePosition(newSlidePosition);
      const newMoveValue = moveValue + wrapperWidth;
      setMoveValue(newMoveValue);
      if (slidesAreaRef.current) {
        slidesAreaRef.current.style.marginLeft = `-${newMoveValue}${unit}`;
      }
    }
    updateNextButton();
    createPaginationItems();
  };

  // Update wrapper width and pagination on mount and when slidePosition changes.
  useEffect(() => {
    updateWrapperWidth();
    createPaginationItems();
    const handleResize = () => updateWrapperWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidePosition]);

  return (
    <main
      ref={wrapperRef}
      className="relative w-full max-w-[356px] bg-gray-800 rounded-[1.25rem] py-12 text-center overflow-hidden transition-opacity duration-500 ease-in-out"
    >
      {/* Slides Area */}
      <section
        ref={slidesAreaRef}
        className="flex transition-all duration-500 ease-in-out"
      >
        {slides.map((slide, index) => (
          <article key={index} className="w-full">
            <img
              src={slide.img}
              alt="illustration"
              className="w-[90%] mx-auto"
            />
            <div className="px-9">
              <h2 className="text-xl font-semibold m-0">{slide.title}</h2>
              <p className="text-sm font-light mt-1">{slide.paragraph}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Next Button */}
      <button
        ref={nextButtonRef}
        onClick={moveToNextSlide}
        aria-label="to get next slide"
        className="bg-orange-500 text-white rounded px-6 py-3 text-lg my-5 transition-opacity duration-300"
      >
        Next
      </button>

      {/* Paginations Area */}
      <section ref={paginationsAreaRef} className="pointer-events-none"></section>
    </main>
  );
};

export default Onboarding;
