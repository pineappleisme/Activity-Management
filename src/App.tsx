import { useState } from 'react';
import { PublicView } from './components/PublicView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export interface Department {
  id: string;
  name: string;
  color: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  position: string;
  isAdmin: boolean;
  password: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  time: string;
  departmentIds: string[];  // Changed from departmentId to departmentIds (multiple departments)
  description: string;
}

export interface Participant {
  activityId: string;
  employeeId: string;
  attended: boolean;
  acknowledgment: boolean;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sample data
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Engineering', color: '#F59A6A' },
    { id: '2', name: 'Marketing', color: '#F28B82' },
    { id: '3', name: 'Sales', color: '#F4B183' },
    { id: '4', name: 'HR', color: '#F5C09A' },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'admin', email: 'john@example.com', departmentId: '1', position: 'Senior Developer' , isAdmin: true, password: '123' },
    { id: '2', name: 'Jannessa', email: 'sarah@example.com', departmentId: '1', position: 'Product Manager' , isAdmin: false, password: '' },
    { id: '3', name: 'Chen', email: 'mike@example.com', departmentId: '2', position: 'Marketing Lead' , isAdmin: false, password: '' },
    { id: '4', name: 'Emily Davis', email: 'emily@example.com', departmentId: '3', position: 'Sales Representative' , isAdmin: false, password: '' },
    { id: '5', name: 'Alex Kumar', email: 'alex@example.com', departmentId: '4', position: 'HR Manager' , isAdmin: false, password: '' },
    { id: '6', name: 'Lisa', email: 'lisa@example.com', departmentId: '1', position: 'Frontend Developer' , isAdmin: false, password: '345' },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      name: 'React Best Practices Workshop',
      date: '2025-12-10',
      time: '14:00',
      departmentIds: ['1'],  // Changed from departmentId to departmentIds
      description: 'Learn modern React patterns and best practices',
    },
    {
      id: '2',
      name: 'Leadership Training',
      date: '2025-12-08',
      time: '10:00',
      departmentIds: ['2'],  // Changed from departmentId to departmentIds
      description: 'Develop your leadership skills',
    },
    {
      id: '3',
      name: 'Sales Strategy Meeting',
      date: '2025-12-15',
      time: '09:00',
      departmentIds: ['3'],  // Changed from departmentId to departmentIds
      description: 'Q4 sales strategy and planning',
    },
  ]);

  const [participants, setParticipants] = useState<Participant[]>([
    { activityId: '1', employeeId: '1', attended: true, acknowledgment: true },
    { activityId: '1', employeeId: '2', attended: false, acknowledgment: true },
    { activityId: '1', employeeId: '6', attended: true, acknowledgment: true },
    { activityId: '2', employeeId: '1', attended: false, acknowledgment: false },
    { activityId: '2', employeeId: '2', attended: false, acknowledgment: true },
    { activityId: '2', employeeId: '3', attended: false, acknowledgment: true },
    { activityId: '2', employeeId: '4', attended: false, acknowledgment: false },
    { activityId: '3', employeeId: '4', attended: false, acknowledgment: false },
  ]);

  const handleLogin = (username: string, password: string) => {
    const user = employees.find(e => e.name === username);

    if (!user) return false;
    if (!user.isAdmin) return false;
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
            activities={activities}
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
          activities={activities}
          setActivities={setActivities}
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