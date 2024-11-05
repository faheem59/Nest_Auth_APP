/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [wishlistItemCount, setWishlistItemCount] = useState<number>(0);
  const user = localStorage.getItem('User');
  const navigate = useNavigate();


  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setCartItemCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0)); 
    setWishlistItemCount(wishlist.length);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWishList = () => {
    handleClose();
    navigate('/wishlist');
  };

  const handleCart = () => {
    handleClose();
    navigate('/cart');
  };

  const handleLoginRedirect = () => {
    handleClose();
    navigate('/login');
  };

  const handleLogout = () => {
    handleClose();
    navigate('/');
    localStorage.clear();
  };

  return (
    <AppBar position="fixed" className="main-navbar" sx={{ width: '100%' }}>
      <Toolbar className="top-navbar">
        <Typography variant="h6" className="brand-name">
          Funda Ecom
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <InputBase placeholder="Search your product…" className="search-input" />
          <IconButton type="button">
            <SearchIcon />
          </IconButton>
        </Box>
        {/* Shopping Cart Icon with count */}
        <IconButton className="nav-icon" onClick={handleCart}>
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        {/* Wishlist Icon with count */}
        <IconButton className="nav-icon" onClick={handleWishList}>
          <Badge badgeContent={wishlistItemCount} color="secondary">
            <FavoriteIcon />
          </Badge>
        </IconButton>
        <IconButton
          className="nav-icon"
          onClick={handleMenu}
          aria-controls="account-menu"
          aria-haspopup="true"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {user ? (
            <>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My Orders</MenuItem>
              <MenuItem onClick={handleWishList}>My Wishlist</MenuItem>
              <MenuItem onClick={handleClose}>My Cart</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleLoginRedirect}>Login</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
