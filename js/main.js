/* ═══════════════════════════════════════════════════════════════════════════
   ALINJAZ OFFICE - MAIN JAVASCRIPT
   Professional, Fast, SEO-Optimized JavaScript
═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL VARIABLES
// ═══════════════════════════════════════════════════════════════════════════
const DOM = {
    preloader: null,
    navbar: null,
    sideMenu: null,
    overlay: null,
    menuBtn: null,
    backToTop: null,
    testimonialCards: null,
    testimonialDots: null
};

let isScrolling = false;
let testimonialIndex = 0;
let testimonialInterval = null;

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    initializePreloader();
    initializeNavbar();
    initializeAOS();
    initializeCounters();
    initializeTestimonials();
    initializeSmoothScroll();
    initializeBackToTop();
    initializeNavLinks();
    updateYear();
    
    // Performance: Defer non-critical animations
    requestAnimationFrame(() => {
        initializeParallax();
        initializeScrollReveal();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// DOM INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════
function initializeDOM() {
    DOM.preloader = document.getElementById('preloader');
    DOM.navbar = document.getElementById('navbar');
    DOM.sideMenu = document.getElementById('sideMenu');
    DOM.overlay = document.getElementById('overlay');
    DOM.menuBtn = document.querySelector('.menu-btn');
    DOM.backToTop = document.getElementById('backToTop');
    DOM.testimonialCards = document.querySelectorAll('.testimonial-card');
    DOM.testimonialDots = document.querySelectorAll('.testimonials-dots .dot');
}

// ═══════════════════════════════════════════════════════════════════════════
// PRELOADER
// ═══════════════════════════════════════════════════════════════════════════
function initializePreloader() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (DOM.preloader) {
                DOM.preloader.classList.add('loaded');
                // Remove preloader from DOM after animation
                setTimeout(() => {
                    DOM.preloader.style.display = 'none';
                }, 500);
            }
            // Trigger entrance animations
            document.body.classList.add('loaded');
        }, 500);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════════
function initializeNavbar() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            DOM.navbar?.classList.add('scrolled');
        } else {
            DOM.navbar?.classList.remove('scrolled');
        }
        
        // Hide/Show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            DOM.navbar.style.transform = 'translateY(-100%)';
        } else {
            DOM.navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    }, 100));
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDE MENU
// ═══════════════════════════════════════════════════════════════════════════
function openSideMenu() {
    DOM.sideMenu?.classList.add('active');
    DOM.overlay?.classList.add('active');
    DOM.menuBtn?.classList.add('active');
    DOM.menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
    DOM.sideMenu?.classList.remove('active');
    DOM.overlay?.classList.remove('active');
    DOM.menuBtn?.classList.remove('active');
    DOM.menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Escape key closes menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSideMenu();
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════════════════════
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = DOM.navbar?.offsetHeight || 85;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToSection(id) {
    closeSideMenu();
    const element = document.getElementById(id);
    if (element) {
        const navbarHeight = DOM.navbar?.offsetHeight || 85;
        const targetPosition = element.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// AOS (Animate On Scroll) INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 0,
            mirror: false,
            anchorPlacement: 'top-bottom'
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════════════════
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = formatNumber(Math.floor(current));
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    };
    
    requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
    if (num >= 1000) {
        return num.toLocaleString('ar-SA');
    }
    return num.toString();
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS SLIDER
// ═══════════════════════════════════════════════════════════════════════════
function initializeTestimonials() {
    if (DOM.testimonialCards.length === 0) return;
    
    // Auto-play
    testimonialInterval = setInterval(() => {
        testimonialIndex = (testimonialIndex + 1) % DOM.testimonialCards.length;
        showTestimonial(testimonialIndex);
    }, 5000);
    
    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    slider?.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
    slider?.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            testimonialIndex = (testimonialIndex + 1) % DOM.testimonialCards.length;
            showTestimonial(testimonialIndex);
        }, 5000);
    });
}

function showTestimonial(index) {
    testimonialIndex = index;
    
    // Update cards
    DOM.testimonialCards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // Update dots
    DOM.testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// BACK TO TOP
// ═══════════════════════════════════════════════════════════════════════════
function initializeBackToTop() {
    window.addEventListener('scroll', throttle(function() {
        if (window.pageYOffset > 500) {
            DOM.backToTop?.classList.add('visible');
        } else {
            DOM.backToTop?.classList.remove('visible');
        }
    }, 100));
    
    DOM.backToTop?.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV LINKS ACTIVE STATE
// ═══════════════════════════════════════════════════════════════════════════
function initializeNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', throttle(function() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ═══════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════════════════
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// PARALLAX EFFECT
// ═══════════════════════════════════════════════════════════════════════════
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.shape, .floating-icon');
    
    window.addEventListener('scroll', throttle(function() {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// ═══════════════════════════════════════════════════════════════════════════
// UPDATE YEAR
// ═══════════════════════════════════════════════════════════════════════════
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// RIPPLE EFFECT FOR BUTTONS
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn, .service-btn, .contact-btn');
    if (!button) return;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// ═══════════════════════════════════════════════════════════════════════════
// LAZY LOADING IMAGES
// ═══════════════════════════════════════════════════════════════════════════
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                lazyObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => lazyObserver.observe(img));
}

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('keydown', function(e) {
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// ═══════════════════════════════════════════════════════════════════════════
// FORM VALIDATION (if forms are added later)
// ═══════════════════════════════════════════════════════════════════════════
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE WORKER REGISTRATION (for PWA)
// ═══════════════════════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════════════════
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }, 0);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPOSE GLOBAL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
window.openSideMenu = openSideMenu;
window.closeSideMenu = closeSideMenu;
window.scrollToSection = scrollToSection;
window.showTestimonial = showTestimonial;