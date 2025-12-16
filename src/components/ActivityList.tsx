import { Activity } from '../App';
import { ActivityCard } from './ActivityCard';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  onEdit: (activity: Activity) => void;
  //onStatusChange: (id: string, status: Activity['status']) => void;
}

export function ActivityList({ activities, onDelete, onEdit }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center shadow-sm">
        <p className="text-gray-500">
          No activities found. Create your first activity to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onDelete={onDelete}
          onEdit={onEdit}
          //onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
