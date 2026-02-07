export interface UserProfile {
  topics: string[];
  ageRange: string;
  employmentType: string;
  familyStatus: string;
  isVeteran: boolean;
  isStudent: boolean;
  zipCode: string;
}

export interface BallotItem {
  id: string;
  title: string;
  officialText: string;
  annotation: string;
  category: string;
  expand: {
    newsSummary: string;
    citations: { title: string; url: string; source: string }[];
    chatbotPrompt: string;
  };
}

export interface TopicExplanation {
  topic: string;
  title: string;
  explanation: string;
  citations: { title: string; url: string; source: string }[];
}

export interface PersonalizedBallot {
  greeting: string;
  personalizedSummary: string;
  ballotItems: BallotItem[];
  topicExplanations: TopicExplanation[];
}
