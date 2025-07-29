// src/app/components/RightColumn.tsx
"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";

export default function RightColumn() {
  return (
    <div
      style={{ background: "rgba(0, 0, 0, 0.2)" }}
      className="w-full md:w-1/2 h-full rounded-lg p-8 flex flex-col items-center justify-center text-white text-center"
    >
      <h2 className="text-3xl font-bold mb-4">Troca de veiculo</h2>

      {/* Botões */}
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Button className="w-full py-6 text-xl">Skyline</Button>
        <Button className="w-full py-6 text-xl">Supra</Button>
        <Button className="w-full py-6 text-xl">Impala 67</Button>
        <Button className="w-full py-6 text-xl">MD-902</Button>
      </div>
    </div>
  );
}
