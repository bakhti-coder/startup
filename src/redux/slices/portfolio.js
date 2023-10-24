import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import request from "./../../server/index";
import { LIMIT } from "../../constants";

const initialState = {
  portfolios: [],
  loading: false,
  total: 0,
  isModalLoading: false,
};

export const getPortfolios = createAsyncThunk(
  "portfolios/fetching",
  async ({ search, page }) => {
    const params = { search, page, limit: LIMIT };
    const { data } = await request.get("portfolios", { params });
    return data;
  }
);

export const addPortfolio = createAsyncThunk(
  "portfolio/add",
  async ({ values, photo }) => {
    await request.post("portfolios", {
      name: values.name,
      description: values.description,
      url: values.url,
      photo: photo,
    });
  }
);

export const deletePortfolio = createAsyncThunk(
  "portfolio/delete",
  async (id) => {
    await request.delete(`portfolios/${id}`);
  }
);

export const getPortfolio = createAsyncThunk("portfolio/get", async (id) => {
  const { data } = await request.get(`portfolios/${id}`);
  return data;
});

export const updatePortfolio = createAsyncThunk(
  "portfolio/update",
  async ({ id, values, editPhotoId }) => {
    await request.put(`portfolios/${id}`, {
      name: values.name,
      description: values.description,
      photo: editPhotoId,
      url: values.url,
    });
  }
);

const portfolioSlice = createSlice({
  initialState,
  name: "portfolio",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPortfolios.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getPortfolios.fulfilled,
        (state, { payload: { data, pagination } }) => {
          state.portfolios = data;
          state.total = pagination.total;
          state.loading = false;
        }
      )
      .addCase(getPortfolios.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addPortfolio.pending, (state) => {
        state.isModalLoading = true;
      })
      .addCase(addPortfolio.fulfilled, (state) => {
        state.isModalLoading = false;
      })
      .addCase(addPortfolio.rejected, (state) => {
        state.isModalLoading = false;
      }).addCase;
  },
});

const { name, reducer: portfolioReducer } = portfolioSlice;

export { name as portfolioName, portfolioReducer as default };
