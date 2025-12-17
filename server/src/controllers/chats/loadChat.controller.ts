
import { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";

const getChatId = async (req: Request, res: Response) => {

    const userId = (req as any).user.id;

    const { otherUserId } = req.body;
  try{
    const chat = await prisma.chat.findFirst({
      where: {
        chatType: "DM",
        chatUsers: {
          some: {
            userId,
          },
        },
        AND: {
          chatUsers: {
            some: {
              userId: otherUserId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      const newChat = await prisma.chat.create({
        data: {
          chatUsers: {
            create: [
              {
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
              {
                user: {
                  connect: {
                    id: otherUserId,
                  },
                },
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });
      return res.status(201).json({ success: true, chat: newChat });
    }

    return res.status(200).json({ success: true, chat });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error while finding chat Id: `, errorMessage: err });
    return;
  }
};

const loadChat = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
    try {

        const {chatId} = req.body;
        const chat = await prisma.chat.findUnique({where:{
            id: chatId
        },
    include: {
        chatUsers: {
          include: {
            user: true
          }
        },
        messages: true
    }})

        if (!chat) return res.status(404).json({error: "Chat not found!!"})

        return res.status(200).json({success: true, chat, userId})
    } catch (err) {
        return res.status(500).json({error: "Error while loading chat from backend!!", message: err })
    }
};

export default { getChatId, loadChat };
