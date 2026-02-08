document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Validating and Handling Form Submission (Mock)
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation check (HTML5 does most of it)
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;

            if (name && phone && service) {
                // Here you would typically send the data to a backend
                // For this static demo, we'll alert the user and clear the form
                alert(`Thank you, ${name}! We have received your request for ${service}. We will contact you at ${phone} shortly.`);
                form.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // scroll effect for navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.8)";
            navbar.style.padding = "15px 0";
        } else {
            navbar.style.boxShadow = "none";
            navbar.style.padding = "20px 0";
        }
    });

    // Infinite Scroll Gallery for Mobile
    const gallery = document.querySelector('.gallery-grid');
    if (gallery && window.innerWidth <= 768) {
        const images = Array.from(gallery.children);

        // Clone for end
        images.forEach(img => {
            const clone = img.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            gallery.appendChild(clone);
        });

        // Clone for start
        images.reverse().forEach(img => {
            const clone = img.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            gallery.prepend(clone);
        });

        // Calculate single set width
        const calculateScroll = () => {
            const firstImg = gallery.querySelector('.gallery-image');
            if (!firstImg) return;

            const imgWidth = firstImg.offsetWidth;
            const style = window.getComputedStyle(gallery);
            const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 15;
            const singleSetWidth = (imgWidth + gap) * images.length;

            // Initial position: Start of the middle (original) set
            if (gallery.scrollLeft === 0) {
                gallery.scrollLeft = singleSetWidth;
            }

            // Scroll Handler with RequestAnimationFrame (Throttling)
            let isScrolling = false;
            const checkScroll = () => {
                if (!isScrolling) {
                    window.requestAnimationFrame(() => {
                        // Buffer trimmed to 5px for precision
                        // When wrapping, we just jump. The browser's scroll snap should handle the landing if we align correctly.
                        // Removing the scrollSnapType manipulation to avoid thrashing/jitter.
                        if (gallery.scrollLeft <= 5) {
                            gallery.scrollLeft = singleSetWidth + gallery.scrollLeft;
                        } else if (gallery.scrollLeft >= singleSetWidth * 2 - 5) {
                            gallery.scrollLeft = gallery.scrollLeft - singleSetWidth;
                        }
                        isScrolling = false;
                    });
                    isScrolling = true;
                }
            };
            gallery.addEventListener('scroll', checkScroll, { passive: true });

            // Auto-Play Logic
            let autoPlayInterval;
            let isUserInteracting = false;

            const startAutoPlay = () => {
                stopAutoPlay(); // Clear existing
                if (isUserInteracting) return; // Don't start if user is touching

                autoPlayInterval = setInterval(() => {
                    if (isUserInteracting) return;

                    const itemWidth = (imgWidth + gap);
                    gallery.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }, 3000);
            };

            const stopAutoPlay = () => {
                clearInterval(autoPlayInterval);
            };

            // Start initially
            startAutoPlay();

            // Interaction Handlers
            const handleInteractionStart = () => {
                isUserInteracting = true;
                stopAutoPlay();
            };

            const handleInteractionEnd = () => {
                isUserInteracting = false;
                // Delay resume to let the user finish looking/settling
                setTimeout(startAutoPlay, 3000);
            };

            // Touch
            gallery.addEventListener('touchstart', handleInteractionStart, { passive: true });
            gallery.addEventListener('touchmove', handleInteractionStart, { passive: true });
            gallery.addEventListener('touchend', handleInteractionEnd);

            // Mouse
            gallery.addEventListener('mouseenter', handleInteractionStart);
            gallery.addEventListener('mouseleave', handleInteractionEnd);
        };

        // Run calculation after layout
        setTimeout(calculateScroll, 100);
    }
});
