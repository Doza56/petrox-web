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
const GOOGLE_SHEET_CSV_URL = ''; // EJEMPLO: 'https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv'

async function loadPrices() {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL === '') return; // Si no hay enlace, usar precios por defecto del HTML

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
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
                }
                else if (combustible.includes('premium') && document.getElementById('price-premium')) {
                    document.getElementById('price-premium').textContent = precio;
                }
                else if (combustible.includes('diesel') && document.getElementById('price-diesel')) {
                    document.getElementById('price-diesel').textContent = precio;
                }
                else if (combustible.includes('glp') && document.getElementById('price-glp')) {
                    document.getElementById('price-glp').textContent = precio;
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar los precios desde Google Sheets:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', loadPrices);