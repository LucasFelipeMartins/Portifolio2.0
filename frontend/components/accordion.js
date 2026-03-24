export const initAccordion = () => {
    const expHeaders = document.querySelectorAll('.exp-header-title');

    expHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const details = header.nextElementSibling;
            if (details && details.classList.contains('exp-details')) {
                details.classList.toggle('open');
            }
        });
    });
};
