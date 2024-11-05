import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import SignUpPage from "../pages/LoginSignUp/SignUpPage"
import LoginPage from "../pages/LoginSignUp/LoginPage"
import Home from "../pages/Home/Home"
import ProductDetail from "../pages/Product/ProductDetail"
import Wishlist from "../pages/Product/WishList"
import Cart from "../pages/Product/Cart"

const PublicRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                     <Route path="/cart" element={<Cart/>} />
                {/* <Route path="/checkout" element={<CheckOutlined />} />  */}
                    
                </Routes>
            </Router>
        </>
    )
}

export default PublicRoutes