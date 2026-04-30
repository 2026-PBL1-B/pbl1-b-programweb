import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../spabase';

function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(error);
            } else {
                setProduct(data);
            }
        };

        fetchData();
    }, [id]);

    if (!product) return <p>読み込み中...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{product.title}</h1>
            <p>{product.content}</p>
        </div>
    );
}

export default ProductDetail;