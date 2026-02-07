import type { CityScenario } from "../types";

const CITYWEFT_PITTSBURGH_MODEL_URL =
  import.meta.env.VITE_CITYWEFT_PITTSBURGH_MODEL_URL ?? "/models/pittsburgh-cityweft.glb";

const CITATIONS = {
  ballotQuestions: {
    title: "2025 Ballot Questions for May 20, 2025 - Primary Election",
    url: "https://www.lwvpgh.org/ballot",
  },
  cityBudget: {
    title: "City of Pittsburgh Office of Management and Budget - Budgets and Reports",
    url: "https://www.pittsburghpa.gov/City-Government/Finance-Budget/Management-Budget/Budgets-and-Reports",
  },
  countyBudget: {
    title: "Allegheny County Budget and Finance - County Budgets",
    url: "https://www.alleghenycounty.us/Government/Department-Directory/Budget-and-Finance/County-Budgets",
  },
  prt: {
    title: "Pittsburgh Regional Transit Service and Planning",
    url: "https://www.rideprt.org/",
  },
  pointPark: {
    title: "Point State Park Visitor and Stewardship Info",
    url: "https://www.pa.gov/agencies/dcnr/recreation/where-to-go/state-parks/find-a-park/point-state-park",
  },
  downtownPartnership: {
    title: "Pittsburgh Downtown Partnership",
    url: "https://downtownpittsburgh.com/",
  },
  housing: {
    title: "Urban Redevelopment Authority of Pittsburgh - Housing",
    url: "https://www.ura.org/pages/housing",
  },
  sheriff: {
    title: "Allegheny County Sheriff's Office",
    url: "https://sheriffalleghenycounty.com/",
  },
  pointParkUniversity: {
    title: "Point Park University",
    url: "https://www.pointpark.edu/",
  },
  conventionCenter: {
    title: "David L. Lawrence Convention Center",
    url: "https://www.pittsburghcc.com/",
  },
  cityCouncil: {
    title: "Pittsburgh City Council",
    url: "https://www.pittsburghpa.gov/City-Government/City-Council",
  },
};

