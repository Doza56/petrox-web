/* 
================================================================
ESTACIÓN DE SERVICIOS PETROX "SAN SEBASTIAN" - JAVASCRIPT
================================================================
*/

// 1. EFECTOS DEL ENCABEZADO (HEADER) AL HACER SCROLL
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    // Si el usuario baja más de 50px, el header se vuelve más compacto y oscuro
    if (window.scrollY > 50) {
        header.style.padding = '1rem 5%';
        header.style.background = 'rgba(10, 10, 11, 0.95)';
    } else {
        // Vuelve a su estado original al estar arriba
        header.style.padding = '1.5rem 5%';
        header.style.background = 'rgba(15, 15, 18, 0.7)';
    }
});

// 2. DESPLAZAMIENTO SUAVE (SMOOTH SCROLL) PARA LOS ENLACES DEL MENÚ
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Solo aplica si el enlace tiene un destino válido
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

// 3. ANIMACIONES DE APARICIÓN (REVEAL ANIMATIONS) AL BAJAR
const observerOptions = {
    threshold: 0.1 // El elemento debe ser visible al menos un 10%
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Cuando el elemento entra en pantalla, lo hacemos visible
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 3. LOGICA PARA CARDS DE PRECIO (REVELAR DESCRIPCIÓN)
function toggleFuel(card) {
    const description = card.querySelector('.fuel-description');

    // Cerrar otros
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

// 4. LOGICA DE ACORDEÓN PARA FAQ
document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = item.querySelector('.faq-content');
        const icon = header.querySelector('i');

        // Cerrar otros abiertos (opcional)
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

// Aplicamos la animación a tarjetas, textos de "Nosotros", testimonios, etc.
document.querySelectorAll('.card, .about-text, .testimonial-box, .price-card, .service-item, .promo-card, .identity-card, .guide-item, .member-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// 4. ACTUALIZACIÓN DE FECHA EN EL WIDGET DE PRECIOS
const dateElement = document.getElementById('current-date');
if (dateElement) {
    const now = new Date();
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    // Muestra la fecha en formato: "24 de abril de 2026"
    dateElement.textContent = now.toLocaleDateString('es-ES', options);
}

// 5. MENÚ HAMBURGUESA PARA MÓVILES
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Cambiar el icono de hamburguesa a una 'X'
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Lógica para submenús desplegables en móvil
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            dropbtn.addEventListener('click', (e) => {
                if (window.getComputedStyle(hamburger).display === 'block') {
                    e.preventDefault();
                    dropdown.classList.toggle('mobile-expanded');
                }
            });
        }
    });

    // Cerrar el menú al hacer clic en un enlace (que no sea el botón del dropdown)
    document.querySelectorAll('.nav-links li a').forEach(link => {
        if (!link.classList.contains('dropbtn')) {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                dropdowns.forEach(d => d.classList.remove('mobile-expanded'));
            });
        }
    });
}

