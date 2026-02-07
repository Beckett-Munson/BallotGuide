import type { UserProfile, PersonalizedBallot, Policy, AnnotationResponse } from "@/types/ballot";
import { AnnotationGenerator } from "@/services/AnnotationGenerator";

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
          jobs: { text: "Corey O'Connor would serve as Pittsburgh's chief executive officer, overseeing city departments including Innovation & Performance, Management & Budget, and Human Resources & Civil Service. As mayor, he would have authority over workforce development initiatives and city employment policies through these departments.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          housing: { text: "As Pittsburgh's chief executive, O'Connor would oversee the Department of Permits, Licenses and Inspections, which regulates housing construction and safety standards. He would also work with City Planning on housing development and zoning policies affecting affordability and availability.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          public_safety: { text: "O'Connor would have direct oversight of Pittsburgh's Public Safety department as chief executive. He would also work with the Citizens Police Review Board, which provides civilian oversight of police conduct and accountability.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          taxes: { text: "As mayor, O'Connor would oversee the Finance department and work with the City Controller on financial oversight and reporting. He would propose the city budget and tax policies, though City Council holds legislative authority over final approval.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          environment: { text: "O'Connor would oversee city environmental initiatives through departments like Public Works and City Planning as chief executive. His administration would be responsible for implementing environmental policies and sustainability programs across city operations.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          transit: { text: "As mayor, O'Connor would have authority over Pittsburgh's Department of Mobility & Infrastructure, which handles transportation planning and infrastructure. He would shape the city's approach to public transit coordination, bike lanes, and pedestrian safety.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          government: { text: "O'Connor would serve a four-year term as Pittsburgh's chief executive officer, overseeing all city departments and operations. He would work alongside the City Controller on financial matters and City Council on legislation, with authority over day-to-day government operations.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 59/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          water: { text: "As chief executive, O'Connor would oversee the Public Works department, which typically handles water infrastructure and services. He would be responsible for managing water quality, distribution systems, and stormwater management across Pittsburgh.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          civil_rights: { text: "O'Connor would oversee the Human Relations Commission, Equal Opportunity Review Commission, and Office of Municipal Investigations as mayor. These departments handle discrimination complaints, equal opportunity enforcement, and civil rights protections for Pittsburgh residents.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          education: { text: "While Pittsburgh Public Schools operates independently, O'Connor as mayor would influence education through city resources and partnerships. He would oversee Citiparks, which provides after-school and recreational programs that support youth development and learning.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
        },
      },
      {
        name: "Tony Moreno",
        party: "R" as const,
        bio: "Former Pittsburgh police officer and 2021 mayoral candidate. Won the Republican nomination without support from local GOP committees. Running on a law-and-order platform.",
        topicBlurbs: {
          jobs: { text: "Tony Moreno's background as a former Pittsburgh police officer suggests he would prioritize public safety jobs and law enforcement staffing. His law-and-order platform likely means increased hiring and resources for police and emergency services. Economic development would probably focus on supporting businesses through a safe-streets approach.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          housing: { text: "As a Republican candidate running on law and order, Moreno would likely address housing through the lens of neighborhood safety and property protection. He may focus on reducing crime in residential areas to stabilize property values. Specific housing affordability policies are not clearly outlined in his platform.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 59/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
          public_safety: { text: "Moreno's core campaign centers on law-and-order as a former Pittsburgh police officer. He would likely expand police department resources, increase officer presence in neighborhoods, and take a tough-on-crime approach. His 2021 candidacy and police background indicate strong support for traditional law enforcement methods.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          taxes: { text: "As a Republican candidate, Moreno would likely favor fiscal restraint and efficient use of taxpayer dollars. He may seek to control spending growth while maintaining essential services, particularly public safety. His approach would probably emphasize accountability in city financial management.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 59/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
          environment: { text: "Environmental policy is not a highlighted part of Moreno's law-and-order platform. As a Republican candidate, he may take a more business-friendly approach to environmental regulations. His priorities would likely focus on public safety over environmental initiatives.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
          transit: { text: "Moreno's transit approach would likely emphasize safety on public transportation and in transit areas. As a former police officer, he may prioritize security measures for riders and stations. Infrastructure improvements would probably be secondary to law enforcement presence.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          government: { text: "Moreno would serve as Pittsburgh's chief executive with authority over city departments including Public Safety, which aligns with his background. His administration would likely emphasize accountability and efficiency in government operations. He may seek to streamline bureaucracy while strengthening law enforcement agencies.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 59/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          water: { text: "Water infrastructure and services fall under the mayor's executive authority through Public Works. Moreno has not made water policy a central campaign issue. His administration would likely maintain existing water services while focusing resources on his law-and-order priorities.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          civil_rights: { text: "As mayor, Moreno would oversee the Human Relations Commission and Citizens Police Review Board. His law-and-order platform may create tension with police accountability advocates. His approach to civil rights would likely emphasize support for law enforcement while maintaining required oversight structures.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 4/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          education: { text: "Education policy in Pittsburgh is not directly controlled by the mayor's office. Moreno's focus on public safety could affect school security and resource officer programs. His administration would likely coordinate with school districts on safety issues rather than curriculum or funding.", citations: [{ title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 58/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
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
          civil_rights: { text: "Brandon Neuman would hear appeals in criminal cases and family court matters, which often involve civil rights questions like due process and equal treatment under the law. As a Superior Court judge, he would review lower court decisions to ensure they follow constitutional protections. His rulings could affect how civil rights laws are applied across Pennsylvania.", citations: [{ title: "Title 18 - CRIMES AND OFFENSES [part 2057/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          public_safety: { text: "Neuman would handle criminal appeals on the Superior Court, reviewing convictions and sentences from trial courts. His decisions would shape how criminal laws are interpreted and enforced statewide. This role directly impacts public safety by determining whether criminal convictions are upheld or overturned.", citations: [{ title: "Title 18 - CRIMES AND OFFENSES [part 2057/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 100/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          government: { text: "As a Superior Court judge, Neuman would serve a 10-year term as part of Pennsylvania's appellate judiciary. The Superior Court is a key part of the state's three-tiered court system, handling appeals from common pleas courts. He would be part of the judicial branch that checks the power of other government branches.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 100/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          jobs: { text: "While the Superior Court doesn't directly create employment policy, Neuman would hear appeals involving workplace disputes that reach the appellate level. His decisions on employment-related cases could affect how labor and employment laws are interpreted in Pennsylvania. His background as a common pleas judge gives him experience with cases that impact working families.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 100/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          family: { text: "Neuman would hear family court appeals involving private parties, including custody disputes, divorce proceedings, and child support cases. His rulings would set precedents that guide how family law is applied across Pennsylvania's trial courts. This role gives him significant influence over how the legal system handles family matters.", citations: [{ title: "Title 18 - CRIMES AND OFFENSES [part 2057/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 100/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
        },
      },
      {
        name: "Maria Battista",
        party: "R" as const,
        bio: "Legal consultant with a conservative judicial philosophy. Runs on a platform of strict constitutional interpretation and judicial restraint.",
        topicBlurbs: {
          civil_rights: { text: "Battista's conservative judicial philosophy suggests she would likely interpret civil rights laws more narrowly, potentially favoring traditional legal standards over expansive protections. As a Superior Court judge, she would review criminal appeals and family court cases, which often involve questions of individual rights and due process. Her approach could mean stricter adherence to precedent rather than progressive interpretations of rights.", citations: [{ title: "Title 18 - CRIMES AND OFFENSES [part 2057/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          public_safety: { text: "With a conservative philosophy, Battista would likely take a tough-on-crime approach in criminal appeals heard by the Superior Court. She would probably be more inclined to uphold criminal convictions and defer to prosecutors' decisions. Her election could mean fewer successful appeals by defendants and stronger support for law enforcement actions.", citations: [{ title: "Title 18 - CRIMES AND OFFENSES [part 2057/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }, { title: "Title 18 - CRIMES AND OFFENSES [part 2058/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }] },
          government: { text: "Battista would serve a 10-year term on the Superior Court, which handles criminal and family court appeals. Her conservative approach suggests she would favor limited judicial intervention and deference to legislative decisions. She would be part of Pennsylvania's appellate court system that works alongside the Commonwealth Court and Supreme Court.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 100/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          jobs: { text: "As a Superior Court judge, Battista would not directly handle employment law cases, which typically go to Commonwealth Court. However, her conservative judicial philosophy suggests she would likely favor business interests and be skeptical of expansive worker protections in any relevant appeals. Her impact on jobs would be indirect through criminal and family law decisions.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 100/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          family: { text: "Battista would directly impact family law as the Superior Court hears family court appeals involving private entities. Her conservative philosophy suggests she would likely favor traditional family structures and parental rights, and may be less inclined to expand family law protections. She would review custody disputes, divorce proceedings, and other family matters on appeal.", citations: [{ title: "Title 18 - CRIMES AND OFFENSES [part 2057/2139]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/18/18.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
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
          government: { text: "Electing Stella Tsai would bring a judge with Common Pleas experience to the Commonwealth Court, which handles civil and regulatory appeals involving public entities. The court consists of nine judges who serve 10-year terms and has the power to issue writs and processes necessary for exercising its jurisdiction over government matters.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          taxes: { text: "As a Commonwealth Court judge, Tsai would hear appeals involving tax disputes between citizens and government agencies. Her background as a Common Pleas judge in Philadelphia gives her experience with local government cases that often involve tax and revenue issues. The Commonwealth Court regularly reviews decisions by state agencies on tax matters.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          housing: { text: "Tsai's experience with zoning cases as a Common Pleas judge would be directly relevant to Commonwealth Court housing appeals. The court hears regulatory appeals that frequently involve land use, zoning disputes, and housing development decisions made by local governments. Her election would bring practical zoning expertise to these appeals.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          environment: { text: "The Commonwealth Court handles regulatory appeals that include environmental permits and enforcement actions by state agencies. Tsai would review decisions involving environmental regulations and their impact on businesses and communities. Her judicial experience would apply to interpreting environmental laws and agency decisions.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          civil_rights: { text: "Tsai's experience with elections cases as a Common Pleas judge is relevant to civil rights matters that come before Commonwealth Court. The court hears cases involving voting rights, election procedures, and constitutional challenges to government actions. Her election would bring expertise in protecting electoral participation and reviewing government decisions affecting individual rights.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
        },
      },
      {
        name: "Matt Wolford",
        party: "R" as const,
        bio: "Attorney with a focus on regulatory and business law. Running on a platform of limiting government overreach and protecting individual property rights.",
        topicBlurbs: {
          government: { text: "Wolford would serve on Pennsylvania's Commonwealth Court, which handles civil and regulatory appeals involving state and local government agencies. As a judge with regulatory and business law experience, he would likely interpret laws governing how public entities operate and enforce regulations. The court consists of nine judges serving 10-year terms.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }, { title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 113/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          taxes: { text: "If elected, Wolford would hear appeals related to tax disputes between individuals or businesses and Pennsylvania government entities. His background in regulatory and business law suggests he would approach tax cases with an understanding of both government authority and business concerns. The Commonwealth Court regularly decides cases involving state tax assessments and collection.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          housing: { text: "Wolford would decide appeals involving housing regulations, zoning disputes, and government housing policies that come before the Commonwealth Court. His regulatory law background would inform how he interprets state and local housing rules. These cases often involve conflicts between property owners and government agencies.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          environment: { text: "As a Commonwealth Court judge, Wolford would hear appeals on environmental permits, regulations, and enforcement actions by state agencies. His business and regulatory law experience would shape how he balances environmental protection with economic interests. The court frequently handles disputes over environmental compliance and agency decisions.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
          civil_rights: { text: "Wolford would rule on civil rights cases involving government actions and public entities that reach the Commonwealth Court. His decisions would affect how Pennsylvania agencies implement and enforce civil rights protections. The court's jurisdiction includes appeals challenging government policies that may impact individual rights.", citations: [{ title: "Title 42 - JUDICIARY AND JUDICIAL PROCEDURE [part 128/3117]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/42/42.HTM" }] },
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
          public_safety: { text: "Kevin Kraus's re-election would continue his leadership overseeing court security, prisoner transport, warrant execution, and fugitive pursuit. With decades of experience in the Pittsburgh police force, he brings law enforcement expertise to managing these core sheriff responsibilities. His administration would maintain the sheriff's traditional public safety functions as defined by Pennsylvania law.", citations: [{ title: "Title 16 - COUNTIES [part 120/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }, { title: "Title 16 - COUNTIES [part 201/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }] },
          government: { text: "As the elected sheriff, Kraus serves a four-year term managing one of Allegheny County's key constitutional offices. He oversees deputies and staff who execute court orders, conduct sheriff's sales, and maintain official records as required by state law. His continued tenure would provide stability in this independently elected position that operates alongside other county row offices.", citations: [{ title: "Title 16 - COUNTIES [part 120/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }, { title: "Title 16 - COUNTIES [part 233/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }] },
          immigration: { text: "The sheriff's office handles warrants and court orders, which can include immigration-related detainers when issued by courts. Kraus's approach to cooperating with federal immigration authorities or honoring such requests would shape how the office balances local law enforcement duties with federal immigration enforcement. His policies on this issue would affect immigrant communities' interactions with county law enforcement.", citations: [{ title: "Title 16 - COUNTIES [part 201/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }] },
          civil_rights: { text: "The sheriff's office executes evictions, foreclosures, and sheriff's sales that directly impact residents' housing and property rights. Kraus's policies on how deputies conduct these proceedings—including timing, communication with affected families, and enforcement discretion—would affect vulnerable residents facing financial hardship. His training requirements and oversight of deputies also shape how fairly and professionally the office treats all county residents.", citations: [{ title: "Title 16 - COUNTIES [part 140/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }, { title: "Title 16 - COUNTIES [part 201/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }] },
        },
      },
      {
        name: "Brian Weismantle",
        party: "R" as const,
        bio: "Veteran of the Pittsburgh Bureau of Police with decades of law enforcement experience. Running on a traditional law-and-order platform.",
        topicBlurbs: {
          public_safety: { text: "Weismantle's decades of experience with the Pittsburgh Bureau of Police would likely bring a law enforcement-focused approach to the Sheriff's office. As Sheriff, he would oversee warrants, fugitive pursuit, court security, and prisoner transport—core public safety functions that directly affect how the county handles crime and keeps courts secure.", citations: [] },
          government: { text: "The Sheriff is an elected county officer responsible for executing writs, maintaining court security, and performing duties required by law. Weismantle would need to meet state training requirements for sheriffs and would be bonded to protect the county from losses, ensuring accountability in this constitutional office.", citations: [{ title: "Title 16 - COUNTIES [part 120/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }, { title: "Title 16 - COUNTIES [part 201/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }] },
          immigration: { text: "While the Sheriff's office primarily handles local warrants and court security, sheriffs can cooperate with federal immigration authorities on detainers and enforcement. Weismantle's law enforcement background suggests he may take a cooperative approach, though the extent would depend on county policy and his own priorities.", citations: [] },
          civil_rights: { text: "The Sheriff executes court orders and handles prisoner transport, which involves protecting individuals' rights during arrest and detention. Weismantle's policing experience would shape how his office balances enforcement duties with constitutional protections during warrants, arrests, and interactions with vulnerable populations.", citations: [{ title: "Title 16 - COUNTIES [part 201/1088]", url: "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/16/16.HTM" }] },
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
          government: { text: "Mike Embrescia was appointed to fill a vacancy on the 15-member Allegheny County Council, which serves as the county's legislative body. If elected, he would continue serving a four-year term helping pass the county budget and enact local ordinances. His business background may influence his approach to county governance and policy decisions.", citations: [{ title: "Communication 2025-2158 — Committee on Hearings and Policy (2025-08-22) [part 24/179]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7524236&GUID=04A91C3F-E2B4-43BA-B8B4-AA1B2CE2DE31" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 5/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
          taxes: { text: "As a County Council member, Embrescia would have a vote on the annual county budget, which determines tax rates and spending priorities. His business background suggests he may approach tax policy with a focus on fiscal responsibility and economic considerations. Council members have direct authority over financial oversight and budgetary decisions.", citations: [{ title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 5/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }, { title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 60/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
          housing: { text: "Embrescia would have legislative authority to shape county housing policies through ordinances and budget allocations. Coming from a business background, he may approach housing issues with an emphasis on market-based solutions and economic development. County Council members can influence housing through zoning, development incentives, and funding decisions.", citations: [{ title: "Communication 2025-2158 — Committee on Hearings and Policy (2025-08-22) [part 24/179]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7524236&GUID=04A91C3F-E2B4-43BA-B8B4-AA1B2CE2DE31" }, { title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 60/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
          jobs: { text: "With his business background, Embrescia would likely prioritize economic development and job creation initiatives through County Council's legislative powers. He would vote on budget allocations that affect workforce development programs and business incentives. His private sector experience may inform his approach to attracting employers and supporting local businesses.", citations: [{ title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 5/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }, { title: "Resolution 2025-1463 — Committee on Finance and Law (2025-01-31) [part 60/237]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7124614&GUID=45603C1E-F624-404E-86A6-61E18D7B3DE7" }] },
          public_safety: { text: "As a Council member, Embrescia would vote on funding for county law enforcement, emergency services, and public safety programs through the annual budget process. County Council has legislative authority to enact ordinances affecting public safety operations and priorities. His decisions would directly impact resource allocation for police, fire, and emergency response services.", citations: [{ title: "Communication 2025-2158 — Committee on Hearings and Policy (2025-08-22) [part 24/179]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7524236&GUID=04A91C3F-E2B4-43BA-B8B4-AA1B2CE2DE31" }, { title: "Communication 2025-2121 — Committee on Hearings and Policy (2025-07-25) [part 5/83]", url: "https://pittsburgh.legistar.com/LegislationDetail.aspx?ID=7496515&GUID=CD9E138D-4468-4FC6-BDCD-344E6CAAFC80" }] },
        },
      },
      {
        name: "Alex Rose",
        party: "I" as const,
        bio: "Left-leaning independent candidate whose candidacy survived a legal challenge that went to the PA Supreme Court. Running on a progressive platform focused on community investment.",
        topicBlurbs: {
          government: { text: "Alex Rose would serve on the 15-member Allegheny County Council, which passes the county budget and enacts ordinances. As a left-leaning independent, Rose would bring a non-partisan perspective to the legislative body's four-year term. Council members hold legislative authority over county operations and financial decisions.", citations: [] },
          taxes: { text: "As a County Council member, Rose would vote on the annual county budget, which determines tax rates and spending priorities. A left-leaning independent would likely support progressive tax policies that ask wealthier residents to contribute more. Rose's vote would be one of 15 on all budget and tax matters.", citations: [] },
          housing: { text: "Rose would have the power to enact ordinances addressing housing issues in Allegheny County. As a left-leaning candidate, Rose would likely support policies to increase affordable housing availability and tenant protections. County Council can pass legislation affecting zoning, development, and housing assistance programs.", citations: [] },
          jobs: { text: "Through budget decisions and ordinances, Rose could influence county economic development and job creation initiatives. A left-leaning independent would likely prioritize worker protections, living wages, and investments in job training programs. County Council controls funding for workforce development and can set labor standards for county contracts.", citations: [] },
          public_safety: { text: "Rose would vote on funding for county law enforcement, courts, and emergency services through the annual budget process. As a left-leaning candidate, Rose might emphasize community-based safety approaches alongside traditional policing. County Council has oversight of the county's public safety departments and can pass related ordinances.", citations: [] },
          transit: { text: "County Council members like Rose can influence transit funding and policy through budget allocations and ordinances. A left-leaning independent would likely support expanded public transportation access and sustainable transit options. Rose's vote would affect county contributions to regional transit authorities and infrastructure projects.", citations: [] },
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
    topicBlurbs: Record<string, { text: string; citations: { title: string; url: string }[] }>;
  }[];
  expand: {
    newsSummary: string;
    citations: { title: string; url: string; source: string }[];
  };
}
function buildItems(
  items: RawBallotItem[],
  profile: UserProfile,
  topics: string[],
  topicNames: string
) {
  return items.map((item) => {
    const relatedTopics = topics.filter((topic) => {
      const key = topic.toLowerCase().replace(/\s+/g, "_");
      return key === item.category || key in item.annotations;
    });

    return {
      id: item.id,
      title: item.title,
      officialText: item.officialText,
      annotation: "",  // filled by AnnotationGenerator
      category: item.category,
      relatedTopics: relatedTopics.length > 0 ? relatedTopics : [item.category],
      topicAnnotations: undefined as import("@/types/ballot").TopicAnnotation[] | undefined,
      candidates: item.candidates,
      expand: {
        newsSummary: item.expand.newsSummary,
        citations: item.expand.citations,
        chatbotPrompt: `Explain how "${item.title}" affects someone interested in ${topicNames}${
          profile.aboutYou ? ` who describes themselves as: ${profile.aboutYou}` : ""
        }.`,
      },
    };
  });
}/**
 * Convert raw ballot/race items into the Policy[] shape required by AnnotationGenerator.
 */
function toPolicies(items: RawBallotItem[]): Policy[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    question: item.officialText,
  }));
}

/**
 * Apply AnnotationGenerator results to built ballot items.
 *
 * For every item whose id appears in `annotationResponse`, the generator's
 * annotations replace the hardcoded mock annotation. Multiple annotations
 * (one per relevant user-issue) are joined into a single string. Related
 * topics and citations are also enriched from the generator output.
 */
function applyAnnotations(
  items: ReturnType<typeof buildItems>,
  annotationResponse: AnnotationResponse
) {
  for (const item of items) {
    const annotations = annotationResponse[item.id];

    if (!annotations || annotations.length === 0) {
      console.warn(`⚠️ No annotations returned for "${item.id}" — annotation will be empty.`);
      continue;
    }

    console.log(
      `📝 ${item.id}: ${annotations.length} annotation(s) from generator`,
      annotations.map((a) => ({ issue: a.issues, text: a.annotation.slice(0, 80) }))
    );

    // Store per-topic annotations so the UI can switch between them
    item.topicAnnotations = annotations.map((a) => ({
      topic: a.issues[0] ?? "general",
      text: a.annotation,
      citations: a.citations,
    }));

    // Set the default annotation to the first topic's text
    item.annotation = item.topicAnnotations[0]?.text ?? "";

    // Collect all issues referenced by the generator
    const generatorTopics = annotations.flatMap((a) => a.issues);
    if (generatorTopics.length > 0) {
      item.relatedTopics = [...new Set(generatorTopics)];
    }

    // Merge generator citations into the expand section (avoid duplicates)
    const existingUrls = new Set(item.expand.citations.map((c) => c.url));
    for (const ann of annotations) {
      for (const cite of ann.citations) {
        if (!existingUrls.has(cite.url)) {
          existingUrls.add(cite.url);
          item.expand.citations.push({ ...cite, source: "" });
        }
      }
    }
  }
}

export async function generatePersonalizedBallot(
  profile: UserProfile
): Promise<PersonalizedBallot> {
  const topics = Object.keys(profile.issues ?? {});

  const topicNames = topics
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).replace("_", " "))
    .join(", ");

  const greeting = `Your personalized guide to Pittsburgh's ballot.`;

  const personalizedSummary = `Based on your interests, we've prepared annotations for ${ALL_BALLOT_ITEMS.length} ballot questions and ${ALL_RACE_ITEMS.length} active races. Each item includes a personalized explanation of how it may affect you, along with trusted sources.`;

  // Build items with hardcoded mock annotations as baseline
  const ballotItems = buildItems(ALL_BALLOT_ITEMS, profile, topics, topicNames);
  const raceItems = buildItems(ALL_RACE_ITEMS, profile, topics, topicNames);

  // --- Annotation Generator integration ---
  const dedalusApiKey = import.meta.env.VITE_DEDALUS_API_KEY ?? "";
  const pineconeApiKey = import.meta.env.VITE_PINECONE_API_KEY ?? "";
  const pineconeIndexName = import.meta.env.VITE_PINECONE_INDEX_NAME ?? "";

  if (dedalusApiKey && pineconeApiKey && pineconeIndexName) {
    try {
      const generator = new AnnotationGenerator({
        pineconeApiKey,
        pineconeIndexName,
        dedalusApiKey,
      });

      // Only generate annotations for the three ballot questions, not races
      const questionPolicies: Policy[] = toPolicies(ALL_BALLOT_ITEMS);

      console.log(
        `📋 Generating annotations for ${questionPolicies.length} ballot questions…`
      );
      const startTime = Date.now();

      const annotationResponse = await generator.getAllAnnotations(
        profile,
        questionPolicies
      );

      const elapsed = Date.now() - startTime;
      console.log(`Annotations generated in ${(elapsed / 1000).toFixed(1)}s`);
      console.log(
        "🔑 Response policy IDs:",
        Object.keys(annotationResponse),
        "| Annotation counts:",
        Object.fromEntries(
          Object.entries(annotationResponse).map(([k, v]) => [k, v.length])
        )
      );

      // Override annotations with generator output (questions only)
      applyAnnotations(ballotItems, annotationResponse);
    } catch (err) {
      console.error("⚠️ AnnotationGenerator failed, falling back to mock annotations:", err);
    }
  } else {
    console.warn(
      "⚠️ Missing VITE_DEDALUS_API_KEY / VITE_PINECONE_API_KEY / VITE_PINECONE_INDEX_NAME – using mock annotations."
    );
  }

  const topicExplanations = topics
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
