/**
 * Form Input Components
 * 
 * Styled form inputs for the letter writing form.
 */

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

// Base styles shared across inputs
const baseInputStyles = `
  w-full px-4 py-3 rounded-xl
  bg-white/10 border border-white/20
  text-snow-cream placeholder-snow-cream/40
  focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50
  transition-all duration-200
  font-body
`

// Input Component
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-snow-cream/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseInputStyles, error && 'border-santa-red/50', className)}
          {...props}
        />
        {error && <p className="text-sm text-santa-red-light">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Textarea Component
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-snow-cream/80">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(baseInputStyles, 'min-h-[120px] resize-y', error && 'border-santa-red/50', className)}
          {...props}
        />
        {error && <p className="text-sm text-santa-red-light">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// Select Component
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-snow-cream/80">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(baseInputStyles, 'cursor-pointer', error && 'border-santa-red/50', className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-midnight text-snow-cream">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-santa-red-light">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

// File Input Component
export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-snow-cream/80">
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative rounded-xl border-2 border-dashed border-white/20 p-6 text-center',
            'hover:border-gold/50 transition-colors cursor-pointer',
            error && 'border-santa-red/50',
            className
          )}
        >
          <input
            ref={ref}
            id={inputId}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            {...props}
          />
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-10 h-10 text-snow-cream/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-snow-cream/60 text-sm">
              Click to upload or drag and drop
            </p>
            {helperText && (
              <p className="text-snow-cream/40 text-xs">{helperText}</p>
            )}
          </div>
        </div>
        {error && <p className="text-sm text-santa-red-light">{error}</p>}
      </div>
    )
  }
)
FileInput.displayName = 'FileInput'

// Form Section Component
export interface FormSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="font-display text-xl font-semibold text-snow-cream mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-snow-cream/60 text-sm">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
