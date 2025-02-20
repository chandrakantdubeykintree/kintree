import { useTranslation } from "react-i18next";

export default function KincoinsTransactions() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[32px] font-bold text-primary text-center">
        {t("start_transactions")}
      </div>
      <div className="max-w-[400px]">
        <img
          src="/kincoins/empty-transactions.svg"
          className="w-full h-full"
          alt={t("empty_transactions_image")}
        />
      </div>
      <div>
        <p className="text-[20px] font-medium text-center">
          {t("ready_to_transaction")}
        </p>
        <p className="text-[20px] font-medium text-center">
          {t("redeem_kincoins_now")}
        </p>
      </div>
    </div>
  );
}
