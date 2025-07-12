import React from "react";
import { categories } from "utils/categories";

interface Props {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryList: React.FC<Props> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="border-r border-primary/20 pr-4">
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`cursor-pointer p-2 ${
              selectedCategory === category.id ? "bg-primary/10" : ""
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
