// src/pages/ProductList.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// 1. 仮データ（モックデータ）の準備
// データベースから取得する情報を想定した、学生の制作物リストです。
const dummyArticles = [
    {
        id: 1,
        title: "大学生向け時間割＆課題一括管理アプリ『Campus Task』",
        author: "Yuta_Dev",
        date: "2026-04-15",
        tags: ["React", "Firebase", "Webアプリ"],
        likes: 45,
    },
    {
        id: 2,
        title: "Unityで作った2Dアクションゲーム『ドット勇者の大冒険』",
        author: "Saki_Games",
        date: "2026-04-22",
        tags: ["Unity", "C#", "ゲーム制作"],
        likes: 88,
    },
    {
        id: 3,
        title: "Pythonで実装！英語学習サポートAIチャットボット",
        author: "Daiki_AI",
        date: "2026-04-24",
        tags: ["Python", "AI", "自然言語処理"],
        likes: 120,
    },
    {
        id: 4,
        title: "Three.jsを活用したインタラクティブな3Dポートフォリオ",
        author: "Miku_Design",
        date: "2026-04-18",
        tags: ["Three.js", "WebGL", "ポートフォリオ"],
        likes: 62,
    },
    {
        id: 5,
        title: "学食の混雑状況がリアルタイムで分かるIoTシステム",
        author: "Ken_IoT",
        date: "2026-04-20",
        tags: ["Raspberry Pi", "IoT", "ハッカソン"],
        likes: 156,
    }
];

function ProductList() {
    // 1. 並び順の状態を管理 (desc = 降順 / asc = 昇順)
    const [sortOrder, setSortOrder] = useState('desc');

    // 2. データのコピーを作成して並び替え
    const sortedArticles = [...dummyArticles].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });


    return (
        // align-itemsを flex-start にすることで全体を左寄せにします
        <section style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            
            {/* --- タイトルのエリア --- */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' ,
                paddingBottom: '24px',                  /* 追加：線と文字の間の余白 */
                marginBottom: '24px',                   /* 線と下の記事リストとの余白 */
                borderBottom: '2px solid var(--border)' /* 追加：2pxの実線（色は既存の変数を使用） */}}>
                
                <h1 style={{ margin: 0 }}>制作物投稿一覧ページ</h1>
                
                {/* ソートボタンと同じスタイルの「投稿する」ボタンを追加 */}
                <button 
                    onClick={() => console.log('投稿画面へ遷移')} // ここに遷移処理などを記述
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--code-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        width: '160px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    投稿する
                </button>
            </div>

            {/* --- コンテンツ部分 --- */}
            {/* 修正: flexDirectionを 'row' に、alignItemsを 'flex-start' に直しました */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px' }}>

                {/* 記事リストの表示部分 */}
                {/* 修正: alignItemsを 'flex-start' に直しました */}
                <div style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
                    {/* 並び替え切り替えボタン */}
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--code-bg)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            width: '160px',
                            alignSelf: 'flex-end' /* 追加：このボタンだけを右端（flex-end）に寄せる */
                        }}
                    >
                        {sortOrder === 'desc' ? '新しい順 ↓' : '古い順 ↑'}
                    </button>

                    {/* 並び替え済みのsortedArticlesをmapで回します */}
                    {sortedArticles.map((article) => (
                        <div key={article.id} style={{ 
                            border: '1px solid var(--border)', /* 修正: 下線だけではなく、全体を囲む線に変更 */
                            borderRadius: '12px',              /* 追加: カードの角を少し丸くする */
                            padding: '24px',                   /* 修正: カードの内側（上下左右）に十分な余白を取る */
                            backgroundColor: 'var(--bg)',      /* 追加: カードの背景色を設定（ダークモードにも自動対応） */
                            boxShadow: 'var(--shadow)',        /* 追加: index.cssにある影をつけて少し浮かせる */
                            textAlign: 'left',
                            width: '100%',
                            boxSizing: 'border-box',           /* 追加: 余白を追加しても横幅がはみ出さないようにする安全策 */
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'                        /* 追加: カードの中の「名前」「タイトル」「タグ」の間の隙間を均等にする */
                        }}>
                            {/* 投稿者と日付 */}
                            <div style={{ fontSize: '14px', color: 'var(--text)' }}>
                                <span style={{ fontWeight: 'bold', marginRight: '8px' }}>@{article.author}</span>
                                <span>{article.date}</span>
                            </div>
                            
                            {/* タイトル */}
                            {/* タイトル周りの余白（margin）は親要素のgapで管理するので '0' にします */}
                            <h2 style={{ fontSize: '22px', margin: '0', color: 'var(--text-h)', cursor: 'pointer' }}>
                                {article.title}
                            </h2>
                            
                            {/* タグといいね */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {article.tags.map((tag, index) => (
                                        <span key={index} style={{ 
                                            fontSize: '12px', 
                                            backgroundColor: 'var(--code-bg)', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px',
                                            color: 'var(--text)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text)' }}>
                                    ❤️ {article.likes}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>

            {/* テスト用（後で消す） */}
            <div style={{ marginTop: '40px' }}>
                <Link to="/" style={{ color: 'var(--accent)', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none' }}>
                    ← ログイン画面へ戻る
                </Link>
            </div>

        </section>
    );
}

export default ProductList;