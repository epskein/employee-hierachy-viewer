import React, { useMemo } from 'react';
import { EmployeeCard } from './EmployeeCard';
import { Employee, FilterState } from '../types/Employee';
import { findEmployeeHierarchy, fuzzyMatch } from '../utils/searchUtils';
import { Users } from 'lucide-react';

interface EmployeeHierarchyProps {
  employees: Employee[];
  allEmployees: Employee[];
  filters: FilterState;
}

export const EmployeeHierarchy: React.FC<EmployeeHierarchyProps> = ({ employees, allEmployees, filters }) => {
  const filteredEmployees = useMemo(() => {
    // First apply search if there's a search query
    let searchFilteredEmployees = employees;
    if (filters.searchQuery.trim()) {
      searchFilteredEmployees = findEmployeeHierarchy(employees, allEmployees, filters.searchQuery);
    }
    
    const filterEmployee = (employee: Employee): Employee | null => {
      // Check if employee matches filters
      const matchesOffice = !filters.office || employee.office === filters.office;
      const matchesDepartment = !filters.department || employee.department === filters.department;
      const matchesManager = !filters.manager || employee.manager === filters.manager;
      const matchesSapUser = filters.sapUser === 'all' || 
        (filters.sapUser === 'true' && employee.sapUser) ||
        (filters.sapUser === 'false' && !employee.sapUser);
      
      // Job title filtering
      let matchesJobTitle = true;
      if (filters.jobTitleMode === 'text' && filters.jobTitle.trim()) {
        matchesJobTitle = fuzzyMatch(employee.jobTitle, filters.jobTitle);
      } else if (filters.jobTitleMode === 'keywords' && filters.jobTitleKeywords.length > 0) {
        const jobTitleLower = employee.jobTitle.toLowerCase();
        matchesJobTitle = filters.jobTitleKeywords.every(keyword => 
          jobTitleLower.includes(keyword.toLowerCase())
        );
      }
      
      const employeeMatches = matchesOffice && matchesDepartment && matchesManager && matchesSapUser && matchesJobTitle;
      
      // Filter direct reports recursively
      const filteredReports = employee.directReports?.map(filterEmployee).filter(Boolean) as Employee[] || [];
      
      // Include employee if they match filters OR if they have filtered direct reports
      if (employeeMatches || filteredReports.length > 0) {
        return {
          ...employee,
          directReports: filteredReports
        };
      }
      
      return null;
    };
    
    return searchFilteredEmployees.map(filterEmployee).filter(Boolean) as Employee[];
  }, [employees, allEmployees, filters]);

  const totalEmployees = useMemo(() => {
    const countEmployees = (emps: Employee[]): number => {
      return emps.reduce((count, emp) => {
        return count + 1 + (emp.directReports ? countEmployees(emp.directReports) : 0);
      }, 0);
    };
    return countEmployees(filteredEmployees);
  }, [filteredEmployees]);

  if (filteredEmployees.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
        <p className="text-gray-600">Try adjusting your filters or upload employee data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Employee Hierarchy</h2>
        <div className="text-sm text-gray-600">
          Showing {totalEmployees} employee{totalEmployees !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};