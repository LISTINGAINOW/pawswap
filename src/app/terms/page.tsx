import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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

        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 28, 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By using Pupular (&quot;the App&quot;), you agree to these Terms of Service. If you do not agree, please do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">2. Description of Service</h2>
            <p className="mt-2">
              Pupular is a free pet adoption discovery platform that helps users find adoptable pets from shelters and rescue organizations near them. We aggregate publicly available pet listings and display them in an easy-to-browse format.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">3. No Guarantee of Availability</h2>
            <p className="mt-2">
              Pet listings are sourced from third-party databases (Petfinder, RescueGroups.org, and participating shelters). We do not guarantee that any listed pet is still available for adoption. Availability can change at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">4. Adoption Process</h2>
            <p className="mt-2">
              Pupular facilitates discovery only. All adoption applications, screening, fees, and decisions are handled directly by the shelters and rescue organizations. We are not a party to any adoption transaction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">5. User Conduct</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Misuse the App or interfere with its operation</li>
              <li>Submit false information in adoption inquiries</li>
              <li>Scrape or harvest data from the App</li>
              <li>Use the App for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">6. Disclaimer of Warranties</h2>
            <p className="mt-2">
              The App is provided &quot;as is&quot; without warranties of any kind. We do not warrant that the App will be uninterrupted, error-free, or that any pet information is accurate or current.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">7. Limitation of Liability</h2>
            <p className="mt-2">
              Pupular shall not be liable for any damages arising from use of the App, including but not limited to issues with adopted pets, shelter interactions, or adoption outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">8. Changes to Terms</h2>
            <p className="mt-2">
              We may update these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">9. Contact</h2>
            <p className="mt-2">Questions? Email us at <a href="mailto:hello@pupular.app" className="text-sage-600 hover:underline">hello@pupular.app</a>.</p>
          </section>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <Link href="/privacy" className="text-sm text-sage-600 hover:underline">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
