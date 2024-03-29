import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { GenerateErrorResponse } from '@/services/errorService'
import JWT from '@/services/jwtService'
import { StatusCodes } from 'http-status-codes'
import { getRequestData } from '@/utils'

const jwt = new JWT()

export async function GET (request: NextRequest): Promise<NextResponse> {
  const token = String(
    request.headers.get('token') ?? request.cookies.get('token')?.value
  )

  try {
    const { id } = jwt.verifyToken(token)

    const notifications = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        deleted: false
      },
      select: {
        account: {
          select: {
            notifications: {
              where: {
                read: false
              },
              orderBy: {
                date: 'desc'
              },
              select: {
                id: true,
                idAccount: true,
                message: true,
                date: true
              }
            },
            messagesFrom: {
              where: {
                read: false
              },
              orderBy: {
                date: 'desc'
              },
              select: {
                id: true,
                from: true,
                message: true,
                date: true,
                accountFrom: {
                  select: {
                    imgUrl: true,
                    user: {
                      select: {
                        name: true,
                        lastName: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    const formatedNotifications = notifications.account.reduce(
      (acc, value) => {
        return {
          ...acc,
          notifications: [...acc.notifications.concat(value.notifications)],
          messages: [...acc.messages.concat(value.messagesFrom)]
        }
      },
      { notifications: [] as any, messages: [] as any }
    )

    return NextResponse.json(formatedNotifications, { status: StatusCodes.OK })
  } catch (error) {
    return GenerateErrorResponse(error)
  }
}

export async function POST (
  request: NextRequest,
  { params: { idAccount } }: { params: { idAccount: string } }
): Promise<NextResponse> {
  try {
    const { message } = await getRequestData(request)

    const newNotification = await prisma.notification.create({
      data: {
        idAccount: Number(idAccount),
        message
      },
      select: {
        id: true,
        message: true,
        date: true,
        account: {
          select: {
            user: {
              select: {
                name: true,
                lastName: true
              }
            },
            imgUrl: true
          }
        }
      }
    })

    return NextResponse.json(newNotification, { status: StatusCodes.CREATED })
  } catch (error) {
    return GenerateErrorResponse(error)
  }
}
