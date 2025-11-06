import { Card } from 'antd';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
    product: Product;
}

const ProductCard = (props: ProductCardProps) => {
    const { product } = props;
    return (
        <Link to={`product/${product.id}`}>
            <Card
                hoverable
                cover={<img alt={product.name} src={product.imageUrl} style={{ height: 300, objectFit: 'cover' }} />}
            >
                <Card.Meta title={product.name} description={`¥${product.price}`} />
            </Card>
        </Link>
    )
}

export default ProductCard;