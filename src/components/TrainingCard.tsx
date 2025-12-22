import { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { Training, Training_departments, Employee, Department, Participant } from '../App';

interface TrainingCardProps {
  training: Training;
  employees: Employee[];
  departments: Department[];
  participants: Participant[];
  training_departments: Training_departments[];
}

export function TrainingCard({ training, employees, departments, participants, training_departments }: TrainingCardProps) {
  const [showParticipants, setShowParticipants] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'notAttended'>('all');

  const trainingDepartments = departments.filter(d => training_departments.some(td => td.training_id === training.id && td.departments_id === d.id));

  const getStatusIcon = (participant: Participant) => {
    if (participant.attended) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAcknowledgmentBadge = (acknowledged: boolean) => {
    return acknowledged
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 p-4">
        <h2 className="text-white mb-2">{training.name}</h2>
        <div className="flex flex-wrap gap-3 text-white text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(training.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{training.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{participants.length} Participants</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Department */}
        <div className="mb-3">
          <h3 className="text-gray-700 text-sm mb-2">Department{trainingDepartments.length > 1 ? 's' : ''}</h3>
          <div className="flex flex-wrap gap-1">
            {trainingDepartments.map(department => (
              <span
                key={department.id}
                className="px-2 py-1 rounded-full text-xs
             border border-gray-400
             text-gray-700 bg-white"
              >
                {department.name}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        {training.description && (
          <div className="mb-4">
            <h3 className="text-gray-700 text-sm mb-2">Description</h3>
            <p className="text-gray-600 text-sm">{training.description}</p>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="mb-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          {showParticipants ? 'Hide Participants' : 'View Participants'}
        </button>

        {/* Participants list (conditional) */}
        {showParticipants && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-700 text-sm">Participants</h3>
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
            <div className="space-y-2">
              {participants
                .filter(participant => {
                  if (filterMode === 'pending') return !participant.acknowledgment;
                  if (filterMode === 'notAttended') return !participant.attended;
                  return true;
                })
                .map(participant => {
                  const employee = employees.find(e => e.id === participant.employee_id);
                  if (!employee) return null;

                  return (
                    <div
                      key={participant.employee_id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(participant)}
                        <div>
                          <p className="text-gray-900 text-sm">{employee.name}</p>
                          <p className="text-gray-500 text-xs">{employee.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getAcknowledgmentBadge(
                            participant.acknowledgment
                          )}`}
                        >
                          {participant.acknowledgment ? 'Acknowledged' : 'Pending'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            participant.attended
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {participant.attended ? 'Attended' : 'Not Attended'}
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}