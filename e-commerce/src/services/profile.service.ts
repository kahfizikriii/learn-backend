import { getPrisma } from "../prisma";
import type { Profile } from "../generated/client"

const prisma = getPrisma()

export const createProfile = async (data: {
    name: string;
    gender: string;
    address: string;
    profile_picture_url?: string;
    userId: number;
}): Promise<Profile> => {
    const exist = await prisma.profile.findUnique({
        where: {
            userId: data.userId
        }
    })
    if (exist) throw new Error("Profile sudah ada")

    return await prisma.profile.create({
        data
    })
}

export const getProfileById = async (id: number) => {
    return await prisma.profile.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    })

}

export const updateProfile = async (id: number, data: Partial<Profile>) => {
    return await prisma.profile.update({
        where: {
            id
        },
        data
    })
}

export const deleteProfile = async (id: number) => {
    return await prisma.profile.delete({
        where: {
            id
        }
    })
}