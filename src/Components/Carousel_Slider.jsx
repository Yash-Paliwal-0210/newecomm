import React, { useState, useEffect } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { db, storage } from '../Firebase/Config';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';

export default function Carousel_Slider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highlights, setHighlights] = useState([]);
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      });
  
      try {
        await Promise.all(imagePromises);
        console.log("All images preloaded");
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };
  
    if (slides.length > 0) preloadImages();
  }, [slides]);
  
  // Fetch images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const listRef = ref(storage, 'images/banners/');
        const res = await listAll(listRef);
        const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
        console.log("Fetched URLs:", urls);
        setSlides(urls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
  
    fetchImages();
  }, []);
  

  // Fetch Highlights from Firestore
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const sliderCollectionRef = collection(db, 'Slider');
        const sliderSnapshot = await getDocs(sliderCollectionRef);
        
        // Assuming there is only one document or you need the first one
        sliderSnapshot.forEach(doc => {
          const data = doc.data();
          const highlightsArray = data.Highlights || []; // Fetch Highlights as array
          
          // Set the highlights array to state
          setHighlights(highlightsArray);
        });
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };

    fetchHighlights();
  }, []); // Only run once when the component is mounted

  // Slide navigation functions
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Auto slide transition every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <>
      {/* Display Highlights inside marquee */}

      {/* Carousel Slider */}
      <div className="relative w-full max-w-5xl h-[600px] sm:h-[550px] mx-auto overflow-hidden">
  <marquee direction="left" className="absolute bg-black text-white z-10 py-1">
    {highlights.length > 0 ? (
      highlights.map((highlight, index) => (
        <span key={index} className="mx-2">*{highlight}</span>
      ))
    ) : (
      <span>No highlights available</span>
    )}
  </marquee>
  {slides.length > 0 ? (
    <>
      {slides.map((url, index) => (
  <img
    key={index}
    src={url}
    alt={`Slide ${index}`}
    className={`w-full h-full object-cover rounded-lg absolute top-0 left-0 ${
      slides.length === 1 || index === currentIndex ? 'opacity-100' : 'opacity-0'
    } transition-opacity duration-500 ease-in-out`}
  />
))}

  
      {slides.length > 1 && (
        <>
          <div className="absolute top-1/2 w-full flex justify-between transform -translate-y-1/2 px-4">
            <div
              className="bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer"
              onClick={prevSlide}
            >
              <BsChevronCompactLeft size={30} />
            </div>
            <div
              className="bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer"
              onClick={nextSlide}
            >
              <BsChevronCompactRight size={30} />
            </div>
          </div>
          <div className="absolute bottom-5 w-full flex justify-center">
            {slides.map((_, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`cursor-pointer mx-1 text-gray-400 ${
                  index === currentIndex ? 'text-gray-800' : ''
                }`}
              >
                <RxDotFilled size={24} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="loader"></div>
    </div>
  )}
</div>

    </>
  );
}
