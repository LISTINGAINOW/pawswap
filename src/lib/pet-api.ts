import type { Pet } from '@/data/pets';

// ============================================================
// Unified Pet API — abstracts RescueGroups + Petfinder
// ============================================================

interface SearchParams {
  lat?: number;
  lng?: number;
  zipCode?: string;
  radius?: number; // miles
  type?: 'dog' | 'cat' | 'all';
  size?: string;
  age?: string;
  limit?: number;
  page?: number;
}

// --- RescueGroups.org API ---

interface RescueGroupsAnimal {
  animalID: string;
  animalName: string;
  animalSpecies: string;
  animalBreed: string;
  animalGeneralAge: string;
  animalSex: string;
  animalGeneralSizePotential: string;
  animalPictures?: Array<{ urlSecureFullsize: string; urlSecureThumbnail: string }>;
  animalDescription: string;
  animalLocation: string;
  animalLocationDistance?: string;
  animalOrgName?: string;
  animalOrgPhone?: string;
  animalOrgAddress?: string;
  animalOrgCity?: string;
  animalOrgState?: string;
  animalOrgPostalcode?: string;
  animalAdoptionUrl?: string;
  animalHousetrained?: string;
  animalNeedsFoster?: string;
  animalSpecialneeds?: string;
  animalAltered?: string;
  animalCurrentVaccinations?: string;
  animalGoodWithKids?: string;
  animalGoodWithDogs?: string;
  animalGoodWithCats?: string;
}

function mapRescueGroupsPet(animal: RescueGroupsAnimal): Pet {
  const photos = (animal.animalPictures || []).map((p) => p.urlSecureFullsize).filter(Boolean);
  const traits: string[] = [];
  if (animal.animalHousetrained === 'Yes') traits.push('House-trained');
  if (animal.animalAltered === 'Yes') traits.push(animal.animalSex === 'Male' ? 'Neutered' : 'Spayed');
  if (animal.animalCurrentVaccinations === 'Yes') traits.push('Vaccinated');
  if (animal.animalSpecialneeds === 'Yes') traits.push('Special needs');

  const goodWith: string[] = [];
  if (animal.animalGoodWithKids === 'Yes') goodWith.push('Kids');
  if (animal.animalGoodWithDogs === 'Yes') goodWith.push('Other dogs');
  if (animal.animalGoodWithCats === 'Yes') goodWith.push('Cats');

  const sizeMap: Record<string, Pet['size']> = {
    Small: 'Small',
    Medium: 'Medium',
    Large: 'Large',
    'Extra Large': 'Extra Large',
  };

  return {
    id: `rg-${animal.animalID}`,
    name: animal.animalName || 'Unknown',
    type: animal.animalSpecies?.toLowerCase() === 'cat' ? 'cat' : 'dog',
    breed: animal.animalBreed || 'Mixed Breed',
    age: animal.animalGeneralAge || 'Unknown',
    gender: animal.animalSex === 'Female' ? 'Female' : 'Male',
    size: sizeMap[animal.animalGeneralSizePotential] || 'Medium',
    distance: animal.animalLocationDistance ? `${parseFloat(animal.animalLocationDistance).toFixed(1)} mi` : 'Unknown',
    photo: photos[0] || '/placeholder-pet.png',
    photos: photos.length > 0 ? photos : ['/placeholder-pet.png'],
    shelter: animal.animalOrgName || 'Local Shelter',
    shelterPhone: animal.animalOrgPhone || '',
    shelterEmail: '',
    shelterAddress: [animal.animalOrgAddress, animal.animalOrgCity, animal.animalOrgState, animal.animalOrgPostalcode].filter(Boolean).join(', '),
    shelterHours: '',
    description: animal.animalDescription?.replace(/<[^>]*>/g, '') || `${animal.animalName} is looking for a forever home!`,
    traits,
    goodWith,
    adoptionFee: '',
    adoptionUrl: animal.animalAdoptionUrl || '#',
  };
}

export async function searchRescueGroups(params: SearchParams): Promise<Pet[]> {
  const apiKey = process.env.NEXT_PUBLIC_RESCUEGROUPS_API_KEY || process.env.RESCUEGROUPS_API_KEY;
  if (!apiKey) {
    console.warn('RescueGroups API key not set');
    return [];
  }

  const filters: Array<{ fieldName: string; operation: string; criteria: string }> = [];

  if (params.type && params.type !== 'all') {
    filters.push({
      fieldName: 'animalSpecies',
      operation: 'equals',
      criteria: params.type === 'dog' ? 'Dog' : 'Cat',
    });
  }

  // Always filter for available animals
  filters.push({
    fieldName: 'animalStatus',
    operation: 'equals',
    criteria: 'Available',
  });

  const body: Record<string, unknown> = {
    apikey: apiKey,
    objectType: 'animals',
    objectAction: 'publicSearch',
    search: {
      resultStart: ((params.page || 1) - 1) * (params.limit || 20),
      resultLimit: params.limit || 20,
      resultSort: 'animalLocationDistance',
      resultOrder: 'asc',
      calcFoundRows: 'Yes',
      filters,
    },
  };

  if (params.zipCode) {
    body.search = {
      ...body.search as object,
      filters: [
        ...filters,
        { fieldName: 'animalLocation', operation: 'equals', criteria: params.zipCode },
      ],
    };
  }

  try {
    const response = await fetch('https://api.rescuegroups.org/http/v2.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (data.data) {
      return Object.values(data.data).map((animal) => mapRescueGroupsPet(animal as RescueGroupsAnimal));
    }
    return [];
  } catch (error) {
    console.error('RescueGroups API error:', error);
    return [];
  }
}

