const mongoose = require("mongoose");
const Article = require("../models/articleModel");

// GET /api/articles (Liste publique avec les infos de l'auteur)
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "name email");
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET /api/articles/:id (Détail d'un article)
const getArticleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Identifiant invalide" });
    }

    const article = await Article.findById(req.params.id).populate(
      "author",
      "name email",
    );

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST /api/articles (Création protégée)
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Titre et contenu obligatoires" });
    }

    // L'auteur vient du token vérifié : usurpation impossible
    const newArticle = await Article.create({
      title,
      content,
      author: req.user._id,
    });

    const populated = await newArticle.populate("author", "name email");
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// PUT /api/articles/:id (Modification protégée : auteur ou admin)
const updateArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Identifiant invalide" });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Action interdite : vous n'êtes pas l'auteur de cet article",
      });
    }

    // Seuls title et content sont modifiables (pas author)
    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;

    const updated = await article.save();
    const populated = await updated.populate("author", "name email");
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE /api/articles/:id (Suppression protégée : auteur ou admin)
const deleteArticle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Identifiant invalide" });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    if (
      article.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Action interdite : vous n'êtes pas l'auteur de cet article",
      });
    }

    await article.deleteOne();
    res
      .status(200)
      .json({ message: "Article supprimé avec succès", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id });
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles,
};
