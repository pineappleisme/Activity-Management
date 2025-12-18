import { useState, useMemo } from 'react';
import { Search, LogIn, Calendar, Users, ArrowUpDown } from 'lucide-react';
import { Training, Training_departments, Employee, Department, Participant } from '../App';
import { TrainingCard } from './TrainingCard';
import { EmployeeTrainingView } from './EmployeeTrainingView';
import { EmployeeTraining } from '../types/employeeTraining';

interface PublicViewProps {
  trainings: Training[];
  training_departments: Training_departments[];
  employees: Employee[];
  departments: Department[];
  participants: Participant[];
  onLoginClick: () => void;
}

export function PublicView({
  trainings,
  training_departments,
  employees,
  departments,
  participants,
  onLoginClick,
}: PublicViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  //employee view state
  const [viewMode, setViewMode] = useState<'training' | 'employee'>('training');
  const [employeeQuery, setEmployeeQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const employeeTrainings = useMemo(() => {
    if (!selectedEmployee) return [];

    return trainings
      .map(training => {
        const participant = participants.find(
          p =>
            p.trainingId === training.id &&
            p.employeeId === selectedEmployee.id
        );

        if (!participant) return null;

        return {
          id: training.id,
          name: training.name,
          date: training.date,
          time: training.time,
          description: training.description,
          attended: participant.attended,
          acknowledgment: participant.acknowledgment,
        };
      })
      .filter(Boolean) as EmployeeTraining[];
  }, [selectedEmployee, trainings, participants]);

  const filteredEmployees = useMemo(() => {
    if (!employeeQuery) return employees;
    return employees.filter(e =>
      e.name.toLowerCase().includes(employeeQuery.toLowerCase())
    );
  }, [employeeQuery, employees]);


  const filteredTrainings = useMemo(() => {
    let filtered = trainings.filter(training => {
      // Search by training name or participant name
      const matchesSearch = searchQuery === '' || 
        training.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (() => {
          const depts = departments.filter(d => training_departments.some(td => td.training_id === training.id && td.departments_id === d.id));
          return depts.some(dept => dept.name.toLowerCase().includes(searchQuery.toLowerCase()));
        })() ||
        participants
          .filter(p => p.trainingId === training.id)
          .some(p => {
            const employee = employees.find(e => e.id === p.employeeId);
            return employee?.name.toLowerCase().includes(searchQuery.toLowerCase());
          });

      // Date filter
      const matchesDate = dateFilter === '' || training.date === dateFilter;
      return matchesSearch && matchesDate;
    });

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
      return sortOrder === 'asc' ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
    });

    return filtered;
  }, [trainings, training_departments, searchQuery, dateFilter, sortOrder, departments, employees, participants]);

  const totalTrainings = trainings.length;
  const upcomingTrainings = trainings.filter(t => new Date(t.date) >= new Date()).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Training Center</h1>
              <p className="text-gray-600 text-sm">
                Explore and track all trainings across departments
              </p>
            </div>
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              Admin Login
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Total Trainings</p>
                <p className="text-white">{totalTrainings}</p>
              </div>
              <Calendar className="w-10 h-10 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm mb-1">Upcoming Trainings</p>
                <p className="text-white">{upcomingTrainings}</p>
              </div>
              <Calendar className="w-10 h-10 text-red-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('training')}
                className={`px-3 py-2 rounded-lg text-sm ${
                  viewMode === 'training'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                By training
              </button>
              <button
                onClick={() => setViewMode('employee')}
                className={`px-3 py-2 rounded-lg text-sm ${
                  viewMode === 'employee'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                By employee
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by training name, department, or participant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Date Filter & Sort */}
            <div className="flex gap-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                </span>
              </button>
            </div>
          </div>
        </div>


        {/* Trainings */}
        <div className="space-y-4">
          {viewMode === 'training' && (
            <>
              {filteredTrainings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No trainings found matching your search criteria
                  </p>
                </div>
              ) : (
                filteredTrainings.map(training => (
                  <TrainingCard
                    key={training.id}
                    training={training}
                    employees={employees}
                    departments={departments}
                    participants={participants.filter(p => p.trainingId === training.id)}
                    training_departments={training_departments}
                  />
                ))
              )}
            </>
          )}

          {viewMode === 'employee' && (
            <>
              <div className="bg-white rounded-xl shadow-md p-4">
                <input
                  type="text"
                  placeholder="Search by employee name..."
                  value={employeeQuery}
                  onChange={(e) => setEmployeeQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="mt-2 space-y-1">
                  {filteredEmployees.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEmployee(e)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedEmployee?.id === e.id
                          ? 'bg-orange-100'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedEmployee && (
                <EmployeeTrainingView
                  employee={selectedEmployee}
                  trainings={employeeTrainings}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}