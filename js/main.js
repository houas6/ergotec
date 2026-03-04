/* ============================================
   ERGOTEC — Advanced Website JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===================== PRELOADER =====================
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ===================== AOS INIT =====================
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80
    });

    // ===================== NAVBAR =====================
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ===================== HERO PARTICLES =====================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 8 + 4) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    // ===================== COUNTER ANIMATION =====================
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ===================== CATALOGUE FILTERS =====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogueCards = document.querySelectorAll('.catalogue-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            catalogueCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    });

    // ===================== FAQ ACCORDION =====================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===================== CONTACT FORM =====================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formspree.io/f/xvgzkgon', { // Need to use a form ID usually, but email works as fallback or I can use ergotec@topnet.tn if configured
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    alert(data.errors ? data.errors.map(error => error.message).join(", ") : "Oups ! Un problème est survenu.");
                }
            } catch (error) {
                alert("Oups ! Un problème est survenu lors de l'envoi.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                // If success, we don't need to reset UI here as handled above, 
                // but if we want to reset after 5s as before:
                if (formSuccess.style.display === 'block') {
                    setTimeout(() => {
                        contactForm.style.display = '';
                        formSuccess.style.display = 'none';
                    }, 5000);
                }
            }
        });
    }

    // ===================== NEWSLETTER FORM =====================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            alert('Merci ! Vous êtes inscrit(e) avec l\'adresse : ' + input.value);
            input.value = '';
        });
    }

    // ===================== BACK TO TOP =====================
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // ===================== SMOOTH SCROLL FOR ALL ANCHORS =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});