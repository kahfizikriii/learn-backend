import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { body, param, query, validationResult, type ValidationChain } from 'express-validator';

dotenv.config();

const app: Application = express();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

interface CustomRequest extends Request {
  startTime?: number;
  requestId?: string;
}

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  kategori: string;
}

let products: Product[] = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000, stok: 10, kategori: "elektronik" },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000, stok: 25, kategori: "aksesoris" },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000, stok: 30, kategori: "aksesoris" },
  { id: 4, nama: "Monitor 27 Inch", deskripsi: "4K IPS Display", harga: 5000000, stok: 15, kategori: "elektronik" }
];

// ==================== CUSTOM MIDDLEWARE ====================

// Middleware 1: Log waktu request dan buat request ID
app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
  console.log(`📨 Request masuk: ${req.method} ${req.path}`);
  req.startTime = Date.now();
  req.requestId = Math.random().toString(36).substring(2, 15);
  next();
});

// Middleware 2: Validasi API Key
const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip API key validation untuk endpoint tertentu
  if (req.path === '/' || req.path === '/health' || req.path === '/favicon.ico') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Header X-API-Key wajib diisi untuk akses API!",
      timestamp: new Date().toISOString()
    });
  }
  
  // Simulasi validasi API key
  const validApiKeys = ['secret-api-key-123', 'dev-api-key-456', 'test-api-key-789'];
  
  if (!validApiKeys.includes(apiKey as string)) {
    return res.status(403).json({
      success: false,
      message: "API Key tidak valid!",
      timestamp: new Date().toISOString()
    });
  }
  
  console.log(`🔑 API Key valid untuk request: ${req.method} ${req.path}`);
  next();
};

app.use(apiKeyMiddleware);

// ==================== RESPONSE HELPERS ====================

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metadata?: {
    requestId?: string | undefined;
    processingTime?: string | undefined;
    timestamp?: string | undefined;
  };
  errors?: Array<{
    field: string;
    message: string;
  }> | { stack?: string };
}

// Success Response Helper
const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: { page: number; limit: number; total: number; totalPages: number } | null = null,
  statusCode: number = 200,
  req?: CustomRequest
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;
  
  if (req) {
    response.metadata = {
      requestId: req.requestId,
      processingTime: `${Date.now() - (req.startTime || Date.now())}ms`,
      timestamp: new Date().toISOString()
    };
  }

  return res.status(statusCode).json(response);
};

// Error Response Helper
const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: Array<{ field: string; message: string }> | { stack?: string } | null = null,
  req?: CustomRequest
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;
  
  if (req) {
    response.metadata = {
      requestId: req.requestId,
      processingTime: `${Date.now() - (req.startTime || Date.now())}ms`,
      timestamp: new Date().toISOString()
    };
  }

  return res.status(statusCode).json(response);
};

// ==================== VALIDATION ====================

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, 'Validasi gagal', 400, errorList, req as CustomRequest);
  };
};

// Validasi untuk CREATE produk
const createProductValidation = [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama produk wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter')
    .isLength({ max: 100 }).withMessage('Nama produk maksimal 100 karakter'),
  
  body('deskripsi')
    .trim()
    .notEmpty().withMessage('Deskripsi wajib diisi')
    .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter'),
  
  body('harga')
    .isFloat({ min: 1000 }).withMessage('Harga minimal 1000')
    .toFloat(),
  
  body('stok')
    .isInt({ min: 0 }).withMessage('Stok tidak boleh negatif')
    .toInt(),
  
  body('kategori')
    .trim()
    .notEmpty().withMessage('Kategori wajib diisi')
    .isIn(['elektronik', 'aksesoris', 'pakaian', 'makanan', 'lainnya']).withMessage('Kategori tidak valid')
];

// Validasi untuk UPDATE produk
const updateProductValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID harus angka positif')
    .toInt(),
  
  body('nama')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter')
    .isLength({ max: 100 }).withMessage('Nama produk maksimal 100 karakter'),
  
  body('deskripsi')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter'),
  
  body('harga')
    .optional()
    .isFloat({ min: 1000 }).withMessage('Harga minimal 1000')
    .toFloat(),
  
  body('stok')
    .optional()
    .isInt({ min: 0 }).withMessage('Stok tidak boleh negatif')
    .toInt(),
  
  body('kategori')
    .optional()
    .trim()
    .isIn(['elektronik', 'aksesoris', 'pakaian', 'makanan', 'lainnya']).withMessage('Kategori tidak valid')
];

