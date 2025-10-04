// TechStore - Script de Loja Virtual
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== VARIÁVEIS GLOBAIS =====
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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
                const headerHeight = document.querySelector('.navbar').offsetHeight + 
                                   document.querySelector('.top-bar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== BUSCA DE PRODUTOS =====
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Buscando por: "${query}"`, 'info');
            // Aqui você implementaria a lógica de busca real
            console.log('Searching for:', query);
        }
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // ===== SISTEMA DE CARRINHO =====
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const overlay = document.getElementById('overlay');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    function updateCartUI() {
        // Atualizar contador
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Atualizar total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        
        // Atualizar itens
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="https://source.unsplash.com/60x60/?${item.name.toLowerCase()}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div class="cart-item-quantity">Qtd: ${item.quantity}</div>
                    </div>
                    <button class="remove-item" data-product="${item.name}">×</button>
                </div>
            `).join('');
            
            // Adicionar eventos de remoção
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const productName = this.dataset.product;
                    removeFromCart(productName);
                });
            });
        }
        
        // Salvar no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(productName, price) {
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: 1
            });
        }
        
        updateCartUI();
        showNotification(`${productName} adicionado ao carrinho!`, 'success');
        
        // Animação do botão carrinho
        cartBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }

    function removeFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCartUI();
        showNotification(`${productName} removido do carrinho`, 'info');
    }

    function openCart() {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Eventos do carrinho
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    // Botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            addToCart(productName, price);
        });
    });

    // ===== SISTEMA DE FAVORITOS =====
    function toggleFavorite(productName) {
        const index = favorites.indexOf(productName);
        
        if (index > -1) {
            favorites.splice(index, 1);
            showNotification(`${productName} removido dos favoritos`, 'info');
        } else {
            favorites.push(productName);
            showNotification(`${productName} adicionado aos favoritos!`, 'success');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesUI();
    }

    function updateFavoritesUI() {
        document.querySelectorAll('.add-to-favorites').forEach(btn => {
            const productName = btn.closest('.produto-card').querySelector('h3').textContent;
            const isFavorite = favorites.includes(productName);
            
            btn.innerHTML = isFavorite ? 
                '<i class="fas fa-heart"></i>' : 
                '<i class="far fa-heart"></i>';
            
            btn.style.color = isFavorite ? '#e74c3c' : '#6c757d';
        });
    }

    // Botões de favoritos
    document.querySelectorAll('.add-to-favorites').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.produto-card').querySelector('h3').textContent;
            toggleFavorite(productName);
        });
    });

    // ===== COUNTDOWN TIMER =====
    function startCountdown() {
        // Data final da promoção (7 dias a partir de agora)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            } else {
                // Promoção expirada
                document.getElementById('countdown').innerHTML = '<p>Promoção Expirada!</p>';
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ===== NEWSLETTER =====
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('E-mail cadastrado com sucesso! Você receberá nossas ofertas.', 'success');
                this.reset();
                
                // Aqui você enviaria o e-mail para o servidor
                console.log('Newsletter signup:', email);
            }
        });
    }

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
    const animateElements = document.querySelectorAll('.categoria-card, .produto-card, .vantagem-card');
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
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
                z-index: 10002;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            
            .notification-info {
                background: linear-gradient(45deg, #667eea, #764ba2);
            }
            
            .notification-success {
                background: linear-gradient(45deg, #28a745, #20c997);
            }
            
            .notification-error {
                background: linear-gradient(45deg, #dc3545, #fd7e14);
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
                background: linear-gradient(45deg, #ff6b35, #e55a2b);
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
                background: linear-gradient(45deg, #667eea, #764ba2);
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

    // ===== CHECKOUT SIMULADO =====
    const checkoutBtn = document.querySelector('.cart-checkout');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Adicione produtos ao carrinho primeiro!', 'error');
                return;
            }
            
            // Simular processo de checkout
            showNotification('Redirecionando para o checkout...', 'info');
            
            setTimeout(() => {
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const message = `Olá! Gostaria de finalizar minha compra:

${cart.map(item => `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join('\n')}

Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                
                const whatsappUrl = `https://wa.me/5511999998888?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                
                closeCart();
            }, 1000);
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

    // Rastrear cliques em produtos
    document.querySelectorAll('.produto-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const productName = this.querySelector('h3').textContent;
                trackEvent('product_view', {
                    product_name: productName,
                    page: 'loja-virtual'
                });
            }
        });
    });

    // Rastrear cliques em categorias
    document.querySelectorAll('.categoria-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            trackEvent('category_click', {
                category_name: categoryName,
                page: 'loja-virtual'
            });
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

    // ===== INICIALIZAÇÃO =====
    function init() {
        // Inicializar UI do carrinho
        updateCartUI();
        updateFavoritesUI();
        
        // Iniciar countdown
        startCountdown();
        
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
            
            .remove-item {
                background: none;
                border: none;
                color: #dc3545;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px;
                margin-left: 10px;
            }
            
            .cart-item {
                position: relative;
            }
            
            .cart-item-quantity {
                font-size: 0.9rem;
                color: #6c757d;
            }
        `;
        document.head.appendChild(animationStyles);
        
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            showNotification('Bem-vindo à TechStore! 🛒', 'success');
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
            page: 'loja-virtual'
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
