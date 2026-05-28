export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type Country = 'CO' | 'MX';
export type FeedbackType = 'helpful' | 'not_helpful';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  country: Country;
  category: string;
  agent: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  mttr?: number; // minutes
}

export interface SimilarCase {
  id: string;
  title: string;
  similarity: number; // 0-1
  resolution: string;
  resolvedAt: string;
}

export interface LegalReference {
  source: string;
  article: string;
  description: string;
  country: Country;
  url?: string;
}

export interface AIResponse {
  answer: string;
  confidence: number; // 0-1
  reasoning: string;
  similarCases: SimilarCase[];
  legalReferences: LegalReference[];
  shouldEscalate: boolean;
  escalationReason?: string;
  processingTime: number; // ms
}

export interface FeedbackPayload {
  ticketId: string;
  responseId: string;
  type: FeedbackType;
  comment?: string;
}

export interface DashboardMetrics {
  mttrAvg: number;
  mttrTrend: number; // % change
  totalTickets: number;
  resolvedTickets: number;
  escalatedTickets: number;
  aiConfidenceAvg: number;
  topCategories: CategoryStat[];
  repetitivePatterns: RepetitivePattern[];
  knowledgeGaps: KnowledgeGap[];
  agentPerformance: AgentPerformance[];
  dailyVolume: DailyVolumeStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
  mttr: number;
}

export interface RepetitivePattern {
  pattern: string;
  occurrences: number;
  category: string;
  suggestedAction: string;
}

export interface KnowledgeGap {
  topic: string;
  ticketCount: number;
  avgConfidence: number;
  impact: 'low' | 'medium' | 'high';
}

export interface AgentPerformance {
  name: string;
  ticketsResolved: number;
  mttr: number;
  escalationRate: number;
  aiUsageRate: number;
}

export interface DailyVolumeStat {
  date: string;
  tickets: number;
  resolved: number;
  escalated: number;
}

export interface WebhookRequest {
  query: string;
  ticketId: string;
  country: Country;
  category?: string;
}

export interface WebhookResponse {
  output?: string;
  answer?: string;
  confidence?: number;
  reasoning?: string;
  similar_cases?: SimilarCase[];
  legal_references?: LegalReference[];
  should_escalate?: boolean;
  escalation_reason?: string;
  processing_time?: number;
  error?: string;
}
