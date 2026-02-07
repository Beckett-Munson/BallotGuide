import type { UserProfile, PersonalizedBallot } from "@/types/ballot";

const ALL_BALLOT_ITEMS = [
  {
    id: "question-1",
    title: "Non-Discrimination in City Business & Foreign State Affiliations",
    category: "civil_rights",
    officialText:
      'Shall the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions, be supplemented by adding a new Section, "105. Local Governance", by prohibiting the discrimination on the basis of race, religion, ancestry, sex, sexual orientation, age, gender identity or expression, disability, place of birth, national origin or association or affiliation with any nation or foreign state in conducting business of the City?',
    annotations: {
      default:
        "This amendment would add anti-discrimination language to Pittsburgh's Home Rule Charter, specifically prohibiting the city from discriminating based on association or affiliation with any nation or foreign state when conducting business. It was passed unanimously by City Council.",
      civil_rights:
        "This directly addresses civil rights protections. The amendment would enshrine broad anti-discrimination language into the city's governing document, covering race, religion, sex, sexual orientation, gender identity, disability, national origin, and foreign state affiliation in all city business dealings.",
      foreign_policy:
        "This measure has a significant foreign policy dimension. It would prohibit the city from discriminating against businesses based on their affiliation with any foreign nation, reflecting Pittsburgh's role in the global economy and the practical difficulty of investigating all foreign business ties.",
      jobs:
        "This affects local business and employment. By prohibiting discrimination based on foreign state affiliation, the measure aims to keep Pittsburgh competitive in attracting multinational companies and maintaining a diverse business environment.",
      government:
        "This changes Pittsburgh's governing charter. City Council passed this unanimously in response to a citizen's initiative, adding permanent anti-discrimination protections to the Home Rule Charter's foundational principles.",
      immigration:
        "This measure protects against discrimination based on national origin and foreign state affiliation, directly affecting immigrant communities and businesses with international ties in Pittsburgh.",
    },
    expand: {
      newsSummary:
        "City Council passed this measure unanimously in response to a citizens' initiative by the group 'Not on Our Dime,' which sought to prohibit Pittsburgh from doing business with companies affiliated with countries accused of genocide or apartheid. The citizen's initiative was withdrawn after failing to meet requirements, but Council added this broader anti-discrimination language to the charter instead.",
      citations: [
        {
          title: "City of Pittsburgh Ballot Question 1 — Full Text",
          url: "https://pittsburghpa.gov/city-clerk/ballot-questions",
          source: "City of Pittsburgh",
        },
        {
          title: "2025 Ballot Questions for Allegheny County",
          url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
          source: "League of Women Voters of Greater Pittsburgh",
        },
      ],
    },
  },
  {
    id: "question-2",
    title: "Public Ownership of Water & Sewer Systems",
    category: "water",
    officialText:
      'Shall the Pittsburgh Home Rule Charter be amended and supplemented by adding a new Article 11: RIGHT TO PUBLIC OWNERSHIP OF POTABLE WATER SYSTEMS, WASTEWATER SYSTEM, AND STORM SEWER SYSTEMS, which restricts the lease and/or sale of the City\'s water and sewer system to private entities?',
    annotations: {
      default:
        "This amendment would prohibit the sale of Pittsburgh's water, sewer, and stormwater utilities to private companies. Pittsburgh Water (formerly PWSA) is currently public, and this measure would ensure it stays that way permanently.",
      water:
        "This directly protects your water and sewer services. Pittsburgh Water could legally purchase the city's infrastructure for $1 in fall 2025, and could then sell it privately. This amendment would block any future privatization of these essential utilities.",
      environment:
        "Water and sewer infrastructure is critical for environmental health. Keeping these utilities public ensures that decisions about stormwater management, water quality, and environmental protections remain accountable to voters rather than private shareholders.",
      taxes:
        "Privatization of water utilities in Pennsylvania has historically led to rate increases for consumers. This measure would keep pricing decisions under public control, potentially affecting your water and sewer bills long-term.",
      housing:
        "Water and sewer costs are a significant part of housing expenses. Keeping these utilities public could help stabilize utility costs for homeowners and renters, as private utilities in PA have frequently raised rates after acquisition.",
      government:
        "This is a significant change to Pittsburgh's governance structure, permanently restricting the city's ability to sell public infrastructure. Both City Council (unanimously) and Pittsburgh Water's board support this amendment.",
      public_safety:
        "Clean drinking water and functioning sewer systems are fundamental public safety concerns. This measure ensures these critical systems remain under public oversight and accountability.",
    },
    expand: {
      newsSummary:
        "Pittsburgh Water (PW), formerly PWSA, was formed in 1995 under a 'rent to own' arrangement allowing it to purchase the city's water infrastructure for $1 in fall 2025. A 2016 Pennsylvania law made it easier for private companies to purchase public utilities, leading to increased privatization across the state. While PW is committed to remaining public and no company is currently trying to buy it, this amendment would permanently prevent future privatization. The measure was passed unanimously by City Council and signed by the Mayor.",
      citations: [
        {
          title: "City of Pittsburgh Ballot Question 2 — Full Text",
          url: "https://pittsburghpa.gov/city-clerk/ballot-questions",
          source: "City of Pittsburgh",
        },
        {
          title: "2025 Ballot Questions for Allegheny County",
          url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
          source: "League of Women Voters of Greater Pittsburgh",
        },
        {
          title: "Pennsylvania Fair Market Value Act (Act 12 of 2016)",
          url: "https://www.legis.state.pa.us/cfdocs/legis/li/uconsCheck.cfm?yr=2016&sessInd=0&act=12",
          source: "Pennsylvania General Assembly",
        },
      ],
    },
  },
  {
    id: "question-3",
    title: "Limits on Charter Amendment Process",
    category: "government",
    officialText:
      'Shall the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions, be supplemented by adding a new section, "104. Amendments to Charter", by prohibiting the use of the Home Rule Charter Amendment process to add duties or obligations beyond the lawful scope of the city\'s authority?',
    annotations: {
      default:
        "This amendment would restrict citizens' ability to place charter amendments on the ballot if those amendments add duties or obligations that go beyond the city's legal authority under the PA and US Constitutions. Two council members opposed it, arguing it limits citizens' initiative rights.",
      government:
        "This directly affects how Pittsburgh governs itself. It would limit the citizen initiative process by preventing ballot measures that conflict with state or federal constitutions, potentially shifting the burden of determining legality onto citizens before they can collect signatures.",
      civil_rights:
        "This measure has civil rights implications on both sides — it aims to prevent unconstitutional amendments, but critics argue it restricts the democratic right of citizens to use the ballot initiative process to advocate for change.",
      foreign_policy:
        "This measure was prompted by a citizen initiative that would have prohibited Pittsburgh from doing business with countries accused of genocide. The amendment would prevent similar foreign-policy-oriented charter changes in the future, as foreign policy is generally a federal responsibility.",
    },
    expand: {
      newsSummary:
        "This measure was passed in response to the 'Not on Our Dime' citizen initiative, which sought to divest Pittsburgh from companies doing business with countries accused of genocide, specifically naming Israel. The initiative was withdrawn after failing to meet requirements. Unlike the other two questions, this measure did not pass unanimously — two council members opposed it because it restricts citizens' rights to use the ballot initiative process. Critics argue it shifts the burden of determining constitutional legality onto citizen groups before they can even begin collecting signatures.",
      citations: [
        {
          title: "City of Pittsburgh Ballot Question 3 — Full Text",
          url: "https://pittsburghpa.gov/city-clerk/ballot-questions",
          source: "City of Pittsburgh",
        },
        {
          title: "2025 Ballot Questions for Allegheny County",
          url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
          source: "League of Women Voters of Greater Pittsburgh",
        },
      ],
    },
  },
];

