import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200 bg-white shadow-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <FileSpreadsheet className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Employee Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload an Excel file with columns: Name, Department, Job Title, Manager, Office, SAP User
            </p>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? 'Processing...' : 'Choose File'}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};