import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart } from 'lucide-react';
import type { Metadata } from 'next';
import StoriesViewTracker from './StoriesViewTracker';

export const metadata: Metadata = {
  title: 'Adoption Stories | Pupular',
  description: 'Real stories from real adopters. Meet the pets who found their forever homes through Pupular.',
  openGraph: {
    title: 'Adoption Stories | Pupular',
    description: 'Real stories from real adopters. Meet Max, Luna, Bear, and more — pets who found their forever homes.',
    url: 'https://www.pupular.app/stories',
    siteName: 'Pupular',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503256207526-0d5523f31580?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Max the Border Collie Mix — one of Pupular\'s adoption success stories',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adoption Stories | Pupular',
    description: 'Real stories from real adopters. Meet the pets who found their forever homes through Pupular.',
    images: ['https://images.unsplash.com/photo-1503256207526-0d5523f31580?w=1200&h=630&fit=crop'],
  },
};

const stories = [
  {
    id: 1,
    petName: 'Max',
    adopterName: 'The Johnson Family',
    location: 'Portland, OR',
    type: 'dog' as const,
    breed: 'Border Collie Mix',
    photo: 'https://images.unsplash.com/photo-1503256207526-0d5523f31580?w=600&h=700&fit=crop',
    before: 'Max was found wandering a highway overpass, thin and frightened, wearing a fraying collar with no tag. He spent six weeks at Happy Tails Rescue, too anxious to let anyone pet him.',
    after: 'Now Max sprints across the Johnsons\' backyard every morning, herds their two kids to the dinner table (whether they like it or not), and has claimed the left half of the family couch as his permanent territory.',
    quote: 'He was so scared the first night. By morning he was sleeping on my feet. I cried the whole time.',
    adopter: 'Sarah J.',
  },
  {
    id: 2,
    petName: 'Luna',
    adopterName: 'Marcus & Priya',
    location: 'Austin, TX',
    type: 'cat' as const,
    breed: 'Domestic Shorthair',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=700&fit=crop',
    before: 'Luna arrived at Sunflower Cat Sanctuary as part of a colony rescue — one of 22 cats living in an abandoned warehouse. She was the last one to be adopted, waiting 11 months.',
    after: 'Luna now rules a sunny one-bedroom apartment, supervises every Zoom call from her perch above the monitor, and has mastered the art of knocking exactly one item off the counter per day.',
    quote: 'She sat outside my bedroom door and meowed at 6am on day one. I was annoyed. Now it\'s my favorite alarm clock.',
    adopter: 'Priya K.',
  },
  {
    id: 3,
    petName: 'Bear',
    adopterName: 'Tom & Eddie',
    location: 'Chicago, IL',
    type: 'dog' as const,
    breed: 'Great Pyrenees Mix',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=700&fit=crop',
    before: 'Bear came to Midwest Paws at age 7, surrendered when his original family moved overseas. Staff worried his age would make him harder to place. He waited four months.',
    after: 'Bear became Tom and Eddie\'s "therapy dog they never asked for" — 110 lbs of calm, steady presence who somehow knows when either of them is having a rough day and plants himself directly on their feet.',
    quote: 'People said "don\'t adopt a senior dog, it\'s too hard." They were wrong. It\'s the best thing I\'ve ever done.',
    adopter: 'Tom R.',
  },
  {
    id: 4,
    petName: 'Mochi',
    adopterName: 'Yuki',
    location: 'Seattle, WA',
    type: 'cat' as const,
    breed: 'Siamese Mix',
    photo: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=700&fit=crop',
    before: 'Mochi was pulled from a hoarding situation with 40 other cats. She was underweight and terrified of humans. Her foster mom spent three months just sitting on the floor near her, letting her come close on her own terms.',
    after: 'Mochi is Yuki\'s shadow. She chatters at birds from the windowsill, demands breakfast with a yowl that could wake the building, and kneads Yuki\'s shoulder every single night before bed.',
    quote: 'The day she headbutted my hand for the first time I ugly-cried for twenty minutes. Worth every second.',
    adopter: 'Yuki T.',
  },
  {
    id: 5,
    petName: 'Biscuit',
    adopterName: 'The Rivera Family',
    location: 'Miami, FL',
    type: 'dog' as const,
    breed: 'Beagle Mix',
    photo: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=700&fit=crop',
    before: 'Biscuit was returned to Second Chance Rescue twice — once because he "barked too much," once because a new baby arrived. The staff called him their "boomerang dog" and quietly feared he\'d never find his people.',
    after: 'Biscuit has not been returned a third time. He barks at exactly three things: the mailman, squirrels, and the vacuum. The Rivera kids think this is hilarious. Their parents have learned to vacuum during school hours.',
    quote: 'He looked at me with those sad eyes and I said \'we\'ll take him.\' My husband said \'we came here to look.\' Biscuit has been ours for three years.',
    adopter: 'Carmen R.',
  },
  {
    id: 6,
    petName: 'Theo',
    adopterName: 'Grandma Dot',
    location: 'Denver, CO',
    type: 'cat' as const,
    breed: 'Maine Coon Mix',
    photo: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=700&fit=crop',
    before: 'Theo was 9 years old when his owner passed away. The shelter noted he was "quiet and sad" — he\'d spent a week hiding under his blanket. Dorothy, 74, came in looking for "an older cat who just wants company."',
    after: 'Dorothy says Theo follows her from room to room like a "fuzzy shadow." He sits beside her during her afternoon puzzle sessions, naps in the patch of sunlight by the back door, and purrs like a freight train every evening.',
    quote: 'My daughter worried I\'d be lonely after Harold passed. Then Theo arrived. I am not lonely.',
    adopter: 'Dorothy W.',
  },
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      <StoriesViewTracker />
      <div className="mx-auto max-w-2xl">
        <Link
          href="/about"
          className="mb-8 inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to About
        </Link>

        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="text-6xl">🐾</div>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">Adoption Stories</h1>
          <p className="mt-3 text-lg text-gray-500 max-w-md mx-auto">
            Every swipe is a chance at a story like these. Real pets, real families, real love.
          </p>
        </div>

        {/* Stories */}
        <div className="space-y-10">
          {stories.map((story) => (
            <article key={story.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
              {/* Photo */}
              <div className="relative h-72 w-full sm:h-80">
                <Image
                  src={story.photo}
                  alt={`${story.petName} — ${story.breed}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold text-white drop-shadow">{story.petName}</h2>
                    <span className="text-lg text-white/80">{story.type === 'dog' ? '🐕' : '🐈'}</span>
                  </div>
                  <p className="text-sm text-white/70">{story.breed} · Adopted by {story.adopterName}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Before */}
                <div className="mb-4">
                  <span className="mb-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Before
                  </span>
                  <p className="leading-relaxed text-gray-600">{story.before}</p>
                </div>

                {/* Arrow separator */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-sage-200" />
                  <Heart className="h-5 w-5 fill-red-400 text-red-400" />
                  <div className="h-px flex-1 bg-sage-200" />
                </div>

                {/* After */}
                <div className="mb-5">
                  <span className="mb-2 inline-block rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-600">
                    Now
                  </span>
                  <p className="leading-relaxed text-gray-600">{story.after}</p>
                </div>

                {/* Quote */}
                <blockquote className="rounded-2xl bg-sage-50 px-5 py-4">
                  <p className="text-sm font-medium italic leading-relaxed text-sage-800">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <footer className="mt-2 text-xs font-semibold text-sage-600">
                    — {story.adopter}, {story.location}
                  </footer>
                </blockquote>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-gradient-to-br from-sage-500 to-sage-600 p-8 text-center">
          <div className="text-5xl">🐾</div>
          <h2 className="mt-4 text-2xl font-bold text-white">Your story starts with a swipe</h2>
          <p className="mt-2 text-sage-100">
            Thousands of pets are waiting right now. One of them is yours.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-sage-700 shadow-sm transition hover:bg-sage-50"
          >
            <Heart className="h-5 w-5 text-red-500" />
            Start Swiping
          </Link>
        </div>
      </div>
    </div>
  );
}
