import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const resultData: Record<string, { title: string; emoji: string; color: string; bg: string }> = {
  'cuddly-dog': { title: 'Velcro Pup', emoji: '🐕❤️', color: '#ec4899', bg: '#fce7f3' },
  'cuddly-cat': { title: 'Lap Cat Supreme', emoji: '🐈❤️', color: '#a855f7', bg: '#f3e8ff' },
  'active-dog': { title: 'Adventure Buddy', emoji: '🐕⚡', color: '#f97316', bg: '#fff7ed' },
  'active-cat': { title: 'Chaos Kitten', emoji: '🐈⚡', color: '#06b6d4', bg: '#ecfeff' },
  'chill-dog': { title: 'Couch Commander', emoji: '🐕🛋️', color: '#7a8c63', bg: '#f6f7f4' },
  'chill-cat': { title: 'Zen Master', emoji: '🐈🕊️', color: '#3b82f6', bg: '#eff6ff' },
  'playful-dog': { title: 'Class Clown Pup', emoji: '🐕🤡', color: '#eab308', bg: '#fefce8' },
  'playful-cat': { title: 'Comedy Cat', emoji: '🐈🤡', color: '#10b981', bg: '#ecfdf5' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'cuddly-dog';
  const data = resultData[type] || resultData['cuddly-dog'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${data.bg} 0%, white 100%)`,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: 120, lineHeight: 1 }}>{data.emoji}</div>

        {/* Label */}
        <div
          style={{
            marginTop: 20,
            fontSize: 18,
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: 4,
            color: data.color,
          }}
        >
          YOUR PET MATCH IS
        </div>

        {/* Title */}
        <div
          style={{
            marginTop: 12,
            fontSize: 64,
            fontWeight: 900,
            color: '#1a1a1a',
            textAlign: 'center' as const,
          }}
        >
          {data.title}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: data.color,
            color: 'white',
            padding: '14px 32px',
            borderRadius: 50,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          🐾 Take the quiz at Pupular
        </div>

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 32,
            fontSize: 16,
            color: '#999',
          }}
        >
          pupular.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
