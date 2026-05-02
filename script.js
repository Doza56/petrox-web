/* 
================================================================
ESTACIÓN DE SERVICIOS PETROX "SAN SEBASTIAN" - JAVASCRIPT
================================================================
*/

// 1. EFECTOS DEL ENCABEZADO (HEADER) AL HACER SCROLL
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '1rem 5%';
        header.style.background = 'rgba(10, 10, 11, 0.95)';
    } else {
        header.style.padding = '1.5rem 5%';
        header.style.background = 'rgba(15, 15, 18, 0.7)';
    }
});

// 2. DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 3. ANIMACIONES DE APARICIÓN
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .about-text, .testimonial-box, .price-card, .service-item, .promo-card, .identity-card, .guide-item, .member-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// 4. LOGICA PARA CARDS DE PRECIO
function toggleFuel(card) {
    const description = card.querySelector('.fuel-description');
    document.querySelectorAll('.price-card').forEach(other => {
        if (other !== card) {
            other.classList.remove('active');
            other.querySelector('.fuel-description').style.maxHeight = null;
        }
    });

    card.classList.toggle('active');
    if (description.style.maxHeight) {
        description.style.maxHeight = null;
    } else {
        description.style.maxHeight = description.scrollHeight + "px";
    }
}

// 5. LOGICA DE ACORDEÓN PARA FAQ
document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.faq-content');
        const icon = header.querySelector('i');

        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.querySelector('.faq-content').style.maxHeight = null;
                otherItem.querySelector('i').classList.replace('fa-minus', 'fa-plus');
            }
        });

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.classList.replace('fa-minus', 'fa-plus');
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.classList.replace('fa-plus', 'fa-minus');
        }
    });
});

// 6. ACTUALIZACIÓN DE FECHA
const dateElement = document.getElementById('current-date');
if (dateElement) {
    const now = new Date();
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('es-ES', options);
}

// 7. MENÚ HAMBURGUESA
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    document.querySelectorAll('.nav-links li a').forEach(link => {
        if (!link.classList.contains('dropbtn')) {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        }
    });
}

// 8. FORMULARIO DE CONTACTO
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formStatus = document.getElementById('formStatus');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        btnText.textContent = 'Enviando...';
        btnSpinner.style.display = 'inline-block';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = '✅ ¡Mensaje enviado con éxito!';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error('Error');
            }
        } catch (error) {
            formStatus.textContent = '❌ Error al enviar el mensaje.';
            formStatus.style.display = 'block';
        } finally {
            btnText.textContent = 'Enviar Mensaje';
            btnSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// 9. CARGA DE PRECIOS GOOGLE SHEETS
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRb7Kq96nJhPkVBaredYV2CkPCpKKlkIyXmOio0JOL5DCQZHvIXPrAuYIvWdepbcsMKzmyywYEMn75G/pub?output=csv';

window.fuelPrices = { regular: 15.40, premium: 17.80, diesel: 16.20, glp: 7.50 };

async function loadPrices() {
    if (!GOOGLE_SHEET_CSV_URL) return;
    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL + '&t=' + new Date().getTime());
        const data = await response.text();
        const rows = data.split('\n');
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            if (cols.length >= 2) {
                const fuel = cols[0].trim().toLowerCase();
                const price = parseFloat(cols[1].trim()).toFixed(2);
                
                if (fuel.includes('regular')) {
                    if (document.getElementById('price-regular')) document.getElementById('price-regular').textContent = price;
                    if (document.getElementById('totem-price-regular')) document.getElementById('totem-price-regular').textContent = price;
                    window.fuelPrices.regular = parseFloat(price);
                } else if (fuel.includes('premium')) {
                    if (document.getElementById('price-premium')) document.getElementById('price-premium').textContent = price;
                    if (document.getElementById('totem-price-premium')) document.getElementById('totem-price-premium').textContent = price;
                    window.fuelPrices.premium = parseFloat(price);
                } else if (fuel.includes('diesel')) {
                    if (document.getElementById('price-diesel')) document.getElementById('price-diesel').textContent = price;
                    if (document.getElementById('totem-price-diesel')) document.getElementById('totem-price-diesel').textContent = price;
                    window.fuelPrices.diesel = parseFloat(price);
                } else if (fuel.includes('glp')) {
                    if (document.getElementById('price-glp')) document.getElementById('price-glp').textContent = price;
                    if (document.getElementById('totem-price-glp')) document.getElementById('totem-price-glp').textContent = price;
                    window.fuelPrices.glp = parseFloat(price);
                }
            }
        }
    } catch (e) { console.error('Error precios:', e); }
}

// 10. CALCULADORA DE COMBUSTIBLE (PAGINA INICIO)
function updateCalculator() {
    const calcFuel = document.getElementById('calc-fuel');
    const calcMoney = document.getElementById('calc-money');
    const calcGallons = document.getElementById('calc-gallons');
    if (!calcFuel || !calcMoney || !calcGallons) return;
    
    const money = parseFloat(calcMoney.value);
    if (isNaN(money)) { calcGallons.textContent = '0.00'; return; }
    
    const price = window.fuelPrices[calcFuel.value];
    calcGallons.textContent = (money / price).toFixed(2);
}

const calcFuel = document.getElementById('calc-fuel');
const calcMoney = document.getElementById('calc-money');
if (calcFuel && calcMoney) {
    calcFuel.addEventListener('change', updateCalculator);
    calcMoney.addEventListener('input', updateCalculator);
}

// 11. TOAST DE BIENVENIDA
function showWelcomeToast() {
    const toast = document.getElementById('welcome-toast');
    if (toast) {
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 6000);
        }, 2000);
        document.getElementById('close-toast')?.addEventListener('click', () => toast.classList.remove('show'));
    }
}

