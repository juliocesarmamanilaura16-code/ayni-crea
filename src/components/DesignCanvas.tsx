"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

type Tool = "brush" | "text" | "rect" | "circle" | "line" | "fill" | "eraser" | "arrow";
type FontStyle = "normal" | "bold" | "italic";

interface DesignCanvasProps {
  onSave?: (dataUrl: string) => void;
  defaultBg?: string;
}

interface Layer {
  type: "draw" | "text" | "rect" | "circle" | "line" | "arrow" | "fill" | "eraser";
  data: any;
  id: string;
}

export function DesignCanvas({ onSave, defaultBg = "#f5f5f5" }: DesignCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("brush");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [bgColor, setBgColor] = useState(defaultBg);
  const [text, setText] = useState("");
  const [textFont, setTextFont] = useState("Arial");
  const [textStyle, setTextStyle] = useState<FontStyle>("normal");
  const [textSize, setTextSize] = useState(24);
  const [showTextInput, setShowTextInput] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number }[]>([]);
  const [undoStack, setUndoStack] = useState<Layer[][]>([]);
  const [redoStack, setRedoStack] = useState<Layer[][]>([]);

  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !ctx.current) return;
    const w = c.width;
    const h = c.height;
    ctx.current.clearRect(0, 0, w, h);
    ctx.current.fillStyle = bgColor;
    ctx.current.fillRect(0, 0, w, h);
    layers.forEach((layer) => {
      drawLayer(ctx.current!, layer);
    });
  }, [layers, bgColor]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = 600;
    c.height = 600;
    ctx.current = c.getContext("2d");
    redraw();
  }, []);

  useEffect(() => {
    redraw();
  }, [bgColor]);

  const drawLayer = (c: CanvasRenderingContext2D, layer: Layer) => {
    switch (layer.type) {
      case "draw": {
        const pts = layer.data.points;
        if (pts.length < 2) return;
        c.strokeStyle = layer.data.color;
        c.lineWidth = layer.data.size;
        c.lineCap = "round";
        c.lineJoin = "round";
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);
        pts.forEach((p: { x: number; y: number }) => c.lineTo(p.x, p.y));
        c.stroke();
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
        c.strokeRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h);
        break;
      }
      case "circle": {
        c.strokeStyle = layer.data.color;
        c.lineWidth = layer.data.size;
        c.beginPath();
        const rx = Math.abs(layer.data.w) / 2;
        const ry = Math.abs(layer.data.h) / 2;
        const cx = layer.data.x + layer.data.w / 2;
        const cy = layer.data.y + layer.data.h / 2;
        c.arc(cx, cy, Math.max(rx, ry), 0, Math.PI * 2);
        c.stroke();
        break;
      }
      case "line": {
        c.strokeStyle = layer.data.color;
        c.lineWidth = layer.data.size;
        c.beginPath();
        c.moveTo(layer.data.x1, layer.data.y1);
        c.lineTo(layer.data.x2, layer.data.y2);
        c.stroke();
        break;
      }
      case "arrow": {
        c.strokeStyle = layer.data.color;
        c.lineWidth = layer.data.size;
        c.beginPath();
        c.moveTo(layer.data.x1, layer.data.y1);
        c.lineTo(layer.data.x2, layer.data.y2);
        c.stroke();
        const angle = Math.atan2(layer.data.y2 - layer.data.y1, layer.data.x2 - layer.data.x1);
        const headLen = 15;
        c.beginPath();
        c.moveTo(layer.data.x2, layer.data.y2);
        c.lineTo(layer.data.x2 - headLen * Math.cos(angle - 0.4), layer.data.y2 - headLen * Math.sin(angle - 0.4));
        c.lineTo(layer.data.x2 - headLen * Math.cos(angle + 0.4), layer.data.y2 - headLen * Math.sin(angle + 0.4));
        c.closePath();
        c.fillStyle = layer.data.color;
        c.fill();
        break;
      }
      case "fill": {
        c.fillStyle = layer.data.color;
        c.fillRect(layer.data.x, layer.data.y, layer.data.w, layer.data.h);
        break;
      }
      case "eraser": {
        c.clearRect(layer.data.x - layer.data.size / 2, layer.data.y - layer.data.size / 2, layer.data.size, layer.data.size);
        break;
      }
    }
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentDraw([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos) return;
    const pos = getPos(e);
    if (tool === "brush") {
      setCurrentDraw([...currentDraw, pos]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPos) { setIsDrawing(false); return; }
    const endPos = currentDraw.length > 0 ? currentDraw[currentDraw.length - 1] : startPos;

    setIsDrawing(false);
    const newLayer: Layer = { type: tool === "brush" ? "draw" : tool, id: Date.now().toString(), data: {} };

    switch (tool) {
      case "brush":
        if (currentDraw.length > 1) {
          newLayer.data = { points: currentDraw, color: brushColor, size: brushSize };
          addLayer(newLayer);
        }
        break;
      case "text":
        if (text) {
          newLayer.data = { text, x: startPos.x, y: startPos.y, color: brushColor, size: textSize, font: textFont, style: textStyle };
          addLayer(newLayer);
          setText("");
        }
        break;
      case "rect":
        newLayer.data = { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor, size: brushSize };
        addLayer(newLayer);
        break;
      case "circle":
        newLayer.data = { x: startPos.x, y: startPos.y, w: endPos.x - startPos.x, h: endPos.y - startPos.y, color: brushColor, size: brushSize };
        addLayer(newLayer);
        break;
      case "line":
        newLayer.data = { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, color: brushColor, size: brushSize };
        addLayer(newLayer);
        break;
      case "arrow":
        newLayer.data = { x1: startPos.x, y1: startPos.y, x2: endPos.x, y2: endPos.y, color: brushColor, size: brushSize };
        addLayer(newLayer);
        break;
      case "eraser":
        newLayer.data = { x: startPos.x, y: startPos.y, size: brushSize };
        addLayer(newLayer);
        break;
    }
    setCurrentDraw([]);
    setStartPos(null);
  };

  const addLayer = (layer: Layer) => {
    setUndoStack((prev) => [...prev, [...layers]]);
    setRedoStack([]);
    setLayers((prev) => [...prev, layer]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((p) => p.slice(0, -1));
    setRedoStack((p) => [...p, layers]);
    setLayers(prev);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((p) => p.slice(0, -1));
    setUndoStack((p) => [...p, layers]);
    setLayers(next);
  };

  const clearCanvas = () => {
    setUndoStack((p) => [...p, layers]);
    setRedoStack([]);
    setLayers([]);
  };

  const handleSave = () => {
    const c = canvasRef.current;
    if (!c || !onSave) return;
    const dataUrl = c.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-border shadow-card">
        <div className="flex gap-1">
          {([
            { key: "brush", icon: "✏️", label: "Pincel" },
            { key: "text", icon: "🔤", label: "Texto" },
            { key: "rect", icon: "⬜", label: "Rect" },
            { key: "circle", icon: "⭕", label: "Círculo" },
            { key: "line", icon: "📏", label: "Línea" },
            { key: "arrow", icon: "➡️", label: "Flecha" },
            { key: "eraser", icon: "🧹", label: "Borrador" },
          ] as { key: Tool; icon: string; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => { setTool(t.key); if (t.key === "text") setShowTextInput(true); else setShowTextInput(false); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                tool === t.key ? "bg-secondary text-white border-secondary shadow-soft" : "border-border bg-white hover:border-primary/40"
              }`}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-border mx-1" />
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-neutral-500 font-medium">Color:</label>
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border border-border" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-neutral-500 font-medium">Tamaño:</label>
          <input type="range" min="1" max="30" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-20" />
          <span className="text-[11px] text-neutral-500 w-6">{brushSize}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-neutral-500 font-medium">Fondo:</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border border-border" />
        </div>
        <div className="w-px h-6 bg-border mx-1" />
        <button onClick={undo} className="px-3 py-2 rounded-xl border border-border bg-white hover:bg-neutral-50 text-sm font-medium" title="Deshacer">↩️</button>
        <button onClick={redo} className="px-3 py-2 rounded-xl border border-border bg-white hover:bg-neutral-50 text-sm font-medium" title="Rehacer">↪️</button>
        <button onClick={clearCanvas} className="px-3 py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-sm font-medium text-red-600" title="Limpiar">🗑️</button>
        <button onClick={handleSave} className="px-3 py-2 rounded-xl border border-green-300 bg-green-50 hover:bg-green-100 text-sm font-medium text-green-600" title="Descargar">💾</button>
      </div>

      {/* Canvas */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-border shadow-card bg-neutral-100">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full cursor-crosshair touch-none"
          style={{ maxHeight: "600px" }}
        />
      </div>

      {/* Text Input */}
      {showTextInput && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-border"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 30))}
            placeholder="Escribí tu texto aquí…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            maxLength={30}
          />
          <select value={textFont} onChange={(e) => setTextFont(e.target.value)} className="px-3 py-2.5 rounded-xl bg-neutral-50 border border-border text-sm focus:outline-none">
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Courier New">Courier New</option>
            <option value="Impact">Impact</option>
            <option value="Comic Sans MS">Comic Sans</option>
          </select>
          <div className="flex gap-1">
            {(["normal", "bold", "italic"] as FontStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => setTextStyle(s)}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                  textStyle === s ? "border-secondary bg-secondary text-white" : "border-border bg-white hover:border-primary/40"
                }`}
              >
                {s === "bold" ? "B" : s === "italic" ? "I" : "A"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-neutral-500">Tamaño:</label>
            <input type="range" min="10" max="80" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} className="w-20" />
            <span className="text-[11px] text-neutral-500 w-8">{textSize}</span>
          </div>
          <button
            onClick={() => {
              if (text) {
                const pos = canvasRef.current?.getBoundingClientRect();
                const cx = pos ? pos.width / 2 : 300;
                const cy = pos ? pos.height / 2 : 300;
                addLayer({ type: "text", id: Date.now().toString(), data: { text, x: cx, y: cy, color: brushColor, size: textSize, font: textFont, style: textStyle } });
                setText("");
                setShowTextInput(false);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-bold hover:bg-secondary-800 transition"
          >
            Agregar Texto
          </button>
        </motion.div>
      )}
    </div>
  );
}
