import type { Product } from '../types/product';

export const mockProducts: Product[] = [
    {
        id: '1',
        name: '高性能笔记本电脑',
        price: 8999,
        description: '最新款处理器，超长续航，轻薄便携，满足你的一切办公和娱乐需求。',
        imageUrl: 'https://via.placeholder.com/300x300/FFC107/000000?text=Laptop',
        category: '电子产品',
        stock: 15,
    },
    {
        id: '2',
        name: '人体工学办公椅',
        price: 1299,
        description: '多功能调节，完美支撑腰部和颈部，告别久坐疲劳。',
        imageUrl: 'https://via.placeholder.com/300x300/03A9F4/FFFFFF?text=Chair',
        category: '家居生活',
        stock: 30,
    },
    {
        id: '3',
        name: '智能降噪耳机',
        price: 1999,
        description: '沉浸式听觉体验，有效隔绝环境噪音，享受纯净音乐。',
        imageUrl: 'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Headphones',
        category: '电子产品',
        stock: 22,
    },
];