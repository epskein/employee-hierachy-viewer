import React from 'react';
import { Filter, X, Type, Tag } from 'lucide-react';
import { FilterState } from '../types/Employee';
import { SearchBar } from './SearchBar';
import { extractJobTitleKeywords, fuzzyMatch } from '../utils/searchUtils';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  uniqueValues: {
    offices: string[];
    departments: string[];
    managers: string[];
  };
  allEmployees: any[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  uniqueValues,
  allEmployees
}) => {
  const hasActiveFilters = 
    filters.office !== '' ||
    filters.department !== '' ||
    filters.manager !== '' ||
    filters.sapUser !== 'all' ||
    filters.searchQuery !== '' ||
    filters.jobTitle !== '' ||
    filters.jobTitleKeywords.length > 0;

  const clearFilters = () => {
    onFilterChange({
      office: '',
      department: '',
      manager: '',
      sapUser: 'all',
      searchQuery: '',
      jobTitle: '',
      jobTitleMode: 'text',
      jobTitleKeywords: []
    });
  };

  const jobTitleKeywords = React.useMemo(() => {
    return extractJobTitleKeywords(allEmployees);
  }, [allEmployees]);

  const toggleKeyword = (keyword: string) => {
    const currentKeywords = filters.jobTitleKeywords;
    const newKeywords = currentKeywords.includes(keyword)
      ? currentKeywords.filter(k => k !== keyword)
      : [...currentKeywords, keyword];
    
    onFilterChange({ ...filters, jobTitleKeywords: newKeywords });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Employees</label>
        <SearchBar
          searchQuery={filters.searchQuery}
          onSearchChange={(query) => onFilterChange({ ...filters, searchQuery: query })}
          placeholder="Search by name, job title, or department..."
        />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Job Title Filter</label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFilterChange({ ...filters, jobTitleMode: 'text', jobTitleKeywords: [] })}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.jobTitleMode === 'text'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Type className="w-3 h-3" />
              <span>Text</span>
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, jobTitleMode: 'keywords', jobTitle: '' })}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.jobTitleMode === 'keywords'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Keywords</span>
            </button>
          </div>
        </div>
        
        {filters.jobTitleMode === 'text' ? (
          <input
            type="text"
            value={filters.jobTitle}
            onChange={(e) => onFilterChange({ ...filters, jobTitle: e.target.value })}
            placeholder="Search job titles (supports fuzzy matching)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {jobTitleKeywords.map(keyword => (
                <button
                  key={keyword}
                  onClick={() => toggleKeyword(keyword)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                    filters.jobTitleKeywords.includes(keyword)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {keyword}
                </button>
              ))}
            </div>
            {filters.jobTitleKeywords.length > 0 && (
              <div className="text-xs text-gray-600">
                Selected: {filters.jobTitleKeywords.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Office</label>
          <select
            value={filters.office}
            onChange={(e) => onFilterChange({ ...filters, office: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Offices</option>
            {uniqueValues.offices.map(office => (
              <option key={office} value={office}>{office}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {uniqueValues.departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
          <select
            value={filters.manager}
            onChange={(e) => onFilterChange({ ...filters, manager: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Managers</option>
            {uniqueValues.managers.map(manager => (
              <option key={manager} value={manager}>{manager}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SAP User</label>
          <select
            value={filters.sapUser}
            onChange={(e) => onFilterChange({ ...filters, sapUser: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="true">SAP Users Only</option>
            <option value="false">Non-SAP Users</option>
          </select>
        </div>
      </div>
    </div>
  );
};