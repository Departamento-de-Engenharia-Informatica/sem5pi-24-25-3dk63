import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  width: Number,
 *  height: Number
 * }
 */

export default class SurgeryDoor {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Carrega a textura para a porta
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Cria um grupo para a porta e suas faces
        this.object = new THREE.Group();

        // Define as dimensões da porta e a posição vertical
        const height = 4;
        const width = 1;
        const halfHeight = height / 2 - 0.5;

        // Face frontal da porta
        const frontGeometry = new THREE.PlaneGeometry(width, height);
        const frontMaterial = new THREE.MeshPhongMaterial({
            color: 0x9cacb2,
            map: texture,
            transparent: true,
            alphaTest: 0.5, // Garante que áreas transparentes não projetem sombra
        });
        const frontFace = new THREE.Mesh(frontGeometry, frontMaterial);
        frontFace.position.set(0.0, halfHeight, 0.025);
        frontFace.castShadow = true;
        frontFace.receiveShadow = true;
        this.object.add(frontFace);

        // Face traseira da porta (textura invertida)
        const backMaterial = frontMaterial.clone();
        backMaterial.map = texture.clone();  // Clona a textura para a face traseira
        backMaterial.map.wrapS = THREE.RepeatWrapping;
        backMaterial.map.repeat.x = -1;      // Inverte a textura horizontalmente
        const backFace = new THREE.Mesh(frontGeometry, backMaterial);
        backFace.position.set(0.0, halfHeight, -0.025);
        backFace.rotation.y = Math.PI;
        backFace.castShadow = true;
        backFace.receiveShadow = true;
        this.object.add(backFace);

        // Face esquerda da porta
        const sideGeometry = new THREE.PlaneGeometry(0.05, height);
        const sideMaterial = new THREE.MeshPhongMaterial({ color: 0x9cacb2, side: THREE.DoubleSide });
        const leftFace = new THREE.Mesh(sideGeometry, sideMaterial);
        leftFace.position.set(-width / 2, halfHeight, 0);
        leftFace.rotation.y = Math.PI / 2;
        leftFace.castShadow = true;
        leftFace.receiveShadow = true;
        this.object.add(leftFace);

        // Face direita da porta
        const rightFace = leftFace.clone();
        rightFace.position.set(width / 2, halfHeight, 0);
        this.object.add(rightFace);

        // Face superior da porta
        const topGeometry = new THREE.PlaneGeometry(width, 0.05);
        const topFace = new THREE.Mesh(topGeometry, sideMaterial);
        topFace.position.set(0, height - 0.5, 0);
        topFace.rotation.x = -Math.PI / 2;
        topFace.castShadow = true;
        topFace.receiveShadow = true;
        this.object.add(topFace);
    }
}
