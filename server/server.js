import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';

import { initDb } from './config/db.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik Yüklenen Panoramik Röntgen ve Eklenti Dosyaları Dizini (/uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Veritabanı Havuzunu Başlat
initDb();

// API Rotaları
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'TAN DİŞ KLİNİĞİ Core API v2.5', 
        timestamp: new Date() 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 TAN DİŞ KLİNİĞİ Express Backend Sunucusu Aktif: http://localhost:${PORT}`);
});
