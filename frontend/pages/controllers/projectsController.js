import { projectsService } from '../../services/projectsService.js';

const filterState = {
    category: 'all',
    status: 'all'
};

const createProjectCard = (project) => {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    const tagsHtml = tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
    const slug = (project.title || 'projeto').toLowerCase().replace(/\s+/g, '-');

    return `
        <div class="project-card-full reveal active" data-category="${project.category || 'all'}" data-status="${project.status || 'all'}">
            <div class="terminal-mockup">
                <div class="terminal-header">
                    <span class="dot close"></span><span class="dot minimize"></span><span class="dot expand"></span>
                </div>
                <div class="terminal-body">
                    <div class="cmd"><span class="prompt">~/projects/</span><span class="command">${slug}</span></div>
                    <div class="tech-list"># stack tecnológica: <br> ${tags.join(' · ')}</div>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <div class="tags" style="margin-bottom: 15px; display:flex; gap:5px; flex-wrap:wrap;">${tagsHtml}</div>
                <p class="project-desc">${project.description || ''}</p>
                <a href="${project.repo_url || '#'}" target="_blank" class="btn-link-project">
                    <span data-i18n="proj_view">Ver Projeto</span> <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
};

const applyFilters = () => {
    document.querySelectorAll('.project-card-full').forEach((card) => {
        const matchesCategory = filterState.category === 'all' || card.dataset.category === filterState.category;
        const matchesStatus = filterState.status === 'all' || card.dataset.status === filterState.status;
        card.style.display = matchesCategory && matchesStatus ? 'flex' : 'none';
    });
};

const bindFilters = () => {
    const filtersSection = document.querySelector('.filters-section');
    if (!filtersSection) return;

    filtersSection.querySelectorAll('.filter-pill').forEach((pill) => {
        pill.addEventListener('click', (event) => {
            event.preventDefault();
            const group = pill.closest('.filter-group');
            group?.querySelectorAll('.filter-pill').forEach((el) => el.classList.remove('active'));
            pill.classList.add('active');

            const value = pill.getAttribute('data-filter');
            const titleKey = group?.querySelector('h4')?.getAttribute('data-i18n');
            if (titleKey === 'side_cat') {
                filterState.category = value;
            } else {
                filterState.status = value;
            }

            applyFilters();
        });
    });
};

export const initProjectsPage = async () => {
    const projectsGrid = document.getElementById('projects-grid-main');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted); padding: 40px;">Carregando projetos...</p>';

    try {
        const projects = await projectsService.fetchAll();
        if (!projects.length) {
            projectsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted); padding: 40px;">O banco está conectado, mas não há projetos.</p>';
            return;
        }

        projectsGrid.innerHTML = projects.map(createProjectCard).join('');
        bindFilters();
    } catch (error) {
        projectsGrid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: #ff5555; padding: 40px;">Erro ao carregar projetos: ${error.message}</p>`;
    }
};
