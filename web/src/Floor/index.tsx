// index.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Orientation from './orientation';
import Floor from './hospital';

const FloorEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLInputElement>(null);
  const verticalRef = useRef<HTMLInputElement>(null);
  const distanceRef = useRef<HTMLInputElement>(null);
  const zoomRef = useRef<HTMLInputElement>(null);
  let floor: Floor | null = null;

  // Função de inicialização
  useEffect(() => {
    if (containerRef.current) {
      // Configurar o renderizador
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Configurar os parâmetros do Floor
      floor = new Floor(
        {}, // Parâmetros gerais
        { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Parâmetros do floor
        { // Parâmetros de iluminação
          ambientLight: { intensity: 1.0 },
          pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
          pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) }
        },
        {}, // Parâmetros de neblina
        { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Parâmetros de câmera
        {}
      );

      // Função de animação
      const animate = () => {
        requestAnimationFrame(animate);
        floor?.update();
      };
      animate();
    }

    // Limpeza ao desmontar o componente
    return () => {
      containerRef.current?.removeChild(containerRef.current?.firstChild as Node);
    };
  }, []);

  // Funções de reset da visão e de todas as visões
  const resetView = () => {
    if (horizontalRef.current) horizontalRef.current.value = '0';
    if (verticalRef.current) verticalRef.current.value = '0';
    // Lógica adicional para resetar a orientação
  };

  const resetAllViews = () => {
    if (distanceRef.current) distanceRef.current.value = '10';
    if (zoomRef.current) zoomRef.current.value = '1';
    // Lógica adicional para resetar a visão geral e zoom
  };

  return (
    <div ref={containerRef}>
      <div
        id="views-panel"
        style={{
          position: 'absolute',
          left: '-50vmin',
          top: '1vh',
          zIndex: 1,
          width: '100vmin',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.5vmin',
          color: 'white',
        }}
      >
        <table
          className="views"
          style={{
            backgroundColor: '#70707070',
            textAlign: 'right',
            margin: 'auto',
            border: '1px solid black',
          }}
        >
          <tbody>
            <tr>
              <td>
                <label>View:</label>
                <select id="view">
                  <option value="fixed">Fixed</option>
                </select>
              </td>
              <td>
                <label>Orientation (h):</label>
                <input type="number" ref={horizontalRef} required />
              </td>
              <td>
                <label>Orientation (v):</label>
                <input type="number" ref={verticalRef} required />
              </td>
              <td>
                <button onClick={resetView}>Reset view</button>
              </td>
            </tr>
            <tr>
              <td>
                <label>Projection:</label>
                <select id="projection">
                  <option value="perspective">Perspective</option>
                  <option value="orthographic">Orthographic</option>
                </select>
              </td>
              <td>
                <label>Distance:</label>
                <input type="number" ref={distanceRef} required />
              </td>
              <td>
                <label>Zoom:</label>
                <input type="number" ref={zoomRef} required />
              </td>
              <td>
                <button onClick={resetAllViews}>Reset all views</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloorEditor;
