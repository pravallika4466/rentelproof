import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const ThreeHeroVisual = () => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects for mouse rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Vault Polyhedron (Icosahedron representing secure deposit & property verification)
    const vaultGeometry = new THREE.IcosahedronGeometry(2.1, 1);
    const vaultMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x064e3b : 0x059669,
      emissive: isDark ? 0x022c22 : 0x047857,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.65,
    });
    const vaultMesh = new THREE.Mesh(vaultGeometry, vaultMaterial);
    mainGroup.add(vaultMesh);

    // 2. Inner Glowing Core (representing verifiable truth / deposit evidence)
    const coreGeometry = new THREE.OctahedronGeometry(1.1, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: isDark ? 0.8 : 0.4,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 3. Orbiting Protection Rings (Torus)
    const ringGeometry = new THREE.TorusGeometry(3.0, 0.03, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });

    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring2.rotation.y = Math.PI / 3;
    ring2.scale.set(0.9, 0.9, 0.9);
    mainGroup.add(ring2);

    // 4. Ambient Floating Data Particles (Emerald + warm amber, ZERO BLUE)
    const particleCount = 240;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const emeraldColor = new THREE.Color(0x10b981);
    const amberColor = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 12;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;

      // 80% emerald, 20% warm amber
      const chosenColor = Math.random() > 0.2 ? emeraldColor : amberColor;
      particleColors[i3] = chosenColor.r;
      particleColors[i3 + 1] = chosenColor.g;
      particleColors[i3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.55,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Lighting (Strict non-blue: Emerald & Warm Amber)
    const ambientLight = new THREE.AmbientLight(isDark ? 0x111827 : 0xffffff, isDark ? 1.5 : 1.2);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 20);
    emeraldLight.position.set(4, 4, 4);
    scene.add(emeraldLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 2.0, 15);
    amberLight.position.set(-4, -3, 3);
    scene.add(amberLight);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      if (!prefersReducedMotion) {
        // Continuous subtle rotations
        vaultMesh.rotation.x = elapsedTime * 0.15;
        vaultMesh.rotation.y = elapsedTime * 0.2;

        coreMesh.rotation.y = -elapsedTime * 0.3;
        coreMesh.rotation.z = elapsedTime * 0.15;

        ring1.rotation.z = elapsedTime * 0.25;
        ring2.rotation.x = -elapsedTime * 0.2;

        particles.rotation.y = elapsedTime * 0.04;

        // Smooth mouse parallax lerp
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

        // Subtle floating bob
        mainGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup to prevent WebGL leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      vaultGeometry.dispose();
      vaultMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[450px] lg:h-[540px] flex items-center justify-center pointer-events-auto"
      style={{ touchAction: 'none' }}
      aria-label="3D Interactive Digital Evidence & Deposit Vault"
    />
  );
};

export default ThreeHeroVisual;
