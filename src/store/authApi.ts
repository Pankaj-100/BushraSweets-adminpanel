// src/store/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./apiConfig";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<
      { success: boolean; message: string; token: string; user: any },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/users/adminlogin",
        method: "POST",
        body,
      }),
    }),
  
  
  }),
});

export const { useLoginMutation } = authApi;