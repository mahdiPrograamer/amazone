import { createSlice } from "@reduxjs/toolkit";
import { getError } from "../../utils";
import axios from "axios";
import Swal from "sweetalert2";

const usersData = {
  isLoading: true,
  products: "",
  countProducts: "",
  page: "",
  pages: "",
  err: "",
};

export const searchSlice = createSlice({
  name: "user",
  initialState: usersData,
  reducers: {
    fetchSearchStart: (search, action) => {
      search.isLoading = true;
    },
    fetchSearchSucc: (search, action) => {
      search.products = action.payload.products;
      search.countProducts = action.payload.countProducts;
      search.page = action.payload.page;
      search.pages = action.payload.pages;
      search.isLoading = false;
    },

    fetchSearchFailed: (search, action) => {},
  },
});

export const searchHandler = async (
  dispatch,
  page,
  query,
  category,
  price,
  rating,
  order
) => {
  dispatch(searchSlice.actions.fetchSearchStart());
  try {
    const { data } = await axios.get(
      `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
    );

    console.log(data);

    dispatch(searchSlice.actions.fetchSearchSucc(data));
  } catch (error) {
    dispatch(searchSlice.actions.fetchSearchFailed(getError(error)));
  }
};

const summaryData = {
  users: {},
  orders: {},
  dailyOrders: {},
  categories: {},
  isLoading: true,
  err: false,
};

export const summarySlice = createSlice({
  name: "user",
  initialState: summaryData,
  reducers: {
    fetchStart: (state, action) => {
      state.isLoading = true;
    },
    fetchSecc: (state, action) => {
      state.users = action.payload.users;
      state.orders = action.payload.orders;
      state.dailyOrders = action.payload.dailyOrders;
      state.categories = action.payload.productCategories;
      state.isLoading = false;
    },

    fetchFailed: (state, action) => {
      state.err = action.payload;
      state.isLoading = false;
    },
  },
});

export const summaryDataHandler = async (dispatch, token) => {
  dispatch(summarySlice.actions.fetchStart());
  try {
    const { data } = await axios.get("/api/orders/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(summarySlice.actions.fetchSecc(data));
  } catch (error) {
    dispatch(summarySlice.actions.fetchFailed(getError(error)));
  }
};

const productListData = {
  isLoading: true,
  products: {},
  countProducts: {},
  page: 1,
  pages: "",
  err: false,
  createLoading: false,
  postingData: {},
  deletingLoading: false,
  successDelete: false,
};

export const productListSlice = createSlice({
  name: "productList",
  initialState: productListData,
  reducers: {
    fetchStart: (state, action) => {
      state.isLoading = true;
    },
    fetchSecc: (state, action) => {
      state.isLoading = false;
      state.products = action.payload.products;
      state.countProducts = action.payload.countProducts;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },

    fetchFailed: (state, action) => {
      state.err = action.payload;
      state.isLoading = false;
    },
    postStart: (state, action) => {
      state.createLoading = true;
    },
    postSecc: (state, action) => {
      state.createLoading = false;
      state.postingData = action.payload;
    },

    postFailed: (state, action) => {
      state.err = action.payload;
      state.createLoading = false;
    },

    deleteStart: (state, action) => {
      state.deletingLoading = true;
    },
    deleteSecc: (state, action) => {
      state.deletingLoading = false;
      state.successDelete = true;
    },

    deleteFailed: (state, action) => {
      state.err = action.payload;
      state.deletingLoading = false;
    },
    reset: (state, action) => {
      state.successDelete = false;
    },
  },
});
export const { reset } = productListSlice.actions;

export const productList = async (dispatch, token, page) => {
  dispatch(productListSlice.actions.fetchStart());
  try {
    const { data } = await axios.get(`/api/products/admin?page=${page} `, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(productListSlice.actions.fetchSecc(data));
  } catch (error) {
    dispatch(productListSlice.actions.fetchFailed(getError(error)));
  }
};

export const postingData = async (dispatch, token) => {
  dispatch(productListSlice.actions.postStart());
  try {
    const { data } = await axios.post(
      "/api/products",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    dispatch(productListSlice.actions.postSecc(data));
  } catch (error) {
    dispatch(productListSlice.actions.postFailed(getError(error)));
  }
};

export const deletingData = async (dispatch, token, id) => {
  dispatch(productListSlice.actions.deleteStart());
  try {
    await axios.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(productListSlice.actions.deleteSecc());
  } catch (error) {
    dispatch(productListSlice.actions.deleteFailed(getError(error)));
  }
};
