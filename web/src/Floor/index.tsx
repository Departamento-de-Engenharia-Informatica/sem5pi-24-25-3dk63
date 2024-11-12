import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Floor from './hospital';
import './index.css';

const Floor3D: React.FC = () => {
    const floorRef = useRef<any>(null);

    useEffect(() => {
        if (!floorRef.current) {
            // Inicialização do Floor
            floorRef.current = new Floor(
                {}, // General Parameters
                { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
                {ambientLight: { intensity: 1.0 },
                 pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
                 pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) }
                }, // Lights parameters
                {}, // Fog parameters
                { view: 'fixed', multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Fixed view camera parameters
            );
        }

        function animate() {
            requestAnimationFrame(animate);
            if (floorRef.current) {
                floorRef.current.update();
            }
        }

        animate();
    }, []);



    
    return (
        <div id="parent">
            <div id="views-panel">
                <table className="views">
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
                                <input type="number" id="horizontal" required />
                            </td>
                            <td>
                                <label>Orientation (v):</label>
                                <input type="number" id="vertical" required />
                            </td>
                            <td>
                                <input type="button" id="reset" value="Reset view" />
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
                                <input type="number" id="distance" required />
                            </td>
                            <td>
                                <label>Zoom:</label>
                                <input type="number" id="zoom" required />
                            </td>
                            <td>
                                <input type="button" id="reset-all" value="Reset all views" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Floor3D;
