import { useDispatch, useSelector } from "react-redux";
import { addToCar, minusFromCar } from "../../store/slices/carSlice";
import { Button, Image, Typography, Space } from 'antd';
import type { Product } from "../../types/product";
import type { RootState, AppDispatch } from '../../store';
import styles from './ProductPage.module.css';

interface ProductPageProps {
    product: Product;
}

const ProductPage = ({ product }: ProductPageProps) => {
    const dispatch: AppDispatch = useDispatch();

    const quantityInCart = useSelector((state: RootState) =>
        state.car.items.find(item => item.id === product.id)?.quantity ?? 0
    );

    const handleAddToCar = (product: Product) => {
        dispatch(addToCar(product));
    }
    const handleMinusFromCar = (product: Product) => {
        dispatch(minusFromCar(product));
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image
                    width="100%"
                    src={product.imageUrl}
                    alt={product.name}
                />
            </div>
            <div className={styles.infoContainer}>
                <Typography.Title level={2}>{product.name}</Typography.Title>

                <Typography.Paragraph style={{ fontSize: '16px', color: '#666' }}>
                    {product.description}
                </Typography.Paragraph>

                <Typography.Title level={3} style={{ color: 'red' }}>
                    ¥{product.price.toFixed(2)}
                </Typography.Title>

                <Space direction="vertical" size="large">
                    <Typography.Text>数量</Typography.Text>
                    <Space>
                        <Button onClick={() => handleMinusFromCar(product)} disabled={quantityInCart === 0}>-</Button>
                        <span style={{ fontSize: '18px', margin: '0 16px', minWidth: '30px', textAlign: 'center' }}>
                            {quantityInCart}
                        </span>
                        <Button onClick={() => handleAddToCar(product)}>+</Button>
                    </Space>
                    <Button type="primary" size="large" onClick={() => handleAddToCar(product)}>
                        加入购物车
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default ProductPage;