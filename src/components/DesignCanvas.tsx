"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tool = "brush" | "text" | "rect" | "circle" | "line" | "arrow" | "eraser" | "move" | "pattern" | "symbol" | "fill" | "gradient" | "star" | "heart" | "diamond" | "triangle" | "hexagon" | "measure" | "hand" | "template";
type StrokeStyle = "solid" | "dashed" | "dotted";

interface Layer {
  type: string;
  data: any;
  id: string;
  opacity: number;
  name: string;
  visible: boolean;
  locked: boolean;
}

interface ColorPreset {
  name: string;
  hex: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: "Rojo", hex: "#DC2626" }, { name: "Naranja", hex: "#EA580C" },
  { name: "Amarillo", hex: "#CA8A04" }, { name: "Verde", hex: "#16A34A" },
  { name: "Azul", hex: "#2563EB" }, { name: "Púrpura", hex: "#7C3AED" },
  { name: "Rosa", hex: "#DB2777" }, { name: "Negro", hex: "#18181B" },
  { name: "Blanco", hex: "#FAFAFA" }, { name: "Gris", hex: "#52525B" },
  { name: "Dorado", hex: "#D4A843" }, { name: "Plata", hex: "#A1A1AA" },
  { name: "Borgoña", hex: "#7F1D1D" }, { name: "Turquesa", hex: "#0D9488" },
  { name: "Chocolate", hex: "#78350F" }, { name: "Oro rosado", hex: "#B76E79" },
  { name: "Coral", hex: "#FF6B6B" }, { name: "Lavanda", hex: "#A78BFA" },
  { name: "Mint", hex: "#34D399" }, { name: "Vino", hex: "#8B1A4A" },
];

const PATTERNS = [
  { name: "Rayas", colors: ["#DC2626", "#FFFFFF"] },
  { name: "Cuadros", colors: ["#2563EB", "#FFFFFF"] },
  { name: "Puntos", colors: ["#DB2777", "#FFFFFF"] },
  { name: "Geométrico", colors: ["#D4A843", "#18181B"] },
  { name: "Tropical", colors: ["#16A34A", "#0D9488"] },
  { name: "Andino", colors: ["#7C3AED", "#D4A843"] },
  { name: "Houndstooth", colors: ["#18181B", "#52525B"] },
  { name: "Cuadro Vichy", colors: ["#DC2626", "#F5F5F5"] },
];

const SYMBOLS = [
  { name: "Chakana", path: "M12 2C4.5 2 2 6 2 12c0 3 1.5 5.5 4 7M12 2c7.5 0 10-4 10-7 0 3-2.5 5.5-5 7M12 2l2 4M12 2l-2 4M2 12h20M7 7l5 10M17 7l-5 10" },
  { name: "Sol", path: "M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" },
  { name: "Estrella", path: "M12 2l2 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" },
  { name: "Hoja", path: "M12 2C8 6 3 10 3 15c0 3 2 5 5 8 1-2 2-4 4-6 2-3 4-5 6-6-2 0-4-1-5-3-1 1-2 2-3 2-1 0-1-1-1-2 0-1 1-2 2-3-1 0-2-1-2-2-1 1-1 2-1 3 0 1 1 2 2 3" },
  { name: "Llave", path: "M8 2C5.8 2 4 3.8 4 6c0 2.2 1.8 4 4 4M8 6v4M8 6c2.2 0 4 1.8 4 4" },
  { name: "Escudo", path: "M12 2L3 7v6c0 3.5 2.5 7 9 8 6.5-1 9-4.5 9-8V7l-9-5z" },
];

