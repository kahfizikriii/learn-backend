import type { Product } from "../generated/client";
export declare const getAllProduct: () => Promise<{
    products: Product[];
    total: number;
}>;
export declare const getByIdProduct: (id: string) => Promise<any>;
export declare const searchProduct: (name?: string, min_price?: number, max_price?: number) => Promise<Product[]>;
export declare const createProduct: (data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: number;
}) => Promise<Product>;
export declare const updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
export declare const deleteProduct: (id: string) => Promise<Product>;
//# sourceMappingURL=product.service.d.ts.map