// src/Home.jsx
// 仮ページ
import { Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/hero.png';

function Home({ count, setCount }) {
    return (
        <section id="center">
        <div className="hero">
            <img src={heroImg} className="base" width="170" height="179" alt="" />
            <img src={reactLogo} className="framework" alt="React logo" />
            <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <h1>Home Page</h1>
        <button className="counter" onClick={() => setCount((c) => c + 1)}>
            Count is {count}
        </button>
        <br />
        <Link to="/" style={{ color: 'var(--accent)', fontSize: '20px', fontWeight: 'bold' }}>
            ログイン画面へ戻る
        </Link>
        </section>
    );
}

export default Home; // 他のファイルから読み込めるようにします