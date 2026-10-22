const db = require('../config/db');
const { seedResults, seedVideos } = require('../database/seedData');

exports.getArticles = async (req, res) => {
  try {
    const { category, search } = req.query;
    let conditions = ['is_published = 1'];
    let params = [];

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search && search.trim()) {
      conditions.push('(title LIKE ? OR content LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM articles ${where} ORDER BY created_at DESC`;
    const { rows } = await db.query(sql, params);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving articles.' });
  }
};

exports.getArticleDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM articles WHERE slug = ? AND is_published = 1',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Related articles
    const article = rows[0];
    const { rows: related } = await db.query(
      'SELECT id, title, slug, category, read_time, image_url FROM articles WHERE id != ? LIMIT 3',
      [article.id]
    );
    article.related = related;

    res.json({ success: true, data: article });
  } catch (err) {
    console.error('Error fetching article detail:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving article.' });
  }
};

exports.getResults = async (req, res) => {
  try {
    res.json({ success: true, data: seedResults });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving results.' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    res.json({ success: true, data: seedVideos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving videos.' });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const sql = `
      SELECT q.*, u.name as author_name
      FROM questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `;
    const { rows: questions } = await db.query(sql);

    // Fetch answers for each question
    for (const q of questions) {
      const { rows: answers } = await db.query(
        `SELECT a.*, u.name as author_name, u.role as author_role
         FROM answers a
         JOIN users u ON a.user_id = u.id
         WHERE a.question_id = ?
         ORDER BY a.is_official DESC, a.created_at ASC`,
        [q.id]
      );
      q.answers = answers;
    }

    res.json({ success: true, data: questions });
  } catch (err) {
    console.error('Error fetching Q&A:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving community questions.' });
  }
};

exports.askQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, body, category } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Question title and description are required.' });
    }

    const insertRes = await db.query(
      'INSERT INTO questions (user_id, title, body, category, upvotes, answer_count) VALUES (?, ?, ?, ?, 0, 0)',
      [userId, title.trim(), body.trim(), category || 'General']
    );

    res.status(201).json({
      success: true,
      message: 'Question posted to community forum!',
      question_id: insertRes.insertId
    });
  } catch (err) {
    console.error('Error asking question:', err);
    res.status(500).json({ success: false, message: 'Server error posting question.' });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;
    const { answer_text } = req.body;

    if (!answer_text || !answer_text.trim()) {
      return res.status(400).json({ success: false, message: 'Answer text cannot be empty.' });
    }

    const isOfficial = req.user.role === 'admin' ? 1 : 0;

    await db.query(
      'INSERT INTO answers (question_id, user_id, answer_text, is_official) VALUES (?, ?, ?, ?)',
      [questionId, userId, answer_text.trim(), isOfficial]
    );

    await db.query('UPDATE questions SET answer_count = answer_count + 1 WHERE id = ?', [questionId]);

    res.status(201).json({ success: true, message: 'Your answer has been submitted.' });
  } catch (err) {
    console.error('Error submitting answer:', err);
    res.status(500).json({ success: false, message: 'Server error posting answer.' });
  }
};

exports.submitContact = async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const ticketNumber = 'TICK-' + Math.floor(100000 + Math.random() * 900000);

    res.json({
      success: true,
      ticket_number: ticketNumber,
      message: `Thank you, ${name}! Your inquiry (Ticket #${ticketNumber}) has been received. Our counselor team will respond to ${email} within 24-48 business hours.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error submitting contact inquiry.' });
  }
};
