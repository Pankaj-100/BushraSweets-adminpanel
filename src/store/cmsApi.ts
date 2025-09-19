    import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

    export const cmsApi = createApi({
    reducerPath: "cmsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://bushra-sweets-backend.onrender.com/api/v1",
        prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
        },
    }),
    tagTypes: ["Testimonials", "Upload", "ServingIdeas", "Desserts"],
    endpoints: (builder) => ({
        // =================== TESTIMONIALS CRUD ===================
        getTestimonials: builder.query<any, { page?: number; limit?: number }>({
        query: ({ page = 1, limit = 5 }) =>
            `/testimonals/getTestimonials?page=${page}&limit=${limit}`,
        providesTags: ["Testimonials"],
        }),
        addTestimonial: builder.mutation<any, { customerName: string; review: string; customerImage?: string; occasion?: string; stars: number }>({
        query: (body) => ({ url: "/testimonals/add-testimonial", method: "POST", body }),
        invalidatesTags: ["Testimonials"],
        }),
        editTestimonial: builder.mutation<any, { id: string; data: Partial<{ customerName: string; review: string; customerImage: string; occasion: string; stars: number }> }>({
        query: ({ id, data }) => ({ url: `/testimonals/edit-testimonial/${id}`, method: "PATCH", body: data }),
        invalidatesTags: ["Testimonials"],
        }),
        deleteTestimonial: builder.mutation<any, string>({
        query: (id) => ({ url: `/testimonals/delete-testimonial/${id}`, method: "DELETE" }),
        invalidatesTags: ["Testimonials"],
        }),

        // =================== IMAGE UPLOAD ===================
        uploadSingleImage: builder.mutation<any, File>({
        query: (imageFile) => {
            const formData = new FormData();
            formData.append("image", imageFile);
            return { url: "/upload/single-image", method: "POST", body: formData };
        },
        invalidatesTags: ["Upload"],
        }),
        uploadMultipleImages: builder.mutation<any, File[]>({
        query: (files) => {
            const formData = new FormData();
            files.forEach((file) => formData.append("images", file));
            return { url: "/upload/multiple-images", method: "POST", body: formData };
        },
        invalidatesTags: ["Upload"],
        }),

        // =================== SERVING IDEAS CRUD ===================
        getServingIdeas: builder.query<any, { page?: number; limit?: number }>({
        query: ({ page = 1, limit = 5 }) => `/servingIdeas/getServingIdeas?page=${page}&limit=${limit}`,
        providesTags: ["ServingIdeas"],
        }),
        addServingIdea: builder.mutation<any, { title: string; description: string; occasionType: string; image?: string }>({
        query: (body) => ({ url: "/servingIdeas/add-servingIdea", method: "POST", body }),
        invalidatesTags: ["ServingIdeas"],
        }),
        editServingIdea: builder.mutation<any, { id: string; data: Partial<{ title: string; description: string; occasionType: string; image?: string }> }>({
        query: ({ id, data }) => ({ url: `/servingIdeas/edit-servingIdea/${id}`, method: "PATCH", body: data }),
        invalidatesTags: ["ServingIdeas"],
        }),
        deleteServingIdea: builder.mutation<any, string>({
        query: (id) => ({ url: `/servingIdeas/delete-servingIdea/${id}`, method: "DELETE" }),
        invalidatesTags: ["ServingIdeas"],
        }),

        // =================== DESSERTS CRUD ===================
        getDesserts: builder.query<any, { search?: string; isPopular?: boolean; isActive?: boolean; sortBy?: string; order?: "asc" | "desc"; page?: number; limit?: number }>({
        query: ({ search = "", isPopular, isActive, sortBy = "dessertName", order = "asc", page = 1, limit = 10 }) => {
            const params = new URLSearchParams({ search, sortBy, order, page: page.toString(), limit: limit.toString() });
            if (isPopular !== undefined) params.append("isPopular", isPopular.toString());
            if (isActive !== undefined) params.append("isActive", isActive.toString());
            return `/desserts/getDessert?${params.toString()}`;
        },
        providesTags: ["Desserts"],
        }),
        addDessert: builder.mutation<any, {
        dessertName: string;
        price: number;
        description: string;
        dessertImages: string[];
        prepTime: string;
        serves: string;
        category: string;
        allergens: string[];
        ingredients: string[];
        tags: string[];
        }>({
        query: (body) => ({ url: "/desserts/add-dessert", method: "POST", body }),
        invalidatesTags: ["Desserts"],
        }),
        editDessert: builder.mutation<any, { id: string; data: Partial<{ dessertName: string; price: number; description: string; dessertImages: string[]; prepTime: string; serves: string; category: string; allergens: string[]; ingredients: string[]; tags: string[]; isFeatured?: boolean; isPopular?: boolean; isActive?: boolean }> }>({
        query: ({ id, data }) => ({ url: `/desserts/edit-dessert/${id}`, method: "PATCH", body: data }),
        invalidatesTags: ["Desserts"],
        }),
        deleteDessert: builder.mutation<any, string>({
        query: (id) => ({ url: `/desserts/delete-dessert/${id}`, method: "DELETE" }),
        invalidatesTags: ["Desserts"],
        }),
    }),
    });

    export const {
    useGetTestimonialsQuery,
    useAddTestimonialMutation,
    useEditTestimonialMutation,
    useDeleteTestimonialMutation,
    useUploadSingleImageMutation,
    useUploadMultipleImagesMutation,
    useGetServingIdeasQuery,
    useAddServingIdeaMutation,
    useEditServingIdeaMutation,
    useDeleteServingIdeaMutation,
    useGetDessertsQuery,
    useAddDessertMutation,
    useEditDessertMutation,
    useDeleteDessertMutation,
    } = cmsApi;
