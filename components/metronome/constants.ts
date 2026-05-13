export const BPM_MIN = 10;
export const BPM_MAX = 300;

export const TIME_SIGNATURES = ['1/4', '2/4', '3/4', '4/4', '3/8', '6/8', '9/8', '12/8'] as const;
export const SUBDIVISIONS = ['single', 'doublet', 'triplet', 'quadruplet'] as const;

export type TimeSignature = (typeof TIME_SIGNATURES)[number];
export type Subdivision = (typeof SUBDIVISIONS)[number];

export const SUB_ICONS: Record<Subdivision, number> = {
  single: require('@/assets/images/notes/noire.svg'),
  doublet: require('@/assets/images/notes/croches.svg'),
  triplet: require('@/assets/images/notes/triolet.svg'),
  quadruplet: require('@/assets/images/notes/quatre-croches.svg'),
};

export const SUBDIVISION_TICKS: Record<Subdivision, number> = {
  single: 1,
  doublet: 2,
  triplet: 3,
  quadruplet: 4,
};

export type TempoMarking = {
  name: string;
  min: number;
  max: number;
  range: string;
};

export const TEMPO_MARKINGS: readonly TempoMarking[] = [
  { name: 'Larghissimo', min: BPM_MIN, max: 19, range: '<20' },
  { name: 'Grave', min: 20, max: 39, range: '20-39' },
  { name: 'Lento', min: 40, max: 44, range: '40-44' },
  { name: 'Largo', min: 45, max: 49, range: '45-49' },
  { name: 'Larghetto', min: 50, max: 54, range: '50-54' },
  { name: 'Adagio', min: 55, max: 64, range: '55-64' },
  { name: 'Adagietto', min: 65, max: 68, range: '65-68' },
  { name: 'Andante moderato', min: 69, max: 72, range: '69-72' },
  { name: 'Andante', min: 73, max: 77, range: '73-77' },
  { name: 'Andantino', min: 78, max: 82, range: '78-82' },
  { name: 'Marcia moderato', min: 83, max: 85, range: '83-85' },
  { name: 'Moderato', min: 86, max: 97, range: '86-97' },
  { name: 'Allegretto', min: 98, max: 109, range: '98-109' },
  { name: 'Allegro', min: 110, max: 131, range: '110-131' },
  { name: 'Vivace', min: 132, max: 139, range: '132-139' },
  { name: 'Vivacissimo', min: 140, max: 149, range: '140-149' },
  { name: 'Allegrissimo', min: 150, max: 167, range: '150-167' },
  { name: 'Presto', min: 168, max: 177, range: '168-177' },
  { name: 'Prestissimo', min: 178, max: BPM_MAX, range: '>177' },
];

export function tempoMarkingFor(bpm: number): TempoMarking {
  return TEMPO_MARKINGS.find((m) => bpm >= m.min && bpm <= m.max) ?? TEMPO_MARKINGS[0];
}

export function tempoLabel(bpm: number): string {
  return tempoMarkingFor(bpm).name;
}

export function beatCount(ts: TimeSignature): number {
  return parseInt(ts.split('/')[0], 10);
}
