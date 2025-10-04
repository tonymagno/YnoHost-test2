// Menu Mobile Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling para links internos
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile após clique
                nav.classList.remove('active');
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(45, 80, 22, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(45, 80, 22, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Sistema de filtros de passeios
    const categories = document.querySelectorAll('.category');
    const tourCards = document.querySelectorAll('.tour-card');
    
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove active de todas as categorias
            categories.forEach(cat => cat.classList.remove('active'));
            // Adiciona active na categoria clicada
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            
            // Esconde todos os cards
            tourCards.forEach(card => {
                card.classList.remove('active');
            });
            
            // Mostra cards da categoria selecionada
            const selectedCards = document.querySelectorAll(`.tour-card.${selectedCategory}`);
            selectedCards.forEach(card => {
                card.classList.add('active');
            });
            
            // Se nenhuma categoria específica, mostra todos
            if (!selectedCategory || selectedCategory === 'all') {
                tourCards.forEach(card => {
                    card.classList.add('active');
                });
            }
        });
    });
    
    // Inicializar com trilhas ativas
    const trilhasCards = document.querySelectorAll('.tour-card.trilhas');
    trilhasCards.forEach(card => {
        card.classList.add('active');
    });
    
    // Slider de depoimentos
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-controls .prev');
    const nextBtn = document.querySelector('.testimonial-controls .next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            currentTestimonial = currentTestimonial > 0 ? currentTestimonial - 1 : testimonials.length - 1;
            showTestimonial(currentTestimonial);
        });
        
        nextBtn.addEventListener('click', function() {
            currentTestimonial = currentTestimonial < testimonials.length - 1 ? currentTestimonial + 1 : 0;
            showTestimonial(currentTestimonial);
        });
        
        // Auto-play do slider
        setInterval(() => {
            currentTestimonial = currentTestimonial < testimonials.length - 1 ? currentTestimonial + 1 : 0;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
    
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.tour-card, .value, .about-text, .about-image, .contact-info, .contact-form, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Contador animado para estatísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (target.toString().includes('+')) {
                element.textContent = Math.floor(start) + '+';
            } else {
                element.textContent = Math.floor(start);
            }
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Observar estatísticas para animação de contador
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('h3');
                const targetText = statNumber.textContent;
                const targetValue = parseInt(targetText.replace('+', ''));
                statNumber.textContent = '0';
                animateCounter(statNumber, targetValue);
                if (targetText.includes('+')) {
                    setTimeout(() => {
                        statNumber.textContent = targetText;
                    }, 2000);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const stats = document.querySelectorAll('.hero-stats .stat');
    stats.forEach(stat => statsObserver.observe(stat));
    
    // Galeria - Modal simples para imagens
    const galleryImages = document.querySelectorAll('.gallery-grid img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            // Criar modal simples
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                animation: zoomIn 0.3s ease;
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Fechar modal ao clicar
            modal.addEventListener('click', function() {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            });
            
            // Fechar modal com ESC
            const escHandler = function(e) {
                if (e.key === 'Escape' && document.body.contains(modal)) {
                    modal.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        if (document.body.contains(modal)) {
                            document.body.removeChild(modal);
                        }
                    }, 300);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    });
    
    // Efeito parallax no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Sistema de reserva
    const reserveButtons = document.querySelectorAll('.btn-tour, .btn-primary');
    reserveButtons.forEach(button => {
        if (button.getAttribute('href') === '#reservas') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Scroll suave para seção de reservas
                const reservasSection = document.querySelector('#reservas');
                if (reservasSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = reservasSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Destacar botões de contato
                setTimeout(() => {
                    const contactButtons = document.querySelectorAll('.booking-buttons .btn-primary, .booking-buttons .btn-secondary');
                    contactButtons.forEach(btn => {
                        btn.style.animation = 'pulse 1s ease 3';
                    });
                }, 1000);
            });
        }
    });
    
    // Validação de formulário
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                    input.style.animation = 'shake 0.5s ease';
                } else {
                    input.style.borderColor = '#4a7c59';
                    input.style.animation = '';
                }
            });
            
            if (isValid) {
                // Simular envio do formulário
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Orçamento solicitado com sucesso! Entraremos em contato em breve.');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }
    
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Adicionar animações CSS dinamicamente
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
    
    // Efeito de hover nos cards de passeios
    const tourCards2 = document.querySelectorAll('.tour-card');
    tourCards2.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efeito de hover nas categorias
    const categories2 = document.querySelectorAll('.category');
    categories2.forEach(category => {
        category.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }
        });
        
        category.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
});
