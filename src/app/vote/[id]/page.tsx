import { mockPets } from '@/data/pets';
import VotePageClient from './VotePageClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VotePage({ params }: PageProps) {
  const { id } = await params;
  const pet = mockPets.find(p => p.id === id) ?? mockPets[0];
  return <VotePageClient pet={pet} />;
}

export function generateStaticParams() {
  return mockPets.map(p => ({ id: p.id }));
}
