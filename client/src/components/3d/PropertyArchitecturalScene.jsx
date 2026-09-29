import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const PropertyArchitecturalScene = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let estateGroup;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 240;

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(6, 5, 7);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      estateGroup = new THREE.Group();
      scene.add(estateGroup);

      // 1. Grid Plinth (Emerald Wireframe Foundation)
      const plinthGeo = new THREE.BoxGeometry(4.5, 0.15, 4.5);
      const plinthMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x121215 : 0xe5e7eb,
        roughness: 0.8,
        metalness: 0.2,
      });
      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = -1;
      estateGroup.add(plinth);

      // Grid wire lines on top of plinth
      const grid = new THREE.GridHelper(4.5, 9, 0x10b981, isDark ? 0x064e3b : 0xd1fae5);
      grid.position.y = -0.92;
      estateGroup.add(grid);

      // 2. Modern Glass & Steel Architecture Modules (Main Villa Volume)
      const mainVolumeGeo = new THREE.BoxGeometry(2.4, 1.4, 2.0);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x064e3b : 0x059669,
        emissive: 0x022c22,
        roughness: 0.1,
        metalness: 0.85,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.8 : 0.65,
      });
      const mainBuilding = new THREE.Mesh(mainVolumeGeo, glassMat);
      mainBuilding.position.set(-0.2, -0.2, -0.2);
      estateGroup.add(mainBuilding);

      // 3. Cantilever Upper Level
      const upperGeo = new THREE.BoxGeometry(1.8, 1.0, 1.8);
      const upperMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x047857,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: true,
      });
      const upperBuilding = new THREE.Mesh(upperGeo, upperMat);
      upperBuilding.position.set(0.4, 0.9, 0.2);
      estateGroup.add(upperBuilding);

      // 4. Glowing Verifiable Title Core
      const coreGeo = new THREE.DodecahedronGeometry(0.4, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.9,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0.4, 0.9, 0.2);
      estateGroup.add(core);

      // 5. Surrounding Property Boundary Pillars (Escrow boundaries)
      const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981 });
      const corners = [
        [-2, -0.65, -2],
        [2, -0.65, -2],
        [2, -0.65, 2],
        [-2, -0.65, 2],
      ];
      corners.forEach((c) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(c[0], c[1], c[2]);
        estateGroup.add(pillar);
      });

      // Ambient & Directional Lighting
      const ambientLight = new THREE.AmbientLight(isDark ? 0x060708 : 0xffffff, isDark ? 1.5 : 1.2);
      scene.add(ambientLight);

      const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 15);
      emeraldLight.position.set(3, 4, 3);
      scene.add(emeraldLight);

      const amberLight = new THREE.PointLight(0xf59e0b, 2.0, 10);
      amberLight.position.set(-3, 2, -2);
      scene.add(amberLight);

      let targetRotY = 0;
      let targetRotX = 0;

      handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotY = x * 0.5;
        targetRotX = -y * 0.3;
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
          estateGroup.rotation.y = t * 0.2;
          core.rotation.y = t * 0.8;
          core.rotation.x = t * 0.4;

          camera.position.x += (6 + targetRotY * 2 - camera.position.x) * 0.04;
          camera.position.y += (5 + targetRotX * 1.5 - camera.position.y) * 0.04;
          camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Property 3D scene initialization error:', e);
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
      className={`relative w-full h-[220px] sm:h-[260px] flex items-center justify-center pointer-events-auto ${className}`}
      aria-label="3D Isometric Architectural Property Visualizer"
    />
  );
};

export default PropertyArchitecturalScene;
