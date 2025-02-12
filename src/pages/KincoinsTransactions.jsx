export default function KincoinsTransactions() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[32px] font-bold text-primary text-center">
        Start Transactions
      </div>
      <div className="max-w-[400px]">
        <img src="/kincoins/empty-transactions.svg" className="w-full h-full" />
      </div>
      <div>
        <p className="text-[20px] font-medium text-center">
          Ready to make a transaction?
        </p>
        <p className="text-[20px] font-medium text-center">
          Redeem your Kincoins now!
        </p>
      </div>
    </div>
  );
}
