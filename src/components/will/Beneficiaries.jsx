import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddBeneficiaryForm from "./AddBenificiaryForm";
import BeneficiaryCard from "./BeneficiaryCard";
import ComponentLoading from "../component-loading";
import AddFamilyMemberDialog from "./AddFamilyMemberDialog";
import { Input } from "../ui/input";
import { useFamilyMembers } from "@/hooks/useFamily";

export default function Beneficiaries({ setStep, willId }) {
  const [activeTab, setActiveTab] = useState("family");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: familyMembers } = useFamilyMembers();
  const [isAddFamilyMemberDialogOpen, setIsAddFamilyMemberDialogOpen] =
    useState(false);
  const [isAddNonRelativeDialogOpen, setIsAddNonRelativeDialogOpen] =
    useState(false);
  const { getBeneficiariesQuery, isSavingAllocations } = useWill();

  const [filteredFamilyMembers, setFilteredFamilyMembers] = useState([]);

  const { data: beneficiariesData, isLoading } = getBeneficiariesQuery(willId);
  const memberBeneficiariesCount = beneficiariesData?.data?.filter(
    (item) => item.member_id
  );
  const nonMemberBeneficiariesCount = beneficiariesData?.data?.filter(
    (item) => !item.member_id
  );
  const beneficiaries = useMemo(
    () => beneficiariesData?.data || [],
    [beneficiariesData]
  );
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);

  useEffect(() => {
    setFilteredBeneficiaries(
      beneficiaries.filter((item) =>
        activeTab === "family" ? item.member_id : !item.member_id
      )
    );
  }, [activeTab, beneficiaries]);

  const handleSaveAndContinue = async () => {
    setStep("allocation");
  };

  useEffect(() => {
    if (searchQuery !== "" && familyMembers) {
      setFilteredFamilyMembers(
        familyMembers.filter((member) =>
          member.first_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredFamilyMembers(familyMembers);
    }
  }, [searchQuery, familyMembers]);

  if (isLoading) {
    return <ComponentLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-start gap-4">
        <h2 className="text-xl font-semibold">Beneficiaries</h2>
        <div className="flex flex-wrap justify-start gap-4">
          <Dialog
            open={isAddFamilyMemberDialogOpen}
            onOpenChange={setIsAddFamilyMemberDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-fit h-10 md:h-12 rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Beneficiary from family
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] w-[650px] rounded-lg max-h-[500px] overflow-y-scroll no_scrollbar">
              <DialogHeader className="space-y-4">
                <DialogTitle className="text-xl font-semibold">
                  Add beneficiaries from below family members
                </DialogTitle>
                <div className="flex items-center gap-4 border bg-gray-100 rounded-full pl-4">
                  <Search className="w-5 h-5" />
                  <Input
                    className="w-full border-none bg-transparent outline-0 ring-0 focus-visible:ring-0 placeholder:text-gray-500 rounded-r-full h-[48px]"
                    placeholder="Search family members"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </DialogHeader>
              <AddFamilyMemberDialog
                willId={willId}
                onSuccess={() => setIsAddFamilyMemberDialogOpen(false)}
                familyMembers={filteredFamilyMembers}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={isAddNonRelativeDialogOpen}
            onOpenChange={setIsAddNonRelativeDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                className="w-fit h-10 lg:h-12 px-4 lg:px-6 rounded-full border-primary"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add a non-relative
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] w-[650px] rounded-lg max-h-[90vh] h-[550px] overflow-y-scroll no_scrollbar">
              <DialogHeader>
                <DialogTitle>Add New Beneficiary</DialogTitle>
              </DialogHeader>
              <AddBeneficiaryForm
                willId={willId}
                onSuccess={() => setIsAddNonRelativeDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="w-full flex justify-start h-[54px] gap-2 border-b border-gray-200 relative">
        <div
          className={`text-sm flex items-center cursor-pointer hover:bg-gray-100 px-4 ${
            activeTab === "family"
              ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
              : ""
          }`}
          onClick={() => {
            setActiveTab("family");
          }}
        >
          Family ({memberBeneficiariesCount?.length})
        </div>
        <div
          className={`text-sm flex items-center cursor-pointer hover:bg-gray-100 px-4 ${
            activeTab === "non-relative"
              ? "font-bold text-brandPrimary border-b-2 border-brandPrimary"
              : ""
          }`}
          onClick={() => {
            setActiveTab("non-relative");
          }}
        >
          Non-relative ({nonMemberBeneficiariesCount?.length})
        </div>
      </div>

      {beneficiaries.length === 0 && activeTab === "family" ? (
        <div className="text-center py-8 text-gray-500">
          No beneficiaries added yet. Click the button above to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBeneficiaries.map((beneficiary) => (
            <BeneficiaryCard
              key={beneficiary.id}
              beneficiary={beneficiary}
              willId={willId}
              showPercentage={false}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => setStep("personal-info")}
          className="rounded-full h-10 md:h-12 px-4 lg:px-6"
        >
          Back
        </Button>
        <Button
          onClick={handleSaveAndContinue}
          disabled={isSavingAllocations || beneficiaries.length === 0}
          className="rounded-full h-10 md:h-12 px-4 lg:px-6"
        >
          {isSavingAllocations ? "Saving..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
