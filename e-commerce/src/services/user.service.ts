import type { User } from "../generated/client";
import { getPrisma } from "../prisma";

const prisma = getPrisma();
export const getAllUsers = async (): Promise<{users:User[], total: number}> => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
  });
  const total = users.length;

  return { users, total };
};

export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
    where: { id: parseInt(id), deletedAt: null },
  });
}

export const searchUser = async (name?: string, email?: string, password?: string) => {
    return await prisma.user.findFirst({
        where: {
            deletedAt: null,
            ...(name && {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            }),
            ...(email && {
                email: {
                    contains: email,
                    mode: 'insensitive'
                }
            }),
            ...(password && {
                password: {
                    contains: password,
                    mode: 'insensitive'
                }
            })
        }
    })
}

export const createUser = async (data: {name: string, email: string, password: string}) => {
    const exist= await prisma.user.findFirst({
        where: {
            deletedAt: null,
            name: data.name,
            email: data.email,
            password: data.password
        }
    })
    if (exist) throw new Error("user sudah ada")

    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password
        }
    })
}

export const updateUser = async (id: string, data: {name?: string, email?: string, password?: string}) => {
    const numId = parseInt(id);
    return await prisma.user.update({
        where: { id: numId, deletedAt: null },
        data
    })
}

export const deleteUser = async (id: string) => {
    const numId = parseInt(id);
    return await prisma.user.update({
        where: { id: numId, deletedAt: null },
        data: { deletedAt: new Date() }
    })
}