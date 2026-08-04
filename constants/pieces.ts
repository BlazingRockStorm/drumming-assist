import { DRUMS } from '@/constants/drums';

export type PieceCategory = 'drum' | 'cymbal' | 'percussion';

export interface KitPiece {
  id: string;
  name: string;
  /** Color dot in the customizer; drums use their tuning color, others neutral. */
  color?: string;
  category: PieceCategory;
  /** Whether the tuner supports this piece (only drums are tunable today). */
  tunable: boolean;
  /** Not yet available to add to a kit. */
  comingSoon?: boolean;
}

// Tunable drums, sourced from the existing drum catalog so they stay in sync.
const DRUM_PIECES: KitPiece[] = DRUMS.map((d) => ({
  id: d.id,
  name: d.name,
  color: d.color,
  category: 'drum',
  tunable: true,
}));

// Non-tunable pieces the customizer can add/remove but the tuner ignores.
const CYMBAL_PIECES: KitPiece[] = [
  { id: 'hihat', name: 'Hi-Hat', category: 'cymbal', tunable: false },
  { id: 'crash', name: 'Crash Cymbal', category: 'cymbal', tunable: false },
  { id: 'ride', name: 'Ride Cymbal', category: 'cymbal', tunable: false },
];

// Placeholder pieces shown under "Coming Soon" — not addable yet.
const COMING_SOON_PIECES: KitPiece[] = [
  { id: 'cowbell', name: 'Cowbell', category: 'percussion', tunable: false, comingSoon: true },
  { id: 'tambourine', name: 'Tambourine', category: 'percussion', tunable: false, comingSoon: true },
];

export const KIT_PIECES: KitPiece[] = [
  ...DRUM_PIECES,
  ...CYMBAL_PIECES,
  ...COMING_SOON_PIECES,
];

/** Pieces a kit starts with: all tunable drums. */
export const DEFAULT_IN_KIT: string[] = DRUM_PIECES.map((p) => p.id);

export function getPiece(id: string): KitPiece | undefined {
  return KIT_PIECES.find((p) => p.id === id);
}
