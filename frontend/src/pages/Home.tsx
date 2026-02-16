import { useState, useEffect } from 'react';
import './Home.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchSchedules } from '../api/schedule';
import { getSlides, type HomeSlide } from '../api/homeSlide';

interface DisplaySlide extends HomeSlide {
  isExternal: boolean;
}

const Home = () => {
  const [slides, setSlides] = useState<DisplaySlide[]>([]);
  const [current, setCurrent] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await getSlides();
        if (data.length > 0) {
          const formattedSlides = data.map(slide => ({
            ...slide,
            isExternal: slide.linkUrl.startsWith('http')
          }));

          // 앞뒤로 복사본 추가 (무한 루프용)
          setSlides([
            formattedSlides[formattedSlides.length - 1],
            ...formattedSlides,
            formattedSlides[0]
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSlides();
  }, []);

  const length = slides.length - 2; // 실제 슬라이드 개수 (앞뒤 복사본 제외)

  // 다음 슬라이드 이동 함수
  const nextSlide = () => {
    if (slides.length <= 1) return;
    if (current >= slides.length - 1) return;
    setIsTransitioning(true);
    setCurrent((prev) => prev + 1);
  };

  // 이전 슬라이드 이동 함수
  const prevSlide = () => {
    if (slides.length <= 1) return;
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
    if (slides.length <= 3) return; // 슬라이드가 1개 이하일 경우 (앞뒤 복사본 포함 3개) 자동 슬라이드 안 함
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState<{ date: string; title: string }[]>([]);

  useEffect(() => {
    const getSchedules = async () => {
      try {
        const data = await fetchSchedules();
        const formattedEvents = data.map((schedule) => ({
          date: schedule.startDateTime.split('T')[0],
          title: schedule.title,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };
    getSchedules();
  }, []);

  const handleDateChange = (nextValue: any) => {
    if (nextValue instanceof Date) {
      setValue(nextValue);
    }
  };

  const titleContent = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasEvent = events.find((e) => e.date === dateStr);
      return hasEvent ? <div className="event-dot"></div> : null;
    }
  };

  return (
    <div className="home-container">
      <section className="slider-section">
        {isLoading ? (
          <div className="loading-slider">Loading slides...</div>
        ) : slides.length === 0 ? (
          <div className="no-slides-placeholder">
            등록된 슬라이드가 없습니다.
          </div>
        ) : (
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
                      <img
                        src={slide.imageUrl}
                        alt="notice"
                        className="slide-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Infinite loop prevention
                          target.src = 'https://via.placeholder.com/1000x500?text=Image+Not+Found'; // Fallback
                          console.error('Image load failed:', slide.imageUrl);
                        }}
                      />
                      <div className="notice-overlay">
                        <p className="notice-text">{slide.title}</p>
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
                      {slide.linkUrl ? (
                        slide.isExternal ? (
                          <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" className="slide-link">
                            {SlideContent}
                          </a>
                        ) : (
                          <Link to={slide.linkUrl} className="slide-link">
                            {SlideContent}
                          </Link>
                        )
                      ) : (
                        <div className="slide-link">
                          {SlideContent}
                        </div>
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
        )}

        {!isLoading && slides.length > 0 && (
          <div className="dots">
            {Array.from({ length }).map((_, index) => (
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
        )}
      </section>

      <section className="calendar-section">
        <div className="calendar-container">
          <div className="section-header">
            <h2>동아리 일정</h2>
          </div>
          <div className="calendar-content">
            <div className="calendar-wrapper">
              <Calendar
                onChange={handleDateChange}
                value={value}
                formatDay={(_, date) => date.toLocaleDateString("en", { day: 'numeric' })}
                tileContent={titleContent}

                prev2Label={null}
                next2Label={null}
                minDetail="year"

                tileClassName={({ date, view }) => {
                  if (view === 'month') {
                    // 0은 일요일, 6은 토요일
                    if (date.getDay() === 0) return 'sun';
                    if (date.getDay() === 6) return 'sat';
                  }
                }}
              />
            </div>

            <div className="event-details">
              <h3>{value.toLocaleDateString()} 일정</h3>
              <ul className="event-list">
                {events
                  .filter(e => e.date === value.toISOString().split('T')[0])
                  .map((e, i) => (
                    <li key={i}>{e.title}</li>
                  ))
                }
                {events.filter(e => e.date === value.toISOString().split('T')[0]).length === 0 && (
                  <p className="no-events">등록된 일정이 없습니다.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;