import { AddTask } from "../models/to-do-list.model";

export function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}


export function getStatusCounts(tasks: AddTask[]) {
  const counts = {
    open: 0,
    inProgress: 0,
    completed: 0
  };

  tasks.forEach(task => {
    switch (task.status.toLowerCase()) {
      case 'open':
        counts.open++;
        break;
      case 'inprogress':
        counts.inProgress++;
        break;
      case 'completed':
        counts.completed++;
        break;
    }
  });

  return counts;
}