import { Input } from "../ui/input";

export function StepSix({ register, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Input
          {...register("mother_first_name")}
          placeholder="Mother's First Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.mother_first_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.mother_first_name.message}
          </span>
        )}
      </div>

      <div>
        <Input
          {...register("mother_last_name")}
          placeholder="Mother's Last Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.mother_last_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.mother_last_name.message}
          </span>
        )}
      </div>

      <div>
        <Input
          {...register("grand_father_name")}
          placeholder="Grandfather's Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.grand_father_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.grand_father_name.message}
          </span>
        )}
      </div>
    </div>
  );
}
