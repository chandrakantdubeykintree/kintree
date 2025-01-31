import { RegisterForm } from "@/components/register-form";
import { useOutletContext } from "react-router";
export default function Register() {
  const { setOpenTerms } = useOutletContext();
  return <RegisterForm setOpenTerms={setOpenTerms} />;
}
