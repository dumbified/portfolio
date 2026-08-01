"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const ASCII_RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const CHAR_W = 5;
const CHAR_H = 7;
const FONT_SIZE = 8;
const BG_BRIGHTNESS_THRESHOLD = 0.1;
const SATURATION_BOOST = 4;
const BG_CHAR = "@";
const BG_OPACITY = 0.7;
const FRAME_INTERVAL = 90;

const SPRITE_COLS = 5;
const SPRITE_ROWS = 7;
const TOTAL_FRAMES = 30;

function boostColor(r: number, g: number, b: number): [number, number, number] {
  const avg = (r + g + b) / 3;
  return [
    Math.min(255, Math.max(0, Math.round(avg + (r - avg) * SATURATION_BOOST))),
    Math.min(255, Math.max(0, Math.round(avg + (g - avg) * SATURATION_BOOST))),
    Math.min(255, Math.max(0, Math.round(avg + (b - avg) * SATURATION_BOOST))),
  ];
}

function thermalColor(lum: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, lum));
  if (t < 0.2) {
    const s = t / 0.2;
    return [0, 0, Math.round(80 + 175 * s)];
  } else if (t < 0.4) {
    const s = (t - 0.2) / 0.2;
    return [0, Math.round(255 * s), 255];
  } else if (t < 0.6) {
    const s = (t - 0.4) / 0.2;
    return [Math.round(255 * s), 255, Math.round(255 * (1 - s))];
  } else if (t < 0.8) {
    const s = (t - 0.6) / 0.2;
    return [255, Math.round(255 * (1 - s)), 0];
  } else {
    const s = (t - 0.8) / 0.2;
    return [255, Math.round(255 * s), Math.round(255 * s)];
  }
}

interface AsciiSpriteProps {
  src: string;
  cols?: number;
  className?: string;
}

export default function AsciiSprite({ src, cols = 100, className }: AsciiSpriteProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const tmpCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const dirRef = useRef(1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const [paused, setPaused] = useState(false);
  const [inverted, setInverted] = useState(false);
  const invertedRef = useRef(false);
  const dimsRef = useRef({ cols: 0, rows: 0, frameW: 0, frameH: 0 });
  const readyRef = useRef(false);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const sprite = spriteRef.current;
    const tmp = tmpCanvasRef.current;
    if (!canvas || !sprite || !tmp) return;

    const ctx = canvas.getContext("2d");
    const tmpCtx = tmp.getContext("2d");
    if (!ctx || !tmpCtx) return;

    const { cols: asciiCols, rows: asciiRows, frameW, frameH } = dimsRef.current;
    const spriteCol = frameIndex % SPRITE_COLS;
    const spriteRow = Math.floor(frameIndex / SPRITE_COLS);
    const sx = spriteCol * frameW;
    const sy = spriteRow * frameH;

    tmp.width = asciiCols;
    tmp.height = asciiRows;
    tmpCtx.drawImage(sprite, sx, sy, frameW, frameH, 0, 0, asciiCols, asciiRows);
    const px = tmpCtx.getImageData(0, 0, asciiCols, asciiRows).data;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, asciiCols * CHAR_W, asciiRows * CHAR_H);
    ctx.font = `bold ${FONT_SIZE}px monospace`;
    ctx.textBaseline = "top";

    const isInverted = invertedRef.current;

    if (isInverted) {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, asciiCols * CHAR_W, asciiRows * CHAR_H);
    }

    for (let y = 0; y < asciiRows; y++) {
      for (let x = 0; x < asciiCols; x++) {
        const i = (y * asciiCols + x) * 4;
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const pxX = x * CHAR_W;
        const pxY = y * CHAR_H;

        if (lum < BG_BRIGHTNESS_THRESHOLD) {
          if (isInverted) {
            ctx.fillStyle = `rgba(0,0,80,${BG_OPACITY})`;
          } else {
            ctx.fillStyle = `rgba(0,0,0,${BG_OPACITY})`;
          }
          ctx.fillText(BG_CHAR, pxX, pxY);
        } else {
          const ci = Math.floor((1 - lum) * (ASCII_RAMP.length - 1));
          const ch = ASCII_RAMP[Math.min(ci, ASCII_RAMP.length - 1)];

          if (isInverted) {
            const [tr, tg, tb] = thermalColor(lum);
            ctx.fillStyle = `rgb(${tr},${tg},${tb})`;
          } else {
            const [br, bg, bb] = boostColor(r, g, b);
            ctx.fillStyle = `rgb(${br},${bg},${bb})`;
          }
          ctx.fillText(ch, pxX, pxY);
        }
      }
    }
  }, []);

  const resize = useCallback(() => {
    const sprite = spriteRef.current;
    const canvas = canvasRef.current;
    if (!sprite || !canvas) return;

    const frameW = sprite.width / SPRITE_COLS;
    const frameH = sprite.height / SPRITE_ROWS;
    const aspect = frameH / frameW;

    const containerW = wrapperRef.current?.offsetWidth || window.innerWidth;
    const asciiCols = Math.floor(containerW / CHAR_W);
    const asciiRows = Math.floor(asciiCols * aspect * 0.35);

    if (asciiCols < 1 || asciiRows < 1) return;

    dimsRef.current = { cols: asciiCols, rows: asciiRows, frameW, frameH };

    if (!tmpCanvasRef.current) {
      tmpCanvasRef.current = document.createElement("canvas");
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = asciiCols * CHAR_W * dpr;
    canvas.height = asciiRows * CHAR_H * dpr;
    canvas.style.width = asciiCols * CHAR_W + "px";
    canvas.style.height = asciiRows * CHAR_H + "px";

    readyRef.current = true;
    drawFrame(frameRef.current);
  }, [cols, drawFrame]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      spriteRef.current = img;
      resize();
    };
    img.src = src;
  }, [src, resize]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => {
      if (spriteRef.current) resize();
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [resize]);

  useEffect(() => {
    invertedRef.current = inverted;
    if (readyRef.current) drawFrame(frameRef.current);
  }, [inverted, drawFrame]);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!readyRef.current) return;

      frameRef.current += dirRef.current;

      if (frameRef.current >= TOTAL_FRAMES - 1) {
        frameRef.current = TOTAL_FRAMES - 1;
        dirRef.current = -1;
      } else if (frameRef.current <= 0) {
        frameRef.current = 0;
        dirRef.current = 1;
      }

      drawFrame(frameRef.current);
    }, FRAME_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, drawFrame]);

  return (
    <div ref={wrapperRef} className={className}>
      <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%" }} />
      <div className="mt-1 flex items-center justify-between">
        <button
          onClick={() => setInverted((v) => !v)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          [{inverted ? "normal" : "thermal"}]
        </button>
        <a
          href="https://knowyourmeme.com/memes/joe-emoji-emotiguy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          who dis?
        </a>
      </div>
    </div>
  );
}
