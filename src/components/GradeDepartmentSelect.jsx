import React from 'react';
import { grades, departments } from '../domain/GradeDepartment';
import '../css/GradeDepartmentSelect.css'; 

function GradeDepartmentSelect({ grade, setGrade, department, setDepartment }) {
    return (
        // 全体を囲むコンテナ
        <div className="grade-department-container">
            
            {/* 学年 */}
            <div className="select-group">
                <label>学年:</label>
                <select 
                    value={grade || ""} 
                    onChange={(e) => setGrade(e.target.value)}
                    className="custom-select"
                >
                    {grades.map((g) => (
                        <option key={g.value} value={g.value}>
                            {g.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 学科 */}
            <div className="select-group">
                <label>学科:</label>
                <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)}
                    className="custom-select"
                >
                    {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                            {dept.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default GradeDepartmentSelect;