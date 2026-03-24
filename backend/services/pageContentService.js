const path = require('path');
const config = require('../config/env');

const assetPath = (relativePath) => path.posix.join('/', relativePath).replace(/\\/g, '/');

const siteMeta = {
    brand: {
        symbol: '&gt;',
        cursor: '_'
    },
    language: {
        currentCode: 'BR',
        currentLabel: 'Português'
    },
    socialLinks: [
        { label: 'GitHub', icon: 'fa-brands fa-github', url: 'https://github.com/LucasFelipeMartins/LucasFelipeMartins' },
        { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', url: 'https://www.linkedin.com/in/lucas-felipe-martins-0a18412b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' }
    ],
    footer: {
        ownerName: 'Lucas Felipe',
        description: 'Engenheiro de Software apaixonado por tecnologia e arquitetura de sistemas.',
        copy: '© 2026 Lucas Felipe. Todos os direitos reservados.',
        columns: [
            {
                title: 'Explore',
                i18nKey: 'footer_explore',
                links: [
                    { href: '/', label: 'Início', dataKey: 'nav_home' },
                    { href: '/projetos', label: 'Projetos', dataKey: 'nav_projects' },
                    { href: '/blog', label: 'Blog', dataKey: 'nav_blog' },
                    { href: '/livros', label: 'Livros', dataKey: 'nav_livro' }
                ]
            },
            {
                title: 'Sobre',
                i18nKey: 'footer_about',
                links: [
                    { href: '/#inicio', label: 'Sobre mim', dataKey: 'footer_about_me' },
                    { href: '/#experiencia', label: 'Experiências', dataKey: 'exp_title' }
                ]
            },
            {
                title: 'Redes Sociais',
                i18nKey: 'footer_social',
                links: [
                    { href: 'https://github.com/LucasFelipeMartins/LucasFelipeMartins', label: 'Github' },
                    { href: 'https://www.linkedin.com/in/lucas-felipe-martins-0a18412b8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
                    { href: '/contato', label: 'Entrar em Contato', dataKey: 'btn_contact' }
                ]
            }
        ]
    }
};

const navLinks = [
    { key: 'home', href: '/', label: 'Início', i18nKey: 'nav_home' },
    { key: 'projects', href: '/projetos', label: 'Projetos', i18nKey: 'nav_projects' },
    { key: 'blog', href: '/blog', label: 'Blog', i18nKey: 'nav_blog' },
    { key: 'books', href: '/livros', label: 'Livros', i18nKey: 'nav_books' },
    { key: 'contact', href: '/contato', label: 'Contato', i18nKey: 'nav_contact' }
];

const getNavLinks = (activeKey) => navLinks.map((link) => ({
    ...link,
    isActive: link.key === activeKey
}));

const createBaseLayout = (pageTitle, activeNav, overrides = {}) => ({
    theme: 'dark',
    pageTitle,
    pageDescription: 'Portfólio profissional de Lucas Felipe.',
    brand: siteMeta.brand,
    language: siteMeta.language,
    socialLinks: siteMeta.socialLinks,
    footer: siteMeta.footer,
    navLinks: getNavLinks(activeNav),
    ...overrides
});

const getHeroContent = () => ({
    name: 'Lucas Felipe',
    description: 'Engenheiro de Software focado em criar soluções eficientes, escaláveis e com ótima arquitetura.',
    location: 'Rio Pomba, Brasil',
    cvPath: assetPath('assets/docs/cv-lucas-felipe.pdf'),
    cvFileName: 'cv-lucas-felipe.pdf',
    cvLabel: 'Baixar Currículo',
    contactCta: 'Entrar em Contato',
    avatar: assetPath('assets/img/avatar.jpeg')
});

const stats = [
    { value: '1+', i18nKey: 'stats_years', text: 'Anos de experiência em desenvolvimento de software' },
    { value: '3+', i18nKey: 'stats_projects', text: 'Projetos entregues com sucesso' },
    { value: '20k+', i18nKey: 'stats_users', text: 'Usuários impactados pelo meu trabalho' }
];

const experiences = [
    {
        isContentLeft: true,
        title: 'Frontend Developer',
        subtitle: 'Projeto Hamburgueria Web',
        titleKey: 'exp_1_title',
        subtitleKey: 'exp_1_desc',
        dateRange: '2025',
        duration: 'Projeto concluído',
        node: '<span>HB</span>',
        hasDetails: true,
        bullets: [
            'Desenvolvimento de uma aplicação web para uma hamburgueria moderna.',
            'Criação de interface responsiva e interativa utilizando HTML, CSS e JavaScript.',
            'Implementação de página de cadastro com validação de dados.',
            'Foco em usabilidade e experiência do usuário.'
        ],
        tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
        isContentRight: true,
        title: 'Fullstack Developer (Freelancer)',
        subtitle: 'Projeto Ateliê Artesanal',
        titleKey: 'exp_2_title',
        subtitleKey: 'exp_2_desc',
        dateRange: '2025 - atual',
        duration: 'Em andamento',
        node: '<span style="font-size: 0.65rem;">freelancer</span>',
        hasDetails: true,
        bullets: [
            'Desenvolvimento de uma loja virtual para ateliê de produtos artesanais.',
            'Implementação de sistema para gerenciamento de clientes e vendas.',
            'Criação de interface responsiva e personalizada de acordo com a identidade do ateliê.',
            'Estruturação do back-end para controle de pedidos e organização de dados.'
        ],
        tags: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB']
    },
    {
        isContentLeft: true,
        title: 'Full Stack Developer',
        subtitle: 'Projeto E-commerce de Roupas - Emcomp (IF Sudeste MG)',
        titleKey: 'exp_3_title',
        subtitleKey: 'exp_3_desc',
        dateRange: '2025 - atual',
        duration: 'Em andamento',
        node: '<i class="fa-solid fa-code" style="font-size: 0.9rem;"></i>',
        hasDetails: true,
        bullets: [
            'Desenvolvimento de uma loja virtual de roupas com foco em e-commerce.',
            'Criação de interfaces responsivas e escaláveis para web.',
            'Aplicação de boas práticas de UI/UX visando melhor experiência do usuário.',
            'Estruturação do projeto para futura integração com back-end.'
        ],
        tags: ['React.js', 'MongoDB', 'TypeScript', 'Node.js']
    },
];

const projectsPage = {
    breadcrumbHome: 'Início',
    title: 'Projetos',
    subtitle: 'Uma seleção de projetos que construí, desde aplicações full-stack até integrações e experimentos com diferentes tecnologias.',
    loadingText: 'Carregando projetos...'
};

const booksPage = {
    title: 'Livros',
    description: 'Eu não tinha o hábito de leitura e decidi mudar isso. Criei esse espaço pra compartilhar o que estou lendo e quero ler.',
    loadingText: 'Carregando estante de livros...'
};

const blogPage = {
    breadcrumb: 'Blog',
    title: 'Blog',
    subtitle: 'Reflexões, tutoriais e aprendizados de quem constrói software.',
    loadingText: 'Buscando artigos no banco de dados...'
};

const contactPage = {
    breadcrumb: 'Contato',
    title: 'Vamos conversar?',
    subtitle: 'Tem um projeto em mente ou só quer bater um papo? Adoraria ouvir você! Envie uma mensagem e responderei o mais breve possível.'
};

const postPage = {
    backLabel: 'Voltar para o Blog',
    title: 'Seu projeto realmente precisava de Next.js?',
    date: '28 de fevereiro de 2026',
    readTime: '3 min de leitura',
    shareLabel: 'Compartilhar este post'
};

const getHomeViewModel = () => createBaseLayout('Lucas Felipe - Portfólio', 'home', {
    hero: getHeroContent(),
    stats,
    experiences
});

const getProjectsViewModel = () => createBaseLayout('Projetos | Lucas Felipe', 'projects', {
    projectsPage
});

const getBooksViewModel = () => createBaseLayout('Livros | Lucas Felipe', 'books', {
    booksPage
});

const getBlogViewModel = () => createBaseLayout('Blog | Lucas Felipe', 'blog', {
    blogPage
});

const getPostViewModel = () => createBaseLayout('Seu projeto precisava de Next.js? | Blog', 'blog', {
    postPage
});

const getContactViewModel = () => createBaseLayout('Contato | Lucas Felipe', 'contact', {
    contactPage,
    security: {
        captchaSiteKey: config.security?.captcha?.siteKey || '',
        captchaEnabled: Boolean(config.security?.captcha?.siteKey)
    }
});

module.exports = {
    getHomeViewModel,
    getProjectsViewModel,
    getBooksViewModel,
    getBlogViewModel,
    getPostViewModel,
    getContactViewModel
};
