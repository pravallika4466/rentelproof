import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const VantaBackground = ({ variant = 'waves', className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion or mobile low-power
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let scene, camera, renderer, mesh, geometry, material, animationId;
    let handleResize = null;
    let handlePointerMove = null;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.set(0, 50, 160);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false, // optimize performance for background
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      // Waves Grid Geometry (Emerald & Obsidian - Zero Blue)
      const planeWidth = 240;
      const planeHeight = 240;
      const segmentsW = 40;
      const segmentsH = 40;

      geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segmentsW, segmentsH);
      geometry.rotateX(-Math.PI / 2);

      // Store initial vertex positions for wave computation
      const count = geometry.attributes.position.count;
      const initialY = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        initialY[i] = geometry.attributes.position.getY(i);
      }

      material = new THREE.MeshBasicMaterial({
        color: isDark ? 0x065f46 : 0x059669,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.22 : 0.14,
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = -20;
      scene.add(mesh);

      // Subtle fog matching the dark/light background
      scene.fog = new THREE.FogExp2(isDark ? 0x060708 : 0xfaf9f5, 0.008);

      let mouseX = 0;
      let mouseY = 0;
      handlePointerMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 40;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
      };
      window.addEventListener('mousemove', handlePointerMove, { passive: true });

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
        animationId = requestAnimationFrame(animate);
        const t = (performance.now() - startTime) * 0.0008;
        const positions = geometry.attributes.position;

        for (let i = 0; i < count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          const y = Math.sin(x * 0.05 + t) * 4 + Math.cos(z * 0.05 + t * 0.8) * 4;
          positions.setY(i, y);
        }
        positions.needsUpdate = true;

        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (50 - mouseY - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('WebGL background initialization bypassed:', e);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (handlePointerMove) window.removeEventListener('mousemove', handlePointerMove);

      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, [isDark, variant]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default VantaBackground;
