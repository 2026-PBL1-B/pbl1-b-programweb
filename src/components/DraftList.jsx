// src/components/DraftList.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyDraftQuestions } from '../api/Question';

function DraftList({ userId }) {
    const [drafts, setDrafts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDrafts = async () => {
            setIsLoading(true);

            try {
                // userIdを渡せるAPIにするのが理想
                const data = await getMyDraftQuestions(userId);
                setDrafts(data || []);
            } catch (error) {
                console.error('下書き取得エラー:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) loadDrafts();
    }, [userId]);

    if (isLoading) return <p>読み込み中...</p>;

    if (drafts.length === 0) return <p>下書きはありません</p>;

    return (
        <div>
            {drafts.map((draft) => (
                <div key={draft.id}>
                    <Link to={`/questionpost/${draft.id}`}>
                        <h2>{draft.title}</h2>
                    </Link>

                    <p>
                        {new Date(draft.created_at).toLocaleDateString('ja-JP')}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default DraftList;