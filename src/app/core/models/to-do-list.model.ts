export interface AddTask{
  id: number;
  task: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  selectedLabels : AddLabel[];
  created_at: string;
}

export interface AddLabel{
  name: string; 
  value: string; 
  color: string; 
  backgroundColor: string;
}

export interface statusCount{
  open: number;
  inProgress: number;
  completed: number;
}