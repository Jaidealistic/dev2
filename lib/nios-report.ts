import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateNIOSReport(studentId: string, academicYear: string) {
  // Fetch student data and progress
  const student = await prisma.learnerProfile.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      niosCompetencies: true,
      progressRecords: {
        where: {
          createdAt: {
            gte: new Date(`${academicYear.split('-')[0]}-04-01`),
            lte: new Date(`${academicYear.split('-')[1]}-03-31`),
          },
        },
      },
    },
  });

  if (!student) throw new Error('Student not found');

  // Format the report data as a simple CSV for this example
  // In a real app, this would generate a PDF or a structured JSON for the frontend to render/print
  const headers = ['Concept/Skill', 'Status', 'Date Achieved', 'Educator Comments'];
  const rows = student.niosCompetencies.map((comp: any) => [
    comp.description || comp.competencyCode,
    comp.masteryLevel,
    comp.updatedAt.toISOString().split('T')[0],
    'Demonstrated proficiency through project work.' // Placeholder comment
  ]);

  const csvContent = [
    `OBE Report for ${student.user?.firstName || 'Student'} (${academicYear})`, // Changed student.fullName to using user relation or placeholder since fullName might not exist on LearnerProfile directly?
    // Wait, LearnerProfile doesn't have fullName. User has firstName/lastName.
    // I need to include user in the query.
    headers.join(','),
    ...rows.map((row: any) => row.join(','))
  ].join('\n');

  return csvContent;
}
