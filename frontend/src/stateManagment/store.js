import { configureStore } from "@reduxjs/toolkit";
// import { productsSlice, addToCartSlice } from "./reducer/reducer";
import reducers from "./reducer/combainingReducers";

import thunk from "redux-thunk";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["addToCartSlice", "userSlice"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(thunk),
});

export const persistor = persistStore(store);
