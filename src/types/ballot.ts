export interface UserProfile {
  topics: string[];
  aboutYou: string;
  zipCode: string;
}

export interface BallotItem {
  id: string;
  title: string;
  officialText: string;
  annotation: string;
  category: string;
  relatedTopics: string[];
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
