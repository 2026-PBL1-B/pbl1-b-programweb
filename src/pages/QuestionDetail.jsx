import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';
import "../css/QuestionDetail.css";

function QuestionDetail(){
    return (
        <h1>質問詳細</h1>
    );

}export default QuestionDetail;