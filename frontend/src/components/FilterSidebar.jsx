import React from 'react';
import { Filter, RotateCcw, Search, ChevronRight } from 'lucide-react';

export default function FilterSidebar({ filters, setFilters, onReset, totalCount }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const educationLevels = [
    'All',
    'Class 1-10',
    'Class 11-12',
    'Graduation',
    'Post-Graduation',
    'Diploma',
    'PhD'
  ];

  const scholarshipTypes = [
    'All',
    'Corporate/CSR',
    'Government',
    'Private/NGO',
    'International'
  ];

  const states = [
    'All India',
    'Maharashtra',
    'Uttar Pradesh',
    'Karnataka',
    'Gujarat',
    'Bihar',
    'West Bengal',
    'Tamil Nadu',
    'Rajasthan',
    'Madhya Pradesh',
    'Andhra Pradesh',
    'Delhi'
  ];

  const incomeLimits = [
    { label: 'Any Income', value: '' },
    { label: 'Up to ₹2.5 Lakh', value: '250000' },
    { label: 'Up to ₹5.0 Lakh', value: '500000' },
    { label: 'Up to ₹8.0 Lakh', value: '800000' },
    { label: 'Up to ₹12.0 Lakh', value: '1200000' }
  ];

  const marksOptions = [
    { label: 'Any Percentage', value: '' },
    { label: 'Minimum 50% and above', value: '50' },
    { label: 'Minimum 60% and above', value: '60' },
    { label: 'Minimum 75% and above', value: '75' },
    { label: 'Minimum 85% and above', value: '85' }
  ];

  return (
    <aside style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--slate-200)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1.5px solid var(--slate-100)', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--primary-700)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-800)' }}>Filters</h3>
        </div>

        <button
          onClick={onReset}
          style={{
            fontSize: '0.82rem',
            color: 'var(--accent-orange)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={13} /> Reset All
        </button>
      </div>

      {/* Keyword Search */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>Keyword Search</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="e.g. Tata, Reliance, MBBS..."
            style={{ paddingLeft: '34px', fontSize: '0.88rem' }}
          />
          <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Education Level */}
      <div className="form-group" style={{ marginBottom: '22px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>Education Level</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {educationLevels.map((lvl) => (
            <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--slate-700)', cursor: 'pointer' }}>
              <input
                type="radio"
                name="education_level"
                checked={(filters.education_level || 'All') === lvl}
                onChange={() => handleChange('education_level', lvl)}
                style={{ accentColor: 'var(--primary-600)', width: '15px', height: '15px' }}
              />
              {lvl === 'All' ? 'All Education Levels' : lvl}
            </label>
          ))}
        </div>
      </div>

      {/* State / Domicile */}
      <div className="form-group" style={{ marginBottom: '22px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>State of Domicile</label>
        <select
          className="form-select"
          value={filters.state || 'All India'}
          onChange={(e) => handleChange('state', e.target.value)}
          style={{ fontSize: '0.88rem' }}
        >
          {states.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Gender Eligibility */}
      <div className="form-group" style={{ marginBottom: '22px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>Gender</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Female', 'Male'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleChange('gender', g)}
              style={{
                flex: 1,
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: (filters.gender || 'All') === g ? '1.5px solid var(--primary-600)' : '1px solid var(--slate-300)',
                backgroundColor: (filters.gender || 'All') === g ? 'var(--primary-50)' : 'var(--white)',
                color: (filters.gender || 'All') === g ? 'var(--primary-700)' : 'var(--slate-600)',
                transition: 'all 0.15s'
              }}
            >
              {g === 'All' ? 'Any' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarship Type */}
      <div className="form-group" style={{ marginBottom: '22px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>Scholarship Type</label>
        <select
          className="form-select"
          value={filters.scholarship_type || 'All'}
          onChange={(e) => handleChange('scholarship_type', e.target.value)}
          style={{ fontSize: '0.88rem' }}
        >
          {scholarshipTypes.map((type) => (
            <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
          ))}
        </select>
      </div>

      {/* Minimum Academic Percentage */}
      <div className="form-group" style={{ marginBottom: '22px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>Academic Performance</label>
        <select
          className="form-select"
          value={filters.min_marks || ''}
          onChange={(e) => handleChange('min_marks', e.target.value)}
          style={{ fontSize: '0.88rem' }}
        >
          {marksOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Family Income Limit */}
      <div className="form-group" style={{ marginBottom: '10px' }}>
        <label className="form-label" style={{ fontSize: '0.84rem' }}>Maximum Family Income</label>
        <select
          className="form-select"
          value={filters.max_income || ''}
          onChange={(e) => handleChange('max_income', e.target.value)}
          style={{ fontSize: '0.88rem' }}
        >
          {incomeLimits.map((inc) => (
            <option key={inc.value} value={inc.value}>{inc.label}</option>
          ))}
        </select>
      </div>

    </aside>
  );
}
