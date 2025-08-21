# Dockerfile

# Langkah 1: Mulai dari "dapur" yang sudah punya Node.js versi 18
# Kita pakai 'alpine' karena ukurannya sangat kecil dan efisien
FROM node:18-alpine

# Langkah 2: Buat "meja kerja" di dalam koper/kontainer
WORKDIR /app

# Langkah 3: Copy "daftar belanjaan" (package.json) terlebih dahulu
# Docker itu pintar, kalau file ini tidak berubah, dia tidak akan install ulang (hemat waktu!)
COPY package*.json ./

# Langkah 4: "Belanja" semua kebutuhan (install dependencies)
RUN npm install

# Langkah 5: Setelah semua bahan siap, copy sisa kode aplikasi kita
COPY . .

# Langkah 6: Beri label bahwa koper ini akan membuka pintu di nomor 3000
EXPOSE 3000

# Langkah 7: Perintah untuk "menyalakan" aplikasi saat koper dibuka
CMD ["node", "index.js"]