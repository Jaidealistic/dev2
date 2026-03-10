import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/lib/models/Lesson';
import { subDays, startOfDay, format } from 'date-fns';

export async function GET() {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sevenDaysAgo = subDays(new Date(), 7);

    // 1. Overview Stats
    const [totalUsers, activeUsers, lessonCount, totalProgressRecords, completedLessons] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          isActive: true
        }
      }),
      (async () => {
        await dbConnect();
        return Lesson.countDocuments();
      })(),
      prisma.lessonProgress.count(),
      prisma.lessonProgress.count({ where: { status: 'COMPLETED' } })
    ]);

    const completionRate = totalProgressRecords > 0
      ? Math.round((completedLessons / totalProgressRecords) * 100)
      : 0;

    // 2. User Growth (Last 30 Days)
    const userGrowthRaw = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Map to last 30 days
    const userGrowth = Array.from({ length: 30 }).map((_, i) => {
      const date = format(subDays(new Date(), 29 - i), 'MMM dd');
      const count = userGrowthRaw.filter(u =>
        format(u.createdAt, 'MMM dd') === date
      ).length;
      return { date, users: count };
    });

    // Cumulative growth for the chart
    let cumulative = totalUsers - userGrowthRaw.length;
    userGrowth.forEach(day => {
      cumulative += day.users;
      day.users = cumulative;
    });

    // 3. Lesson Activity (Last 7 Days)
    // We'll use startOfDay to group properly
    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        OR: [
          { createdAt: { gte: sevenDaysAgo } },
          { updatedAt: { gte: sevenDaysAgo } }
        ]
      },
      select: { createdAt: true, updatedAt: true, status: true }
    });

    const lessonActivity = Array.from({ length: 7 }).map((_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'MMM dd');
      const started = recentProgress.filter(p =>
        format(p.createdAt, 'MMM dd') === date
      ).length;
      const completed = recentProgress.filter(p =>
        p.status === 'COMPLETED' && p.updatedAt && format(p.updatedAt, 'MMM dd') === date
      ).length;
      return { date, started, completed };
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        totalLessons: lessonCount,
        completionRate
      },
      userGrowth,
      lessonActivity
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
