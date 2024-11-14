// src/components/Floor3D/index.tsx

import React from 'react';
import { useFloor3D } from './module';  // Importa o hook que contém a lógica de inicialização do Floor3D
import './index.css';

const Floor3D: React.FC = () => {
    const {} = useFloor3D(); 


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