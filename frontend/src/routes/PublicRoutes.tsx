import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import SignUpPage from "../pages/LoginSignUp/SignUpPage"
import LoginPage from "../pages/LoginSignUp/LoginPage"
import Home from "../pages/Home/Home"
import ProductDetail from "../pages/Product/ProductDetail"
import Wishlist from "../pages/Product/WishList"
import Cart from "../pages/Product/Cart"
import Checkout from "../pages/Product/Checkout"
import OrderItemsPage from "../pages/Order/OrderItemsPage"
import ShippingPage from "../pages/Order/Shipping"
import PaymentPage from "../pages/Order/Payment"
import OrderSuccessPage from "../pages/Order/OrderSuccess"

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
                    <Route path="/checkout" element={<Checkout />} /> 
                     <Route path="/shipping" element={<ShippingPage/>} />
        <Route path="/order-items" element={<OrderItemsPage/>} />
        <Route path="/payment" element={<PaymentPage/>} />
        <Route path="/order-success" element={<OrderSuccessPage/>} />
                    
                </Routes>
            </Router>
        </>
    )
}

export default PublicRoutes