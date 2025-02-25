import { kintreeApi } from "../services/kintreeApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const QUERY_KEYS = {
  KINCOINS_TRANSACTIONS: "kincoins-transactions",
  KINCOIN_TRANSACTION: "kincoin-transaction",
};

export const fetchTransactions = async ({ pageParam = 1, limit = 12 }) => {
  try {
    const response = await kintreeApi.get(`/kin-coins/transactions`, {
      params: {
        limit,
        page: pageParam,
      },
    });

    return {
      data: {
        transactions: response.data.data.transactions,
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total_record: response.data.data.total_record,
        filtered_record: response.data.data.filtered_record,
      },
      success: response.data.success,
      message: response.data.message,
      status_code: response.data.status_code,
      pageParam,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchTransaction = async (transactionId) => {
  try {
    const response = await kintreeApi.get(
      `/kin-coins/transactions/${transactionId}`
    );
    return response.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const redeemKincoins = async ({ coins, amount }) => {
  try {
    const response = await kintreeApi.post("/kin-coins/redeem", {
      coins,
      amount,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const useKincoinsTransactions = (limit = 12) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.KINCOINS_TRANSACTIONS, limit],
    queryFn: ({ pageParam = 1 }) => fetchTransactions({ pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.transactions || !lastPage.success) {
        return undefined;
      }
      return lastPage.data.current_page < lastPage.data.last_page
        ? lastPage.data.current_page + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000, // Refresh every minute
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch transactions. Please try again later.");
    },
  });
};

export const useKincoinTransaction = (transactionId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.KINCOIN_TRANSACTION, transactionId],
    queryFn: () => fetchTransaction(transactionId),
    enabled: Boolean(transactionId),
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      toast.error("Failed to fetch transaction details.");
    },
  });
};

export const useRedeemKincoins = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: redeemKincoins,
    onSuccess: (data) => {
      toast.success("Kincoins redeemed successfully!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KINCOINS_TRANSACTIONS],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to redeem Kincoins. Please try again."
      );
    },
  });
};

const handleApiError = (error) => {
  const message = error.response?.data?.message || "Something went wrong";
  toast.error(message);
  return Promise.reject(error);
};
