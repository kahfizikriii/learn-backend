// src/prisma.ts
import { PrismaClient } from '@prisma/client/extension';
const prismaClientSingleton = () => {
    return new PrismaClient();
};
export const getPrisma = () => {
    if (process.env.NODE_ENV === 'production') {
        return new PrismaClient();
    }
    else {
        if (!global.prismaGlobal) {
            global.prismaGlobal = prismaClientSingleton();
        }
        return global.prismaGlobal;
    }
};
//# sourceMappingURL=prisma.js.map