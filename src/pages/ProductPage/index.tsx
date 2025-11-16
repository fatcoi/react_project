import { useDispatch} from "react-redux";
import { addQuantity } from "../../store/slices/cartSlice";
import { Button, Carousel, Typography, Space, Image,Modal,message } from 'antd';
import { useEffect, useState } from "react";
import request from "../../utils/request";
import type { ProductInfo } from "../../types/productinfo";
import type {AppDispatch } from '../../store';
import styles from './ProductPage.module.css';
import { useParams } from "react-router-dom";


const ProductPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    const [status, setStatus] = useState<'idle' | 'succeeded' | 'failed'>('idle');
    const [modalOpen, setModalOpen] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(1);

    const handleIncrease = ()=>{
        setCartQuantity(q=>q+1);
    }

    const handleDecrease = ()=>{
        setCartQuantity(q=>q-1);
    }

    const [productIfo, setProductIfo] = useState<ProductInfo>({
        id: '',
        name: '',
        price: 0,
        category: '',
        description: '',
        stock: 0,
        images: [],
    });

    useEffect(() => {
        if (!id) {
            setStatus('failed');
            return;
        }
        const fetchProduct = async () => {
            try {
                const response = await request.get<ProductInfo>(`/products/${id}`);
                setProductIfo(response.data);
                setStatus('succeeded');
                return response.data;
            }
            catch (error) {
                setStatus('failed');
                return null;
            }
        }
        fetchProduct();
    }, [dispatch, id])
    const handleAddQuantity = async (newQuantity: number) => {
        try{
            await dispatch(addQuantity({ id: productIfo.id, quantity: newQuantity })).unwrap();
            message.success('已成功加入购物车');
        }
        catch(error){
            message.error('加入购物车失败，请稍后重试');
        }
    }

    if (status === 'failed')
        return <div>Failed to fetch product information.</div>;

    if (status === 'succeeded') {
        return (
            <div>
                <div className={styles.container}>
                    <div className={styles.imageContainer}>
                        <Carousel autoplay>
                            {productIfo.images.map((imageUrl, index) => (
                                <div key={index}>
                                    <Image
                                        width="100%"
                                        src={imageUrl}
                                        alt={productIfo.name}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <div className={styles.infoContainer}>
                        <Typography.Title level={2}>{productIfo.name}</Typography.Title>
                        <Typography.Title level={3} style={{ color: 'red' }}>
                            ¥{productIfo.price.toFixed(2)}
                        </Typography.Title>
                        <Typography.Paragraph>{productIfo.description}</Typography.Paragraph>
                        <Space direction="vertical" size="large">
                            <Button type="primary" size="large" onClick={() => setModalOpen(true)}>
                                加入购物车
                            </Button>
                        </Space>
                    </div>
                </div>
                <Modal
                    title='选择购买数量'
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                    centered
                >
                    <div style = {{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button onClick={handleDecrease} disabled={cartQuantity === 1}>
                                -
                            </Button>
                            <span style={{ margin: '0 16px', fontSize: '16px' }}>{cartQuantity}</span>
                            <Button onClick={handleIncrease} disabled={productIfo.stock === cartQuantity}>
                                +
                            </Button>
                        </div>
                        <Button type="primary" style={{ marginTop: '16px' }} onClick={() => {
                            handleAddQuantity(cartQuantity);
                            setModalOpen(false);
                            setCartQuantity(1);
                        }}>
                            加入购物车
                        </Button>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default ProductPage;