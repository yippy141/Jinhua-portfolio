// data/places.ts
//
// Typed registry of meaningful places shown as quiet beacons on the orbital
// surface. "life-anchor" places are cities with a real personal connection;
// "visited" is reserved for a future travel layer and is not rendered yet.
// Coordinates are public city centroids, never private addresses.
//
// Summaries are short and first-person (see VOICE.md). They appear only on hover,
// keyboard focus, or when pinned; there are no permanently visible city labels.

export type PlaceKind = "life-anchor" | "visited";

export interface Place {
  id: string;
  city: string;
  region?: string; // country or region
  coordinates: [number, number]; // [lng, lat], public city centroid
  kind: PlaceKind;
  summary: string; // hover / focus caption
  roles?: string[]; // what I did there (derived from the summary, no new facts)
  period?: string; // when, when there is a clear one
  lastVisited?: string; // ISO date, for the future "visited" layer
  priority: number; // 1 = most prominent (current base); higher = quieter
}

// City centroids (public, from standard gazetteer coordinates).
export const places: Place[] = [
  {
    id: "washington-dc",
    city: "Washington, D.C.",
    coordinates: [-77.0369, 38.9072],
    kind: "life-anchor",
    summary:
      "I completed my MA at SAIS and worked across several political-risk and technology-policy roles. It is my current base.",
    roles: ["MA, SAIS", "Political-risk and technology-policy roles"],
    period: "Current base",
    priority: 1,
  },
  {
    id: "vancouver",
    city: "Vancouver",
    region: "Canada",
    coordinates: [-123.1207, 49.2827],
    kind: "life-anchor",
    summary:
      "I was born here and later returned to study international relations at UBC.",
    roles: ["Born here", "BA in international relations, UBC"],
    priority: 2,
  },
  {
    id: "shanghai",
    city: "Shanghai",
    region: "China",
    coordinates: [121.4737, 31.2304],
    kind: "life-anchor",
    summary:
      "I spent much of my childhood and teenage years here and graduated from high school in the city.",
    roles: ["Childhood and teenage years", "Graduated high school"],
    priority: 2,
  },
  {
    id: "hong-kong",
    city: "Hong Kong",
    coordinates: [114.1694, 22.3193],
    kind: "life-anchor",
    summary:
      "Home to relatives and the place where I helped build Sampan, an early-stage technology startup.",
    roles: ["Family", "Sampan, early-stage startup"],
    priority: 2,
  },
  {
    id: "ottawa",
    city: "Ottawa",
    region: "Canada",
    coordinates: [-75.6972, 45.4215],
    kind: "life-anchor",
    summary:
      "I worked at Environment and Climate Change Canada and Global Affairs Canada during 2020–21, including through the first year of COVID.",
    roles: ["Environment and Climate Change Canada", "Global Affairs Canada"],
    period: "2020–21",
    priority: 2,
  },
  {
    id: "beijing",
    city: "Beijing",
    region: "China",
    coordinates: [116.4074, 39.9042],
    kind: "life-anchor",
    summary: "Home to relatives and many of my Chinese New Year memories.",
    roles: ["Family"],
    priority: 3,
  },
  {
    id: "singapore",
    city: "Singapore",
    coordinates: [103.8198, 1.3521],
    kind: "life-anchor",
    summary: "Home to relatives and a city I return to regularly.",
    roles: ["Family"],
    priority: 3,
  },
  {
    id: "paris",
    city: "Paris",
    region: "France",
    coordinates: [2.3522, 48.8566],
    kind: "life-anchor",
    summary:
      "I studied at Sciences Po during summer 2018 and watched France win the World Cup.",
    roles: ["Sciences Po"],
    period: "Summer 2018",
    priority: 3,
  },
];

// Only life-anchor markers are rendered in this task.
export const lifeAnchors = places.filter((p) => p.kind === "life-anchor");
