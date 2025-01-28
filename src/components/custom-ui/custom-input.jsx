import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function CustomInput({ children, ...props }) {
  return (
    <div className="relative flex items-center">
      <div className="absolute left-4">{props.icon}</div>
      <Input
        {...props}
        className={cn(
          "rounded-full bg-background",
          props.icon && "pl-10",
          props.className
        )}
      />
      {children}
    </div>
  );
}
