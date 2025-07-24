import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User, Shield } from 'lucide-react';
import { Employee } from '../types/Employee';

interface EmployeeCardProps {
  employee: Employee;
  level: number;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDirectReports = employee.directReports && employee.directReports.length > 0;

  const toggleExpanded = () => {
    if (hasDirectReports) {
      setIsExpanded(!isExpanded);
    }
  };

  const marginLeft = level * 20;

  return (
    <div className="mb-2" style={{ marginLeft: `${marginLeft}px` }}>
      <div 
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200 hover:shadow-md ${
          hasDirectReports ? 'cursor-pointer' : ''
        }`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center space-x-2">
              {hasDirectReports ? (
                isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
              <div className="p-2 bg-blue-50 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-lg font-medium text-gray-900 truncate">
                  {employee.name}
                </h4>
                {employee.sapUser && (
                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    <span>SAP User</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-blue-600 font-medium mb-1">
                {employee.jobTitle}
              </p>
              
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {employee.department}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {employee.office}
                </span>
                {employee.manager && employee.manager.trim() !== '' && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    Reports to: {employee.manager}
                  </span>
                )}
              </div>
            </div>
            
            {hasDirectReports && (
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {employee.directReports!.length} report{employee.directReports!.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && hasDirectReports && (
        <div className="mt-2 space-y-2">
          {employee.directReports!.map((report) => (
            <EmployeeCard
              key={report.id}
              employee={report}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};