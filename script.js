document.addEventListener('DOMContentLoaded', () => {

    // --- Desktop Language Selector Dropdown Logic (CORRECTED) ---
    // This specifically targets the desktop language selector
    const desktopLangSelector = document.querySelector('.language-selector-desktop');
    if (desktopLangSelector) {
        const langButton = desktopLangSelector.querySelector('.language-button');

        langButton.addEventListener('click', (event) => {
            // Stop the click from bubbling up, which would close the menu
            event.stopPropagation();
            desktopLangSelector.classList.toggle('active');
        });

        // Add a global click listener to close the dropdown when clicking elsewhere
        window.addEventListener('click', () => {
            if (desktopLangSelector.classList.contains('active')) {
                desktopLangSelector.classList.remove('active');
            }
        });
    }
    
    // --- Dynamic Active Class for Navigation ---
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPageUrl = window.location.href;

    navLinks.forEach(link => {
        // Remove any pre-existing active class from HTML
        link.classList.remove('active');
        // Add the active class if the link's href matches the current page URL
        if(link.href === currentPageUrl) {
            link.classList.add('active');
        }
    });

    // --- Letter-by-letter animation for hero text ---
    const elementsToAnimate = document.querySelectorAll('.animate-by-letter');
    if (elementsToAnimate.length > 0) {
        let totalDelay = 0;
        const letterDelay = 50; // Delay between each letter in milliseconds

        elementsToAnimate.forEach(element => {
            const text = element.textContent;
            element.textContent = ''; // Clear original text to fill with spans

            // Create a span for each letter
            text.split('').forEach(letter => {
                const span = document.createElement('span');
                span.className = 'letter-span';
                span.textContent = letter;
                element.appendChild(span);
            });

            // Animate each letter span sequentially
            const letterSpans = element.querySelectorAll('.letter-span');
            letterSpans.forEach(span => {
                setTimeout(() => {
                    span.classList.add('is-visible');
                }, totalDelay);
                totalDelay += letterDelay;
            });

            // Add a small pause between the heading and the tagline
            totalDelay += 300;
        });
    }

    // --- Header Scroll Effect ---
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const isHomePage = document.body.classList.contains('home-page');

        const updateHeaderStyle = () => {
            // Always add scrolled class on non-home pages
            if (!isHomePage) {
                siteHeader.classList.add('scrolled');
                return;
            }
            // On homepage, toggle based on scroll position
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', updateHeaderStyle);
        updateHeaderStyle(); // Initial check on page load
    }

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // --- Testimonial Carousel (only runs if the carousel exists on the page) ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        let currentIndex = 0;

        if(slides.length > 0 && nextButton && prevButton) {
            const updateSlides = () => {
                slides.forEach((slide, index) => {
                    slide.style.display = (index === currentIndex) ? 'block' : 'none';
                });
            };
            
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlides();
            });
            
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlides();
            });
            
            // Auto-play carousel
            setInterval(() => {
                nextButton.click();
            }, 5000);

            // Initialize
            updateSlides();
        }
    }

    // --- Scroll Reveal Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Exclude hero text from this observer since it has its own animation
            if (entry.isIntersecting && !entry.target.classList.contains('animate-by-letter')) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // --- ENHANCEMENT: Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's a real anchor link on the page and not just a placeholder "#"
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- INTEGRATED: Auto-Language Detection and Redirection ---
    // This logic runs once when the page loads to check for user preference.
    // It requires the switchLanguage() function from language.js to be available.
    if (typeof switchLanguage === 'function') {
        const preferredLang = localStorage.getItem('preferredLanguage');
        const currentPath = window.location.pathname;

        // If no preference is set, try to detect the browser's language on the first visit
        if (!preferredLang) {
            const userLang = navigator.language || navigator.userLanguage;
            if (userLang.startsWith('zh') && !currentPath.includes('.zh.html')) {
                // If browser is Chinese and we're on an English page, switch
                switchLanguage('zh');
            }
            return; // Otherwise, default to the current page's language
        }

        // If a preference is already stored, enforce it
        if (preferredLang === 'zh' && !currentPath.includes('.zh.html')) {
            // User wants Chinese but is on an English page
            switchLanguage('zh');
        } else if (preferredLang === 'en' && currentPath.includes('.zh.html')) {
            // User wants English but is on a Chinese page
            switchLanguage('en');
        }
    }

});
document.addEventListener('DOMContentLoaded', () => {

    // --- Modal Popup Logic ---
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('application-modal');

    if (openModalBtn && closeModalBtn && modalOverlay) {
        // Function to open the modal
        const openModal = () => {
            modalOverlay.classList.add('is-visible');
            document.body.classList.add('modal-is-open'); // Prevent background scroll
        };

        // Function to close the modal
        const closeModal = () => {
            modalOverlay.classList.remove('is-visible');
            document.body.classList.remove('modal-is-open');
        };

        // Event Listeners
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);

        // Close modal by clicking on the overlay
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });

        // Close modal with the 'Escape' key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
                closeModal();
            }
        });
    }


    // --- Existing Hamburger Menu & Header Scroll Logic would go here ---
    // (Keep your original script.js code for the menu and header)
    
    // Example from your site structure (assuming this is in your script.js):
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    const siteHeader = document.querySelector('.site-header');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });

    // Add other existing scripts like reveal animations, language switcher, etc.
});