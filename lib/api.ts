/**
 * API CLIENT
 * 
 * Handles all HTTP requests to the backend
 * - Authentication endpoints
 * - Data fetching
 * - Error handling
 * - Token management
 */

// Use relative path for production (Vercel) or fallback to Next.js default port for local dev if needed
// BUT for client-side, relative '/api' is best.
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
console.log('🔧 API_URL configured as:', API_URL);

interface ApiError {
  error: string;
  details?: Record<string, string[]>;
  message?: string;
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Set JWT token in localStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

/**
 * Remove JWT token from localStorage (legacy)
 */
export function removeToken(): void {
  logout();
}

/**
 * Fetch with automatic token attachment
 */
async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Parse API response
 */
async function parseResponse<T>(response: Response): Promise<T | null> {
  try {
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * AUTHENTICATION ENDPOINTS
 */

/**
 * Sign up (create new account)
 */
export async function signup(payload: {
  email: string;
  password?: string;
  confirmPassword?: string;
  pattern?: number[];
  firstName: string;
  lastName: string;
  role?: string;
  agreeToTerms?: boolean;
  agreeToPrivacy?: boolean;
}): Promise<{ user: any; token?: string } | ApiError> {
  try {
    console.log('📡 Signup request to:', `${API_URL}/auth/signup`);
    console.log('📡 Signup payload:', JSON.stringify(payload));

    const response = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log('📡 Signup response status:', response.status);

    const data = await parseResponse<any>(response);
    console.log('📡 Signup response data:', data);

    if (!response.ok) {
      return data || { error: 'Signup failed' };
    }

    return data;
  } catch (error) {
    console.error('❌ Signup fetch error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Login (authenticate user)
 */
export async function login(payload: {
  email: string;
  password?: string;
  pattern?: number[];
  rememberMe?: boolean;
}): Promise<{ token: string; user: any } | ApiError> {
  try {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<any>(response);

    if (!response.ok) {
      return data || { error: 'Login failed' };
    }

    // Store token
    if (data?.token) {
      setToken(data.token);
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Verify email with code
 */
export async function verifyEmail(payload: {
  email: string;
  code: string;
}): Promise<{ user: any } | ApiError> {
  try {
    const response = await apiFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<any>(response);

    if (!response.ok) {
      return data || { error: 'Verification failed' };
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Request password reset email
 */
export async function requestPasswordReset(payload: {
  email: string;
}): Promise<{ message: string } | ApiError> {
  try {
    const response = await apiFetch('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<any>(response);

    if (!response.ok) {
      return data || { error: 'Request failed' };
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(payload: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<{ message: string } | ApiError> {
  try {
    const response = await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<any>(response);

    if (!response.ok) {
      return data || { error: 'Password reset failed' };
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get current user (requires authentication)
 */
export async function getCurrentUser(): Promise<{ user: any } | ApiError> {
  try {
    const response = await apiFetch('/auth/me', {
      method: 'GET',
    });

    const data = await parseResponse<any>(response);

    if (!response.ok) {
      return data || { error: 'Failed to get user' };
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Logout (remove token)
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  window.dispatchEvent(new CustomEvent('lexfix-logout'));
}

/**
 * Check auth method (pattern vs password) by email
 */
export async function checkAuthMethod(email: string): Promise<{ role: string; authMethod: string; firstName: string } | ApiError> {
  try {
    const response = await apiFetch('/auth/check-method', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Check failed' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Save learner onboarding data
 */
export async function saveLearnerOnboarding(payload: any): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await apiFetch('/learner/onboarding', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return { success: false, error: data?.message || 'Failed to save onboarding' };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Complete parent onboarding
 */
export async function completeParentOnboarding(): Promise<any> {
  try {
    const response = await apiFetch('/parent/onboarding', {
      method: 'POST',
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to complete onboarding' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Link a child to parent account
 */
export async function linkChild(studentId: string): Promise<any> {
  try {
    const response = await apiFetch('/parent/children/link', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to link child' };

    // Transform backend user data to what frontend expects
    // Frontend expects { child: { studentId, firstName, lastName, gradeLevel } }
    if (data.familyMember) {
      // Find the student in the response or use from data
      // Backend returns { message, familyMember: { parentId, childId, relationship, child: { ... } } }
      // Wait, let's check backend return format
      return {
        success: true,
        child: {
          studentId: studentId, // Or from data if returned
          firstName: data.familyMember.child?.firstName || 'Student',
          lastName: data.familyMember.child?.lastName || '',
          gradeLevel: data.familyMember.child?.learnerProfile?.grade || ''
        }
      };
    }
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Get parent dashboard
 */
export async function getParentDashboard(): Promise<any> {
  try {
    const response = await apiFetch('/parent/dashboard');
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to fetch dashboard' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

// ============================================================================
// LEARNER ENDPOINTS
// ============================================================================

/**
 * Get learner profile
 */
export async function getLearnerProfile(): Promise<any> {
  try {
    const response = await apiFetch('/learner/profile');
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to fetch profile' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Update learner profile
 */
export async function updateLearnerProfile(payload: any): Promise<any> {
  try {
    const response = await apiFetch('/learner/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to update profile' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Get learner dashboard data
 */
export async function getLearnerDashboard(): Promise<any> {
  try {
    const response = await apiFetch('/learner/dashboard');
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to fetch dashboard' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Get all lessons with progress
 */
export async function getLessons(filters?: { language?: string; status?: string }): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (filters?.language) params.append('language', filters.language);
    if (filters?.status) params.append('status', filters.status);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const response = await apiFetch(`/learner/lessons${queryString}`);
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to fetch lessons' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Add a new learning language
 */
export async function addLearnerLanguage(language: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiFetch('/learner/languages', {
      method: 'POST',
      body: JSON.stringify({ language }),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return { success: false, error: data?.message || 'Failed to add language' };
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Get specific lesson content
 */
export async function getLesson(lessonId: string): Promise<any> {
  try {
    const response = await apiFetch(`/learner/lessons/${lessonId}`);
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to fetch lesson' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Mark lesson as completed
 */
export async function completeLesson(lessonId: string, payload: { score: number; duration: number; errorPatterns?: any[] }): Promise<any> {
  try {
    const response = await apiFetch(`/learner/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to complete lesson' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Get accessibility preferences
 */
export async function getAccessibilityPrefs(): Promise<{ success: boolean; preferences?: any; error?: string }> {
  try {
    const response = await apiFetch('/learner/accessibility');
    const data = await parseResponse<any>(response);
    if (!response.ok) return { success: false, error: data?.message || 'Failed to fetch preferences' };
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Update accessibility preferences
 */
export async function updateAccessibilityPrefs(payload: any): Promise<{ success: boolean; preferences?: any; error?: string }> {
  try {
    const response = await apiFetch('/learner/accessibility', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return { success: false, error: data?.message || 'Failed to update preferences' };
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Get detailed progress analytics
 */
export async function getLearnerProgress(): Promise<any> {
  try {
    const response = await apiFetch('/learner/progress');
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to fetch progress' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Submit assessment answers
 */
export async function submitAssessment(payload: { answers: Record<string, string> }): Promise<any> {
  try {
    const response = await apiFetch('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return data || { error: 'Failed to submit assessment' };
    return data;
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * Generate learning path
 */
export async function generateLearningPath(payload?: any): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await apiFetch('/assessment/generate-path', {
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data = await parseResponse<any>(response);
    if (!response.ok) return { success: false, error: data?.message || 'Failed to generate path' };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}