export const PITTSBURGH_SCENARIO: CityScenario = {
  city: {
    id: "pittsburgh",
    name: "Pittsburgh - Downtown",
    model: {
      sourceName: "Cityweft",
      sourceUrl: "https://cityweft.com",
      modelUrl: CITYWEFT_PITTSBURGH_MODEL_URL,
      targetRadius: 4.6,
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
      },
    },
    camera: {
      position: [4.6, 4.5, 4.6],
      target: [0, 0.72, 0],
      fov: 40,
      minDistance: 3.8,
      maxDistance: 9.5,
      minPolarAngle: 0.45,
      maxPolarAngle: 1.34,
    },
  },
  annotations: [
    {
      id: "pgh-water",
      topic: "water",
      title: "Confluence Water Infrastructure",
      markerLabel: "Water",
      highlightedBuilding: "Point State Park river confluence edge",
      mapPoint: [-0.736, -0.861],
      text:
        "Downtown stormwater and sewer performance at the Point is directly tied to public-control investment decisions. Ballot Question 2 keeps water and sewer ownership public, which affects long-term reliability in the riverfront core.",
      citations: [CITATIONS.ballotQuestions, CITATIONS.cityBudget],
      nodeNames: ["waterway_2", "water_12"],
    },
    {
      id: "pgh-environment",
      topic: "environment",
      title: "Point State Park Tree Canopy",
      markerLabel: "Environment",
      highlightedBuilding: "Point State Park tree canopy and lawn edge",
      mapPoint: [-0.374, -0.163],
      text:
        "Climate and park funding decisions show up visibly in the Downtown core through canopy coverage, heat mitigation, and stormwater retention around Point State Park's most-used paths.",
      citations: [CITATIONS.pointPark, CITATIONS.cityBudget],
      nodeNames: ["tree_556", "tree_557", "tree_558", "tree_559"],
    },
    {
      id: "pgh-transit",
      topic: "transit",
      title: "Gateway and Steel Plaza Transit Spine",
      markerLabel: "Transit",
      highlightedBuilding: "Gateway/Steel Plaza street-and-transit corridor",
      mapPoint: [-0.371, -0.215],
      text:
        "This corridor is one of the highest-friction places for transfers, bus priority, and sidewalk safety. Mayoral and transit-funding choices determine whether Downtown moves faster or bottlenecks.",
      citations: [CITATIONS.prt, CITATIONS.downtownPartnership],
      nodeNames: ["roadwayIntersection_151", "roadwayIntersection_152", "roadwayIntersection_153"],
    },
    {
      id: "pgh-housing",
      topic: "housing",
      title: "Gateway Center Residential Conversions",
      markerLabel: "Housing",
      highlightedBuilding: "Gateway Center apartment conversion blocks",
      mapPoint: [0.069, -0.245],
      text:
        "Downtown housing supply depends on office-to-residential conversions, utility costs, and city incentives. Local policy affects whether these blocks become mixed-income housing or remain underused inventory.",
      citations: [CITATIONS.housing, CITATIONS.cityBudget],
      nodeNames: ["Simple  OSM buildings_20", "Simple  OSM buildings_52"],
    },
    {
      id: "pgh-jobs",
      topic: "jobs",
      title: "Office Core Jobs Recovery",
      markerLabel: "Jobs",
      highlightedBuilding: "PPG Place and Grant Street office cluster",
      mapPoint: [-0.087, 0.338],
      text:
        "Downtown employment recovery is concentrated in this office core. Business district policy, transit reliability, and public realm investment all influence whether employers keep expanding in the Golden Triangle.",
      citations: [CITATIONS.downtownPartnership, CITATIONS.cityBudget],
      nodeNames: ["Simple  OSM buildings_141", "Simple  OSM buildings_126"],
    },
    {
      id: "pgh-civil-rights",
      topic: "civil_rights",
      title: "City Contracting and Civil Rights Protections",
      markerLabel: "Rights",
      highlightedBuilding: "City-County Building civic services block",
      mapPoint: [-0.096, -0.021],
      text:
        "Question 1's anti-discrimination language matters most where residents interact with city contracts and services. In Downtown, this block is where those protections become practical policy.",
      citations: [CITATIONS.ballotQuestions, CITATIONS.cityCouncil],
      nodeNames: ["Simple  OSM buildings_132", "Simple  OSM buildings_130"],
    },
    {
      id: "pgh-government",
      topic: "government",
      title: "Charter Governance in the Civic Core",
      markerLabel: "Gov",
      highlightedBuilding: "City-County governance corridor",
      mapPoint: [-0.138, -0.205],
      text:
        "Questions 1 through 3 are structural charter decisions, not one-off projects. Their long-term effects are felt in how this civic core writes rules, reviews powers, and responds to public petition efforts.",
      citations: [CITATIONS.ballotQuestions, CITATIONS.cityCouncil],
      nodeNames: ["Simple  OSM buildings_149", "Simple  OSM buildings_147"],
    },
    {
      id: "pgh-public-safety",
      topic: "public_safety",
      title: "Grant Street Public Safety Operations",
      markerLabel: "Safety",
      highlightedBuilding: "Grant Street emergency response corridor",
      mapPoint: [-0.06, -0.307],
      text:
        "This Downtown corridor carries court access, emergency routing, and high-volume pedestrian movement. Public safety race outcomes shape staffing, deployment priorities, and response time performance here.",
      citations: [CITATIONS.sheriff, CITATIONS.cityBudget],
      nodeNames: ["roadwayIntersection_64", "roadwayIntersection_95", "Simple  OSM buildings_149"],
    },
    {
      id: "pgh-education",
      topic: "education",
      title: "Point Park University District",
      markerLabel: "Schools",
      highlightedBuilding: "Point Park University classroom and student corridor",
      mapPoint: [0.187, 0.095],
      text:
        "Downtown student life depends on safe late-hour transit, walkability, and affordable nearby housing. City executive priorities determine whether this education cluster remains accessible to local students.",
      citations: [CITATIONS.pointParkUniversity, CITATIONS.prt],
      nodeNames: ["Simple  OSM buildings_50", "Simple  OSM buildings_49"],
    },
    {
      id: "pgh-healthcare",
      topic: "healthcare",
      title: "Downtown Emergency Access Routes",
      markerLabel: "Health",
      highlightedBuilding: "Grant Street urgent-care and EMS access path",
      mapPoint: [0.026, -0.206],
      text:
        "Even without a major hospital inside the core, Downtown relies on fast emergency routing to nearby medical campuses. Street operations, signal timing, and congestion policy determine that access window.",
      citations: [CITATIONS.prt, CITATIONS.cityBudget],
      nodeNames: ["roadwayIntersection_79", "roadwayIntersection_80", "roadwayIntersection_81"],
    },
    {
      id: "pgh-family",
      topic: "family",
      title: "Family Space at the Point",
      markerLabel: "Family",
      highlightedBuilding: "Point State Park family recreation edge",
      mapPoint: [-0.329, -0.139],
      text:
        "Families use this park edge for events, festivals, and daily recreation. Budget and public-space policy decisions influence maintenance, safety, and inclusive programming in this exact area.",
      citations: [CITATIONS.pointPark, CITATIONS.cityBudget],
      nodeNames: ["tree_361", "tree_363", "tree_364"],
    },
    {
      id: "pgh-immigration",
      topic: "immigration",
      title: "Market Square Small-Business Corridor",
      markerLabel: "Immigration",
      highlightedBuilding: "Market Square immigrant-owned storefront corridor",
      mapPoint: [0.076, 0.274],
      text:
        "Small-business permitting, city procurement access, and anti-discrimination enforcement affect immigrant-owned businesses clustered in and around this Downtown retail spine.",
      citations: [CITATIONS.ballotQuestions, CITATIONS.downtownPartnership],
      nodeNames: ["Simple  OSM buildings_46", "Simple  OSM buildings_48"],
    },
    {
      id: "pgh-technology",
      topic: "technology",
      title: "Digital Economy Growth Near the Riverfront",
      markerLabel: "Tech",
      highlightedBuilding: "Downtown innovation office cluster near the Cultural District",
      mapPoint: [0.041, 0.789],
      text:
        "Downtown tech hiring is sensitive to office quality, transit access, and procurement pipelines. Technology growth in this cluster follows the city's broader workforce and infrastructure choices.",
      citations: [CITATIONS.downtownPartnership, CITATIONS.cityBudget],
      nodeNames: ["Simple  OSM buildings_190", "Simple  OSM buildings_189"],
    },
    {
      id: "pgh-taxes",
      topic: "taxes",
      title: "County Finance and Tax Administration Core",
      markerLabel: "Taxes",
      highlightedBuilding: "County finance and assessment administration block",
      mapPoint: [-0.093, 0.339],
      text:
        "Property assessments and budget decisions made in this public administration core drive downstream impacts on services, public works, and long-term tax pressure in the city center.",
      citations: [CITATIONS.countyBudget, CITATIONS.cityBudget],
      nodeNames: ["Simple  OSM buildings_126", "Simple  OSM buildings_132"],
    },
    {
      id: "pgh-foreign-policy",
      topic: "foreign_policy",
      title: "International Commerce and Events Interface",
      markerLabel: "Foreign Policy",
      highlightedBuilding: "Convention Center and riverfront international-events edge",
      mapPoint: [-0.393, 0.339],
      text:
        "Downtown's global-facing venues make local governance choices visible to international partners. Questions 1 and 3 were both shaped by debates over where city authority meets global politics.",
      citations: [CITATIONS.ballotQuestions, CITATIONS.conventionCenter],
      nodeNames: ["Simple  OSM buildings_126", "Simple  OSM buildings_132"],
    },
  ],
};
