import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const DashboardAmbient3D = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let scene, camera, renderer, animationFrameId;
    let particles, nodesGroup;
    let handleMouseMove, handleResize;

    try {
      scene = new THREE.Scene();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || 300;

      camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 12;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);

      nodesGroup = new THREE.Group();
      scene.add(nodesGroup);

      // 1. Ambient Floating Constellation Points
      const particleCount = 120;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const emerald = new THREE.Color(0x10b981);
      const amber = new THREE.Color(0xf59e0b);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 24;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 12;

        const c = Math.random() > 0.3 ? emerald : amber;
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.6 : 0.35,
        blending: THREE.AdditiveBlending,
      });

      particles = new THREE.Points(geometry, material);
      nodesGroup.add(particles);

      // 2. A few subtle floating wireframe geometric gems in 3D space
      const gemGeo = new THREE.OctahedronGeometry(0.7, 0);
      const gemMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0x065f46 : 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.2,
      });

      const gems = [];
      const gemPositions = [
        [-6, 2, -2],
        [6, -1, -3],
        [-2, -2, 1],
        [4, 3, -1],
      ];

      gemPositions.forEach((pos) => {
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(pos[0], pos[1], pos[2]);
        nodesGroup.add(gem);
        gems.push(gem);
      });

      let mouseX = 0;
      let mouseY = 0;
      handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
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
        const t = (performance.now() - startTime) * 0.0006;

        particles.rotation.y = t * 0.2;
        particles.rotation.x = Math.sin(t * 0.5) * 0.05;

        gems.forEach((gem, idx) => {
          gem.rotation.x = t * (0.4 + idx * 0.1);
          gem.rotation.y = t * (0.6 + idx * 0.1);
          gem.position.y += Math.sin(t * 2 + idx) * 0.003;
        });

        nodesGroup.rotation.y += (mouseX * 0.2 - nodesGroup.rotation.y) * 0.03;
        nodesGroup.rotation.x += (-mouseY * 0.2 - nodesGroup.rotation.x) * 0.03;

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Dashboard 3D ambient initialization bypassed:', e);
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
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default DashboardAmbient3D;
