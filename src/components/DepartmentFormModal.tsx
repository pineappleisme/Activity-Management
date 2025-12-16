import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Department, Employee } from '../App';

interface DepartmentFormModalProps {
  department: Department | null;
  employees: Employee[];
  onSubmit: (department: any, selectedEmployeeIds: string[]) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#F59A6A', '#F7A97C', '#F6C177', '#F28B82',
  '#F4B183', '#F8D49A', '#F3B0A2', '#F5C09A',
  '#F6DE8D', '#E57373', '#F29C6B', '#E0A458',
];

export function DepartmentFormModal({ department, employees, onSubmit, onClose }: DepartmentFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
  });
  
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
      });
      // Set employees that belong to this department
      const deptEmployees = employees
        .filter(emp => emp.departmentId === department.id)
        .map(emp => emp.id);
      setSelectedEmployeeIds(deptEmployees);
    }
  }, [department, employees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-assign color from preset colors (rotate through them)
    const colorIndex = Math.floor(Math.random() * PRESET_COLORS.length);
    const autoColor = PRESET_COLORS[colorIndex];
    
    if (department) {
      onSubmit({ ...department, ...formData }, selectedEmployeeIds);
    } else {
      onSubmit({ ...formData, color: autoColor }, selectedEmployeeIds);
    }
  };
  
  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-white">{department ? 'Edit Department' : 'New Department'}</h2>
            <button
              onClick={onClose}
              className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Department Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="e.g., Engineering"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">Select Employees</label>
            <div className="border border-gray-300 rounded-lg p-2 max-h-64 overflow-y-auto space-y-1">
              {employees.map(employee => {
                const isSelected = selectedEmployeeIds.includes(employee.id);
                const currentDept = employees.find(e => e.id === employee.id)?.departmentId;
                const isDifferentDept = department && currentDept !== department.id;
                
                return (
                  <label
                    key={employee.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-100 hover:bg-orange-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleEmployee(employee.id)}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{employee.name}</p>
                      <p className="text-gray-500 text-xs">{employee.position}</p>
                    </div>
                    {isDifferentDept && (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        Will move
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Selected: {selectedEmployeeIds.length} employee{selectedEmployeeIds.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-md text-sm"
            >
              {department ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}