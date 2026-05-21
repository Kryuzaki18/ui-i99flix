import LegalLayout from './LegalLayout';
import { Section, P, Ul, HighlightBox } from './LegalSection';

const ACCENT = '#e50914';

export default function TermsOfService() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using i99flix."
      lastUpdated="January 1, 2026"
      breadcrumb="Terms of Service"
    >
      <HighlightBox>
        By accessing or using i99flix, you agree to be bound by these Terms of Service.
        If you do not agree, please do not use the platform.
      </HighlightBox>

      <Section title="1. About i99flix">
        <P>
          i99flix is a personal, non-commercial streaming platform that aggregates publicly
          available movie and TV show metadata from TMDB and provides embedded playback
          through third-party video sources. It is not affiliated with any major streaming
          service or content distributor.
        </P>
      </Section>

      <Section title="2. Eligibility">
        <P>
          You must be at least 13 years of age to use i99flix. By using the platform, you
          represent that you meet this requirement. If you are under 18, you should review
          these terms with a parent or guardian.
        </P>
      </Section>

      <Section title="3. Your Account">
        <P>
          When you create an account, you agree to:
        </P>
        <Ul items={[
          'Provide accurate and complete information',
          'Keep your password secure and not share it with others',
          'Notify us immediately of any unauthorised use of your account',
          'Be responsible for all activity that occurs under your account',
        ]} />
        <P>
          We reserve the right to suspend or terminate accounts that violate these terms
          or are used for abusive, fraudulent, or illegal purposes.
        </P>
      </Section>

      <Section title="4. Acceptable Use">
        <P>You agree not to:</P>
        <Ul items={[
          'Use i99flix for any unlawful purpose or in violation of any applicable laws',
          'Attempt to gain unauthorised access to any part of the platform or its infrastructure',
          'Scrape, crawl, or systematically extract data from the platform',
          'Reverse engineer, decompile, or disassemble any part of the platform',
          'Upload, transmit, or distribute any malicious code or harmful content',
          'Impersonate any person or entity or misrepresent your affiliation',
          'Use the platform in any way that could damage, disable, or impair its operation',
        ]} />
      </Section>

      <Section title="5. Content and Intellectual Property">
        <P>
          i99flix does not host, store, or own any video content. All media is streamed
          from third-party embed providers. Movie metadata, titles, descriptions, and
          images are sourced from TMDB under their terms of use.
        </P>
        <P>
          All trademarks, logos, and brand names displayed on i99flix are the property of
          their respective owners. Nothing on this platform grants you any licence or right
          to use those marks.
        </P>
        <P>
          The i99flix platform code, design, and original content are the property of the
          platform owner and may not be reproduced or redistributed without permission.
        </P>
      </Section>

      <Section title="6. Third-Party Services and Links">
        <P>
          i99flix integrates with third-party services including TMDB, Firebase, Resend,
          and various video embed providers. Your use of those services is governed by
          their respective terms and privacy policies. We are not responsible for the
          content, availability, or practices of third-party services.
        </P>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <P>
          i99flix is provided "as is" and "as available" without warranties of any kind,
          either express or implied. We do not warrant that:
        </P>
        <Ul items={[
          'The platform will be uninterrupted, error-free, or secure',
          'Any content will be accurate, complete, or up to date',
          'The platform will meet your specific requirements',
          'Any defects will be corrected',
        ]} />
        <P>
          Your use of i99flix is at your sole risk.
        </P>
      </Section>

      <Section title="8. Limitation of Liability">
        <P>
          To the fullest extent permitted by law, i99flix and its owner shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages arising
          from your use of or inability to use the platform, even if advised of the
          possibility of such damages.
        </P>
        <P>
          Because i99flix is a free, personal, non-commercial project, our total liability
          to you for any claim shall not exceed zero dollars ($0).
        </P>
      </Section>

      <Section title="9. Termination">
        <P>
          We may suspend or terminate your access to i99flix at any time, with or without
          notice, for any reason including violation of these terms. You may also delete
          your account at any time by contacting us.
        </P>
        <P>
          Upon termination, your right to use the platform ceases immediately. Sections
          that by their nature should survive termination (including intellectual property,
          disclaimers, and limitations of liability) will continue to apply.
        </P>
      </Section>

      <Section title="10. Changes to These Terms">
        <P>
          We may update these Terms of Service at any time. Changes will be posted on this
          page with an updated "Last updated" date. Continued use of i99flix after changes
          are posted constitutes your acceptance of the revised terms.
        </P>
      </Section>

      <Section title="11. Governing Law">
        <P>
          These terms are governed by and construed in accordance with applicable law.
          Any disputes arising from these terms or your use of i99flix shall be resolved
          through good-faith negotiation before any formal proceedings.
        </P>
      </Section>

      <Section title="12. Contact">
        <P>
          If you have questions about these Terms of Service, contact us at{' '}
          <a href="mailto:kjedumapit@gmail.com" style={{ color: ACCENT }}>kjedumapit@gmail.com</a>.
        </P>
      </Section>
    </LegalLayout>
  );
}
