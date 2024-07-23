import React, { useState } from 'react';

const Swiper = ({ onSwipeLeft, onSwipeRight }) => {
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);

    const handleTouchStart = (event) => {
        setTouchStartX(event.touches[0].clientX);
    };

    const handleTouchEnd = (event) => {
        setTouchEndX(event.changedTouches[0].clientX);
        handleSwipe();
    };

    const handleSwipe = () => {
        const threshold = 50;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) >= threshold) {
            if (distance > 0) {
                onSwipeRight && onSwipeRight();
            } else {
                onSwipeLeft && onSwipeLeft();
            }
        }
    };

    return (
        <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
        >
            {/* Your content here */}
        </div>
    );
};

export default Swiper;

/*
<Swiper
    onSwipeLeft={() => {
        // Logic to navigate to the previous chapter
    }}
    onSwipeRight={() => {
        // Logic to navigate to the next chapter
    }}
>
     --- Your chapter content here --- 
    </Swiper>
*/