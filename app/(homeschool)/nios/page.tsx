'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Loader2 } from 'lucide-react';

export default function NIOSReportPage() {
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [studentId, setStudentId] = useState<string>(''); // Needs to be populated with real student IDs
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!studentId) {
      alert('Please select a student (Mock: using placeholder ID)');
      // For demo, let's allow proceeding with a mock ID if none selected
      // return;
    }
    
    setGenerating(true);
    try {
      const res = await fetch('/api/homeschool/nios-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId: studentId || 'mock-student-id', 
          academicYear: selectedYear 
        }),
      });

      if (!res.ok) throw new Error('Failed to generate report');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nios-report-${selectedYear}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Error generating report. Make sure database has student data.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NIOS Report Generation</h1>
        <p className="text-gray-600">Generate OBE reports compliant with NIOS standards</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button className="w-full" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Report (CSV)
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              * Exports attendance, competency progress, and educator comments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
