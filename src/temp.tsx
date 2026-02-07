// @ts-nocheck
import { useMemo, useState } from 'react';
import KeywordData from './data/keywords.json';
import BallotQuestionInfo from './data/ballotQuestionInfo.json';
import './App.css';
import axios from 'axios';

const countyOptions = ['Allegheny County'];
const issueOptions = [
  { id: 'climate', label: 'Climate' },
  { id: 'housing', label: 'Housing' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'taxes', label: 'Taxes' },
  { id: 'unions', label: 'Unions' },
  { id: 'abortion', label: 'Abortion' },
  { id: 'immigration', label: 'Immigration' },
  { id: 'crime', label: 'Crime' },
  { id: 'international_relations', label: 'International Relations' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'lgbtq', label: 'LGBTQ' },
  { id: 'job', label: 'Job' },
  { id: 'social', label: 'Social Life' },
  { id: 'kids', label: 'Kids' },
];

const districtOptions = [
  { id: "district_2", label:"District 2" },
  { id: "district_4", label:"District 4" },
  { id: "district_6", label:"District 6" }
];

type PolicyCategory = 'sustainability' | 'financial' | 'infrastructure';

type Annotation = {
  id: string;
  side: 'left' | 'right';
  title: string;
  summary: string;
  impact: string;
  category: PolicyCategory;
  targetId: string;
};

type BallotInfo = {
  id: string;
  billName: string;
  summary: string;
  background: string;
  implications: string;
};

const ballotAnnotations: Annotation[] = [
  {
    id: 'transit-funding',
    side: 'left',
    title: 'City Transit Funding Expansion',
    summary:
      'Allows the city to dedicate a larger share of local sales tax revenue to modernize buses and shelters. Focuses on upgrades near campus corridors and late-night routes.',
    impact:
      'If you rely on public transit for classes or work, this could mean more frequent service and safer stops on your daily commute.',
    category: 'infrastructure',
    targetId: 'q1',
  },
  {
    id: 'renewable-mandate',
    side: 'left',
    title: 'Local Renewable Energy Mandate',
    summary:
      'Requires municipal buildings and new developments to hit a renewable energy target by 2030. Includes grants for neighborhood solar co-ops.',
    impact:
      'If you care about air quality or want lower utility bills, this could accelerate cleaner energy options in your neighborhood.',
    category: 'sustainability',
    targetId: 'q2',
  },
  {
    id: 'student-loan-cap',
    side: 'left',
    title: 'Student Loan Interest Cap',
    summary:
      'Creates a city-backed refinancing program with an interest cap for graduates working in Allegheny County.',
    impact:
      'If you are planning to stay in Pittsburgh after graduation, this could reduce your monthly loan payments.',
    category: 'financial',
    targetId: 'q3',
  },
  {
    id: 'workforce-housing',
    side: 'right',
    title: 'Workforce Housing Trust',
    summary:
      'Establishes a dedicated trust fund for mixed-income housing near major transit corridors.',
    impact:
      'If you are renting with roommates, this could increase the number of affordable units close to school or work.',
    category: 'financial',
    targetId: 'q4',
  },
  {
    id: 'riverfront-greenway',
    side: 'right',
    title: 'Riverfront Greenway & Safety Plan',
    summary:
      'Allocates funding to extend riverfront trails, lighting, and public safety patrols.',
    impact:
      'If you spend time outdoors or bike around the city, this could make routes safer and more connected.',
    category: 'sustainability',
    targetId: 'q5',
  },
  {
    id: 'apprenticeship-incentive',
    side: 'right',
    title: 'Apprenticeship & Union Training Incentive',
    summary:
      'Offers tax credits to employers who expand paid apprenticeships and union training programs.',
    impact:
      'If you are entering the workforce, this could increase paid training opportunities without a four-year degree.',
    category: 'infrastructure',
    targetId: 'q6',
  },
];

const ballotQuestions = [
  {
    id: 'q1',
    title: 'Question 1: Non-Discrimination in City Business and Foreign State Affiliations Amendment',
    text:
      'Shall the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions, be supplemented by adding a new Section, "105. Local Governance", by prohibiting the discrimination on the basis of race, religion, ancestry, sex, sexual orientation, age, gender identity or expression, disability, place of birth, national origin or association or affiliation with any nation or foreign state in conducting business of the City?'
  },
  {
    id: 'q2',
    title: 'Question 2: Public Ownership of Water and Sewer Systems',
    text:
      'Shall the Pittsburgh Home Rule Charter be amended and supplemented by adding a new Article 11: RIGHT TO PUBLIC OWNERSHIP OF POTABLE WATER SYSTEMS, WASTEWATER SYSTEM, AND STORM SEWER SYSTEMS, which restricts the lease and/or sale of the City\'s water and sewer system to private entities?'
  },
  {
    id: 'q3',
    title: 'Question 3: Prohibit the Use of the Charter Amendment Process to Add Duties Beyond the Scope of City Authority ',
    text:
      'Shall the Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definitions, be supplemented by adding a new section, "104. Amendments to Charter", by prohibiting the use of the Home Rule Charter Amendment process to add duties or obligations beyond the lawful scope of the city\'s authority?'
  },
];

