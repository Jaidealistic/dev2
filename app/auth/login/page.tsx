'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        // Redirect will be handled by middleware based on role
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to continue your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-sm text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline block"
            >
              Forgot password?
            </Link>
            <div>
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Educator: educator@linguaaccess.com / educator123</p>
            <p>Learner: learner@linguaaccess.com / learner123</p>
            <p>Parent: parent@linguaaccess.com / parent123</p>
            <p>Homeschool: homeschool@linguaaccess.com / homeschool123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}