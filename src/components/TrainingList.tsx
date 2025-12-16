import { Training, Training_departments, Employee, Department, Participant } from '../App';
import { TrainingCard } from './TrainingCard';

interface TrainingListProps {
  trainings: Training[];
  training_departments: Training_departments[];
  employees: Employee[];
  departments: Department[];
  participants: Participant[];
  onDelete: (id: string) => void;
  onEdit: (training: Training) => void;
  //onStatusChange: (id: string, status: Training['status']) => void;
}

export function TrainingList({ trainings, training_departments, employees, departments, participants, onDelete, onEdit }: TrainingListProps) {
  if (trainings.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center shadow-sm">
        <p className="text-gray-500">
          No trainings found. Create your first training to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trainings.map(training => (
        <TrainingCard
          key={training.id}
          training={training}
          employees={employees}
          departments={departments}
          participants={participants}
          training_departments={training_departments}
          onDelete={onDelete}
          onEdit={onEdit}
          //onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
