import { fetchProducts } from '../../store/slices/productSlice';
import { List, Alert, Typography } from 'antd';
import ProductCard from '../../components/ProductCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import Skeletons from '../../components/Skeletons';

const ProductListPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { products, state, error } = useSelector((state: RootState) => state.products);
    useEffect(() => {
        if (state === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, state]);

    let context;

    if (state === 'loading') {
        context = <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={Array.from({ length: 8 }, (_, index) => ({ key: index }))}
            renderItem={(item) => (
                <List.Item key={item.key}>
                    <Skeletons />
                </List.Item>
            )} />;
    }
    else if (state === 'succeeded') {
        context = <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={products}
            renderItem={(product) => (
                <List.Item key={product.id}>
                    <ProductCard product={product} />
                </List.Item>
            )} />;
    }
    else if (state === 'failed') {
        context = <Alert message="错误" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Typography.Title level={2}>产品列表</Typography.Title>
            {context}
        </div>
    )

}

export default ProductListPage;