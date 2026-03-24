const { Router } = require('express');
const pageContentService = require('../services/pageContentService');

const router = Router();

router.get('/', (req, res) => {
    res.render('index', pageContentService.getHomeViewModel());
});

router.get('/projetos', (req, res) => {
    res.render('projetos', pageContentService.getProjectsViewModel());
});

router.get('/livros', (req, res) => {
    res.render('livros', pageContentService.getBooksViewModel());
});

router.get('/blog', (req, res) => {
    res.render('blog', pageContentService.getBlogViewModel());
});

router.get('/blog/post', (req, res) => {
    res.render('post', pageContentService.getPostViewModel());
});

router.get('/contato', (req, res) => {
    res.render('contato', pageContentService.getContactViewModel());
});

module.exports = router;
