import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bushra-sweets-backend.onrender.com/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    // =================== GET ALL ORDERS ===================
    getAllOrders: builder.query<
      any,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append("status", status);
        return `/orders/getAllOrders?${params.toString()}`;
      },
      providesTags: ["Orders"],
    }),

    // =================== GET ORDER BY ID ===================
    getOrderById: builder.query<any, string>({
      query: (orderId) => `/orders/getOrder/${orderId}`,
      providesTags: ["Orders"],
    }),

    // =================== UPDATE ORDER STATUS ===================
    updateOrderStatus: builder.mutation<
      any,
      { orderId: string; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `/orders/updateOrderStatus/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    // =================== GET ORDERS COUNT ===================
    getOrdersCount: builder.query<any, void>({
      query: () => `/orders/getOrdersCount`,
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersCountQuery,
} = orderApi;
