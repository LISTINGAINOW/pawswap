import Link from 'next/link';
import { ArrowLeft, LifeBuoy, Mail, ShieldCheck, Clock3 } from 'lucide-react';

export const metadata = {
  title: 'Pupular Support',
  description: 'Get help with Pupular, including support contact details, troubleshooting guidance, and privacy links.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pupular
        </Link>

        <div className="mb-8 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
            <LifeBuoy className="h-7 w-7 text-sage-700" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Pupular Support</h1>
          <p className="mt-2 text-sm text-gray-500">
            Need help with Pupular? We&apos;re happy to help with app issues, pet discovery questions, and account-free troubleshooting.
          </p>
        </div>

        <div className="space-y-4 text-gray-700">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">Contact support</h2>
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sage-50 p-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sage-700" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <a href="mailto:hello@pupular.app" className="text-sage-700 hover:underline font-medium">
                  hello@pupular.app
                </a>
                <p className="mt-2 text-sm text-gray-600">
                  Please include your device model, iOS version, app version, and a short description of the issue so we can help faster.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-bold text-gray-900">What we can help with</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>• Problems loading pets or pet details</li>
              <li>• Favorites, swiping, or quiz issues</li>
              <li>• Location-based pet discovery questions</li>
              <li>• Shelter or adoption link problems</li>
              <li>• General bugs or feedback</li>
            </ul>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-2 text-gray-900">
                <Clock3 className="h-5 w-5 text-sage-700" />
                <h2 className="text-lg font-bold">Response time</h2>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                We aim to respond within 1–2 business days.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-2 text-gray-900">
                <ShieldCheck className="h-5 w-5 text-sage-700" />
                <h2 className="text-lg font-bold">Privacy</h2>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Review how Pupular handles data in our privacy policy.
              </p>
              <Link href="/privacy" className="mt-3 inline-block text-sm font-medium text-sage-700 hover:underline">
                View Privacy Policy →
              </Link>
            </div>
          </section>

          <section className="rounded-2xl bg-sage-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">About Pupular</h2>
            <p className="mt-2 text-sm text-gray-700">
              Pupular helps people discover adoptable rescue pets from shelters and rescue groups in a swipe-friendly experience.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Link href="/about" className="text-sage-700 hover:underline font-medium">
                About Pupular →
              </Link>
              <Link href="/terms" className="text-sage-700 hover:underline font-medium">
                Terms of Service →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
