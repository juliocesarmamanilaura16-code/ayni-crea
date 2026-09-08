"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tool = "brush" | "text" | "rect" | "circle" | "line" | "arrow" | "eraser" | "move" | "eyedropper" | "pattern" | "symbol";
type StrokeStyle = "solid" | "dashed" | "dotted";

interface Layer {
  type: string;
  data: any;
  id: string;
  opacity: number;
  name: string;
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
];

const PATTERNS = [
  { name: "Rayas", pattern: ["#DC2626", "#FFFFFF"] },
  { name: "Cuadros", pattern: ["#2563EB", "#FFFFFF"] },
  { name: "Puntos", pattern: ["#DB2777", "#FFFFFF"] },
  { name: "Geométrico", pattern: ["#D4A843", "#18181B"] },
  { name: "Tropical", pattern: ["#16A34A", "#0D9488"] },
  { name: "Andino", pattern: ["#7C3AED", "#D4A843"] },
];

const SYMBOLS = [
  { name: "Chakana", path: "M12 2L12 22M2 12L22 12M7 7L17 17M17 7L7 17" },
  { name: "Sol", path: "M12 2L12 5M12 19L12 22M2 12L5 12M19 12L22 12M4.93 4.93L7.34 7.34M16.66 16.66L19.07 19.07M4.93 19.07L7.34 16.66M16.66 7.34L19.07 4.93M12 6C8 6 5 9 5 12C5 15 8 18 12 18C16 18 19 15 19 12C19 9 16 6 12 6Z" },
  { name: "Estrella", path: "M12 2L14.5 8.5L21 9L16 13.5L17.5 20L12 16.5L6.5 20L8 13.5L3 9L9.5 8.5L12 2Z" },
  { name: "Hoja", path: "M12 2C8 6 3 10 3 15C3 20 8 22 12 22C16 22 21 20 21 15C21 10 16 6 12 2Z" },
  { name: "Llave", path: "M8 2C5.8 2 4 3.8 4 6C4 8.2 5.8 10 8 10M8 10V16M8 10C10.2 10 12 8.2 12 6C12 3.8 10.2 2 8 2Z" },
];

