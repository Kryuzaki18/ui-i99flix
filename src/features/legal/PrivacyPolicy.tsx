import LegalLayout from './LegalLayout';
import { Section, P, Ul, HighlightBox } from './LegalSection';

const ACCENT = '#e50914';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How i99flix collects, uses, and protects your information."
      lastUpdated="January 1, 2026"
      breadcrumb="Privacy Policy"
    >
      <HighlightBox>
        i99flix is a personal, non-commercial project. We collect only the minimum data
        necessary to provide the service and never sell your information to third parties.
      </HighlightBox>

      <Section title="1. Information We Collect">
        <P>We collect the following information when you create an account or use i99flix:</P>
        <Ul items={[
          'Name and email address (provided during registration or social sign-in)',
          'Encrypted password (for email/password accounts — never stored in plain text)',
          'Profile picture URL (from social providers such as Google, Facebook, or X)',
          'Account activity timestamps (created at, last login)',
          'Session tokens stored in secure, httpOnly cookies',
        ]} />
        <P>
          We do not collect payment information, precise location data, or any sensitive
          personal data beyond what is listed above.
        </P>
      </Section>

      <Section title="2. How We Use Your Information">
        <P>Your information is used solely to:</P>
        <Ul items={[
          'Create and manage your account',
          'Authenticate your identity and maintain your session',
          'Send transactional emails (email verification, password reset, welcome)',
          'Improve the platform and diagnose technical issues',
        ]} />
        <P>
          We do not use your data for advertising, profiling, or any commercial purpose.
        </P>
      </Section>

      <Section title="3. Social Sign-In">
        <P>
          When you sign in using Google, Facebook, or X (Twitter), we receive a limited
          set of profile data from those providers — typically your name, email address,
          and profile picture. We do not receive your social media passwords or access
          to post on your behalf.
        </P>
        <P>
          Your use of social sign-in is also governed by the respective provider's privacy
          policy:{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>Google</a>,{' '}
          <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>Facebook</a>,{' '}
          <a href="https://twitter.com/en/privacy" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>X (Twitter)</a>.
        </P>
      </Section>

      <Section title="4. Cookies and Sessions">
        <P>
          i99flix uses a single secure, httpOnly cookie named <code style={{ background: 'rgba(229,9,20,0.1)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>session</code> to
          maintain your login state. This cookie:
        </P>
        <Ul items={[
          'Is httpOnly — not accessible to JavaScript',
          'Is Secure — only sent over HTTPS',
          'Expires after 1 day (or 30 days if you choose "Remember me")',
          'Is cleared immediately when you sign out',
        ]} />
        <P>
          We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
        </P>
      </Section>

      <Section title="5. Third-Party Services">
        <P>i99flix integrates with the following third-party services:</P>
        <Ul items={[
          'TMDB (The Movie Database) — for movie and TV show metadata and images',
          'Firebase Authentication — for social sign-in (Google, Facebook, X)',
          'Resend — for transactional email delivery',
          'Third-party video embed providers — for streaming playback',
          'MongoDB Atlas — for secure cloud database storage',
        ]} />
        <P>
          Each of these services has its own privacy policy. We encourage you to review
          them. We share only the minimum data required for each service to function.
        </P>
      </Section>

      <Section title="6. Data Retention">
        <P>
          Your account data is retained for as long as your account is active. If you
          wish to delete your account and all associated data, contact us at{' '}
          <a href="mailto:kjedumapit@gmail.com" style={{ color: ACCENT }}>kjedumapit@gmail.com</a>{' '}
          and we will process your request within 30 days.
        </P>
      </Section>

      <Section title="7. Data Security">
        <P>
          We take reasonable technical measures to protect your data:
        </P>
        <Ul items={[
          'Passwords are hashed with bcrypt (12 salt rounds) — never stored in plain text',
          'Sessions use signed JWT tokens in httpOnly, Secure cookies',
          'All API communication is over HTTPS',
          'Rate limiting is applied to all authentication endpoints',
          'Database access is restricted to the application server',
        ]} />
        <P>
          No method of transmission over the internet is 100% secure. While we strive to
          protect your data, we cannot guarantee absolute security.
        </P>
      </Section>

      <Section title="8. Children's Privacy">
        <P>
          i99flix is not directed at children under the age of 13. We do not knowingly
          collect personal information from children. If you believe a child has provided
          us with personal information, please contact us and we will delete it promptly.
        </P>
      </Section>

      <Section title="9. Changes to This Policy">
        <P>
          We may update this Privacy Policy from time to time. Changes will be posted on
          this page with an updated "Last updated" date. Continued use of i99flix after
          changes constitutes acceptance of the updated policy.
        </P>
      </Section>

      <Section title="10. Contact">
        <P>
          For privacy-related questions or data deletion requests, contact us at{' '}
          <a href="mailto:kjedumapit@gmail.com" style={{ color: ACCENT }}>kjedumapit@gmail.com</a>.
        </P>
      </Section>
    </LegalLayout>
  );
}
