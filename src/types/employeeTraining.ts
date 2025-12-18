export interface EmployeeTraining {
  id: string;
  name: string;
  date: string;
  time: string;
  description?: string;
  attended: boolean;
  acknowledgment: boolean;
}
