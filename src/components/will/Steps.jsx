import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { Link } from "react-router";

export function Steps({ steps, currentStep, willId }) {
  return (
    <div className="relative w-full">
      <div className="relative flex justify-between gap-1">
        {steps.map((step, index) => {
          const isComplete =
            steps.findIndex((s) => s.id === currentStep) > index;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <Link
                // to={`/will/create/${willId}/${step.id}`}
                className={cn(
                  "relative z-10 flex items-center justify-center w-6 h-6 rounded-full",
                  "cursor-auto",
                  "border-2 transition-colors duration-200",
                  isComplete
                    ? "bg-primary border-primary"
                    : isCurrent
                    ? "bg-white border-primary"
                    : "bg-white border-gray-300"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <Circle
                    className={cn(
                      "w-4 h-4",
                      isCurrent ? "text-primary" : "text-gray-300"
                    )}
                  />
                )}
              </Link>
              {/* Add connecting line if not the last step */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-3 left-[calc(50%+12px)] right-[calc(50%-12px)] h-0.5",
                    isComplete ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
              <span
                className={cn(
                  "mt-2 text-sm font-medium",
                  isCurrent ? "text-primary" : "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
