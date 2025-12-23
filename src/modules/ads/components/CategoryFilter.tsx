"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Category } from "@/types/ads.types";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  categories: Category[];
}

export function CategoryFilter({
  onCategoryChange,
  categories,
}: CategoryFilterProps) {
  return (
    <div className="w-full max-w-[200px]">
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name ?? ""}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
