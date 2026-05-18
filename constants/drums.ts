import drumsData from '@/data/drums.json';

export interface DrumNote {
  note: string;
  frequency: number;
}

export interface DrumHeadTuning {
  low: DrumNote;
  target: DrumNote;
  high: DrumNote;
}

export interface Drum {
  id: string;
  name: string;
  size: string;
  depth?: string;
  color: string;
  description: string;
  batter: DrumHeadTuning;
  resonant?: DrumHeadTuning;
  tips: string[];
}

// Sourced from a local JSON file for now; will be replaced by an API
// response with the same shape in the future.
export const DRUMS: Drum[] = drumsData as Drum[];
