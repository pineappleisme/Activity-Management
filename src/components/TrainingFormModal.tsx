import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Training, Training_departments, Department } from '../App';

interface TrainingFormModalProps {
  training: Training | null;
  training_departments: Training_departments[];
  departments: Department[];
  nonRemovableDepartmentIds: string[];
  onSubmit: (training: any, departmentIds: string[]) => void;
  onClose: () => void;
}

export function TrainingFormModal({ training, training_departments, departments,nonRemovableDepartmentIds, onSubmit, onClose }: TrainingFormModalProps) {
  //console.log('START', { training, training_departments, departments, nonRemovableDepartmentIds });
  //数据初始化
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    time: '00:00',
    departmentIds: [] as string[],
    description: '',
  });

  useEffect(() => {
    if (training) {
      const deptIds = training_departments
      .filter(td => td.training_id === training.id)
      .map(td => td.departments_id);

      setFormData({
        name: training.name,
        date: training.date,
        time: training.time,
        departmentIds: deptIds,
        description: training.description,
      });
    }else{
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        time: '00:00',
        departmentIds: [],
        description: '',
      });
    }
  }, [training, training_departments]);

  //for safe
  const safeNonRemovableDepartmentIds = Array.isArray(nonRemovableDepartmentIds)
    ? nonRemovableDepartmentIds
    : [];


  //表单提交
  const handleSubmit = (e: React.FormEvent) => {
    //console.log('submit');
    e.preventDefault();

    if (formData.departmentIds.length === 0) {
      alert('Please select at least one department');
      return;
    }

    if (training) {
      onSubmit(
        {
          ...training,
          name: formData.name,
          date: formData.date,
          time: formData.time,
          description: formData.description,
        },
        formData.departmentIds
      );
    } else {
      onSubmit(
        {
          name: formData.name,
          date: formData.date,
          time: formData.time,
          description: formData.description,
        },
        formData.departmentIds
      );
    }
  };

  //
  const toggleDepartment = (deptId: string) => {
    //console.log('toggle', deptId);
    setFormData(prev => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter(id => id !== deptId)
        : [...prev.departmentIds, deptId]
    }));
    console.log('formData.departmentIds', formData.departmentIds);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-white">{training ? 'Edit Training' : 'New Training'}</h2>
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
            <label className="block text-gray-700 mb-1 text-sm">Training Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">Departments (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  type="button"
                  /**/
                    disabled={
                      !!training &&
                      formData.departmentIds.includes(dept.id) &&
                      safeNonRemovableDepartmentIds.includes(dept.id)
                    }
                    title={
                      training && safeNonRemovableDepartmentIds.includes(dept.id)
                        ? 'This department has participants who already attended or acknowledged'
                        : ''
                    }
                        
                  onClick={() => toggleDepartment(dept.id)}
                  className={`
                    px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      formData.departmentIds.includes(dept.id)
                        ? safeNonRemovableDepartmentIds.includes(dept.id)
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {dept.name}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Selected: {formData.departmentIds.length} department{formData.departmentIds.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
              rows={3}
            />
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-md text-sm"
            >
              {training ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}