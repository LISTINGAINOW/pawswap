import type { Pet } from '@/data/pets';

export interface SupplyLink {
  category: string;
  emoji: string;
  name: string;
  priceRange: string;
  url: string;
}

const CHEWY = 'https://www.chewy.com';
const AMAZON = 'https://www.amazon.com';
const AMAZON_TAG = 'pupular20-20';
const BASE = CHEWY; // Primary affiliate — swap to AMAZON when Chewy approved

const DOG_LINKS: Record<string, Record<string, SupplyLink>> = {
  small: {
    food:    { category: 'Food',          emoji: '🥣', name: 'Small Breed Dry Dog Food',   priceRange: '$20–$45',  url: `${BASE}/b/small-breed-dry-food?utm_source=pupular` },
    bed:     { category: 'Bed',           emoji: '🛏️', name: 'Small Dog Bed',              priceRange: '$25–$60',  url: `${BASE}/b/small-dog-beds?utm_source=pupular` },
    toys:    { category: 'Toys',          emoji: '🧸', name: 'Small Dog Toy Bundle',        priceRange: '$12–$25',  url: `${BASE}/b/small-dog-toys?utm_source=pupular` },
    leash:   { category: 'Leash & Collar',emoji: '🦮', name: 'Small Dog Leash & Collar Set',priceRange: '$15–$35',  url: `${BASE}/b/small-dog-collars-leashes?utm_source=pupular` },
    crate:   { category: 'Crate',         emoji: '🏠', name: 'Small Dog Crate (24")',       priceRange: '$35–$80',  url: `${BASE}/b/small-dog-crates?utm_source=pupular` },
    bowls:   { category: 'Bowls',         emoji: '🥤', name: 'Stainless Steel Bowl Set',    priceRange: '$10–$20',  url: `${BASE}/b/dog-bowls?utm_source=pupular` },
  },
  medium: {
    food:    { category: 'Food',          emoji: '🥣', name: 'Medium Breed Dry Dog Food',   priceRange: '$30–$65',  url: `${BASE}/b/medium-breed-dry-food?utm_source=pupular` },
    bed:     { category: 'Bed',           emoji: '🛏️', name: 'Medium Dog Bed',              priceRange: '$40–$90',  url: `${BASE}/b/medium-dog-beds?utm_source=pupular` },
    toys:    { category: 'Toys',          emoji: '🧸', name: 'Medium Dog Toy Bundle',        priceRange: '$15–$30',  url: `${BASE}/b/medium-dog-toys?utm_source=pupular` },
    leash:   { category: 'Leash & Collar',emoji: '🦮', name: 'Medium Dog Leash & Collar Set',priceRange: '$18–$45',  url: `${BASE}/b/dog-collars-leashes?utm_source=pupular` },
    crate:   { category: 'Crate',         emoji: '🏠', name: 'Medium Dog Crate (36")',       priceRange: '$55–$110', url: `${BASE}/b/medium-dog-crates?utm_source=pupular` },
    bowls:   { category: 'Bowls',         emoji: '🥤', name: 'Stainless Steel Bowl Set',    priceRange: '$12–$25',  url: `${BASE}/b/dog-bowls?utm_source=pupular` },
  },
  large: {
    food:    { category: 'Food',          emoji: '🥣', name: 'Large Breed Dry Dog Food',    priceRange: '$45–$90',  url: `${BASE}/b/large-breed-dry-food?utm_source=pupular` },
    bed:     { category: 'Bed',           emoji: '🛏️', name: 'Large Dog Bed',               priceRange: '$60–$130', url: `${BASE}/b/large-dog-beds?utm_source=pupular` },
    toys:    { category: 'Toys',          emoji: '🧸', name: 'Large Dog Toy Bundle',         priceRange: '$18–$35',  url: `${BASE}/b/large-dog-toys?utm_source=pupular` },
    leash:   { category: 'Leash & Collar',emoji: '🦮', name: 'Large Dog Leash & Collar Set', priceRange: '$20–$55',  url: `${BASE}/b/large-dog-collars-leashes?utm_source=pupular` },
    crate:   { category: 'Crate',         emoji: '🏠', name: 'Large Dog Crate (42–48")',     priceRange: '$80–$180', url: `${BASE}/b/large-dog-crates?utm_source=pupular` },
    bowls:   { category: 'Bowls',         emoji: '🥤', name: 'Elevated Bowl Set',            priceRange: '$20–$45',  url: `${BASE}/b/elevated-dog-bowls?utm_source=pupular` },
  },
};

