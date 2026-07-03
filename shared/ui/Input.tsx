'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** When false, only the error border is shown (no message below the field). */
  showErrorMessage?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, showErrorMessage = true, className = '', onKeyDown, ...props }, ref) {
    // Ensure pipe character (|) works in all input fields
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow pipe character (|) - key code 220 or Shift+Backslash
      if (e.key === '|' || e.keyCode === 220 || (e.shiftKey && e.key === '\\')) {
        // Allow the default behavior for pipe character
        return;
      }
      
      // Call original onKeyDown if provided
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-error focus:ring-error' : 'border-gray-300'
          } ${className}`}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {error && showErrorMessage ? (
          <p className="mt-1 text-sm text-error">{error}</p>
        ) : null}
      </div>
    );
  }
);

