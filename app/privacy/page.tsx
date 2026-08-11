import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How PerfectLove collects, uses, and protects your information — including what happens to your quiz answers.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="August 11, 2026"
    >
      <LegalSection title="1. Overview">
        <p>
          This policy explains what information PerfectLove collects when
          you use perfectlove.site, why we collect it, and who we share it
          with. The short version: we collect what&apos;s needed to generate
          your reading, process your payment, and deliver it to you — and
          nothing beyond that.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <ul>
          <li>
            <strong>Account:</strong> your email address, used to sign you in
            via a passwordless magic link and to deliver your readings.
          </li>
          <li>
            <strong>Quiz answers:</strong> what you tell us about yourself
            through each reading&apos;s quiz. For most readings this is
            self-selected preferences (sun sign, energy, intentions). For
            Soulmate Sketch specifically, this also includes your name,
            gender, birth date, birth time, birth place (optional), and your
            soulmate&apos;s gender — used to generate your portrait and
            reading.
          </li>
          <li>
            <strong>Payment information:</strong> handled directly by
            Stripe. We receive confirmation that a payment succeeded and the
            amount, but never your full card number.
          </li>
          <li>
            <strong>Usage data:</strong> basic analytics about site traffic
            (pages visited, general location, referral source) collected via
            Google Analytics.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <ul>
          <li>To generate your personalized reading and/or portrait.</li>
          <li>To deliver that reading to your email.</li>
          <li>To keep your reading history available in your dashboard.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To understand how people find and use the site, so we can improve it.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. AI Processing">
        <p>
          Your quiz answers are sent to OpenAI to generate your reading text
          and, for sketch readings, your portrait image. This includes birth
          details for Soulmate Sketch orders. We don&apos;t sell this
          information, and it&apos;s used solely to produce your reading.
        </p>
      </LegalSection>

      <LegalSection title="5. Who We Share Data With">
        <p>
          We use a small number of trusted service providers to run
          PerfectLove. Each only receives the data it needs to do its job:
        </p>
        <ul>
          <li><strong>Supabase</strong> — database, authentication, and file storage.</li>
          <li><strong>Stripe</strong> — payment processing.</li>
          <li><strong>Resend</strong> — sending your reading by email.</li>
          <li><strong>OpenAI</strong> — generating reading text and portrait images from your answers.</li>
          <li><strong>Google Analytics</strong> — anonymized traffic and usage analytics.</li>
        </ul>
        <p>We don&apos;t sell your personal information to anyone.</p>
      </LegalSection>

      <LegalSection title="6. Cookies &amp; Analytics">
        <p>
          We use a cookie to keep you signed in, and Google Analytics sets
          its own cookies to measure site traffic. You can block or clear
          cookies in your browser settings, though staying signed in
          requires the auth cookie to remain.
        </p>
      </LegalSection>

      <LegalSection title="7. Data Retention">
        <p>
          Your reading stays accessible in your dashboard for 60 days after
          delivery, after which it&apos;s archived (but not deleted) — you
          can restore access for a small fee at any time. We retain your
          account and order history for as long as your account is active,
          so you can keep coming back to past readings.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Rights">
        <p>
          You can request a copy of the data we hold about you, or ask us to
          delete your account and associated data, by emailing{" "}
          <a href="mailto:support@perfectlove.site">
            support@perfectlove.site
          </a>
          . We&apos;ll respond as quickly as we can.
        </p>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>
          PerfectLove isn&apos;t directed at, or intended for use by, anyone
          under 18. We don&apos;t knowingly collect information from
          children.
        </p>
      </LegalSection>

      <LegalSection title="10. Data Security">
        <p>
          We rely on our service providers&apos; security practices
          (Supabase, Stripe) to protect your data in transit and at rest.
          No method of transmission or storage is ever 100% secure, but we
          take reasonable steps to protect your information.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to This Policy">
        <p>
          We may update this policy from time to time. The &ldquo;Last updated&rdquo;
          date at the top reflects the most recent revision.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          Questions about this policy or your data? Email{" "}
          <a href="mailto:support@perfectlove.site">
            support@perfectlove.site
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
