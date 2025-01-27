import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICON_LANGUAGES } from "@/constants/iconUrls";
import { useThemeLanguage } from "@/context/ThemeLanguageProvider";
import { LANGUAGES } from "@/constants/languages";

export default function LanguagesDropDown() {
  const { language, setLanguage } = useThemeLanguage();

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
  };

  const languagesList =
    Object.entries(LANGUAGES)?.length > 0 ? (
      Object.entries(LANGUAGES)?.map(([code, name]) => (
        <DropdownMenuItem
          key={code}
          className="cursor-pointer"
          onClick={() => handleLanguageChange(code)}
        >
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <div>{name}</div>
              <div>{code}</div>
            </div>
          </div>
          {language === code && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      ))
    ) : (
      <DropdownMenuItem>
        <div className="flex flex-col h-11">
          <div className="flex justify-between">
            <span>Only English is available now</span>
          </div>
        </div>
      </DropdownMenuItem>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={ICON_LANGUAGES}
          className="w-6 h-6 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-125"
          alt="Change Language"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Languages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>{languagesList}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
