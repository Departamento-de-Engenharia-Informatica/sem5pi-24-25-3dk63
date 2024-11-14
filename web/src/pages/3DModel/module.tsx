import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Floor from '../../Floor/hospital';
import { useInjection } from "inversify-react";
import { TYPES } from "@/inversify/types";
import { ISurgeryRoomService } from "@/service/IService/ISurgeryRoomService";

export const useFloor3D = () => {
    const floorRef = useRef<any>(null);
    const initializedRef = useRef(false); // Ref para verificar se foi inicializado
    const surgeryRoomService = useInjection<ISurgeryRoomService>(TYPES.surgeryRoomService);

    const fetchJSON = async () => {
      try {
        await surgeryRoomService.createJson();
      } catch (error) {
        console.error("Error fetching surgery rooms:", error);
      }
    };

    // Initialize the 3D Floor Model
    useEffect(() => {
        const initializeFloor = async () => {
            if (initializedRef.current) return; // Verifique se já foi inicializado
            console.log('Initializing floor...');
            initializedRef.current = true; // Marque como inicializado

            if (!floorRef.current) {
                await fetchJSON();
                
                floorRef.current = new Floor(
                    {}, // General Parameters
                    { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
                    {
                        ambientLight: { intensity: 1.0 },
                        directionalLight: { 
                            color: 0xffffff,
                            intensity: 2.0,
                            position: new THREE.Vector3(5.0, 10.0, 5.0),
                            target: new THREE.Vector3(0.0, 0.0, 0.0),
                        }
                    }, // Lights parameters
                    {}, // Fog parameters
                    { view: 'fixed', multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) } // Fixed view camera parameters
                );
    
                // Inicia a animação após floorRef.current ser inicializado
                animate();
            }
        };
    
        // Função para animar o floor
        const animate = () => {
            requestAnimationFrame(animate);
            if (floorRef.current) {
                floorRef.current.update();
            }
        };
    
        initializeFloor();
    }, []); // Empty dependency array, so it runs only once

    return {};
};
