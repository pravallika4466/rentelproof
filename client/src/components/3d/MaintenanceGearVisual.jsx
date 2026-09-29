import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const MaintenanceGearVisual = ({ className = '' }) => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene, camera, renderer, animationFrameId;
    let gearGroup, gear1, gear2, centerNut;
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

      gearGroup = new THREE.Group();
      scene.add(gearGroup);

      // 1. Primary Work Order Torque Ring (Torus with teeth-like markers)
      const gearGeo1 = new THREE.TorusGeometry(1.6, 0.12, 16, 12); // low radial segments gives a faceted mechanical gear look!
      const gearMat1 = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true,
      });
      gear1 = new THREE.Mesh(gearGeo1, gearMat1);
      gearGroup.add(gear1);

      // 2. Secondary Interlocking Gear Ring
      const gearGeo2 = new THREE.TorusGeometry(1.0, 0.08, 16, 8);
      const gearMat2 = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.9,
      });
      gear2 = new THREE.Mesh(gearGeo2, gearMat2);
      gear2.position.set(0.6, -0.4, 0.3);
      gearGroup.add(gear2);

      // 3. Central Hexagonal Drive Nut
      const nutGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 6);
      const nutMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x064e3b : 0x047857,
        emissive: 0x10b981,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.9,
      });
      centerNut = new THREE.Mesh(nutGeo, nutMat);
      centerNut.rotation.x = Math.PI / 2;
      gearGroup.add(centerNut);

      // 4. Kinetic Diagnostic Particles
      const count = 40;
      const partGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 0.5 + Math.random() * 1.8;
        pos[i * 3] = Math.cos(angle) * rad;
        pos[i * 3 + 1] = Math.sin(angle) * rad;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
      }
      partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const partMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x10b981,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const parts = new THREE.Points(partGeo, partMat);
      gearGroup.add(parts);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 1.3);
      scene.add(ambient);

      const lightAmber = new THREE.PointLight(0xf59e0b, 3, 10);
      lightAmber.position.set(2, 2, 3);
      scene.add(lightAmber);

      const lightEmerald = new THREE.PointLight(0x10b981, 2.5, 10);
      lightEmerald.position.set(-2, -2, 2);
      scene.add(lightEmerald);

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
          gear1.rotation.z = t * 0.4;
          gear2.rotation.z = -t * 0.8;
          centerNut.rotation.y = t * 0.5;

          gearGroup.rotation.y += (mouseX * 0.4 - gearGroup.rotation.y) * 0.05;
          gearGroup.rotation.x += (-mouseY * 0.4 - gearGroup.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('Maintenance gear 3D scene error:', e);
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
      aria-label="3D Mechanical Maintenance Work-Order Mechanism"
    />
  );
};

export default MaintenanceGearVisual;
