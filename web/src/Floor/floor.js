import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import Door from "./door.js";
import Cama from "./cama.js";
import Adereco from "./adereco.js";
import Patient from "./patient.js";
import WallWithDoorFrame from "./SurgeryDoor.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

/*
* parameters = {
*  url: String,
*  credits: String,
*  scale: Vector3
* }
*/

export default class Floor {
    constructor(parameters) {
        this.onLoad = function (description) {
            this.objLoader = new OBJLoader();
            // Store the maze's map and size
            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl, height: 2.0 });

            //Create a door
            this.door = new Door({ textureUrl: description.doorTextureUrl, height: 2.0 });

            this.cama = new Cama({textureUrl: description.camaTextureUrl, scale: 0.1 });

            //this.adereco = new Adereco({textureUrl: description.aderecoTextureUrl, scale: 2 });
            this.patient = new Patient({patientTextureUrl: description.patientTextureUrl, patientModelOBJUrl: description.patientModelOBJUrl});

            this.wallWithDoorFrame = new WallWithDoorFrame({ textureUrl: description.surgeryRoomDoorTextureUrl, width: 1, height: 2.0 });

            let wallObject;
            let doorObject;
            let wallWithDoorFrameObject;
            let porta1 = true;

            //list com nomes das salas
            let salas = description.surgeryRooms;

            if(salas.length % 2 != 0){
            salas.push("out of service");
             }
            // Separe os elementos das posições ímpares e pares
            let impares = salas.filter((_, index) => index % 2 !== 0);
            let pares = salas.filter((_, index) => index % 2 === 0);

            // Junte as duas listas com ímpares primeiro e pares depois
            salas = [...pares, ...impares];

            console.log(salas);

