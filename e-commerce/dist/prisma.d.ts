declare const prismaClientSingleton: () => any;
declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}
export declare const getPrisma: () => any;
export {};
//# sourceMappingURL=prisma.d.ts.map