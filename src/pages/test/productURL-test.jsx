import React, { useState } from 'react';
import { postProductLinks, getProductLinks } from '../../api/productLink';

const ProductURLTest = () => {
  const [productId, setProductId] = useState('');
  const [linksInput, setLinksInput] = useState('');
  const [postResult, setPostResult] = useState(null);
  const [getResult, setGetResult] = useState(null);

  const handlePostLinks = async () => {
    // カンマまたは改行で分割して配列にする
    const links = linksInput.split(/[\n,]/).map(l => l.trim()).filter(l => l !== '');
    const result = await postProductLinks(productId, links);
    setPostResult(result);
  };

  const handleGetLinks = async () => {
    const result = await getProductLinks(productId);
    setGetResult(result);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Link API Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Product ID:
          <input 
            type="text" 
            value={productId} 
            onChange={(e) => setProductId(e.target.value)} 
            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
            placeholder="product_idを入力"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Links (カンマまたは改行区切り):<br />
          <textarea 
            value={linksInput} 
            onChange={(e) => setLinksInput(e.target.value)} 
            rows={5}
            cols={50}
            style={{ marginTop: '5px', padding: '5px' }}
            placeholder="https://example.com&#10;https://example.org"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handlePostLinks} style={{ marginRight: '10px', padding: '5px 15px' }}>
          Post Links
        </button>
        <button onClick={handleGetLinks} style={{ padding: '5px 15px' }}>
          Get Links
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Post Result:</h3>
        <pre>{JSON.stringify(postResult, null, 2)}</pre>
      </div>

      <div style={{ padding: '10px', border: '1px solid #ccc' }}>
        <h3>Get Result:</h3>
        <pre>{JSON.stringify(getResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ProductURLTest;