// Validasi untuk GET by ID produk
const getProductByIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID harus angka positif')
    .toInt()
];

// Validasi untuk query parameters
const searchProductValidation = [
  query('nama')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Keyword pencarian minimal 2 karakter'),
  
  query('harga_max')
    .optional()
    .isFloat({ min: 0 }).withMessage('Harga maksimal harus angka positif')
    .toFloat(),
  
  query('kategori')
    .optional()
    .trim()
    .isIn(['elektronik', 'aksesoris', 'pakaian', 'makanan', 'lainnya']).withMessage('Kategori tidak valid'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page harus angka positif')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100')
    .toInt()
];

// ==================== ASYNC HANDLER ====================

const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ==================== ROUTES ====================

// Route 1: Home dengan waktu proses
app.get('/', (req: CustomRequest, res: Response) => {
  const waktuProses = Date.now() - (req.startTime || Date.now());
  successResponse(res, '🚀 API E-Commerce – Hari 4', {
    hari: 4,
    status: "Server hidup!",
    fitur: [
      "Autentikasi API Key",
      "Validasi Input dengan express-validator",
      "Global Error Handling",
      "Pagination & Filtering",
      "Logging dengan Morgan",
      "Security dengan Helmet",
      "CORS Enabled"
    ],
    endpoints: {
      home: "GET /",
      health: "GET /health",
      semuaProduk: "GET /api/products",
      cariProduk: "GET /api/search?nama=&harga_max=&kategori=",
      produkById: "GET /api/products/:id",
      tambahProduk: "POST /api/products",
      updateProduk: "PUT /api/products/:id",
      hapusProduk: "DELETE /api/products/:id",
      testError: "GET /api/error-test",
      testAsync: "GET /api/async-test"
    }
  }, null, 200, req);
});

// Route 2: Health Check
app.get('/health', (req: CustomRequest, res: Response) => {
  successResponse(res, '✅ API Sehat', {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  }, null, 200, req);
});

// Route 3: Get all products dengan pagination
app.get('/api/products', validate(searchProductValidation), (req: CustomRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = products.slice(startIndex, endIndex);
    
    const pagination = {
      page,
      limit,
      total: products.length,
      totalPages: Math.ceil(products.length / limit)
    };

    successResponse(res, '📦 Daftar produk berhasil diambil', result, pagination, 200, req);
  } catch (error) {
    throw new Error('Gagal mengambil daftar produk');
  }
});

// Route 4: Get product by ID dengan validasi
app.get('/api/products/:id', validate(getProductByIdValidation), (req: CustomRequest, res: Response) => {
  const id = parseInt(req.params.id!);
  const product = products.find(p => p.id === id);

  if (!product) {
    throw new Error(`Produk dengan ID ${id} tidak ditemukan`);
  }

  successResponse(res, '✅ Produk ditemukan', product, null, 200, req);
});

// Route 5: Search products
app.get('/api/search', validate(searchProductValidation), (req: CustomRequest, res: Response) => {
  try {
    const { nama, harga_max, kategori, page = 1, limit = 10 } = req.query;
    
    let filteredProducts = [...products];
    const filters: string[] = [];

    if (nama) {
      filteredProducts = filteredProducts.filter(p => 
        p.nama.toLowerCase().includes((nama as string).toLowerCase())
      );
      filters.push(`nama: ${nama}`);
    }

    if (harga_max) {
      const maxPrice = parseFloat(harga_max as string);
      filteredProducts = filteredProducts.filter(p => p.harga <= maxPrice);
      filters.push(`harga_max: ${maxPrice}`);
    }

    if (kategori) {
      filteredProducts = filteredProducts.filter(p => 
        p.kategori === kategori
      );
      filters.push(`kategori: ${kategori}`);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const result = filteredProducts.slice(startIndex, endIndex);

    const pagination = {
      page: pageNum,
      limit: limitNum,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limitNum)
    };

    successResponse(res, '🔍 Hasil pencarian produk', {
      filters,
      result
    }, pagination, 200, req);
  } catch (error) {
    throw new Error('Gagal melakukan pencarian produk');
  }
});

