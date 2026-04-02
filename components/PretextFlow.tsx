import React, { useRef, useEffect, useState, useCallback } from 'react';
import { prepareWithSegments, layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext';

type FlowLine = {
  x: number;
  y: number;
  text: string;
  width: number;
};

type HexObstacle = {
  cx: number;
  cy: number;
  radius: number;
};

function hexagonContainsLine(hex: HexObstacle, lineY: number, lineHeight: number, padding: number): { leftCut: number; rightCut: number } | null {
  const bandTop = lineY;
  const bandBottom = lineY + lineHeight;
  const r = hex.radius + padding;

  // Check if band intersects hexagon vertical extent
  if (bandBottom < hex.cy - r || bandTop > hex.cy + r) return null;

  // Use the midpoint of the band for width calculation
  const midY = (bandTop + bandBottom) / 2;
  const dy = Math.abs(midY - hex.cy);

  if (dy > r) return null;

  // Hexagon horizontal extent at this y — approximation using circle
  const halfWidth = Math.sqrt(r * r - dy * dy);
  return {
    leftCut: hex.cx - halfWidth,
    rightCut: hex.cx + halfWidth,
  };
}

function layoutAroundHex(
  prepared: PreparedTextWithSegments,
  containerWidth: number,
  lineHeight: number,
  hex: HexObstacle,
  padding: number,
): FlowLine[] {
  const lines: FlowLine[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = 0;
  const maxLines = 200;

  for (let i = 0; i < maxLines; i++) {
    const cut = hexagonContainsLine(hex, y, lineHeight, padding);

    if (cut) {
      // Text flows on both sides of the obstacle
      // Left side
      const leftWidth = Math.max(0, cut.leftCut);
      if (leftWidth > 40) {
        const line = layoutNextLine(prepared, cursor, leftWidth);
        if (line === null) break;
        lines.push({ x: 0, y, text: line.text, width: line.width });
        cursor = line.end;
      }

      // Right side
      const rightStart = cut.rightCut;
      const rightWidth = Math.max(0, containerWidth - rightStart);
      if (rightWidth > 40) {
        const line = layoutNextLine(prepared, cursor, rightWidth);
        if (line === null) break;
        lines.push({ x: rightStart, y, text: line.text, width: line.width });
        cursor = line.end;
      }

      // If neither side had room, skip
      if (leftWidth <= 40 && rightWidth <= 40) {
        // no text on this line
      }
    } else {
      // No obstacle — full width line
      const line = layoutNextLine(prepared, cursor, containerWidth);
      if (line === null) break;
      lines.push({ x: 0, y, text: line.text, width: line.width });
      cursor = line.end;
    }

    y += lineHeight;
  }

  return lines;
}

const ABOUT_TEXT =
  "CHAINFIND is an elite collective of technologists operating at the intersection of Artificial Intelligence, Blockchain, and Network Security. " +
  "We don't just build software; we architect decentralized ecosystems and intelligent agents that operate securely in the shadows of the digital infrastructure. " +
  "Our neural networks scan, analyze, and adapt to emerging cyber threats in real-time. " +
  "Every smart contract we deploy is battle-tested across adversarial environments. " +
  "Every AI model we train pushes the boundary between human intuition and machine precision. " +
  "From zero-knowledge proof systems to autonomous security agents, we engineer the invisible protocols that keep the decentralized future trustworthy, resilient, and unstoppable. " +
  "This is not just technology. This is the next evolution of digital sovereignty.";

const FONT = '14px "JetBrains Mono", monospace';
const LINE_HEIGHT = 22;

export default function PretextFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<FlowLine[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [revealedLines, setRevealedLines] = useState(0);

  const computeLayout = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    if (width === 0) return;
    setContainerWidth(width);

    const prepared = prepareWithSegments(ABOUT_TEXT, FONT);
    const hexRadius = Math.min(width * 0.18, 90);
    const hex: HexObstacle = {
      cx: width / 2,
      cy: hexRadius + LINE_HEIGHT * 3,
      radius: hexRadius,
    };

    const flowLines = layoutAroundHex(prepared, width, LINE_HEIGHT, hex, 18);
    setLines(flowLines);
  }, []);

  useEffect(() => {
    computeLayout();

    const observer = new ResizeObserver(() => computeLayout());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeLayout]);

  // Intersection observer for scroll-triggered reveal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Staggered line reveal animation
  useEffect(() => {
    if (!visible || lines.length === 0) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setRevealedLines(frame);
      if (frame >= lines.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [visible, lines.length]);

  const hexRadius = containerWidth > 0 ? Math.min(containerWidth * 0.18, 90) : 70;
  const hexCx = containerWidth / 2;
  const hexCy = hexRadius + LINE_HEIGHT * 3;
  const totalHeight = lines.length > 0
    ? lines[lines.length - 1]!.y + LINE_HEIGHT + 20
    : 400;

  // Generate hexagon points
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${hexCx + hexRadius * Math.cos(angle)},${hexCy + hexRadius * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: totalHeight }}>
      {/* Hexagon obstacle - glowing cyber shape */}
      {containerWidth > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={containerWidth}
          height={totalHeight}
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="hex-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="hex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff00" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00cc44" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00ff00" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Outer glow */}
          <polygon
            points={hexPoints}
            fill="none"
            stroke="#00ff00"
            strokeWidth="1"
            opacity="0.15"
            filter="url(#hex-glow)"
          />

          {/* Main hex border */}
          <polygon
            points={hexPoints}
            fill="url(#hex-gradient)"
            stroke="#00ff00"
            strokeWidth="1.5"
            opacity={visible ? 0.8 : 0}
            style={{ transition: 'opacity 1s ease' }}
          />

          {/* Inner decorative hex */}
          <polygon
            points={Array.from({ length: 6 }, (_, i) => {
              const angle = (Math.PI / 3) * i - Math.PI / 2;
              const r = hexRadius * 0.7;
              return `${hexCx + r * Math.cos(angle)},${hexCy + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="#00ff00"
            strokeWidth="0.5"
            opacity="0.3"
            strokeDasharray="4 4"
          />

          {/* Center label */}
          <text
            x={hexCx}
            y={hexCy - 8}
            textAnchor="middle"
            fill="#00ff00"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            opacity="0.7"
          >
            PRETEXT
          </text>
          <text
            x={hexCx}
            y={hexCy + 6}
            textAnchor="middle"
            fill="#00ff00"
            fontSize="8"
            fontFamily="JetBrains Mono, monospace"
            opacity="0.5"
          >
            LAYOUT_ENGINE
          </text>
          <text
            x={hexCx}
            y={hexCy + 18}
            textAnchor="middle"
            fill="#00ff00"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
            opacity="0.35"
          >
            DOM-FREE // 300x
          </text>
        </svg>
      )}

      {/* Text lines positioned by Pretext */}
      {lines.map((line, i) => (
        <span
          key={`${i}-${line.x}`}
          className="absolute font-mono text-sm leading-[22px] whitespace-pre"
          style={{
            left: line.x,
            top: line.y,
            color: i < revealedLines
              ? 'rgba(209, 213, 219, 0.9)'
              : 'transparent',
            transition: 'color 0.3s ease',
            textShadow: i < revealedLines ? '0 0 8px rgba(0,255,0,0.1)' : 'none',
          }}
        >
          {line.text}
        </span>
      ))}

      {/* Scan line effect */}
      {visible && revealedLines < lines.length && (
        <div
          className="absolute left-0 right-0 h-[2px] bg-green-500/40 pointer-events-none"
          style={{
            top: revealedLines * LINE_HEIGHT,
            boxShadow: '0 0 12px rgba(0,255,0,0.4)',
            transition: 'top 25ms linear',
          }}
        />
      )}
    </div>
  );
}
