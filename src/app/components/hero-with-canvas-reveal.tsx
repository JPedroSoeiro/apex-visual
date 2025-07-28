"use client";
import { CanvasRevealEffect } from "@/app/components/ui/canvas-reveal-effect";
import CarViewer from "../components/CarViewer";

export default function HeroWithCanvasReveal() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas Reveal Effect Background */}
      <div className="absolute inset-0">
        <CanvasRevealEffect
          animationSpeed={2}
          containerClassName="bg-black"
          colors={[
            [0, 0, 180], // Azul escuro
            [0, 0, 220], // Outro tom de azul escuro
            [100, 100, 255], // Azul claro
          ]}
          dotSize={3}
          opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
        />
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="w-full h-screen items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <CarViewer modelPath="/models/skyline/scene.gltf" />
      </div>
    </div>
  );
}
