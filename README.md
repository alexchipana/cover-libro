# Book Cover 3D Mockup Generator

A professional web application for generating realistic 3D book mockups from cover images. Built with Next.js and Three.js.

![Book Cover 3D Mockup Generator](https://via.placeholder.com/800x400?text=Book+Cover+3D+Mockup+Generator)

## ✨ Features

- **📤 Image Upload**: Upload custom cover and spine images with drag & drop support
- **📚 Realistic 3D Books**: Procedural geometry for both hardcover and softcover books
- **🎮 Interactive Controls**: Rotate, zoom, and examine your book from any angle
- **⚙️ Customizable Settings**:
  - Hardcover or softcover options
  - Adjustable spine width
  - Custom page edge color
- **💡 Professional Lighting**: Choose between soft or studio lighting setups
- **🌓 Shadows**: Toggle realistic shadow effects
- **📸 Export**: Download high-quality PNG images with transparent background

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cover-libro.git
cd cover-libro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the application for static export:
```bash
npm run build
```

The static output will be in the `out/` directory, ready for deployment.

### Preview Production Build

```bash
npx serve out
```

## 📁 Project Structure

```
cover-libro/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions deployment
├── src/
│   ├── app/
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Main page component
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── Book3D.tsx          # 3D book geometry component
│   │   │   ├── Scene.tsx           # 3D scene wrapper with Canvas
│   │   │   └── Lights.tsx          # Lighting system
│   │   └── ui/
│   │       ├── ControlsPanel.tsx   # Side panel with all controls
│   │       ├── ImageUploader.tsx   # Drag & drop image upload
│   │       └── ExportButton.tsx    # PNG export functionality
│   ├── hooks/
│   │   ├── useBookTexture.ts       # Texture loading hook
│   │   └── useScreenshot.ts        # Screenshot capture hook
│   ├── utils/
│   │   └── exportUtils.ts          # Export utilities
│   └── types/
│       └── index.ts                # TypeScript definitions
├── public/                         # Static assets
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## 🎨 Usage Guide

### 1. Upload Cover Image
Click the upload area to select your book cover image. Supported formats: PNG, JPG, WEBP.

### 2. Upload Spine Image (Optional)
Add a spine image for additional realism on the book spine.

### 3. Adjust Book Settings
- **Cover Type**: Choose between hardcover or softcover
- **Spine Width**: Adjust the thickness of the book spine
- **Page Edge Color**: Customize the color of the page edges

### 4. Configure Lighting
- **Shadows**: Toggle realistic shadow effects
- **Light Intensity**: Adjust the overall lighting brightness
- **Lighting Type**: Choose between "Soft" or "Studio" lighting presets

### 5. Interact with 3D View
- **Rotate**: Click and drag to rotate the book
- **Zoom**: Use mouse wheel to zoom in/out
- **Pan**: Right-click and drag to pan

### 6. Export Your Mockup
Click "Export PNG" to download a high-quality image with transparent background.

## 🌐 Deployment

### GitHub Pages (Recommended)

1. Push your code to a GitHub repository
2. Go to Repository Settings → Pages
3. Select the `gh-pages` branch as source
4. The application will be available at:
   ```
   https://yourusername.github.io/repository-name/
   ```
5. Update `next.config.js` with your repository name:
   ```javascript
   assetPrefix: '/repository-name/',
   ```

### Manual Deployment

```bash
npm run build
# Upload the contents of the 'out' folder to your web host
```

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

### Netlify Deployment

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **3D Graphics**: Three.js with React Three Fiber
- **Language**: TypeScript
- **Styling**: CSS Modules / Global CSS
- **Build Tool**: Turbopack-ready

## 📝 API Reference

### BookConfig Interface

```typescript
interface BookConfig {
  coverTexture: string | null;      // URL of cover image
  spineTexture: string | null;      // URL of spine image
  coverType: 'hard' | 'soft';       // Book binding type
  spineWidth: number;               // Spine thickness (0.2 - 1.0)
  pageEdgeColor: string;            // Hex color for page edges
  width: number;                    // Book width
  height: number;                   // Book height
}
```

### LightingConfig Interface

```typescript
interface LightingConfig {
  shadowsEnabled: boolean;          // Enable/disable shadows
  lightIntensity: number;           // Light intensity (0.2 - 2.0)
  lightingType: 'soft' | 'studio';  // Lighting preset
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for amazing 3D graphics
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration
- [Next.js](https://nextjs.org/) for the amazing framework
- [Drei](https://github.com/pmndrs/drei) for useful helpers

---

Made with ❤️ for designers and developers
