import AsyncComponent from "@/components/async-component";
import { Card } from "@/components/ui/card";
import { route_foreroom } from "@/constants/routeEnpoints";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function CreateReciepe() {
  const { t } = useTranslation();
  return (
    <AsyncComponent>
      <div className="w-full mx-auto lg:px-0 pb-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <NavLink
            to={route_foreroom}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span className="h-8 w-8 rounded-full hover:bg-sky-100 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            {t("back_to_foreroom")}
          </NavLink>
        </div>
        <Card className="w-full">Create Reciepe</Card>
      </div>
    </AsyncComponent>
  );
}
