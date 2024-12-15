document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const homeLink = document.querySelector('.home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scroll to the top
            });
        });
    }

    // Testimonial slider functionality
    let slideIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % testimonials.length;
        showSlide(slideIndex);
    }

    // Set an interval for automatic sliding
    const sliderInterval = setInterval(nextSlide, 5000); // Change every 5 seconds

    // Manual navigation
    prevButton.addEventListener('click', () => {
        clearInterval(sliderInterval); // Stop automatic sliding when manually interacted
        slideIndex = (slideIndex - 1 + testimonials.length) % testimonials.length;
        showSlide(slideIndex);
    });

    nextButton.addEventListener('click', () => {
        clearInterval(sliderInterval); // Stop automatic sliding when manually interacted
        slideIndex = (slideIndex + 1) % testimonials.length;
        showSlide(slideIndex);
    });

    // Initialize first slide
    showSlide(slideIndex);
});
