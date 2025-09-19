import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi"
import { cmsApi } from "./cmsApi"
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      cmsApi.middleware,
    
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
