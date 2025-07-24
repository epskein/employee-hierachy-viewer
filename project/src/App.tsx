import React, { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { FilterPanel } from './components/FilterPanel';
import { EmployeeHierarchy } from './components/EmployeeHierarchy';
import { parseExcelFile } from './utils/excelParser';
import { buildHierarchy } from './utils/hierarchyBuilder';
import { Employee, FilterState } from './types/Employee';
import { Building2, AlertCircle } from 'lucide-react';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [hierarchyData, setHierarchyData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    office: '',
    department: '',
    manager: '',
    sapUser: 'all',
    searchQuery: '',
    jobTitle: '',
    jobTitleMode: 'text',
    jobTitleKeywords: []
  });

  const uniqueValues = useMemo(() => {
    const offices = [...new Set(employees.map(emp => emp.office).filter(Boolean))].sort();
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))].sort();
    const managers = [...new Set(employees.map(emp => emp.manager).filter(Boolean))].sort();
    
    return { offices, departments, managers };
  }, [employees]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedEmployees = await parseExcelFile(file);
      const hierarchy = buildHierarchy(parsedEmployees);
      
      setEmployees(parsedEmployees);
      setHierarchyData(hierarchy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Polyoak Employee Hierarchy Viewer</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your employee data and explore your organization's structure with interactive filtering and hierarchy visualization.
          </p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {employees.length > 0 && (
          <>
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              uniqueValues={uniqueValues}
              allEmployees={employees}
            />
            
            <EmployeeHierarchy
              employees={hierarchyData}
              allEmployees={employees}
              filters={filters}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;