const ALL_RACE_ITEMS = [
  {
    id: "race-mayor",
    title: "Mayor of Pittsburgh",
    category: "office",
    officialText:
      "Vote for one candidate for Mayor of the City of Pittsburgh. The mayor serves a four-year term and is the chief executive officer of the city, responsible for administering city operations, proposing the annual budget, and appointing department heads.",
    annotations: {
      default:
        "The mayoral race features competitive primaries on both sides. Democrats Ed Gainey (incumbent) and Corey O'Connor, and Republicans Tony Moreno and Thomas West are running. The race reflects Pittsburgh at a crossroads — recovering from COVID-era disruptions while facing challenges in downtown real estate, public safety, and infrastructure.",
      jobs:
        "The next mayor will shape Pittsburgh's economic recovery. Downtown office vacancies have surged post-COVID, and the mayor's approach to attracting businesses, supporting small enterprises, and managing the city's workforce will directly impact local employment.",
      housing:
        "Housing affordability is a central campaign issue. The next mayor will influence zoning policy, development incentives, and tenant protections as Pittsburgh grapples with rising housing costs in popular neighborhoods.",
      public_safety:
        "Public safety has been a defining issue. Candidates have debated approaches to policing, gun violence reduction, and community safety programs. The mayor oversees the Bureau of Police and sets public safety priorities.",
      taxes:
        "The mayor proposes Pittsburgh's annual budget and influences tax policy. With changing downtown economics, the next mayor will need to address potential revenue shortfalls while maintaining city services.",
      environment:
        "Environmental policy is a key differentiator. The mayor shapes the city's climate action plan, controls infrastructure investment in flood mitigation, and influences sustainability initiatives across departments.",
      transit:
        "The mayor works with Port Authority and state officials on transit funding and planning. Transportation infrastructure investment and connections between neighborhoods are key issues in this race.",
      government:
        "This race will determine the executive leadership of Pittsburgh's government for the next four years. The mayor appoints department heads, proposes the budget, and sets the administration's policy priorities.",
    },
    expand: {
      newsSummary:
        "The Democratic primary features incumbent Ed Gainey facing challenger Corey O'Connor, a former City Council member and son of the late Mayor Bob O'Connor. The Republican primary has Tony Moreno and Thomas West competing. Key issues include downtown revitalization, public safety, infrastructure, and the city's financial health post-COVID.",
      citations: [
        {
          title: "Pittsburgh's 2025 Mayoral Primaries — Candidate Guide",
          url: "https://www.publicsource.org/pittsburgh-mayoral-primary-2025-candidate-highlights-achievements-endorsements-democrat-republican/",
          source: "PublicSource",
        },
        {
          title: "Top Races on Today's Ballot in Pittsburgh and Allegheny County",
          url: "https://www.wesa.fm/2025-05-20/pittsburgh-allegheny-county-2025-primary",
          source: "90.5 WESA",
        },
      ],
    },
  },
  {
    id: "race-common-pleas",
    title: "Allegheny County Court of Common Pleas (8 Seats)",
    category: "office",
    officialText:
      "Vote for up to eight candidates for Judge of the Court of Common Pleas of Allegheny County. Judges serve a 10-year term and preside over civil and criminal cases in the county's trial court, including family, civil, criminal, and orphans' court divisions.",
    annotations: {
      default:
        "Eight seats are open on the county's main trial court due to a wave of retirements — 22 candidates are competing. Combined with a similar 2021 contest, over one-third of the county bench will have turned over in four years. These judges handle everything from criminal cases to family disputes.",
      civil_rights:
        "Judges on the Court of Common Pleas make critical decisions affecting civil rights — from criminal sentencing disparities to family court custody decisions. The composition of the bench directly impacts how justice is administered across communities.",
      public_safety:
        "These judges handle criminal cases in Allegheny County, setting bail, conducting trials, and imposing sentences. Their approach to criminal justice — whether emphasizing rehabilitation or punishment — affects public safety outcomes county-wide.",
      government:
        "This is an unusually consequential judicial election. With 8 of the court's seats open, voters will reshape over one-third of the bench in a single election cycle. Judicial elections rarely get much attention, but these judges make daily decisions that affect thousands of residents.",
      jobs:
        "The Court of Common Pleas handles business disputes, contract enforcement, and employment law cases. The judges elected here will influence the legal environment for businesses and workers throughout Allegheny County.",
    },
    expand: {
      newsSummary:
        "A total of 22 candidates are seeking 8 open seats, making this one of the largest judicial contests in recent county history. The wave of retirements creating these vacancies means voters have an unusual opportunity to reshape the bench. Candidates range from experienced attorneys to sitting magistrate judges, with backgrounds spanning criminal defense, prosecution, family law, and civil litigation.",
      citations: [
        {
          title: "Election Results: Allegheny County Judicial Races",
          url: "https://www.wesa.fm/2025-05-20/pittsburgh-allegheny-county-2025-primary",
          source: "90.5 WESA",
        },
      ],
    },
  },
  {
    id: "race-county-council-1",
    title: "Allegheny County Council — District 1",
    category: "office",
    officialText:
      "Vote for one candidate for Allegheny County Council, District 1. Council members serve a four-year term on the 15-member legislative body that passes the county budget, enacts ordinances, and provides oversight of county operations.",
    annotations: {
      default:
        "District 1 has a contested Democratic primary between Kathleen Madonna-Emmerling and Carl Villella, replacing incumbent Jack Betkowski. Republican Mary Jo Wise is running unopposed on the GOP side. County Council controls the county budget and passes local ordinances.",
      government:
        "County Council is the legislative branch of Allegheny County government. Council members set policy, approve the budget, and provide oversight. This seat is being vacated by incumbent Jack Betkowski, creating an open-seat race.",
      taxes:
        "County Council approves the county budget and sets property tax rates. The person elected to this seat will vote on how county tax revenue is spent across departments and services.",
    },
    expand: {
      newsSummary:
        "Democrats Kathleen Madonna-Emmerling and Carl Villella are competing to replace retiring incumbent Jack Betkowski. The winner of the Democratic primary will likely face Republican Mary Jo Wise, who is running unopposed, in the November general election.",
      citations: [
        {
          title: "Allegheny County Council Races — 2025 Primary",
          url: "https://www.wesa.fm/2025-05-20/pittsburgh-allegheny-county-2025-primary",
          source: "90.5 WESA",
        },
      ],
    },
  },
  {
    id: "race-county-council-9",
    title: "Allegheny County Council — District 9",
    category: "office",
    officialText:
      "Vote for one candidate for Allegheny County Council, District 9. Council members serve a four-year term on the 15-member legislative body that passes the county budget, enacts ordinances, and provides oversight of county operations.",
    annotations: {
      default:
        "For the first time in nearly 20 years, District 9 will have new representation. Incumbent Bob Macey announced his retirement, and Democrats Aaron Adams, Dylan Altemara, and Kelliane Frketic are seeking to replace him.",
      government:
        "This is a rare open-seat race — Bob Macey has held this seat for nearly two decades. The new council member will represent District 9 on the 15-member body that governs Allegheny County.",
      taxes:
        "As with all County Council seats, the person elected here will vote on county budgets, tax rates, and spending priorities that affect all Allegheny County residents.",
    },
    expand: {
      newsSummary:
        "Incumbent Democrat Bob Macey announced his retirement earlier this year, opening up the seat for the first time in nearly 20 years. Three Democrats — Aaron Adams, Dylan Altemara, and Kelliane Frketic — are competing in the primary.",
      citations: [
        {
          title: "Allegheny County Council Races — 2025 Primary",
          url: "https://www.wesa.fm/2025-05-20/pittsburgh-allegheny-county-2025-primary",
          source: "90.5 WESA",
        },
      ],
    },
  },
  {
    id: "race-school-board",
    title: "Pittsburgh Public Schools Board of Directors",
    category: "office",
    officialText:
      "Vote for candidates for the Board of Directors of Pittsburgh Public Schools. Board members serve four-year terms and are responsible for setting district policy, approving the school budget, and hiring the superintendent.",
    annotations: {
      default:
        "The school board oversees Pittsburgh Public Schools, which serves approximately 20,000 students. Board members set educational policy, approve the district budget, and hire the superintendent. Several seats are contested in this primary.",
      education:
        "This is the most directly impactful education race on your ballot. School board members determine curriculum standards, school funding priorities, teacher contracts, and building maintenance for all Pittsburgh public schools.",
      taxes:
        "The school board sets the school district's property tax rate, which is a significant portion of Pittsburgh homeowners' total property tax bills. Board decisions on spending directly affect your tax burden.",
      family:
        "If you have children in Pittsburgh Public Schools, this race directly affects their education. Board members decide on school closures, program offerings, special education services, and safety policies.",
      housing:
        "School quality significantly influences property values and housing decisions. The school board's direction affects the desirability and affordability of Pittsburgh neighborhoods.",
    },
    expand: {
      newsSummary:
        "Pittsburgh Public Schools has faced ongoing challenges including declining enrollment, aging facilities, and debates over school closures and consolidation. The board will also need to navigate the post-pandemic academic recovery and decisions about how to allocate federal relief funds.",
      citations: [
        {
          title: "Pittsburgh Public Schools Board Candidates",
          url: "https://www.publicsource.org/live-election-results-pittsburgh-mayoral-primaries/",
          source: "PublicSource",
        },
      ],
    },
  },
];

