// Mobile menu: toggles the navigation and closes it after a link is selected.
        const navbar = document.querySelector('.navbar');
        const menuButton = document.querySelector('#menuButton');
        const navLinks = document.querySelector('#navLinks');

        // Navigation effect: compact the fixed bar after the visitor begins scrolling.
        const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();

        menuButton.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            document.body.classList.toggle('menu-open', isOpen);
            menuButton.setAttribute('aria-expanded', String(isOpen));
            menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            menuButton.innerHTML = isOpen ? '&times;' : '&#9776;';
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.classList.remove('menu-open');
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.setAttribute('aria-label', 'Open menu');
                menuButton.innerHTML = '&#9776;';
            });
        });

        // Scroll reveal: IntersectionObserver adds the visible class only when content is near the viewport.
        const revealItems = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => revealObserver.observe(item));

        // Contact form demo: validate first, then show a short submitting state before confirming.
        const contactForm = document.querySelector('#contactForm');
        const formMessage = document.querySelector('#formMessage');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const preferredDay = contactForm.elements.day;

        // The date picker starts at today so appointment requests cannot use a past date.
        const today = new Date();
        preferredDay.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

        contactForm.addEventListener('input', () => {
            formMessage.textContent = '';
            formMessage.className = 'form-message full';
        });

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!contactForm.reportValidity()) {
                formMessage.textContent = 'Please complete the highlighted fields before sending.';
                formMessage.classList.add('error');
                contactForm.querySelector(':invalid')?.focus();
                return;
            }

            const name = contactForm.elements.name.value.trim();
            contactForm.classList.add('is-submitting');
            submitButton.disabled = true;
            contactForm.setAttribute('aria-busy', 'true');
            submitButton.textContent = 'Sending...';
            formMessage.textContent = 'Preparing your request...';
            formMessage.className = 'form-message full';

            window.setTimeout(() => {
                contactForm.classList.remove('is-submitting');
                submitButton.disabled = false;
                contactForm.removeAttribute('aria-busy');
                submitButton.textContent = 'Send request';
                formMessage.textContent = `Thanks, ${name}! Your request has been received.`;
                formMessage.classList.add('success');
                contactForm.reset();
            }, 700);
        });

        // Page loading animation: fade the overlay away after the browser finishes loading the page.
        window.addEventListener('load', () => {
            window.setTimeout(() => {
                document.querySelector('#pageLoader').classList.add('hidden');
                document.body.classList.remove('is-loading');
            }, 350);
        }, { once: true });

        document.querySelector('#year').textContent = new Date().getFullYear();