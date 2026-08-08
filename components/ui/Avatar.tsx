// components/ui/Avatar.tsx
"use client";

import Image from "next/image";

interface AvatarProps {
  name: string;
  image?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export const Avatar = ({
  name,
  image,
  size = "md",
  className = "",
  onClick,
}: AvatarProps) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const sizeNumbers = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = [
    "bg-primary-500",
    "bg-success",
    "bg-warning",
    "bg-error",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-teal-500",
  ];

  const getColor = (name: string) => {
    if (!name) return colors[0];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-medium text-white
        ${sizes[size]}
        ${image ? "" : getColor(name)}
        ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={sizeNumbers[size]}
          height={sizeNumbers[size]}
          className="rounded-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};
