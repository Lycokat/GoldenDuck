import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { GenerateErrorResponse, RequestError } from '@/services/errorService'
import { StatusCodes } from 'http-status-codes'
import { BigIntToJson, getRequestData } from '@/utils'
import { messages } from '@/const/messages'

export async function GET (
  request: NextRequest,
  { params: { idAccount } }: { params: { idAccount: string } }
): Promise<NextResponse> {
  try {
    const { loans } = await prisma.account.findUniqueOrThrow({
      where: {
        id: Number(idAccount)
      },
      select: {
        loans: {
          select: {
            id: true,
            amount: true,
            dateEnd: true,
            interest: true,
            date: true
          }
        }
      }
    })

    return NextResponse.json(BigIntToJson(loans), {
      status: StatusCodes.OK
    })
  } catch (error) {
    return GenerateErrorResponse(error)
  }
}

export async function POST (
  request: NextRequest,
  { params: { idAccount } }: { params: { idAccount: string } }
): Promise<NextResponse> {
  try {
    const { amount, dateEnd, interest } = await getRequestData(request)

    // check if the account has enough balance
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: Number(idAccount)
      },
      select: {
        balance: true
      }
    })
    if (account.balance < BigInt(String(amount))) {
      throw new RequestError(messages.insufficientBalance)
    }

    // create the loan
    const newLoan = await prisma.loan.create({
      data: {
        idAccount: Number(idAccount),
        amount,
        dateEnd: new Date(String(dateEnd)),
        interest
      },
      select: {
        id: true,
        amount: true,
        dateEnd: true,
        interest: true,
        date: true
      }
    })

    // remove the amount from the account
    await prisma.account.update({
      where: {
        id: Number(idAccount)
      },
      data: {
        balance: {
          decrement: BigInt(String(amount))
        }
      }
    })

    return NextResponse.json(BigIntToJson(newLoan), {
      status: StatusCodes.CREATED
    })
  } catch (error) {
    return GenerateErrorResponse(error)
  }
}
