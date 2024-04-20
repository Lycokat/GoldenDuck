import { ValidationDictionary } from '@/messages/validations'
import validations from '@/services/validation'
import { z } from 'zod'

export const Email = z.object({
  email: validations.email
})

const Password = z
  .object({
    password: validations.password,
    confirmPassword: validations.confirmPassword
  })
  .refine(data => data.password === data.confirmPassword, {
    message: ValidationDictionary.confirmPassword.match,
    path: ['confirmPassword']
  })

export const ForgotSchema = {
  Email,
  Password
}
