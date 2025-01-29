import { Input } from "../ui/input";

export function StepOne({ register, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Input
          {...register("first_name")}
          placeholder="First Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.first_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.first_name.message}
          </span>
        )}
      </div>

      <div>
        <Input
          {...register("middle_name")}
          placeholder="Middle Name (Optional)"
          className="md:h-[56px] rounded-full"
        />
        {errors.middle_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.middle_name.message}
          </span>
        )}
      </div>

      <div>
        <Input
          {...register("last_name")}
          placeholder="Last Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.last_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.last_name.message}
          </span>
        )}
      </div>
    </div>
  );
}
