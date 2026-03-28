import { NextRequest, NextResponse } from 'next/server';
import { searchPets } from '@/lib/pet-api';
import { mockPets } from '@/data/pets';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Validate zip
  const rawZip = searchParams.get('zip');
  if (rawZip !== null && !/^\d{5}$/.test(rawZip)) {
    return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 });
  }
  const zipCode = rawZip || undefined;

  // Validate lat/lng
  const rawLat = searchParams.get('lat');
  const rawLng = searchParams.get('lng');
  const lat = rawLat ? parseFloat(rawLat) : undefined;
  const lng = rawLng ? parseFloat(rawLng) : undefined;
  if (lat !== undefined && (isNaN(lat) || lat < -90 || lat > 90)) {
    return NextResponse.json({ error: 'Invalid lat' }, { status: 400 });
  }
  if (lng !== undefined && (isNaN(lng) || lng < -180 || lng > 180)) {
    return NextResponse.json({ error: 'Invalid lng' }, { status: 400 });
  }

  const type = (searchParams.get('type') as 'dog' | 'cat' | 'all') || 'all';
  const size = searchParams.get('size') || undefined;

  // Validate limit (1–100) and page (min 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  try {
    const pets = await searchPets({
      zipCode,
      lat,
      lng,
      type,
      size,
      limit,
      page,
      radius: 50,
    });

    // If no API keys configured or no results, fall back to mock data
    if (pets.length === 0) {
      const filtered = mockPets.filter((pet) => {
        if (type !== 'all' && pet.type !== type) return false;
        if (size && size !== 'all' && pet.size !== size) return false;
        return true;
      });
      return NextResponse.json({
        pets: filtered,
        total: filtered.length,
        source: 'mock',
        message: 'Using demo data. Connect RescueGroups or Petfinder API for real pets.',
      });
    }

    return NextResponse.json({
      pets,
      total: pets.length,
      source: 'live',
    });
  } catch (error) {
    console.error('Pet search error:', error);
    // Graceful fallback to mock data
    return NextResponse.json({
      pets: mockPets,
      total: mockPets.length,
      source: 'mock',
      message: 'API error, showing demo data.',
    });
  }
}
