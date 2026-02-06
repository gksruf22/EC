import React, { useState, useEffect } from 'react';
import './Home.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const originalSlides = [
    // 관리자 페이지에서 관리할 수 있게 할 예정(일단은 하드코딩으로)
    { id: 1, image: 'https://via.placeholder.com/1000x500/333/fff?text=Slide+1', notice: '[공지] 2026년도 신입 부원 모집 안내', path: '/apply', isExternal: false },
    { id: 2, image: 'https://via.placeholder.com/1000x500/444/fff?text=Slide+2', notice: '[알림] 제 35회 정기 세미나 개최 안내', path: '/notice', isExternal: false },
    { id: 3, image: 'https://via.placeholder.com/1000x500/555/fff?text=Slide+3', notice: '[소식] 대학생 공모전 안내', path: 'https://google.com', isExternal: true },
  ];

  const slides = [
    originalSlides[originalSlides.length - 1],
    ...originalSlides,
    originalSlides[0]
  ]

  const [current, setCurrent] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const length = originalSlides.length;

  // 다음 슬라이드 이동 함수
  const nextSlide = () => {
    if (current >= slides.length - 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => prev + 1);
  };

  // 이전 슬라이드 이동 함수
  const prevSlide = () => {
    if (current <= 0) return;
    setIsTransitioning(true);
    setCurrent((prev) => prev - 1);
  };

  // 무한 루프 슬라이드
  const handleTransitionEnd = () => {
    if (current === 0) {
      setIsTransitioning(false);
      setCurrent(length);
    } else if (current === length + 1) {
      setIsTransitioning(false);
      setCurrent(1);
    }
  };

  // 자동 슬라이드 설정 (3초마다 실행)
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [current])

  return (
    <div className="home-container">
      <section className="slider-section">
        <div className="slider-container">
          <button className="arrow left-arrow" onClick={prevSlide}>
            <FaChevronLeft />
          </button>

          <div className="slider-window">
            <div 
              className="slider-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(calc(15% - ${current * 70}%))`,
                transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none',
              }}
            >
              {slides.map((slide, index) => {
                const isCurrent = index === current;

                const SlideContent = (
                  <>
                    <img src={slide.image} alt="notice" className="slide-image" />
                    <div className="notice-overlay">
                      <p className="notice-text">{slide.notice}</p>
                    </div>
                  </>
                );

                return (
                  <div
                    key={index}
                    className={`slide ${isCurrent ? 'activeSlide' : ''}`}
                    style={{
                      transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none',
                      transform: isCurrent ? 'scale(1)' : 'scale(0.85)',
                      opacity: isCurrent ? 1 : 0.5,
                    }}
                  >
                    {slide.isExternal ? (
                      <a href={slide.path} target="_blank" rel="noopener noreferrer" className="slide-link">
                        {SlideContent}
                      </a>
                    ) : (
                      <Link to={slide.path} className="slide-link">
                        {SlideContent}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="arrow right-arrow" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>

        <div className="dots">
          {originalSlides.map((_, index) => (
            <span
              key={index}
              className={current === index + 1 || (current === 0 && index === length - 1) || (current === length + 1 && index === 0) ? 'dot active' : 'dot'}
              onClick={() => {
                setIsTransitioning(true);
                setCurrent(index + 1);
              }}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;