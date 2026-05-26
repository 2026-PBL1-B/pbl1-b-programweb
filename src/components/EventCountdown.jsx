// src/components/EventCountdown.jsx
import { useState, useEffect } from 'react';
import { EVENT_INFO } from '../domain/HomeInfo';

function EventCountdown() {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    // 💡 日数を計算する「ロジック」はコンポーネント側に持たせる
    const calculateDays = () => {
      const today = new Date();
      let targetYear = today.getFullYear();
      
      // domainから取得した「情報」を使ってターゲットの日付を作成
      let targetDate = new Date(targetYear, EVENT_INFO.month - 1, EVENT_INFO.day);
      
      // すでに過ぎている場合は来年に設定（年またぎロジック）
      if (today.getTime() > targetDate.getTime()) {
        targetDate.setFullYear(targetYear + 1);
      }

      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    };

    calculateDays();
  }, []);

  return (
    <div className="event-card">
      <h2 className="event-title">
        {EVENT_INFO.name}まで
      </h2>
      <div className="countdown-text">
        {daysRemaining > 0 ? (
          <>あと <span className="countdown-number">{daysRemaining}</span> 日</>
        ) : (
          <span>イベント当日です！🎉</span>
        )}
      </div>
    </div>
  );
}

export default EventCountdown;