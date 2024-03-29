import { type RegisterForm } from '@/types'
import { validations } from '@/services/validationService'
import { z } from 'zod'
import Alerts from '@/services/alertService'
import {
  ErrorsHandler,
  RequestError,
  ValidationError
} from '@/services/errorService'
import { checkCode, checkUser, generateCode, registerUser } from '@/api'
import { AlertsDictionary, ErrorsDictionary } from '@/const/messages'

export const SignUpSchema = z.object({
  name: validations.name,
  lastName: validations.lastName,
  dni: validations.dni,
  email: validations.email,
  phoneNumber: validations.phoneNumber,
  password: validations.password,
  address: validations.address,
  birthDate: validations.birthDate,
  sex: validations.sex
})

export const onSubmitData = async (
  { email, dni, phoneNumber }: RegisterForm,
  callback?: () => void
): Promise<void> => {
  try {
    await checkUser({ email, dni, phoneNumber })
      .then(() => {
        throw new ValidationError(ErrorsDictionary.UserAlreadyExists)
      })
      .catch((error) => {
        if (error.response.status !== 404) {
          throw new RequestError(error.response.data.error.message)
        }
      })

    await generateCode(email).catch((error) => {
      throw new RequestError(error.response.data.error.message)
    })

    if (typeof callback === 'function') callback()
  } catch (error) {
    const { message } = ErrorsHandler(error)
    Alerts.error(message)
  }
}

export const onSubmitCode = async (
  form: RegisterForm,
  code: string
): Promise<void> => {
  try {
    await checkCode(code).catch((error) => {
      throw new RequestError(error.response.data.error.message)
    })

    await registerUser(form).catch((error) => {
      throw new RequestError(error.response.data.error.meesage)
    })

    Alerts.success(AlertsDictionary.RegisterSuccess, () => {
      location.href = '/dashboard'
    })
  } catch (error) {
    const { message } = ErrorsHandler(error)
    Alerts.error(message)
  }
}
