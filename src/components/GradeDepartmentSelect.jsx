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
                    {/* 先頭に「選択しない（値は空文字）」を固定で用意する */}
                    <option value="">選択しない</option>

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
                    {/* 先頭に「選択しない（値は空文字）」を固定で用意する */}
                    <option value="">選択しない</option>
                    
                    {/* 文字列のリストを、表示名（label）と裏側の値（value）の両方に使う */}
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default GradeDepartmentSelect;