// Make sure GSAP and ScrollTrigger are loaded
gsap.registerPlugin(ScrollTrigger);



// Animate each card separately
document.querySelectorAll('.cardsingle').forEach((card) => {
    
    gsap.to(card, {
        scale: 0.8,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: card,           // each card triggers its own animation
            start: "top 10%",        // starts when card is 80% down viewport
            end: "top -50%",          // ends when card is 20% down viewport
            scrub: 1,              // smooth scrub effect
            // markers: true,           // remove this after testing
        }
    });
});


// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = faqItem.querySelector('.faq-icon');
        const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').style.maxHeight = '0';
                item.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            }
        });

        // Toggle current FAQ
        if (isOpen) {
            answer.style.maxHeight = '0';
            icon.style.transform = 'rotate(0deg)';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.style.transform = 'rotate(180deg)';
        }
    });
});