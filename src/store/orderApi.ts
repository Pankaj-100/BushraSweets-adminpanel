// src/store/orderApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./apiConfig";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders", "PrivacyPolicy", "TermsOfService", "RefundPolicy", "FoodSafety", "Dashboard", "PaymentConfig"],
  endpoints: (builder) => ({
    // =================== ORDERS ENDPOINTS ===================
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
        return {
          url: `/orders/getAllOrders?${params.toString()}`,
        };
      },
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<any, string>({
      query: (orderId) => `/orders/getOrder/${orderId}`,
      providesTags: ["Orders"],
    }),

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

    getOrdersCount: builder.query<any, void>({
      query: () => `/orders/getOrdersCount`,
      providesTags: ["Orders"],
    }),

    // =================== DASHBOARD ENDPOINTS ===================
    getDashboardCounts: builder.query<any, void>({
      query: () => `/dashboard/getDashboardCounts`,
      providesTags: ["Dashboard"],
    }),

    getContentStats: builder.query<any, void>({
      query: () => `/dashboard/getContentStats`,
      providesTags: ["Dashboard"],
    }),

    // =================== PAYMENT CONFIG ENDPOINTS ===================
    getPaymentConfig: builder.query<any, void>({
      query: () => `/payments/getPaymentConfig`,
      providesTags: ["PaymentConfig"],
    }),

    updatePaymentConfig: builder.mutation<
      any,
      { ssl_account_id: string; ssl_user_id: string; ssl_pin: string }
    >({
      query: (body) => ({
        url: `/payments/updatePaymentConfig`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentConfig"],
    }),

    // =================== PRIVACY POLICY ENDPOINTS ===================
    getPrivacyPolicy: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/privacy`,
      providesTags: ["PrivacyPolicy"],
    }),

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
    getTermsOfService: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/service`,
      providesTags: ["TermsOfService"],
    }),

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
    getRefundPolicy: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/refund`,
      providesTags: ["RefundPolicy"],
    }),

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
    getFoodSafety: builder.query<any, void>({
      query: () => `/policies/getPolicyByType/safety`,
      providesTags: ["FoodSafety"],
    }),

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
  useGetDashboardCountsQuery,
  useGetContentStatsQuery,
  useGetPaymentConfigQuery,
  useUpdatePaymentConfigMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsOfServiceQuery,
  useUpdateTermsOfServiceMutation,
  useGetRefundPolicyQuery,
  useUpdateRefundPolicyMutation,
  useGetFoodSafetyQuery,
  useUpdateFoodSafetyMutation,
} = orderApi;