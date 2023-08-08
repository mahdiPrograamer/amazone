import {
  productsSlice,
  addToCartSlice,
  fetchCart,
  OneproductsSlice,
} from "./reducer";
import {
  userSlice,
  orderSlice,
  paymentSlice,
  OneOrderSlice,
  profileSlice,
} from "./loginReducer";

import { searchSlice, summarySlice, productListSlice } from "./thirdReducer";
import {
  updateProductSlice,
  orderListSlice,
  userListSlice,
} from "./fourthReducer";

import { combineReducers } from "@reduxjs/toolkit";
// import { mapSlice } from "./featureReducer";

export default combineReducers({
  productsSlice: productsSlice.reducer,
  fetchCart: fetchCart.reducer,
  paymentSlice: paymentSlice.reducer,
  userSlice: userSlice.reducer,
  orderSlice: orderSlice.reducer,
  addToCartSlice: addToCartSlice.reducer,
  OneproductsSlice: OneproductsSlice.reducer,
  OneOrderSlice: OneOrderSlice.reducer,
  profileSlice: profileSlice.reducer,
  searchSlice: searchSlice.reducer,
  summarySlice: summarySlice.reducer,
  productListSlice: productListSlice.reducer,
  updateProductSlice: updateProductSlice.reducer,
  orderListSlice: orderListSlice.reducer,
  userListSlice: userListSlice.reducer,
});
