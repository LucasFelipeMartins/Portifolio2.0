import { contactService } from '../../services/contactService.js';

export const initContactPage = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const defaultText = submitButton.innerHTML;

        const formData = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            message: contactForm.message.value.trim(),
            captchaToken: document.getElementById('captchaToken')?.value?.trim() || ''
        };

        if (!formData.captchaToken) {
            alert('Confirme que você não é um robô.');
            return;
        }

        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        try {
            await contactService.sendMessage(formData);
            alert('Sua mensagem foi enviada com sucesso! Entrarei em contato em breve.');
            contactForm.reset();
            window.resetContactCaptcha?.();
        } catch (error) {
            alert(error.message || 'Não foi possível conectar ao servidor.');
            window.resetContactCaptcha?.();
        } finally {
            submitButton.innerHTML = defaultText;
            submitButton.disabled = false;
        }
    });
};
