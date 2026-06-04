import { useRef, useState, useEffect } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './ScrollableRow.css';

interface ScrollableRowProps {
  children:     React.ReactNode;
  scrollAmount?: number;
}

export default function ScrollableRow({ children, scrollAmount = 120 }: ScrollableRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };

    check();
    el.addEventListener('scroll', check, { passive: true });

    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    return () => {
      el.removeEventListener('scroll', check);
      ro.disconnect();
    };
  }, []);

  const hasArrows = canScrollLeft || canScrollRight;

  const scrollTo = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

  return (
    <div className="scrollable-row">
      {hasArrows && (
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => canScrollLeft && scrollTo('left')}
          aria-label="Scroll left"
          className="scrollable-row__arrow"
        />
      )}

      <div ref={scrollRef} className="scrollable-row__track">
        {children}
      </div>

      {hasArrows && (
        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={() => canScrollRight && scrollTo('right')}
          aria-label="Scroll right"
          className="scrollable-row__arrow"
        />
      )}
    </div>
  );
}
