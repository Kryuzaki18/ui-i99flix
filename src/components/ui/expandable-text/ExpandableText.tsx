import { useState, useRef, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface ExpandableTextProps {
  text: string;
  collapsedLines?: number;
  color?: string;
  fontSize?: number | string;
  lineHeight?: number;
}

export default function ExpandableText({
  text,
  collapsedLines = 3,
  color,
  fontSize = 14,
  lineHeight = 1.7,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > el.clientHeight + 2);
  }, [text, collapsedLines]);

  const collapsedStyle: React.CSSProperties = {
    display: '-webkit-box',
    WebkitLineClamp: collapsedLines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  };

  return (
    <div>
      <div
        ref={measureRef}
        aria-hidden
        style={{
          ...collapsedStyle,
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          fontSize,
          lineHeight,
        }}
      >
        {text}
      </div>

      <div
        style={{
          fontSize,
          lineHeight,
          color,
          overflow: 'hidden',
          maxHeight: expanded ? undefined : `calc(${collapsedLines} * ${lineHeight}em)`,
          transition: 'max-height 0.35s ease',
        }}
      >
        {text}
      </div>

      {overflows && (
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            marginTop: 6,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: '#e50914',
            letterSpacing: '0.3px',
            transition: 'opacity 0.2s ease',
          }}
          aria-expanded={expanded}
        >
          {expanded ? (
            <>Show less <UpOutlined style={{ fontSize: 10 }} /></>
          ) : (
            <>View more <DownOutlined style={{ fontSize: 10 }} /></>
          )}
        </button>
      )}
    </div>
  );
}
