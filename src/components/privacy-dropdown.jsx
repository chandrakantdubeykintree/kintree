import { PRIVACYDROPDOWN } from "@/constants/dropDownConstants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { capitalizeName } from "@/utils/stringFormat";

export default function PrivacyDropdown({
  selectedPrivacy,
  setSelectedPrivacy,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-2 items-center cursor-pointer px-3 py-2 border border-primary rounded-full">
          {selectedPrivacy ? (
            <>
              <div className="w-4 h-4 flex items-center justify-center">
                <img src={selectedPrivacy.icon} alt={selectedPrivacy.title} />
              </div>
              <span>{capitalizeName(selectedPrivacy.title)}</span>
            </>
          ) : (
            "Privacy"
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Who can see this post?</DropdownMenuLabel>
        <p className="py-1 px-2">
          Your default audience is set to Public, but you can change the
          audience of this specific post.
        </p>
        <ul className="flex flex-col gap-2">
          {PRIVACYDROPDOWN.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => setSelectedPrivacy(item)}
            >
              <a className="flex gap-4">
                <div className="w-5 h-5 flex items-center justify-center">
                  <img src={item.icon} alt={item.title} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs">{item.desc}</p>
                </div>
              </a>
            </DropdownMenuItem>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
