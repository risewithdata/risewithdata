import React from 'react';
import { FieldValues, UseFormRegisterReturn } from 'react-hook-form';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };

export function FormInput({ label, error, ...rest }: Props) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        {...rest}
        className={`w-full px-3 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
