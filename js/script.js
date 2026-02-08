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
            const gap = 15; // from CSS
            const singleSetWidth = (imgWidth + gap) * images.length;

            // Initial position: Start of the middle (original) set
            gallery.scrollLeft = singleSetWidth;

            // Scroll Handler
            gallery.addEventListener('scroll', () => {
                // Buffer to make it smooth
                if (gallery.scrollLeft <= 10) {
                    gallery.scrollLeft = singleSetWidth + gallery.scrollLeft;
                } else if (gallery.scrollLeft >= singleSetWidth * 2 - 10) {
                    gallery.scrollLeft = gallery.scrollLeft - singleSetWidth;
                }
            });

            // Auto-Play Logic
            let autoPlayInterval;
            const startAutoPlay = () => {
                stopAutoPlay(); // Clear existing to be safe
                autoPlayInterval = setInterval(() => {
                    // Scroll by one image width (approximate, smooth behavior handles the rest)
                    // We use scrollBy with behavior: 'smooth' for the animation
                    // If we are at a snap point, it should snap to the next one
                    // However, manual scrollLeft calculation is more precise for the loop check
                    // Let's use a small increment or trigger a scroll to the next snap point technique?
                    // Simpler: just scrollBy the width of one item + gap
                    const itemWidth = (imgWidth + gap);
                    gallery.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }, 3000); // 3 seconds
            };

            const stopAutoPlay = () => {
                clearInterval(autoPlayInterval);
            };

            // Start initially
            startAutoPlay();

            // Pause on interaction
            gallery.addEventListener('touchstart', stopAutoPlay, { passive: true });
            gallery.addEventListener('touchmove', stopAutoPlay, { passive: true });

            // Resume after interaction ends
            gallery.addEventListener('touchend', () => {
                // Delay resume to let the user finish looking/settling
                setTimeout(startAutoPlay, 3000);
            });

            // Also pause on mouse interaction for desktop testing or hybrid devices
            gallery.addEventListener('mouseenter', stopAutoPlay);
            gallery.addEventListener('mouseleave', () => {
                startAutoPlay();
            });
        };

        // Run calculation after layout
        setTimeout(calculateScroll, 100);
    }
});
