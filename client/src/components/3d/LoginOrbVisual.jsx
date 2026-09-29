import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const LoginOrbVisual = () => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let mainGroup, coreMesh, outerMesh, ringMesh, particleSystem;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 500;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 6.5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // 1. Central Holographic Dodecahedron Core
      const coreGeo = new THREE.DodecahedronGeometry(1.6, 1);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x064e3b : 0x059669,
        emissive: 0x10b981,
        emissiveIntensity: isDark ? 0.75 : 0.45,
        roughness: 0.1,
        metalness: 0.85,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.7 : 0.6,
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);

      // 2. Inner Glowing Nucleus
      const nucleusGeo = new THREE.IcosahedronGeometry(0.8, 2);
      const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x10b981,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      mainGroup.add(nucleusMesh);

      // 3. Orbiting Geometric Shards Ring
      const ringGeo = new THREE.TorusGeometry(2.6, 0.04, 16, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.8,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      ringMesh.rotation.y = Math.PI / 6;
      mainGroup.add(ringMesh);

      // 4. Floating Identity Particles
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const colorArray = new Float32Array(particleCount * 3);

      const emerald = new THREE.Color(0x10b981);
      const amber = new THREE.Color(0xf59e0b);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 8;
        posArray[i3 + 1] = (Math.random() - 0.5) * 8;
        posArray[i3 + 2] = (Math.random() - 0.5) * 6;

        const col = Math.random() > 0.25 ? emerald : amber;
        colorArray[i3] = col.r;
        colorArray[i3 + 1] = col.g;
        colorArray[i3 + 2] = col.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.8 : 0.6,
        blending: THREE.AdditiveBlending,
      });
      particleSystem = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(particleSystem);

      // Lights (Zero blue - emerald + warm amber)
      const ambientLight = new THREE.AmbientLight(isDark ? 0x060708 : 0xffffff, isDark ? 1.5 : 1.2);
      scene.add(ambientLight);

      const light1 = new THREE.PointLight(0x10b981, 4, 15);
      light1.position.set(3, 3, 4);
      scene.add(light1);

      const light2 = new THREE.PointLight(0xf59e0b, 2.5, 12);
      light2.position.set(-3, -2, 2);
      scene.add(light2);

      let targetRotX = 0;
      let targetRotY = 0;

      handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = x * 0.5;
        targetRotX = -y * 0.5;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      const startTime = performance.now();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const t = (performance.now() - startTime) * 0.001;

        if (!prefersReducedMotion) {
          coreMesh.rotation.y = t * 0.25;
          coreMesh.rotation.x = t * 0.15;

          ringMesh.rotation.z = t * 0.3;
          ringMesh.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.15;

          particleSystem.rotation.y = -t * 0.08;

          mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.06;
          mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.06;
          mainGroup.position.y = Math.sin(t * 1.2) * 0.1;
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Login 3D scene initialization error:', e);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize) window.removeEventListener('resize', handleResize);

      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] flex items-center justify-center pointer-events-auto"
      aria-label="3D Cryptographic Identity Orb"
    />
  );
};

export default LoginOrbVisual;
