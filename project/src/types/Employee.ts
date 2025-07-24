export interface Employee {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  manager: string;
  office: string;
  sapUser: boolean;
  directReports?: Employee[];
}

export interface FilterState {
  office: string;
  department: string;
  manager: string;
  sapUser: string; // 'all' | 'true' | 'false'
  searchQuery: string;
  jobTitle: string;
  jobTitleMode: 'text' | 'keywords';
  jobTitleKeywords: string[];
}