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
      "Vote for one candidate for Mayor of the City of Pittsburgh. The mayor serves a four-year term as the chief executive officer of the city.",
    annotations: {
      default: "Democrat Corey O'Connor, who defeated incumbent Ed Gainey in the primary, faces Republican Tony Moreno. O'Connor holds a large advantage in fundraising and voter registration.",
      jobs: "The next mayor will shape Pittsburgh's economic recovery as downtown office vacancies have surged post-COVID.",
      housing: "Housing affordability is a central issue — the next mayor will influence zoning, development incentives, and tenant protections.",
      public_safety: "Public safety has been a defining issue, with candidates debating policing approaches and gun violence reduction.",
      taxes: "The mayor proposes Pittsburgh's annual budget and influences tax policy amid changing downtown economics.",
      government: "This race determines the executive leadership of Pittsburgh for the next four years.",
      transit: "The mayor works with Port Authority and state officials on transit funding and planning.",
      environment: "The mayor shapes the city's climate action plan and controls infrastructure investment in flood mitigation.",
    },
    candidates: [
      {
        name: "Corey O'Connor",
        party: "D" as const,
        bio: "Former City Council member and son of the late Mayor Bob O'Connor. Won the Democratic primary defeating incumbent Ed Gainey. Previously served as Allegheny County Controller.",
        topicBlurbs: {
          jobs: "O'Connor has prioritized downtown revitalization and attracting businesses to address post-COVID vacancies. He's proposed tax incentives for relocating companies and workforce development programs.",
          housing: "Plans to streamline housing development approvals and increase affordable housing through public-private partnerships. Has supported inclusionary zoning policies.",
          public_safety: "Emphasizes community policing and increased support for the Bureau of Police, while investing in violence prevention programs. Calls for more officers on the street.",
          taxes: "Positions himself as fiscally moderate, promising to maintain services while being cautious about tax increases. Focused on growing the tax base through economic development.",
          environment: "Supports continued investment in Pittsburgh's climate action plan and green infrastructure, including stormwater management and reducing combined sewer overflows.",
          transit: "Advocates for better connections between neighborhoods and increased advocacy for Port Authority funding at the state level.",
          government: "Brings council experience and emphasizes collaborative governance. Has pledged transparency and outlined plans for modernizing city operations.",
          water: "Supports keeping water and sewer systems public and has backed investments in aging water infrastructure to reduce lead contamination and sewer overflows.",
          civil_rights: "Has supported anti-discrimination protections and community engagement initiatives. Emphasizes equity in city hiring and contracting.",
          education: "Pledges to work with Pittsburgh Public Schools on improving outcomes and supporting early childhood education programs.",
        },
      },
      {
        name: "Tony Moreno",
        party: "R" as const,
        bio: "Former Pittsburgh police officer and 2021 mayoral candidate. Won the Republican nomination without support from local GOP committees. Running on a law-and-order platform.",
        topicBlurbs: {
          jobs: "Focuses on reducing regulations and taxes to attract businesses. Proposes cutting red tape for small business owners and opposing what he sees as anti-business policies.",
          housing: "Emphasizes property rights and opposes excessive development regulations. Supports market-based solutions to housing affordability.",
          public_safety: "His law enforcement background is central to his campaign. Calls for expanded police presence, tougher enforcement of existing laws, and more resources for the Bureau of Police.",
          taxes: "Proposes reducing city taxes and fees to make Pittsburgh more affordable and competitive with suburban communities. Promises to cut wasteful spending.",
          environment: "Has expressed concern about regulations he views as burdensome to businesses and development, while supporting practical infrastructure improvements.",
          transit: "Focuses on improving road infrastructure and reducing commute times. Less focused on public transit expansion.",
          government: "Positions himself as an outsider who will challenge the political establishment. Promises to reduce bureaucracy and shake up city government.",
          water: "Supports maintaining water system reliability but has been less vocal on the public vs. private ownership debate.",
          civil_rights: "Focuses on equal application of existing laws and public safety as a civil rights priority for all communities.",
          education: "Supports school choice initiatives and parental involvement in education. Critical of what he sees as declining school performance.",
        },
      },
    ],
    expand: {
      newsSummary: "Corey O'Connor, who narrowly defeated incumbent Ed Gainey in the Democratic primary, holds a large advantage in fundraising and party voter registration going into the general election. Republican Tony Moreno, a former cop who won his primary without local GOP support, is running as an outsider on a law-and-order platform.",
      citations: [
        { title: "Election Guide 2025 — Who's on the Ballot", url: "https://www.publicsource.org/election-guide-2025-whos-on-the-ballot-pittsburgh-allegheny-county/", source: "PublicSource / Pittsburgh City Paper" },
        { title: "Top Races on Today's Ballot", url: "https://www.wesa.fm/2025-05-20/pittsburgh-allegheny-county-2025-primary", source: "90.5 WESA" },
      ],
    },
  },
  {
    id: "race-superior-court",
    title: "Pennsylvania Superior Court",
    category: "office",
    officialText:
      "Vote for one candidate for Judge of the Superior Court of Pennsylvania. The Superior Court hears criminal appeals and family court cases involving private entities. Justices serve 10-year terms.",
    annotations: {
      default: "Democrat Brandon Neuman and Republican Maria Battista are vying for the seat vacated when Daniel McCaffery was elected to the state Supreme Court. The 15-member court is currently split 8-6 between Democrats and Republicans.",
      civil_rights: "The Superior Court handles criminal appeals and family court cases that directly affect civil rights, sentencing fairness, and custody decisions across Pennsylvania.",
      public_safety: "This court hears high-level criminal appeals, so the judge elected here will help shape how criminal justice is administered statewide.",
      government: "Judicial elections shape the balance of Pennsylvania's courts. This vacancy shifts the current 8-6 Democratic majority on the 15-member bench.",
    },
    candidates: [
      {
        name: "Brandon Neuman",
        party: "D" as const,
        bio: "Washington County judge with experience on the Court of Common Pleas. Known for his progressive judicial philosophy and focus on criminal justice reform.",
        topicBlurbs: {
          civil_rights: "As a Common Pleas judge, Neuman has emphasized fair sentencing and rehabilitation-focused approaches. He's advocated for reducing disparities in the criminal justice system.",
          public_safety: "Supports evidence-based criminal justice reform that balances accountability with rehabilitation. Favors drug court programs and alternative sentencing for non-violent offenders.",
          government: "His election would maintain the court's current Democratic majority. Neuman has emphasized judicial independence and merit-based decision-making.",
          jobs: "Has ruled on employment law cases and supports workers' rights in the judicial context. His judicial philosophy tends to favor employee protections.",
          family: "Has extensive family court experience and supports expanded access to family services and fair custody determinations.",
        },
      },
      {
        name: "Maria Battista",
        party: "R" as const,
        bio: "Legal consultant with a conservative judicial philosophy. Runs on a platform of strict constitutional interpretation and judicial restraint.",
        topicBlurbs: {
          civil_rights: "Battista emphasizes strict constitutional interpretation in civil rights cases. She's focused on protecting individual liberties through limited government intervention.",
          public_safety: "Favors tougher sentences for violent crimes and less leniency in plea negotiations. Supports law enforcement and prosecutors in criminal appeals.",
          government: "Her election would narrow the Democratic majority on the court. Battista emphasizes judicial restraint and opposes what she views as judicial activism.",
          jobs: "Supports business-friendly judicial interpretations and emphasizes contract enforcement and reducing regulatory burden through the courts.",
          family: "Emphasizes parental rights and traditional family structures in her judicial philosophy. Supports swift resolution of family court matters.",
        },
      },
    ],
    expand: {
      newsSummary: "The Superior Court is currently split 8-6 between Democrats and Republicans, with this vacancy created when Democrat Daniel McCaffery was elected to the state Supreme Court. The race has statewide implications for criminal justice, family law, and the partisan balance of the bench.",
      citations: [
        { title: "Election Guide 2025 — Who's on the Ballot", url: "https://www.publicsource.org/election-guide-2025-whos-on-the-ballot-pittsburgh-allegheny-county/", source: "PublicSource / Pittsburgh City Paper" },
      ],
    },
  },
  {
    id: "race-commonwealth-court",
    title: "Pennsylvania Commonwealth Court",
    category: "office",
    officialText:
      "Vote for one candidate for Judge of the Commonwealth Court of Pennsylvania. The Commonwealth Court hears civil and regulatory appeals involving public entities. Judges serve 10-year terms.",
    annotations: {
      default: "Democrat Stella Tsai and Republican Matt Wolford are competing for the seat vacated by Ellen Ceisler's retirement. The court is currently 5-3 Republican and issues opinions on taxes, state agencies, zoning, and elections.",
      government: "The Commonwealth Court shapes how state agencies operate and has ruled on major election cases. This race could begin to shift the court's current 5-3 Republican advantage.",
      taxes: "This court handles appeals involving tax assessments and state revenue matters that directly affect Pennsylvania taxpayers.",
      housing: "The Commonwealth Court rules on zoning and land use appeals that affect housing development across the state.",
      environment: "Rules on environmental regulatory matters, including permits, enforcement actions, and challenges to state environmental policies.",
    },
    candidates: [
      {
        name: "Stella Tsai",
        party: "D" as const,
        bio: "Sitting Common Pleas judge in Philadelphia with experience in elections and zoning cases. Known for her thorough, methodical judicial approach.",
        topicBlurbs: {
          government: "Tsai's election would narrow the Republican majority to 5-4. She's emphasized the importance of fair election administration and transparent government processes.",
          taxes: "Has handled tax-related cases on the Common Pleas bench and supports clear, consistent application of tax law that protects taxpayers from arbitrary assessments.",
          housing: "Has ruled on zoning cases and supports balanced approaches that consider both development needs and community impact.",
          environment: "Supports thorough judicial review of environmental regulations to ensure agencies follow proper procedures in protecting public health.",
          civil_rights: "Has a track record of protecting voting rights and equal access to government services. Emphasizes fair application of administrative law.",
        },
      },
      {
        name: "Matt Wolford",
        party: "R" as const,
        bio: "Attorney with a focus on regulatory and business law. Running on a platform of limiting government overreach and protecting individual property rights.",
        topicBlurbs: {
          government: "Would maintain the court's Republican majority. Emphasizes judicial restraint and limiting the expansion of state agency authority beyond legislative intent.",
          taxes: "Supports strict limits on government taxing authority and opposes what he views as overreach by tax agencies. Favors taxpayer-friendly interpretations of disputed tax provisions.",
          housing: "Emphasizes property rights and opposes excessive zoning restrictions that limit property owners' ability to develop their land.",
          environment: "Concerned about environmental regulations that he views as overreaching. Supports balancing environmental protection with economic development and property rights.",
          civil_rights: "Focuses on protecting individual rights against government overreach, particularly in regulatory and administrative contexts.",
        },
      },
    ],
    expand: {
      newsSummary: "The Commonwealth Court currently has a 5-3 Republican majority and has been at the center of major election disputes, including ruling in favor of Republicans seeking to delay ballot certification in 2020 (a decision the Supreme Court overturned). This vacancy was created by Democrat Ellen Ceisler's retirement.",
      citations: [
        { title: "Election Guide 2025 — Who's on the Ballot", url: "https://www.publicsource.org/election-guide-2025-whos-on-the-ballot-pittsburgh-allegheny-county/", source: "PublicSource / Pittsburgh City Paper" },
      ],
    },
  },
  {
    id: "race-sheriff",
    title: "Allegheny County Sheriff",
    category: "office",
    officialText:
      "Vote for one candidate for Sheriff of Allegheny County. The Sheriff handles warrants, fugitive pursuit, court security, prisoner transport, and sheriff's sales.",
    annotations: {
      default: "Incumbent Democrat Kevin Kraus faces Republican challenger Brian Weismantle. Both served for decades in the Pittsburgh Bureau of Police before entering this race.",
      public_safety: "The Sheriff's Office handles warrants, fugitive pursuit, prisoner transport, and court security — central to Allegheny County's law enforcement ecosystem.",
      government: "The Sheriff is one of Allegheny County's independently elected row officers, handling law enforcement tasks distinct from the county police.",
      immigration: "In the current federal climate, the sheriff's approach to cooperating with federal immigration enforcement has become a significant local issue.",
    },
    candidates: [
      {
        name: "Kevin Kraus",
        party: "D" as const,
        isIncumbent: true,
        bio: "Incumbent sheriff since 2021. Served for decades in the Pittsburgh Bureau of Police before being elected. Has modernized the office's technology and procedures.",
        topicBlurbs: {
          public_safety: "Has focused on modernizing warrant enforcement, improving court security, and building community relationships. Emphasizes professional, accountable law enforcement.",
          government: "Has worked to reform the Sheriff's Office operations, including updating technology and training protocols. Emphasizes transparency and cooperation with other agencies.",
          immigration: "Has maintained the county's existing policies regarding cooperation with federal immigration enforcement, balancing public safety with community trust.",
          civil_rights: "Emphasizes de-escalation training and equitable law enforcement practices. Has implemented reforms aimed at reducing bias in the office's operations.",
        },
      },
      {
        name: "Brian Weismantle",
        party: "R" as const,
        bio: "Veteran of the Pittsburgh Bureau of Police with decades of law enforcement experience. Running on a traditional law-and-order platform.",
        topicBlurbs: {
          public_safety: "Calls for more aggressive warrant enforcement and faster fugitive apprehension. Promises to expand the office's capacity and responsiveness.",
          government: "Criticizes what he sees as insufficient leadership in the current office. Promises to bring a more decisive management style.",
          immigration: "Supports closer cooperation with federal law enforcement, including immigration authorities, to enhance public safety.",
          civil_rights: "Focuses on protecting all residents' safety through vigorous law enforcement as the foundation of civil rights protections.",
        },
      },
    ],
    expand: {
      newsSummary: "Both candidates are veterans of the Pittsburgh Bureau of Police, bringing decades of law enforcement experience. The race centers on differing approaches to managing the office, including warrant enforcement, court security, and cooperation with federal agencies.",
      citations: [
        { title: "Election Guide 2025 — Who's on the Ballot", url: "https://www.publicsource.org/election-guide-2025-whos-on-the-ballot-pittsburgh-allegheny-county/", source: "PublicSource / Pittsburgh City Paper" },
      ],
    },
  },
  {
    id: "race-council-at-large",
    title: "Allegheny County Council — At Large",
    category: "office",
    officialText:
      "Vote for one candidate for Allegheny County Council At-Large seat. Council members serve four-year terms on the 15-member legislative body that passes the county budget and enacts ordinances.",
    annotations: {
      default: "Appointed incumbent Republican Mike Embrescia faces independent challenger Alex Rose. Rose's candidacy survived a legal challenge that went to the PA Supreme Court.",
      government: "This at-large seat represents all of Allegheny County. Rose's independent challenge to an appointed incumbent makes this one of the most unusual races on the ballot.",
      taxes: "County Council approves the county budget and sets property tax rates. The at-large seat gives its holder a county-wide perspective on fiscal matters.",
      housing: "County Council influences housing policy through zoning oversight, affordable housing programs, and community development funding.",
    },
    candidates: [
      {
        name: "Mike Embrescia",
        party: "R" as const,
        isIncumbent: true,
        bio: "Appointed to the at-large seat after a vacancy. Comes from a business background and emphasizes fiscal responsibility in county government.",
        topicBlurbs: {
          government: "Emphasizes efficient government operations and reducing unnecessary spending. Supports maintaining the current structure of county services.",
          taxes: "Opposes property tax increases and supports finding efficiencies in county operations to keep costs down for taxpayers.",
          housing: "Supports market-oriented approaches to housing and opposes regulations he views as discouraging development.",
          jobs: "Emphasizes creating a business-friendly environment in Allegheny County through reduced regulations and competitive tax rates.",
          public_safety: "Supports adequate funding for county law enforcement and emergency services while maintaining fiscal discipline.",
        },
      },
      {
        name: "Alex Rose",
        party: "I" as const,
        bio: "Left-leaning independent candidate whose candidacy survived a legal challenge that went to the PA Supreme Court. Running on a progressive platform focused on community investment.",
        topicBlurbs: {
          government: "Advocates for greater transparency in county government and more community input in budget decisions. Challenges the traditional two-party structure of county politics.",
          taxes: "Supports progressive approaches to taxation that ensure large corporations and wealthy property owners pay their fair share while protecting working families.",
          housing: "Supports increased county investment in affordable housing programs and tenant protections, particularly in communities facing gentrification pressure.",
          jobs: "Advocates for living wage policies, labor protections, and community-centered economic development that benefits existing residents.",
          public_safety: "Supports community-based public safety approaches alongside traditional law enforcement, including mental health response teams.",
          transit: "Advocates for expanded public transit access, particularly to underserved communities, and supports increased county advocacy for Port Authority funding.",
        },
      },
    ],
    expand: {
      newsSummary: "This race features an unusual matchup — appointed Republican incumbent Mike Embrescia versus left-leaning independent Alex Rose. Embrescia challenged Rose's candidacy, but the challenge was rejected at the Pennsylvania Supreme Court, clearing Rose to run.",
      citations: [
        { title: "Election Guide 2025 — Who's on the Ballot", url: "https://www.publicsource.org/election-guide-2025-whos-on-the-ballot-pittsburgh-allegheny-county/", source: "PublicSource / Pittsburgh City Paper" },
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
  candidates?: {
    name: string;
    party: "D" | "R" | "I" | "L";
    isIncumbent?: boolean;
    bio: string;
    topicBlurbs: Record<string, string>;
  }[];
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
      candidates: item.candidates,
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
