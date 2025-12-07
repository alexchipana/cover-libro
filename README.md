# BookCover3D Creator

A backend-free 3D mockup generator for books. Built with [Three.js](https://threejs.org/).

## Features
- **3D Preview**: Real-time rendering of book cover and spine.
- **Customization**:
  - Upload Cover and Spine images.
  - Adjust Thickness.
  - Switch between Hardcover and Softcover formats.
  - Change Backgrounds (Transparent, Colors, Wood).
  - Preset Poses (Standing, Lying, Angled).
- **Stack Mode**: Create a pile of books.
- **Export**: High-resolution PNG export (transparent background supported).

## How to Run locally
1. Clone this repository.
2. Open `index.html` in your browser.
   - *Note*: Due to CORS restrictions with local file loading, it is recommended to run a local server:
     ```bash
     npx http-server .
     ```

## Deployment to GitHub Pages
1. Push this code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Select `main` branch and `/ (root)` folder.
4. Save. Your app will be live at `https://<username>.github.io/<repo-name>/`.

## Assets
- Icons: Phosphor Icons / FontAwesome (via CDN/SVG)
- Fonts: Google Fonts (Inter)
- Textures: 