const TOPIC_EXPLANATIONS: Record<string, {
  topic: string;
  title: string;
  explanation: string;
  citations: { title: string; url: string; source: string }[];
}> = {
  civil_rights: {
    topic: "civil_rights",
    title: "Civil Rights on Your Ballot",
    explanation:
      "Civil rights are central to this election's ballot questions. Question 1 would enshrine broad anti-discrimination protections into Pittsburgh's Home Rule Charter, covering race, religion, sex, sexual orientation, gender identity, disability, national origin, and foreign state affiliation. Question 3 raises a different civil rights concern: while it aims to prevent unconstitutional charter amendments, critics argue it restricts citizens' democratic right to use the ballot initiative process. Together, these questions ask voters to weigh protecting individual rights against preserving the tools citizens use to advocate for change.",
    citations: [
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  water: {
    topic: "water",
    title: "Water & Utilities on Your Ballot",
    explanation:
      "Question 2 directly addresses the future of Pittsburgh's water and sewer infrastructure. Pittsburgh Water (formerly PWSA) has operated under a 'rent to own' arrangement since 1995 and can purchase the city's infrastructure for $1 in fall 2025. A 2016 Pennsylvania law made utility privatization easier, and several PA communities have seen private companies acquire their water systems — often leading to rate increases. This amendment would permanently block privatization, keeping water and sewer decisions accountable to voters. Both City Council and Pittsburgh Water's board support the measure.",
    citations: [
      {
        title: "Pennsylvania Water Utility Privatization Trends",
        url: "https://www.foodandwaterwatch.org/insight/water-privatization",
        source: "Food & Water Watch",
      },
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  government: {
    topic: "government",
    title: "Government Reform on Your Ballot",
    explanation:
      "All three ballot questions involve changes to Pittsburgh's Home Rule Charter — the city's foundational governing document. Question 1 adds anti-discrimination protections to city business dealings. Question 2 permanently restricts the city's ability to sell public water infrastructure. Question 3 limits the citizen initiative process to prevent charter amendments that exceed the city's legal authority. Together, these questions shape how Pittsburgh governs, what protections are enshrined in its charter, and how citizens can propose future changes. Questions 1 and 2 passed City Council unanimously, while Question 3 faced opposition from two members concerned about restricting democratic participation.",
    citations: [
      {
        title: "Pittsburgh Home Rule Charter",
        url: "https://pittsburghpa.gov/city-clerk/home-rule-charter",
        source: "City of Pittsburgh",
      },
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  foreign_policy: {
    topic: "foreign_policy",
    title: "Foreign Policy & Your Local Ballot",
    explanation:
      "Foreign policy is unusually prominent in this local election. All three ballot questions were prompted by the 'Not on Our Dime' citizen initiative, which sought to divest Pittsburgh from companies doing business with countries accused of genocide, specifically naming Israel. Though the initiative was withdrawn, City Council responded with these three charter amendments. Question 1 prohibits discrimination based on foreign state affiliation in city business. Question 3 would prevent similar foreign-policy-oriented charter changes in the future by limiting amendments to the city's lawful scope of authority.",
    citations: [
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  environment: {
    topic: "environment",
    title: "Environmental Issues on Your Ballot",
    explanation:
      "Question 2 has significant environmental implications. Pittsburgh's water, sewer, and stormwater systems are critical infrastructure for managing flooding, protecting water quality, and maintaining environmental health. Keeping these utilities public ensures that environmental considerations remain central to infrastructure decisions, rather than being driven by profit motives. Pittsburgh's aging stormwater infrastructure has contributed to combined sewer overflows that pollute local waterways — decisions about upgrading these systems will be shaped by whether they remain under public control.",
    citations: [
      {
        title: "Pittsburgh Combined Sewer Overflow Program",
        url: "https://www.alleghenycounty.us/sanitary-authority",
        source: "ALCOSAN",
      },
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  taxes: {
    topic: "taxes",
    title: "Tax & Cost Implications on Your Ballot",
    explanation:
      "While none of the 2025 ballot questions directly raise taxes, Question 2 has real cost implications. Across Pennsylvania, communities where water utilities were privatized have seen significant rate increases — sometimes 30-50% within a few years. Keeping Pittsburgh's water and sewer systems public gives voters more control over rate-setting decisions. The other two questions, while primarily about governance, could have indirect fiscal impacts through legal costs if charter amendments conflict with state or federal law.",
    citations: [
      {
        title: "Impact of Water Utility Privatization on Consumer Rates",
        url: "https://www.foodandwaterwatch.org/insight/water-privatization",
        source: "Food & Water Watch",
      },
    ],
  },
  housing: {
    topic: "housing",
    title: "Housing & Your Ballot",
    explanation:
      "Question 2 is most relevant to housing concerns. Water and sewer costs are a significant component of monthly housing expenses. In Pennsylvania communities where utilities were privatized, residents have seen substantial rate increases that directly affect housing affordability. Keeping Pittsburgh's water and sewer systems public helps stabilize one component of housing costs for both homeowners and renters.",
    citations: [
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  immigration: {
    topic: "immigration",
    title: "Immigration & Your Ballot",
    explanation:
      "Question 1 is particularly relevant to immigrant communities. The anti-discrimination amendment would protect against discrimination based on national origin, place of birth, and association with any foreign state in all city business dealings. This provides an additional layer of protection for Pittsburgh's growing immigrant communities and businesses with international ties.",
    citations: [
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  jobs: {
    topic: "jobs",
    title: "Jobs & Economy on Your Ballot",
    explanation:
      "Question 1 affects Pittsburgh's business environment by prohibiting discrimination based on foreign state affiliation when the city conducts business. This is designed to keep Pittsburgh competitive in attracting multinational companies and maintaining diverse business relationships. Question 2 also has economic implications — public utilities employ local workers and keep revenue within the community, while privatization can lead to workforce reductions and profits flowing to outside shareholders.",
    citations: [
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
  public_safety: {
    topic: "public_safety",
    title: "Public Safety & Your Ballot",
    explanation:
      "Question 2 has direct public safety implications. Clean drinking water and functioning sewer and stormwater systems are fundamental to public health and safety. Keeping these systems under public ownership ensures they remain accountable to voters and subject to public oversight, rather than being managed by private entities whose primary obligation is to shareholders.",
    citations: [
      {
        title: "2025 Ballot Questions for Allegheny County",
        url: "https://www.lwvpgh.org/content.aspx?page_id=22&club_id=486105&module_id=703063",
        source: "League of Women Voters of Greater Pittsburgh",
      },
    ],
  },
};

function getAnnotation(
  item: RawBallotItem,
  topics: string[]
): string {
  for (const topic of topics) {
    const key = topic.toLowerCase().replace(/\s+/g, "_");
    if (key in item.annotations && item.annotations[key]) {
      return item.annotations[key];
    }
  }
  return item.annotations.default || "";
}

interface RawBallotItem {
  id: string;
  title: string;
  category: string;
  officialText: string;
  annotations: Record<string, string>;
  expand: {
    newsSummary: string;
    citations: { title: string; url: string; source: string }[];
  };
}

function buildItems(
  items: RawBallotItem[],
  profile: UserProfile,
  topicNames: string
) {
  return items.map((item) => {
    const relatedTopics = profile.topics.filter((topic) => {
      const key = topic.toLowerCase().replace(/\s+/g, "_");
      return key === item.category || key in item.annotations;
    });

    return {
      id: item.id,
      title: item.title,
      officialText: item.officialText,
      annotation: getAnnotation(item, profile.topics),
      category: item.category,
      relatedTopics: relatedTopics.length > 0 ? relatedTopics : [item.category],
      expand: {
        newsSummary: item.expand.newsSummary,
        citations: item.expand.citations,
        chatbotPrompt: `Explain how "${item.title}" affects someone interested in ${topicNames}${profile.aboutYou ? ` who describes themselves as: ${profile.aboutYou}` : ""}.`,
      },
    };
  });
}

export function generatePersonalizedBallot(
  profile: UserProfile
): PersonalizedBallot {
  const topicNames = profile.topics
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).replace("_", " "))
    .join(", ");

  const greeting = `Your personalized guide to Pittsburgh's 2025 Primary Election ballot questions.`;

  const personalizedSummary = `Based on your interests in ${topicNames}, we've prepared annotations for ${ALL_BALLOT_ITEMS.length} ballot questions and ${ALL_RACE_ITEMS.length} active races facing voters on May 20, 2025. Each item includes a personalized explanation of how it may affect you, along with trusted sources.`;

  const ballotItems = buildItems(ALL_BALLOT_ITEMS, profile, topicNames);
  const raceItems = buildItems(ALL_RACE_ITEMS, profile, topicNames);

  const topicExplanations = profile.topics
    .map((topic) => {
      const key = topic.toLowerCase().replace(/\s+/g, "_");
      return TOPIC_EXPLANATIONS[key];
    })
    .filter(Boolean);

  return {
    greeting,
    personalizedSummary,
    ballotItems,
    raceItems,
    topicExplanations,
  };
}
