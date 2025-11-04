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
  tagTypes: ["Orders", "PrivacyPolicy", "TermsOfService", "RefundPolicy", "FoodSafety"],
  endpoints: (builder) => ({
    // =================== ORDERS ENDPOINTS ===================
    
    // GET ALL ORDERS
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

    // GET ORDER BY ID
    getOrderById: builder.query<any, string>({
      query: (orderId) => `/orders/getOrder/${orderId}`,
      providesTags: ["Orders"],
    }),

    // UPDATE ORDER STATUS
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

    // GET ORDERS COUNT
    getOrdersCount: builder.query<any, void>({
      query: () => `/orders/getOrdersCount`,
      providesTags: ["Orders"],
    }),

    // =================== PRIVACY POLICY ENDPOINTS ===================

    // GET PRIVACY POLICY BY TYPE
    getPrivacyPolicy: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/privacy`,
      providesTags: ["PrivacyPolicy"],
    }),

    // CREATE OR UPDATE PRIVACY POLICY
    updatePrivacyPolicy: builder.mutation<
      any,
      { content: string }
    >({
      query: (data) => ({
        url: `/policies/createOrUpdatePolicy`,
        method: "POST",
        body: {
          type: "privacy",
          content: data.content
        },
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),

    // =================== TERMS OF SERVICE ENDPOINTS ===================

    // GET TERMS OF SERVICE BY TYPE
    getTermsOfService: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/service`,
      providesTags: ["TermsOfService"],
    }),

    // CREATE OR UPDATE TERMS OF SERVICE
    updateTermsOfService: builder.mutation<
      any,
      { content: string }
    >({
      query: (data) => ({
        url: `/policies/createOrUpdatePolicy`,
        method: "POST",
        body: {
          type: "service",
          content: data.content
        },
      }),
      invalidatesTags: ["TermsOfService"],
    }),

    // =================== REFUND POLICY ENDPOINTS ===================

    // GET REFUND POLICY BY TYPE
    getRefundPolicy: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/refund`,
      providesTags: ["RefundPolicy"],
    }),

    // CREATE OR UPDATE REFUND POLICY
    updateRefundPolicy: builder.mutation<
      any,
      { content: string }
    >({
      query: (data) => ({
        url: `/policies/createOrUpdatePolicy`,
        method: "POST",
        body: {
          type: "refund",
          content: data.content
        },
      }),
      invalidatesTags: ["RefundPolicy"],
    }),

    // =================== FOOD SAFETY ENDPOINTS ===================

    // GET FOOD SAFETY BY TYPE
    getFoodSafety: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/safety`,
      providesTags: ["FoodSafety"],
    }),

    // CREATE OR UPDATE FOOD SAFETY
    updateFoodSafety: builder.mutation<
      any,
      { content: string }
    >({
      query: (data) => ({
        url: `/policies/createOrUpdatePolicy`,
        method: "POST",
        body: {
          type: "safety",
          content: data.content
        },
      }),
      invalidatesTags: ["FoodSafety"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrdersCountQuery,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsOfServiceQuery,
  useUpdateTermsOfServiceMutation,
  useGetRefundPolicyQuery,
  useUpdateRefundPolicyMutation,
  useGetFoodSafetyQuery,
  useUpdateFoodSafetyMutation,
} = orderApi;