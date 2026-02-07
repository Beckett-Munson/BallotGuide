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
      "Vote for ONE candidate for Mayor of the City of Pittsburgh. The Mayor serves a four-year term and is the chief executive officer of the city, responsible for enforcing city ordinances and managing city operations.",
    annotations: {
      default:
        "The Mayor of Pittsburgh is the city's chief executive, overseeing departments including Public Safety, Public Works, and City Planning. This race determines who will lead the city for the next four years.",
      housing:
        "The Mayor directly influences housing policy through zoning decisions, affordable housing initiatives, and oversight of the Urban Redevelopment Authority. This race will shape Pittsburgh's approach to development and affordability.",
      jobs:
        "The Mayor sets economic development priorities, manages relationships with major employers, and oversees workforce development programs. This election will determine the city's job growth strategy.",
      public_safety:
        "The Mayor oversees the Bureau of Police, Bureau of Fire, and EMS. This race directly affects public safety staffing, training, community policing strategies, and emergency response across Pittsburgh.",
      environment:
        "The Mayor shapes Pittsburgh's environmental policy, including climate action plans, green infrastructure investments, and sustainability initiatives across city operations.",
      taxes:
        "The Mayor proposes the city's annual budget, influencing tax rates, fee structures, and how revenue is allocated across departments and services.",
      transit:
        "While Port Authority operates independently, the Mayor works with transit agencies on route planning, bus rapid transit projects, and pedestrian/cycling infrastructure investments.",
      government:
        "This is the most significant local government race. The Mayor appoints department heads, proposes legislation, and sets the overall direction of city government for four years.",
    },
    expand: {
      newsSummary:
        "The 2025 Pittsburgh mayoral race features candidates debating the city's direction on development, public safety, and affordability. Key issues include the future of major development projects, police staffing levels, and addressing the city's aging infrastructure.",
      citations: [
        {
          title: "2025 Pittsburgh Municipal Elections",
          url: "https://www.alleghenycounty.us/elections",
          source: "Allegheny County Elections Division",
        },
        {
          title: "Pittsburgh City Government Structure",
          url: "https://pittsburghpa.gov/mayor/about",
          source: "City of Pittsburgh",
        },
      ],
    },
  },
  {
    id: "race-controller",
    title: "City Controller",
    category: "office",
    officialText:
      "Vote for ONE candidate for Controller of the City of Pittsburgh. The Controller serves a four-year term and is the city's chief fiscal officer, responsible for auditing city finances and ensuring taxpayer dollars are spent properly.",
    annotations: {
      default:
        "The City Controller is Pittsburgh's fiscal watchdog, independently auditing city departments and ensuring tax dollars are spent properly. The Controller can investigate waste, fraud, and mismanagement.",
      taxes:
        "The Controller directly protects your tax dollars by auditing how the city spends its budget. Strong Controller oversight can identify waste and save taxpayers money through performance audits of city departments.",
      government:
        "The Controller is a key check on government power, operating independently to audit the Mayor's administration and city departments. This race determines who holds the city financially accountable.",
      jobs:
        "The Controller audits economic development spending and tax incentive programs, ensuring that public investments in job creation and business development deliver promised results.",
    },
    expand: {
      newsSummary:
        "The Controller's office has been increasingly active in performance audits of city departments, examining everything from police overtime spending to the efficiency of permit processing. Candidates are debating how aggressively the office should pursue audits and investigations.",
      citations: [
        {
          title: "Office of the City Controller",
          url: "https://pittsburghpa.gov/controller/about",
          source: "City of Pittsburgh",
        },
        {
          title: "2025 Pittsburgh Municipal Elections",
          url: "https://www.alleghenycounty.us/elections",
          source: "Allegheny County Elections Division",
        },
      ],
    },
  },
  {
    id: "race-council-district",
    title: "City Council — Your District",
    category: "office",
    officialText:
      "Vote for ONE candidate for City Council in your district. Council members serve four-year terms and are responsible for passing city legislation, approving the budget, and representing constituent interests.",
    annotations: {
      default:
        "Your City Council member is your most direct representative in city government. Council members vote on ordinances, approve the city budget, and can introduce legislation on issues affecting your neighborhood.",
      housing:
        "Your Council member votes on zoning changes, development approvals, and affordable housing requirements in your district. They are often the first point of contact when development projects affect your neighborhood.",
      public_safety:
        "Council members influence public safety through budget allocation for police and fire departments, and can advocate for neighborhood-specific safety concerns like traffic calming and lighting improvements.",
      environment:
        "Council members vote on environmental regulations, green space preservation, and development standards. They can introduce legislation on issues like single-use plastics, tree protection, and stormwater management in your district.",
      transit:
        "Your Council member advocates for transit improvements, bike lanes, and pedestrian safety in your district. They vote on capital improvements to roads and infrastructure.",
    },
    expand: {
      newsSummary:
        "City Council races are particularly competitive this cycle, with debates centering on development policy, neighborhood investment equity, and the balance between growth and preservation of neighborhood character. Several districts have open seats, attracting multiple candidates.",
      citations: [
        {
          title: "Pittsburgh City Council",
          url: "https://pittsburghpa.gov/council/about",
          source: "City of Pittsburgh",
        },
        {
          title: "2025 Pittsburgh Municipal Elections",
          url: "https://www.alleghenycounty.us/elections",
          source: "Allegheny County Elections Division",
        },
      ],
    },
  },
  {
    id: "race-school-board",
    title: "Pittsburgh Public Schools — School Board",
    category: "office",
    officialText:
      "Vote for candidates for the Board of Directors of the Pittsburgh School District. Board members serve four-year terms and oversee the district's budget, curriculum standards, and administrative leadership.",
    annotations: {
      default:
        "School Board members oversee Pittsburgh Public Schools, setting policy on curriculum, budgets, and district leadership. They directly shape the education experience for over 20,000 students across the city.",
      education:
        "This is the most impactful education race on your ballot. School Board members decide curriculum standards, school closures or openings, teacher contracts, and how to allocate the district's hundreds of millions in annual spending.",
      taxes:
        "Pittsburgh School District is one of the largest property tax levies in the city. School Board members set the district's budget and tax rate, directly affecting your property tax bill.",
      family:
        "School Board decisions directly affect families — from school assignment policies and after-school programs to special education services and school safety measures.",
      civil_rights:
        "The School Board addresses equity in education, including resource allocation across neighborhoods, disciplinary policies, and inclusive curriculum standards that reflect Pittsburgh's diverse communities.",
    },
    expand: {
      newsSummary:
        "The Pittsburgh School Board races come at a critical time for the district, which is navigating post-pandemic enrollment changes, facility consolidation discussions, and debates over curriculum standards. Candidates are divided on the pace of change and how to address achievement gaps.",
      citations: [
        {
          title: "Pittsburgh Public Schools Board of Directors",
          url: "https://www.pps.k12.pa.us/domain/30",
          source: "Pittsburgh Public Schools",
        },
        {
          title: "2025 Pittsburgh Municipal Elections",
          url: "https://www.alleghenycounty.us/elections",
          source: "Allegheny County Elections Division",
        },
      ],
    },
  },
  {
    id: "race-judge",
    title: "Court of Common Pleas Judge",
    category: "office",
    officialText:
      "Vote for candidates for Judge of the Court of Common Pleas of Allegheny County. Judges serve ten-year terms and preside over civil and criminal cases in the county's trial court.",
    annotations: {
      default:
        "Court of Common Pleas judges handle criminal trials, civil disputes, family court matters, and more. These are ten-year terms, making judicial races among the most consequential on your ballot.",
      civil_rights:
        "Judges make daily decisions affecting civil rights — from criminal sentencing and bail decisions to civil rights cases and protection-from-abuse orders. Judicial philosophy directly impacts how justice is administered in Allegheny County.",
      public_safety:
        "Judges set bail, determine sentences, and oversee criminal cases. Their approach to justice — whether focused on rehabilitation or strict sentencing — directly affects public safety and the criminal justice system.",
      government:
        "Judicial elections are a key but often overlooked part of government. Judges serve 10-year terms and operate independently from the legislative and executive branches, providing a check on government power.",
    },
    expand: {
      newsSummary:
        "Allegheny County judicial races have drawn attention as candidates debate approaches to criminal justice reform, bail reform, and court efficiency. The county's Court of Common Pleas handles thousands of cases annually, and new judges will shape the local justice system for a decade.",
      citations: [
        {
          title: "Allegheny County Court of Common Pleas",
          url: "https://www.alleghenycourts.us",
          source: "Allegheny County Courts",
        },
        {
          title: "2025 Pennsylvania Judicial Elections",
          url: "https://www.pacourts.us/judicial-elections",
          source: "Pennsylvania Courts",
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
  item: { annotations: Record<string, string> },
  topics: string[]
): string {
  for (const topic of topics) {
    const key = topic.toLowerCase().replace(/\s+/g, "_");
    if (key in item.annotations) {
      return item.annotations[key] || item.annotations.default;
    }
  }
  return item.annotations.default;
}

export function generatePersonalizedBallot(
  profile: UserProfile
): PersonalizedBallot {
  const topicNames = profile.topics
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).replace("_", " "))
    .join(", ");

  const greeting = `Your personalized guide to Pittsburgh's 2025 Primary Election ballot questions.`;

  const personalizedSummary = `Based on your interests in ${topicNames}, we've prepared annotations for ${ALL_BALLOT_ITEMS.length} ballot questions facing City of Pittsburgh voters on May 20, 2025. Each item includes a personalized explanation of how it may affect you, along with trusted sources.`;

  const mapItems = (items: { id: string; title: string; category: string; officialText: string; annotations: Record<string, string>; expand: { newsSummary: string; citations: { title: string; url: string; source: string }[] } }[]) =>
    items.map((item) => {
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

  const ballotItems = mapItems(ALL_BALLOT_ITEMS);
  const raceItems = mapItems(ALL_RACE_ITEMS);

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
