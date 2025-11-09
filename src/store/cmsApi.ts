// src/store/cmsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./apiConfig";

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Testimonials", "Upload", "ServingIdeas", "Desserts", "Hero", 
    "About", "Business", "Socials", "EventInquiries", "GeneralInquiries"
  ],
  endpoints: (builder) => ({
    // =================== TESTIMONIALS CRUD ===================
    getTestimonials: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/testimonals/getTestimonials?page=${page}&limit=${limit}`,
      }),
      providesTags: ["Testimonials"],
    }),
    addTestimonial: builder.mutation<any, { customerName: string; review: string; customerImage?: string; occasion?: string; stars: number }>({
      query: (body) => ({ 
        url: "/testimonals/add-testimonial", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["Testimonials"],
    }),
    editTestimonial: builder.mutation<any, { id: string; data: Partial<{ customerName: string; review: string; customerImage: string; occasion: string; stars: number }> }>({
      query: ({ id, data }) => ({ 
        url: `/testimonals/edit-testimonial/${id}`, 
        method: "PATCH", 
        body: data 
      }),
      invalidatesTags: ["Testimonials"],
    }),
    deleteTestimonial: builder.mutation<any, string>({
      query: (id) => ({ 
        url: `/testimonals/delete-testimonial/${id}`, 
        method: "DELETE" 
      }),
      invalidatesTags: ["Testimonials"],
    }),

    // =================== IMAGE UPLOAD ===================
    uploadSingleImage: builder.mutation<{ result: { success: boolean; message: number; data: { key: string; size: number; mimetype: string } } }, File>({
      query: (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        return { 
          url: "/upload/single-image", 
          method: "POST", 
          body: formData 
        };
      },
      invalidatesTags: ["Upload"],
    }),
    uploadMultipleImages: builder.mutation<{ result: { success: boolean; message: number; data: Array<{ key: string; size: number; mimetype: string }> } }, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        return { 
          url: "/upload/multiple-images", 
          method: "POST", 
          body: formData 
        };
      },
      invalidatesTags: ["Upload"],
    }),

    // =================== SERVING IDEAS CRUD ===================
    getServingIdeas: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/servingIdeas/getServingIdeas?page=${page}&limit=${limit}`,
      }),
      providesTags: ["ServingIdeas"],
    }),
    addServingIdea: builder.mutation<any, { title: string; description: string; occasionType: string; image?: string }>({
      query: (body) => ({ 
        url: "/servingIdeas/add-servingIdea", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["ServingIdeas"],
    }),
    editServingIdea: builder.mutation<any, { id: string; data: Partial<{ title: string; description: string; occasionType: string; image?: string }> }>({
      query: ({ id, data }) => ({ 
        url: `/servingIdeas/edit-servingIdea/${id}`, 
        method: "PATCH", 
        body: data 
      }),
      invalidatesTags: ["ServingIdeas"],
    }),
    deleteServingIdea: builder.mutation<any, string>({
      query: (id) => ({ 
        url: `/servingIdeas/delete-servingIdea/${id}`, 
        method: "DELETE" 
      }),
      invalidatesTags: ["ServingIdeas"],
    }),

    // =================== DESSERTS CRUD ===================
    getDesserts: builder.query<any, { search?: string; isPopular?: boolean; isActive?: boolean; isFeatured?: boolean; sortBy?: string; order?: "asc" | "desc"; page?: number; limit?: number }>({
      query: ({ search = "", isPopular, isActive, isFeatured, sortBy = "dessertName", order = "asc", page = 1, limit = 10 }) => {
        const params = new URLSearchParams({ 
          search, 
          sortBy, 
          order, 
          page: page.toString(), 
          limit: limit.toString() 
        });
        if (isPopular !== undefined) params.append("isPopular", isPopular ? "true" : "false");
        if (isActive !== undefined) params.append("isActive", isActive ? "true" : "false");
        if (isFeatured !== undefined) params.append("isFeatured", isFeatured ? "true" : "true");
        return {
          url: `/desserts/getDessert?${params.toString()}`,
        };
      },
      providesTags: ["Desserts"],
    }),
    addDessert: builder.mutation<any, {
      dessertName: string;
      priceSingle: number|null;
      priceDouble: number|null;
      priceParty: number|null;
      discountPercentage: number;
      description: string;
      dessertImages: string[];
      prepTime: string;
      serves: string;
      category: string;
      allergens: string[];
      ingredients: string[];
      tags: string[];
      isFeatured?: boolean;
      isPopular?: boolean;
      isActive?: boolean;
    }>({
      query: (body) => ({ 
        url: "/desserts/add-dessert", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["Desserts"],
    }),
    editDessert: builder.mutation<any, { id: string; data: Partial<{ dessertName: string; priceSingle: number; priceDouble: number; priceParty: number; discountPercentage: number; description: string; dessertImages: string[]; prepTime: string; serves: string; category: string; allergens: string[]; ingredients: string[]; tags: string[]; isFeatured?: boolean; isPopular?: boolean; isActive?: boolean }> }>({
      query: ({ id, data }) => ({ 
        url: `/desserts/edit-dessert/${id}`, 
        method: "PATCH", 
        body: data 
      }),
      invalidatesTags: ["Desserts"],
    }),
    deleteDessert: builder.mutation<any, string>({
      query: (id) => ({ 
        url: `/desserts/delete-dessert/${id}`, 
        method: "DELETE" 
      }),
      invalidatesTags: ["Desserts"],
    }),

    // =================== HERO ===================
    getHero: builder.query<any, void>({
      query: () => "/hero/hero",
      providesTags: ["Hero"],
    }),
    editHero: builder.mutation<
      any,
      {
        title: string;
        subtitle: string;
        backgroundImage: string;
        ctaText: string;
        description: string;
        todaysSpecial: string[];
      }
    >({
      query: (body) => ({
        url: "/hero/edit-hero",
        method: "POST",
        body
      }),
      invalidatesTags: ["Hero"],
    }),

    // =================== ABOUT ===================
    getAbout: builder.query<any, void>({
      query: () => "/about/getAbout",
      providesTags: ["About"],
    }),
    editAbout: builder.mutation<any, {
      chefName: string;
      chefStory: string;
      professionalTitle: string;
      chefPhoto: string;
      certification: string;
      experience: string;
    }>({
      query: (body) => ({ 
        url: "/about/edit-about", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["About"],
    }),

    // =================== BUSINESS INFO ===================
    getBusinessInfo: builder.query<any, void>({
      query: () => "/siteSetting/getBusinessInfo",
      providesTags: ["Business"],
    }),
    editBusinessInfo: builder.mutation<
      any,
      {
        businessName: string;
        businessAddress: string;
        number: string;
        email: string;
        deliveryInformation: string;
        businessHoursMondayFriday?: string;
        businessHoursSaturday?: string;
        businessHoursSunday?: string;
      }
    >({
      query: (body) => ({
        url: "/siteSetting/edit-BusinessInfo",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Business"],
    }),

    // =================== SOCIALS ===================
    getSocials: builder.query<any, void>({
      query: () => "/siteSetting/getSocial",
      providesTags: ["Socials"],
    }),
    editSocials: builder.mutation<any, {
      facebook?: string;
      instagram?: string;
      whatsapp?: string;
      twitter?: string;
      linkedIn?: string;
      youTube?: string;
    }>({
      query: (body) => ({ 
        url: "/siteSetting/edit-socials", 
        method: "POST", 
        body 
      }),
      invalidatesTags: ["Socials"],
    }),

    // =================== INQUIRIES ===================
    getEventInquiries: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 4 }) => ({
        url: `/inquiries/getInquiries?page=${page}&limit=${limit}`,
      }),
      providesTags: ["EventInquiries"],
    }),

    getGeneralInquiries: builder.query<
      any,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 4 }) => ({
        url: `/inquiries/getQueries?page=${page}&limit=${limit}`,
      }),
      providesTags: ["GeneralInquiries"],
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
  useGetHeroQuery,
  useEditHeroMutation,
  useGetAboutQuery,
  useEditAboutMutation,
  useGetBusinessInfoQuery,
  useEditBusinessInfoMutation,
  useGetSocialsQuery,
  useEditSocialsMutation,
  useGetEventInquiriesQuery,
  useGetGeneralInquiriesQuery,
} = cmsApi;