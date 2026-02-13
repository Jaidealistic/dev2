/**
 * EMAIL SERVICE
 * 
 * Handles all email communications:
 * - Verification emails
 * - Password reset emails
 * - Notifications
 * 
 * Uses SendGrid API (fallback to console in development)
 */

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@linguaaccess.local';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In development or without SendGrid API key, log to console
    if (!SENDGRID_API_KEY || process.env.NODE_ENV === 'development') {
      console.log('📧 Email (Development Mode):', {
        to: options.to,
        subject: options.subject,
        html: options.html.substring(0, 100) + '...',
      });
      return true;
    }

    // In production, send via SendGrid API
    // For now, we'll log it
    // TODO: Implement SendGrid integration
    console.log('📧 Email would be sent via SendGrid:', {
      to: options.to,
      subject: options.subject,
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const verificationLink = `${APP_URL}/auth/verify-email?email=${encodeURIComponent(email)}&code=${code}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0369a1;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .code { 
            font-size: 24px; 
            font-weight: bold; 
            letter-spacing: 2px; 
            text-align: center;
            margin: 20px 0;
            color: #0369a1;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #999; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LinguaAccess</h1>
            <p>Accessible Language Learning for Everyone</p>
          </div>

          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hi there! Thank you for signing up for LinguaAccess. To complete your registration, please verify your email address.</p>

            <div class="code">${code}</div>

            <p>Use this code in the verification form, or click the button below:</p>

            <a href="${verificationLink}" class="button">Verify Email</a>

            <p>This link expires in 24 hours.</p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

            <p><strong>Accessibility Note:</strong> If you're using a screen reader or have difficulty with the button above, you can enter the code directly: <code style="background: #f0f0f0; padding: 2px 6px;">${code}</code></p>
          </div>

          <div class="footer">
            <p>© 2026 LinguaAccess. All rights reserved.</p>
            <p>Questions? Contact us at support@linguaaccess.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to LinguaAccess

Verify Your Email Address

Hi there! Thank you for signing up for LinguaAccess. To complete your registration, please verify your email address.

Verification Code: ${code}

Or visit this link: ${verificationLink}

This link expires in 24 hours.

© 2026 LinguaAccess. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your LinguaAccess Email',
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<boolean> {
  const resetLink = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0369a1;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px; 
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #999; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LinguaAccess Password Reset</h1>
          </div>

          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>

            <a href="${resetLink}" class="button">Reset Password</a>

            <p>This link expires in 24 hours.</p>

            <div class="warning">
              <strong>⚠️ Security Note:</strong> If you didn't request a password reset, please ignore this email. Your account is secure.
            </div>

            <p><strong>For Security Reasons:</strong> Never share passwords via email. LinguaAccess support will never ask for your password.</p>
          </div>

          <div class="footer">
            <p>© 2026 LinguaAccess. All rights reserved.</p>
            <p>Questions? Contact us at support@linguaaccess.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
LinguaAccess Password Reset

Reset Your Password

We received a request to reset your password. Visit this link to create a new password:

${resetLink}

This link expires in 24 hours.

⚠️ Security Note: If you didn't request a password reset, please ignore this email. Your account is secure.

© 2026 LinguaAccess. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your LinguaAccess Password',
    html,
    text,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to LinguaAccess</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0369a1;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .features { margin: 20px 0; }
          .feature-item { margin: 15px 0; padding-left: 30px; }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            font-size: 12px; 
            color: #999; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to LinguaAccess, ${firstName}!</h1>
            <p>Your journey to accessible language learning starts here</p>
          </div>

          <div class="content">
            <h2>Get Started with LinguaAccess</h2>
            <p>We're excited to have you on board! LinguaAccess is designed specifically for learners with diverse learning needs.</p>

            <a href="${APP_URL}/onboarding" class="button">Complete Your Profile</a>

            <h3>What You Can Do:</h3>
            <div class="features">
              <div class="feature-item">✓ Customize fonts for dyslexia support (Lexend, Atkinson Hyperlegible)</div>
              <div class="feature-item">✓ Adjust text size, spacing, and color schemes</div>
              <div class="feature-item">✓ Learn with multi-modal content (text, audio, video)</div>
              <div class="feature-item">✓ Practice pronunciation with speech recognition</div>
              <div class="feature-item">✓ Track your progress and celebrate achievements</div>
            </div>

            <h3>Accessibility First</h3>
            <p>LinguaAccess is built from the ground up with full WCAG AAA accessibility compliance. Every feature works with:</p>
            <ul>
              <li>Keyboard navigation</li>
              <li>Screen readers</li>
              <li>Text customization</li>
              <li>Closed captions</li>
              <li>Speech recognition</li>
            </ul>
          </div>

          <div class="footer">
            <p>© 2026 LinguaAccess. All rights reserved.</p>
            <p>Questions? Check our <a href="${APP_URL}/help">Help Center</a> or email support@linguaaccess.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Welcome to LinguaAccess, ${firstName}!

Your journey to accessible language learning starts here.

Get Started with LinguaAccess

We're excited to have you on board! LinguaAccess is designed specifically for learners with diverse learning needs.

Visit your profile: ${APP_URL}/onboarding

© 2026 LinguaAccess. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to LinguaAccess, ${firstName}!`,
    html,
    text,
  });
}
