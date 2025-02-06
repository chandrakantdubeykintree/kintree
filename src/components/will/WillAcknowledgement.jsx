import { useState } from "react";
import { useNavigate } from "react-router";
import { useWill } from "@/hooks/useWill";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";

export default function WillAcknowledgement({ setStep }) {
  const navigate = useNavigate();
  const { createWill, isCreatingWill } = useWill();
  const [accepted, setAccepted] = useState({
    terms: false,
    sound: false,
    truthful: false,
    agree: false,
  });

  const allTermsAccepted = Object.values(accepted).every(Boolean);

  const handleCreateWill = async () => {
    if (!allTermsAccepted) {
      toast.error("Please accept all terms to continue");
      return;
    }

    try {
      const result = await createWill();
      if (result?.success && result?.data?.id) {
        setStep("personal-info");
      } else {
        toast.error("Failed to create will. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to create will. Please try again.");
    }
  };

  return (
    <div className="mx-auto p-6 flex flex-col gap-12">
      <h2 className="text-2xl font-bold text-center">
        Before You Begin to Create Your Will
      </h2>

      <ul className="list-decimal max-w-2xl mx-auto pl-5">
        <li className="text-gray-[#656565]">
          The Kintree Will is a testament to your wisdom and a gift to those you
          cherish the most.
        </li>
        <li className="text-gray-[#656565]">
          We assure you that your data is safe and secured with us, as your
          privacy is our priority.
        </li>
        <li className="text-gray-[#656565]">
          It is mandatory to fill in your personal details such as Name, Date of
          Birth, Address and contact details.
        </li>
        <li className="text-gray-[#656565]">
          You can distribute your assets among multiple beneficiaries.
        </li>
        <li className="text-gray-[#656565]">
          You may add as many beneficiaries as you like (beneficiaries need not
          necessarily be your family members).
        </li>
      </ul>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={accepted.terms}
            onCheckedChange={(checked) =>
              setAccepted((prev) => ({ ...prev, terms: checked }))
            }
          />
          <label htmlFor="terms" className="text-sm">
            I understand that this will is a legal document and will be used to
            distribute my assets after my death.
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="sound"
            checked={accepted.sound}
            onCheckedChange={(checked) =>
              setAccepted((prev) => ({ ...prev, sound: checked }))
            }
          />
          <label htmlFor="sound" className="text-sm">
            I confirm that I am of sound mind and making this will voluntarily
            without any undue influence or coercion.
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="truthful"
            checked={accepted.truthful}
            onCheckedChange={(checked) =>
              setAccepted((prev) => ({ ...prev, truthful: checked }))
            }
          />
          <label htmlFor="truthful" className="text-sm">
            I declare that all information provided in this will shall be
            truthful and accurate to the best of my knowledge.
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="agree"
            checked={accepted.agree}
            onCheckedChange={(checked) =>
              setAccepted((prev) => ({ ...prev, agree: checked }))
            }
          />
          <label htmlFor="agree" className="text-sm">
            I have read all the information mentioned above and I agree to make
            my Will.
          </label>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/will")}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateWill}
            disabled={!allTermsAccepted || isCreatingWill}
            className="rounded-full h-10 lg:h-12 px-4 lg:px-6"
          >
            {isCreatingWill ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
