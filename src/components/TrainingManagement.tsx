import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Users, CheckCircle } from 'lucide-react';
import { Training, Training_departments, Employee, Department, Participant } from '../App';
import { TrainingFormModal } from './TrainingFormModal';

interface TrainingManagementProps {
  trainings: Training[];
  setTrainings: (trainings: Training[]) => void;
  training_departments: Training_departments[];
  setTraining_departments: (training_departments: Training_departments[]) => void;
  employees: Employee[];
  departments: Department[];
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
}

export function TrainingManagement({
  trainings,
  setTrainings,
  training_departments,
  setTraining_departments,
  employees,
  departments,
  participants,
  setParticipants,
}: TrainingManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [expandedTraining, setExpandedTraining] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'notAttended'>('all');

  const filteredTrainings = useMemo(() => {
    return trainings.filter(training =>
      training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trainings, searchQuery]);

  const handleCreate = (training: Omit<Training, 'id'>, departmentIds: string[]) => {
    const newTraining: Training = {
      ...training,
      id: Date.now().toString(),
    };
    setTrainings([...trainings, newTraining]);

    // Add training_departments
    const newTrainingDepartments = departmentIds.map(did => ({
      training_id: newTraining.id,
      departments_id: did,
    }));
    setTraining_departments([...training_departments, ...newTrainingDepartments]);

    // Auto-add participants from selected departments
    const newParticipants: Participant[] = [];
    employees.forEach(employee => {
      if (departmentIds.includes(employee.departmentId)) {
        newParticipants.push({
          trainingId: newTraining.id,
          employeeId: employee.id,
          attended: false,
          acknowledgment: false,
        });
      }
    });
    setParticipants([...participants, ...newParticipants]);
    setIsFormOpen(false);
  };

  /*
  const handleUpdate = (training: Training, departmentIds: string[]) => {
    setTrainings(trainings.map(t => (t.id === training.id ? training : t)));

    // Update training_departments: remove old, add new
    const filtered = training_departments.filter(td => td.training_id !== training.id);
    const newTrainingDepartments = departmentIds.map(did => ({
      training_id: training.id,
      departments_id: did,
    }));
    setTraining_departments([...filtered, ...newTrainingDepartments]);

    setEditingTraining(null);
    setIsFormOpen(false);
  };
*/

  const handleUpdate = (training: Training, departmentIds: string[]) => {
    // 1️⃣ 更新 training 基本信息
    setTrainings(trainings.map(t => (t.id === training.id ? training : t)));

    // 2️⃣ 原有 departmentIds
    const oldDeptIds = training_departments
      .filter(td => td.training_id === training.id)
      .map(td => td.departments_id);

    // 3️⃣ 新增 / 移除的 department
    const addedDeptIds = departmentIds.filter(id => !oldDeptIds.includes(id));
    const removedDeptIds = oldDeptIds.filter(id => !departmentIds.includes(id));

    // 4️⃣ 判断哪些 department 可以被安全移除
    const removableDeptIds = removedDeptIds.filter(deptId => {
      const deptEmployeeIds = employees
        .filter(e => e.departmentId === deptId)
        .map(e => e.id);

      const deptParticipants = participants.filter(
        p =>
          p.trainingId === training.id &&
          deptEmployeeIds.includes(p.employeeId)
      );

      // 规则：全部 pending & not attended 才能删除
      return deptParticipants.every(
        p => !p.attended && !p.acknowledgment
      );
    });

    // 5️⃣ 更新 training_departments
    const remainingTrainingDepartments = training_departments.filter(td => {
      if (td.training_id !== training.id) return true;
      return !removableDeptIds.includes(td.departments_id);
    });

    const newTrainingDepartments = addedDeptIds.map(deptId => ({
      training_id: training.id,
      departments_id: deptId,
    }));

    setTraining_departments([
      ...remainingTrainingDepartments,
      ...newTrainingDepartments,
    ]);

    // 6️⃣ 新增 department → 自动加 participants
    const addedParticipants: Participant[] = employees
      .filter(e => addedDeptIds.includes(e.departmentId))
      .map(e => ({
        trainingId: training.id,
        employeeId: e.id,
        attended: false,
        acknowledgment: false,
      }));

    // 7️⃣ 移除 department → 删除对应 participants（只限 removable）
    const remainingParticipants = participants.filter(p => {
      if (p.trainingId !== training.id) return true;

      const emp = employees.find(e => e.id === p.employeeId);
      if (!emp) return true;

      return !removableDeptIds.includes(emp.departmentId);
    });

    setParticipants([
      ...remainingParticipants,
      ...addedParticipants,
    ]);

    // 8️⃣ 收尾
    setEditingTraining(null);
    setIsFormOpen(false);
  };


  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this training?')) {
      setTrainings(trainings.filter(t => t.id !== id));
      setParticipants(participants.filter(p => p.trainingId !== id));
    }
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setIsFormOpen(true);
  };

  const updateParticipantStatus = (
    activityId: string,
    employeeId: string,
    field: 'attended' | 'acknowledgment'
  ) => {
    setParticipants(
      participants.map(p =>
        p.trainingId === activityId && p.employeeId === employeeId
          ? { ...p, [field]: !p[field] }
          : p
      )
    );
  };

  const getActivityStats = (activityId: string) => {
    const activityParticipants = participants.filter(p => p.trainingId === activityId);
    const acknowledged = activityParticipants.filter(p => p.acknowledgment).length;
    const attended = activityParticipants.filter(p => p.attended).length;
    return { total: activityParticipants.length, acknowledged, attended };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Training Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          New Training
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search trainings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>

      {/* Trainings List */}
      <div className="space-y-3">
        {filteredTrainings.map(training => {
          const stats = getActivityStats(training.id);
          const trainingDepartments = departments.filter(d => training_departments.some(td => td.training_id === training.id && td.departments_id === d.id));
          const trainingParticipants = participants.filter(p => p.trainingId === training.id);
          const isExpanded = expandedTraining === training.id;

          return (
            <div key={training.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{training.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{training.description}</p>

                  <div className="flex flex-wrap gap-2 mb-2 text-sm">
                    <span className="text-gray-600">
                      📅 {new Date(training.date).toLocaleDateString()} at {training.time}
                    </span>
                    <span className="text-gray-600">
                      👥 {stats.total} participants
                    </span>
                  </div>

                  {trainingDepartments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {trainingDepartments.map(dept => (
                        <span
                          key={dept.id}
                          className="px-2 py-1 rounded-full text-xs
                            border border-gray-400
                            text-gray-700 bg-white"
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
                    onClick={() => setExpandedTraining(isExpanded ? null : training.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs"
                    title="Manage Participants"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(training)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(training.id)}
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
                    {trainingParticipants
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
                              <p className="text-gray-500 text-xs truncate">{employee.email}</p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateParticipantStatus(
                                    training.id,
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
                                    training.id,
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

        {filteredTrainings.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-sm">No trainings found</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TrainingFormModal
          training={editingTraining}
          training_departments={training_departments}
          departments={departments}
          onSubmit={editingTraining ? handleUpdate : handleCreate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTraining(null);
          }}
        />
      )}
    </div>
  );
}