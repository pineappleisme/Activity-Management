import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { Employee, Department } from '../App';
import { EmployeeFormModal } from './EmployeeFormModal';

interface EmployeeManagementProps {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  departments: Department[];
}

export function EmployeeManagement({ employees, setEmployees, departments }: EmployeeManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const filteredEmployees = useMemo(() => {
    if (filterDepartment === 'all') return employees;
    return employees.filter(emp => emp.department_id === filterDepartment);
  }, [employees, filterDepartment]);

  const handleCreate = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees([...employees, newEmployee]);
    setIsFormOpen(false);
  };

  const handleUpdate = (employee: Employee) => {
    setEmployees(employees.map(e => (e.id === employee.id ? employee : e)));
    setEditingEmployee(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Employee Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          New Employee
        </button>
      </div>

      {/* Filter 
      <div className="mb-4 flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <span className="text-gray-600 text-sm">{filteredEmployees.length} employees</span>
      </div>
*/}
      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredEmployees.map(employee => {
          const employeeDepartment = departments.find(d => d.id === employee.department_id);

          return (
            <div
              key={employee.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{employee.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">{employee.position}</p>
                  <p className="text-gray-500 text-xs mb-2">📧 {employee.email}</p>

                  {employeeDepartment && (
                    <span
                      className="px-2 py-1 rounded-full text-xs
                        border border-gray-400
                        text-gray-700 bg-white"
                      >
                      {employeeDepartment.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEmployees.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-sm">No employees found</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <EmployeeFormModal
          employee={editingEmployee}
          departments={departments}
          onSubmit={editingEmployee ? handleUpdate : handleCreate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
}