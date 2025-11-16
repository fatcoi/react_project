import { firstPageProducts,lastPageProducts,nextPageProducts,prevPageProducts } from '../../store/slices/productSlice';
import { setSearchKeyword } from '../../store/slices/productSlice';
import { List, Alert, Typography, Button,AutoComplete,Input } from 'antd';
import ProductCard from '../../components/ProductCard';
import { useCallback, useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import Skeletons from '../../components/Skeletons';
import { debounce } from '../../utils/debounce';
import request from '../../utils/request';
import type { Product } from '../../types/product';

interface QuickSearchResult {
    products:Product[];
}
const ProductListPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { currentPage, totalPages } = useSelector((state: RootState) => state.products);
    const { products, status, error } = useSelector((state: RootState) => state.products);
    const[input,setInput]=useState('');
    const [quickSearchResults, setQuickSearchResults] = useState<Product[]>([]);

    const handleSearch=(value?:string)=>{
        const keyword = value !== undefined ? value : input;
        setInput(keyword);
        dispatch(setSearchKeyword(keyword));
        dispatch(firstPageProducts());
    }
    const quickSearch = async(value:string) => {
        try{
            const response = await request.get<QuickSearchResult>('/products/quicksearch', {
                params: { keyword: value }
            });
            setQuickSearchResults(response.data.products);

        }catch{
            console.log('快速搜索失败');
        }
    }
    const debouncedQuickSearch = useCallback(debounce((value:string)=>{
        quickSearch(value);
    },300),[]);

    const handleOnChange= (value:string)=>{
        setInput(value);
        debouncedQuickSearch(value);
    };
    
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
            <AutoComplete
                style={{ width: 300, marginBottom: '100px' }}
                options={quickSearchResults.map(product=>({value:product.name}))}
                onSelect={(value)=>{handleSearch(value)}}
                onChange={handleOnChange}
                value={input}
            >
                <Input.Search size="large" enterButton="搜索" onSearch={handleSearch}/>
            </AutoComplete>

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