import { postsService } from '../../services/postsService.js';

const createBlogCard = (post) => {
    const tags = (post.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('');
    const displayDate = post.date || 'Data não informada';

    return `
        <article class="blog-card reveal active" data-id="${post._id}">
            <a href="${post.url}" class="blog-card-link">
                <div class="blog-meta">
                    <span class="blog-date"><i class="fa-regular fa-calendar"></i> ${displayDate}</span>
                </div>
                <h2 class="blog-title">${post.title}</h2>
                <p class="blog-desc">${post.description || ''}</p>
                <div class="blog-footer-meta">
                    <div class="tags">${tags}</div>
                    <div class="blog-stats">
                        <span><i class="fa-regular fa-clock"></i> ${post.read_time || '3 min'}</span>
                        <span class="view-count"><i class="fa-regular fa-eye"></i> ${post.views || 0}</span>
                    </div>
                </div>
            </a>
        </article>
    `;
};

const bindViewTracking = () => {
    document.querySelectorAll('.blog-card-link').forEach((link) => {
        link.addEventListener('click', () => {
            const card = link.closest('.blog-card');
            const postId = card?.dataset.id;
            if (postId) {
                postsService.incrementView(postId);
            }
        });
    });
};

export const initBlogPage = async () => {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    try {
        const posts = await postsService.fetchAll();
        if (!posts.length) {
            blogContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Pagina em Construção...</p>';
            return;
        }

        blogContainer.innerHTML = posts.map(createBlogCard).join('');
        bindViewTracking();
    } catch (error) {
        blogContainer.innerHTML = `<p style=\"text-align: center; color: #ff5555;\">Erro ao carregar posts: ${error.message}</p>`;
    }
};
