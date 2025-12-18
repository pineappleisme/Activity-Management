import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { Training, Training_departments, Employee, Department, Participant } from '../App';
import { EmployeeTraining } from '../types/employeeTraining';

interface EmployeeTrainingProps {
    employee: Employee;
    trainings: EmployeeTraining[];
}

export function EmployeeTrainingView({ employee, trainings }: EmployeeTrainingProps ){
    return(
        <div className="space-y-6">
            <div className="space-y-4">
                {/* Trainings */}
                {trainings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <p className="text-gray-500 text-sm">
                        This employee has not participated in any trainings yet.
                    </p>
                    </div>
                ) : (
                    trainings.map(training => (
                    <div
                        key={training.id}
                        className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <h3 className="text-gray-900 mb-1">{training.name}</h3>

                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(training.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {training.time}
                            </div>
                            </div>

                            {training.description && (
                            <p className="text-gray-600 text-sm mb-3">
                                {training.description}
                            </p>
                            )}

                            {/* Status */}
                            <div className="flex gap-3 text-sm">
                            <span
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                training.attended
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {training.attended ? (
                                <CheckCircle className="w-3 h-3" />
                                ) : (
                                <XCircle className="w-3 h-3" />
                                )}
                                {training.attended ? 'Attended' : 'Not Attended'}
                            </span>

                            <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                training.acknowledgment
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {training.acknowledgment ? 'Acknowledged' : 'Pending'}
                            </span>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                    ))
                    
                )}
            </div>
        </div>

        

    );
}
