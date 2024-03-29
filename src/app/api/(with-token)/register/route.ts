import JWT from '@/services/jwtService'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { type RegisterForm } from '@/types'
import { SignUpSchema } from '@/useCases/registerUseCase'
import bcrypt from 'bcryptjs'
import {
  ConflictError,
  GenerateErrorResponse,
  ValidationError
} from '@/services/errorService'
import { StatusCodes } from 'http-status-codes'
import { ErrorsDictionary } from '@/const/messages'
import { BigIntToJson, getRequestData } from '@/utils'

const jwt = new JWT()

export async function POST (request: NextRequest): Promise<NextResponse> {
  try {
    const userData = await getRequestData(request)

    // validate data
    const data = await SignUpSchema.parseAsync(userData as RegisterForm).catch(
      (error) => {
        throw new ValidationError(error.errors[0].message)
      }
    )

    // Check if user already exists
    const checkSameUser = await prisma.user.findFirst({
      where: {
        OR: [
          { dni: data.dni },
          { email: data.email },
          { phoneNumber: data.phoneNumber }
        ],
        deleted: false
      },
      select: {
        id: true
      }
    })
    if (checkSameUser !== undefined && checkSameUser !== null) {
      throw new ConflictError(ErrorsDictionary.UserAlreadyExists)
    }

    // Create new user
    const newUser = await prisma.user.createUser({
      ...data,
      password: bcrypt.hashSync(data.password, 10)
    })

    // log session
    await prisma.session.create({
      data: {
        idUser: newUser.id,
        userAgent: String(request.headers.get('user-agent')),
        ip: String(request.headers.get('x-real-ip'))
      }
    })

    // generate autorized token with id
    const token = jwt.generateToken({
      id: newUser.id
    })

    // generate and send response
    const response = NextResponse.json(
      { token, ...BigIntToJson(newUser) },
      { status: StatusCodes.CREATED }
    )
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 30,
      path: '/'
    })
    return response
  } catch (e) {
    return GenerateErrorResponse(e)
  }
}
