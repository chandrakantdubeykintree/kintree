import { useState, useRef, useEffect } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import AsyncComponent from "./async-component";
import { useTranslation } from "react-i18next";

export function LocationSearchInput({
  name,
  value,
  onChange,
  onBlur,
  className,
  placeholder = "Search location...",
  error,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const { suggestions, isLoading, clearSuggestions } = useLocation(value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(value);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.description);
    setIsFocused(false);
    clearSuggestions();
  };

  return (
    <AsyncComponent>
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            name={name}
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={onBlur}
            placeholder={t("search_location")}
            className={cn("pl-10", error && "border-red-500", className)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : (
              <Search className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

        {isFocused && suggestions?.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">
                    {suggestion.structured_formatting?.main_text ||
                      suggestion.description}
                  </div>
                  {suggestion.structured_formatting?.secondary_text && (
                    <div className="text-xs text-gray-500">
                      {suggestion.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AsyncComponent>
  );
}
