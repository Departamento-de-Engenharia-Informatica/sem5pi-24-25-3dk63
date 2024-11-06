// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  width: Number,
 *  height: Number
 * }
 */

export default class Door {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Carrega a textura para a porta
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Cria um grupo para a porta e os contornos
        this.object = new THREE.Group();

        // Define a altura total da parede e calcula a altura faltante
        const wallHeight = 5; // Altura da parede definida na classe Wall
        const doorHeight = 4; // Altura da porta
        const missingHeight = wallHeight - doorHeight;

        // Cria a face da porta (frente)
        let geometry = new THREE.PlaneGeometry(this.width, doorHeight);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, material);

        // Posiciona a face da porta para que a base fique no chão
        face.position.set(0, 1.5, 0);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Cria a face da porta (verso)
        const backFace = new THREE.Mesh(geometry, material);
        backFace.position.set(0, 1.5, 0);
        backFace.rotation.y = Math.PI; // Gira 180 graus para a parte de trás
        backFace.castShadow = true;
        backFace.receiveShadow = true;
        this.object.add(backFace);
    }
}
