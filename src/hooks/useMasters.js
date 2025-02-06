import { kintreeApi } from "@/services/kintreeApi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const QUERY_KEYS = {
  FEELINGS: "feelings",
  EVENT_CATEGORIES: "eventCategories",
  PRESET_PROFILE_IMAGES: "presetProfileImages",
  RELIGIONS: "religions",
  RELIGIONS_ALL_IN_ONE: "religionsAllInOne",
  CASTES: "castes",
  GOTRAS: "gotras",
  SECTS: "sects",
  RELATIONSHIP_TYPES: "relationshipTypes",
  OCCUPATIONS: "occupations",
  REACTION_TYPES: "reactionTypes",
  BLOOD_GROUPS: "bloodGroups",
  EDUCATION_TYPES: "educationTypes",
  INTERESTS: "interests",
  COUNTRIES: "countries",
  LANGUAGES: "languages",
  AGE_RANGES: "ageRanges",
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
  return Promise.reject(error);
};

export const fetchFeelings = async () => {
  const response = await kintreeApi.get("/feelings");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchEventCategories = async () => {
  const response = await kintreeApi.get("/event-categories");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchPresetProfileImages = async (gender) => {
  const response = await kintreeApi.get("/preset-profile-images", {
    params: { gender },
  });
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchReligions = async () => {
  const response = await kintreeApi.get("/religions");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchReligionsAllInOne = async () => {
  const response = await kintreeApi.get("/religions-all-in-one");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchCastes = async (religionId) => {
  const response = await kintreeApi.get(`/religions/${religionId}/castes`);
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchGotras = async (religionId) => {
  const response = await kintreeApi.get(`/religions/${religionId}/gotras`);
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchSects = async (religionId) => {
  const response = await kintreeApi.get(`/religions/${religionId}/sects`);
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchRelationshipTypes = async () => {
  const response = await kintreeApi.get("/relationship-types");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchOccupations = async () => {
  const response = await kintreeApi.get("/occupations");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchReactionTypes = async () => {
  const response = await kintreeApi.get("/reaction-types");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchBloodGroups = async () => {
  const response = await kintreeApi.get("/blood-groups");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchEducationTypes = async () => {
  const response = await kintreeApi.get("/education-types");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchInterests = async () => {
  const response = await kintreeApi.get("/interests");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchCountries = async () => {
  const response = await kintreeApi.get("/countries");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchLanguages = async () => {
  const response = await kintreeApi.get("/languages");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const fetchAgeRanges = async () => {
  const response = await kintreeApi.get("/age-ranges");
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const useFeelings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEELINGS],
    queryFn: fetchFeelings,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch feelings");
    },
  });
};

export const fetchSubCastes = async (religionId, casteId) => {
  const response = await kintreeApi.get(`/religions/${religionId}/castes`, {
    params: { caste_id: casteId },
  });
  if (!response.data.success) return handleApiError(response);
  return response.data.data;
};

export const useEventCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT_CATEGORIES],
    queryFn: fetchEventCategories,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch event categories");
    },
  });
};

export const usePresetProfileImages = (gender) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRESET_PROFILE_IMAGES, gender],
    queryFn: () => fetchPresetProfileImages(gender),
    enabled: Boolean(gender),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch profile images");
    },
  });
};

export const useReligions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RELIGIONS],
    queryFn: fetchReligions,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch religions");
    },
  });
};

export const useReligionsAllInOne = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RELIGIONS_ALL_IN_ONE],
    queryFn: fetchReligionsAllInOne,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch religions data");
    },
  });
};

export const useCastes = (religionId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CASTES, religionId],
    queryFn: () => fetchCastes(religionId),
    enabled: Boolean(religionId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch castes");
    },
  });
};

export const useGotras = (religionId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GOTRAS, religionId],
    queryFn: () => fetchGotras(religionId),
    enabled: Boolean(religionId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch gotras");
    },
  });
};

export const useSects = (religionId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SECTS, religionId],
    queryFn: () => fetchSects(religionId),
    enabled: Boolean(religionId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch sects");
    },
  });
};

export const useRelationshipTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RELATIONSHIP_TYPES],
    queryFn: fetchRelationshipTypes,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch relationship types");
    },
  });
};

export const useOccupations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.OCCUPATIONS],
    queryFn: fetchOccupations,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch occupations");
    },
  });
};

export const useReactionTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.REACTION_TYPES],
    queryFn: fetchReactionTypes,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch reaction types");
    },
  });
};

export const useBloodGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BLOOD_GROUPS],
    queryFn: fetchBloodGroups,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch blood groups");
    },
  });
};

export const useEducationTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EDUCATION_TYPES],
    queryFn: fetchEducationTypes,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch education types");
    },
  });
};

export const useInterests = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.INTERESTS],
    queryFn: fetchInterests,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch interests");
    },
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUNTRIES],
    queryFn: fetchCountries,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch countries");
    },
  });
};

export const useLanguages = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LANGUAGES],
    queryFn: fetchLanguages,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch languages");
    },
  });
};

export const useAgeRanges = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AGE_RANGES],
    queryFn: fetchAgeRanges,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch age ranges");
    },
  });
};

export const useSubCastes = (religionId, casteId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CASTES, religionId, casteId],
    queryFn: () => fetchSubCastes(religionId, casteId),
    enabled: Boolean(religionId && casteId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch sub-castes");
    },
  });
};
