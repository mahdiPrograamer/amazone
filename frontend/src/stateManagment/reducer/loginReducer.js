import { createSlice } from "@reduxjs/toolkit";
import { getError } from "../../utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const usersData = {
  shippingData: "",
  userData: "",
  paymentMethod: "",
  position: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: usersData,
  reducers: {
    loginHandler: (user, action) => {
      console.log(action.payload);
      user.userData = action.payload.data;
    },
    signoutHnadler: (user, action) => {
      user.userData = "";
      user.shippingData = "";
    },

    shippingSetData: (user, action) => {
      user.shippingData = action.payload.data;
    },
    setPaymentMethod: (user, action) => {
      user.paymentMethod = action.payload.data;
    },
    setPosition: (user, action) => {
      user.position = action.payload.position;
    },
  },
});

export const {
  loginHandler,
  signoutHnadler,
  shippingSetData,
  setPaymentMethod,
  setPosition,
} = userSlice.actions;

const paymentData = {
  isLoading: false,
};

export const paymentSlice = createSlice({
  name: "order",
  initialState: paymentData,
  reducers: {
    fetchStart: (order, action) => {
      order.isLoading = true;
    },
    fetchSucc: (order, action) => {
      order.isLoading = false;
    },
    fetchfailed: (order, action) => {
      order.isLoading = false;
    },
  },
});

export const { fetchStart, fetchSucc, fetchfailed } = paymentSlice.actions;

const orderData = {
  data: {},
  isLoading: true,
  err: "",
  successDeliver: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState: orderData,
  reducers: {
    fetchOrderStart: (order, action) => {
      order.isLoading = true;
    },
    fetchOrderSucc: (order, action) => {
      order.isLoading = false;
      order.data = action.payload.order;
    },
    fetchOrderFailed: (order, action) => {
      order.isLoading = false;
      order.err = action.payload;
    },

    fetchDeliverStart: (order, action) => {
      order.loadingDeliver = true;
    },
    fetchDeliverSucc: (order, action) => {
      order.loadingDeliver = false;
      order.successDeliver = true;
    },
    fetchDeliverFailed: (order, action) => {
      order.loadingDeliver = false;
    },
    reset: (order, action) => {
      order.loadingDeliver = false;
      order.successDeliver = false;
    },
  },
});

export const {
  fetchDeliverStart,
  fetchDeliverSucc,
  fetchDeliverFailed,
  reset,
} = orderSlice.actions;

export const getOrder = async (dispatch, id, auth) => {
  dispatch(orderSlice.actions.fetchOrderStart());
  try {
    const result = await axios.get(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });

    dispatch(orderSlice.actions.fetchOrderSucc({ order: result.data }));
  } catch (error) {
    dispatch(orderSlice.actions.fetchOrderFailed(getError(error)));
  }
};

const OneOrderData = {
  data: [],
  isLoading: true,
  err: "",
};

export const OneOrderSlice = createSlice({
  name: "order",
  initialState: OneOrderData,
  reducers: {
    fetchOneOrderStart: (order, action) => {
      order.isLoading = true;
    },
    fetchOneOrderSucc: (order, action) => {
      order.isLoading = false;
      order.data = action.payload.data;
    },
    fetchOneOrderFailed: (order, action) => {
      order.isLoading = false;
      order.err = action.payload;
    },
  },
});

export const getOneOrder = async (dispatch, auth) => {
  dispatch(OneOrderSlice.actions.fetchOneOrderStart());
  try {
    const { data } = await axios.get(
      `/api/orders/mine`,

      { headers: { Authorization: `Bearer ${auth}` } }
    );

    dispatch(OneOrderSlice.actions.fetchOneOrderSucc({ data }));
  } catch (error) {
    dispatch(OneOrderSlice.actions.fetchOneOrderFailed(getError(error)));
  }
};

const profileData = {
  isLoading: false,
  err: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: profileData,
  reducers: {
    fetchprofileStart: (profile, action) => {
      profile.isLoading = true;
    },
    fetchprofileSucc: (profile, action) => {
      profile.isLoading = false;
    },
    fetchprofileFailed: (profile, action) => {
      profile.isLoading = false;
      profile.err = action.payload;
    },
  },
});

export const getprofile = async (dispatch, auth, name, email, password) => {
  dispatch(profileSlice.actions.fetchprofileStart());
  try {
    const { data } = await axios.put(
      "/api/users/profile",
      {
        name,
        email,
        password,
      },
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );

    dispatch(profileSlice.actions.fetchprofileSucc({ data }));
    dispatch(userSlice.actions.loginHandler({ data }));
  } catch (error) {
    dispatch(profileSlice.actions.fetchprofileFailed(getError(error)));
  }
};
