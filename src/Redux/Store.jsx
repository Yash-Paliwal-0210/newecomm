// src/Redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userSlice from './User/UserReducer';      // Assuming userSlice is exported from UserReducer
import ProductReducer from './Products/ProductReducer';  // Assuming ProductReducer is exported from ProductReducer
import orderSlice from './Orders/OrderReducer';  // Assuming orderSlice is exported from OrderReducer

const store = configureStore({
  reducer: {
    user: userSlice,
    product: ProductReducer,
    order: orderSlice,
  },
});

export default store;