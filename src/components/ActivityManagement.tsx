import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Users, CheckCircle } from 'lucide-react';
import { Training, Employee, Department, Participant } from '../App';
import { ActivityFormModal } from './ActivityFormModal';

interface ActivityManagementProps {
  activities: Training[];
  setActivities: (activities: Training[]) => void;
  employees: Employee[];
  departments: Department[];
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
}

export function ActivityManagement({
  activities,
  setActivities,
  employees,
  departments,
  participants,
  setParticipants,
}: ActivityManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Training | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'notAttended'>('all');

  const filteredActivities = useMemo(() => {
    return activities.filter(activity =>
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  const handleCreate = (activity: Omit<Training, 'id'>) => {
    const newActivity: Training = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities([...activities, newActivity]);

    // Auto-add participants from selected departments
    const newParticipants: Participant[] = [];
    employees.forEach(employee => {
      if (activity.departmentIds.includes(employee.departmentId)) {
        newParticipants.push({
          activityId: newActivity.id,
          employeeId: employee.id,
          attended: false,
          acknowledgment: false,
        });
      }
    });
    setParticipants([...participants, ...newParticipants]);
    setIsFormOpen(false);
  };

  const handleUpdate = (activity: Training) => {
    setActivities(activities.map(a => (a.id === activity.id ? activity : a)));
    setEditingActivity(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities(activities.filter(a => a.id !== id));
      setParticipants(participants.filter(p => p.activityId !== id));
    }
  };

  const handleEdit = (activity: Training) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const updateParticipantStatus = (
    activityId: string,
    employeeId: string,
    field: 'attended' | 'acknowledgment'
  ) => {
    setParticipants(
      participants.map(p =>
        p.activityId === activityId && p.employeeId === employeeId
          ? { ...p, [field]: !p[field] }
          : p
      )
    );
  };

  const getActivityStats = (activityId: string) => {
    const activityParticipants = participants.filter(p => p.activityId === activityId);
    const acknowledged = activityParticipants.filter(p => p.acknowledgment).length;
    const attended = activityParticipants.filter(p => p.attended).length;
    return { total: activityParticipants.length, acknowledged, attended };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Activity Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          New Activity
        </button>
      </div>

      {/* Search 
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>
*/}
      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.map(activity => {
          const stats = getActivityStats(activity.id);
          const activityDepartments = departments.filter(d => activity.departmentIds.includes(d.id));
          const activityParticipants = participants.filter(p => p.activityId === activity.id);
          const isExpanded = expandedActivity === activity.id;

          return (
            <div key={activity.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{activity.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>

                  <div className="flex flex-wrap gap-2 mb-2 text-sm">
                    <span className="text-gray-600">
                      📅 {new Date(activity.date).toLocaleDateString()} at {activity.time}
                    </span>
                    <span className="text-gray-600">
                      👥 {stats.total} participants
                    </span>
                  </div>

                  {activityDepartments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {activityDepartments.map(dept => (
                        <span
                          key={dept.id}
                          className="px-2 py-1 rounded-full text-white text-xs"
                          style={{ backgroundColor: dept.color }}
                        >
                          {dept.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>{stats.acknowledged} acknowledged</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Users className="w-3 h-3" />
                      <span>{stats.attended} attended</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs"
                    title="Manage Participants"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(activity)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inline Participant Management */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-700 text-sm">Quick Edit Participants</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilterMode('all')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filterMode === 'all'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterMode('pending')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filterMode === 'pending'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => setFilterMode('notAttended')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          filterMode === 'notAttended'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Not Attended
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {activityParticipants
                      .filter(participant => {
                        if (filterMode === 'pending') return !participant.acknowledgment;
                        if (filterMode === 'notAttended') return !participant.attended;
                        return true;
                      })
                      .map(participant => {
                        const employee = employees.find(e => e.id === participant.employeeId);
                        if (!employee) return null;

                        return (
                          <div
                            key={participant.employeeId}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 text-sm truncate">{employee.name}</p>
                              <p className="text-gray-500 text-xs truncate">{employee.position}</p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateParticipantStatus(
                                    activity.id,
                                    employee.id,
                                    'acknowledgment'
                                  )
                                }
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  participant.acknowledgment
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {participant.acknowledgment ? '✓ Acknowledged' : 'Pending'}
                              </button>

                              <button
                                onClick={() =>
                                  updateParticipantStatus(
                                    activity.id,
                                    employee.id,
                                    'attended'
                                  )
                                }
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  participant.attended
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {participant.attended ? '✓ Attended' : 'Not Attended'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-sm">No activities found</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <ActivityFormModal
          activity={editingActivity}
          departments={departments}
          onSubmit={editingActivity ? handleUpdate : handleCreate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
}