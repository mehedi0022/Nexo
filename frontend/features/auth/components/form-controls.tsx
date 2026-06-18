"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Field({ className, id, label, ...props }: FieldProps) {
  const fieldId = id ?? props.name

  return (
    <label className="grid gap-2 text-sm font-medium" htmlFor={fieldId}>
      {label}
      <input
        id={fieldId}
        className={cn(
          "h-10 rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20",
          className
        )}
        {...props}
      />
    </label>
  )
}

export function FormMessage({
  children,
  tone = "danger",
}: {
  children?: React.ReactNode
  tone?: "danger" | "success"
}) {
  if (!children) {
    return null
  }

  return (
    <p
      className={cn(
        "rounded-lg px-3 py-2 text-sm",
        tone === "success"
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "bg-destructive/10 text-destructive"
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      {children}
    </p>
  )
}
