"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({ label, required, error, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-600">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full bg-cyber-purple/20 border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-colors font-mono text-sm",
        error
          ? "border-red-500/60 focus:border-red-500"
          : "border-cyber-glass-border focus:border-cyber-neon/60",
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full bg-cyber-purple/20 border rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-colors font-mono text-sm resize-none",
        error
          ? "border-red-500/60 focus:border-red-500"
          : "border-cyber-glass-border focus:border-cyber-neon/60",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full bg-cyber-purple/20 border border-cyber-glass-border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyber-neon/60 transition-colors font-mono text-sm cursor-pointer",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-cyber-dark">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200",
          checked ? "bg-cyber-neon" : "bg-gray-700"
        )}
      >
        <div
          className={cn(
            "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </div>
      {label && <span className="text-sm text-gray-300">{label}</span>}
    </label>
  );
}

export function ImageField({
  value,
  onChange,
  label = "Изображение",
  placeholder = "https://... или оставь пустым",
}: {
  value?: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const isImage = (value ?? "").startsWith("data:") || (value ?? "").startsWith("http");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex gap-2">
        <Input
          value={isImage ? "" : (value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isImage ? "Файл загружен" : placeholder}
          readOnly={isImage}
          className={isImage ? "opacity-50 cursor-not-allowed" : ""}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-shrink-0 px-3 py-2 bg-cyber-purple/40 border border-cyber-glass-border rounded-xl text-gray-300 hover:text-white hover:border-cyber-neon/50 text-xs font-mono transition-all whitespace-nowrap"
        >
          📁 Файл
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon" onChange={handleFile} className="hidden" />
      </div>
      {value && (
        <div className="flex items-center gap-3">
          {isImage ? (
            <img src={value} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-cyber-glass-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-16 h-16 bg-cyber-purple/30 rounded-lg border border-cyber-glass-border flex items-center justify-center text-3xl">{value}</div>
          )}
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
        </div>
      )}
    </div>
  );
}

export function SaveButton({
  loading,
  label = "Сохранить",
}: {
  loading?: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyber-purple-bright to-cyber-neon text-white font-semibold rounded-xl hover:shadow-neon transition-all disabled:opacity-60"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {label}
    </button>
  );
}
