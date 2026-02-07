export interface UserProfile {
  topics: string[];
  aboutYou: string;
  zipCode: string;
}

export interface Candidate {
  name: string;
  party: "D" | "R" | "I" | "L";
  isIncumbent?: boolean;
  bio: string;
  topicBlurbs: Record<string, string>;
}

export interface BallotItem {
  id: string;
  title: string;
  officialText: string;
  annotation: string;
  category: string;
  relatedTopics: string[];
  candidates?: Candidate[];
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
  raceItems: BallotItem[];
  topicExplanations: TopicExplanation[];
}
