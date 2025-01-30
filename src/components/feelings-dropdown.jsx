import { FEELINGSDROPDOWN } from "@/constants/dropDownConstants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
import { capitalizeName } from "@/utils/stringFormat";

export default function FeelingsDropDown({
  selectedFeeling,
  setSelectedFeeling,
}) {
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {selectedFeeling ? (
            <Button
              variant="outline"
              className="flex gap-2 items-center rounded-full"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <img
                  src={selectedFeeling.image_url}
                  alt={selectedFeeling.name}
                  className="transform transition-transform duration-300 ease-in-out hover:scale-125"
                />
              </div>
              <span>{capitalizeName(selectedFeeling.name)}</span>
            </Button>
          ) : (
            <Button variant="outline" className="rounded-full">
              Add Feeling (Optional)
            </Button>
          )}
        </DropdownMenuTrigger>
        {selectedFeeling && (
          <X
            className="h-4 w-4 text-gray-500 hover:text-gray-700 absolute -right-6 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setSelectedFeeling(null)}
          />
        )}

        <DropdownMenuContent className="max-h-72 px-4 w-52 overflow-scroll no_scrollbar border rounded-lg py-4 p-5 flex flex-col gap-4 mt-2">
          <DropdownMenuLabel className="font-semibold text-sm py-2">
            How are you feeling about the post?
          </DropdownMenuLabel>
          <ul className="flex flex-col gap-4">
            {FEELINGSDROPDOWN.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setSelectedFeeling(item)}
                className={`rounded-lg cursor-pointer px-3 py-2 ${
                  selectedFeeling?.id === item.id
                    ? "bg-light-cta text-dark-text"
                    : "text-light-text"
                } `}
              >
                <a className="flex gap-4">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {capitalizeName(item.name)}
                    </h3>
                    <p className="text-xs">{item.desc}</p>
                  </div>
                </a>
              </DropdownMenuItem>
            ))}
          </ul>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSelectedFeeling(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-sm">Remove feeling</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
