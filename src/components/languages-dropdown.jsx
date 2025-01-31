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
import { LANGUAGE_METADATA, LANGUAGES } from "@/constants/languages";

export default function LanguagesDropDown() {
  const { language, setLanguage } = useThemeLanguage();

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
  };

  const languagesList = Object.entries(LANGUAGES)?.map(([code, nativeName]) => (
    <DropdownMenuItem
      key={code}
      className="cursor-pointer"
      onClick={() => handleLanguageChange(code)}
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-medium">{nativeName}</span>
            <span className="text-xs text-muted-foreground">
              {LANGUAGE_METADATA[code].name}
            </span>
          </div>
          {language === code && <span className="ml-2">✓</span>}
        </div>
      </div>
    </DropdownMenuItem>
  ));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={ICON_LANGUAGES}
          className="w-6 h-6 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-125"
          alt="Change Language"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="bottom">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          <DropdownMenuGroup>{languagesList}</DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
