import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function EarnKincoins() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img src="/kincoins/add-member.png" className="h-10 w-[40px]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">Add a Family Member</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                Earn up to 1000 Kincoins!
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/familytree")}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img src="/kincoins/post.png" className="h-10 w-[40px]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">Post on Foreroom</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                Get up to 50 Kincoins daily!
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/foreroom")}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img src="/kincoins/refer.png" className="h-10 w-[40px]" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">Refer a Friend</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                Get up to 5000 Kincoins every day!
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/profile")}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0">
        <CardContent className="border-0 rounded-2xl p-4 flex items-center justify-between gap-4 bg-[#f8fafc] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-background">
              <img
                src="/kincoins/complete-profile.png"
                className="h-10 w-[40px]"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">Complete your profile</h2>
              <p className="text-sm font-medium text-[#8A8A8A]">
                Get up to 2000 Kincoins !
              </p>
            </div>
          </div>
          <div className="justify-self-end">
            <Button
              className="rounded-full px-8"
              onClick={() => navigate("/profile")}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
