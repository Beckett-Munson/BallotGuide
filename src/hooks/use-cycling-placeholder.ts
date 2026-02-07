import { useState, useEffect, useCallback } from "react";

const PLACEHOLDER_SUGGESTIONS = [
  "I'm a retired teacher with two grandchildren. I'm concerned about rising property taxes and want to understand the healthcare options available to seniors.",
  "I'm a college student at Pitt worried about student loan debt and public transit access to get to campus.",
  "I'm a small business owner in Lawrenceville. I want to know how new tax policies and regulations might affect my shop.",
  "I'm a parent of three school-age kids in Mt. Lebanon. Education funding and family safety are my top priorities.",
  "I'm a nurse at UPMC concerned about healthcare staffing, insurance costs, and environmental health in our neighborhoods.",
  "I recently moved to Pittsburgh from out of state. I want to understand how local government works and what's on the ballot.",
  "I'm a veteran living in McKeesport. I care about public safety, job opportunities, and access to VA services.",
  "I'm a software engineer working remotely. I'm interested in how local tech policy, broadband access, and housing costs are changing.",
];

export function useCyclingPlaceholder(intervalMs = 5000) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const cycle = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
      setVisible(true);
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setInterval(cycle, intervalMs);
    return () => clearInterval(timer);
  }, [cycle, intervalMs]);

  return {
    text: PLACEHOLDER_SUGGESTIONS[index],
    visible,
  };
}
