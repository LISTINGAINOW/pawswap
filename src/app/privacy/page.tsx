import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to swiping
        </Link>

        {/* Hero header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
            <Lock className="h-7 w-7 text-sage-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-1 text-sm text-gray-400">Last updated: March 28, 2026</p>
          <p className="mt-3 text-sm text-sage-700 font-medium">
            Short version: We collect almost nothing. Everything stays on your device.
          </p>
        </div>

        <div className="space-y-4 text-gray-600 leading-relaxed">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Overview</h2>
            <p className="mt-2 text-sm">
              Pupular (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a free pet adoption discovery app. We are committed to protecting your privacy. This policy explains what data we collect and how we use it.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Data We Collect</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-xl shrink-0">📍</span>
                <div><strong className="text-gray-800">Location data (optional):</strong> If you grant permission, we use your device&apos;s location or entered zip code to show pets near you. This data is not stored on our servers — it is only used in real-time to query pet databases.</div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl shrink-0">🧠</span>
                <div><strong className="text-gray-800">Quiz responses:</strong> Your pet matching quiz answers are stored locally on your device only (localStorage). They are never sent to our servers.</div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl shrink-0">❤️</span>
                <div><strong className="text-gray-800">Favorites:</strong> Saved pets are stored locally on your device only. They are never sent to our servers.</div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl shrink-0">📝</span>
                <div><strong className="text-gray-800">Adoption inquiries:</strong> If you send an inquiry to a shelter, that information goes directly to the shelter. We do not store it.</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-green-50 p-5 ring-1 ring-green-200">
            <h2 className="text-lg font-bold text-green-900">Data We Do NOT Collect</h2>
            <ul className="mt-3 space-y-2 text-sm text-green-800">
              {[
                'No account creation required',
                'No personal information collected',
                'No tracking cookies',
                'No data sold to third parties',
                'No advertising networks',
                'No swipe history tracked',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Third-Party Services</h2>
            <p className="mt-2 text-sm">We display pet data from RescueGroups.org and Petfinder. These services have their own privacy policies. When you click &quot;Apply to Adopt,&quot; you may be directed to a shelter&apos;s website governed by their own privacy policy.</p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Analytics</h2>
            <p className="mt-2 text-sm">We use Vercel Analytics for anonymous, aggregated page view data. No personally identifiable information is collected. Learn more at <a href="https://vercel.com/docs/analytics/privacy-policy" className="text-sage-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel&apos;s privacy policy</a>.</p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Children&apos;s Privacy</h2>
            <p className="mt-2 text-sm">Pupular does not knowingly collect information from children under 13. The app is suitable for all ages and does not require any personal information to use.</p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Changes</h2>
            <p className="mt-2 text-sm">We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
          </section>

          <section className="rounded-2xl bg-sage-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">Contact</h2>
            <p className="mt-2 text-sm">Questions about this policy? Email us at <a href="mailto:privacy@pupular.app" className="text-sage-600 hover:underline font-medium">privacy@pupular.app</a>.</p>
          </section>
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm">
          <Link href="/terms" className="text-sage-600 hover:underline">Terms of Service →</Link>
          <Link href="/about" className="text-sage-600 hover:underline">About Pupular →</Link>
        </div>
      </div>
    </div>
  );
}
