// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshBasicMaterial, Mesh } from 'three';

// Função para adicionar número da sala
function adicionarIdentificacao(scene, numero, x, y, z) {
    const fontLoader = new FontLoader();
    fontLoader.load('./path/to/font.json', (font) => {
        const textGeometry = new TextGeometry(numero.toString(), {
            font: font,
            size: 0.5, // Tamanho do texto
            height: 0.1, // Profundidade do texto
        });
        
        const textMaterial = new MeshBasicMaterial({ color: 0x000000 });
        const textMesh = new Mesh(textGeometry, textMaterial);
        
        // Posicione o texto acima da porta
        textMesh.position.set(x, y, z);
        
        // Ajuste a rotação se necessário
        textMesh.rotation.x = -Math.PI / 2; // Se precisar ajustar a orientação do texto
        
        // Adicione o texto à cena
        scene.add(textMesh);
    });
}

// Exemplo de uso para uma sala na posição (x, y, z)
adicionarNumeroDaSala(scene, 101, portaX, portaY + 1, portaZ);
