import ConfirmationCode from '@/services/codeService'
import {
  AuthorizationError,
  GenerateErrorResponse,
  RequestError
} from '@/services/errorService'
import JWT from '@/services/jwtService'
import { type NextRequest, NextResponse } from 'next/server'

const CodeService = new ConfirmationCode()
const jwt = new JWT()

export async function POST (req: NextRequest): Promise<NextResponse> {
  try {
    const { code: userCode } = await req.json()
    const userToken = String(
      req.headers.get('token') ?? req.cookies.get('token')?.value
    )

    // validate request
    if (userCode === undefined) {
      throw new RequestError('No se ha enviado el código')
    }

    // verify token and code
    const { email, code } = jwt.verifyTempToken(userToken)
    if (!CodeService.checkCode(String(userCode), String(code))) {
      throw new AuthorizationError('El código es invalido')
    }

    // generate token with email
    const token = jwt.generateToken({ email })

    // generate and send response
    const response = NextResponse.json(
      { token, message: 'Se ha validado código exitosamente' },
      { status: 200 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 5,
      path: '/'
    })

    return response
  } catch (e) {
    return GenerateErrorResponse(e)
  }
}