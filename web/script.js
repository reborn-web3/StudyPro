document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission handler
    const form = document.querySelector('#diploma-form');
    const submitBtn = document.querySelector('#submit-btn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Update UI to loading state
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Генерируем...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    // Get filename from header or use default
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${data.student_name || 'diploma'}.docx`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    a.remove();
                } else {
                    const error = await response.json();
                    alert('Ошибка при генерации: ' + (error.error || 'Неизвестная ошибка'));
                }
            } catch (err) {
                console.error(err);
                alert('Произошла ошибка при отправке данных на сервер.');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Parallax effect for the customized diploma card
    const heroSection = document.querySelector('.hero');
    const diplomaCard = document.querySelector('.diploma-card');

    if (heroSection && diplomaCard) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            diplomaCard.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            diplomaCard.style.transform = `perspective(1000px) rotateY(-10deg) rotateX(5deg)`; // Reset to default
            diplomaCard.style.transition = 'transform 0.5s ease';
        });

        heroSection.addEventListener('mouseenter', () => {
            diplomaCard.style.transition = 'none'; // Remove transition for smooth movement
        });
    }

    // Animate stats on scroll
    const stats = document.querySelectorAll('.count');
    let hasAnimated = false;

    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.innerText.replace(/\D/g, ''); // Extract number
            const suffix = stat.innerText.replace(/[0-9]/g, ''); // Extract suffix like 'k+'

            let count = 0;
            const inc = target / 100; // Speed

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    stat.innerText = Math.ceil(count) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + suffix;
                }
            };

            updateCount();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            animateStats();
            hasAnimated = true;
        }
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
