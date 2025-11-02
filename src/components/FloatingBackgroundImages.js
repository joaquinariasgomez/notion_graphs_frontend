import { useEffect, useState } from 'react';
import '../css/FloatingBackground.css';

function FloatingBackgroundImages() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define your floating images here
  // Add your image filenames to the public folder and reference them here
  const floatingImages = [
    {
      src: '/landing_page/background_right.jpeg',
      alt: 'Top left decoration',
      className: 'floating-image-top-left',
      parallaxSpeed: -0.3,
    },
    {
      src: '/landing_page/background_right.jpeg',
      alt: 'Top right decoration',
      className: 'floating-image-top-right',
      parallaxSpeed: -0.4,
    },
    {
      src: '/landing_page/background_right.jpeg',
      alt: 'Bottom left decoration',
      className: 'floating-image-bottom-left',
      parallaxSpeed: -0.25,
    },
    {
      src: '/landing_page/background_right.jpeg',
      alt: 'Bottom right decoration',
      className: 'floating-image-bottom-right',
      parallaxSpeed: -0.35,
    },
  ];

  return (
    <div className="floating-background-container">
      {floatingImages.map((image, index) => (
        <img
          key={index}
          src={process.env.PUBLIC_URL + image.src}
          alt={image.alt}
          className={`floating-image ${image.className}`}
          style={{
            transform: `translateY(${scrollY * image.parallaxSpeed}px)`,
          }}
          onError={(e) => {
            // Hide image if it doesn't exist yet
            e.target.style.display = 'none';
          }}
        />
      ))}
    </div>
  );
}

export default FloatingBackgroundImages;

