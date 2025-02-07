import { NavLink, useLocation } from "react-router";
import { mainNavLinks } from "../constants/navLinks";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";

export default function SecondaryNavigation() {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <Card className="w-full max-w-sm mx-auto shadow-sm border-0 rounded-2xl overflow-hidden">
      <div className="flex flex-col gap-2 p-4">
        {mainNavLinks.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={`flex items-center gap-4 h-12 font-medium pl-4 rounded-xl text-base ${
              location?.pathname.includes(path)
                ? "bg-brandPrimary text-white hover:bg-brandPrimary"
                : "hover:bg-primary/90 hover:text-white"
            } `}
          >
            <img src={icon} className="h-6 w-6" />
            {/* {icon && <icon className="stroke-black" />} */}
            <span className="text-sm">{t(label)}</span>
          </NavLink>
        ))}
      </div>
    </Card>
  );
}
