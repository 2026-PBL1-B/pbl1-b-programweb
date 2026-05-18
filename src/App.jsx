// src/App.jsx
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // 画面遷移のための追加ライブラリ
import './App.css'

import Login from './pages/Login' // Login をインポート
import Home from './pages/Home'   // Home をインポート
import ProductPost from './pages/ProductPost'   // ProductPost をインポート
import ProductList from './pages/ProductList'   // ProductList をインポート
import ProductDetail from './pages/ProductDetail' // ProductDetail をインポート
import QuestionList from './pages/QuestionList' // QuestionList をインポート
import QuestionPost from './pages/QuestionPost' // QuestionPost をインポート
import QuestionDetail from './pages/QuestionDetail' // QuestionDetail をインポート
// import MyPage from './pages/MyPage';            // MyPageをインポート
import UserPage from './pages/UserPage';   // UserPageをインポート

import MyProfileEdit from './pages/MyProfileEdit'; // MyProfileEditをインポート


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* URL管理だけに記述 */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home count={count} setCount={setCount} />} />
        <Route path="/productpost" element={<ProductPost count={count} setCount={setCount} />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/questionList" element={<QuestionList />} />
        <Route path="/questionPost" element={<QuestionPost />} />
        <Route path="/question/:id" element={<QuestionDetail />} />


        <Route path="/myprofileedit" element={<MyProfileEdit />} />
        {/* <Route path="/mypage" element={<MyPage />} /> */}
        <Route path="/userpage/:user_id" element={<UserPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App