import { useState } from 'react';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { Department, Employee } from '../App';
import { DepartmentFormModal } from './DepartmentFormModal';

interface DepartmentManagementProps {
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}

export function DepartmentManagement({ departments, setDepartments, employees, setEmployees }: DepartmentManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleCreate = (department: Omit<Department, 'id'>, selectedEmployeeIds: string[]) => {
    const newDepartment: Department = {
      ...department,
      id: Date.now().toString(),
    };
    setDepartments([...departments, newDepartment]);
    
    // Update employees to belong to this department
    setEmployees(
      employees.map(emp =>
        selectedEmployeeIds.includes(emp.id)
          ? { ...emp, departmentId: newDepartment.id }
          : emp
      )
    );
    
    setIsFormOpen(false);
  };

  const handleUpdate = (department: Department, selectedEmployeeIds: string[]) => {
    setDepartments(departments.map(d => (d.id === department.id ? department : d)));
    
    // Update employees: 
    // - Set selected employees to this department
    // - Remove unselected employees from this department (they become unassigned or stay in their current dept)
    setEmployees(
      employees.map(emp => {
        if (selectedEmployeeIds.includes(emp.id)) {
          // Employee is selected, should belong to this department
          return { ...emp, departmentId: department.id };
        } else if (emp.departmentId === department.id) {
          // Employee was in this department but is no longer selected
          // Keep them in the department (don't remove unless explicitly reassigned)
          return emp;
        }
        return emp;
      })
    );
    
    setEditingDepartment(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    const employeeCount = employees.filter(e => e.departmentId === id).length;
    if (employeeCount > 0) {
      alert(`Cannot delete department. ${employeeCount} employee(s) are still assigned to it.`);
      return;
    }
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const getEmployeeCount = (deptId: string) => {
    return employees.filter(e => e.departmentId === deptId).length;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900">Department Management</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          New Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map(department => {
          const employeeCount = getEmployeeCount(department.id);

          return (
            <div
              key={department.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4 bg-gradient-to-r from-orange-100 to-red-100 text-gray-900">
                <h3 className="mb-2">{department.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(department)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(department.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {departments.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-sm">No departments found</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <DepartmentFormModal
          department={editingDepartment}
          employees={employees}
          onSubmit={editingDepartment ? handleUpdate : handleCreate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDepartment(null);
          }}
        />
      )}
    </div>
  );
}