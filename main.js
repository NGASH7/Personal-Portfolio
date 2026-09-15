/**
 * IAN KAMAU - PORTFOLIO INTERACTIVE CLIENT SCRIPT
 * Handles mobile drawer nav, copy-to-clipboard toast feedback,
 * dynamic typed text, and project category filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile nav when clicking any link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close mobile nav on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // 2. Active Link Highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 3. Project Filter Tabs
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-wrapper');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Copy-to-Clipboard Functionality with Toast
    window.copyToClipboard = function(text, label = 'Copied') {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`${label} copied to clipboard!`);
            }).catch(() => {
                fallbackCopy(text, label);
            });
        } else {
            fallbackCopy(text, label);
        }
    };

    function fallbackCopy(text, label) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showToast(`${label} copied to clipboard!`);
        } catch (err) {
            showToast(`Could not auto-copy. Value: ${text}`);
        }
        document.body.removeChild(tempInput);
    }

    // 5. Toast Notification System
    function showToast(message) {
        let toast = document.getElementById('portfolio-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'portfolio-toast';
            toast.className = 'toast-notification';
            toast.innerHTML = `<i class="fa-solid fa-circle-check toast-icon"></i> <span id="toast-message"></span>`;
            document.body.appendChild(toast);
        }

        const msgSpan = document.getElementById('toast-message');
        if (msgSpan) msgSpan.textContent = message;

        toast.classList.add('show');
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
});