// 6. MANEJO DE ENVÍO DE FORMULARIO DE CONTACTO POR AJAX (FETCH API)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita que la página se recargue o redirija
        
        const formStatus = document.getElementById('formStatus');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        // Mostrar estado de carga
        btnText.textContent = 'Enviando...';
        btnSpinner.style.display = 'inline-block';
        submitBtn.disabled = true;
        formStatus.style.display = 'none';

        try {
            const formData = new FormData(contactForm);
            
            // Usando FormSubmit con Fetch
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Éxito
                formStatus.textContent = '✅ ¡Tu mensaje ha sido enviado con éxito! Nos pondremos en contacto pronto.';
                formStatus.style.color = '#25d366'; // Verde WhatsApp
                formStatus.style.backgroundColor = 'rgba(37, 211, 102, 0.1)';
                formStatus.style.border = '1px solid rgba(37, 211, 102, 0.3)';
                formStatus.style.display = 'block';
                contactForm.reset(); // Limpiar el formulario
            } else {
                throw new Error('Error en el servidor al enviar');
            }
        } catch (error) {
            // Error
            formStatus.textContent = '❌ Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo o contáctanos por WhatsApp.';
            formStatus.style.color = '#ef4444'; // Rojo
            formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            formStatus.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            formStatus.style.display = 'block';
        } finally {
            // Restaurar el botón
            btnText.textContent = 'Enviar Mensaje';
            btnSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// 7. CARGA DE PRECIOS DESDE GOOGLE SHEETS
// Tu clienta debe publicar su Google Sheet como CSV y pegar el enlace aquí dentro de las comillas:
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRb7Kq96nJhPkVBaredYV2CkPCpKKlkIyXmOio0JOL5DCQZHvIXPrAuYIvWdepbcsMKzmyywYEMn75G/pub?output=csv';

// Precios por defecto en caso de que falle la carga
window.fuelPrices = {
    regular: 15.40,
    premium: 17.80,
    diesel: 16.20,
    glp: 7.50
};

async function loadPrices() {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL === '') {
        updateCalculator();
        return;
    }

    try {
        // Añadimos un parámetro de tiempo para evitar que el navegador guarde en caché el precio viejo
        const urlPura = GOOGLE_SHEET_CSV_URL + '&t=' + new Date().getTime();
        const response = await fetch(urlPura);
        if (!response.ok) throw new Error('No se pudo cargar el CSV');
        
        const data = await response.text();
        const rows = data.split('\n');
        
        // Asumimos que la fila 1 (índice 0) son los títulos
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            if (cols.length >= 2) {
                const combustible = cols[0].trim().toLowerCase();
                const precio = parseFloat(cols[1].trim()).toFixed(2);
                
                if (combustible.includes('regular') && document.getElementById('price-regular')) {
                    document.getElementById('price-regular').textContent = precio;
                    if (document.getElementById('totem-price-regular')) {
                        document.getElementById('totem-price-regular').textContent = precio;
                    }
                    window.fuelPrices.regular = parseFloat(precio);
                }
                else if (combustible.includes('premium') && document.getElementById('price-premium')) {
                    document.getElementById('price-premium').textContent = precio;
                    if (document.getElementById('totem-price-premium')) {
                        document.getElementById('totem-price-premium').textContent = precio;
                    }
                    window.fuelPrices.premium = parseFloat(precio);
                }
                else if (combustible.includes('diesel') && document.getElementById('price-diesel')) {
                    document.getElementById('price-diesel').textContent = precio;
                    if (document.getElementById('totem-price-diesel')) {
                        document.getElementById('totem-price-diesel').textContent = precio;
                    }
                    window.fuelPrices.diesel = parseFloat(precio);
                }
                else if (combustible.includes('glp') && document.getElementById('price-glp')) {
                    document.getElementById('price-glp').textContent = precio;
                    if (document.getElementById('totem-price-glp')) {
                        document.getElementById('totem-price-glp').textContent = precio;
                    }
                    window.fuelPrices.glp = parseFloat(precio);
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar los precios desde Google Sheets:', error);
    } finally {
        updateCalculator();
    }
}

// 8. LOGICA DE LA CALCULADORA DE COMBUSTIBLE
const calcFuel = document.getElementById('calc-fuel');
const calcMoney = document.getElementById('calc-money');
const calcGallons = document.getElementById('calc-gallons');

function updateCalculator() {
    if (!calcFuel || !calcMoney || !calcGallons) return;
    
    const fuelType = calcFuel.value;
    const moneyStr = calcMoney.value;
    
    if (moneyStr === '' || isNaN(parseFloat(moneyStr))) {
        calcGallons.textContent = '0.00';
        return;
    }
    
    const money = parseFloat(moneyStr);
    const pricePerGallon = window.fuelPrices[fuelType];
    
    if (pricePerGallon > 0) {
        const gallons = (money / pricePerGallon).toFixed(2);
        calcGallons.textContent = gallons;
    }
}

if (calcFuel && calcMoney) {
    calcFuel.addEventListener('change', updateCalculator);
    calcMoney.addEventListener('input', updateCalculator);
}

// 9. TOAST DE BIENVENIDA
function showWelcomeToast() {
    const toast = document.getElementById('welcome-toast');
    const closeBtn = document.getElementById('close-toast');
    
    if (toast && closeBtn) {
        // Mostrar después de 2 segundos
        setTimeout(() => {
            toast.classList.add('show');
            
            // Ocultar automáticamente después de 6 segundos
            setTimeout(() => {
                toast.classList.remove('show');
            }, 6000);
            
        }, 2000);
        
        // Cerrar al hacer clic en X
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }
}

// Llamar a las funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadPrices();
    showWelcomeToast();
});

// 10. PRELOADER
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    }
});

// 11. CARRUSEL DE TESTIMONIOS
let currentSlide = 0;
const track = document.getElementById('testimonial-track');
const dots = document.querySelectorAll('.carousel-dots .dot');

function moveCarousel(index) {
    if (!track || dots.length === 0) return;
    
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

// Auto-play del carrusel
if (track && dots.length > 0) {
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % dots.length;
        moveCarousel(nextSlide);
    }, 5000);
}

// 12. MODAL DE FACTURACIÓN
const billingModal = document.getElementById('billing-modal');

function openBillingModal() {
    if (billingModal) {
        billingModal.style.display = 'block';
    }
}

