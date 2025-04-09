import * as Slot from '@rn-primitives/slot';
import type { SlottableViewProps } from '@rn-primitives/types';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';
import { cn } from '~/app/lib/utils';
import { TextClassContext } from './text';

const badgeVariants = cva(
  'web:inline-flex items-center rounded-full border px-2.5 py-0.5 web:transition-colors web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-white web:hover:opacity-80 active:opacity-80',
        secondary: 'border-transparent bg-accent text-white web:hover:opacity-80 active:opacity-80',
        destructive: 'border-transparent bg-error text-white web:hover:opacity-80 active:opacity-80',
        outline: 'border-gray-200 text-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-white',
      secondary: 'text-white',
      destructive: 'text-white',
      outline: 'text-gray-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = SlottableViewProps & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };