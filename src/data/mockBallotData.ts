import type { UserProfile, PersonalizedBallot } from "@/types/ballot";

const ALL_BALLOT_ITEMS = [
  {
    id: "measure-a",
    title: "Allegheny County Healthcare Access Initiative",
    category: "healthcare",
    officialText:
      "Shall Allegheny County authorize an annual allocation of $12 million from the general fund to expand community health clinics in underserved areas, improve telehealth infrastructure, and subsidize prescription drug costs for low-income residents?",
    annotations: {
      default:
        "This measure would fund new community health clinics and telehealth services across the county. If passed, it could reduce wait times for primary care and lower out-of-pocket costs for prescriptions.",
      healthcare:
        "This directly affects healthcare access in your area. If passed, it would fund new community clinics and telehealth, potentially reducing your wait times for primary care and lowering prescription costs for eligible residents.",
      taxes:
        "This measure would allocate $12M annually from the county general fund. While it doesn't raise taxes directly, it redirects existing revenue toward healthcare, which could affect other county services.",
    },
    expand: {
      newsSummary:
        "Allegheny County has seen a 15% increase in uninsured residents since 2022. The initiative is modeled after successful programs in Cuyahoga County, Ohio, which reduced ER visits by 22% in its first two years. Local advocates say the measure addresses a critical gap, while fiscal conservatives have raised concerns about long-term funding sustainability.",
      citations: [
        {
          title: "Allegheny County Health Department 2024 Annual Report",
          url: "https://www.alleghenycounty.us/health-department",
          source: "Allegheny County",
        },
        {
          title: "Community Health Centers and Access to Care",
          url: "https://www.kff.org/community-health-centers",
          source: "Kaiser Family Foundation",
        },
      ],
    },
  },
  {
    id: "measure-b",
    title: "Property Tax Assessment Reform Referendum",
    category: "taxes",
    officialText:
      "Shall Allegheny County implement a new property tax assessment system requiring reassessments every five years, with a 3% annual cap on assessment increases for primary residences, effective January 2027?",
    annotations: {
      default:
        "This referendum would change how property taxes are assessed in the county. Homeowners would see more predictable tax bills with a cap on annual increases, though this could shift more of the tax burden to commercial properties.",
      taxes:
        "This directly impacts your tax situation. The 3% annual cap on assessment increases would make your property tax bills more predictable. However, if your property value has been under-assessed, you may see a correction during the next reassessment cycle.",
      healthcare:
        "While primarily a tax measure, property tax revenue funds county services including public health programs. Changes to assessment methods could indirectly affect healthcare funding levels.",
    },
    expand: {
      newsSummary:
        "Allegheny County hasn't conducted a countywide reassessment since 2012, leading to significant disparities. A 2024 Pittsburgh Post-Gazette analysis found that properties in lower-income neighborhoods are often over-assessed relative to market value, while wealthier areas are under-assessed. The proposed reform aims to address these inequities while protecting homeowners from sudden tax spikes.",
      citations: [
        {
          title: "Property Tax Inequities in Allegheny County",
          url: "https://www.post-gazette.com/property-tax-assessment",
          source: "Pittsburgh Post-Gazette",
        },
        {
          title: "Property Tax Assessment Reform: Best Practices",
          url: "https://www.lincolninst.edu/property-tax",
          source: "Lincoln Institute of Land Policy",
        },
      ],
    },
  },
  {
    id: "measure-c",
    title: "Green Infrastructure and Climate Resilience Bond",
    category: "environment",
    officialText:
      "Shall Allegheny County issue $45 million in bonds to fund stormwater management improvements, urban tree canopy restoration, and energy efficiency upgrades to county buildings over the next ten years?",
    annotations: {
      default:
        "This bond measure would fund environmental infrastructure projects across the county, including stormwater management, tree planting, and building efficiency upgrades. Bonds would be repaid through existing tax revenue.",
      environment:
        "This measure directly addresses environmental concerns in Allegheny County. It would fund green infrastructure to reduce flooding, improve air quality through urban tree planting, and cut the county's carbon footprint through building upgrades.",
      taxes:
        "This $45M bond would be repaid over 10 years through existing tax revenue. While it doesn't create new taxes, it does commit future revenue to debt service, which could limit flexibility for other spending priorities.",
    },
    expand: {
      newsSummary:
        "Pittsburgh and surrounding communities have experienced increasing flooding events, with 2024 seeing three major flood events causing over $50M in damage. The bond measure is supported by environmental groups and has bipartisan backing on County Council. Critics argue the county should prioritize existing infrastructure repairs before taking on new debt.",
      citations: [
        {
          title: "Pittsburgh Region Flooding Impact Assessment",
          url: "https://www.alleghenycounty.us/stormwater",
          source: "Allegheny County Public Works",
        },
        {
          title: "Green Infrastructure Reduces Flood Risk",
          url: "https://www.epa.gov/green-infrastructure",
          source: "U.S. Environmental Protection Agency",
        },
      ],
    },
  },
  {
    id: "race-1",
    title: "Allegheny County Executive",
    category: "office",
    officialText:
      "Vote for one candidate for Allegheny County Executive to serve a four-year term beginning January 2027.",
    annotations: {
      default:
        "The County Executive is the chief executive officer of Allegheny County, overseeing a $1 billion annual budget and county departments including Health, Human Services, and Public Works.",
      healthcare:
        "The County Executive oversees the Allegheny County Health Department, which manages public health programs, disease surveillance, and environmental health inspections. Your next executive's priorities will shape healthcare access across the county.",
      taxes:
        "The County Executive proposes the annual county budget and can influence property tax rates and fees. This role directly shapes how your tax dollars are spent across county services.",
    },
    expand: {
      newsSummary:
        "The race for County Executive features candidates with contrasting visions for the county's future. Key issues include property tax reform, public transit funding, and the county's role in addressing housing affordability. Early polling shows a competitive race with no clear frontrunner.",
      citations: [
        {
          title: "2026 Allegheny County Executive Race Overview",
          url: "https://www.ballotpedia.org/allegheny-county",
          source: "Ballotpedia",
        },
        {
          title: "County Government Structure",
          url: "https://www.alleghenycounty.us/government",
          source: "Allegheny County",
        },
      ],
    },
  },
  {
    id: "race-2",
    title: "County Council District 7",
    category: "office",
    officialText:
      "Vote for one candidate for Allegheny County Council, District 7, to serve a four-year term.",
    annotations: {
      default:
        "County Council is the legislative body of Allegheny County, responsible for approving budgets, setting tax rates, and enacting local ordinances. District 7 covers portions of Pittsburgh's East End and surrounding communities.",
      healthcare:
        "County Council approves funding for health programs and can pass ordinances affecting public health. Council members in your district will vote on healthcare-related budget items that affect your community directly.",
      environment:
        "County Council votes on environmental regulations, stormwater management, and green infrastructure funding. Your council representative can champion or block environmental initiatives in your district.",
    },
    expand: {
      newsSummary:
        "District 7 is one of several competitive council races this cycle. Candidates have focused on neighborhood development, public safety, and infrastructure investment. The district has seen significant demographic shifts in recent years, making it a bellwether for county politics.",
      citations: [
        {
          title: "Allegheny County Council Districts",
          url: "https://www.alleghenycounty.us/county-council",
          source: "Allegheny County",
        },
      ],
    },
  },
  {
    id: "measure-d",
    title: "Public Transit Funding Amendment",
    category: "transit",
    officialText:
      "Shall Allegheny County dedicate an additional 0.25% of sales tax revenue to the Port Authority of Allegheny County for the purpose of expanding bus rapid transit routes and improving service frequency on existing routes?",
    annotations: {
      default:
        "This measure would increase public transit funding through a small sales tax allocation. It aims to expand bus rapid transit and improve service frequency, benefiting commuters and reducing traffic congestion.",
      taxes:
        "This would slightly increase the effective sales tax rate in Allegheny County. For a household spending $30,000 annually on taxable goods, this would amount to approximately $75 more per year in sales tax.",
      environment:
        "Expanded public transit directly reduces carbon emissions from personal vehicles. Studies show that every dollar invested in public transit returns $4 in economic benefits and measurably improves air quality.",
    },
    expand: {
      newsSummary:
        "Port Authority ridership has recovered to 85% of pre-pandemic levels, but service cuts during the pandemic left many routes with reduced frequency. The proposed funding would restore pre-pandemic service levels and add new bus rapid transit corridors connecting underserved communities to major employment centers.",
      citations: [
        {
          title: "Port Authority of Allegheny County Ridership Data",
          url: "https://www.portauthority.org/ridership",
          source: "Port Authority",
        },
        {
          title: "Economic Impact of Public Transit Investment",
          url: "https://www.apta.com/research-technical-resources",
          source: "American Public Transportation Association",
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
  healthcare: {
    topic: "healthcare",
    title: "Healthcare on Your Ballot",
    explanation:
      "Several items on your Allegheny County ballot this cycle directly affect healthcare access and costs. The Healthcare Access Initiative (Measure A) would expand community clinics and telehealth, addressing a documented gap in primary care access. Additionally, the County Executive race matters for healthcare because the executive oversees the County Health Department, which manages public health programs, vaccination campaigns, and environmental health inspections. According to the Kaiser Family Foundation, counties that invest in community health infrastructure see measurable reductions in emergency room usage and overall healthcare costs.",
    citations: [
      {
        title: "The Role of Local Government in Health Equity",
        url: "https://www.rwjf.org/local-government-health",
        source: "Robert Wood Johnson Foundation",
      },
      {
        title: "Community Health Centers: A Primer",
        url: "https://www.kff.org/community-health-centers",
        source: "Kaiser Family Foundation",
      },
    ],
  },
  taxes: {
    topic: "taxes",
    title: "Tax Policy on Your Ballot",
    explanation:
      "Tax policy is woven throughout this ballot. The Property Tax Assessment Reform (Measure B) would change how your property is assessed, potentially affecting your annual tax bill. The Public Transit Funding Amendment (Measure D) would add a 0.25% sales tax allocation. Meanwhile, the Green Infrastructure Bond (Measure C) commits future tax revenue to debt repayment. Understanding how these interact is key: while no single measure dramatically raises taxes, together they reflect choices about how county revenue is collected and spent. The Lincoln Institute of Land Policy recommends regular reassessments as a best practice for tax fairness.",
    citations: [
      {
        title: "Property Tax Policy in Pennsylvania",
        url: "https://www.lincolninst.edu/property-tax",
        source: "Lincoln Institute of Land Policy",
      },
      {
        title: "Understanding Local Tax Measures",
        url: "https://www.taxpolicycenter.org/local",
        source: "Tax Policy Center",
      },
    ],
  },
  environment: {
    topic: "environment",
    title: "Environmental Issues on Your Ballot",
    explanation:
      "Environmental policy features prominently on this ballot. The Green Infrastructure Bond (Measure C) would directly fund stormwater management and urban tree planting — both critical for a county that has experienced increased flooding events. The Public Transit Amendment (Measure D) would reduce carbon emissions by expanding bus service. According to the EPA, green infrastructure investments are among the most cost-effective ways to address both flooding and air quality concerns. Pittsburgh's air quality, while improved from its industrial past, still ranks among the worst in the nation for particulate pollution.",
    citations: [
      {
        title: "Green Infrastructure Benefits",
        url: "https://www.epa.gov/green-infrastructure",
        source: "U.S. Environmental Protection Agency",
      },
      {
        title: "Air Quality in the Pittsburgh Region",
        url: "https://www.lung.org/research/sota/city-rankings",
        source: "American Lung Association",
      },
    ],
  },
  foreign_policy: {
    topic: "foreign_policy",
    title: "Foreign Policy and Your Local Ballot",
    explanation:
      "While foreign policy is primarily a federal issue, local elections can reflect its impact. Allegheny County is home to significant defense contractors and military installations, and trade policy affects the region's manufacturing sector. Veterans' services are funded in part through county programs, and immigration policy impacts the growing immigrant communities in Pittsburgh's neighborhoods. Your County Executive and Council representatives can advocate for federal funding that supports these communities and pass local resolutions on issues of national importance.",
    citations: [
      {
        title: "How Local Elections Connect to National Policy",
        url: "https://www.brookings.edu/local-federal-nexus",
        source: "Brookings Institution",
      },
    ],
  },
  education: {
    topic: "education",
    title: "Education on Your Ballot",
    explanation:
      "While school board elections are separate, county-level decisions significantly impact education. Property tax revenue funds local schools, making the Property Tax Assessment Reform (Measure B) particularly relevant. The County Executive also oversees workforce development programs and community college partnerships. Allegheny County's investment in educational infrastructure affects everything from pre-K access to adult career training programs.",
    citations: [
      {
        title: "Property Taxes and School Funding in Pennsylvania",
        url: "https://www.education.pa.gov/funding",
        source: "PA Department of Education",
      },
    ],
  },
  housing: {
    topic: "housing",
    title: "Housing Policy on Your Ballot",
    explanation:
      "Housing affordability is increasingly central to Allegheny County politics. The Property Tax Assessment Reform (Measure B) directly affects homeowners' costs, while the County Executive candidates have staked out positions on affordable housing investment. The Green Infrastructure Bond (Measure C) includes provisions for neighborhood improvements that can affect property values. Understanding how these measures interact is key for anyone concerned about housing costs and availability.",
    citations: [
      {
        title: "Housing Affordability in Allegheny County",
        url: "https://www.alleghenycounty.us/economic-development/housing",
        source: "Allegheny County",
      },
    ],
  },
};

function getAnnotation(
  item: (typeof ALL_BALLOT_ITEMS)[0],
  topics: string[]
): string {
  for (const topic of topics) {
    const key = topic.toLowerCase().replace(/\s+/g, "_");
    if (key in item.annotations) {
      return item.annotations[key as keyof typeof item.annotations] || item.annotations.default;
    }
  }
  return item.annotations.default;
}

export function generatePersonalizedBallot(
  profile: UserProfile
): PersonalizedBallot {
  const topicNames = profile.topics
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(", ");

  const greeting = `Welcome, Allegheny County voter! We've tailored this guide based on what matters most to you.`;

  const personalizedSummary = `Based on your interests in ${topicNames}, we've prepared annotations for ${ALL_BALLOT_ITEMS.length} ballot items in Allegheny County. Each item includes a personalized explanation of how it may affect you, along with trusted sources for further reading.`;

  const ballotItems = ALL_BALLOT_ITEMS.map((item) => ({
    id: item.id,
    title: item.title,
    officialText: item.officialText,
    annotation: getAnnotation(item, profile.topics),
    category: item.category,
    expand: {
      newsSummary: item.expand.newsSummary,
      citations: item.expand.citations,
      chatbotPrompt: `Explain how "${item.title}" affects someone interested in ${topicNames} who is ${profile.ageRange}, ${profile.employmentType}, and ${profile.familyStatus}${profile.isVeteran ? ", and is a veteran" : ""}${profile.isStudent ? ", and is a student" : ""}.`,
    },
  }));

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
    topicExplanations,
  };
}
