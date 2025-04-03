// // Simplified version for this example
// import { toast as sonnerToast } from "sonner"

// type ToastProps = {
//   title: string
//   description?: string
// }

// export function useToast({ title, description }: ToastProps) {
//   sonnerToast(title, {
//     description: description,
//   })
// }


"use client"

// Simplified version for this example
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title: string
  description?: string
}

// Option 1: Keep it as a function, not a hook
export function toast({ title, description }: ToastProps) {
  sonnerToast(title, {
    description: description,
  })
}

// Option 2: Make it a proper hook that returns the toast function
export function useToast() {
  return {
    toast: ({ title, description }: ToastProps) => {
      sonnerToast(title, {
        description: description,
      })
    },
  }
}

