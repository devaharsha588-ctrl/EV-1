import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from "react-hook-form"

type ZodResolverSchema = Parameters<typeof zodResolver>[0]

export function useZodForm<TFieldValues extends FieldValues>(
  schema: ZodResolverSchema,
  options: Omit<UseFormProps<TFieldValues>, "resolver"> = {},
) {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema) as Resolver<TFieldValues>,
  })
}
