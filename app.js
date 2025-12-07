
import { SceneManager } from './components/SceneManager.js';
import { UIManager } from './components/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Canvas container
    const container = document.getElementById('canvasContainer');

    // Initialize Scene
    const sceneManager = new SceneManager(container);

    // Initialize UI and connect to Scene
    const uiManager = new UIManager(sceneManager);

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        sceneManager.update();
    }

    animate();
});
