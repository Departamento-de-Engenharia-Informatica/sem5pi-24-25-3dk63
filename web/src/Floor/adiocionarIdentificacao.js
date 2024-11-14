import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
/*
 * parameters = {
 *  width: Number,  // Largura do retângulo
 *  height: Number, // Altura do retângulo
 *  position: THREE.Vector3 // Posição do retângulo na cena
 * }
 */

export default class RoomLabel {
    constructor(parameters) {
        // Define as propriedades passadas nos parâmetros
        this.width = parameters.width;
        this.height = parameters.height;
        this.position = parameters.position;

        // Create geometry and material for the small rectangle
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.MeshPhongMaterial({ color: 0xe0eff2, side: THREE.DoubleSide });

        // Create the mesh for the small rectangle
        this.object = new THREE.Mesh(geometry, material);
        this.object.position.set(parameters.x, parameters.y, parameters.z);
        this.object.castShadow = false;
        this.object.receiveShadow = true;

    }

    // Método para carregar a fonte e criar o texto
/*createText(x, y, z) {
    this.fontLoader = new FontLoader();

    const fontURL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

    this.fontLoader.load(fontURL, (font) => {
        // Create text geometry with reduced size
        const textGeometry = new TextGeometry('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', {
            font: font,
            size: 5,  // Reduced size
            depth: 20,  // Use depth instead of height
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
        });

        // Compute bounding box for the text
        textGeometry.computeBoundingBox();
        const boundingBox = textGeometry.boundingBox;

        // Check if bounding box is valid
        if (boundingBox) {
            console.log('Text Bounding Box:', boundingBox);

            const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Compute the center of the bounding box
            const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
            const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
            const centerZ = (boundingBox.max.z + boundingBox.min.z) / 2;

            console.log("Bounding Box Center:", centerX, centerY, centerZ);

            // Log the input coordinates
            console.log("Input Position:", x, y, z);

            // Validate the x, y, z coordinates before using them
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                console.error("Invalid position values:", x, y, z);
                return; // Return early if position values are invalid
            }

            // Apply smaller offset to avoid large displacement
            const offsetFactor = 0.1; // Apply a smaller factor to center position

            const finalX = x - centerX * offsetFactor;
            const finalY = y - centerY * offsetFactor;
            const finalZ = z - centerZ * offsetFactor;

            console.log("Final Text Position:", finalX, finalY, finalZ);

            // Set the final position of the text
            textMesh.position.set(finalX, finalY, finalZ);
            this.object.add(textMesh);
        } else {
            console.error('Bounding box is not valid.');
        }
    }, undefined, (error) => {
        console.error('Error loading font:', error);
    });
}
*/
    
    
    
    
}    