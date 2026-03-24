import { initTranslations } from './components/i18n.js';
import { initThemeToggle } from './components/themeToggle.js';
import { initNavigation } from './components/navigation.js';
import { initScrollReveal } from './components/scrollReveal.js';
import { initAccordion } from './components/accordion.js';
import { analyticsService } from './services/analyticsService.js';
import { initHomePage } from './pages/controllers/homeController.js';
import { initProjectsPage } from './pages/controllers/projectsController.js';
import { initBooksPage } from './pages/controllers/booksController.js';
import { initBlogPage } from './pages/controllers/blogController.js';
import { initContactPage } from './pages/controllers/contactController.js';
import { initPostPage } from './pages/controllers/postController.js';

const pageInitializers = {
    home: initHomePage,
    projects: initProjectsPage,
    books: initBooksPage,
    blog: initBlogPage,
    contact: initContactPage,
    post: initPostPage
};

document.addEventListener('DOMContentLoaded', async () => {
    initTranslations();
    initThemeToggle();
    initNavigation();
    initScrollReveal();
    initAccordion();

    const page = document.body.dataset.page;
    const initializePage = pageInitializers[page];
    if (typeof initializePage === 'function') {
        await initializePage();
    }

    analyticsService.trackVisit();
});
