import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Award,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import ScholarshipCard from '../components/ScholarshipCard';
import ApplyModal from '../components/ApplyModal';
import { api } from '../services/api';

export default function Scholarships() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filters from URL params
  const initialTab = searchParams.get('tab') || 'live';
  const initialSearch = searchParams.get('search') || '';
  const initialEducation = searchParams.get('education_level') || '';
  const initialState = searchParams.get('state') || '';
  const initialType = searchParams.get('scholarship_type') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialGender = searchParams.get('gender') || '';
  const initialMinMarks = searchParams.get('min_marks') || '';
  const initialMaxIncome = searchParams.get('max_income') || '';
  const initialSort = searchParams.get('sort') || 'deadline';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [filters, setFilters] = useState({
    tab: initialTab,
    search: initialSearch,
    education_level: initialEducation,
    state: initialState,
    scholarship_type: initialType,
    category: initialCategory,
    gender: initialGender,
    min_marks: initialMinMarks,
    max_income: initialMaxIncome,
    sort: initialSort,
    page: initialPage,
    limit: 9
  });

  const [scholarships, setScholarships] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply Modal state
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Fetch scholarships when filters change
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Sync to URL query parameters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        params.set(key, val);
      }
    });
    setSearchParams(params, { replace: true });

    api.scholarships.getAll(filters)
      .then((res) => {
        if (res.success) {
          setScholarships(res.data);
          setPagination(res.pagination);
        } else {
          setError(res.message || 'Failed to load scholarships');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message || 'Unable to connect to scholarship server.');
      })
      .finally(() => setLoading(false));
  }, [filters]);

  const handleTabChange = (tabName) => {
    setFilters((prev) => ({ ...prev, tab: tabName, page: 1 }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      tab: 'live',
      search: '',
      education_level: '',
      state: '',
      scholarship_type: '',
      category: '',
      gender: '',
      min_marks: '',
      max_income: '',
      sort: 'deadline',
      page: 1,
      limit: 9
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenApply = (sch) => {
    setSelectedScholarship(sch);
    setApplyModalOpen(true);
  };

  // Count active filter tags
  const activeFilterTags = [];
  if (filters.search) activeFilterTags.push({ key: 'search', label: `Search: "${filters.search}"` });
  if (filters.education_level && filters.education_level !== 'All') activeFilterTags.push({ key: 'education_level', label: `Level: ${filters.education_level}` });
  if (filters.state && filters.state !== 'All India') activeFilterTags.push({ key: 'state', label: `State: ${filters.state}` });
  if (filters.scholarship_type && filters.scholarship_type !== 'All') activeFilterTags.push({ key: 'scholarship_type', label: `Type: ${filters.scholarship_type}` });
  if (filters.category && filters.category !== 'All') activeFilterTags.push({ key: 'category', label: `Category: ${filters.category}` });
  if (filters.gender && filters.gender !== 'All') activeFilterTags.push({ key: 'gender', label: `Gender: ${filters.gender}` });
  if (filters.min_marks) activeFilterTags.push({ key: 'min_marks', label: `Min ${filters.min_marks}% Marks` });
  if (filters.max_income) activeFilterTags.push({ key: 'max_income', label: `Max ₹${parseInt(filters.max_income, 10).toLocaleString('en-IN')}` });

  const removeFilterTag = (key) => {
    setFilters((prev) => ({ ...prev, [key]: '', page: 1 }));
  };

  return (
    <div style={{ padding: '40px 0 70px 0', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Page Title & Breadcrumbs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--slate-500)', marginBottom: '6px' }}>
            Home / Scholarships
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-800)', letterSpacing: '-0.02em' }}>
            Discover Scholarships & Grants in India 2026
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.96rem', marginTop: '4px' }}>
            Browse verified corporate CSR initiatives, central & state government grants, and international fellowships.
          </p>
        </div>

        {/* Tab Navigation: Live / Upcoming / Always Open / All */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--slate-200)',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'live', label: 'Live Scholarships' },
              { id: 'upcoming', label: 'Upcoming Schemes' },
              { id: 'always_open', label: 'Always Open / Rolling' },
              { id: 'all', label: 'All Schemes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  padding: '12px 18px',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  color: filters.tab === tab.id ? 'var(--primary-700)' : 'var(--slate-500)',
                  borderBottom: filters.tab === tab.id ? '3px solid var(--accent-orange)' : '3px solid transparent',
                  marginBottom: '-2px',
                  transition: 'all 0.2s',
                  background: 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="mobile-filter-btn" style={{ display: 'none' }}>
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <SlidersHorizontal size={15} /> Filters {activeFilterTags.length > 0 && `(${activeFilterTags.length})`}
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterTags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', padding: '12px 16px', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
              Active Filters:
            </span>
            {activeFilterTags.map((tag) => (
              <span
                key={tag.key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-700)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid var(--primary-100)'
                }}
              >
                {tag.label}
                <button onClick={() => removeFilterTag(tag.key)} style={{ color: 'var(--primary-700)', display: 'flex', alignItems: 'center' }}>
                  <X size={13} />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.82rem', color: 'var(--accent-orange)', fontWeight: 600, background: 'none', border: 'none', marginLeft: 'auto', cursor: 'pointer' }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'start' }} className="scholarships-layout">
          
          {/* Desktop Filter Sidebar */}
          <div className="sidebar-container">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              totalCount={pagination.total}
            />
          </div>

          {/* Listings Container */}
          <div>
            
            {/* Results Count & Sorting Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px 18px',
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--slate-200)'
            }}>
              <div>
                <span style={{ fontSize: '0.92rem', color: 'var(--slate-600)' }}>
                  Showing <strong style={{ color: 'var(--primary-800)' }}>{pagination.total}</strong> scholarships
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--slate-600)', fontWeight: 500 }}>Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--slate-300)',
                    fontSize: '0.86rem',
                    color: 'var(--slate-800)',
                    outline: 'none',
                    backgroundColor: 'var(--white)'
                  }}
                >
                  <option value="deadline">Deadline: Nearest First</option>
                  <option value="award_high">Award Amount: High to Low</option>
                  <option value="newest">Recently Added</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={{ height: '360px', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--slate-200)', animation: 'pulse 1.2s infinite' }} />
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div style={{ backgroundColor: 'var(--accent-rose-light)', border: '1px solid var(--accent-rose-border)', borderRadius: 'var(--radius-lg)', padding: '36px', textAlign: 'center' }}>
                <AlertCircle size={40} color="var(--accent-rose)" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-rose)', marginBottom: '8px' }}>
                  {error}
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Please verify that the backend API server is running on port 5001.
                </p>
                <button onClick={() => setFilters({ ...filters })} className="btn btn-navy">
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && scholarships.length === 0 && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--slate-200)', padding: '60px 30px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--slate-100)', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto' }}>
                  <Search size={30} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-800)', fontWeight: 700, marginBottom: '8px' }}>
                  No Scholarships Match Your Current Filters
                </h3>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 24px auto' }}>
                  Try relaxing your criteria by choosing "All Education Levels", widening income limits, or clearing search keywords.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            )}

            {/* Scholarships Grid */}
            {!loading && !error && scholarships.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '22px'
              }}>
                {scholarships.map((sch) => (
                  <ScholarshipCard
                    key={sch.id}
                    scholarship={sch}
                    onApply={handleOpenApply}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '40px'
              }}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-outline btn-sm"
                  style={{ opacity: pagination.page <= 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => handlePageChange(pg)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: pagination.page === pg ? '2px solid var(--primary-700)' : '1px solid var(--slate-300)',
                      backgroundColor: pagination.page === pg ? 'var(--primary-700)' : 'var(--white)',
                      color: pagination.page === pg ? 'var(--white)' : 'var(--slate-700)',
                      cursor: 'pointer'
                    }}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-outline btn-sm"
                  style={{ opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Application Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        scholarship={selectedScholarship}
      />

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .scholarships-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: block !important;
          }
          .sidebar-container {
            display: ${mobileFilterOpen ? 'block' : 'none'};
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
