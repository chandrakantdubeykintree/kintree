import AsyncComponent from "@/components/async-component";
import { Card } from "@/components/ui/card";
import { route_foreroom } from "@/constants/routeEnpoints";
import { decryptId } from "@/utils/encryption";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useParams } from "react-router";

// const { data, isLoading } = useRecipes();
// const { mutate: createRecipe } = useCreateRecipe();
// const { data: recipe } = useRecipe(recipeId);
// const { mutate: updateRecipe } = useEditRecipe();
// const { mutate: deleteRecipe } = useDeleteRecipe();
// const { data: comments } = useRecipeComments(recipeId);
// const { mutate: addComment } = useCreateRecipeComment();

export default function ViewRecipe() {
  const { t } = useTranslation();
  const { id: encryptedId } = useParams();
  const navigate = useNavigate();
  const id = decryptId(encryptedId);
  return (
    <AsyncComponent>
      <div className="w-full mx-auto lg:px-0 pb-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <NavLink
            to={route_foreroom}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span className="h-8 w-8 rounded-full hover:bg-sky-100 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
            {t("back_to_foreroom")}
          </NavLink>
        </div>
        <Card className="w-full">View Recipe</Card>
      </div>
    </AsyncComponent>
  );
}