const TEMPLATES = [
  { name: "Camiseta", icon: "👕", shape: "rect" },
  { name: "Polera", icon: "🧥", shape: "rect" },
  { name: "Vestido", icon: "👗", shape: "circle" },
  { name: "Bufanda", icon: "🧣", shape: "rect" },
  { name: "Sombrero", icon: "🎩", shape: "circle" },
  { name: "Anillo", icon: "💍", shape: "circle" },
  { name: "Collar", icon: "📿", shape: "line" },
  { name: "Bolso", icon: "👜", shape: "rect" },
  { name: "Cinturón", icon: "🤎", shape: "rect" },
  { name: "Gorra", icon: "🧢", shape: "rect" },
];

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [bgColor, setBgColor] = useState("#f5f5f5");
  const [text, setText] = useState("");
  const [textFont, setTextFont] = useState("Arial");
  const [textStyle, setTextStyle] = useState<"normal" | "bold" | "italic">("normal");
  const [textSize, setTextSize] = useState(24);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [strokeStyle, setStrokeStyle] = useState<StrokeStyle>("solid");
  const [fillShape, setFillShape] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number }[]>([]);
  const [undoStack, setUndoStack] = useState<Layer[][]>([]);
  const [redoStack, setRedoStack] = useState<Layer[][]>([]);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);
  const [canvasSize] = useState({ w: 600, h: 600 });
  const [showRulers, setShowRulers] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gradientColors, setGradientColors] = useState(["#DC2626", "#2563EB"]);

  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !ctx.current) return;
    const w = c.width;
    const h = c.height;
    ctx.current.clearRect(0, 0, w, h);
    ctx.current.fillStyle = bgColor;
    ctx.current.fillRect(0, 0, w, h);
    if (showGrid) drawGrid(ctx.current, w, h);
    layers.forEach((layer) => {
      if (layer.visible) drawLayer(ctx.current!, layer);
    });
    if (measureStart && measureEnd && tool === "measure") {
      drawMeasure(ctx.current!, measureStart, measureEnd);
    }
  }, [layers, bgColor, showGrid, measureStart, measureEnd, tool]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = canvasSize.w;
    c.height = canvasSize.h;
    ctx.current = c.getContext("2d");
    redraw();
  }, []);

  useEffect(() => { redraw(); }, [bgColor, showGrid, opacity]);

  const drawGrid = (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.strokeStyle = "rgba(0,0,0,0.06)";
    c.lineWidth = 0.5;
    for (let x = 0; x <= w; x += 20) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y <= h; y += 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.strokeStyle = "rgba(0,0,0,0.15)";
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke();
    c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.stroke();
  };

  const drawMeasure = (c: CanvasRenderingContext2D, s: { x: number; y: number }, e: { x: number; y: number }) => {
    const dist = Math.sqrt((e.x - s.x) ** 2 + (e.y - s.y) ** 2);
    const inCm = (dist / canvasSize.w * 30).toFixed(1);
    c.strokeStyle = "#DC2626";
    c.lineWidth = 1;
    c.setLineDash([4, 4]);
    c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(e.x, e.y); c.stroke();
    c.setLineDash([]);
    c.fillStyle = "#DC2626";
    c.font = "12px Arial";
    c.fillText(`${inCm} cm`, (s.x + e.x) / 2, (s.y + e.y) / 2 - 8);
    c.beginPath(); c.moveTo(s.x, s.y - 6); c.lineTo(s.x, s.y + 6); c.stroke();
    c.beginPath(); c.moveTo(e.x, e.y - 6); c.lineTo(e.x, e.y + 6); c.stroke();
  };

  const drawLayer = (c: CanvasRenderingContext2D, layer: Layer) => {
    c.save();
    c.globalAlpha = layer.opacity;
    switch (layer.type) {
      case "brush": {
        const pts = layer.data.points;
        if (pts.length < 2) break;
        c.strokeStyle = layer.data.color;
        c.lineWidth = layer.data.size;
        c.lineCap = "round"; c.lineJoin = "round";
        c.setLineDash(layer.data.strokeStyle === "dashed" ? [8, 4] : layer.data.strokeStyle === "dotted" ? [2, 4] : []);
        c.beginPath(); c.moveTo(pts[0].x, pts[0].y);
        pts.forEach((p: { x: number; y: number }) => c.lineTo(p.x, p.y));
        c.stroke(); c.setLineDash([]);
        break;
      }
      case "text": {
        c.font = `${layer.data.style === "italic" ? "italic " : ""}${layer.data.style === "bold" ? "bold " : ""}${layer.data.size}px ${layer.data.font}`;
        c.fillStyle = layer.data.color;
        c.fillText(layer.data.text, layer.data.x, layer.data.y);
        break;
      }
      case "rect": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size;
        c.setLineDash(layer.data.strokeStyle === "dashed" ? [8, 4] : layer.data.strokeStyle === "dotted" ? [2, 4] : []);
        if (layer.data.fill) { c.fillStyle = layer.data.color; c.fillRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h); }
        else { c.strokeRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h); }
        c.setLineDash([]); break;
      }
      case "circle": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size;
        c.setLineDash(layer.data.strokeStyle === "dashed" ? [8, 4] : layer.data.strokeStyle === "dotted" ? [2, 4] : []);
        const rx = Math.abs(layer.data.w) / 2; const ry = Math.abs(layer.data.h) / 2;
        const cx = layer.data.x + layer.data.w / 2; const cy = layer.data.y + layer.data.h / 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; c.beginPath(); c.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2); c.fill(); }
        else { c.beginPath(); c.arc(cx, cy, Math.max(rx, ry), 0, Math.PI * 2); c.stroke(); }
        c.setLineDash([]); break;
      }
      case "line": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size;
        c.setLineDash(layer.data.strokeStyle === "dashed" ? [8, 4] : layer.data.strokeStyle === "dotted" ? [2, 4] : []);
        c.beginPath(); c.moveTo(layer.data.x1, layer.data.y1); c.lineTo(layer.data.x2, layer.data.y2); c.stroke();
        c.setLineDash([]); break;
      }
      case "arrow": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size;
        c.beginPath(); c.moveTo(layer.data.x1, layer.data.y1); c.lineTo(layer.data.x2, layer.data.y2); c.stroke();
        const angle = Math.atan2(layer.data.y2 - layer.data.y1, layer.data.x2 - layer.data.x1);
        const headLen = 15; c.beginPath();
        c.moveTo(layer.data.x2, layer.data.y2);
        c.lineTo(layer.data.x2 - headLen * Math.cos(angle - 0.4), layer.data.y2 - headLen * Math.sin(angle - 0.4));
        c.lineTo(layer.data.x2 - headLen * Math.cos(angle + 0.4), layer.data.y2 - headLen * Math.sin(angle + 0.4));
        c.closePath(); c.fillStyle = layer.data.color; c.fill(); break;
      }
      case "pattern": {
        const p = PATTERNS[layer.data.patternIndex];
        const { x, y, w, h } = layer.data;
        c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
        c.fillStyle = p.colors[0]; c.fillRect(x, y, w, h);
        c.strokeStyle = p.colors[1]; c.lineWidth = 2;
        const name = layer.data.patternName;
        if (name === "Rayas") { for (let i = y; i < y + h; i += 20) { c.beginPath(); c.moveTo(x, i); c.lineTo(x + w, i); c.stroke(); } }
        else if (name === "Cuadros") { for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.strokeRect(i, j, 20, 20); } } }
        else if (name === "Puntos") { for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.beginPath(); c.arc(i + 10, j + 10, 4, 0, Math.PI * 2); c.fill(); } } }
        else if (name === "Geométrico") { for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.beginPath(); c.moveTo(i, j); c.lineTo(i + 20, j + 20); c.moveTo(i + 20, j); c.lineTo(i, j + 20); c.stroke(); } } }
        else if (name === "Tropical") { for (let i = x; i < x + w; i += 40) { for (let j = y; j < y + h; j += 40) { c.beginPath(); c.arc(i, j, 15, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(i + 20, j + 20, 10, 0, Math.PI * 2); c.stroke(); } } }
        else if (name === "Andino") { for (let i = x; i < x + w; i += 30) { for (let j = y; j < y + h; j += 30) { c.beginPath(); c.moveTo(i + 15, j); c.lineTo(i, j + 15); c.lineTo(i + 15, j + 30); c.lineTo(i + 30, j + 15); c.closePath(); c.stroke(); } } }
        else if (name === "Houndstooth") { for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.fillStyle = (Math.floor(i / 20) + Math.floor(j / 20)) % 2 === 0 ? p.colors[0] : p.colors[1]; c.fillRect(i, j, 20, 20); c.fillStyle = (Math.floor(i / 20) + Math.floor(j / 20)) % 2 === 0 ? p.colors[1] : p.colors[0]; c.fillRect(i + 10, j + 10, 20, 20); } } }
        else { for (let i = x; i < x + w; i += 15) { for (let j = y; j < y + h; j += 15) { c.fillStyle = (Math.floor(i / 15) + Math.floor(j / 15)) % 2 === 0 ? p.colors[0] : p.colors[1]; c.fillRect(i, j, 15, 15); c.fillStyle = (Math.floor(i / 15) + Math.floor(j / 15)) % 2 === 0 ? p.colors[1] : p.colors[0]; c.fillRect(i + 7.5, j + 7.5, 15, 15); } } }
        c.restore(); break;
      }
      case "symbol": {
        const sym = SYMBOLS[layer.data.symbolIndex];
        const { x, y, size } = layer.data;
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 3; c.setLineDash([]);
        const parts = sym.path.split("M").filter((s: string) => s.trim());
        parts.forEach((seg: string) => {
          const coords = seg.trim().split(/[LZ]/).filter((s: string) => s.trim());
          if (coords.length === 0) return;
          const first = coords[0].split(" ").map(Number);
          if (first.length >= 2 && !isNaN(first[0]) && !isNaN(first[1])) {
            c.beginPath(); c.moveTo(x + first[0] * size / 30, y + first[1] * size / 30);
            coords.slice(1).forEach((p: string) => {
              const [xx, yy] = p.split(" ").map(Number);
              if (!isNaN(xx) && !isNaN(yy)) c.lineTo(x + xx * size / 30, y + yy * size / 30);
            });
            c.stroke();
          }
        });
        break;
      }
      case "star": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; }
        const sx = layer.data.x; const sy = layer.data.y; const sr = layer.data.size || 30;
        c.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const outerX = sx + sr * Math.cos(angle);
          const outerY = sy + sr * Math.sin(angle);
          if (i === 0) c.moveTo(outerX, outerY); else c.lineTo(outerX, outerY);
          const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
          const innerX = sx + sr * 0.4 * Math.cos(innerAngle);
          const innerY = sy + sr * 0.4 * Math.sin(innerAngle);
          c.lineTo(innerX, innerY);
        }
        c.closePath();
        if (layer.data.fill) c.fill(); else c.stroke();
        break;
      }
      case "heart": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; }
        const hx = layer.data.x; const hy = layer.data.y; const hr = layer.data.size || 30;
        c.beginPath();
        c.moveTo(hx, hy + hr * 0.3);
        c.bezierCurveTo(hx - hr, hy - hr * 0.5, hx - hr * 0.5, hy - hr, hx, hy - hr * 0.5);
        c.bezierCurveTo(hx + hr * 0.5, hy - hr, hx + hr, hy - hr * 0.5, hx, hy + hr * 0.3);
        c.closePath();
        if (layer.data.fill) c.fill(); else c.stroke();
        break;
      }
      case "diamond": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; }
        const dx = layer.data.x; const dy = layer.data.y; const dr = layer.data.size || 30;
        c.beginPath();
        c.moveTo(dx, dy - dr); c.lineTo(dx + dr, dy); c.lineTo(dx, dy + dr); c.lineTo(dx - dr, dy); c.closePath();
        if (layer.data.fill) c.fill(); else c.stroke();
        break;
      }
      case "triangle": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; }
        const tx = layer.data.x; const ty = layer.data.y; const tr = layer.data.size || 30;
        c.beginPath();
        c.moveTo(tx, ty - tr); c.lineTo(tx - tr * 0.866, ty + tr * 0.5); c.lineTo(tx + tr * 0.866, ty + tr * 0.5); c.closePath();
        if (layer.data.fill) c.fill(); else c.stroke();
        break;
      }
      case "hexagon": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; }
        const hx2 = layer.data.x; const hy2 = layer.data.y; const hr2 = layer.data.size || 30;
        c.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 - 30) * Math.PI / 180;
          const px = hx2 + hr2 * Math.cos(angle);
          const py = hy2 + hr2 * Math.sin(angle);
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
        if (layer.data.fill) c.fill(); else c.stroke();
        break;
      }
      case "fill": {
        c.fillStyle = layer.data.color;
        c.fillRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h);
        break;
      }
      case "gradient": {
        const grad = c.createLinearGradient(layer.data.x1, layer.data.y1, layer.data.x2, layer.data.y2);
        grad.addColorStop(0, layer.data.colors[0]);
        grad.addColorStop(1, layer.data.colors[1]);
        c.fillStyle = grad;
        c.fillRect(Math.min(layer.data.x1, layer.data.x2), Math.min(layer.data.y1, layer.data.y2), Math.abs(layer.data.x2 - layer.data.x1), Math.abs(layer.data.y2 - layer.data.y1));
        break;
      }
      case "eraser": {
        c.clearRect(layer.data.x - layer.data.size / 2, layer.data.y - layer.data.size / 2, layer.data.size, layer.data.size);
        break;
      }
      case "template": {
        const tpl = TEMPLATES[layer.data.templateIndex];
        const { x, y, w, h } = layer.data;
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 2; c.setLineDash([]);
        c.beginPath();
        if (tpl.name === "Camiseta") {
          c.moveTo(x + w * 0.3, y); c.lineTo(x + w * 0.5, y);
          c.lineTo(x + w * 0.5, y + h * 0.3);
          c.quadraticCurveTo(x + w * 0.2, y + h * 0.3, x + w * 0.2, y + h * 0.6);
          c.lineTo(x + w * 0.2, y + h); c.lineTo(x + w * 0.8, y + h);
          c.lineTo(x + w * 0.8, y + h * 0.6); c.lineTo(x + w * 0.8, y + h * 0.3);
          c.quadraticCurveTo(x + w * 0.8, y + h * 0.3, x + w * 0.5, y + h * 0.3);
          c.closePath();
        } else if (tpl.name === "Polera") {
          c.moveTo(x + w * 0.25, y); c.lineTo(x + w * 0.75, y);
          c.lineTo(x + w * 0.75, y + h * 0.25);
          c.quadraticCurveTo(x + w * 0.75, y + h * 0.15, x + w * 0.5, y + h * 0.15);
          c.quadraticCurveTo(x + w * 0.25, y + h * 0.15, x + w * 0.25, y + h * 0.25);
          c.lineTo(x + w * 0.25, y + h);
          c.lineTo(x + w * 0.75, y + h); c.closePath();
        } else if (tpl.name === "Vestido") {
          c.moveTo(x + w * 0.5, y);
          c.quadraticCurveTo(x + w * 0.3, y + h * 0.2, x + w * 0.2, y + h * 0.4);
          c.lineTo(x + w * 0.1, y + h); c.lineTo(x + w * 0.9, y + h);
          c.lineTo(x + w * 0.8, y + h * 0.4); c.quadraticCurveTo(x + w * 0.7, y + h * 0.2, x + w * 0.5, y);
        } else if (tpl.name === "Bolso") {
          c.rect(x + w * 0.1, y + h * 0.3, w * 0.8, h * 0.7);
          c.moveTo(x + w * 0.4, y + h * 0.3);
          c.quadraticCurveTo(x + w * 0.5, y - h * 0.1, x + w * 0.6, y + h * 0.3);
        } else if (tpl.name === "Cinturón") {
          c.rect(x, y + h * 0.4, w, h * 0.2);
          c.rect(x + w * 0.35, y + h * 0.35, w * 0.3, h * 0.3);
        } else if (tpl.name === "Gorra") {
          c.ellipse(x + w * 0.5, y + h * 0.3, w * 0.5, h * 0.15, 0, 0, Math.PI * 2);
          c.rect(x + w * 0.2, y + h * 0.3, w * 0.6, h * 0.2);
        } else if (tpl.name === "Anillo") {
          c.ellipse(x + w * 0.5, y + h * 0.5, w * 0.4, h * 0.15, 0, 0, Math.PI * 2);
        } else if (tpl.name === "Collar") {
          c.moveTo(x + w * 0.1, y + h * 0.5);
          c.quadraticCurveTo(x + w * 0.5, y + h * 0.8, x + w * 0.9, y + h * 0.5);
        } else if (tpl.name === "Bufanda") {
          c.moveTo(x + w * 0.5, y);
          c.quadraticCurveTo(x + w * 0.3, y + h * 0.5, x + w * 0.2, y + h);
          c.quadraticCurveTo(x + w * 0.5, y + h * 0.5, x + w * 0.8, y + h);
          c.quadraticCurveTo(x + w * 0.7, y + h * 0.5, x + w * 0.5, y);
        } else if (tpl.name === "Sombrero") {
          c.ellipse(x + w * 0.5, y + h * 0.7, w * 0.5, h * 0.1, 0, Math.PI, 0);
          c.rect(x + w * 0.3, y, w * 0.4, h * 0.4);
        }
        c.stroke(); break;
      }
    }
    c.restore();
  };

  const getPos = (e: React.MouseEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const clientX = e.clientX;
    const clientY = e.clientY;
    return { x: (clientX - rect.left) * scaleX + panOffset.x, y: (clientY - rect.top) * scaleY + panOffset.y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e);
    if (tool === "hand") { setIsPanning(true); setStartPos(pos); return; }
    if (tool === "measure") { setMeasureStart(pos); setMeasureEnd(pos); setIsDrawing(true); return; }
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentDraw([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos || tool === "hand" || tool === "measure") return;
    const pos = getPos(e);
    if (tool === "brush") setCurrentDraw([...currentDraw, pos]);
    if (tool === "gradient") setMeasureEnd(pos);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPos) { setIsDrawing(false); setIsPanning(false); return; }
    const endPos = currentDraw.length > 0 ? currentDraw[currentDraw.length - 1] : startPos;
    setIsDrawing(false); setIsPanning(false);
    switch (tool) {
      case "brush":
        if (currentDraw.length > 1) addLayer({ type: "brush", id: Date.now().toString(), data: { points: currentDraw, color: brushColor, size: brushSize, strokeStyle }, opacity, name: "Pincel", visible: true, locked: false });
        break;
      case "text":
        if (text) { addLayer({ type: "text", id: Date.now().toString(), data: { text, x: startPos.x, y: startPos.y, color: brushColor, size: textSize, font: textFont, style: textStyle }, opacity, name: `Texto: ${text}`, visible: true, locked: false }); setText(""); setShowTextInput(false); }
        break;
      case "rect":
        addLayer({ type: "rect", id: Date.now().toString(), data: { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor, size: brushSize, strokeStyle, fill: fillShape }, opacity, name: "Rectángulo", visible: true, locked: false }); break;
      case "circle":
        addLayer({ type: "circle", id: Date.now().toString(), data: { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor, size: brushSize, strokeStyle, fill: fillShape }, opacity, name: "Círculo", visible: true, locked: false }); break;
      case "star":
        addLayer({ type: "star", id: Date.now().toString(), data: { x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2, radius: Math.max(Math.abs(endPos.x - startPos.x), Math.abs(endPos.y - startPos.y)) || 30, color: brushColor, strokeWidth: brushSize, fill: fillShape }, opacity, name: "Estrella", visible: true, locked: false }); break;
      case "heart":
        addLayer({ type: "heart", id: Date.now().toString(), data: { x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2, radius: Math.max(Math.abs(endPos.x - startPos.x), Math.abs(endPos.y - startPos.y)) || 30, color: brushColor, strokeWidth: brushSize, fill: fillShape }, opacity, name: "Corazón", visible: true, locked: false }); break;
      case "diamond":
        addLayer({ type: "diamond", id: Date.now().toString(), data: { x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2, radius: Math.max(Math.abs(endPos.x - startPos.x), Math.abs(endPos.y - startPos.y)) || 30, color: brushColor, strokeWidth: brushSize, fill: fillShape }, opacity, name: "Diamante", visible: true, locked: false }); break;
      case "triangle":
        addLayer({ type: "triangle", id: Date.now().toString(), data: { x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2, radius: Math.max(Math.abs(endPos.x - startPos.x), Math.abs(endPos.y - startPos.y)) || 30, color: brushColor, strokeWidth: brushSize, fill: fillShape }, opacity, name: "Triángulo", visible: true, locked: false }); break;
      case "hexagon":
        addLayer({ type: "hexagon", id: Date.now().toString(), data: { x: (startPos.x + endPos.x) / 2, y: (startPos.y + endPos.y) / 2, radius: Math.max(Math.abs(endPos.x - startPos.x), Math.abs(endPos.y - startPos.y)) || 30, color: brushColor, strokeWidth: brushSize, fill: fillShape }, opacity, name: "Hexágono", visible: true, locked: false }); break;
      case "line":
        addLayer({ type: "line", id: Date.now().toString(), data: { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, color: brushColor, size: brushSize, strokeStyle }, opacity, name: "Línea", visible: true, locked: false }); break;
      case "arrow":
        addLayer({ type: "arrow", id: Date.now().toString(), data: { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, color: brushColor, size: brushSize }, opacity, name: "Flecha", visible: true, locked: false }); break;
      case "eraser":
        addLayer({ type: "eraser", id: Date.now().toString(), data: { x: startPos.x, y: startPos.y, size: brushSize }, opacity, name: "Borrador", visible: true, locked: false }); break;
      case "fill":
        addLayer({ type: "fill", id: Date.now().toString(), data: { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor }, opacity, name: "Relleno", visible: true, locked: false }); break;
      case "gradient":
        addLayer({ type: "gradient", id: Date.now().toString(), data: { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, colors: gradientColors }, opacity, name: "Gradiente", visible: true, locked: false }); break;
      case "pattern": {
        const p = PATTERNS[selectedPattern];
        addLayer({ type: "pattern", id: Date.now().toString(), data: { patternName: p.name, patternIndex: selectedPattern, x: startPos.x, y: startPos.y, w: 120, h: 120 }, opacity, name: `Patrón: ${p.name}`, visible: true, locked: false }); break;
      }
      case "symbol": {
        const sym = SYMBOLS[selectedSymbol];
        addLayer({ type: "symbol", id: Date.now().toString(), data: { symbolIndex: selectedSymbol, x: startPos.x - 30, y: startPos.y - 30, size: 60, color: brushColor }, opacity, name: `Símbolo: ${sym.name}`, visible: true, locked: false }); break;
      }
      case "template": {
        const tpl = TEMPLATES[selectedTemplate];
        addLayer({ type: "template", id: Date.now().toString(), data: { templateIndex: selectedTemplate, x: startPos.x - 80, y: startPos.y - 80, w: 160, h: 200, color: brushColor, strokeWidth: 2 }, opacity, name: `Plantilla: ${tpl.name}`, visible: true, locked: false }); break;
      }
      case "measure":
        setMeasureEnd(endPos);
        const dist = Math.sqrt((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2);
        const cm = (dist / canvasSize.w * 30).toFixed(1);
        setMeasureDistance(`${cm} cm`);
        addLayer({ type: "measure", id: Date.now().toString(), data: { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y }, opacity: 1, name: `Medida: ${cm} cm`, visible: true, locked: false });
        break;
    }
    setCurrentDraw([]);
    setStartPos(null);
    setMeasureStart(null);
    setMeasureEnd(null);
  };

  const addLayer = (layer: Layer) => {
    setUndoStack((prev) => [...prev, [...layers]]);
    setRedoStack([]);
    setLayers((prev) => [...prev, layer]);
  };

  const undo = () => { if (undoStack.length === 0) return; const prev = undoStack[undoStack.length - 1]; setUndoStack((p) => p.slice(0, -1)); setRedoStack((p) => [...p, layers]); setLayers(prev); };
  const redo = () => { if (redoStack.length === 0) return; const next = redoStack[redoStack.length - 1]; setRedoStack((p) => p.slice(0, -1)); setUndoStack((p) => [...p, layers]); setLayers(next); };
  const clearCanvas = () => { setUndoStack((p) => [...p, [...layers]]); setRedoStack([]); setLayers([]); setMeasureDistance(null); };

  const deleteLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    setUndoStack((p) => [...p, [...layers]]); setRedoStack([]);
    setLayers(layers.filter((l) => l.id !== id));
  };

  const duplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    const dup = { ...layer, id: Date.now().toString(), name: `${layer.name} (copia)` };
    setUndoStack((p) => [...p, [...layers]]); setRedoStack([]);
    setLayers((prev) => [...prev, dup]);
  };

  const changeLayerOpacity = (id: string, value: number) => {
    setLayers(layers.map((l) => l.id === id ? { ...l, opacity: value } : l));
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map((l) => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const toggleLayerLock = (id: string) => {
    setLayers(layers.map((l) => l.id === id ? { ...l, locked: !l.locked } : l));
  };

  const moveLayerUp = (id: string) => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx >= layers.length - 1) return;
    const newLayers = [...layers];
    [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
    setLayers(newLayers);
  };

  const moveLayerDown = (id: string) => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    const newLayers = [...layers];
    [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
    setLayers(newLayers);
  };

  const getLayerColor = (layer: Layer) => {
    if (layer.data.color) return layer.data.color;
    if (layer.data.colors) return layer.data.colors[0];
    if (layer.data.pattern) return layer.data.pattern[0];
    return "#888";
  };

  const snap = (val: number) => snapToGrid ? Math.round(val / 20) * 20 : val;

  const canvasStyle = useMemo(() => ({
    width: "100%",
    maxWidth: "600px",
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
  }), [zoom]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Toolbar principal */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-border shadow-card">
        {[
          { key: "brush" as Tool, icon: "✏️", label: "Pincel" },
          { key: "text" as Tool, icon: "🔤", label: "Texto" },
          { key: "rect" as Tool, icon: "⬜", label: "Rect" },
          { key: "circle" as Tool, icon: "⭕", label: "Círculo" },
          { key: "star" as Tool, icon: "⭐", label: "Estrella" },
          { key: "heart" as Tool, icon: "❤️", label: "Corazón" },
          { key: "diamond" as Tool, icon: "💎", label: "Diamante" },
          { key: "triangle" as Tool, icon: "🔺", label: "Triángulo" },
          { key: "hexagon" as Tool, icon: "⬡", label: "Hexágono" },
          { key: "line" as Tool, icon: "📏", label: "Línea" },
          { key: "arrow" as Tool, icon: "➡️", label: "Flecha" },
          { key: "pattern" as Tool, icon: "🎨", label: "Patrón" },
          { key: "symbol" as Tool, icon: "✦", label: "Símbolo" },
          { key: "template" as Tool, icon: "📐", label: "Plantilla" },
          { key: "fill" as Tool, icon: "🪣", label: "Relleno" },
          { key: "gradient" as Tool, icon: "🌈", label: "Gradiente" },
          { key: "eraser" as Tool, icon: "🧹", label: "Borrador" },
          { key: "measure" as Tool, icon: "📐", label: "Medir" },
          { key: "hand" as Tool, icon: "✋", label: "Mover" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTool(t.key); if (t.key !== "text") setShowTextInput(false); }}
            className={`px-2 py-2 rounded-lg text-sm font-medium transition-all border ${tool === t.key ? "bg-secondary text-white border-secondary shadow-soft" : "border-border bg-white hover:border-primary/40"}`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}

        <div className="w-px h-5 bg-border mx-0.5" />
        <button onClick={undo} className="px-2 py-2 rounded-lg border border-border bg-white hover:bg-neutral-50 text-sm" title="Deshacer">↩️</button>
        <button onClick={redo} className="px-2 py-2 rounded-lg border border-border bg-white hover:bg-neutral-50 text-sm" title="Rehacer">↪️</button>
        <button onClick={clearCanvas} className="px-2 py-2 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-sm text-red-600" title="Limpiar">🗑️</button>

        <div className="w-px h-5 bg-border mx-0.5" />

        <div className="flex items-center gap-1">
          <label className="text-[9px] text-neutral-500">Color:</label>
          <div className="relative">
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border border-border" />
            <button onClick={() => setShowColorPicker(!showColorPicker)} className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border border-white text-[7px] flex items-center justify-center">🎨</button>
            {showColorPicker && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 bottom-full mb-1 bg-white border border-border rounded-xl p-2 shadow-lg z-20 grid grid-cols-5 gap-0.5 w-44">
                {COLOR_PRESETS.map((c) => (
                  <button key={c.hex} onClick={() => { setBrushColor(c.hex); setShowColorPicker(false); }} className="w-6 h-6 rounded border border-border hover:scale-110 transition" style={{ background: c.hex }} title={c.name} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <label className="text-[9px] text-neutral-500">Tamaño:</label>
          <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-14" />
          <span className="text-[9px] text-neutral-500 w-5">{brushSize}</span>
        </div>

        <div className="flex items-center gap-1">
          <label className="text-[9px] text-neutral-500">Opacidad:</label>
          <input type="range" min="10" max="100" value={opacity * 100} onChange={(e) => setOpacity(Number(e.target.value) / 100)} className="w-14" />
          <span className="text-[9px] text-neutral-500 w-8">{Math.round(opacity * 100)}%</span>
        </div>

        <div className="flex items-center gap-1">
          <label className="text-[9px] text-neutral-500">Zoom:</label>
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="px-1.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px]">−</button>
          <span className="text-[9px] text-neutral-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="px-1.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px]">+</button>
        </div>

        <div className="w-px h-5 bg-border mx-0.5" />

        <button onClick={() => setFillShape(!fillShape)} className={`px-2 py-2 rounded-lg border text-sm transition ${fillShape ? "bg-secondary text-white border-secondary" : "border-border bg-white hover:border-primary/40"}`} title="Rellenar">⬜</button>
        <select value={strokeStyle} onChange={(e) => setStrokeStyle(e.target.value as StrokeStyle)} className="px-2 py-2 rounded-lg bg-white border border-border text-[9px] focus:outline-none">
          <option value="solid">Sólido</option><option value="dashed">Discontinuo</option><option value="dotted">Puntos</option>
        </select>
        <button onClick={() => setSnapToGrid(!snapToGrid)} className={`px-2 py-2 rounded-lg border text-sm transition ${snapToGrid ? "bg-primary/20 border-primary text-primary" : "border-border bg-white hover:border-primary/40"}`} title="Snap a cuadrícula">⊞</button>
        <button onClick={() => setShowGrid(!showGrid)} className={`px-2 py-2 rounded-lg border text-sm transition ${showGrid ? "bg-primary/20 border-primary text-primary" : "border-border bg-white hover:border-primary/40"}`} title="Cuadrícula">⊞</button>
        <button onClick={() => { setShowLayers(!showLayers); setShowPresets(false); setShowPatterns(false); setShowSymbols(false); setShowTemplates(false); setShowColorPicker(false); }} className={`px-2 py-2 rounded-lg border text-sm transition ${showLayers ? "bg-secondary/20 border-secondary text-secondary" : "border-border bg-white hover:border-primary/40"}`} title="Capas">📋</button>
      </div>

      {/* Panel de patrones */}
      <AnimatePresence>
        {showPatterns && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 p-3 bg-white rounded-2xl border border-border">
            <p className="text-[10px] font-bold text-neutral-500 w-full">Patrones de tela:</p>
            {PATTERNS.map((p, i) => (
              <button key={p.name} onClick={() => { setTool("pattern"); setSelectedPattern(i); setShowPatterns(false); }} className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${selectedPattern === i && tool === "pattern" ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                <div className="flex gap-0.5 mb-1">
                  <div className="w-4 h-4 rounded-sm" style={{ background: p.colors[0] }} />
                  <div className="w-4 h-4 rounded-sm" style={{ background: p.colors[1] }} />
                </div>
                {p.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de símbolos */}
      <AnimatePresence>
        {showSymbols && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 p-3 bg-white rounded-2xl border border-border">
            <p className="text-[10px] font-bold text-neutral-500 w-full">Símbolos culturales andinos:</p>
            {SYMBOLS.map((s, i) => (
              <button key={s.name} onClick={() => { setTool("symbol"); setSelectedSymbol(i); setShowSymbols(false); }} className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${selectedSymbol === i && tool === "symbol" ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                {s.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de plantillas */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 p-3 bg-white rounded-2xl border border-border">
            <p className="text-[10px] font-bold text-neutral-500 w-full">Plantillas de producto:</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => (
                <button key={t.name} onClick={() => { setTool("template"); setSelectedTemplate(i); setShowTemplates(false); }} className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${selectedTemplate === i && tool === "template" ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                  <span className="text-lg">{t.icon}</span>
                  <span className="block text-[10px]">{t.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient colors selector */}
      <AnimatePresence>
        {tool === "gradient" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-border">
            <p className="text-[10px] font-bold text-neutral-500">Gradiente:</p>
            <input type="color" value={gradientColors[0]} onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])} className="w-8 h-8 rounded-lg cursor-pointer border border-border" />
            <span className="text-neutral-400">→</span>
            <input type="color" value={gradientColors[1]} onChange={(e) => setGradientColors([gradientColors[0], e.target.value])} className="w-8 h-8 rounded-lg cursor-pointer border border-border" />
            <p className="text-[9px] text-neutral-400">Hacé clic en el lienzo y arrastrá para crear el gradiente</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div ref={containerRef} className="relative rounded-2xl overflow-hidden border-2 border-border shadow-card bg-neutral-100" style={{ cursor: tool === "hand" ? "grab" : "crosshair" }} onMouseDown={(e) => { if (tool === "hand") { e.preventDefault(); handleMouseDown(e); } }} onMouseMove={(e) => { if (tool === "hand" && isPanning) { const pos = getPos(e); const dx = pos.x - startPos!.x; const dy = pos.y - startPos!.y; setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy }); setStartPos(pos); } }} onMouseUp={() => { setIsPanning(false); }} onMouseLeave={() => { setIsPanning(false); }}>
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => { if (tool !== "hand") handleMouseDown(e); }}
          onMouseMove={(e) => { if (tool !== "hand" && tool !== "measure") handleMouseMove(e); }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={canvasStyle}
          className="block"
        />
        {/* Zoom controls */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="w-7 h-7 rounded bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70">−</button>
          <span className="w-10 h-7 rounded bg-black/50 text-white text-[9px] flex items-center justify-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="w-7 h-7 rounded bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70">+</button>
        </div>
        {/* Measure display */}
        {measureDistance && (
          <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
            📐 {measureDistance}
          </div>
        )}
      </div>

      {/* Panel de capas */}
      <AnimatePresence>
        {showLayers && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl border border-border p-3 shadow-card max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-neutral-500">Capas ({layers.length})</p>
              <button onClick={clearCanvas} className="px-2 py-0.5 rounded bg-red-50 text-red-500 text-[9px] hover:bg-red-100">Limpiar todo</button>
            </div>
            {layers.length === 0 ? (
              <p className="text-[10px] text-neutral-400">Dibujá algo para ver las capas.</p>
            ) : (
              [...layers].reverse().map((layer, i) => (
                <div key={layer.id} className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-neutral-50 border border-border mb-1">
                  <button onClick={() => toggleLayerVisibility(layer.id)} className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[9px] flex items-center justify-center">
                    {layer.visible ? "👁" : "🚫"}
                  </button>
                  <div className="w-4 h-4 rounded" style={{ background: getLayerColor(layer) }} />
                  <span className="text-[10px] flex-1 truncate">{layer.name}</span>
                  <span className="text-[8px] text-neutral-400">{layer.opacity}%</span>
                  <input type="range" min="10" max="100" value={layer.opacity * 100} onChange={(e) => changeLayerOpacity(layer.id, Number(e.target.value) / 100)} className="w-12" title="Opacidad" />
                  <button onClick={() => toggleLayerLock(layer.id)} className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[9px] flex items-center justify-center" title="Bloquear">{layer.locked ? "🔒" : "🔓"}</button>
                  <button onClick={() => moveLayerUp(layer.id)} className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[9px] flex items-center justify-center">↑</button>
                  <button onClick={() => moveLayerDown(layer.id)} className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[9px] flex items-center justify-center">↓</button>
                  <button onClick={() => duplicateLayer(layer.id)} className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-[9px] flex items-center justify-center" title="Duplicar">📋</button>
                  <button onClick={() => deleteLayer(layer.id)} className="w-5 h-5 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[9px] flex items-center justify-center" title="Eliminar">🗑️</button>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input de texto */}
      <AnimatePresence>
        {showTextInput && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-border">
            <input type="text" value={text} onChange={(e) => setText(e.target.value.slice(0, 30))} placeholder="Texto sobre el diseño…" className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" maxLength={30} />
            <select value={textFont} onChange={(e) => setTextFont(e.target.value)} className="px-3 py-2.5 rounded-xl bg-neutral-50 border border-border text-sm focus:outline-none">
              <option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Courier New">Courier New</option><option value="Impact">Impact</option><option value="Comic Sans MS">Comic Sans</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option>
            </select>
            <div className="flex gap-1">
              {(["normal", "bold", "italic"] as const).map((s) => (
                <button key={s} onClick={() => setTextStyle(s)} className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${textStyle === s ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                  {s === "bold" ? "B" : s === "italic" ? "I" : "A"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] text-neutral-500">Tamaño:</label>
              <input type="range" min="10" max="80" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-14" />
              <span className="text-[9px] text-neutral-500 w-8">{textSize}</span>
            </div>
            <button onClick={() => { if (text) { addLayer({ type: "text", id: Date.now().toString(), data: { text, x: startPos?.x ?? 300, y: startPos?.y ?? 300, color: brushColor, size: textSize, font: textFont, style: textStyle }, opacity, name: `Texto: ${text}`, visible: true, locked: false }); setText(""); setShowTextInput(false); } }} className="px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-800 transition">Agregar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
