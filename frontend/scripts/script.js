import { initTranslations } from '/components/i18n.js';
import { contactService } from '/services/contactService.js';
import { analyticsService } from '/services/analyticsService.js';
import { projectsService } from '/services/projectsService.js';
import { postsService } from '/services/postsService.js';
import { booksService } from '/services/booksService.js';

const initThemeToggle = () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const htmlElement = document.documentElement;
    const icon = toggle.querySelector('i');

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        if (icon) {
            icon.classList.toggle('fa-sun', theme === 'light');
            icon.classList.toggle('fa-moon', theme !== 'light');
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setTheme('light');
    }

    toggle.addEventListener('click', () => {
        const nextTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });
};

const initHeaderScroll = () => {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
};

const initMobileMenu = () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (!mobileBtn || !navLinks) return;

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
};

const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach((element) => {
            if (element.getBoundingClientRect().top < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
};

const initExperienceAccordion = () => {
    document.querySelectorAll('.exp-header-title').forEach((header) => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const details = header.nextElementSibling;
            if (details && details.classList.contains('exp-details')) {
                details.classList.toggle('open');
            }
        });
    });
};

const captchaState = {
    widgetId: null,
    tokenInput: null
};

const getCaptchaInput = () => {
    if (!captchaState.tokenInput) {
        captchaState.tokenInput = document.getElementById('captchaToken');
    }
    return captchaState.tokenInput;
};

const setCaptchaToken = (token) => {
    const input = getCaptchaInput();
    if (input) {
        input.value = token;
    }
};

const resetContactCaptcha = () => {
    setCaptchaToken('');
    if (typeof window.grecaptcha !== 'undefined' && captchaState.widgetId !== null) {
        window.grecaptcha.reset(captchaState.widgetId);
    }
};

const bootstrapContactCaptcha = () => {
    if (typeof window.grecaptcha === 'undefined' || captchaState.widgetId !== null) {
        return;
    }

    const container = document.getElementById('contactCaptcha');
    const siteKey = window.__CONTACT_CAPTCHA_SITE_KEY || '';
    if (!container || !siteKey) {
        return;
    }

    captchaState.widgetId = window.grecaptcha.render(container, {
        sitekey: siteKey,
        callback: (token) => setCaptchaToken(token || ''),
        'expired-callback': () => resetContactCaptcha()
    });
};

window.__bootstrapContactCaptcha = () => {
    bootstrapContactCaptcha();
};

if (window.__contactCaptchaReady) {
    window.__bootstrapContactCaptcha();
}

window.resetContactCaptcha = resetContactCaptcha;

const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const originalLabel = submitButton.innerHTML;

        const formData = {
            name: contactForm.name?.value?.trim() || '',
            email: contactForm.email?.value?.trim() || '',
            message: contactForm.message?.value?.trim() || '',
            captchaToken: getCaptchaInput()?.value?.trim() || ''
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
            console.error('Erro na requisição:', error);
            alert(error.message || 'Não foi possível conectar ao servidor.');
            window.resetContactCaptcha?.();
        } finally {
            submitButton.innerHTML = originalLabel;
            submitButton.disabled = false;
        }
    });
};

const projectFilterState = {
    category: 'all',
    status: 'all'
};

const applyProjectFilters = () => {
    const cards = document.querySelectorAll('.page-projetos .project-card-full');
    if (!cards.length) return;

    cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || 'all';
        const cardStatus = card.getAttribute('data-status') || 'all';
        const matchesCategory = projectFilterState.category === 'all' || cardCategory === projectFilterState.category;
        const matchesStatus = projectFilterState.status === 'all' || cardStatus === projectFilterState.status;
        const isVisible = matchesCategory && matchesStatus;

        if (isVisible) {
            card.style.display = 'flex';
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            });
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
};

