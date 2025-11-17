import { firstPageProducts,lastPageProducts,nextPageProducts,prevPageProducts, appendNextPageProducts} from '../../store/slices/productSlice';
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
import { FixedSizeList} from 'react-window';
import {throttle} from"../../utils/throttle";
import type{ CSSProperties } from 'react';


interface QuickSearchResult {
    products:Product[];
}
const ProductListPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { currentPage, totalPages } = useSelector((state: RootState) => state.products);
    const { products, status} = useSelector((state: RootState) => state.products);
    const[input,setInput]=useState('');
    const [quickSearchResults, setQuickSearchResults] = useState<Product[]>([]);
    const [isPC, setIsPC] = useState(window.innerWidth >= 1024);

    const throttledResize = useCallback(throttle(() => {
        setIsPC(window.innerWidth >= 1024);
    }, 200), []);

    useEffect(()=>{
        window.addEventListener('resize', throttledResize);
        return () => {
            window.removeEventListener('resize', throttledResize);
        };
    },[])
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

    if (isPC&&status === 'loading') {
        context = <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={Array.from({ length: 8 }, (_, index) => ({ key: index }))}
            renderItem={(item) => (
                <List.Item key={item.key}>
                    <Skeletons />
                </List.Item>
            )} />;
    }
    else if (isPC&&status === 'succeeded') {
        context = <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={products}
            renderItem={(product) => (
                <List.Item key={product.id}>
                    <ProductCard product={product} />
                </List.Item>
            )} />;
    }
    else if(!isPC&&status==='loading'){
        context=<FixedSizeList
        height={600}
        width={'100%'}
        itemSize={150}
        itemCount={8}
        >
            {({style}:{index:number;style:CSSProperties})=>(
                <div style={style}>
                    <Skeletons/>
                </div>
            )}
        </FixedSizeList>
    }
    else if(!isPC&&status==='succeeded'){
        context=<FixedSizeList
        height={600}
        width={'100%'}
        itemSize={420}
        itemCount={products.length}
        onItemsRendered={
            ({visibleStopIndex})=>{
                if(visibleStopIndex>=products.length-3&&currentPage<totalPages&&status==='succeeded'){
                    dispatch(appendNextPageProducts());
                }
            }
        }
        >
            {({index,style}:{index:number;style:CSSProperties})=>(
                <div style={style}>
                    <ProductCard product={products[index]}/>
                </div>
            )}
        </FixedSizeList>
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
            {isPC&&<div style={{ marginBottom: '16px' }}>
                <Button onClick={()=>dispatch(firstPageProducts())}>首页</Button>
                <Button onClick={() => dispatch(prevPageProducts())} disabled={products.length===0||status==='loading'||currentPage===1}>上一页</Button>
                <span style={{ margin: '0 8px' }}>第 {currentPage} 页 / 共 {totalPages} 页</span>
                <Button onClick={() => dispatch(nextPageProducts())} disabled={products.length===0||status==='loading'||currentPage===totalPages}>下一页</Button>
                <Button onClick={() => dispatch(lastPageProducts())}>末页</Button>

            </div>}
        </div>
    )

}

export default ProductListPage;