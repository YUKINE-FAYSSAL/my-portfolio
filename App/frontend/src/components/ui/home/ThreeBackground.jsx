import React, { useEffect } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { gsap } from 'https://cdn.skypack.dev/gsap@3.11.0';
import { ScrollTrigger } from 'https://cdn.skypack.dev/gsap@3.11.0/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ThreeBackground = () => {
  useEffect(() => {
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '1';
    renderer.domElement.style.pointerEvents = 'none';

    // Create star texture for particles
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128; // Increased for sharper particles
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.95)');
      gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(140, 140, 230, 0.5)');
      gradient.addColorStop(1, 'rgba(40, 40, 120, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      ctx.globalCompositeOperation = 'lighten';
      const linearGradient = ctx.createLinearGradient(64, 0, 64, 128);
      linearGradient.addColorStop(0, 'rgba(100, 100, 230, 0)');
      linearGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      linearGradient.addColorStop(1, 'rgba(100, 100, 230, 0)');
      ctx.fillStyle = linearGradient;
      ctx.fillRect(60, 0, 8, 128);
      const horizontalGradient = ctx.createLinearGradient(0, 64, 128, 64);
      horizontalGradient.addColorStop(0, 'rgba(100, 100, 230, 0)');
      horizontalGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      horizontalGradient.addColorStop(1, 'rgba(100, 100, 230, 0)');
      ctx.fillStyle = horizontalGradient;
      ctx.fillRect(0, 60, 128, 8);
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // Create cube group
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(512, 512) },
      scrollProgress: { value: 0.0 },
    };

    const fragmentShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform float scrollProgress;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void mainImage(out vec4 O, vec2 I) {
        vec2 r = iResolution.xy;
        vec2 z;
        vec2 i;
        vec2 f = I*(z+=4.-4.*abs(.7-dot(I=(I+I-r)/r.y, I)));
        float timeOffset = sin(iTime * 0.3) * 0.15; // Faster animation
        f.x += timeOffset;
        f.y -= timeOffset;
        float iterations = mix(10.0, 14.0, scrollProgress); // More iterations for thicker effect
        for(O *= 0.; i.y++<iterations;
            O += (sin(f += cos(f.yx*i.y+i+iTime)/i.y+.7)+1.).xyyx
            * abs(f.x-f.y));
        O = tanh(8.*exp(z.x-4.-I.y*vec4(-1,1,2,0))/O); // Enhanced contrast
        float pulse = 1.0 + 0.3 * sin(iTime * 0.7); // Stronger pulse
        O.rgb *= pulse;
        float nebula = sin(I.x * 0.015 + iTime * 0.4) * sin(I.y * 0.015 - iTime * 0.3);
        nebula = abs(nebula) * 0.7; // Stronger nebula effect
        vec3 color1 = mix(vec3(0.2, 0.3, 0.9), vec3(0.9, 0.2, 0.6), scrollProgress);
        vec3 color2 = mix(vec3(0.9, 0.3, 0.8), vec3(0.3, 0.9, 0.8), scrollProgress);
        vec3 colorMix = mix(color1, color2, sin(iTime * 0.3) * 0.5 + 0.5);
        O.rgb = mix(O.rgb, colorMix, nebula * (1.0 - length(O.rgb)));
      }
      void main() {
        vec2 cubeUV = vUv * iResolution;
        vec4 fragColor;
        mainImage(fragColor, cubeUV);
        float depthFactor = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        fragColor.rgb *= 0.8 + 0.4 * depthFactor; // Enhanced depth
        float edge = 1.0 - max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0;
        edge = pow(edge, 3.0); // Sharper edges
        fragColor.rgb += edge * vec3(0.2, 0.3, 0.9) * (0.7 + scrollProgress * 0.5);
        fragColor.rgb *= 2.5; // Brighter output
        gl_FragColor = fragColor;
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cubeGroup.add(cube);

    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 10),
      new THREE.LineBasicMaterial({
        color: 0x4488ff,
        linewidth: 2, // Thicker wireframe
        transparent: true,
        opacity: 0.2, // Slightly more visible
      })
    );
    wireframe.scale.setScalar(1.001);
    cubeGroup.add(wireframe);

    // Enhanced particle system
    const createEnhancedParticles = () => {
      const particleSettings = {
        PARTICLE_COUNT: 3000, // More particles for thicker effect
        PARTICLE_MOUSE_INFLUENCE: 0.00015,
        PARTICLE_REPULSION_RADIUS: 1.0,
        PARTICLE_REPULSION_STRENGTH: 0.0001,
        PARTICLE_CONNECTION_DISTANCE: 0.6,
        PARTICLE_DEPTH_RANGE: 15,
      };

      const particles = new THREE.BufferGeometry();
      const particleCount = particleSettings.PARTICLE_COUNT;
      const positions = new Float32Array(particleCount * 3);
      const originalPositions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const colors = new Float32Array(particleCount * 3);
      const depths = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 4 + Math.random() * 4; // Wider spread
        const depthExtension = Math.random() * particleSettings.PARTICLE_DEPTH_RANGE - particleSettings.PARTICLE_DEPTH_RANGE / 2;
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi) + depthExtension;
        originalPositions[i * 3] = positions[i * 3];
        originalPositions[i * 3 + 1] = positions[i * 3 + 1];
        originalPositions[i * 3 + 2] = positions[i * 3 + 2];
        depths[i] = positions[i * 3 + 2];
        velocities[i * 3] = (Math.random() - 0.5) * 0.0005;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0005;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0003;
        const z = positions[i * 3 + 2];
        const normalizedDepth = (z + particleSettings.PARTICLE_DEPTH_RANGE / 2) / particleSettings.PARTICLE_DEPTH_RANGE;
        sizes[i] = 0.01 + 0.04 * (1 - normalizedDepth); // Larger particles
        const brightness = 0.6 + 0.6 * (1 - normalizedDepth);
        colors[i * 3] = 0.5 + 0.4 * brightness;
        colors[i * 3 + 1] = 0.5 + 0.4 * brightness;
        colors[i * 3 + 2] = 0.8 + 0.4 * brightness;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
      particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particles.setAttribute('depth', new THREE.BufferAttribute(depths, 1));

      const particleTexture = createStarTexture();
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.04, // Larger base size
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      const constellationMaterial = new THREE.LineBasicMaterial({
        color: 0x3366ff,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
      });

      const constellationGeometry = new THREE.BufferGeometry();
      const constellationSystem = new THREE.LineSegments(constellationGeometry, constellationMaterial);
      scene.add(constellationSystem);

      return { particleSystem, constellationSystem, settings: particleSettings };
    };

    const enhancedParticles = createEnhancedParticles();

    const updateParticleZoom = (scrollProgress) => {
      if (!enhancedParticles || !enhancedParticles.particleSystem) return;
      const particleSystem = enhancedParticles.particleSystem;
      const positions = particleSystem.geometry.attributes.position.array;
      const originalPositions = particleSystem.geometry.attributes.originalPosition.array;
      const sizes = particleSystem.geometry.attributes.size.array;
      const colors = particleSystem.geometry.attributes.color.array;
      const particleCount = positions.length / 3;

      let zoomCurve = scrollProgress < 0.5 ? gsap.utils.clamp(0, 1, scrollProgress * 2) : gsap.utils.clamp(0, 1, 2 - scrollProgress * 2);
      zoomCurve = gsap.parseEase('power2.inOut')(zoomCurve);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const zPosition = originalPositions[i3 + 2];
        const radialPosition = Math.sqrt(originalPositions[i3] * originalPositions[i3] + originalPositions[i3 + 1] * originalPositions[i3 + 1]);
        const pushFactor = 1 + zoomCurve * 2.0; // Stronger push
        positions[i3] = originalPositions[i3] * pushFactor;
        positions[i3 + 1] = originalPositions[i3 + 1] * pushFactor;
        let targetZ = zPosition;
        if (Math.abs(zPosition) > 1) {
          targetZ = zPosition * (1 - zoomCurve * 0.6);
        } else {
          targetZ = zPosition - zoomCurve * Math.sign(zPosition) * 2.5;
        }
        positions[i3 + 2] = lerp(positions[i3 + 2], targetZ, 0.1);
        const distFromCamera = Math.abs(positions[i3 + 2]);
        const closenessFactor = Math.max(0, 1 - distFromCamera / 6);
        const sizeBoost = 1 + zoomCurve * 5.0; // Bigger size boost
        sizes[i] = (0.01 + 0.04 * closenessFactor) * sizeBoost;
        const brightnessBoost = zoomCurve * 0.4;
        const baseBrightness = 0.6 + closenessFactor * 0.6;
        const brightness = baseBrightness + brightnessBoost;
        colors[i3] = 0.5 + 0.4 * brightness;
        colors[i3 + 1] = 0.5 + 0.4 * brightness;
        colors[i3 + 2] = 0.8 + 0.4 * brightness;
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.size.needsUpdate = true;
      particleSystem.geometry.attributes.color.needsUpdate = true;
    };

    const lerp = (start, end, amt) => start * (1 - amt) + end * amt;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8); // Brighter light
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3366ff, 2.0, 20); // Brighter point light
    pointLight.position.set(-3, 2, 5);
    scene.add(pointLight);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    const mouse = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (!ScrollTrigger.isScrolling()) {
        gsap.to(cubeGroup.rotation, {
          x: '+=' + (mouse.y * 0.04 - cubeGroup.rotation.x * 0.03), // More responsive
          y: '+=' + (mouse.x * 0.04 - cubeGroup.rotation.y * 0.03),
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    document.addEventListener('click', () => {
      gsap.to(cubeGroup.rotation, {
        x: cubeGroup.rotation.x + Math.PI * 0.3 * (Math.random() - 0.5),
        y: cubeGroup.rotation.y + Math.PI * 0.3 * (Math.random() - 0.5),
        z: cubeGroup.rotation.z + Math.PI * 0.3 * (Math.random() - 0.5),
        duration: 0.8,
        ease: 'back.out(1.7)', // More dynamic bounce
      });
    });

    const animateTextElements = () => {
      const titles = document.querySelectorAll('.title');
      const descriptions = document.querySelectorAll('.description');
      document.querySelectorAll('.section').forEach((section, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            toggleActions: 'play none none reverse',
          },
        });
        tl.to(titles[index], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0);
        tl.to(descriptions[index], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 }, 0);
        tl.to(cubeGroup.position, { z: -1 * index, duration: 1 }, 0);
      });
    };

    // Check for .content before initializing ScrollTrigger
    const contentElement = document.querySelector('.content');
    if (contentElement) {
      animateTextElements();
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.content',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          markers: false,
          onUpdate: (self) => {
            uniforms.scrollProgress.value = self.progress;
            let zoomCurve = self.progress < 0.5 ? gsap.utils.clamp(0, 1, self.progress * 2) : gsap.utils.clamp(0, 1, 2 - self.progress * 2);
            zoomCurve = gsap.parseEase('power2.inOut')(zoomCurve);
            const minFOV = 20;
            const maxFOV = 60;
            camera.fov = maxFOV - (maxFOV - minFOV) * zoomCurve;
            camera.updateProjectionMatrix();
            const maxScale = 1.3; // Larger scale
            cubeGroup.scale.setScalar(1 + (maxScale - 1) * zoomCurve);
            updateParticleZoom(self.progress);
          },
        },
      });

      scrollTimeline
        .to(cubeGroup.rotation, { x: Math.PI * 1.4, y: Math.PI * 2.2, z: Math.PI * 0.4, ease: 'power2.inOut', immediateRender: false })
        .to(camera.position, { z: 0.7, y: 0.3, x: 0, ease: 'power2.inOut' }, 0.5)
        .to(camera.position, { z: 4.5, y: 0, x: 0, ease: 'power2.inOut' }, 1.0)
        .to({}, { duration: 1, onUpdate: function () { camera.lookAt(cubeGroup.position); } }, 0);

      scrollTimeline.to(ambientLight, { intensity: 1.4, ease: 'power1.inOut' }, 0); // Brighter ambient
    }

    const animate = (timestamp) => {
      requestAnimationFrame(animate);
      const timeSeconds = timestamp * 0.001;
      uniforms.iTime.value = timeSeconds;
      if (!ScrollTrigger.isScrolling()) {
        cubeGroup.rotation.x += 0.0006; // Slightly faster rotation
        cubeGroup.rotation.y += 0.0009;
      }
      if (enhancedParticles && enhancedParticles.particleSystem) {
        const particleSystem = enhancedParticles.particleSystem;
        const constellationSystem = enhancedParticles.constellationSystem;
        const settings = enhancedParticles.settings;
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.geometry.attributes.velocity.array;
        const particleCount = positions.length / 3;
        const connectedPoints = [];
        const pulseFactor = 1.0 + 0.15 * Math.sin(timeSeconds * 0.7); // Stronger pulse
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];
          positions[i3] += (mouse.x * 3 - positions[i3]) * settings.PARTICLE_MOUSE_INFLUENCE;
          positions[i3 + 1] += (mouse.y * 3 - positions[i3 + 1]) * settings.PARTICLE_MOUSE_INFLUENCE;
          const distFromCenter = Math.sqrt(positions[i3] * positions[i3] + positions[i3 + 1] * positions[i3 + 1] + positions[i3 + 2] * positions[i3 + 2]);
          if (distFromCenter > 12) { // Wider boundary
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 6 + Math.random() * 3;
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi) * (1 - uniforms.scrollProgress.value * 0.4);
            velocities[i3] = (Math.random() - 0.5) * 0.0005;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.0005;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.0003;
          }
          if (i % 40 === 0 && uniforms.scrollProgress.value > 0.5) { // More connections
            for (let j = i + 1; j < Math.min(i + 120, particleCount); j += 8) {
              const j3 = j * 3;
              const dx = positions[i3] - positions[j3];
              const dy = positions[i3 + 1] - positions[j3 + 1];
              const dz = positions[i3 + 2] - positions[j3 + 2];
              const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
              const connectionThreshold = 0.6;
              if (distance < connectionThreshold) {
                if (positions[i3 + 2] < 3 && positions[j3 + 2] < 3) {
                  connectedPoints.push(positions[i3], positions[i3 + 1], positions[i3 + 2], positions[j3], positions[j3 + 1], positions[j3 + 2]);
                }
              }
            }
          }
        }
        const constellationGeometry = constellationSystem.geometry;
        constellationGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectedPoints, 3));
        constellationGeometry.attributes.position.needsUpdate = true;
        constellationSystem.material.opacity = Math.max(0, uniforms.scrollProgress.value - 0.5) * 0.2; // More visible lines
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // No JSX, only renders WebGL canvas
};

export default ThreeBackground;