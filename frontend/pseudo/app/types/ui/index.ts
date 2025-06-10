import type { Pressable } from 'react-native';
import type { VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';

// Button Types
export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable>, VariantProps<any> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

// Badge Types
export interface BadgeProps extends VariantProps<any> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

// Select Types
export interface Option {
  label: string;
  value: string;
}

// Sort Types
export type SortOption = "nameAsc" | "nameDesc" | "difficultyAsc" | "difficultyDesc";

// Icon Types
export interface IconProps {
  className?: string;
  icon: LucideIcon;
} 