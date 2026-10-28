
const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const { protect } = require("../config/middlewares/authMiddleware");

// Remarque capitale : le préfixe '/api/articles' sera défini dans server.js.
// Ici, '/' représente donc la racine de la ressource : '/api/articles' !

router.get('/', articleController.getAllArticles);

router.get("/my-articles", protect, articleController.getMyArticles);

router.get('/:id', articleController.getArticleById);

router.post('/', protect, articleController.createArticle);

router.put('/:id', protect, articleController.updateArticle);

router.delete('/:id', protect, articleController.deleteArticle);

module.exports = router;
