import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import Door from "./door.js";
import SurgeryRoomDoor from "./SurgeryRoomDoor.js";
import Cama from "./cama.js";
import Adereco from "./adereco.js";
import Patient from "./patient.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/*
* parameters = {
*  url: String,
*  credits: String,
*  scale: Vector3
* }
*/

export default class Maze {
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

            //Create a surgery room door
            this.surgeryRoomDoor = new SurgeryRoomDoor({ textureUrl: description.surgeryRoomDoorTextureUrl, height: 2.0 });

            this.cama = new Cama({textureUrl: description.camaTextureUrl, scale: 0.1 });

            this.adereco = new Adereco({textureUrl: description.aderecoTextureUrl, scale: 2 });

            this.patient = new Patient({patientTextureUrl: description.patientTextureUrl, patientModelOBJUrl: description.patientModelOBJUrl});
            
            // Build the maze
            let wallObject;
            let doorObject;
            let surgeryRoomDoorObject;
            let porta1 = true;

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
                        
                        let surgeryRoomDoorObject = this.surgeryRoomDoor.object.clone();
                    if (porta1) {
                        // Primeira porta
                        surgeryRoomDoorObject.rotateY(Math.PI / 2.0);
                        surgeryRoomDoorObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                    } else {
                        // Segunda porta espelhada
                        surgeryRoomDoorObject.scale.x = -1; // Espelha a segunda porta no eixo X
                        surgeryRoomDoorObject.rotateY(Math.PI / 2.0);
                        surgeryRoomDoorObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                    }

                        this.object.add(surgeryRoomDoorObject);
                        porta1 = !porta1; // Alterna o valor de porta1
                    }
                    if(description.map[j][i] == 7) {

                        this.fixSmallGapWest(i, j, description);
                        surgeryRoomDoorObject = this.surgeryRoomDoor.object.clone();

                        if (porta1) {
                            // Primeira porta
                            surgeryRoomDoorObject.position.set(i - description.size.width / 2.0 - 0.5, 0.5, j - description.size.height / 2.0 );
                        } else {
                            // Segunda porta espelhada
                            surgeryRoomDoorObject.scale.x = -1; // Espelha a segunda porta no eixo X
                            surgeryRoomDoorObject.rotateY(Math.PI);
                            surgeryRoomDoorObject.position.set(i - description.size.width / 2.0 - 0.5, 0.5, j - description.size.height / 2.0 + 1);
                        }

                        this.object.add(surgeryRoomDoorObject);
                        porta1 = !porta1; // Alterna o valor de porta1
                    }
                    if(description.map[j][i] == 8) {

                        this.fixSmallGapWest(i, j, description);

                        surgeryRoomDoorObject = this.surgeryRoomDoor.object.clone();

                        if (porta1) {
                            // Primeira porta
                            surgeryRoomDoorObject.rotateY(Math.PI);
                            surgeryRoomDoorObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0 );
                        } else {
                            // Segunda porta espelhada
                            surgeryRoomDoorObject.scale.x = -1; // Espelha a segunda porta no eixo X
                            surgeryRoomDoorObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0 + 1);
                        }

                        this.object.add(surgeryRoomDoorObject);
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

        // Load a maze description resource file
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
}