// Route 6: Create new product dengan validasi
app.post('/api/products', validate(createProductValidation), (req: CustomRequest, res: Response) => {
  try {
    const { nama, deskripsi, harga, stok, kategori } = req.body;
    
    // Cek apakah produk dengan nama yang sama sudah ada
    const existingProduct = products.find(p => 
      p.nama.toLowerCase() === nama.toLowerCase()
    );
    
    if (existingProduct) {
      throw new Error(`Produk dengan nama "${nama}" sudah ada`);
    }

    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      nama,
      deskripsi,
      harga,
      stok,
      kategori
    };

    products.push(newProduct);

    successResponse(res, '🎉 Produk berhasil ditambahkan', newProduct, null, 201, req);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal menambahkan produk');
  }
});

// Route 7: Update product
app.put('/api/products/:id', validate(updateProductValidation), (req: CustomRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id!);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`Produk dengan ID ${id} tidak ditemukan`);
    }

    // Cek nama unik untuk update
    if (req.body.nama && products[index] && req.body.nama !== products[index].nama) {
      const existingProduct = products.find(p => 
        p.nama.toLowerCase() === req.body.nama.toLowerCase() && p.id !== id
      );
      
      if (existingProduct) {
        throw new Error(`Produk dengan nama "${req.body.nama}" sudah ada`);
      }
    }

    products[index] = { ...products[index], ...req.body };

    successResponse(res, '✅ Produk berhasil diperbarui', products[index], null, 200, req);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal memperbarui produk');
  }
});

// Route 8: Delete product
app.delete('/api/products/:id', validate(getProductByIdValidation), (req: CustomRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id!);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error(`Produk dengan ID ${id} tidak ditemukan`);
    }

    const deletedProduct = products.splice(index, 1)[0];

    successResponse(res, '🗑️ Produk berhasil dihapus', deletedProduct, null, 200, req);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal menghapus produk');
  }
});

// ==================== ROUTE BARU ====================

// Route 9: Test error handling
app.get('/api/error-test', (req: CustomRequest, _res: Response, next: NextFunction) => {
  // Sengaja lempar error untuk testing
  if (req.query.type === 'validation') {
    return next(new Error('Error validasi: Data tidak sesuai format'));
  } else if (req.query.type === 'not-found') {
    return next(new Error('Produk tidak ditemukan'));
  } else if (req.query.type === 'server') {
    const error: any = new Error('Internal Server Error');
    error.code = 'INTERNAL_ERROR';
    return next(error);
  } else {
    return next(new Error('Ini adalah error test dari API E-Commerce'));
  }
});

// Route 10: Test async handler
app.get('/api/async-test', asyncHandler(async (req: CustomRequest, res: Response) => {
  // Simulasi async operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulasi database query
  const mockAsyncOperation = () => {
    return new Promise((resolve, reject) => {
      if (req.query.fail) {
        reject(new Error('Async operation sengaja gagal'));
      } else {
        resolve({ data: 'Operasi async berhasil', timestamp: new Date().toISOString() });
      }
    });
  };

  const result = await mockAsyncOperation();
  
  successResponse(res, '✅ Async test berhasil', result, null, 200, req);
}));

// ==================== ERROR HANDLING ====================

// 404 Handler - DIPERBAIKI: tidak menggunakan pattern '*'
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new Error(`Route ${req.originalUrl} tidak ditemukan di API E-Commerce`));
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 ERROR:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Tentukan status code berdasarkan error message
  let statusCode = 500;
  let errorMessage = err.message;

  if (err.message.includes('tidak ditemukan')) {
    statusCode = 404;
  } else if (err.message.includes('validasi') || err.message.includes('wajib') || err.message.includes('harus')) {
    statusCode = 400;
  } else if (err.message.includes('API Key')) {
    statusCode = 401;
  } else if (err.message.includes('sudah ada')) {
    statusCode = 409;
  }

  // Format error response
  const errorResponseObj: any = {
    success: false,
    message: errorMessage,
    metadata: {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  };

  // Tambahkan stack trace di development
  if (process.env.NODE_ENV === 'development') {
    errorResponseObj.stack = err.stack;
  }

  res.status(statusCode).json(errorResponseObj);
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`
  🚀 Server E-Commerce Hari 4
  🌐 URL: http://${HOST}:${PORT}
  ⏰ Started at: ${new Date().toISOString()}
  
  🔑 API Keys yang valid:
  - secret-api-key-123
  - dev-api-key-456
  - test-api-key-789
  
  📋 Contoh request:
  curl -H "X-API-Key: secret-api-key-123" http://${HOST}:${PORT}/api/products
  
  🧪 Test Error Handling:
  curl -H "X-API-Key: secret-api-key-123" http://${HOST}:${PORT}/api/error-test
  `);
});

export default app;