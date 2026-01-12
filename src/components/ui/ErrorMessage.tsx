/**
 * ErrorMessage Component
 * Display error states to users with accessibility support
 */

import { Button } from './Button';

export interface ErrorMessageProps {
  title: string;
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ title, message, retry }: ErrorMessageProps) {
  return (
    <div
      className="bg-error-50 border border-error-200 rounded-lg p-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-error-600" aria-hidden="true">
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-error-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-error-700">{message}</p>
        </div>
      </div>

      {retry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={retry}
          className="mt-4"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
