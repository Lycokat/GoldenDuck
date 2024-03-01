import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { GenerateErrorResponse, NotFoundError } from '@/services/errorService'
import JWT from '@/services/jwtService'
import { BigIntToJson } from '@/utils'

const jwt = new JWT()

export async function GET (request: NextRequest,
  { params: { id: idAccount } }: { params: { id: string } }): Promise<NextResponse> {
  const token = String(
    request.headers.get('token') ?? request.cookies.get('token')?.value
  )

  try {
    const { id } = jwt.verifyToken(token)

    const data = await prisma.account.findFirst({
      where: {
        id: Number(idAccount),
        idUser: id,
        deleted: false
      },
      select: {
        id: true,
        balance: true,
        imgUrl: true,
        updatedAt: true,
        createdAt: true
      }
    })

    if (data === null) {
      throw new NotFoundError('Cuenta no encontrada')
    }

    return NextResponse.json(BigIntToJson(data), { status: 200 })
  } catch (error) {
    return GenerateErrorResponse(error)
  }
}
