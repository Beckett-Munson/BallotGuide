export interface UserProfile {
  age: number;
  issues: Record<string, string[]>; // dictionary for string (issue) : list of strings (keywords)
  aboutYou: string;
  zipCode: string;
}

export interface Policy {
  id: string;
  title: string;
  question: string;
}

export interface Annotation {
  id: string;
  type: "policy" | "question" | "candidate";
  issues: string[]; // list of issues from the user that connect to this annotation
  annotation: string; // how this affects user
  citations: { title: string; url: string }[];
}

export interface AnnotationResponse { // maps each policy id to a list of its annotations
  [policyId: string]: Annotation[];
}

export interface Candidate {
  name: string;
  party: "D" | "R" | "I" | "L";
  isIncumbent?: boolean;
  bio: string;
  topicBlurbs: Record<string, string>;
}

export interface TopicAnnotation {
  topic: string;
  text: string;
  citations: { title: string; url: string }[];
}

export interface BallotItem {
  id: string;
  title: string;
  officialText: string;
  annotation: string;
  category: string;
  relatedTopics: string[];
  /** Per-topic annotation texts from the generator. When present, topic pills become clickable tabs. */
  topicAnnotations?: TopicAnnotation[];
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
