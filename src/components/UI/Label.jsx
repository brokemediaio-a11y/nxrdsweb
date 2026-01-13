import { cn } from '../../lib/utils';

export function Label({ className, htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium text-white/90',
        className
      )}
      {...props}
    />
  );
}



