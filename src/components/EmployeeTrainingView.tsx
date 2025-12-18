import React, { useEffect, useMemo, useState } from "react";
import { Training, Training_departments, Employee, Department, Participant } from '../App';
import { EmployeeTraining } from '../types/employeeTraining';


interface EmployeeTrainingProps {
    employee: Employee;
    trainings: EmployeeTraining[];
}

export function EmployeeTrainingView({ employee, trainings }: EmployeeTrainingProps ){
    return(
        <div className="space-y-6">
            {/* Employee Header */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="text-gray-900 mb-1">{employee.name}</h2>
            </div>

            {/* Trainings */}

        </div>

        

    );
}
