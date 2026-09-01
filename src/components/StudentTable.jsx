import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

export const StudentTable = ({
  columns = [],
  data = [],
  searchPlaceholder = 'Search...',
  searchField = 'name',
  filterOptions = null, // { field: 'role', label: 'Role', options: [{value: '', label: ''}] }
  actions = null // Render function for actions column
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search check
      const query = searchQuery.toLowerCase();
      const valToSearch = item[searchField] ? String(item[searchField]).toLowerCase() : '';
      const matchesSearch = valToSearch.includes(query);

      // Filter check
      let matchesFilter = true;
      if (filterOptions && filterValue) {
        matchesFilter = String(item[filterOptions.field]) === filterValue;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchQuery, searchField, filterOptions, filterValue]);

  // Sort
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle undefined or null
        if (aVal === undefined || aVal === null) aVal = '';
        if (bVal === undefined || bVal === null) bVal = '';

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Paginate
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Table Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '350px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="dash-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {filterOptions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{filterOptions.label}:</span>
            <select
              className="dash-select"
              value={filterValue}
              onChange={(e) => { setFilterValue(e.target.value); setCurrentPage(1); }}
              style={{ width: 'auto', minWidth: '150px' }}
            >
              <option value="">All</option>
              {filterOptions.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div className="table-responsive" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--card-bg)' }}>
        {paginatedData.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-text">No records found matching criteria.</span>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && requestSort(col.key)}
                    style={{ cursor: col.sortable !== false ? 'pointer' : 'default', userSelect: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {col.title}
                      {col.sortable !== false && sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Pagination footer */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages} ({filteredData.length} records found)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="dash-btn dash-btn-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button
              className="dash-btn dash-btn-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
