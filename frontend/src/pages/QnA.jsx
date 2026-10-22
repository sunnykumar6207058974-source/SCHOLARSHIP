import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, ThumbsUp, CheckCircle, Send, PlusCircle, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function QnA() {
  const { user, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ask Question Modal
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [qTitle, setQTitle] = useState('');
  const [qBody, setQBody] = useState('');
  const [qCategory, setQCategory] = useState('General');

  // Answer state
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadQuestions = () => {
    setLoading(true);
    api.content.getQnA()
      .then((res) => {
        if (res.success) setQuestions(res.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    if (!qTitle.trim() || !qBody.trim()) return;

    try {
      const res = await api.content.askQuestion({
        title: qTitle.trim(),
        body: qBody.trim(),
        category: qCategory
      });
      if (res.success) {
        setAskModalOpen(false);
        setQTitle('');
        setQBody('');
        loadQuestions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    if (!replyText.trim()) return;

    try {
      const res = await api.content.answerQuestion(questionId, replyText.trim());
      if (res.success) {
        setReplyingToId(null);
        setReplyText('');
        loadQuestions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 0 80px 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Community Discussion Forum
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '4px' }}>
              Scholarship Questions & Answers
            </h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.98rem' }}>
              Ask queries about income certificates, quotas, renewal processes, and receive verified counselor answers.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please sign in or register to post a question to the community.');
                return;
              }
              setAskModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={18} /> Ask a Question
          </button>
        </div>

        {/* Questions Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--slate-500)' }}>
            Loading community questions...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {questions.map((q) => (
              <div key={q.id} className="card" style={{ padding: '28px', border: '1.5px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="badge badge-category">{q.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>
                    Posted by {q.author_name}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px', lineHeight: 1.35 }}>
                  {q.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {q.body}
                </p>

                {/* Answers Thread */}
                {q.answers && q.answers.length > 0 && (
                  <div style={{ backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: '16px 20px', border: '1px solid var(--slate-200)', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                      Answers ({q.answers.length}):
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {q.answers.map((ans) => (
                        <div key={ans.id} style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '0.86rem', color: 'var(--primary-800)' }}>{ans.author_name}</strong>
                            {ans.is_official ? (
                              <span className="badge badge-live" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                ✓ Verified Counselor Answer
                              </span>
                            ) : null}
                          </div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
                            {ans.answer_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply action */}
                <div>
                  {replyingToId === q.id ? (
                    <div style={{ marginTop: '14px' }}>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Type your helpful answer or experience..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleAnswerSubmit(q.id)} className="btn btn-primary btn-sm">
                          Submit Answer
                        </button>
                        <button onClick={() => setReplyingToId(null)} className="btn btn-outline btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          alert('Please log in to answer community questions.');
                          return;
                        }
                        setReplyingToId(q.id);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={14} /> Answer this Question
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Ask Question Modal */}
      {askModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--white)', width: '100%', maxWidth: '540px', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                Ask the Student Community
              </h3>
              <button onClick={() => setAskModalOpen(false)} style={{ color: 'var(--slate-500)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAskSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value)}
                >
                  <option value="General">General Questions</option>
                  <option value="Eligibility Rules">Eligibility Rules</option>
                  <option value="Documentation">Documentation & Certificates</option>
                  <option value="NSP Portal">National Scholarship Portal (NSP)</option>
                  <option value="Interviews & SOP">Interviews & SOP Writing</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Question Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Can I apply for two scholarships in the same year?"
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Provide background context such as your course, marks, state, or specific scheme name..."
                  value={qBody}
                  onChange={(e) => setQBody(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" onClick={() => setAskModalOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
