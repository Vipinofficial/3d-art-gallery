# Enhanced 3D Art Gallery Landing Page

A cutting-edge, interactive landing page built with React, Three.js, WebGL, and GSAP animations. This project showcases modern web development techniques with immersive 3D graphics and smooth animations.

## 🚀 Features

### Interactive 3D Elements
- **Three.js Background**: Floating particles, animated geometries, and spiral galaxy effects
- **WebGL Rendering**: Hardware-accelerated graphics for smooth performance
- **Mouse Interaction**: Elements respond to cursor movement
- **3D Gallery Viewer**: Interactive virtual art gallery with camera controls

### Advanced Animations
- **GSAP Integration**: Smooth scroll-triggered animations and transitions
- **Magnetic Buttons**: Interactive buttons that respond to mouse proximity
- **Text Reveal Effects**: Character-by-character text animations
- **Parallax Scrolling**: Multi-layer depth effects
- **Morphing Shapes**: Dynamic geometric transformations
- **Loading Animations**: Engaging loading screen with progress indicators

### Modern UI/UX
- **Glass Morphism**: Translucent elements with backdrop blur effects
- **Gradient Text**: Multi-color gradient typography
- **Floating Cards**: 3D-transformed interactive cards
- **Responsive Design**: Mobile-first approach with touch support
- **Dark Theme**: Modern dark color scheme with accent colors
- **Scroll Progress**: Visual scroll indicator

### Performance Optimizations
- **Lazy Loading**: Components load as needed
- **Optimized Animations**: Hardware-accelerated CSS and WebGL
- **Efficient Rendering**: Three.js performance optimizations
- **Memory Management**: Proper cleanup of animations and 3D objects

## 🛠 Technology Stack

- **React 19.1.0** - Modern React with hooks and concurrent features
- **Three.js 0.178.0** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **GSAP 3.13.0** - Professional animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
enhanced-3d-landing/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui components
│   │   ├── ThreeBackground.jsx    # 3D background effects
│   │   ├── InteractiveGallery.jsx # 3D gallery viewer
│   │   ├── ParticleSystem.jsx     # Particle effects
│   │   └── AnimatedSection.jsx    # GSAP animated components
│   ├── hooks/
│   │   └── useGSAP.js            # Custom GSAP hooks
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Global styles and animations
│   └── main.jsx                  # Application entry point
├── public/                       # Static assets
├── index.html                    # HTML template
└── package.json                  # Dependencies and scripts
```

## 🎨 Key Components

### ThreeBackground.jsx
- Floating particle systems with 2000+ particles
- Animated geometric shapes (spheres, boxes, torus)
- Mouse-following interactive elements
- Spiral galaxy effect with 5000 particles
- Dynamic lighting system

### InteractiveGallery.jsx
- Virtual 3D gallery room environment
- Interactive artwork frames with hover effects
- Smooth camera transitions
- Spotlight lighting for artworks
- Navigation controls

### AnimatedSection.jsx
- Animated counters with easing
- Magnetic button effects
- Floating cards with 3D transforms
- Text reveal animations
- Morphing shapes
- Parallax containers

### useGSAP.js
- Scroll-triggered animations
- Loading screen transitions
- Hover effect management
- Magnetic button logic
- Progress indicators
- Typewriter effects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd enhanced-3d-landing
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev --host
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
pnpm run build
```

The built files will be in the `dist/` directory.

## 🎯 Usage Examples

### Adding Custom 3D Elements

```jsx
import { Canvas } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';

function CustomScene() {
  return (
    <Canvas>
      <Box position={[0, 0, 0]}>
        <meshStandardMaterial color="hotpink" />
      </Box>
    </Canvas>
  );
}
```

### Creating GSAP Animations

```jsx
import { useScrollAnimations } from './hooks/useGSAP';

function AnimatedComponent() {
  useScrollAnimations();
  
  return (
    <div className="fade-in">
      <h1>This will fade in on scroll</h1>
    </div>
  );
}
```

### Magnetic Button Implementation

```jsx
import { MagneticButton } from './components/AnimatedSection';

function MyButton() {
  return (
    <MagneticButton 
      className="bg-purple-600 text-white px-6 py-3 rounded-full"
      strength={0.3}
    >
      Hover me!
    </MagneticButton>
  );
}
```

## 🎨 Customization

### Colors and Themes
Edit `src/App.css` to modify the color scheme:

```css
:root {
  --primary: oklch(0.7 0.3 270);    /* Purple */
  --accent: oklch(0.7 0.3 200);     /* Cyan */
  --background: oklch(0.02 0 0);    /* Dark */
}
```

### Animation Settings
Modify GSAP animations in `src/hooks/useGSAP.js`:

```javascript
// Adjust animation duration and easing
gsap.to(element, {
  duration: 1.5,        // Animation length
  ease: "power3.out",   // Easing function
  delay: 0.2           // Start delay
});
```

### 3D Scene Configuration
Customize Three.js elements in component files:

```jsx
// Particle count and behavior
<ParticleField count={1000} color="#8b5cf6" speed={0.5} />

// Camera settings
<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
```

## 📱 Responsive Design

The landing page is fully responsive with:
- Mobile-first CSS approach
- Touch-friendly interactions
- Adaptive 3D rendering
- Optimized animations for mobile devices
- Flexible grid layouts

## ⚡ Performance Tips

1. **Reduce Particle Count**: Lower particle counts on mobile devices
2. **Optimize Textures**: Use compressed image formats
3. **Limit Concurrent Animations**: Stagger complex animations
4. **Use Hardware Acceleration**: Leverage CSS transforms and WebGL
5. **Implement Lazy Loading**: Load 3D components when needed

## 🐛 Troubleshooting

### Common Issues

**Three.js not rendering:**
- Check WebGL support in browser
- Verify canvas element is properly mounted
- Ensure proper cleanup in useEffect

**GSAP animations not working:**
- Verify ScrollTrigger plugin registration
- Check element selectors and timing
- Ensure proper cleanup on unmount

**Performance issues:**
- Reduce particle counts
- Optimize animation frequency
- Use CSS transforms instead of JavaScript where possible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Three.js** - Amazing 3D graphics library
- **GSAP** - Professional animation platform
- **React Three Fiber** - Excellent React integration for Three.js
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful component library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using modern web technologies**

