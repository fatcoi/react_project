import { useSelector, useDispatch } from 'react-redux';
import { useState} from 'react';
import { addToCart, minusFromCart, removeFromCart} from '../../store/slices/cartSlice';
import { Button, Image, Typography} from 'antd';
import type { CartItem } from '../../types/cartType';
import type { RootState } from '../../store';
import type{ AppDispatch } from '../../store';

const CarPage = () => {
    const dispatch:AppDispatch = useDispatch();
    const { items, totalPrice, totalQuantity } = useSelector((state: RootState) => state.cart);
    const [isManagementMode, setManagementMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const selectedCount = selectedId.length;

    const handleSelectItem = (product: CartItem, check: boolean) => {
        if (check) {
            setSelectedId([...selectedId, product.id]);
        }
        else {
            setSelectedId(selectedId.filter(id => id !== product.id));
        }
    }

    const handleSwitchMode = () => {
        setManagementMode(pre => !pre);
        setSelectedId([]);
    }

    const handleSelectAll = () => {
        if (selectedId.length === items.length) {
            setSelectedId([]);
        }
        else {
            setSelectedId(items.map(item => item.id));
        }
    }

    const removeSelectedItems = () => {
        selectedId.forEach(id => {
            const product = items.find(item => item.id === id);
            if (product) {
                dispatch(removeFromCart(product.id));
            }
        });
        setSelectedId([]);
    }

    const handleAdd = (product: CartItem) => {
        dispatch(addToCart(product.id));
    }
    const handleMinus = (product: CartItem) => {
        dispatch(minusFromCart(product.id));
    }

    if(items.length===0) return(
        <div>
            <Typography.Title level={2} style={{textAlign:'center',marginTop:'50px'}}>购物车为空</Typography.Title>
             赶紧去选购喜欢的商品吧！
        </div>
    )
    return (
        < div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' ,gap:'12px' ,position:'relative'}}>
                <Typography.Title level={2}>购物车</Typography.Title>
                <Button onClick={handleSwitchMode} style={{position:'absolute',top:0,right:0,zIndex:1}}>{isManagementMode ? '完成' : '管理'}</Button>
                {items.map((cartItem) => (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '12px', borderBottom: '1px solid #f0f0f0' }} key={cartItem.id}>
                        {isManagementMode && (
                            <input
                                type="checkbox"
                                checked={selectedId.includes(cartItem.id)}
                                onChange={(e) => handleSelectItem(cartItem, e.target.checked)}
                                style={{ marginRight: '16px' }}
                            />
                        )}
                        <Image src={cartItem.imageUrl} alt={cartItem.name} style={{ marginRight: '16px' ,maxWidth:100,maxHeight:100,flex:1,objectFit:'contain'}} />
                        <div style={{ flex: 5 ,display:'flex',flexDirection:'column',alignItems:'center'}}>
                            <Typography.Text strong>{cartItem.name}</Typography.Text>
                            <br />
                            <Typography.Text>价格: ¥{cartItem.price*cartItem.quantity}</Typography.Text>
                            <br />
                            <Typography.Text>数量: {cartItem.quantity}</Typography.Text>
                        </div>
                            {!isManagementMode&&(<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Button onClick={() => handleAdd(cartItem)} style={{ marginBottom: '8px' }}>+</Button>
                                <Button onClick={() => handleMinus(cartItem)} style={{ marginBottom: '8px' }} disabled={cartItem.quantity <= 1}>-</Button>
                            </div>)}
                    </div>
                ))}
                <div style={{ marginTop: '24px', width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Typography.Text>总数量: {totalQuantity}</Typography.Text>
                        <br />
                        <Typography.Text>总价格: ¥{totalPrice.toFixed(2)}</Typography.Text>
                        <br />
                        {isManagementMode && (
                            <Button onClick={handleSelectAll} style={{ marginTop: '8px' }}>{selectedCount === items.length ? '取消全选' : '全选'}</Button>
                        )}
                        {isManagementMode && (
                            <Button onClick = {removeSelectedItems} disabled={selectedCount===0} style={{ marginTop: '8px' ,marginRight:'8px'}}>删除({selectedCount})</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarPage;

