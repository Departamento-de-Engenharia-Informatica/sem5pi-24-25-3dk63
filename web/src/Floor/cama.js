import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; // Make sure to use the correct import path

/*
 * parameters = {
 *  textureUrl: String,
 *  scale: Number,
 *  rotation: { x: Number, y: Number, z: Number }
 * }
 */

export default class Cama {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        
        this.object = new THREE.Group(); // Create a group for the bed
        this.objLoader = new OBJLoader(); // Instantiate the OBJLoader
        this.textureLoader = new THREE.TextureLoader();

        this.objLoader.load(
            this.textureUrl,
            (object) => {
                // Adjust the scale of the bed
                object.scale.set(0.1, 0.1, 0.1); // Apply the scale

                // Aplica a textura a cada material do modelo
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material.color = new THREE.Color(0x5F9EA0); // Example brown color
                        child.material.needsUpdate = true;
                    }
                });
                
                // Add the bed object to the group
                this.object.add(object);
            }
        );
    }
}
