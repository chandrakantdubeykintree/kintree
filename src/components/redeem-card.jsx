import { IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function RedeemCard({ data }) {
  return (
    <Card className="border-0 shadow-xl w-full rounded-2xl">
      <CardContent className="p-4 bg-brandLight rounded-2xl">
        <div className="w-full flex justify-center items-center">
          <img src={data.url} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-[#5E5F60] text-xs font-bold">{data.tag}</div>
          <div className="text-lg font-semibold line-clamp-1 text-ellipsis overflow-hidden">
            {data.name}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-primary font-medium text-[20px] flex  items-center">
              <IndianRupee className="text-primary h-[20px] p-0" />
              {data.price?.toLocaleString()}
            </div>
            <Button className="rounded-full">Redeem</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