            console.log(salas);
            let count = 0;

            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                    /*
                    * description.map[][] | North wall | West wall
                    * --------------------+------------+-----------
                    *          0          |     No     |     No
                    *          1          |     No     |    Yes
                    *          2          |    Yes     |     No
                    *          3          |    Yes     |    Yes
                    */
                    if (description.map[j][i] == 2 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0);
                        this.object.add(wallObject);

                    }
                    if (description.map[j][i] == 1 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                    if (description.map[j][i] == 5) {

                        this.fixSmallGapNorth(i, j, description);
                        
                        doorObject = this.door.object.clone();
                        doorObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0);
                        this.object.add(doorObject);
                    }

                    if(description.map[j][i] == 6) {

                        this.fixSmallGapWest(i, j, description);
                        
                        wallWithDoorFrameObject = this.wallWithDoorFrame.object.clone();
                    if (porta1) {
                        // Primeira porta
                        wallWithDoorFrameObject.rotateY(Math.PI / 2.0);
                        wallWithDoorFrameObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);

                        if (i<6){
                        this.adicionarTexto(salas[count], new THREE.Vector3(i - description.size.width / 2.0 + 0.03, 4.32, j - description.size.height / 2.0 +1.15), 0.1, 0xffffff, false);
                        count++;
                        }
                        else{
                            if(salas[count] == "out of service"){
                                this.adicionarTexto(salas[count], new THREE.Vector3(i - description.size.width / 2.0 -0.03, 4.32, j - description.size.height / 2.0 +0.5), 0.1, 0xffffff, true);

                            }
                            else{
                            this.adicionarTexto(salas[count], new THREE.Vector3(i - description.size.width / 2.0 -0.03, 4.32, j - description.size.height / 2.0 +0.85), 0.1, 0xffffff, true);
                            count++;
                            }
                        }
                        console.log("meti a sala" + salas[count-1]);
                    } else {
                        // Segunda porta espelhada
                        wallWithDoorFrameObject.scale.x = -1; // Espelha a segunda porta no eixo X
                        wallWithDoorFrameObject.rotateY(Math.PI / 2.0);
                        wallWithDoorFrameObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                    }

                        this.object.add(wallWithDoorFrameObject);
                        porta1 = !porta1; // Alterna o valor de porta1
                    }
                    if(description.map[j][i] == 7) {

                        this.fixSmallGapWest(i, j, description);
                        wallWithDoorFrameObject = this.wallWithDoorFrame.object.clone();

                        if (porta1) {
                            // Primeira porta
                            wallWithDoorFrameObject.position.set(i - description.size.width / 2.0 - 0.5, 0.5, j - description.size.height / 2.0 );
                            this.adicionarTexto(salas[count], new THREE.Vector3(i - description.size.width / 2.0 + 0.03, 4.32, j - description.size.height / 2.0 +1.15), 0.1, 0xffffff, false);
                            count++;

                        } else {
                            // Segunda porta espelhada
                            wallWithDoorFrameObject.scale.x = -1; // Espelha a segunda porta no eixo X
                            wallWithDoorFrameObject.rotateY(Math.PI);
                            wallWithDoorFrameObject.position.set(i - description.size.width / 2.0 - 0.5, 0.5, j - description.size.height / 2.0 + 1);
                        }

                        this.object.add(wallWithDoorFrameObject);
                        porta1 = !porta1; // Alterna o valor de porta1
                        console.log("meti a sala" + salas[count-1]);
                    }
                    if(description.map[j][i] == 8) {

                        this.fixSmallGapWest(i, j, description);

                        wallWithDoorFrameObject = this.wallWithDoorFrame.object.clone();

                        if (porta1) {
                            // Primeira porta
                            wallWithDoorFrameObject.rotateY(Math.PI);
                            wallWithDoorFrameObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0 );

                            this.adicionarTexto(salas[count], new THREE.Vector3(i - description.size.width / 2.0 -0.03, 4.32, j - description.size.height / 2.0 +0.8), 0.1, 0xffffff, true);
                            count++;
                            
                        } else {
                            // Segunda porta espelhada
                            wallWithDoorFrameObject.scale.x = -1; // Espelha a segunda porta no eixo X
                            wallWithDoorFrameObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0 + 1);
                        }
                        console.log("meti a sala" + salas[count-1]);

                        this.object.add(wallWithDoorFrameObject);
                        porta1 = !porta1; // Alterna o valor de porta1
                    }

                    if (description.map[j][i] == 9) {
                        this.clonarCama(i, j, description); // Chama o novo método para clonar a cama
                        this.clonarPatient(i, j, description); // Chama o novo método para clonar o paciente
                       // this.clonarAdereco(i, j, description); // Chama o novo método para clonar o adereço
                    }

                    if (description.map[j][i] == 4) {
                       this.clonarCama(i, j, description); 
                    }

                    
                    
                    }
                }
            

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a floor description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    fixSmallGapWest(i,j, description) {

        this.wall = new Wall({ textureUrl: description.wallTextureUrl, height: 2.0 });
        let wallObject;

        wallObject = this.wall.object.clone();
        wallObject.rotateY(Math.PI / 2.0);

        const wallHeightScale = 0.2; // Define o fator de escala para a altura da parede
        wallObject.scale.set(1, wallHeightScale, 1);
        
        wallObject.position.set(i - description.size.width / 2.0, 4.1, j - description.size.height / 2.0 + 0.5);

        this.object.add(wallObject);
    }

    fixSmallGapNorth(i,j, description) {

        this.wall = new Wall({ textureUrl: description.wallTextureUrl, height: 2.0 });
        let wallObject;

        wallObject = this.wall.object.clone();

        const wallHeightScale = 0.2; // Define o fator de escala para a altura da parede
        wallObject.scale.set(1, wallHeightScale, 1);
        
        wallObject.position.set(i - description.size.width / 2.0 + 0.5, 4.1, j - description.size.height / 2.0);

        this.object.add(wallObject);
    }

    clonarCama(i, j, description) {
        // Aguarde até que o objeto tenha sido carregado, depois adicione à cena
        this.cama.objLoader.load(this.cama.textureUrl, (object) => {
            const camaObject = this.cama.object.clone(); // Clone do objeto
            // Ajustar a posição da cama para ficar perto da parede
            camaObject.position.set(
                i - description.size.width / 2.0, // Ajuste a posição conforme necessário
                0,
                j - description.size.height / 2.0
            );
            camaObject.rotateY(Math.PI / 2.0);
            this.object.add(camaObject); // Adiciona o objeto cama à cena
        });
    }

    clonarAdereco(i, j, description) {
        // Aguarde até que o objeto tenha sido carregado, depois adicione à cena
        this.adereco.objLoader.load(this.adereco.textureUrl, (object) => {
            const aderecoObject = this.adereco.object.clone(); // Clone do objeto
            // Ajustar a posição do adereço para ficar perto da parede
            aderecoObject.position.set(
                i - description.size.width / 2.0, // Ajuste a posição conforme necessário
                0,
                j - description.size.height / 2.0 -1.48
            );
            aderecoObject.rotateY(Math.PI/12);
            aderecoObject.rotateY(Math.PI);
            this.object.add(aderecoObject); // Adiciona o objeto adereço à cena
        });
    }

    clonarPatient(i, j, description) {
        // Aguarde até que o objeto tenha sido carregado, depois adicione à cena
        this.patient.objLoader.load(this.patient.patientModelOBJUrl, (object) => {
            const patientObject = this.patient.object.clone(); // Clone do objeto
            // Ajustar a posição do paciente para ficar perto da parede
            patientObject.position.set(
                i - description.size.width / 2.0, // Ajuste a posição conforme necessário
                1,
                j - description.size.height / 2.0-0.9
            );
            patientObject.rotateX(Math.PI / 2);
            patientObject.rotateY(Math.PI);
            this.object.add(patientObject); // Adiciona o objeto paciente à cena
        });


    }
    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    adicionarTexto(text, position = new THREE.Vector3(0, 0, 0), size = 1, color = 0xffffff, flipText) {
        // Load the font
        const loader = new FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            // Create the text geometry
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: size,
                depth: 0.01, // You can adjust the thickness of the text
            });
    
            // Create a material for the text
            const textMaterial = new THREE.MeshBasicMaterial({ color: color });
    
            // Create the mesh with text geometry and material
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
            // Set the position of the text
            textMesh.position.set(position.x, position.y, position.z);

            textMesh.rotateY(Math.PI/2);
            // Rotate the text based on whether it needs to be flipped
            if (flipText) {
                textMesh.rotateY(Math.PI); // Flip the text 180 degrees
            } 
    
            // Add the text to the scene
            this.object.add(textMesh);
        });
    }
    
}