import { booksService } from '../../services/booksService.js';

const filters = {
    category: 'all',
    status: 'all'
};

const statusMap = {
    lido: { label: 'Lido', className: 'status-lido' },
    lendo: { label: 'Lendo', className: 'status-lendo' },
    quero: { label: 'Quero Ler', className: 'status-quero' }
};

const createBookCard = (book) => {
    const statusInfo = statusMap[book.status] || { label: book.status || '—', className: '' };
    return `
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
};

const applyBookFilters = () => {
    document.querySelectorAll('.book-card').forEach((card) => {
        const matchesCategory = filters.category === 'all' || card.dataset.category === filters.category;
        const matchesStatus = filters.status === 'all' || card.dataset.status === filters.status;
        card.style.display = matchesCategory && matchesStatus ? 'block' : 'none';
    });
};

const bindBookFilters = () => {
    const filterGroups = document.querySelectorAll('.filters-section .filter-group');

    filterGroups.forEach((group) => {
        group.querySelectorAll('.filter-pill').forEach((pill) => {
            pill.addEventListener('click', () => {
                group.querySelectorAll('.filter-pill').forEach((btn) => btn.classList.remove('active'));
                pill.classList.add('active');

                const filterKey = group.querySelector('h4')?.getAttribute('data-i18n');
                const value = pill.dataset.filter;
                if (filterKey === 'filter_cat') {
                    filters.category = value;
                } else {
                    filters.status = value;
                }
                applyBookFilters();
            });
        });
    });
};

export const initBooksPage = async () => {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;

    booksGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 40px; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p>Carregando estante de livros...</p></div>';

    try {
        const books = await booksService.fetchAll();
        if (!books.length) {
            booksGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted); padding: 40px;">Nenhum livro cadastrado.</p>';
            return;
        }

        booksGrid.innerHTML = books.map(createBookCard).join('');
        bindBookFilters();
    } catch (error) {
        booksGrid.innerHTML = `<p style=\"text-align: center; grid-column: 1/-1; color: #ff5555; padding: 40px;\">Erro ao carregar livros: ${error.message}</p>`;
    }
};
