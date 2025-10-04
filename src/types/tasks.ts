export interface Task {
  id: number;
  title: string;
  category: "note" | "event" | "goal";
  date: string; 
  time: string; 
  notes: string;
  completed: boolean;
}
