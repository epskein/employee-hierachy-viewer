import { Employee } from '../types/Employee';

export const buildHierarchy = (employees: Employee[]): Employee[] => {
  // Create a map for quick employee lookup
  const employeeMap = new Map<string, Employee>();
  employees.forEach(emp => {
    employeeMap.set(emp.name, { ...emp, directReports: [] });
  });

  const rootEmployees: Employee[] = [];

  employees.forEach(emp => {
    const employee = employeeMap.get(emp.name)!;
    
    if (emp.manager && emp.manager.trim() !== '' && employeeMap.has(emp.manager)) {
      // Employee has a manager, add to manager's direct reports
      const manager = employeeMap.get(emp.manager)!;
      if (!manager.directReports) {
        manager.directReports = [];
      }
      manager.directReports.push(employee);
    } else {
      // Employee has no manager or manager not found, add to root
      rootEmployees.push(employee);
    }
  });

  return rootEmployees;
};