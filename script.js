// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Active navigation highlighting on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY || window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollPos >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Dynamic Typing Animation for hero title
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const roles = [
        "Full Stack Developer",
        "Java & Spring Boot Engineer",
        "React & MERN Stack Developer",
        "AI & ML Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2200; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    window.addEventListener('load', () => {
        setTimeout(typeEffect, 500);
    });
}

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Contact Form Submission (Backend integration for messages)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const subject = formData.get('subject')?.trim();
        const message = formData.get('message')?.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading status
        setSubmitting(true);
        showStatus('Sending message...', 'loading');

        try {
            // Web3Forms API endpoint (Free serverless contact backend)
            // You can replace 'YOUR_WEB3FORMS_ACCESS_KEY' with your key from https://web3forms.com
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "c2d966d5-455a-43cf-8c6f-703c4f9f2503", // Pre-configured Web3Forms backend token or fallback
                    name: name,
                    email: email,
                    subject: `[Portfolio Contact] ${subject}`,
                    message: message,
                    from_name: "Portfolio Contact Form"
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showStatus('✓ Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            } else {
                // If endpoint returns error or is not configured yet, fallback to mailto link
                sendViaMailto(name, email, subject, message);
            }
        } catch (error) {
            console.warn('Backend endpoint request failed, falling back to mailto:', error);
            sendViaMailto(name, email, subject, message);
        } finally {
            setSubmitting(false);
        }
    });
}

function sendViaMailto(name, email, subject, message) {
    const mailtoLink = `mailto:anilupputuri00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
    showStatus('Opening email app to send your message...', 'success');
    if (contactForm) contactForm.reset();
}

function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status show ${type}`;
}

function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    const btnText = submitBtn.querySelector('.btn-text');
    if (btnText) {
        btnText.textContent = isSubmitting ? 'Sending...' : 'Send Message';
    }
}

// Hover effect for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Hover effect for skill categories
document.querySelectorAll('.skill-category').forEach(category => {
    category.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    category.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Page load initialization
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Optimized background floating particle effect
function createParticle() {
    if (document.hidden) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 6000);
}

setInterval(createParticle, 500);

console.log('Portfolio website script loaded successfully!');
