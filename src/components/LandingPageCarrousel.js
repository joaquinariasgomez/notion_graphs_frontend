import { Children, useEffect, useRef, useState } from 'react';
import mockCharts from '../components/LandingPageCarrouselCharts.json';
import '../css/LandingPage.css';

function LandingPageCarrousel({ children }) {

  const [currentPage, setCurrentPage] = useState(1);  // 0, 1, 2, .. until totalItems
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);

  // Convert children to an array
  const childrenArray = Children.toArray(children);
  const totalItems = childrenArray.length;

  const updateCarrouselPosition = () => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children);
    if (items.length === 0) return;

    const container = track.parentElement;
    const itemWidth = items[0].offsetWidth;
    const containerWidth = container.getBoundingClientRect().width;

    // This value MUST match my .carousel-item -> margin value
    const margin = 5;
    const itemAdvance = itemWidth + margin * 2;

    const newOffset = Math.round(
      (containerWidth / 2) - (itemWidth / 2) - (currentPage * itemAdvance)
    );

    setOffset(newOffset);
  }

  useEffect(() => {
    updateCarrouselPosition();

    window.addEventListener('resize', updateCarrouselPosition);

    return () => {
      window.removeEventListener('resize', updateCarrouselPosition);
    }
  }, [currentPage, totalItems]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalItems - 1));
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < (totalItems - 1) ? prevPage + 1 : 0));
  }

  return (
    <div className='carrousel'>
      <div
        className='carrousel-track'
        ref={trackRef}
        style={{ transform: `translateX(${offset}px)` }}
      >
        {childrenArray.map((child, index) => (
          <div
            className={`chart-mock-item ${index === currentPage ? 'active' : ''}`}
            key={index}
          >
            <div className='chart-mock-title'>
              {mockCharts[index].graphConfiguration.customTitle}
            </div>
            <div className='chart-mock-graph'>
              {child}
            </div>
          </div>
        ))}
      </div>
      <div className='carrousel-arrows'>
        <button
          id="prevBtn"
          className="carousel-button prev"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          &lt;
        </button>
        <button
          id="nextBtn"
          className="carousel-button next"
          onClick={handleNextPage}
          disabled={currentPage === totalItems - 1} // Disable button at end
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default LandingPageCarrousel;