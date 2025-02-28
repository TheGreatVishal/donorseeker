// Simplified version for this example
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title: string
  description?: string
}

export function toast({ title, description }: ToastProps) {
  sonnerToast(title, {
    description: description,
  })
}

