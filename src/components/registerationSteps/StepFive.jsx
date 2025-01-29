import { Input } from "../ui/input";

export function StepFive({ register, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Input
          {...register("father_first_name")}
          placeholder="Father's First Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.father_first_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.father_first_name.message}
          </span>
        )}
      </div>

      <div>
        <Input
          {...register("father_last_name")}
          placeholder="Father's Last Name"
          className="md:h-[56px] rounded-full"
        />
        {errors.father_last_name && (
          <span className="text-sm text-red-500 mt-1 ml-4">
            {errors.father_last_name.message}
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
