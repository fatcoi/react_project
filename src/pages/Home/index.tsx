import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            Home Page
            <Link to='/login'>Login</Link>
        </div>
    )
}

export default HomePage;