import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
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
            <FileText className="h-7 w-7 text-sage-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-1 text-sm text-gray-400">Last updated: March 28, 2026</p>
          <p className="mt-3 text-sm text-sage-700 font-medium">
            Short version: Pupular is free, we help you find pets, adoptions happen at shelters.
          </p>
        </div>

        <div className="space-y-4 text-gray-600 leading-relaxed">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-2 text-sm">
              By using Pupular (&quot;the App&quot;), you agree to these Terms of Service. If you do not agree, please do not use the App.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">2. Description of Service</h2>
            <p className="mt-2 text-sm">
              Pupular is a free pet adoption discovery platform that helps users find adoptable pets from shelters and rescue organizations near them. We aggregate publicly available pet listings and display them in an easy-to-browse format.
            </p>
          </section>

          <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
            <h2 className="text-lg font-bold text-amber-900">3. No Guarantee of Availability</h2>
            <p className="mt-2 text-sm text-amber-800">
              Pet listings are sourced from third-party databases (Petfinder, RescueGroups.org, and participating shelters). We do not guarantee that any listed pet is still available for adoption. Availability can change at any time without notice.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">4. Adoption Process</h2>
            <p className="mt-2 text-sm">
              Pupular facilitates discovery only. All adoption applications, screening, fees, and decisions are handled directly by the shelters and rescue organizations. We are not a party to any adoption transaction.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">5. User Conduct</h2>
            <p className="mt-2 text-sm">You agree not to:</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {[
                'Misuse the App or interfere with its operation',
                'Submit false information in adoption inquiries',
                'Scrape or harvest data from the App',
                'Use the App for any unlawful purpose',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✕</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">6. Disclaimer of Warranties</h2>
            <p className="mt-2 text-sm">
              The App is provided &quot;as is&quot; without warranties of any kind. We do not warrant that the App will be uninterrupted, error-free, or that any pet information is accurate or current.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">7. Limitation of Liability</h2>
            <p className="mt-2 text-sm">
              Pupular shall not be liable for any damages arising from use of the App, including but not limited to issues with adopted pets, shelter interactions, or adoption outcomes.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">8. Changes to Terms</h2>
            <p className="mt-2 text-sm">
              We may update these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="rounded-2xl bg-sage-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">9. Contact</h2>
            <p className="mt-2 text-sm">Questions? Email us at <a href="mailto:hello@pupular.app" className="text-sage-600 hover:underline font-medium">hello@pupular.app</a>.</p>
          </section>
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm">
          <Link href="/privacy" className="text-sage-600 hover:underline">Privacy Policy →</Link>
          <Link href="/about" className="text-sage-600 hover:underline">About Pupular →</Link>
        </div>
      </div>
    </div>
  );
}
