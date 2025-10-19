// YnotHost - Script de Interatividade
// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVEGAÇÃO SUAVE =====
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ANIMAÇÕES DE SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.plan, .model, section h2');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    // ===== EFEITO PARALLAX NO HERO =====
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // ===== CONTADOR ANIMADO =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString('pt-BR');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start).toLocaleString('pt-BR');
            }
        }, 16);
    }

    // ===== EFEITO TYPEWRITER =====
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // ===== LOADING SCREEN =====
    function createLoadingScreen() {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <p>Carregando YnotHost...</p>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            #loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #ff4081 0%, #e73370 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
                color: white;
            }
            
            .loader-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        // Remove o loading após 1.5 segundos
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                style.remove();
            }, 500);
        }, 1500);
    }

    // ===== BOTÃO VOLTAR AO TOPO =====
    function createBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Voltar ao topo');
        
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 100px;
                right: 25px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #333, #555);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 999;
                font-size: 1.2rem;
            }
            
            .back-to-top.show {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                background: linear-gradient(45deg, #ff4081, #e73370);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(backToTop);
        
        // Mostrar/esconder baseado no scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        // Funcionalidade de voltar ao topo
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== EFEITOS DE HOVER NOS PLANOS =====
    const plans = document.querySelectorAll('.plan');
    
    plans.forEach(plan => {
        plan.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        plan.addEventListener('mouseleave', function() {
            if (this.classList.contains('plan-popular')) {
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // ===== VALIDAÇÃO DE FORMULÁRIO (se houver) =====
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Remove a classe de erro após 3 segundos
                    setTimeout(() => {
                        input.classList.remove('error');
                    }, 3000);
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        });
    });

    // ===== SISTEMA DE NOTIFICAÇÕES =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            
            .notification-info {
                background: linear-gradient(45deg, #2196F3, #1976D2);
            }
            
            .notification-success {
                background: linear-gradient(45deg, #4CAF50, #388E3C);
            }
            
            .notification-error {
                background: linear-gradient(45deg, #f44336, #d32f2f);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            style.id = 'notification-styles';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove após 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // ===== LAZY LOADING PARA IMAGENS =====
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // ===== ANALYTICS E TRACKING =====
    function trackEvent(eventName, eventData = {}) {
        // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
        console.log('Event tracked:', eventName, eventData);
        
        // Exemplo de integração com Google Analytics (gtag)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }

    // Rastrear cliques nos botões de contrato
    const contractButtons = document.querySelectorAll('a[href*="wa.me"]');
    contractButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planName = this.closest('.plan')?.querySelector('h3')?.textContent || 'Unknown';
            trackEvent('plan_click', {
                plan_name: planName,
                button_location: 'plan_card'
            });
        });
    });

    // ===== INICIALIZAÇÃO =====
    function init() {
        // Criar loading screen
        createLoadingScreen();
        
        // Criar botão voltar ao topo
        createBackToTop();
        
        // Adicionar estilos para animações
        const animationStyles = document.createElement('style');
        animationStyles.textContent = `
            .animate-element {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-element.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .error {
                border: 2px solid #f44336 !important;
                animation: shake 0.5s ease;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(animationStyles);
        
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            showNotification('Bem-vindo à YnotHost! 🚀', 'success');
        }, 2000);
    }

    // Inicializar tudo
    init();
    
    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', function() {
        // Medir performance
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        // Rastrear tempo de carregamento
        trackEvent('page_load_time', {
            load_time: loadTime,
            page: window.location.pathname
        });
    });
});

// ===== FUNÇÕES UTILITÁRIAS GLOBAIS =====

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para detectar se o usuário prefere movimento reduzido
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Função para debounce (otimização de performance)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para throttle (otimização de performance)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Otimizar eventos de scroll e resize
window.addEventListener('scroll', throttle(function() {
    // Código otimizado para scroll
}, 16));

window.addEventListener('resize', debounce(function() {
    // Código para redimensionamento
}, 250));
