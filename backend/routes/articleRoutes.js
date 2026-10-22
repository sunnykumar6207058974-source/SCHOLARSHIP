const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateToken, optionalToken } = require('../middleware/auth');

router.get('/articles', articleController.getArticles);
router.get('/articles/:slug', articleController.getArticleDetail);
router.get('/results', articleController.getResults);
router.get('/videos', articleController.getVideos);
router.get('/qna', articleController.getQuestions);
router.post('/qna/ask', authenticateToken, articleController.askQuestion);
router.post('/qna/:id/answer', authenticateToken, articleController.answerQuestion);
router.post('/contact', articleController.submitContact);

module.exports = router;
