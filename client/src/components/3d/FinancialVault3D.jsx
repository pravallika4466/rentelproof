import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const FinancialVault3D = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let safeGroup, safeBox, dialRing, coinToken;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 220;

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      safeGroup = new THREE.Group();
      scene.add(safeGroup);

      // 1. Outer Escrow Vault Frame (Chamfered Octahedron)
      const boxGeo = new THREE.OctahedronGeometry(1.6, 1);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x064e3b : 0x059669,
        emissive: 0x022c22,
        roughness: 0.15,
        metalness: 0.85,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.75 : 0.6,
      });
      safeBox = new THREE.Mesh(boxGeo, boxMat);
      safeGroup.add(safeBox);

      // 2. Rotating Gold Escrow Bullion Coin in the center
      const coinGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.9,
      });
      coinToken = new THREE.Mesh(coinGeo, coinMat);
      coinToken.rotation.x = Math.PI / 3;
      safeGroup.add(coinToken);

      // 3. Dual Lock Rings (Dial Rings)
      const ringGeo1 = new THREE.TorusGeometry(2.1, 0.04, 16, 60);
      const ringMat1 = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      dialRing = new THREE.Mesh(ringGeo1, ringMat1);
      safeGroup.add(dialRing);

      // 4. Floating Currency / Liquidity Sparks (Gold + Emerald)
      const particleCount = 70;
      const partGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const colArray = new Float32Array(particleCount * 3);

      const gold = new THREE.Color(0xf59e0b);
      const emerald = new THREE.Color(0x10b981);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 6;
        posArray[i3 + 1] = (Math.random() - 0.5) * 6;
        posArray[i3 + 2] = (Math.random() - 0.5) * 5;

        const c = Math.random() > 0.4 ? gold : emerald;
        colArray[i3] = c.r;
        colArray[i3 + 1] = c.g;
        colArray[i3 + 2] = c.b;
      }

      partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      partGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

      const partMat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(partGeo, partMat);
      safeGroup.add(particles);

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 1.3);
      scene.add(ambient);

      const amberLight = new THREE.PointLight(0xf59e0b, 3.5, 12);
      amberLight.position.set(3, 3, 3);
      scene.add(amberLight);

      const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 10);
      emeraldLight.position.set(-3, -2, 2);
      scene.add(emeraldLight);

      let mouseX = 0;
      let mouseY = 0;
      handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
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
          safeBox.rotation.y = t * 0.2;
          safeBox.rotation.x = t * 0.15;

          coinToken.rotation.y = t * 1.0;
          coinToken.rotation.z = Math.sin(t * 0.5) * 0.2;

          dialRing.rotation.z = -t * 0.3;
          dialRing.rotation.x = Math.PI / 4 + Math.sin(t * 0.6) * 0.15;

          particles.rotation.y = t * 0.06;

          safeGroup.rotation.y += (mouseX * 0.4 - safeGroup.rotation.y) * 0.05;
          safeGroup.rotation.x += (-mouseY * 0.4 - safeGroup.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Financial vault 3D scene error:', e);
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
      className={`relative w-full h-[180px] sm:h-[220px] flex items-center justify-center pointer-events-auto ${className}`}
      aria-label="3D Cryptographic Escrow Vault Node"
    />
  );
};

export default FinancialVault3D;
