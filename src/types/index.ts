export interface LearningGoal {
  skill: string;
  duration: number;
  language: string;
}

export interface Milestone {
  milestone: string;
  description: string;
  timeframe: string;
  keyPoints: string[];
}

export interface DailyTask {
  day: number;
  focus: string;
  tasks: string[];
  estimatedTime: string;
}

export interface WeekSchedule {
  week: number;
  theme: string;
  dailyTasks: DailyTask[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  completed: boolean;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: string;
}

export interface ResourceGroup {
  milestone: string;
  links: ResourceLink[];
}

export interface LearningPlanData {
  skill: string;
  duration: number;
  language: string;
  roadmap: Milestone[];
  schedule: WeekSchedule[];
  checklist: ChecklistItem[];
  resources: ResourceGroup[];
}