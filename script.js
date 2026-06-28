
// --- Neural Network Particle Background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    particles = [];
    // Adjust particle count based on screen size for performance
    const numParticles = Math.min(Math.floor((w * h) / 15000), 100);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1.0;
        this.vy = (Math.random() - 0.5) * 1.0;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
        ctx.fill();
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                // Opacity based on distance
                ctx.strokeStyle = `rgba(0, 242, 254, ${1 - distance / 150})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    
    for (let p of particles) {
        p.update();
        p.draw();
    }
    connectParticles();
    
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animateParticles();


// --- SPA Navigation Logic ---
const allSections = document.querySelectorAll('.section, .hero');

function showSection(targetId) {
    window.scrollTo(0, 0);
    
    allSections.forEach(section => {
        if (section.id === targetId) {
            section.style.display = 'flex';
            
            // Re-trigger animations
            const reveals = section.querySelectorAll('.reveal');
            reveals.forEach(r => r.classList.remove('active'));
            setTimeout(() => {
                reveals.forEach(r => r.classList.add('active'));
                reveal();
            }, 50);
        } else {
            section.style.display = 'none';
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        if (targetId && document.getElementById(targetId)) {
            showSection(targetId);
            window.history.pushState(null, null, '#' + targetId);
        }
    });
});

// Scroll Reveal Animations
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        // Only process visible elements
        if (reveals[i].offsetParent !== null) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 50;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
}
window.addEventListener("scroll", reveal);

// Initial Load & Preloader
window.addEventListener('DOMContentLoaded', () => {
    // Handle Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
            }, 800); // Wait for transition
        }, 2000); // Play animation for 2 seconds
    }

    // Handle Navigation
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    } else {
        showSection('about');
    }
});
