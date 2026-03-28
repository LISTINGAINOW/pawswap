'use client';

import { Shield } from 'lucide-react';

interface Props {
  goodWith: string[];
}

export default function CompatBadge({ goodWith }: Props) {
  if (goodWith.length === 0) return null;

  const hasKids = goodWith.some((g) => g.toLowerCase().includes('kid'));
  const hasDogs = goodWith.some((g) => g.toLowerCase().includes('dog'));
  const hasCats = goodWith.some((g) => g.toLowerCase().includes('cat'));
  const hasEveryone = goodWith.some((g) => g.toLowerCase().includes('everyone'));

  if (hasEveryone) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
        <Shield className="h-3 w-3" />
        Great with everyone
      </div>
    );
  }

  const parts: string[] = [];
  if (hasKids) parts.push('👶');
  if (hasDogs) parts.push('🐕');
  if (hasCats) parts.push('🐈');

  if (parts.length === 0) return null;

  return (
    <div className="flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-xs text-sage-600">
      Good with {parts.join(' ')}
    </div>
  );
}
