import { getPrisma } from "../prisma"

const prisma = getPrisma()

export const getAllCategories = async () => {
    return await prisma.category.findMany()
}

export const getCategoryById = async (id: string)  => {
    const numId = parseInt(id)

    return await prisma.category.findUnique({
        where: { id: numId }
    })
}

export const createCategory = async (name: string) => {
    const isExist = await prisma.category.findUnique({ where: { name } })
    if (isExist) throw new Error("nama kategori sudah ada")

        return await prisma.category.create({ data: { name } })

}

export const updateCategory = async (id: string, data: { name?: string }) => {
    const numId = parseInt(id)

    if(isNaN(numId)) throw new Error("id kategori tidak valid")

    const isExist = await prisma.category.findUnique({
        where: { id: numId }
    })
    if (!isExist) throw new Error("kategori tidak ditemukan")

    if (data.name) {
        const sameName = await prisma.category.findUnique({
            where: { name: data.name }
        })

        if (sameName && sameName.id !== numId) {
            throw new Error("nama kategori sudah ada")
        }
    }

    return await prisma.category.update({
        where: { id: numId },
        data
    })
}

export const deleteCategory = async (id: string) => {
    const numId = parseInt(id)

    if (isNaN(numId)) throw new Error("id kategori tidak valid")

    const isExist = await prisma.category.findUnique({
        where: { id: numId }
    })

    if(isExist) throw new Error("kategori tidak ditemukan")

    return await prisma.category.delete({
        where: { id: numId }
    })
}