import * as XLSX from 'xlsx';
import { Employee } from '../types/Employee';

export const parseExcelFile = (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const employees: Employee[] = jsonData.map((row: any, index: number) => ({
          id: `emp_${index}`,
          name: row.Name || row.name || '',
          department: row.Department || row.department || '',
          jobTitle: row['Job Title'] || row.jobTitle || row['Job_Title'] || '',
          manager: row.Manager || row.manager || '',
          office: row.Office || row.office || '',
          sapUser: String(row['SAP User'] || row.sapUser || row['SAP_User'] || '').toLowerCase() === 'true'
        }));
        
        resolve(employees);
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please ensure it contains the required columns.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};