const setupProjectFilterEventListeners = () => {
    const projectPage = document.querySelector('.page-projetos');
    if (!projectPage || projectPage.dataset.filtersReady === 'true') return;

    const pills = projectPage.querySelectorAll('.filter-pill');
    if (!pills.length) return;

    projectPage.dataset.filtersReady = 'true';

    pills.forEach((pill) => {
        pill.addEventListener('click', (event) => {
            event.preventDefault();

            const group = pill.closest('.filter-group');
            if (!group) return;

            group.querySelectorAll('.filter-pill').forEach((btn) => btn.classList.remove('active'));
            pill.classList.add('active');

            const headingKey = group.querySelector('h4')?.getAttribute('data-i18n');
            const value = pill.getAttribute('data-filter') || 'all';

            if (headingKey === 'side_cat' || headingKey === 'filter_cat') {
                projectFilterState.category = value;
            } else {
                projectFilterState.status = value;
            }

            applyProjectFilters();
        });
    });

    applyProjectFilters();
};

const loadProjects = async () => {
    const projectsGrid = document.getElementById('projects-grid-main');
    if (!projectsGrid) return;

    try {
        projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Carregando projetos...</p>';
        const projects = await projectsService.fetchAll();

        projectsGrid.innerHTML = '';

        if (!projects.length) {
            projectsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">O banco está conectado, mas não há projetos.</p>';
            return;
        }

        projects.forEach((proj) => {
            const tagsArray = Array.isArray(proj.tags) ? proj.tags : [];
            const tagsHTML = tagsArray
                .map((tag) => `<span class="tag" style="background: var(--primary); color: #fff; border: none;">${tag}</span>`)
                .join('');

            const slug = (proj.title || 'projeto').toLowerCase().replace(/\s/g, '-');

            const cardHTML = `
                <div class="project-card-full reveal active" data-category="${proj.category || 'all'}" data-status="${proj.status || 'all'}">
                    <div class="terminal-mockup">
                        <div class="terminal-header">
                            <span class="dot close"></span><span class="dot minimize"></span><span class="dot expand"></span>
                        </div>
                        <div class="terminal-body">
                            <div class="cmd"><span class="prompt">~/projects/</span><span class="command">${slug}</span></div>
                            <div class="tech-list"># stack tecnológica: <br> ${tagsArray.join(' · ')}</div>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>${proj.title}</h3>
                        <div class="tags" style="margin-bottom: 15px; display: flex; gap: 5px; flex-wrap: wrap;">${tagsHTML}</div>
                        <p class="project-desc">${proj.description}</p>
                        <a href="${proj.repo_url || '#'}" target="_blank" class="btn-link-project">
                            <span data-i18n="proj_view">Ver Projeto</span> <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>`;

            projectsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        setupProjectFilterEventListeners();
        applyProjectFilters();
    } catch (error) {
        projectsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff4444;">Erro na API: ${error.message}</p>`;
    }
};

const loadBlogPosts = async () => {
    const blogContainer = document.getElementById('blog-container');
    const homeLatestPost = document.getElementById('home-latest-post');
    if (!blogContainer && !homeLatestPost) return;

    const renderHomeEmptyState = () => {
        if (homeLatestPost) {
            homeLatestPost.innerHTML = '<p class="exp-date" data-i18n="home_blog_empty">Ainda não existe nenhum post. O blog está em construção.</p>';
        }
    };

    try {
        if (blogContainer) {
            blogContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Carregando...</p>';
        }

        const posts = await postsService.fetchAll();

        if (blogContainer) {
            blogContainer.innerHTML = '';
        }

        if (!posts.length) {
            if (blogContainer) {
                blogContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Página em construção...</p>';
            }
            renderHomeEmptyState();
            return;
        }

        if (homeLatestPost) {
            const latest = posts[0];
            const displayDate = latest.date || 'Data não informada';
            homeLatestPost.innerHTML = `
                <h3 style="font-size: 1.1rem; color: var(--text-light);">${latest.title}</h3>
                <p class="exp-date">${displayDate}</p>
                <a href="${latest.url}" class="btn-link-project" target="_blank" rel="noopener">
                    <span>Ler post</span> <i class="fa-solid fa-arrow-right"></i>
                </a>
            `;
        }

        if (blogContainer) {
            posts.forEach((post) => {
                const displayDate = post.date || 'Data não informada';
                const tagsHTML = (post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('');

                const postHTML = `
                    <article class="blog-card reveal active" data-id="${post._id}">
                        <a href="${post.url}" class="blog-card-link">
                            <div class="blog-meta">
                                <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${displayDate}</span>
                            </div>
                            <h2 class="blog-title">${post.title}</h2>
                            <p class="blog-desc">${post.description}</p>
                            <div class="blog-footer-meta">
                                <div class="tags">${tagsHTML}</div>
                                <div class="blog-stats">
                                    <span><i class="fa-regular fa-clock"></i> ${post.read_time || '3 min'}</span>
                                    <span class="view-count"><i class="fa-regular fa-eye"></i> ${post.views || 0}</span>
                                </div>
                            </div>
                        </a>
                    </article>
                `;

                blogContainer.insertAdjacentHTML('beforeend', postHTML);
            });

            blogContainer.querySelectorAll('.blog-card-link').forEach((link) => {
                link.addEventListener('click', function () {
                    const card = this.closest('.blog-card');
                    const postId = card?.getAttribute('data-id');
                    if (!postId) return;

                    postsService.incrementView(postId);
                });
            });
        }
    } catch (error) {
        console.error('Erro ao carregar blog:', error);
        renderHomeEmptyState();
    }
};

const initBookFilters = () => {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    const filtersSection = booksGrid.closest('main')?.querySelector('.filters-section');
    if (!filtersSection || filtersSection.dataset.filtersReady === 'true') return;

    filtersSection.dataset.filtersReady = 'true';

    let activeCategory = 'all';
    let activeStatus = 'all';

    const applyFilters = () => {
        document.querySelectorAll('.book-card').forEach((card) => {
            const cardCategory = card.getAttribute('data-category') || 'all';
            const cardStatus = card.getAttribute('data-status') || 'all';
            const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
            const matchesStatus = activeStatus === 'all' || cardStatus === activeStatus;

            if (matchesCategory && matchesStatus) {
                card.style.display = 'block';
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                });
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    filtersSection.querySelectorAll('.filter-pill').forEach((pill) => {
        pill.addEventListener('click', (event) => {
            event.preventDefault();
            const group = pill.closest('.filter-group');
            if (!group) return;

            group.querySelectorAll('.filter-pill').forEach((btn) => btn.classList.remove('active'));
            pill.classList.add('active');

            const headingKey = group.querySelector('h4')?.getAttribute('data-i18n');
            const value = pill.getAttribute('data-filter') || 'all';

            if (headingKey === 'filter_cat') {
                activeCategory = value;
            } else {
                activeStatus = value;
            }

            applyFilters();
        });
    });

    applyFilters();
};

const loadBooks = async () => {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    try {
        booksGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Carregando estante...</p>';
        const books = await booksService.fetchAll();

        booksGrid.innerHTML = '';

        if (!books.length) {
            booksGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Nenhum livro cadastrado.</p>';
            initBookFilters();
            return;
        }

        books.forEach((book) => {
            const statusMap = {
                lido: { label: 'Lido', className: 'status-lido' },
                lendo: { label: 'Lendo', className: 'status-lendo' },
                quero: { label: 'Quero Ler', className: 'status-quero' }
            };

            const statusInfo = statusMap[book.status] || { label: book.status, className: '' };

            const bookHTML = `
                <div class="book-card card-animated" data-category="${book.category}" data-status="${book.status}">
                    <div class="book-cover">
                        <img src="${book.image}" alt="${book.title}">
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">${book.author}</p>
                        <div class="book-tags">
                            <span class="tag">${book.category}</span>
                            <span class="tag tag-status ${statusInfo.className}">${statusInfo.label}</span>
                        </div>
                        <a href="${book.amazon_link}" target="_blank" class="btn btn-outline book-btn">
                            <i class="fa-brands fa-amazon"></i> <span data-i18n="btn_amazon">Amazon</span>
                        </a>
                    </div>
                </div>
            `;

            booksGrid.insertAdjacentHTML('beforeend', bookHTML);
        });

        initBookFilters();
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        booksGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ff4444;">Erro ao carregar livros: ${error.message}</p>`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTranslations();
    initThemeToggle();
    initHeaderScroll();
    initMobileMenu();
    initScrollReveal();
    initExperienceAccordion();
    initContactForm();
    loadProjects();
    loadBlogPosts();
    loadBooks();
    analyticsService.trackVisit();
});