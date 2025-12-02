// ===== INI MATERI =====

import express, { type Application, type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config()

const app: Application = express()
const HOST = process.env.HOST
const PORT = process.env.PORT

app.use(express.json())

let products = [
  { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
  { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
  { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 }
];

// Route 1
app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: "Selamat datang di API E-Commerce!",
        hari: 3, 
        status: "Server hidup!"
    })
})

// Route 2
app.get('/api/products', (_req: Request, res: Response) => {  // /api/products ngecek produk
    res.json({
        status: true,
        jumlah: products.length,
        data: products
    })
})

// Route 3
app.get('/api/products/:id', (req: Request, res: Response) => {
    if(!req.params.id) {
        res.json({
            message: "Parameter Gak ada"
        })
        return
    }
    const id = parseInt(req.params.id)
    const product = products.find(p => p.id === id)

    if(!product) {
        res.json({
            status: false,
            message: "Menu gak ditemukan"
        })
    }

    res.json({
        status: true,
        data: product
    })
})

// Route 4
app.get('/api/search', (req: Request, res: Response) => {
  const { name, max_price } = req.query;

  let result = products;

  if (name) {
    result = result.filter(p => 
      p.nama.toLowerCase().includes((name as string).toLowerCase())
    );
  }

  if (max_price) {
    result = result.filter(p => p.harga <= Number(max_price));
  }

  res.json({
    success: true,
    filtered_result: result
  });
});

// Route 5
app.post('/api/products', (req: Request, res: Response) => {
  const { nama, deskripsi, harga } = req.body;

    //Opsi 1
    if(harga !== typeof 'number') {
        res.json({
            status: false,
            message: "Harga harus berupa angka bukan string"
        })
    }

    //Opsi 2
//   let number
//   if(typeof harga === 'string') {
//     number = parseInt(harga) 
//   }

  const newProduct = {
    id: products.length + 1,
    nama,
    deskripsi,
    harga
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: "Menu Baru ditambahkan",
    data: products
  });
});

// Route 6
app.put('/api/products/:id', (req: Request, res: Response) => {

     if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID Menu tidak diberikan"
    });
  }

  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Menu tidak tersedia" });
  }

  products[index] = { ...products[index], ...req.body };

  res.json({
    success: true,
    message: "Menu berhasil diperbarui",
    data: products[index]
  });
});

// Route 7
app.delete('/api/products/:id', (req: Request, res: Response) => {

    if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "ID produk tidak diberikan"
    });
  }

  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: " Menu tidak tersedia" });
  }

  const deleted = products.splice(index, 1);

  res.json({
    success: true,
    message: "Menu sudah Dihapus",
    data: deleted[0]
  });
});

app.listen(PORT, () => {
    console.log(`Server running at ${HOST}:${PORT}`);
})