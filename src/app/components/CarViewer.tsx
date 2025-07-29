"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
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
  showWireframe?: boolean; // Nova prop para controlar o wireframe
}

function Model({
  modelPath,
  showWireframe = false,
}: {
  modelPath: string;
  showWireframe?: boolean;
}) {
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

      // <--- AQUI ESTÁ A LÓGICA PARA APLICAR O WIREframe --->
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (showWireframe) {
            // Cria um material básico para o wireframe
            child.material = new THREE.MeshBasicMaterial({
              color: 0xffffff, // Branco para as linhas
              wireframe: true, // Habilita o modo wireframe
              transparent: true, // Pode ser transparente para melhor visualização
              opacity: 0.2, // Leve opacidade
            });
          } else {
            // Se não for wireframe, tenta restaurar o material original
            // Isso é um pouco mais complexo, idealmente você guardaria os materiais originais
            // Para simplicidade, se showWireframe for false, ele usará o material padrão do GLTF
            // O useLoader já carrega com os materiais, então aqui é só para o caso 'wireframe: false'
            // Se o modelo tem materiais diferentes, você precisaria de uma lógica mais sofisticada aqui.
            // Por agora, se showWireframe for false, não faremos nada e ele manterá o material original do GLTF.
          }
        }
      });
    }
  }, [gltf.scene, showWireframe]); // Adicionado showWireframe como dependência para reagir à mudança

  useFrame(() => {
    if (modelRef.current) {
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
  showWireframe?: boolean; // Passa a prop para o componente Model
}

const CarViewer: React.FC<CarViewerProps> = ({
  modelPath,
  showWireframe = false,
}) => {
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

    THREE.DefaultLoadingManager.onProgress = onProgressCallback;
    THREE.DefaultLoadingManager.onLoad = onLoadCallback;
    THREE.DefaultLoadingManager.onError = (url: string, error?: unknown) => {
      console.error(`Erro ao carregar recurso global: ${url}`, error);

      let errorMessage = `Falha ao carregar modelo 3D ou ambiente: ${url}`;
      if (error instanceof Error) {
        if (
          error.message.includes("429") ||
          error.message.includes("Failed to fetch")
        ) {
          errorMessage +=
            "\nMotivo: Limite de requisições excedido no CDN do ambiente (429 Too Many Requests?).";
        } else {
          errorMessage += `\nDetalhe: ${error.message}`;
        }
      } else if (typeof error === "string") {
        errorMessage += `\nDetalhe: ${error}`;
      } else {
        errorMessage +=
          "\nDetalhe: Erro desconhecido. Verifique o console do navegador.";
      }
      setLoadingError(errorMessage);
    };

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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
          fontSize: "1.2em",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {loadingError}
        <br />
        <small style={{ fontSize: "0.8em", color: "#888" }}>
          Tente recarregar a página ou remova o &lt;Environment /&gt;
          temporariamente se o problema persistir.
        </small>
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
              {/* Passando a prop showWireframe para o componente Model */}
              <Model modelPath={modelPath} showWireframe={showWireframe} />
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

          <OrbitControls makeDefault enableZoom enablePan enableRotate />

          {/* <Environment preset="studio" /> */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CarViewer;
