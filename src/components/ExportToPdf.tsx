import { Button } from '@/components/ui/button';
import { FilePdf } from '@phosphor-icons/react';
import { LeaveRequest, Employee, Leave2025Record } from '@/lib/types';
import { getTotalLeaveDays } from '@/lib/leave-utils';
import { toast } from 'sonner';

interface ExportToPdfProps {
  employee: Employee;
  requests: LeaveRequest[];
  leave2025Records: Leave2025Record[];
}

// HTML escape function to prevent XSS
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function ExportToPdf({ employee, requests, leave2025Records }: ExportToPdfProps) {
  const handleExport = () => {
    // Generate PDF content as HTML
    const usedDays = getTotalLeaveDays(requests);
    // Use consistent balance calculation: annualLeaveEntitlement + openingBalanceFromPreviousYear - usedDays
    const totalEntitlement = (employee.annualLeaveEntitlement ?? 0) + (employee.openingBalanceFromPreviousYear ?? 0);
    const remainingDays = totalEntitlement - usedDays;
    const total2025Leaves = leave2025Records.reduce((sum, r) => sum + r.leavesAvailed, 0);

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Leave Plan - ${employee.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #0f025d; border-bottom: 2px solid #38b6ff; padding-bottom: 10px; }
          h2 { color: #0f025d; margin-top: 30px; }
          .header-info { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .header-info p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #38b6ff; color: white; }
          tr:nth-child(even) { background: #f9f9f9; }
          .summary { display: flex; gap: 20px; margin-top: 20px; }
          .summary-box { flex: 1; background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; }
          .summary-box .number { font-size: 24px; font-weight: bold; color: #0f025d; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Leave Plan Report 2026</h1>
        
        <div class="header-info">
          <p><strong>Employee Name:</strong> ${escapeHtml(employee.name)}</p>
          <p><strong>Employee ID:</strong> ${escapeHtml(employee.employeeId)}</p>
          <p><strong>Position:</strong> ${escapeHtml(employee.position) || 'N/A'}</p>
          <p><strong>Entity:</strong> ${escapeHtml(employee.entity) || escapeHtml(employee.department)}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>

        <h2>2026 Leave Balance Summary</h2>
        <div class="summary">
          <div class="summary-box">
            <div class="number">${totalEntitlement}</div>
            <div>Total Allocation</div>
          </div>
          <div class="summary-box">
            <div class="number">${usedDays}</div>
            <div>Used/Planned</div>
          </div>
          <div class="summary-box">
            <div class="number">${remainingDays}</div>
            <div>Remaining</div>
          </div>
        </div>

        ${requests.length > 0 ? `
        <h2>2026 Planned Leave Requests</h2>
        <table>
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${requests.map(r => `
              <tr>
                <td>${new Date(r.startDate).toLocaleDateString('en-GB')}</td>
                <td>${new Date(r.endDate).toLocaleDateString('en-GB')}</td>
                <td>${r.totalDays}</td>
                <td>${escapeHtml(r.leaveType)}</td>
                <td>${escapeHtml(r.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>No leave requests submitted for 2026.</p>'}

        ${leave2025Records.length > 0 ? `
        <h2>2025 Leave History (${total2025Leaves} days total)</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Leaves Availed</th>
            </tr>
          </thead>
          <tbody>
            ${leave2025Records.map(r => `
              <tr>
                <td>${escapeHtml(r.month)}</td>
                <td>${r.leavesAvailed}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold; background: #e0f2fe;">
              <td>Total</td>
              <td>${total2025Leaves} days</td>
            </tr>
          </tbody>
        </table>
        ` : ''}

        <div class="footer">
          <p>This document is generated from the Leave Planner system. All leave requests are subject to company policy and formal approval.</p>
          <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
      toast.success('PDF export ready', {
        description: 'Use your browser print dialog to save as PDF',
      });
    } else {
      toast.error('Could not open print window', {
        description: 'Please allow pop-ups for this site',
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      className="gap-2 border-[#38b6ff] text-[#38b6ff] hover:bg-[#38b6ff]/10"
    >
      <FilePdf size={18} weight="fill" />
      Export to PDF
    </Button>
  );
}
