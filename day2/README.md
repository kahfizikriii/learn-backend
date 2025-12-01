1. Apa itu Node.js dan untuk apa biasanya digunakan?
Node.js adalah runtime environment JavaScript yang berjalan di sisi server (server-side), dibangun di atas V8 JavaScript Engine dari Google Chrome. Node.js menggunakan arsitektur event-driven dan non-blocking I/O yang membuatnya efisien dan ringan.

Penggunaan Umum Node.js:

Web Backend Development (API servers, RESTful services, microservices)

Real-time Applications (chat applications, live notifications, collaboration tools)

Data Streaming Applications (video streaming, file processing)

CLI Tools & Automation Scripts

IoT Applications (Internet of Things)

Serverless Functions (AWS Lambda, Google Cloud Functions)

Proxy Servers dan API Gateways

Static File Servers dengan kemampuan caching

2. Perbedaan antara Node.js dan JavaScript yang berjalan di browser
Aspek	Node.js (Server-side)	Browser JavaScript (Client-side)
Environment	Server environment	Browser environment
Global Object	global	window
DOM Access	Tidak tersedia	Tersedia (document, window)
File System	Akses penuh (fs module)	Akses terbatas (via File API)
Module System	CommonJS, ES Modules	ES Modules (native)
Package Manager	npm, yarn	Tidak ada, menggunakan CDN/bundler
Network Requests	Bebas (http/https modules)	Terbatas (CORS policy)
Console Output	Terminal/Command Line	Browser Console
Security Context	Akses ke server resources	Sandboxed, terbatas pada browser

3. Fungsi import() dalam Node.js
Overview
import() adalah dynamic import function yang diperkenalkan dalam ECMAScript Modules (ESM). Berbeda dengan require() yang synchronous, import() berjalan secara asynchronous dan mengembalikan Promise.

Karakteristik Utama
Aspek	import()	require()
Type	Asynchronous (Promise-based)	Synchronous
Module System	ES Modules (ESM)	CommonJS (CJS)
Return Value	Promise → Module object	Module object langsung
Error Handling	.catch() / try-catch dengan async	try-catch synchronous
Usage Context	Bisa di ES Modules & CommonJS	Hanya CommonJS