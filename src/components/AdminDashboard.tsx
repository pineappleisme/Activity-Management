import { useState } from 'react';
import { LogOut, Calendar, Users, Building2 } from 'lucide-react';
import { Training, Training_departments, Employee, Department, Participant } from '../App';
import { TrainingManagement } from './TrainingManagement';
import { EmployeeManagement } from './EmployeeManagement';
import { DepartmentManagement } from './DepartmentManagement';

interface AdminDashboardProps {
  trainings: Training[];
  setTrainings: (trainings: Training[]) => void;
  training_departments: Training_departments[];
  setTraining_departments: (training_departments: Training_departments[]) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
  onLogout: () => void;
}

type Tab = 'trainings' | 'employees' | 'departments';

export function AdminDashboard({
  trainings,
  setTrainings,
  training_departments,
  setTraining_departments,
  employees,
  setEmployees,
  departments,
  setDepartments,
  participants,
  setParticipants,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('trainings');

  const tabs = [
    { id: 'trainings' as Tab, label: 'Trainings', icon: Calendar, color: 'from-orange-500 to-orange-600' },
    { id: 'employees' as Tab, label: 'Employees', icon: Users, color: 'from-amber-500 to-amber-600' },
    { id: 'departments' as Tab, label: 'Departments', icon: Building2, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">Manage trainings, employees, and departments</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'trainings' && (
          <TrainingManagement
            trainings={trainings}
            setTrainings={setTrainings}
            training_departments={training_departments}
            setTraining_departments={setTraining_departments}
            employees={employees}
            departments={departments}
            participants={participants}
            setParticipants={setParticipants}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeManagement
            employees={employees}
            setEmployees={setEmployees}
            departments={departments}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentManagement
            departments={departments}
            setDepartments={setDepartments}
            employees={employees}
            setEmployees={setEmployees}
          />
        )}
      </div>
    </div>
  );
}