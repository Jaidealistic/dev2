import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authService from './authService';
import { prisma } from '@/db';

// Mock prisma
vi.mock('@/db', () => ({
    prisma: {
        learnerProfile: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('generateStudentId', () => {
        it('should generate a valid student ID format (LX-XXXXX)', async () => {
            vi.mocked(prisma.learnerProfile.findUnique).mockResolvedValue(null);
            const studentId = await authService.generateStudentId();
            expect(studentId).toMatch(/^LX-\d{5}$/);
        });

        it('should retry if a student ID collision occurs', async () => {
            vi.mocked(prisma.learnerProfile.findUnique)
                .mockResolvedValueOnce({ id: 'existing-id' } as any)
                .mockResolvedValueOnce(null);

            const studentId = await authService.generateStudentId();
            expect(studentId).toMatch(/^LX-\d{5}$/);
            expect(prisma.learnerProfile.findUnique).toHaveBeenCalledTimes(2);
        });
    });

    describe('registerUser', () => {
        it('should register a new learner and generate a studentId', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
            };

            vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
            vi.mocked(prisma.user.create).mockResolvedValue({
                id: 'user-id',
                ...userData,
                role: 'LEARNER',
            } as any);
            vi.mocked(prisma.learnerProfile.findUnique).mockResolvedValue(null);

            const result = await authService.registerUser(
                userData.email,
                userData.password,
                userData.firstName,
                userData.lastName
            );

            expect(prisma.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        email: userData.email,
                        learnerProfile: expect.objectContaining({
                            create: expect.objectContaining({
                                studentId: expect.stringMatching(/^LX-\d{5}$/),
                            }),
                        }),
                    }),
                })
            );
            expect(result).toBeDefined();
            expect(result.email).toBe(userData.email);
        });

        it('should throw error if email already exists', async () => {
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'existing' } as any);

            await expect(authService.registerUser(
                'test@example.com',
                'password123',
                'Test',
                'User'
            )).rejects.toThrow('Email already registered');
        });
    });
});
