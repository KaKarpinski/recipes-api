-- DropForeignKey
ALTER TABLE "public"."DishIngredient" DROP CONSTRAINT "DishIngredient_dishId_fkey";

-- AddForeignKey
ALTER TABLE "DishIngredient" ADD CONSTRAINT "DishIngredient_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
