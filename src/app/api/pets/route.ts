import { NextRequest, NextResponse } from 'next/server';
import { searchPets } from '@/lib/pet-api';
import { mockPets } from '@/data/pets';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get('zip') || undefined;
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
  const type = (searchParams.get('type') as 'dog' | 'cat' | 'all') || 'all';
  const size = searchParams.get('size') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

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
