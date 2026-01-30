export class UIManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.initListeners();
    }

    initListeners() {
        // Uploads
        const coverInput = document.getElementById('coverUpload');
        const spineInput = document.getElementById('spineUpload');

        if (coverInput) {
            coverInput.addEventListener('change', (e) => this.handleImageUpload(e, 'cover'));
        }
        if (spineInput) {
            spineInput.addEventListener('change', (e) => this.handleImageUpload(e, 'spine'));
        }

        // Thickness
        const thicknessRange = document.getElementById('thicknessRange');
        if (thicknessRange) {
            thicknessRange.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                this.sceneManager.setThickness(val);
            });
        }

        // Format Toggles
        const formatBtns = document.querySelectorAll('.toggle-group button');
        formatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update UI active state
                formatBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update scene
                const format = btn.dataset.format;
                this.sceneManager.setFormat(format);
            });
        });

        // Pose Select
        const poseSelect = document.getElementById('poseSelect');
        if (poseSelect) {
            poseSelect.addEventListener('change', (e) => {
                this.sceneManager.setPose(e.target.value);
            });
        }

        // Background
        const bgBtns = document.querySelectorAll('.bg-btn');
        bgBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                bgBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const bg = btn.dataset.bg;
                this.sceneManager.setBackground(bg);
            });
        });

        // Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }
    }

    handleImageUpload(e, type) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.sceneManager.updateTexture(type, event.target.result);
        };
        reader.readAsDataURL(file);
    }

    async handleExport() {
        // Tip: toBlob is usually better but for simple download URL is fine
        // However simple data URL might be too large.
        // SceneManager implementation uses toBlob promise

        /* 
           Crucial: render one frame without grid or ensure background is set as desired. 
           (SceneManager handles this logic)
        */

        const blob = await this.sceneManager.getCanvasBlob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = 'portada-libro-3d.png';
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }
}
