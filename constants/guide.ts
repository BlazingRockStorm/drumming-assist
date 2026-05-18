import guideData from '@/data/guide.json';

export interface GuideSection {
  title: string;
  items: string[];
}

// Sourced from a local JSON file for now; will be replaced by an API
// response with the same shape in the future.
export const GUIDE_SECTIONS: GuideSection[] = guideData as GuideSection[];
