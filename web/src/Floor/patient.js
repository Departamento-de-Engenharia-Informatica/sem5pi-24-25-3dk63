import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/*
 * parameters = {
 *  patientTextureUrl: String, // URL da textura do paciente
 *  patientModelOBJUrl: String, // URL do arquivo OBJ do paciente
 *  scale: Number, // Escala opcional
 * }
 */

export default class Patient {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        
        this.object = new THREE.Group(); // Cria um grupo para o paciente
        this.objLoader = new OBJLoader(); // Instancia o OBJLoader
        this.textureLoader = new THREE.TextureLoader(); // Instancia o TextureLoader
        
        // Carregar a textura
        this.texture = this.textureLoader.load(this.patientTextureUrl);

        // Carregar o modelo OBJ
        this.objLoader.load(
            this.patientModelOBJUrl, // URL do arquivo OBJ
            (object) => {
                // Ajusta a escala do paciente  
                object.scale.set(0.18,0.18,0.3);

                // Aplica a textura a cada material do modelo
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = this.texture; // Atribui a textura ao material
                        child.material.needsUpdate = true; // Atualiza o material
                    }
                });

                // Adiciona o objeto do paciente ao grupo
                this.object.add(object);
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the patient model:', error);
            }
        );
    }
}
