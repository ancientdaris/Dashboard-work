'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  duration?: number;
}

export type ToastActionElement = React.ReactElement;

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', title, description, duration = 3000, open = true, onOpenChange, ...props }, ref) => {
    React.useEffect(() => {
      if (open && duration) {
        const timer = setTimeout(() => {
          onOpenChange?.(false);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [open, duration, onOpenChange]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed right-4 top-4 z-50 w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg',
          variant === 'destructive' && 'border-destructive bg-destructive text-destructive-foreground',
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {title && <h4 className="text-sm font-medium">{title}</h4>}
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>
          <button
            onClick={() => onOpenChange?.(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

type ToastOptions = Omit<ToastProps, 'open' | 'onOpenChange'>;

const ToastContext = React.createContext<{
  toast: (props: ToastOptions) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastOptions & { id: string }>>([]);

  const toast = React.useCallback((props: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);
    
    // Auto remove toast after duration
    if (props.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, props.duration || 5000);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col space-y-2">
        {toasts.map(({ id, ...props }) => (
          <Toast
            key={id}
            {...props}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((prev) => prev.filter((t) => t.id !== id));
              }
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export { Toast };
