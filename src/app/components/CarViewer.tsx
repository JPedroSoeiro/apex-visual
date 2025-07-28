"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber"; // Adicionado useFrame
import {
  OrbitControls,
  Environment,
  Html,
  Bounds,
  useBounds,
} from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

interface CarModelProps {
  modelPath: string;
}

function Model({ modelPath }: { modelPath: string }) {
  const dracoLoader = useMemo(() => {
    const loader = new DRACOLoader();
    loader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Ou '/draco/' se local
    return loader;
  }, []);

  const gltf = useLoader(
    GLTFLoader,
    modelPath,
    (loader) => {
      loader.setDRACOLoader(dracoLoader);
    },
    (event) => {
      /* onProgress */
    }
  );

  const modelRef = useRef<THREE.Group>(null);

  React.useLayoutEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center);
      modelRef.current.scale.set(0.01, 0.01, 0.01);
    }
  }, [gltf.scene]);

  // <--- CORREÇÃO AQUI: Adicionado useFrame para rotação automática
  useFrame(() => {
    if (modelRef.current) {
      // Rotaciona o modelo no eixo Y (vertical). Ajuste o '0.005' para controlar a velocidade.
      modelRef.current.rotation.y += 0.005;
    }
  });

  return <primitive object={gltf.scene} ref={modelRef} />;
}

function FitToView({ children }: { children: React.ReactNode }) {
  const api = useBounds();

  React.useEffect(() => {
    if (api) {
      api.refresh().clip().fit();
    }
  }, [api, children]);

  return <>{children}</>;
}

interface CarViewerProps {
  modelPath: string;
}

const CarViewer: React.FC<CarViewerProps> = ({ modelPath }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const onProgressCallback = (
      url: string,
      itemsLoaded: number,
      itemsTotal: number
    ) => {
      if (itemsTotal > 0) {
        setLoadingProgress((itemsLoaded / itemsTotal) * 100);
      } else {
        setLoadingProgress(0);
      }
    };

    const onLoadCallback = () => {
      setLoadingProgress(100);
      setLoadingError(null);
    };

    const onErrorCallback = (url: string) => {
      console.error(`Erro ao carregar recurso global: ${url}`);
      let errorMessage = `Falha ao carregar modelo 3D: ${url}`;
      setLoadingError(
        errorMessage +
          "\nVerifique o console do navegador para mais detalhes específicos."
      );
    };

    THREE.DefaultLoadingManager.onProgress = onProgressCallback;
    THREE.DefaultLoadingManager.onLoad = onLoadCallback;
    THREE.DefaultLoadingManager.onError = onErrorCallback;

    return () => {
      THREE.DefaultLoadingManager.onProgress = () => {};
      THREE.DefaultLoadingManager.onLoad = () => {};
      THREE.DefaultLoadingManager.onError = () => {};
    };
  }, []);

  if (loadingError) {
    return (
      <div
        style={{
          width: "100%",
          height: "600px",
          background: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Html
          center
          className="error-message"
          style={{ color: "red", fontSize: "1.2em" }}
        >
          {loadingError}
          <br />
          Verifique o console do navegador (F12) para detalhes.
        </Html>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 5000 }}
        shadows
      >
        <Suspense
          fallback={
            <Html center>
              Carregando Modelo 3D... {loadingProgress.toFixed(0)}%
            </Html>
          }
        >
          <Bounds fit clip observe>
            <FitToView>
              <Model modelPath={modelPath} />
            </FitToView>
          </Bounds>

          <ambientLight intensity={0.7} />
          <directionalLight position={[1, 1, 1]} intensity={1.5} castShadow />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />

          {/* OrbitControls: makeDefault é importante se você tem mais de um controle */}
          {/* Se quiser rotação manual E automática, o makeDefault pode ser problemático.
              Se quiser SÓ automática, certifique-se de que nenhum outro controle está ativo.
              Com a rotação automática, o OrbitControls pode lutar com ela.
              Para rotação automática pura, você pode remover o OrbitControls. */}
          <OrbitControls makeDefault enableZoom enablePan enableRotate />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CarViewer;
