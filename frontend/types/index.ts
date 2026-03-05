export interface MP {
  name: string;
  state: string;
  party: string;
  constituency: string;
  attendance: number;
  debates: number;
  questions: number;
  LCI_score: number;
  national_rank: number;
  state_rank: number;
  party_rank: number;
  percentile: number;
  engagement_index: number;
  silent_flag: boolean | number;
}

export interface PaginatedResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  data: MP[];
}

export interface CompareResponse {
  mp1: MP;
  mp2: MP;
  diff: Record<string, number>;
  winner: Record<string, string>;
}

export interface StateStrength {
  state: string;
  total_mps: number;
  avg_lci: number;
  avg_attendance: number;
  avg_debates: number;
  avg_questions: number;
  state_strength_index: number;
  state_rank: number;
}

export interface PartyDominance {
  party: string;
  total_mps: number;
  avg_lci: number;
  avg_percentile: number;
  avg_engagement: number;
  party_dominance_index: number;
  party_rank: number;
}

export interface Inequality {
  state: string;
  performance_std: number;
}

export interface Imbalance {
  state: string;
  total_mps: number;
  avg_lci: number;
  expected_strength: number;
  actual_strength: number;
  imbalance_score: number;
}

export interface AnalyticsResponse<T> {
  data: T[];
  [key: string]: any;
}