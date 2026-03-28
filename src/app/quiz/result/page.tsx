import { Metadata } from 'next';
import QuizResultPage from '@/components/QuizResultPage';

interface Props {
  searchParams: { type?: string };
}

const resultMeta: Record<string, { title: string; description: string; emoji: string }> = {
  'cuddly-dog': {
    title: 'Velcro Pup',
    description: 'You matched with a cuddly dog who wants to be glued to your side 24/7!',
    emoji: '🐕❤️',
  },
  'cuddly-cat': {
    title: 'Lap Cat Supreme',
    description: 'You matched with a purring lap warmer who lives for chin scratches!',
    emoji: '🐈❤️',
  },
  'active-dog': {
    title: 'Adventure Buddy',
    description: 'You matched with a high-energy pup who needs trails, beaches, and zoomies!',
    emoji: '🐕⚡',
  },
  'active-cat': {
    title: 'Chaos Kitten',
    description: 'You matched with a whirlwind of fur who will redecorate your house daily!',
    emoji: '🐈⚡',
  },
  'chill-dog': {
    title: 'Couch Commander',
    description: 'You matched with a professional napper who takes relaxation seriously!',
    emoji: '🐕🛋️',
  },
  'chill-cat': {
    title: 'Zen Master',
    description: 'You matched with a serene feline who radiates calm energy!',
    emoji: '🐈🕊️',
  },
  'playful-dog': {
    title: 'Class Clown Pup',
    description: 'You matched with a goofball who will make you laugh every single day!',
    emoji: '🐕🤡',
  },
  'playful-cat': {
    title: 'Comedy Cat',
    description: 'You matched with a sassy troublemaker with one brain cell and all the charm!',
    emoji: '🐈🤡',
  },
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const type = searchParams.type || 'cuddly-dog';
  const meta = resultMeta[type] || resultMeta['cuddly-dog'];

  return {
    title: `${meta.emoji} You're a ${meta.title}! — Pupular`,
    description: `${meta.description} Find adoptable pets that match your vibe on Pupular.`,
    openGraph: {
      title: `${meta.emoji} You're a ${meta.title}!`,
      description: `${meta.description} Take the quiz and find your perfect pet!`,
      siteName: 'Pupular',
      type: 'website',
      images: [`/api/og?type=${type}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${meta.emoji} I'm a ${meta.title}!`,
      description: `${meta.description} What pet matches YOUR vibe? Take the quiz!`,
      images: [`/api/og?type=${type}`],
    },
  };
}

export default function Page({ searchParams }: Props) {
  const type = searchParams.type || 'cuddly-dog';
  const meta = resultMeta[type] || resultMeta['cuddly-dog'];

  return <QuizResultPage resultType={type} meta={meta} />;
}
