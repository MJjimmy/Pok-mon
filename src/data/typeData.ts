export const TYPE_COLORS: Record<string, string> = {
  normal:   '#A8A77A',
  fire:     '#EE8130',
  water:    '#6390F0',
  electric: '#F7D02C',
  grass:    '#7AC74C',
  ice:      '#96D9D6',
  fighting: '#C22E28',
  poison:   '#A33EA1',
  ground:   '#E2BF65',
  flying:   '#A98FF3',
  psychic:  '#F95587',
  bug:      '#A6B91A',
  rock:     '#B6A136',
  ghost:    '#735797',
  dragon:   '#6F35FC',
  dark:     '#705746',
  steel:    '#B7B7CE',
  fairy:    '#D685AD',
};

export const ALL_TYPES = Object.keys(TYPE_COLORS);

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? '#A8A77A';
}

export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1a1200' : '#ffffff';
}

export interface TypeMatchup {
  strongAgainst: string[];
  weakAgainst:   string[];
  resistantTo:   string[];
  immuneTo:      string[];
}

export const TYPE_MATCHUPS: Record<string, TypeMatchup> = {
  normal: {
    strongAgainst: [],
    weakAgainst:   ['fighting'],
    resistantTo:   [],
    immuneTo:      ['ghost'],
  },
  fire: {
    strongAgainst: ['grass', 'ice', 'bug', 'steel'],
    weakAgainst:   ['water', 'ground', 'rock'],
    resistantTo:   ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immuneTo:      [],
  },
  water: {
    strongAgainst: ['fire', 'ground', 'rock'],
    weakAgainst:   ['electric', 'grass'],
    resistantTo:   ['fire', 'water', 'ice', 'steel'],
    immuneTo:      [],
  },
  electric: {
    strongAgainst: ['water', 'flying'],
    weakAgainst:   ['ground'],
    resistantTo:   ['electric', 'flying', 'steel'],
    immuneTo:      [],
  },
  grass: {
    strongAgainst: ['water', 'ground', 'rock'],
    weakAgainst:   ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo:   ['water', 'electric', 'grass', 'ground'],
    immuneTo:      [],
  },
  ice: {
    strongAgainst: ['grass', 'ground', 'flying', 'dragon'],
    weakAgainst:   ['fire', 'fighting', 'rock', 'steel'],
    resistantTo:   ['ice'],
    immuneTo:      [],
  },
  fighting: {
    strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    weakAgainst:   ['flying', 'psychic', 'fairy'],
    resistantTo:   ['bug', 'rock', 'dark'],
    immuneTo:      [],
  },
  poison: {
    strongAgainst: ['grass', 'fairy'],
    weakAgainst:   ['ground', 'psychic'],
    resistantTo:   ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immuneTo:      [],
  },
  ground: {
    strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
    weakAgainst:   ['water', 'grass', 'ice'],
    resistantTo:   ['poison', 'rock'],
    immuneTo:      ['electric'],
  },
  flying: {
    strongAgainst: ['grass', 'fighting', 'bug'],
    weakAgainst:   ['electric', 'ice', 'rock'],
    resistantTo:   ['grass', 'fighting', 'bug'],
    immuneTo:      ['ground'],
  },
  psychic: {
    strongAgainst: ['fighting', 'poison'],
    weakAgainst:   ['bug', 'ghost', 'dark'],
    resistantTo:   ['fighting', 'psychic'],
    immuneTo:      [],
  },
  bug: {
    strongAgainst: ['grass', 'psychic', 'dark'],
    weakAgainst:   ['fire', 'flying', 'rock'],
    resistantTo:   ['grass', 'fighting', 'ground'],
    immuneTo:      [],
  },
  rock: {
    strongAgainst: ['fire', 'ice', 'flying', 'bug'],
    weakAgainst:   ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo:   ['normal', 'fire', 'poison', 'flying'],
    immuneTo:      [],
  },
  ghost: {
    strongAgainst: ['psychic', 'ghost'],
    weakAgainst:   ['ghost', 'dark'],
    resistantTo:   ['poison', 'bug'],
    immuneTo:      ['normal', 'fighting'],
  },
  dragon: {
    strongAgainst: ['dragon'],
    weakAgainst:   ['ice', 'dragon', 'fairy'],
    resistantTo:   ['fire', 'water', 'electric', 'grass'],
    immuneTo:      [],
  },
  dark: {
    strongAgainst: ['psychic', 'ghost'],
    weakAgainst:   ['fighting', 'bug', 'fairy'],
    resistantTo:   ['ghost', 'dark'],
    immuneTo:      ['psychic'],
  },
  steel: {
    strongAgainst: ['ice', 'rock', 'fairy'],
    weakAgainst:   ['fire', 'fighting', 'ground'],
    resistantTo:   ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immuneTo:      ['poison'],
  },
  fairy: {
    strongAgainst: ['fighting', 'dragon', 'dark'],
    weakAgainst:   ['poison', 'steel'],
    resistantTo:   ['fighting', 'bug', 'dark'],
    immuneTo:      ['dragon'],
  },
};

export const STAT_LABELS: Record<string, string> = {
  hp:              'HP',
  attack:          'ATK',
  defense:         'DEF',
  'special-attack': 'SP.ATK',
  'special-defense':'SP.DEF',
  speed:           'SPD',
};
