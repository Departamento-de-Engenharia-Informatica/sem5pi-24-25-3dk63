// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'; // Make sure to use the correct import path

/*
 * parameters = {
 *  textureUrl: String,
 *  scale: Number,
 *  rotation: { x: Number, y: Number, z: Number }
 * }
 */

export default class Adereco {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        
        this.object = new THREE.Group(); // Create a group for the bed
        this.objLoader = new OBJLoader(); // Instantiate the OBJLoader

        this.objLoader.load(
            this.textureUrl,
            (object) => {
                // Adjust the scale of the bed
                object.scale.set(1.5, 1.5, 1.5); // Apply the scale

                // Add the bed object to the group
                this.object.add(object);
            }
        );
    }
}