const CAT_LINKS: Record<string, SupplyLink> = {
  food:    { category: 'Food',          emoji: '🥣', name: 'Dry & Wet Cat Food Bundle',   priceRange: '$20–$50',  url: `${BASE}/b/cat-food?utm_source=pupular` },
  bed:     { category: 'Bed',           emoji: '🛏️', name: 'Cat Bed or Cave',             priceRange: '$20–$55',  url: `${BASE}/b/cat-beds?utm_source=pupular` },
  toys:    { category: 'Toys',          emoji: '🧶', name: 'Cat Toy Variety Pack',         priceRange: '$10–$25',  url: `${BASE}/b/cat-toys?utm_source=pupular` },
  collar:  { category: 'Collar',        emoji: '🏷️', name: 'Breakaway Cat Collar',        priceRange: '$8–$18',   url: `${BASE}/b/cat-collars?utm_source=pupular` },
  litter:  { category: 'Litter Box',    emoji: '🧹', name: 'Covered Litter Box + Litter', priceRange: '$25–$60',  url: `${BASE}/b/litter-boxes?utm_source=pupular` },
  bowls:   { category: 'Bowls',         emoji: '🥤', name: 'Ceramic Cat Food & Water Bowl',priceRange: '$12–$28',  url: `${BASE}/b/cat-bowls?utm_source=pupular` },
};

function getSizeKey(size: Pet['size']): 'small' | 'medium' | 'large' {
  if (size === 'Small') return 'small';
  if (size === 'Extra Large') return 'large';
  return size.toLowerCase() as 'small' | 'medium' | 'large';
}

// Amazon fallback links with real Associate ID
const AMAZON_DOG: Record<string, SupplyLink> = {
  food:    { category: 'Food',           emoji: '🥣', name: 'Dog Food',              priceRange: '$25–$65',  url: `${AMAZON}/s?k=dog+food&tag=${AMAZON_TAG}` },
  bed:     { category: 'Bed',            emoji: '🛏️', name: 'Dog Bed',               priceRange: '$25–$90',  url: `${AMAZON}/s?k=dog+bed&tag=${AMAZON_TAG}` },
  toys:    { category: 'Toys',           emoji: '🧸', name: 'Dog Toys',              priceRange: '$12–$30',  url: `${AMAZON}/s?k=dog+toys&tag=${AMAZON_TAG}` },
  leash:   { category: 'Leash & Collar', emoji: '🦮', name: 'Leash & Collar Set',    priceRange: '$15–$45',  url: `${AMAZON}/s?k=dog+leash+collar&tag=${AMAZON_TAG}` },
  crate:   { category: 'Crate',          emoji: '🏠', name: 'Dog Crate',             priceRange: '$35–$150', url: `${AMAZON}/s?k=dog+crate&tag=${AMAZON_TAG}` },
  bowls:   { category: 'Bowls',          emoji: '🥤', name: 'Dog Bowls',             priceRange: '$10–$25',  url: `${AMAZON}/s?k=dog+bowls+stainless&tag=${AMAZON_TAG}` },
};

const AMAZON_CAT: Record<string, SupplyLink> = {
  food:    { category: 'Food',           emoji: '🥣', name: 'Cat Food',              priceRange: '$20–$50',  url: `${AMAZON}/s?k=cat+food&tag=${AMAZON_TAG}` },
  bed:     { category: 'Bed',            emoji: '🛏️', name: 'Cat Bed',               priceRange: '$20–$55',  url: `${AMAZON}/s?k=cat+bed&tag=${AMAZON_TAG}` },
  toys:    { category: 'Toys',           emoji: '🧶', name: 'Cat Toys',              priceRange: '$10–$25',  url: `${AMAZON}/s?k=cat+toys&tag=${AMAZON_TAG}` },
  collar:  { category: 'Collar',         emoji: '🏷️', name: 'Cat Collar',            priceRange: '$8–$18',   url: `${AMAZON}/s?k=breakaway+cat+collar&tag=${AMAZON_TAG}` },
  litter:  { category: 'Litter Box',     emoji: '🧹', name: 'Litter Box + Litter',   priceRange: '$25–$60',  url: `${AMAZON}/s?k=cat+litter+box&tag=${AMAZON_TAG}` },
  bowls:   { category: 'Bowls',          emoji: '🥤', name: 'Cat Bowls',             priceRange: '$12–$28',  url: `${AMAZON}/s?k=cat+bowls+ceramic&tag=${AMAZON_TAG}` },
};

export function getSupplyLinks(pet: Pet, source: 'chewy' | 'amazon' = 'amazon'): SupplyLink[] {
  if (source === 'amazon') {
    return Object.values(pet.type === 'cat' ? AMAZON_CAT : AMAZON_DOG);
  }
  if (pet.type === 'cat') {
    return Object.values(CAT_LINKS);
  }
  const sizeKey = getSizeKey(pet.size);
  return Object.values(DOG_LINKS[sizeKey] || DOG_LINKS.medium);
}
