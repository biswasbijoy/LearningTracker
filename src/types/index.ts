export type WeekStatus = "Not Started" | "In Progress" | "Completed" | "Blocked";

export interface DashboardSummary {
  totalWeeks: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  blocked: number;
  overallCompletion: number;
  phaseProgress: PhaseProgress[];
  currentWeek: CurrentWeek | null;
  blockedWeeks: BlockedWeek[];
  recentActivity: RecentActivity[];
  upcomingMilestones: MilestoneInfo[];
}

export interface PhaseProgress {
  phaseId: string;
  phaseName: string;
  total: number;
  completed: number;
  percentage: number;
  orderIndex: number;
}

export interface CurrentWeek {
  weekId: string;
  targetIndex: number;
  focusArea: string;
  weekdayTasks: string;
  weekendMilestone: string;
  status: WeekStatus;
  lastNote: string | null;
}

export interface BlockedWeek {
  weekId: string;
  targetIndex: number;
  focusArea: string;
  notes: string | null;
}

export interface RecentActivity {
  weekId: string;
  targetIndex: number;
  focusArea: string;
  action: string;
  timestamp: Date;
}

export interface MilestoneInfo {
  milestoneId: string;
  name: string;
  status: WeekStatus;
  targetWeekStart: number;
  targetWeekEnd: number;
}

export interface WeekDetail {
  id: string;
  targetIndex: number;
  monthNumber: number;
  focusArea: string;
  weekdayTasks: string;
  weekendMilestone: string;
  status: WeekStatus;
  notes: string | null;
  weekdayHours: number | null;
  weekendHours: number | null;
  completionConfirmedAt: string | null;
  scheduledStartDate: string | null;
  scheduledEndDate: string | null;
  phase: {
    id: string;
    name: string;
    goal: string;
  };
  learningLogs: LearningLogEntry[];
  evidenceItems: EvidenceEntry[];
  statusHistory: StatusChange[];
  milestone: MilestoneLink | null;
}

export interface LearningLogEntry {
  id: string;
  entryDate: string;
  learnedText: string;
  difficultyText: string | null;
  insightText: string | null;
  nextAction: string | null;
  tags: string[];
}

export interface EvidenceEntry {
  id: string;
  type: string;
  title: string;
  url: string | null;
  storageKey: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  description: string | null;
  createdAt: string;
}

export interface StatusChange {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  changedAt: string;
}

export interface MilestoneLink {
  milestoneId: string;
  name: string;
  status: string;
}