// 12. PRELOADER Y CARGA INICIAL
function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
    }
}

// Inicialización consolidada
document.addEventListener('DOMContentLoaded', () => {
    loadPrices();
    setupBackToTop();
    setupRouteCalculator();
    setupWhatsAppWidget();
    fetchNews();
    setTimeout(showWelcomeToast, 2000);
    setTimeout(removePreloader, 4000); // Seguro de 4 segundos
});

window.addEventListener('load', removePreloader);

// 13. CARRUSEL DE TESTIMONIOS
let currentSlide = 0;
function moveCarousel(index) {
    const track = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    if (!track || dots.length === 0) return;
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

const track = document.getElementById('testimonial-track');
if (track) {
    setInterval(() => {
        const dots = document.querySelectorAll('.carousel-dots .dot');
        if (dots.length > 0) moveCarousel((currentSlide + 1) % dots.length);
    }, 5000);
}

// 14. MODAL DE FACTURACIÓN
function openBillingModal() { document.getElementById('billing-modal').style.display = 'block'; }
function closeBillingModal() { document.getElementById('billing-modal').style.display = 'none'; }
window.addEventListener('click', (e) => { if (e.target.id === 'billing-modal') closeBillingModal(); });

const billingForm = document.getElementById('billingForm');
if (billingForm) {
    billingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = billingForm.querySelector('button[type="submit"]');
        const status = document.getElementById('billingStatus');
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        try {
            const response = await fetch(billingForm.action, {
                method: 'POST',
                body: new FormData(billingForm),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                status.textContent = '✅ Solicitud enviada.';
                status.style.display = 'block';
                billingForm.reset();
                setTimeout(closeBillingModal, 3000);
            }
        } catch (e) { status.textContent = '❌ Error.'; status.style.display = 'block'; }
        finally { btn.textContent = 'Enviar Solicitud'; btn.disabled = false; }
    });
}

// 15. RECOMENDADOR
function recommendFuel(type) {
    const title = document.getElementById('rec-title');
    const desc = document.getElementById('rec-desc');
    const icon = document.getElementById('rec-icon');
    if (!title) return;
    
    document.querySelectorAll('.recommender-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    if (type === 'compacto') {
        title.innerHTML = 'Recomendamos: <span style="color: var(--primary);">Regular (G-Regular)</span>';
        desc.textContent = 'Ideal para motores de uso diario en la ciudad.';
        icon.className = 'fas fa-car';
    } else if (type === 'deportivo') {
        title.innerHTML = 'Recomendamos: <span style="color: var(--primary);">Premium (G-Premium)</span>';
        desc.textContent = 'Para motores modernos o de alta exigencia.';
        icon.className = 'fas fa-tachometer-alt';
    } else if (type === 'trabajo') {
        title.innerHTML = 'Recomendamos: <span style="color: var(--primary);">Diesel o GLP</span>';
        desc.textContent = 'El Diesel DB5 S-50 cuida motores de carga.';
        icon.className = 'fas fa-truck-pickup';
    }
}

// 16. NOTICIAS
async function fetchNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    const rssUrl = 'https://news.google.com/rss/search?q=combustibles+peru+petroleo&hl=es-419&gl=PE&ceid=PE:es-419';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === 'ok') {
            container.innerHTML = '';
            const fallbackImages = [
                'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1620067634310-998822538198?auto=format&fit=crop&q=80&w=1000',
                'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1000'
            ];
            data.items.slice(0, 3).forEach((item, i) => {
                const date = new Date(item.pubDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                const thumb = item.thumbnail || fallbackImages[i % fallbackImages.length];
                container.innerHTML += `
                    <article class="news-card">
                        <img src="${thumb}" class="news-img">
                        <div class="news-body">
                            <span class="news-date">${date}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                            <a href="${item.link}" target="_blank" class="news-link">Leer más <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>`;
            });
        }
    } catch (e) { container.innerHTML = '<p>Error al cargar noticias.</p>'; }
}

// 17. CALCULADORA DE RUTA
function setupRouteCalculator() {
    const dest = document.getElementById('route-destination');
    const vehicle = document.getElementById('route-vehicle');
    const customKmGroup = document.getElementById('custom-km-group');
    const customKmInput = document.getElementById('custom-km');
    
    if (!dest || !vehicle) return;
    
    const update = () => {
        let dist;
        
        if (dest.value === 'custom') {
            customKmGroup.style.display = 'block';
            dist = parseFloat(customKmInput.value) || 0;
        } else {
            customKmGroup.style.display = 'none';
            dist = parseFloat(dest.value);
        }
        
        const eff = parseFloat(vehicle.value);
        const price = (window.fuelPrices && window.fuelPrices.regular) ? window.fuelPrices.regular : 15.40;
        const gal = (dist / eff).toFixed(2);
        
        document.getElementById('route-gallons').textContent = gal;
        document.getElementById('route-cost').textContent = `S/ ${(gal * price).toFixed(2)}`;
    };
    
    dest.addEventListener('change', update);
    vehicle.addEventListener('change', update);
    customKmInput.addEventListener('input', update);
    update();
}

// 18. WHATSAPP WIDGET
function setupWhatsAppWidget() {
    const btn = document.getElementById('wa-toggle');
    const menu = document.getElementById('wa-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('active'); });
    document.addEventListener('click', (e) => { if (!menu.contains(e.target) && !btn.contains(e.target)) menu.classList.remove('active'); });
}

function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 500 ? 'flex' : 'none';
    });
}