import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

const productsData = {
  isLoading: false,
  err: "",
  slugs: [],
  currentProduct: "",
  given: false,
  addedProducts: [],
};

export const productsSlice = createSlice({
  name: "products",
  initialState: productsData,
  reducers: {
    fetchProductsStart: (product, action) => {
      product.isLoading = true;
    },

    fetchProductsSucc: (products, actions) => {
      products.slugs = actions.payload.data;
      products.given = true;
      products.isLoading = false;
    },
    fetchProductsFailed: (products, actions) => {
      console.log("err: ", actions);
      products.err = actions.payload;
    },

    getProduct: (product, action) => {
      const currentProductData = product.slugs.find(
        (item) => item.slug === action.payload.slug
      );

      if (!currentProductData) {
        product.isShow404 = true;
      } else {
        product.isShow404 = false;
        product.currentProduct = currentProductData;
      }
    },
  },
});

export const { getProduct } = productsSlice.actions;

///////////////////////////////////////

const addedProductsStore = {
  addedToLocal: [],
  isLoading: true,
};

export const addToCartSlice = createSlice({
  name: "localCart",
  initialState: addedProductsStore,
  reducers: {
    addToLocalCart: (products, action) => {
      const findedItem = products.addedToLocal.find((item) => {
        return item.slug == action.payload.item.slug;
      });
      if (findedItem) {
        findedItem.quantity += 1;
      } else {
        products.addedToLocal.push({ ...action.payload.item, quantity: 1 });
      }
    },

    incressQuantityLocal: (products, action) => {
      products.addedToLocal.find((item) => {
        return item.slug == action.payload.name;
      }).quantity += 1;
    },

    minusQuantityLocal: (products, action) => {
      products.addedToLocal.find((item) => {
        return item.slug == action.payload.name;
      }).quantity -= 1;
    },

    deleteAddedProductLocal: (products, actions) => {
      const filteredItems = products.addedToLocal.filter((item) => {
        return item.slug != actions.payload.name;
      });
      products.addedToLocal = filteredItems;
    },
  },
});

export const {
  incressQuantityLocal,
  minusQuantityLocal,
  addToLocalCart,
  deleteAddedProductLocal,
} = addToCartSlice.actions;

const OneProduct = {
  slug: [],
  isLoading: true,
  err: "",
  createLoading: false,
};

export const OneproductsSlice = createSlice({
  name: "localCart",
  initialState: OneProduct,
  reducers: {
    fetchSlugStart: (product, action) => {
      product.isLoading = true;
    },

    fetchSlugSucc: (products, actions) => {
      products.isLoading = false;
      products.slug = actions.payload.data;
      // products.given = true;
    },
    fetchSlugFailed: (products, actions) => {
      products.isLoading = false;
      console.log("err: ", actions);
      products.err = actions.payload.error;
    },

    createRequest: (products, actions) => {
      products.createLoading = true;
    },
    createSucc: (products, actions) => {
      products.createLoading = false;
      products.slug = actions.payload.data;
    },
    resetSlug: (products, actions) => {
      products.slug = actions.payload.data;
    },
    createFailed: (products, actions) => {
      products.createLoading = false;
      products.err = actions.payload;
    },
  },
});

export const { createRequest, createSucc, resetSlug, createFailed } =
  OneproductsSlice.actions;

///////////////////////////////////////////////////////

// thunk

export const getOneProducts = async (dispatch, slug) => {
  dispatch(OneproductsSlice.actions.fetchSlugStart());
  try {
    const { data } = await Axios.get(`/api/products/slug/${slug}`);
    console.log(data);

    dispatch(OneproductsSlice.actions.fetchSlugSucc({ data }));
  } catch (error) {
    dispatch(OneproductsSlice.actions.fetchSlugFailed({ error }));
  }
};

export const getAllProducts = async (dispatch) => {
  dispatch(productsSlice.actions.fetchProductsStart());
  try {
    const { data } = await Axios.get("/api/products");
    console.log(data);

    dispatch(productsSlice.actions.fetchProductsSucc({ data }));
  } catch (error) {
    dispatch(productsSlice.actions.fetchProductsFailed(error));
  }
};

// export const getAllCartProducts = async (dispatch , id) => {
//   dispatch(fetchCart.actions.fetchCartProductsStart());
//   try {
//     const result = await Axios.get(`api/products/${id}`);
//     console.log(result.data);

//     dispatch(dispatch(fetchCart.actions.fetchCartProductsSucc({ data: result.data })));
//   } catch (error) {
//     dispatch(fetchCart.actions.fetchCartProductsFailed(error));
//   }
// };

//actios

// fetchSlugStart: (product, action) => {
//   product.isLoading = true;
//   console.log(product.isLoading);
// },

// fetchSlugSucc: (products, actions) => {
//   products.slug = actions.payload.data;

//   products.isLoading = false;
//   console.log(products.isLoading);
// },
// fetchSlugFailed: (products, actions) => {
//   console.log("err: ", actions);
//   products.err = actions.payload.error;
// },

/////////////////////////////////

const xz = {
  addedProducts: [],
  err: "",

  isLoading: false,
};

export const fetchCart = createSlice({
  name: "xxx",
  initialState: xz,
  reducers: {
    fetchCartProductsStart: (product, action) => {
      product.isLoading = true;
    },

    fetchCartProductsSucc: (products, actions) => {
      products.addedProducts = actions.payload.data;

      products.isLoading = false;
    },
    fetchCartProductsFailed: (products, actions) => {
      products.isLoading = false;
      console.log("err: ", actions);
      products.err = actions.payload;
    },

    incressQuantity: (products, action) => {
      products.addedProducts.find((item) => {
        return item.slug == action.payload.name;
      }).quantity += 1;
    },

    minusQuantity: (products, action) => {
      products.addedProducts.find((item) => {
        return item.slug == action.payload.name;
      }).quantity -= 1;
    },

    deleteAddedProduct: (products, actions) => {
      const filteredItems = products.addedProducts.filter((item) => {
        return item.slug != actions.payload.name;
      });
      products.addedProducts = filteredItems;
    },
  },
});

export const { incressQuantity, minusQuantity, deleteAddedProduct } =
  fetchCart.actions;
