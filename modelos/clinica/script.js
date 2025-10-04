// Clínica Vida Saudável - Script de Interatividade
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU MOBILE =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animação do hambúrguer
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }

    // ===== NAVEGAÇÃO SUAVE =====
    const navLinksSmooth = document.querySelectorAll('a[href^="#"]');
    
    navLinksSmooth.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
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
    const animateElements = document.querySelectorAll('.especialidade-card, .diferencial-card, .horario-card, .depoimento-card, .sobre-text, .sobre-image');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    // ===== CONTADOR ANIMADO PARA ESTATÍSTICAS =====
    const stats = document.querySelectorAll('.stat-number');
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    }

    // Observar estatísticas para animação
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===== EFEITO PARALLAX SUTIL =====
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image img, .sobre-image img');
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.1;
            element.style.transform = `translateY(${rate}px)`;
        });
    });

    // ===== SISTEMA DE AGENDAMENTO SIMULADO =====
    function createAppointmentModal() {
        const modal = document.createElement('div');
        modal.className = 'appointment-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-calendar-alt"></i> Agendar Consulta</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="appointment-form">
                        <div class="form-group">
                            <label for="patient-name">Nome Completo</label>
                            <input type="text" id="patient-name" required>
                        </div>
                        <div class="form-group">
                            <label for="patient-phone">Telefone</label>
                            <input type="tel" id="patient-phone" required>
                        </div>
                        <div class="form-group">
                            <label for="specialty">Especialidade</label>
                            <select id="specialty" required>
                                <option value="">Selecione uma especialidade</option>
                                <option value="cardiologia">Cardiologia</option>
                                <option value="neurologia">Neurologia</option>
                                <option value="ortopedia">Ortopedia</option>
                                <option value="oftalmologia">Oftalmologia</option>
                                <option value="clinica-geral">Clínica Geral</option>
                                <option value="pediatria">Pediatria</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="preferred-date">Data Preferida</label>
                            <input type="date" id="preferred-date" required>
                        </div>
                        <div class="form-group">
                            <label for="preferred-time">Horário Preferido</label>
                            <select id="preferred-time" required>
                                <option value="">Selecione um horário</option>
                                <option value="08:00">08:00</option>
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Solicitar Agendamento</button>
                    </form>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .appointment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .appointment-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-content {
                background: #fff;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            
            .appointment-modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                color: #0ea5e9;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #64748b;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #334155;
            }
            
            .form-group input,
            .form-group select {
                width: 100%;
                padding: 12px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            
            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #0ea5e9;
                box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
            }
        `;

        if (!document.querySelector('#appointment-modal-styles')) {
            style.id = 'appointment-modal-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(modal);

        // Eventos do modal
        const closeBtn = modal.querySelector('.modal-close');
        const form = modal.querySelector('.appointment-form');

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simular envio
            showNotification('Solicitação de agendamento enviada! Entraremos em contato em breve.', 'success');
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            
            // Redirecionar para WhatsApp com dados preenchidos
            const name = document.getElementById('patient-name').value;
            const phone = document.getElementById('patient-phone').value;
            const specialty = document.getElementById('specialty').value;
            const date = document.getElementById('preferred-date').value;
            const time = document.getElementById('preferred-time').value;
            
            const message = `Olá! Gostaria de agendar uma consulta:
Nome: ${name}
Telefone: ${phone}
Especialidade: ${specialty}
Data preferida: ${date}
Horário preferido: ${time}`;
            
            const whatsappUrl = `https://wa.me/5511987654321?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });

        // Mostrar modal
        setTimeout(() => modal.classList.add('show'), 100);
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
                background: linear-gradient(45deg, #0ea5e9, #0284c7);
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
                background: linear-gradient(45deg, #7dd3fc, #0ea5e9);
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
                background: linear-gradient(45deg, #0ea5e9, #0284c7);
            }
            
            .notification-success {
                background: linear-gradient(45deg, #10b981, #059669);
            }
            
            .notification-error {
                background: linear-gradient(45deg, #ef4444, #dc2626);
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

    // ===== EFEITOS DE HOVER NOS CARDS =====
    const cards = document.querySelectorAll('.especialidade-card, .depoimento-card, .diferencial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

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
        console.log('Event tracked:', eventName, eventData);
        
        // Integração com Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }

    // Rastrear cliques nos botões de agendamento
    const appointmentButtons = document.querySelectorAll('a[href*="tel:"], .btn-primary');
    appointmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.href && this.href.includes('tel:')) {
                trackEvent('phone_call', {
                    page: 'clinica',
                    button_location: this.closest('section')?.id || 'unknown'
                });
            } else if (this.textContent.includes('Agendar')) {
                trackEvent('appointment_click', {
                    page: 'clinica',
                    button_location: this.closest('section')?.id || 'unknown'
                });
                
                // Abrir modal de agendamento se não for link telefônico
                if (!this.href || !this.href.includes('tel:')) {
                    createAppointmentModal();
                }
            }
        });
    });

    // Rastrear cliques nos botões do WhatsApp
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('whatsapp_click', {
                page: 'clinica',
                button_location: this.closest('section')?.id || 'unknown'
            });
        });
    });

    // ===== INICIALIZAÇÃO =====
    function init() {
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
        `;
        document.head.appendChild(animationStyles);
        
        // Definir data mínima para agendamento (hoje)
        const today = new Date().toISOString().split('T')[0];
        setTimeout(() => {
            const dateInput = document.getElementById('preferred-date');
            if (dateInput) {
                dateInput.min = today;
            }
        }, 1000);
        
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            showNotification('Bem-vindo à Clínica Vida Saudável! 🏥', 'success');
        }, 1500);
    }

    // Inicializar tudo
    init();
    
    // ===== PERFORMANCE MONITORING =====
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        trackEvent('page_load_time', {
            load_time: loadTime,
            page: 'clinica'
        });
    });
});

// ===== FUNÇÕES UTILITÁRIAS =====
function isMobile() {
    return window.innerWidth <= 768;
}

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

// Otimizar eventos de scroll
window.addEventListener('scroll', throttle(function() {
    // Código otimizado para scroll
}, 16));

window.addEventListener('resize', debounce(function() {
    // Código para redimensionamento
}, 250));
