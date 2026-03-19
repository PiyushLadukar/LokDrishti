const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://lokdrishti.onrender.com";
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── MPs ──────────────────────────────────────────
export const getMPs = (params?: string) =>
  fetchAPI<any>(`/mps${params ? `?${params}` : ""}`);

export const searchMPs = (q: string, page = 1) =>
  fetchAPI<any>(`/mps/search?q=${encodeURIComponent(q)}&page=${page}`);

export const getMPByName = (name: string) =>
  fetchAPI<any>(`/mps/${encodeURIComponent(name)}`);

export const compareMPs = (mp1: string, mp2: string) =>
  fetchAPI<any>(`/mps/compare?mp1=${encodeURIComponent(mp1)}&mp2=${encodeURIComponent(mp2)}`);

export const getSilentMPs = (state?: string, party?: string) => {
  const params = new URLSearchParams();
  if (state) params.set("state", state);
  if (party) params.set("party", party);
  return fetchAPI<any>(`/mps/silent?${params}`);
};

// ── Rankings ─────────────────────────────────────
export const getNationalRankings = (topN?: number, page = 1, pageSize = 20) => {
  const params = new URLSearchParams();
  if (topN) params.set("top_n", String(topN));
  params.set("page", String(page));
  params.set("page_size", String(pageSize));
  return fetchAPI<any>(`/rankings/national?${params}`);
};

export const getStateRankings = (state: string, topN?: number) => {
  const params = topN ? `?top_n=${topN}` : "";
  return fetchAPI<any>(`/rankings/state/${encodeURIComponent(state)}${params}`);
};

export const getPartyRankings = (party: string, topN?: number) => {
  const params = topN ? `?top_n=${topN}` : "";
  return fetchAPI<any>(`/rankings/party/${encodeURIComponent(party)}${params}`);
};

export const getStateLeaderboard = () =>
  fetchAPI<any>(`/rankings/leaderboard/state`);

export const getPartyLeaderboard = () =>
  fetchAPI<any>(`/rankings/leaderboard/party`);

export const getPercentileBand = (min: number, max: number) =>
  fetchAPI<any>(`/rankings/percentile?min=${min}&max=${max}`);

// ── Analytics ────────────────────────────────────
export const getStateStrength = () =>
  fetchAPI<any>(`/analytics/state-strength`);

export const getPartyDominance = () =>
  fetchAPI<any>(`/analytics/party-dominance`);

export const getInequality = () =>
  fetchAPI<any>(`/analytics/inequality`);

export const getImbalance = () =>
  fetchAPI<any>(`/analytics/imbalance`);