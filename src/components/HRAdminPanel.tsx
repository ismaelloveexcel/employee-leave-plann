import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Download,
  Users,
  Clock,
  Cloud,
  Database
} from 'lucide-react';
import { Employee } from '@/lib/types';
import { 
  parseExcelRowToEmployee, 
  generateLeave2025Records,
  dataSyncService 
} from '@/lib/data-sync-service';

interface HRAdminPanelProps {
  onEmployeesUpdated?: (employees: Employee[]) => void;
  currentEmployees?: Employee[];
}

export function HRAdminPanel({ onEmployeesUpdated, currentEmployees = [] }: HRAdminPanelProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<number>(currentEmployees.length);
  const [syncStatus, setSyncStatus] = useState(dataSyncService.getSyncStatus());
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Parse CSV content
  const parseCSV = useCallback((content: string): Record<string, unknown>[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows: Record<string, unknown>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
    
    return rows;
  }, []);
  
  // Handle file upload
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadStatus('processing');
    setUploadMessage('Processing file...');
    
    try {
      const content = await file.text();
      let rows: Record<string, unknown>[] = [];
      
      // Detect file type
      if (file.name.endsWith('.csv')) {
        rows = parseCSV(content);
      } else if (file.name.endsWith('.json')) {
        rows = JSON.parse(content);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }
      
      // Parse employees
      const employees: Employee[] = [];
      const errors: string[] = [];
      
      rows.forEach((row, index) => {
        const employee = parseExcelRowToEmployee(row);
        if (employee) {
          // Generate 2025 leave records
          employee.leave2025Confirmation = {
            employeeId: employee.employeeId,
            status: 'pending',
            records: generateLeave2025Records(employee),
          };
          employees.push(employee);
        } else {
          errors.push(`Row ${index + 2}: Failed to parse`);
        }
      });
      
      if (employees.length === 0) {
        throw new Error('No valid employees found in file');
      }
      
      // Save to local storage and sync
      const result = await dataSyncService.uploadToRemote(employees);
      
      setEmployeeCount(employees.length);
      setUploadStatus('success');
      setUploadMessage(
        `Successfully imported ${employees.length} employees. ` +
        (errors.length > 0 ? `${errors.length} rows skipped.` : '') +
        ` ${result.message}`
      );
      
      // Create audit record
      dataSyncService.createAuditRecord(
        'SYSTEM',
        'admin_update',
        'HR Admin',
        undefined,
        `Imported ${employees.length} employees`,
        `File: ${file.name}`
      );
      
      // Notify parent component
      onEmployeesUpdated?.(employees);
      setSyncStatus(dataSyncService.getSyncStatus());
      
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [parseCSV, onEmployeesUpdated]);
  
  // Manual sync
  const handleManualSync = useCallback(async () => {
    setUploadStatus('processing');
    setUploadMessage('Syncing with remote...');
    
    const result = await dataSyncService.syncFromRemote();
    
    if (result.success) {
      const employees = dataSyncService.getEmployeesFromLocal();
      setEmployeeCount(employees.length);
      onEmployeesUpdated?.(employees);
    }
    
    setUploadStatus(result.success ? 'success' : 'error');
    setUploadMessage(result.message);
    setSyncStatus(dataSyncService.getSyncStatus());
  }, [onEmployeesUpdated]);
  
  // Download template
  const downloadTemplate = useCallback(() => {
    const headers = [
      'Entity', 'Employee No', 'Employee Name', 'Job Title', 'Department', 
      'Location', 'Work Schedule', 'Joining Date', '6 Month Eval Date', 
      'Probation Status', 'Employment Status', 'Company Email Address',
      'Annual Leave Entitlement', 'Extra Hours Compensation', 
      'Opening Balance from previous year', 'DOB',
      'January Annual', 'January Offset',
      'February Annual', 'February Offset',
      'March Annual', 'March Offset',
      'April Annual', 'April Offset',
      'May Annual', 'May Offset',
      'June Annual', 'June Offset',
      'July Annual', 'July Offset',
      'August Annual', 'August Offset',
      'September Annual', 'September Offset',
      'October Annual', 'October Offset',
      'November Annual', 'November Offset',
      'December Annual', 'December Offset',
      'Total Accrual', 'Total Availed', 'Leave Balance as of EOY'
    ];
    
    const sampleRow = [
      'Baynunah Watergeneration Technologies SP LLC', 'BAYN00002', 'Syed Irfan Ali',
      'Regional Director- Sales & Aftersales', 'Sales- Machines Sales & After Sales',
      'Head Office', '5 days', '27-Feb-23', '26-Aug-23', 'Confirmed', 'Active',
      'syed.irfan@baynunah.ae', '27', 'N/A', '5', '15031990',
      '2', '0', '0', '0', '3', '1', '0', '0', '0', '0', '0', '0',
      '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0',
      '27', '5', '27'
    ];
    
    const csv = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_leave_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, []);
  
  return (
    <Card className="border-2 border-[#38b6ff]/30">
      <CardHeader className="bg-[#0f025d] text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          HR Admin Panel - Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-[#38b6ff]/10 rounded-lg">
            <Users className="h-8 w-8 text-[#38b6ff]" />
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-[#0f025d]">{employeeCount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <Cloud className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Sync Status</p>
              <p className="text-lg font-semibold text-green-700">
                {syncStatus.status === 'success' ? 'Connected' : 'Local Only'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Last Sync</p>
              <p className="text-sm font-medium text-blue-700">
                {syncStatus.lastSync 
                  ? new Date(syncStatus.lastSync).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Upload Section */}
        <div className="border-2 border-dashed border-[#38b6ff]/50 rounded-lg p-6 text-center">
          <FileSpreadsheet className="h-12 w-12 mx-auto text-[#38b6ff] mb-4" />
          <h3 className="text-lg font-semibold text-[#0f025d] mb-2">
            Upload Employee Data
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Upload a CSV or JSON file with employee data. 
            This will automatically sync to the app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button 
                asChild
                variant="default"
                className="bg-[#38b6ff] hover:bg-[#38b6ff]/80 cursor-pointer"
                disabled={uploadStatus === 'processing'}
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadStatus === 'processing' ? 'Processing...' : 'Upload File'}
                </span>
              </Button>
            </label>
            
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="border-[#38b6ff] text-[#38b6ff]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            
            <Button
              variant="outline"
              onClick={handleManualSync}
              disabled={uploadStatus === 'processing'}
              className="border-[#0f025d] text-[#0f025d]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${uploadStatus === 'processing' ? 'animate-spin' : ''}`} />
              Sync Now
            </Button>
          </div>
        </div>
        
        {/* Status Message */}
        {uploadMessage && (
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
            uploadStatus === 'error' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {uploadStatus === 'success' && <CheckCircle className="h-5 w-5" />}
            {uploadStatus === 'error' && <AlertCircle className="h-5 w-5" />}
            {uploadStatus === 'processing' && <RefreshCw className="h-5 w-5 animate-spin" />}
            <span>{uploadMessage}</span>
          </div>
        )}
        
        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-[#0f025d] mb-2">How to Use:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Download the CSV template using the button above</li>
            <li>Fill in employee data in Excel (keep all column headers)</li>
            <li>Save as CSV and upload using the Upload button</li>
            <li>Data will automatically sync to the app</li>
            <li>Employees can then login with their Employee ID and DOB</li>
          </ol>
          
          <div className="mt-4 p-3 bg-[#38b6ff]/10 rounded">
            <p className="text-sm font-medium text-[#0f025d]">
              💡 For Azure deployment:
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Configure SharePoint or Azure SQL connection in the environment variables.
              The app will automatically sync with the remote database.
            </p>
          </div>
        </div>
        
        {/* Current Employees Summary */}
        {currentEmployees.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#0f025d] mb-3">Current Employees</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {currentEmployees.slice(0, 8).map(emp => (
                <Badge 
                  key={emp.employeeId} 
                  variant="outline"
                  className="justify-start p-2 bg-white"
                >
                  <span className="truncate">{emp.employeeId}: {emp.name}</span>
                </Badge>
              ))}
              {currentEmployees.length > 8 && (
                <Badge variant="secondary" className="justify-center">
                  +{currentEmployees.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default HRAdminPanel;
