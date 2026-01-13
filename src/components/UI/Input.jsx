import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white',
        'placeholder:text-white/40',
        'focus:outline-none focus:ring-2 focus:ring-accent-pink/50 focus:border-accent-pink/50',
        'transition-all duration-200',
        className
      )}
      {...props}
    />
  );
}



