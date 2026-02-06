// Three.js Scene Setup
let scene, camera, renderer, stars, particles, glyphs;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// ADDED: Detect if device is mobile/tablet
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const isLowPerformance = isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);

// Initialize Three.js Scene
function initThreeJS() {
    const canvas = document.getElementById('bgCanvas');
    
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.00015);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.z = 500;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile // CHANGED: Disable antialiasing on mobile for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)); // CHANGED: Lower pixel ratio on mobile
    
    // Create Star Field
    createStars();
    
    // Create Floating Particles
    createParticles();
    
    // CHANGED: Only create glyphs and shapes on desktop for performance
    if (!isMobile) {
        createGlyphs();
        createGeometricShapes();
    }
    
    // Event Listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    // Start Animation
    animate();
}

// Create Star Field
function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = isMobile ? 800 : 2000; // CHANGED: Fewer stars on mobile
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 1500 - 500;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: isMobile ? 1.2 : 1.5, // CHANGED: Smaller stars on mobile
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Create Floating Particles
function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = isMobile ? 150 : 500; // CHANGED: Fewer particles on mobile
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1500;
        positions[i + 1] = (Math.random() - 0.5) * 1500;
        positions[i + 2] = (Math.random() - 0.5) * 1000 - 300;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: isMobile ? 1.5 : 2, // CHANGED: Smaller particles on mobile
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

// Create Ancient Glyphs (Symbolic shapes)
function createGlyphs() {
    glyphs = new THREE.Group();
    
    const glyphShapes = [
        new THREE.RingGeometry(15, 20, 6),
        new THREE.TorusGeometry(15, 3, 6, 6),
        new THREE.OctahedronGeometry(15, 0)
    ];
    
    const glyphMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    
    const glyphCount = isLowPerformance ? 8 : 15; // CHANGED: Fewer glyphs on low-end devices
    
    for (let i = 0; i < glyphCount; i++) {
        const geometry = glyphShapes[Math.floor(Math.random() * glyphShapes.length)];
        const glyph = new THREE.Mesh(geometry, glyphMaterial.clone());
        
        glyph.position.set(
            (Math.random() - 0.5) * 1200,
            (Math.random() - 0.5) * 1200,
            (Math.random() - 0.5) * 800 - 400
        );
        
        glyph.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        glyph.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
            z: (Math.random() - 0.5) * 0.002
        };
        
        glyph.userData.driftSpeed = {
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1
        };
        
        glyphs.add(glyph);
    }
    
    scene.add(glyphs);
}

// Create Floating Geometric Shapes
function createGeometricShapes() {
    const geometries = [
        new THREE.IcosahedronGeometry(30, 0),
        new THREE.DodecahedronGeometry(25, 0),
        new THREE.TetrahedronGeometry(35, 0)
    ];
    
    const material = new THREE.MeshBasicMaterial({
        color: 0x0066ff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const shapeCount = isLowPerformance ? 4 : 8; // CHANGED: Fewer shapes on low-end devices
    
    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material.clone());
        
        mesh.position.set(
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 600 - 300
        );
        
        mesh.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.003,
            y: (Math.random() - 0.5) * 0.003,
            z: (Math.random() - 0.5) * 0.003
        };
        
        scene.add(mesh);
    }
}

// Mouse Movement Handler
function onMouseMove(event) {
    // CHANGED: Reduced mouse influence on mobile
    const influence = isMobile ? 0.02 : 0.05;
    mouseX = (event.clientX - windowHalfX) * influence;
    mouseY = (event.clientY - windowHalfY) * influence;
}

// Window Resize Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // CHANGED: Slower animations on mobile to save battery
    const rotationSpeed = isMobile ? 0.5 : 1;
    
    // Rotate stars slowly
    if (stars) {
        stars.rotation.y += 0.0002 * rotationSpeed;
        stars.rotation.x += 0.0001 * rotationSpeed;
    }
    
    // Animate particles
    if (particles) {
        particles.rotation.y += 0.0005 * rotationSpeed;
        particles.rotation.z += 0.0003 * rotationSpeed;
    }
    
    // Animate glyphs (only on desktop)
    if (glyphs) {
        glyphs.children.forEach(glyph => {
            glyph.rotation.x += glyph.userData.rotationSpeed.x * rotationSpeed;
            glyph.rotation.y += glyph.userData.rotationSpeed.y * rotationSpeed;
            glyph.rotation.z += glyph.userData.rotationSpeed.z * rotationSpeed;
            
            glyph.position.x += glyph.userData.driftSpeed.x * rotationSpeed;
            glyph.position.y += glyph.userData.driftSpeed.y * rotationSpeed;
            
            // Boundary check
            if (Math.abs(glyph.position.x) > 600) glyph.userData.driftSpeed.x *= -1;
            if (Math.abs(glyph.position.y) > 600) glyph.userData.driftSpeed.y *= -1;
        });
    }
    
    // Animate geometric shapes (only on desktop)
    scene.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x * rotationSpeed;
            child.rotation.y += child.userData.rotationSpeed.y * rotationSpeed;
            child.rotation.z += child.userData.rotationSpeed.z * rotationSpeed;
        }
    });
    
    // CHANGED: Reduced camera movement on mobile
    const cameraEasing = isMobile ? 0.01 : 0.02;
    camera.position.x += (mouseX - camera.position.x) * cameraEasing;
    camera.position.y += (-mouseY - camera.position.y) * cameraEasing;
    camera.lookAt(scene.position);
    
    // Render
    renderer.render(scene, camera);
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: isMobile ? 0.1 : 0.2, // CHANGED: Lower threshold on mobile
        rootMargin: isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px' // CHANGED: Less margin on mobile
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe about cards
    document.querySelectorAll('.about-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Observe skill orbs
    document.querySelectorAll('.skill-orb').forEach((orb, index) => {
        orb.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(orb);
    });
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Logo Navigation - Always return to home
function setupLogoNavigation() {
    const logo = document.getElementById('logoNav');
    logo.addEventListener('click', () => {
        document.getElementById('home').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// Parallax Effect on Scroll
function setupParallax() {
    // CHANGED: Disable parallax on mobile for better performance and UX
    if (isMobile) {
        return;
    }
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - scrolled / 600;
        }
        
        // Adjust 3D scene based on scroll
        if (camera) {
            camera.position.z = 500 + scrolled * 0.1;
        }
    });
}

// Interactive Project Cards
function setupProjectInteractions() {
    // CHANGED: Only add hover effects on non-touch devices
    if (!('ontouchstart' in window)) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Loading Screen
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }, isMobile ? 1000 : 1500); // CHANGED: Faster loading on mobile
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    initThreeJS();
    
    // Setup interactions
    setupScrollAnimations();
    setupSmoothScroll();
    setupLogoNavigation();
    setupParallax();
    setupProjectInteractions();
    
    // Hide loading screen
    hideLoadingScreen();
    
    // Add active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // CHANGED: Throttle scroll event on mobile
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (isMobile) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateActiveNav, 100);
        } else {
            updateActiveNav();
        }
    });
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    // CHANGED: Use throttled touch events for better performance
    let touchTimeout;
    document.addEventListener('touchmove', (e) => {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            const touch = e.touches[0];
            const influence = 0.02;
            mouseX = (touch.clientX - windowHalfX) * influence;
            mouseY = (touch.clientY - windowHalfY) * influence;
        }, 50);
    }, { passive: true }); // ADDED: Passive listener for better scroll performance
}

// CHANGED: More aggressive optimization message
if (isLowPerformance) {
    console.log('🎯 Performance mode enabled for optimal mobile experience');
}

// Easter egg: Console message
console.log('%c👋 Welcome to my portfolio!', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion, Three.js, and a lot of coffee ☕', 'color: #0066ff; font-size: 14px;');
console.log('%c- Jananjaya Bandara', 'color: #8b5cf6; font-size: 12px; font-style: italic;');
