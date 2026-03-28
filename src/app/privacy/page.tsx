import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 28, 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900">Overview</h2>
            <p className="mt-2">
              Pupular (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a free pet adoption discovery app. We are committed to protecting your privacy. This policy explains what data we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Data We Collect</h2>
            <p className="mt-2"><strong>Location data (optional):</strong> If you grant permission, we use your device&apos;s location or entered zip code to show pets near you. This data is not stored on our servers — it is only used in real-time to query pet databases.</p>
            <p className="mt-2"><strong>Quiz responses:</strong> Your pet matching quiz answers are stored locally on your device only (localStorage). They are never sent to our servers.</p>
            <p className="mt-2"><strong>Favorites:</strong> Saved pets are stored locally on your device only. They are never sent to our servers.</p>
            <p className="mt-2"><strong>Adoption inquiries:</strong> If you choose to send an inquiry to a shelter, the information you provide (name, email, phone, message) is sent directly to the shelter&apos;s contact. We do not store this information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Data We Do NOT Collect</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>We do not require account creation</li>
              <li>We do not collect personal information</li>
              <li>We do not use cookies for tracking</li>
              <li>We do not sell any data to third parties</li>
              <li>We do not use advertising networks</li>
              <li>We do not track your swipes or browsing behavior</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Third-Party Services</h2>
            <p className="mt-2">We may display pet data from third-party sources including RescueGroups.org and Petfinder. These services have their own privacy policies. When you click &quot;Apply to Adopt,&quot; you may be directed to a shelter&apos;s website governed by their own privacy policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
            <p className="mt-2">We use Vercel Analytics for anonymous, aggregated page view data. No personally identifiable information is collected. You can learn more at <a href="https://vercel.com/docs/analytics/privacy-policy" className="text-sage-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel&apos;s privacy policy</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Children&apos;s Privacy</h2>
            <p className="mt-2">Pupular does not knowingly collect information from children under 13. The app is suitable for all ages and does not require any personal information to use.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Changes</h2>
            <p className="mt-2">We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Contact</h2>
            <p className="mt-2">Questions about this policy? Email us at <a href="mailto:privacy@pupular.app" className="text-sage-600 hover:underline">privacy@pupular.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
