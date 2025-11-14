import { firstPageProducts,lastPageProducts,nextPageProducts,prevPageProducts } from '../../store/slices/productSlice';
import { List, Alert, Typography, Button, } from 'antd';
import ProductCard from '../../components/ProductCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import Skeletons from '../../components/Skeletons';

const ProductListPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { currentPage, totalPages } = useSelector((state: RootState) => state.products);
    const { products, status, error } = useSelector((state: RootState) => state.products);
    useEffect(() => {
        if (status === 'idle'&&products.length===0) {
            dispatch(firstPageProducts());
        }
    }, [dispatch, status, products.length]);

    let context;

    if (status === 'loading') {
        context = <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={Array.from({ length: 8 }, (_, index) => ({ key: index }))}
            renderItem={(item) => (
                <List.Item key={item.key}>
                    <Skeletons />
                </List.Item>
            )} />;
    }
    else if (status === 'succeeded') {
        context = <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={products}
            renderItem={(product) => (
                <List.Item key={product.id}>
                    <ProductCard product={product} />
                </List.Item>
            )} />;
    }
    else if (status === 'failed') {
        context = <Alert message="错误" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Typography.Title level={2}>产品列表</Typography.Title>
            {context}
            <div style={{ marginBottom: '16px' }}>
                <Button onClick={()=>dispatch(firstPageProducts())}>首页</Button>
                <Button onClick={() => dispatch(prevPageProducts())} disabled={products.length===0||status==='loading'||currentPage===1}>上一页</Button>
                <span style={{ margin: '0 8px' }}>第 {currentPage} 页 / 共 {totalPages} 页</span>
                <Button onClick={() => dispatch(nextPageProducts())} disabled={products.length===0||status==='loading'||currentPage===totalPages}>下一页</Button>
                <Button onClick={() => dispatch(lastPageProducts())}>末页</Button>

            </div>
        </div>
    )

}

export default ProductListPage;