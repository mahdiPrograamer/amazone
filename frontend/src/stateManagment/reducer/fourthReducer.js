import { createSlice } from "@reduxjs/toolkit";
import { getError } from "../../utils";
import axios from "axios";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

const updateData = {
  isLoading: false,
  err: "",
  updateLoading: false,
};

export const updateProductSlice = createSlice({
  name: "update",
  initialState: updateData,
  reducers: {
    fetchUpdateStart: (state, action) => {
      state.isLoading = true;
    },
    fetchUpdateSucc: (state, action) => {
      state.isLoading = false;
    },

    fetchUpdateFailed: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },
    requestStart: (state, action) => {
      state.updateLoading = true;
    },
    requestSucc: (state, action) => {
      state.updateLoading = false;
    },

    requestFailed: (state, action) => {
      state.updateLoading = false;
      state.err = action.payload;
    },
  },
});

export const {
  fetchUpdateStart,
  fetchUpdateSucc,
  fetchUpdateFailed,
  requestStart,
  requestSucc,
  requestFailed,
} = updateProductSlice.actions;

const orderData = {
  isLoading: true,
  err: "",
  orderListData: [],
  deletingLoading: false,
  succesDelete: false,
};

export const orderListSlice = createSlice({
  name: "update",
  initialState: orderData,
  reducers: {
    fetchStart: (state, action) => {
      state.isLoading = true;
    },
    fetchSucc: (state, action) => {
      state.isLoading = false;

      state.orderListData = action.payload.data;
    },

    fetchFailed: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },

    deleteStart: (state, action) => {
      state.deletingLoading = true;
    },
    deleteSucc: (state, action) => {
      state.deletingLoading = false;
      state.succesDelete = true;
    },

    deleteFailed: (state, action) => {
      state.deletingLoading = false;
    },
    reset: (state, action) => {
      state.succesDelete = false;
      state.deletingLoading = false;
    },
  },
});

export const { deleteStart, deleteSucc, deleteFailed, reset } =
  orderListSlice.actions;

export const orderListHandler = async (dispatch, token) => {
  dispatch(orderListSlice.actions.fetchStart());
  try {
    const { data } = await axios.get(`/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(orderListSlice.actions.fetchSucc({ data }));
  } catch (error) {
    dispatch(orderListSlice.actions.fetchFailed(getError(error)));
  }
};

const userData = {
  isLoading: true,
  err: "",
  userListData: [],
  deletingLoading: false,
  succesDelete: false,
  getDataLoading: true,
  getUserDataErr: "",
  updateLoading: false,
};

export const userListSlice = createSlice({
  name: "update",
  initialState: userData,
  reducers: {
    fetchStart: (state, action) => {
      state.isLoading = true;
    },
    fetchSucc: (state, action) => {
      state.isLoading = false;
      state.userListData = action.payload.data;
    },

    fetchFailed: (state, action) => {
      state.isLoading = false;
      state.err = action.payload;
    },

    deleteUserStart: (state, action) => {
      state.deletingLoading = true;
    },
    deleteUserSucc: (state, action) => {
      state.deletingLoading = false;
      state.succesDelete = true;
    },

    deleteUserFailed: (state, action) => {
      state.deletingLoading = false;
    },
    resetUser: (state, action) => {
      state.succesDelete = false;
      state.deletingLoading = false;
    },
    getUserDataStart: (state, action) => {
      state.getDataLoading = true;
    },
    getUserDataSucc: (state, action) => {
      state.getDataLoading = false;
    },
    getUserDataFailed: (state, action) => {
      state.getDataLoading = false;
      state.getUserDataErr = action.payload;
    },

    updateStart: (state, action) => {
      state.updateLoading = true;
    },
    updateSucc: (state, action) => {
      state.updateLoading = false;
    },
    updateFailed: (state, action) => {
      state.updateLoading = false;
    },
  },
});

export const {
  updateStart,
  updateSucc,
  updateFailed,
  getUserDataStart,
  getUserDataSucc,
  getUserDataFailed,
  fetchStart,
  fetchSucc,
  fetchFailed,
  deleteUserStart,
  deleteUserSucc,
  deleteUserFailed,
  resetUser,
} = userListSlice.actions;