// --- Petfinder API ---

let petfinderToken: string | null = null;
let petfinderTokenExpiry = 0;

async function getPetfinderToken(): Promise<string | null> {
  const clientId = process.env.PETFINDER_CLIENT_ID;
  const clientSecret = process.env.PETFINDER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (petfinderToken && Date.now() < petfinderTokenExpiry) {
    return petfinderToken;
  }

  try {
    const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data = await response.json();
    petfinderToken = data.access_token;
    petfinderTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    return petfinderToken;
  } catch (error) {
    console.error('Petfinder auth error:', error);
    return null;
  }
}

export async function searchPetfinder(params: SearchParams): Promise<Pet[]> {
  const token = await getPetfinderToken();
  if (!token) return [];

  const queryParams = new URLSearchParams();
  if (params.type && params.type !== 'all') queryParams.set('type', params.type);
  if (params.zipCode) queryParams.set('location', params.zipCode);
  if (params.radius) queryParams.set('distance', String(params.radius));
  queryParams.set('limit', String(params.limit || 20));
  queryParams.set('page', String(params.page || 1));
  queryParams.set('status', 'adoptable');
  queryParams.set('sort', 'distance');

  try {
    const response = await fetch(`https://api.petfinder.com/v2/animals?${queryParams}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!data.animals) return [];

    return data.animals.map((a: Record<string, unknown>): Pet => {
      const photos = ((a.photos as Array<Record<string, string>>) || [])
        .map((p) => p.full || p.large || p.medium)
        .filter(Boolean);

      const traits: string[] = [];
      const attrs = a.attributes as Record<string, boolean> | undefined;
      if (attrs?.house_trained) traits.push('House-trained');
      if (attrs?.spayed_neutered) traits.push((a.gender as string) === 'Male' ? 'Neutered' : 'Spayed');
      if (attrs?.shots_current) traits.push('Vaccinated');
      if (attrs?.special_needs) traits.push('Special needs');

      const goodWith: string[] = [];
      const env = a.environment as Record<string, boolean | null> | undefined;
      if (env?.children) goodWith.push('Kids');
      if (env?.dogs) goodWith.push('Other dogs');
      if (env?.cats) goodWith.push('Cats');

      const contact = a.contact as Record<string, unknown> | undefined;
      const address = contact?.address as Record<string, string> | undefined;

      return {
        id: `pf-${a.id}`,
        name: (a.name as string) || 'Unknown',
        type: (a.type as string)?.toLowerCase() === 'cat' ? 'cat' : 'dog',
        breed: ((a.breeds as Record<string, string>)?.primary) || 'Mixed Breed',
        age: (a.age as string) || 'Unknown',
        gender: (a.gender as string) === 'Female' ? 'Female' : 'Male',
        size: (a.size as Pet['size']) || 'Medium',
        distance: a.distance ? `${(a.distance as number).toFixed(1)} mi` : 'Unknown',
        photo: photos[0] || '/placeholder-pet.png',
        photos: photos.length > 0 ? photos : ['/placeholder-pet.png'],
        shelter: (a.organization_id as string) || 'Local Shelter',
        shelterPhone: (contact?.phone as string) || '',
        shelterEmail: (contact?.email as string) || '',
        shelterAddress: address ? [address.address1, address.city, address.state, address.postcode].filter(Boolean).join(', ') : '',
        shelterHours: '',
        description: ((a.description as string) || `Meet ${a.name}!`).replace(/<[^>]*>/g, ''),
        traits,
        goodWith,
        adoptionFee: '',
        adoptionUrl: (a.url as string) || '#',
      };
    });
  } catch (error) {
    console.error('Petfinder API error:', error);
    return [];
  }
}

// --- Unified search: tries both, deduplicates ---

export async function searchPets(params: SearchParams): Promise<Pet[]> {
  const [rgResults, pfResults] = await Promise.allSettled([
    searchRescueGroups(params),
    searchPetfinder(params),
  ]);

  const pets: Pet[] = [];
  const seenNames = new Set<string>();

  // Combine results, preferring entries with photos
  for (const result of [rgResults, pfResults]) {
    if (result.status === 'fulfilled') {
      for (const pet of result.value) {
        const key = `${pet.name}-${pet.breed}-${pet.shelter}`.toLowerCase();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          pets.push(pet);
        }
      }
    }
  }

  // Sort by distance (parse the "X.X mi" string)
  pets.sort((a, b) => {
    const distA = parseFloat(a.distance) || 999;
    const distB = parseFloat(b.distance) || 999;
    return distA - distB;
  });

  return pets;
}
