// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('drawPattern', () => {
    const patternContainerSelector = '.touch-none';
    cy.get(patternContainerSelector).should('be.visible').then($el => {
        const width = $el.width() || 280;
        const padding = width * 0.15;
        const spacing = (width - (2 * padding)) / 2;

        const getCoord = (idx: number) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            return {
                x: padding + col * spacing,
                y: padding + row * spacing
            };
        };

        const points = [0, 1, 4, 7].map(getCoord);

        cy.wrap($el)
            .trigger('mousedown', points[0].x, points[0].y, { force: true })
            .wait(100);

        for (let i = 1; i < points.length; i++) {
            cy.wrap($el)
                .trigger('mousemove', points[i].x, points[i].y, { force: true })
                .wait(100);
        }

        cy.wrap($el).trigger('mouseup', { force: true });
    });
});

Cypress.Commands.add('mockLearnerAPI', () => {
    // Mock check-method
    cy.intercept('POST', '/api/auth/check-method', (req) => {
        req.reply({
            statusCode: 200,
            body: {
                exists: true,
                authMethod: 'password',
                firstName: 'Learner',
                email: 'learner@linguaaccess.com' // Matches login email
            }
        });
    }).as('checkMethod');

    // Mock login
    cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
            token: 'mock-token',
            user: {
                id: '1',
                email: 'learner@linguaaccess.com',
                role: 'LEARNER',
                onboardingComplete: true
            }
        }
    }).as('loginRequest');

    // Mock dashboard data
    cy.intercept('GET', '/api/learner/dashboard', {
        statusCode: 200,
        body: {
            learnerName: 'Learner',
            learningLanguages: ['Spanish'],
            perLanguage: {
                Spanish: {
                    currentStreak: 5,
                    totalLessons: 10,
                    completedLessons: 3,
                    wordsLearned: 50,
                    totalPracticeMinutes: 120,
                    currentGoal: 'Complete 5 lessons',
                    goalProgress: 60,
                    recentLessons: [],
                    achievements: []
                }
            }
        }
    }).as('dashboardRequest');

    // Mock auth/me
    cy.intercept('GET', '/api/auth/me', {
        statusCode: 200,
        body: {
            user: {
                id: '1',
                email: 'learner@linguaaccess.com',
                role: 'LEARNER',
                onboardingComplete: true,
                learningLanguages: ['Spanish']
            }
        }
    }).as('meRequest');

    // Mock signup
    cy.intercept('POST', '/api/auth/signup', {
        statusCode: 201,
        body: {
            message: 'User created',
            token: 'mock-token',
            user: { id: '1', email: 'test@example.com', role: 'LEARNER' }
        }
    }).as('signupRequest');

    // Mock lessons list (path match)
    cy.intercept('GET', '/api/learner/lessons*', {
        statusCode: 200,
        body: {
            lessons: [
                {
                    id: 'l1',
                    title: 'Greeting Phase 1',
                    description: 'Learn basic greetings',
                    language: 'Spanish',
                    duration: 15,
                    progress: { status: 'NOT_STARTED', score: 0 }
                },
                {
                    id: 'l2',
                    title: 'Greeting Phase 2',
                    description: 'Advanced greetings',
                    language: 'Spanish',
                    duration: 20,
                    progress: { status: 'IN_PROGRESS', score: 50 }
                }
            ]
        }
    }).as('lessonsRequest');

    // Mock progress
    cy.intercept('GET', '/api/learner/progress', {
        statusCode: 200,
        body: {
            analytics: {
                totalTime: 120,
                avgScore: 85,
                totalLessons: 10,
                masteredLessons: 2,
                completedLessons: 4,
                currentStreak: 5
            },
            lessonProgress: [],
            competencies: []
        }
    }).as('progressRequest');

    // Mock profile
    cy.intercept('GET', '/api/learner/profile', {
        statusCode: 200,
        body: {
            id: '1',
            email: 'learner@linguaaccess.com',
            firstName: 'Learner',
            lastName: 'Test',
            role: 'LEARNER',
            createdAt: new Date().toISOString(),
            studentId: 'ST-12345',
            learnerProfile: {
                nativeLanguage: 'English',
                learningLanguages: ['Spanish'],
                gradeLevel: 'Grade 5',
                disabilityTypes: [],
                accommodations: {}
            }
        }
    }).as('profileRequest');

    // Mock specific lesson details (l1) with wildcard
    cy.intercept('GET', '/api/learner/lessons/l1*', {
        statusCode: 200,
        body: {
            success: true,
            lesson: {
                id: 'l1',
                title: 'Greeting Phase 1',
                description: 'Learn basic greetings',
                estimatedDuration: 15,
                competencies: ['listening', 'speaking'],
                disabilityTypes: [],
                steps: [
                    {
                        id: 's1',
                        stepType: 'text',
                        title: 'Introduction',
                        content: { text: 'Welcome to Spanish greetings.' }
                    },
                    {
                        id: 's2',
                        stepType: 'text',
                        title: 'Hola',
                        content: { text: 'Hola means Hello.' }
                    }
                ]
            }
        }
    }).as('lessonDetailsRequest');

    // Mock lesson completion submission
    cy.intercept('POST', '/api/learner/lessons/l1/complete', {
        statusCode: 200,
        body: { success: true, newAchievements: [] }
    }).as('lessonCompleteSubmit');

    // Mock lesson summary
    cy.intercept('GET', '/api/learner/lessons/l1/summary', {
        statusCode: 200,
        body: {
            lessonId: 'l1',
            lessonTitle: 'Greeting Phase 1',
            score: 100,
            duration: 60,
            sectionsCompleted: 2,
            totalSections: 2,
            strengths: ['Great focus'],
            newBadges: [],
            encouragementMessage: 'Well done!'
        }
    }).as('lessonSummaryRequest');
});

Cypress.Commands.add('loginAsStudent', () => {
    cy.visit('/login');
    cy.wait(500);
    cy.get('input[type="email"]').type('learner@linguaaccess.com', { force: true });
    cy.contains('Continue').click();
    cy.get('input[type="password"]').type('learner123', { force: true });
    cy.contains('Sign In').click();
});
