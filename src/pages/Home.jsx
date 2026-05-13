// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import Header from '../components/Header.jsx';  // ✅ {}を削除

function Home() {  // ✅ Header→Homeに名前変更
  return (
    <div>
      <Header />  {/* ✅ importしたHeaderを使う */}
      
    </div>
  );
}

export default Home;