const ballotHighlightPatterns: Record<string, RegExp> = {
  q1: /Pittsburgh Home Rule Charter, Article One, Home Rule Powers - Definition[s]?,/i,
  q2: /Article 11: RIGHT TO PUBLIC OWNERSHIP OF POTABLE WATER SYSTEMS, WASTEWATER SYSTEM, AND STORM SEWER SYSTEMS/i,
  q3: /Home Rule Charter, Article One, Home Rule Powers/i,
};



const categoryLabel: Record<PolicyCategory, string> = {
  sustainability: 'Sustainability',
  financial: 'Financial Impact',
  infrastructure: 'Local Infrastructure',
};

function AnnotationCard({
  annotation,
  onExpand,
}: {
  annotation: Annotation;
  onExpand: (annotation: Annotation) => void;
}) {
  return (
    <div className={`annotation-card ${annotation.side} ${annotation.category}`}>
      <div className="annotation-header">
        <span className="annotation-category">{categoryLabel[annotation.category]}</span>
        <h3>{annotation.title}</h3>
      </div>
      <p className="annotation-summary">{annotation.summary}</p>
      <div className="annotation-impact">
        <strong>How this affects you</strong>
        <p>{annotation.impact}</p>
      </div>
      <button className="annotation-expand" onClick={() => onExpand(annotation)}>
        Expand
      </button>
      <div className={`annotation-line ${annotation.side}`} aria-hidden="true" />
    </div>
  );
}

function App() {
  const [view, setView] = useState('landing');
  const [activePolicy, setActivePolicy] = useState(null as Annotation | null);
  const [selectedIssues, setSelectedIssues] = useState([] as string[]);
  const [notes, setNotes] = useState('');
  const [age, setAge] = useState(0);
  const [district, setDistrict] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState(null as string | null);

  const ballotInfoMap = useMemo(() => {
    return BallotQuestionInfo.reduce((acc: Record<string, BallotInfo>, info) => {
      acc[info.id] = info;
      return acc;
    }, {});
  }, []);

  // call to backend with prompt
  const getAnnotations = async ({ age,district,issues,notes }) => {
    try {
      const issueKeywordMap: Record<string, string[]> = {};

      KeywordData.forEach((item) => {
        if (issues.includes(item.id)) {
          issueKeywordMap[item.id] = item.keywords;
        }
      });

      const prompt = `
        User Profile:
        Age: ${age}
        District: ${district}

        Selected Issues:
        ${issues.join(', ')}

        Keywords by Issue (dictionary format):
        ${JSON.stringify(issueKeywordMap, null, 2)}

        Additional Context:
        ${notes}

        Task:
        Fetch legislations related to the user.
        `;

      const response = await axios.post(
        'http://localhost:5001/annotations',
        {
          prompt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('LLM Response:', response.data);

    } catch (error) {
      console.error('Error generating annotations:', error);
    }
  };

  const groupedAnnotations = useMemo(
    () => ({
      left: ballotAnnotations.filter((annotation) => annotation.side === 'left'),
      right: ballotAnnotations.filter((annotation) => annotation.side === 'right'),
    }),
    []
  ) as { left: Annotation[]; right: Annotation[] };

  const renderBallotText = (question: { id: string; text: string }) => {
    const hasInfo = Boolean(ballotInfoMap[question.id]);
    const pattern = ballotHighlightPatterns[question.id];
    if (!pattern) {
      return question.text;
    }

    const match = question.text.match(pattern);
    if (!match || match.index === undefined) {
      return question.text;
    }

    const start = match.index;
    const end = start + match[0].length;
    const before = question.text.slice(0, start);
    const highlight = question.text.slice(start, end);
    const after = question.text.slice(end);

    if (!hasInfo) {
      return (
        <>
          {before}
          <span className="ballot-highlight">{highlight}</span>
          {after}
        </>
      );
    }

    return (
      <>
        {before}
        <button
          type="button"
          className="ballot-link"
          aria-expanded={expandedQuestionId === question.id}
          aria-controls={`${question.id}-details`}
          onClick={() =>
            setExpandedQuestionId((prev) => (prev === question.id ? null : question.id))
          }
        >
          <span className="ballot-highlight">{highlight}</span>
        </button>
        {after}
      </>
    );
  };

  const handleIssueToggle = (id: string) => {
    setSelectedIssues((prev: string[]) =>
      prev.includes(id) ? prev.filter((issue: string) => issue !== id) : [...prev, id]
    );
  };

  return (
    <div className="app">
      <div className={`app-content ${activePolicy ? 'is-blurred' : ''}`}>
        {view === 'landing' ? (
          <main className="landing">
            <div className="landing-ballot">
              <p className="landing-tag">Get started</p>
              <h1>Your personalized ballot briefing</h1>
              <p className="landing-subtitle">
                Tell us a little about what matters to you. We will show how local
                policy proposals connect to daily life in Pittsburgh.
              </p>
              <form
                onSubmit={(event: any) => {
                  event.preventDefault();
                  getAnnotations(age, district, selectedIssues, notes)
                  setView('ballot');
                }}
              >
                <label className="field">
                  <span>County</span>
                  <select>
                    {countyOptions.map((county) => (
                      <option key={county}>{county}</option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>District</span>
                  <select>
                    {districtOptions.map((district) => (
                      <option key={district.id}>{district.label}</option>
                    ))}
                  </select>
                </label>

                <label className="field">Age
                  <input className="age-input" name="age" type="number" />
                </label>

                <fieldset className="field">
                  <legend>Key issues on your mind</legend>
                  <div className="checkbox-grid">
                    {issueOptions.map((issue) => (
                      <label key={issue.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedIssues.includes(issue.id)}
                          onChange={() => handleIssueToggle(issue.id)}
                        />
                        <span>{issue.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="field">
                  <span>Anything else?</span>
                  <textarea
                    placeholder="Share context like work hours, campus commute, or other priorities."
                    value={notes}
                    onChange={(event: any) => setNotes(event.target.value)}
                  />
                </label>
                <button className="primary-button" type="submit">
                  See My Ballot
                </button>
              </form>
            </div>
          </main>
        ) : (
          <main className="ballot-page">
            <header className="ballot-header">
              <div>
                <p className="eyebrow">Pittsburgh 2025 Ballot Preview</p>
                <h1>Know what each proposal means for you.</h1>
                <p>
                  Neutral, line-by-line annotations connect local questions to everyday
                  life for voters ages 18–24.
                </p>
              </div>
              <button className="ghost-button" onClick={() => setView('landing')}>
                Edit my responses
              </button>
            </header>

            <div className="ballot-layout">
              <section className="annotations-column">
                {groupedAnnotations.left.map((annotation: Annotation) => (
                  <AnnotationCard
                    key={annotation.id}
                    annotation={annotation}
                    onExpand={setActivePolicy}
                  />
                ))}
              </section>

              <section className="ballot-center">
                <div className="ballot-paper">
                  <div className="ballot-title">
                    <h2>Official Municipal Election Ballot</h2>
                    <p>City of Pittsburgh • November 4, 2025</p>
                  </div>
                  <ol className="ballot-questions">
                    {ballotQuestions.map((question) => (
                      <li key={question.id} className="ballot-question">
                        <div className="ballot-question-header">
                          <span className="question-label">{question.title}</span>
                          <span className="question-id" id={question.id}>
                            {question.id.toUpperCase()}
                          </span>
                        </div>
                        <div className="ballot-annotation">
                          <span className="ballot-text">{renderBallotText(question)}</span>
                          {ballotInfoMap[question.id] &&
                          expandedQuestionId === question.id ? (
                            <div id={`${question.id}-details`} className="ballot-details">
                              <p className="ballot-details-title">
                                {ballotInfoMap[question.id].billName}
                              </p>
                              <p>{ballotInfoMap[question.id].summary}</p>
                              <p>{ballotInfoMap[question.id].background}</p>
                              <div className="ballot-details-impact">
                                <strong>What a Yes/No vote means</strong>
                                <p>{ballotInfoMap[question.id].implications}</p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="ballot-options">
                          <label>
                            <input type="radio" name={question.id} /> Yes
                          </label>
                          <label>
                            <input type="radio" name={question.id} /> No
                          </label>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <section className="annotations-column">
                {groupedAnnotations.right.map((annotation: Annotation) => (
                  <AnnotationCard
                    key={annotation.id}
                    annotation={annotation}
                    onExpand={setActivePolicy}
                  />
                ))}
              </section>
            </div>
          </main>
        )}
      </div>

      {activePolicy ? (
        <div className="policy-overlay" onClick={() => setActivePolicy(null)}>
          <div
            className={`policy-modal ${activePolicy.category}`}
            onClick={(event: any) => event.stopPropagation()}
          >
            <span className="modal-tag">Expanded policy view</span>
            <h2>{activePolicy.title}</h2>
            <p className="modal-summary">{activePolicy.summary}</p>
            <div className="modal-impact">
              <h3>How this affects you</h3>
              <p>{activePolicy.impact}</p>
            </div>
            <div className="modal-meta">
              <span className="badge">{categoryLabel[activePolicy.category]}</span>
              <span className="badge">Linked to {activePolicy.targetId.toUpperCase()}</span>
            </div>
            <button className="primary-button" onClick={() => setActivePolicy(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