export function DesignCanvas({ defaultBg = "#f5f5f5" }: { defaultBg?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [bgColor, setBgColor] = useState(defaultBg);
  const [text, setText] = useState("");
  const [textFont, setTextFont] = useState("Arial");
  const [textStyle, setTextStyle] = useState<"normal" | "bold" | "italic">("normal");
  const [textSize, setTextSize] = useState(24);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [strokeStyle, setStrokeStyle] = useState<StrokeStyle>("solid");
  const [fillShape, setFillShape] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number }[]>([]);
  const [undoStack, setUndoStack] = useState<Layer[][]>([]);
  const [redoStack, setRedoStack] = useState<Layer[][]>([]);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState(0);

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
      drawLayer(ctx.current!, layer);
    });
  }, [layers, bgColor, showGrid]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = 600;
    c.height = 600;
    ctx.current = c.getContext("2d");
    redraw();
  }, []);

  useEffect(() => { redraw(); }, [bgColor, showGrid]);

  const drawGrid = (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.strokeStyle = "rgba(0,0,0,0.08)";
    c.lineWidth = 0.5;
    for (let x = 0; x <= w; x += 20) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y <= h; y += 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
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
        c.strokeStyle = layer.data.color;
        c.lineWidth = layer.data.size;
        c.setLineDash(layer.data.strokeStyle === "dashed" ? [8, 4] : layer.data.strokeStyle === "dotted" ? [2, 4] : []);
        if (layer.data.fill) { c.fillStyle = layer.data.color; c.fillRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h); }
        else { c.strokeRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h); }
        c.setLineDash([]);
        break;
      }
      case "circle": {
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size;
        c.setLineDash(layer.data.strokeStyle === "dashed" ? [8, 4] : layer.data.strokeStyle === "dotted" ? [2, 4] : []);
        const rx = Math.abs(layer.data.w) / 2; const ry = Math.abs(layer.data.h) / 2;
        const cx = layer.data.x + layer.data.w / 2; const cy = layer.data.y + layer.data.h / 2;
        if (layer.data.fill) { c.fillStyle = layer.data.color; c.beginPath(); c.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2); c.fill(); }
        else { c.beginPath(); c.arc(cx, cy, Math.max(rx, ry), 0, Math.PI * 2); c.stroke(); }
        c.setLineDash([]);
        break;
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
        c.fillStyle = p.pattern[0]; c.fillRect(x, y, w, h);
        c.strokeStyle = p.pattern[1]; c.lineWidth = 2;
        if (layer.data.patternName === "Rayas") {
          for (let i = y; i < y + h; i += 20) { c.beginPath(); c.moveTo(x, i); c.lineTo(x + w, i); c.stroke(); }
        } else if (layer.data.patternName === "Cuadros") {
          for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.strokeRect(i, j, 20, 20); } }
        } else if (layer.data.patternName === "Puntos") {
          for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.beginPath(); c.arc(i + 10, j + 10, 4, 0, Math.PI * 2); c.fill(); } }
        } else if (layer.data.patternName === "Geométrico") {
          for (let i = x; i < x + w; i += 20) { for (let j = y; j < y + h; j += 20) { c.beginPath(); c.moveTo(i, j); c.lineTo(i + 20, j + 20); c.moveTo(i + 20, j); c.lineTo(i, j + 20); c.stroke(); } }
        } else if (layer.data.patternName === "Tropical") {
          for (let i = x; i < x + w; i += 40) { for (let j = y; j < y + h; j += 40) { c.beginPath(); c.arc(i, j, 15, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(i + 20, j + 20, 10, 0, Math.PI * 2); c.stroke(); } }
        } else {
          for (let i = x; i < x + w; i += 30) { for (let j = y; j < y + h; j += 30) { c.beginPath(); c.moveTo(i + 15, j); c.lineTo(i, j + 15); c.lineTo(i + 15, j + 30); c.lineTo(i + 30, j + 15); c.closePath(); c.stroke(); } }
        }
        c.restore(); break;
      }
      case "symbol": {
        const sym = SYMBOLS[layer.data.symbolIndex];
        const { x, y, size } = layer.data;
        c.strokeStyle = layer.data.color; c.lineWidth = layer.data.size || 3; c.setLineDash([]);
        c.beginPath();
        sym.path.split("M").forEach((seg: string, i: number) => {
          if (i === 0) return;
          const parts = seg.trim().split(/[LZ]/);
          if (parts.length > 0) {
            const [px, py] = parts[0].split(" ").map(Number);
            c.moveTo(x + px * size / 20, y + py * size / 20);
            parts.slice(1).forEach((p: string) => {
              const [xx, yy] = p.split(" ").map(Number);
              if (!isNaN(xx) && !isNaN(yy)) c.lineTo(x + xx * size / 20, y + yy * size / 20);
            });
          }
        });
        c.stroke();
        break;
      }
      case "eraser": {
        c.clearRect(layer.data.x - layer.data.size / 2, layer.data.y - layer.data.size / 2, layer.data.size, layer.data.size);
        break;
      }
    }
    c.restore();
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e);
    if (tool === "move") return;
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentDraw([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos || tool === "move") return;
    const pos = getPos(e);
    if (tool === "brush") setCurrentDraw([...currentDraw, pos]);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPos) { setIsDrawing(false); return; }
    const endPos = currentDraw.length > 0 ? currentDraw[currentDraw.length - 1] : startPos;
    setIsDrawing(false);

    const newLayer: Layer = { type: tool === "brush" ? "brush" : tool, id: Date.now().toString(), data: {}, opacity, name: `${tool} ${Date.now()}` };

    switch (tool) {
      case "brush":
        if (currentDraw.length > 1) { newLayer.data = { points: currentDraw, color: brushColor, size: brushSize, strokeStyle }; addLayer(newLayer); }
        break;
      case "text":
        if (text) { newLayer.data = { text, x: startPos.x, y: startPos.y, color: brushColor, size: textSize, font: textFont, style: textStyle }; newLayer.name = `Texto: ${text}`; addLayer(newLayer); setText(""); }
        break;
      case "rect":
        newLayer.data = { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor, size: brushSize, strokeStyle, fill: fillShape }; newLayer.name = "Rectángulo"; addLayer(newLayer); break;
      case "circle":
        newLayer.data = { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor, size: brushSize, strokeStyle, fill: fillShape }; newLayer.name = "Círculo"; addLayer(newLayer); break;
      case "line":
        newLayer.data = { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, color: brushColor, size: brushSize, strokeStyle }; newLayer.name = "Línea"; addLayer(newLayer); break;
      case "arrow":
        newLayer.data = { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, color: brushColor, size: brushSize }; newLayer.name = "Flecha"; addLayer(newLayer); break;
      case "eraser":
        newLayer.data = { x: startPos.x, y: startPos.y, size: brushSize }; newLayer.name = "Borrador"; addLayer(newLayer); break;
      case "pattern": {
        const p = PATTERNS[selectedPattern];
        newLayer.data = { patternName: p.name, patternIndex: selectedPattern, x: startPos.x, y: startPos.y, w: 120, h: 120 }; newLayer.name = `Patrón: ${p.name}`; addLayer(newLayer); break;
      }
      case "symbol": {
        const sym = SYMBOLS[selectedSymbol];
        newLayer.data = { symbolIndex: selectedSymbol, x: startPos.x - 30, y: startPos.y - 30, size: 60, color: brushColor }; newLayer.name = `Símbolo: ${sym.name}`; addLayer(newLayer); break;
      }
    }
    setCurrentDraw([]);
    setStartPos(null);
  };

  const addLayer = (layer: Layer) => {
    setUndoStack((prev) => [...prev, [...layers]]);
    setRedoStack([]);
    setLayers((prev) => [...prev, layer]);
  };

  const undo = () => { if (undoStack.length === 0) return; const prev = undoStack[undoStack.length - 1]; setUndoStack((p) => p.slice(0, -1)); setRedoStack((p) => [...p, layers]); setLayers(prev); };
  const redo = () => { if (redoStack.length === 0) return; const next = redoStack[redoStack.length - 1]; setRedoStack((p) => p.slice(0, -1)); setUndoStack((p) => [...p, layers]); setLayers(next); };

  const clearCanvas = () => { setUndoStack((p) => [...p, layers]); setRedoStack([]); setLayers([]); };

  const deleteLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    setUndoStack((p) => [...p, [...layers]]);
    setRedoStack([]);
    setLayers(layers.filter((l) => l.id !== id));
  };

  const duplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    const dup = { ...layer, id: Date.now().toString(), name: `${layer.name} (copia)` };
    setUndoStack((p) => [...p, [...layers]]);
    setRedoStack([]);
    setLayers((prev) => [...prev, dup]);
  };

  const changeLayerOpacity = (id: string, value: number) => {
    setLayers(layers.map((l) => l.id === id ? { ...l, opacity: value } : l));
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
    if (layer.data.pattern) return layer.data.pattern[0];
    return "#888";
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Toolbar principal */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-border shadow-card">
        {[
          { key: "brush" as Tool, icon: "✏️", label: "Pincel" },
          { key: "text" as Tool, icon: "🔤", label: "Texto" },
          { key: "rect" as Tool, icon: "⬜", label: "Rect" },
          { key: "circle" as Tool, icon: "⭕", label: "Círculo" },
          { key: "line" as Tool, icon: "📏", label: "Línea" },
          { key: "arrow" as Tool, icon: "➡️", label: "Flecha" },
          { key: "pattern" as Tool, icon: "🎨", label: "Patrón" },
          { key: "symbol" as Tool, icon: "✦", label: "Símbolo" },
          { key: "eraser" as Tool, icon: "🧹", label: "Borrador" },
          { key: "move" as Tool, icon: "✋", label: "Mover" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTool(t.key); if (t.key !== "text") setShowTextInput(false); }}
            className={`px-2.5 py-2 rounded-xl text-sm font-medium transition-all border ${tool === t.key ? "bg-secondary text-white border-secondary shadow-soft" : "border-border bg-white hover:border-primary/40"}`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}

        <div className="w-px h-6 bg-border mx-1" />

        <button onClick={undo} className="px-2.5 py-2 rounded-xl border border-border bg-white hover:bg-neutral-50 text-sm" title="Deshacer (Ctrl+Z)">↩️</button>
        <button onClick={redo} className="px-2.5 py-2 rounded-xl border border-border bg-white hover:bg-neutral-50 text-sm" title="Rehacer (Ctrl+Y)">↪️</button>
        <button onClick={clearCanvas} className="px-2.5 py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-sm text-red-600" title="Limpiar todo">🗑️</button>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-neutral-500">Color:</label>
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer border border-border" />
          <div className="relative">
            <button onClick={() => setShowPresets(!showPresets)} className="px-2 py-1.5 rounded-xl border border-border bg-white text-[10px] font-bold hover:bg-neutral-50">Paleta</button>
            {showPresets && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 bottom-full mb-1 bg-white border border-border rounded-xl p-2 shadow-lg z-10 grid grid-cols-4 gap-1 w-56">
                {COLOR_PRESETS.map((c) => (
                  <button key={c.hex} onClick={() => { setBrushColor(c.hex); setShowPresets(false); }} className="w-8 h-8 rounded-lg border border-border hover:scale-110 transition" style={{ background: c.hex }} title={c.name} />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-neutral-500">Tamaño:</label>
          <input type="range" min="1" max="40" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-16" />
          <span className="text-[10px] text-neutral-500 w-6">{brushSize}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-neutral-500">Opacidad:</label>
          <input type="range" min="10" max="100" value={opacity * 100} onChange={(e) => setOpacity(Number(e.target.value) / 100)} className="w-16" />
          <span className="text-[10px] text-neutral-500 w-6">{Math.round(opacity * 100)}%</span>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <button onClick={() => setFillShape(!fillShape)} className={`px-2.5 py-2 rounded-xl border text-sm font-medium transition ${fillShape ? "bg-secondary text-white border-secondary" : "border-border bg-white hover:border-primary/40"}`} title="Rellenar forma">⬜</button>
        <select value={strokeStyle} onChange={(e) => setStrokeStyle(e.target.value as StrokeStyle)} className="px-2 py-2 rounded-xl bg-white border border-border text-[10px] focus:outline-none">
          <option value="solid">Sólido</option><option value="dashed">Discontinuo</option><option value="dotted">Puntos</option>
        </select>
        <button onClick={() => setShowGrid(!showGrid)} className={`px-2.5 py-2 rounded-xl border text-sm transition ${showGrid ? "bg-primary/20 border-primary text-primary" : "border-border bg-white hover:border-primary/40"}`} title="Cuadrícula">⊞</button>
        <button onClick={() => setShowLayers(!showLayers)} className={`px-2.5 py-2 rounded-xl border text-sm transition ${showLayers ? "bg-secondary/20 border-secondary text-secondary" : "border-border bg-white hover:border-primary/40"}`} title="Capas">📋</button>
      </div>

      {/* Panel de patrones */}
      <AnimatePresence>
        {showPatterns && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 p-3 bg-white rounded-2xl border border-border">
            <p className="text-xs font-bold text-neutral-500 w-full">Patrones de tela:</p>
            {PATTERNS.map((p, i) => (
              <button key={p.name} onClick={() => { setTool("pattern"); setSelectedPattern(i); setShowPatterns(false); }} className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${selectedPattern === i && tool === "pattern" ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                <div className="flex gap-0.5 mb-1">
                  <div className="w-3 h-3 rounded-sm" style={{ background: p.pattern[0] }} />
                  <div className="w-3 h-3 rounded-sm" style={{ background: p.pattern[1] }} />
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
            <p className="text-xs font-bold text-neutral-500 w-full">Símbolos culturales:</p>
            {SYMBOLS.map((s, i) => (
              <button key={s.name} onClick={() => { setTool("symbol"); setSelectedSymbol(i); setShowSymbols(false); }} className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${selectedSymbol === i && tool === "symbol" ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                {s.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-border shadow-card bg-neutral-100">
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="w-full cursor-crosshair" style={{ maxHeight: "500px", display: "block" }} />
      </div>

      {/* Panel de capas */}
      <AnimatePresence>
        {showLayers && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-2xl border border-border p-3 shadow-card max-h-48 overflow-y-auto">
            <p className="text-xs font-bold text-neutral-500 mb-2">Capas ({layers.length})</p>
            {layers.length === 0 ? (
              <p className="text-[11px] text-neutral-400">No hay capas. Dibujá algo para comenzar.</p>
            ) : (
              layers.map((layer, i) => (
                <div key={layer.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 border border-border mb-1">
                  <div className="w-5 h-5 rounded bg-border flex items-center justify-center text-[10px]">{i + 1}</div>
                  <div className="w-4 h-4 rounded" style={{ background: getLayerColor(layer) }} />
                  <span className="text-xs flex-1 truncate">{layer.name}</span>
                  <input type="range" min="10" max="100" value={layer.opacity * 100} onChange={(e) => changeLayerOpacity(layer.id, Number(e.target.value) / 100)} className="w-14" title="Opacidad" />
                  <button onClick={() => moveLayerUp(layer.id)} className="px-1.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px]">↑</button>
                  <button onClick={() => moveLayerDown(layer.id)} className="px-1.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px]">↓</button>
                  <button onClick={() => duplicateLayer(layer.id)} className="px-1.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px]" title="Duplicar">📋</button>
                  <button onClick={() => deleteLayer(layer.id)} className="px-1.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 text-[10px]" title="Eliminar">🗑️</button>
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
              <option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Courier New">Courier New</option><option value="Impact">Impact</option><option value="Comic Sans MS">Comic Sans</option><option value="Times New Roman">Times New Roman</option>
            </select>
            <div className="flex gap-1">
              {(["normal", "bold", "italic"] as const).map((s) => (
                <button key={s} onClick={() => setTextStyle(s)} className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${textStyle === s ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"}`}>
                  {s === "bold" ? "B" : s === "italic" ? "I" : "A"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-neutral-500">Tamaño:</label>
              <input type="range" min="10" max="80" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-16" />
              <span className="text-[10px] text-neutral-500 w-8">{textSize}</span>
            </div>
            <button onClick={() => { if (text) { const newLayer: Layer = { type: "text", id: Date.now().toString(), data: { text, x: 300, y: 300, color: brushColor, size: textSize, font: textFont, style: textStyle }, opacity, name: `Texto: ${text}` }; addLayer(newLayer); setText(""); setShowTextInput(false); } }} className="px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-800 transition">Agregar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
