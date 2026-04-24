// src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // 画面遷移のための追加ライブラリ
import './App.css'
import Login from './pages/Login' // Login をインポート
import Home from './pages/Home'   // Home をインポート
import ProductList from './pages/ProductList'   // Home をインポート

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* URL管理だけに記述 */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home count={count} setCount={setCount} />} />

        <Route path="/productList" element={<ProductList />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App