function closeBillingModal() {
    if (billingModal) {
        billingModal.style.display = 'none';
    }
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === billingModal) {
        closeBillingModal();
    }
});

// Envío del formulario de facturación por AJAX
const billingForm = document.getElementById('billingForm');
if (billingForm) {
    billingForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = billingForm.querySelector('button[type="submit"]');
        const status = document.getElementById('billingStatus');
        
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        status.style.display = 'none';

        try {
            const formData = new FormData(billingForm);
            const response = await fetch(billingForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.textContent = '✅ ¡Solicitud enviada! Pronto te llegará la factura al correo/WhatsApp registrado.';
                status.style.color = '#25d366';
                status.style.backgroundColor = 'rgba(37, 211, 102, 0.1)';
                status.style.display = 'block';
                billingForm.reset();
                setTimeout(closeBillingModal, 4000); // Cerrar después de 4 seg
            } else {
                throw new Error('Error de servidor');
            }
        } catch (error) {
            status.textContent = '❌ Hubo un error al enviar. Por favor, intenta de nuevo.';
            status.style.color = '#ef4444';
            status.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            status.style.display = 'block';
        } finally {
            btn.textContent = 'Enviar Solicitud';
            btn.disabled = false;
        }
    });
}


// 14. GUÍA INTERACTIVA DE COMBUSTIBLES
function recommendFuel(type) {
    const title = document.getElementById('rec-title');
    const desc = document.getElementById('rec-desc');
    const icon = document.getElementById('rec-icon');
    const buttons = document.querySelectorAll('.recommender-btn');
    
    // Resetear botones
    buttons.forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.borderColor = 'var(--glass-border)';
        btn.style.color = 'var(--text-dim)';
        btn.classList.remove('active');
    });
    
    // Activar botón seleccionado
    event.currentTarget.style.borderColor = 'var(--primary)';
    event.currentTarget.style.color = 'white';
    event.currentTarget.classList.add('active');
    
    // Actualizar contenido
    if (type === 'compacto') {
        title.innerHTML = 'Recomendamos: <span style="color: var(--primary);">Regular (G-Regular)</span>';
        desc.textContent = 'Ideal para motores de uso diario en la ciudad. Ayuda a mantener limpios los inyectores y proporciona un rendimiento económico y eficiente para tus trayectos cotidianos en Huancayo.';
        icon.className = 'fas fa-car';
    } else if (type === 'deportivo') {
        title.innerHTML = 'Recomendamos: <span style="color: var(--primary);">Premium (G-Premium)</span>';
        desc.textContent = 'Para motores modernos, turboalimentados o de alta exigencia. Maximiza la potencia, protege contra la fricción y limpia el motor para que rinda al máximo en carreteras.';
        icon.className = 'fas fa-tachometer-alt';
    } else if (type === 'trabajo') {
        title.innerHTML = 'Recomendamos: <span style="color: var(--primary);">Diesel o GLP</span>';
        desc.textContent = 'El Diesel DB5 S-50 cuida los motores de carga pesada reduciendo el desgaste. Si usas auto dual, el GLP te dará el mayor ahorro mensual sin perder potencia en la altura.';
        icon.className = 'fas fa-truck-pickup';
    }
}

// 15. BOTÓN VOLVER ARRIBA
function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.style.display = 'flex';
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.scrollY <= 500) backToTopBtn.style.display = 'none';
                }, 300);
            }
        });
    }
}

// 16. FEED AUTOMÁTICO DE NOTICIAS
async function fetchNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    // Buscamos noticias sobre combustibles en Perú usando Google News RSS
    const rssUrl = 'https://news.google.com/rss/search?q=combustibles+peru+petroleo&hl=es-419&gl=PE&ceid=PE:es-419';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            container.innerHTML = ''; 
            
            data.items.slice(0, 3).forEach(item => {
                const date = new Date(item.pubDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });

                const thumbnail = item.thumbnail || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000';

                const card = `
                    <article class="news-card">
                        <img src="${thumbnail}" alt="${item.title}" class="news-img" onerror="this.src='https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000'">
                        <div class="news-body">
                            <span class="news-date">${date}</span>
                            <h3>${item.title}</h3>
                            <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                            <a href="${item.link}" target="_blank" class="news-link">Leer noticia completa <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </article>
                `;
                container.innerHTML += card;
            });
        } else {
            throw new Error('No se pudieron cargar las noticias');
        }
    } catch (error) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-dim);">
                <p>No pudimos cargar las noticias automáticamente en este momento.</p>
                <a href="https://www.google.com/search?q=combustibles+peru+noticias" target="_blank" class="btn-primary" style="margin-top: 1rem; display: inline-block;">Ver noticias en Google</a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupBackToTop();
    fetchNews();
});