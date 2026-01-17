import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] sm:min-h-[100px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm sm:text-base text-white',
        'placeholder:text-white/40 placeholder:text-sm',
        'focus:outline-none focus:ring-2 focus:ring-accent-pink/50 focus:border-accent-pink/50',
        'transition-all duration-200 resize-none',
        className
      )}
      {...props}
    />
  );
}



