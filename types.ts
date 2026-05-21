export type LeadStatus = "Qualified" | "Researching" | "Contacted" | "Nurture";

export type Lead = {
  id: string;
  company: string;
  domain: string;
  segment: string;
  location: string;
  employees: number;
  revenue: string;
  score: number;
  intent: string;
  status: LeadStatus;
  owner: string;
  saved: boolean;
  signals: string[];
  summary: string;
};

export type Campaign = {
  name: string;
  sent: number;
  replies: number;
  pipeline: string;
  conversion: number;
};
