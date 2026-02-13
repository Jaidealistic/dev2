'use client';

interface AccessibilityCheckerProps {
  lessonData?: any;
}

export default function AccessibilityChecker({ lessonData }: AccessibilityCheckerProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="font-semibold mb-4">Accessibility Checker</h3>
      <div className="text-sm text-muted-foreground">Checking accessibility compliance...</div>
    </div>
  );
}
