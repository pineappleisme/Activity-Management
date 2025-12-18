import { useState } from 'react';
import { PublicView } from './components/PublicView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export interface Department {
  id: string;
  name: string;
  //color: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  position: string;
  is_admin: boolean;
  password: string;
}

export interface Training {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

export interface Training_departments {
  training_id: string;
  departments_id: string;
}

export interface Participant {
  trainingId: string;
  employeeId: string;
  attended: boolean;
  acknowledgment: boolean;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sample data
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Engineering' },
    { id: '2', name: 'Marketing' },
    { id: '3', name: 'Sales' },
    { id: '4', name: 'HR' },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: '1', email: 'john@example.com', departmentId: '1', position: 'Senior Developer' , is_admin: true, password: '1' },
    { id: '2', name: 'Jannessa', email: 'sarah@example.com', departmentId: '1', position: 'Product Manager' , is_admin: false, password: '' },
    { id: '3', name: 'Chen', email: 'mike@example.com', departmentId: '2', position: 'Marketing Lead' , is_admin: false, password: '' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', departmentId: '3', position: 'Sales Representative' , is_admin: false, password: '' },
    { id: '5', name: 'Alex Kumar', email: 'alex@example.com', departmentId: '4', position: 'HR Manager' , is_admin: false, password: '' },
    { id: '6', name: 'Lisa', email: 'lisa@example.com', departmentId: '1', position: 'SW Developer' , is_admin: false, password: '345' },
  ]);

  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: '1',
      name: 'React Best Practices Workshop',
      date: '2025-12-10',
      time: '14:00',
      description: 'Learn modern React patterns and best practices',
    },
    {
      id: '2',
      name: 'Leadership Training',
      date: '2025-12-08',
      time: '10:00',
      description: 'Develop your leadership skills',
    },
    {
      id: '3',
      name: 'Sales Strategy Meeting',
      date: '2025-12-15',
      time: '09:00',
      description: 'Q4 sales strategy and planning',
    },
  ]);

  const [training_departments, setTraining_departments] = useState<Training_departments[]>([
    { training_id: '1', departments_id: '1' },
    { training_id: '2', departments_id: '2' },
    { training_id: '3', departments_id: '3' },
  ]);

  const [participants, setParticipants] = useState<Participant[]>([
    { trainingId: '1', employeeId: '1', attended: true, acknowledgment: true },
    { trainingId: '1', employeeId: '2', attended: false, acknowledgment: true },
    { trainingId: '1', employeeId: '6', attended: true, acknowledgment: true },
    { trainingId: '2', employeeId: '1', attended: false, acknowledgment: false },
    { trainingId: '2', employeeId: '2', attended: false, acknowledgment: true },
    { trainingId: '2', employeeId: '3', attended: false, acknowledgment: true },
    { trainingId: '2', employeeId: '4', attended: false, acknowledgment: false },
    { trainingId: '3', employeeId: '4', attended: false, acknowledgment: false },
  ]);

  const handleLogin = (username: string, password: string) => {
    const user = employees.find(e => e.name === username);

    if (!user) return false;
    if (!user.is_admin) return false;
    if (user.password !== password) return false;

    setIsAdmin(true);
    setShowLoginModal(false);
    return true;
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {!isAdmin ? (
        <>
          <PublicView
            trainings={trainings}
            training_departments={training_departments}
            employees={employees}
            departments={departments}
            participants={participants}
            onLoginClick={() => setShowLoginModal(true)}
          />
          {showLoginModal && (
            <AdminLogin
              onLogin={handleLogin}
              onClose={() => setShowLoginModal(false)}
            />
          )}
        </>
      ) : (
        <AdminDashboard
          trainings={trainings}
          setTrainings={setTrainings}
          training_departments={training_departments}
          setTraining_departments={setTraining_departments}
          employees={employees}
          setEmployees={setEmployees}
          departments={departments}
          setDepartments={setDepartments}
          participants={participants}
          setParticipants={setParticipants}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}