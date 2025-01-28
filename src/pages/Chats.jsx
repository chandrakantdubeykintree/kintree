import { Card } from "@/components/ui/card";

export default function Chats() {
  return (
    <Card className="bg-background rounded-2xl h-full">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src="/illustrations/illustrations_cs.png"
          className="object-cover rounded-lg"
        />
      </div>
    </Card>
  );
}
