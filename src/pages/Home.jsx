// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../spabase';
import Header from '../components/Header.jsx';
import EventCountdown from '../components/EventCountdown.jsx'; //
import { SITE_PHILOSOPHY } from '../domain/HomeInfo'; //
import '../css/Home.css'; //

function Home() { 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const errorMsg = params.get('error_description');

      if (errorMsg) {
        const decodedMsg = decodeURIComponent(errorMsg).replace(/\+/g, ' ');
        if (decodedMsg.includes('Database error saving new user') || decodedMsg.includes('学校指定のメールアドレス')) {
          alert('stメールでサインインしてください');
        } else {
          alert(decodedMsg);
        }
        navigate('/'); 
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return null;
  }

  return (
    <section className="home-container">
      <Header />
      
      <div className="home-content">
        {/* 1. イベントカードを上に表示 */}
        <EventCountdown />
        
        {/* 2. その下に理念を表示 */}
        <div className="philosophy-card">
          <h2 className="philosophy-title">{SITE_PHILOSOPHY.title}</h2>
          <div className="philosophy-content">
            {SITE_PHILOSOPHY.messages.map((text, index) => (
              <p key={index} className="philosophy-text">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;