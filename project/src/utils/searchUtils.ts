import { Employee } from '../types/Employee';

// Fuzzy search function for job titles
export const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query.trim()) return true;
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase().trim();
  
  // Exact match
  if (textLower.includes(queryLower)) return true;
  
  // Simple fuzzy matching - allow for small typos
  const words = queryLower.split(' ');
  return words.every(word => {
    if (textLower.includes(word)) return true;
    
    // Check for similar words (allowing 1-2 character differences)
    const textWords = textLower.split(/\s+/);
    return textWords.some(textWord => {
      if (word.length <= 3) return textWord.includes(word) || word.includes(textWord);
      
      // Levenshtein-like simple check
      let differences = 0;
      const minLength = Math.min(word.length, textWord.length);
      const maxLength = Math.max(word.length, textWord.length);
      
      if (maxLength - minLength > 2) return false;
      
      for (let i = 0; i < minLength; i++) {
        if (word[i] !== textWord[i]) differences++;
        if (differences > 2) return false;
      }
      
      return differences + (maxLength - minLength) <= 2;
    });
  });
};

// Extract common keywords from job titles
export const extractJobTitleKeywords = (employees: Employee[]): string[] => {
  const wordCount = new Map<string, number>();
  
  employees.forEach(emp => {
    const words = emp.jobTitle
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
  });
  
  // Return words that appear at least 2 times, sorted by frequency
  return Array.from(wordCount.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 20); // Limit to top 20 keywords
};

export const findEmployeeHierarchy = (
  employees: Employee[],
  allEmployees: Employee[],
  searchQuery: string
): Employee[] => {
  if (!searchQuery.trim()) {
    return employees;
  }

  const query = searchQuery.toLowerCase().trim();
  
  // Find all employees that match the search query
  const matchingEmployees = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(query) ||
    emp.jobTitle.toLowerCase().includes(query) ||
    emp.department.toLowerCase().includes(query)
  );

  if (matchingEmployees.length === 0) {
    return [];
  }

  // For each matching employee, build their hierarchy path
  const hierarchyPaths = new Set<string>();
  
  matchingEmployees.forEach(matchedEmployee => {
    // Add the matched employee
    hierarchyPaths.add(matchedEmployee.name);
    
    // Add all managers above them
    let currentManager = matchedEmployee.manager;
    while (currentManager && currentManager.trim() !== '') {
      hierarchyPaths.add(currentManager);
      const managerEmployee = allEmployees.find(emp => emp.name === currentManager);
      currentManager = managerEmployee?.manager;
    }
    
    // Add all direct and indirect reports below them
    const addReports = (employee: Employee) => {
      const reports = allEmployees.filter(emp => emp.manager === employee.name);
      reports.forEach(report => {
        hierarchyPaths.add(report.name);
        addReports(report);
      });
    };
    
    addReports(matchedEmployee);
  });

  // Filter the hierarchy to only include employees in the paths
  const filterHierarchy = (emps: Employee[]): Employee[] => {
    return emps
      .filter(emp => hierarchyPaths.has(emp.name))
      .map(emp => ({
        ...emp,
        directReports: emp.directReports ? filterHierarchy(emp.directReports) : []
      }));
  };

  return filterHierarchy(employees);
};