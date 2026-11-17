import React, { useState, useMemo, useEffect } from 'react';
import {
  Cpu,
  CircuitBoard,
  MonitorPlay,
  MemoryStick,
  HardDrive,
  Zap,
  Fan,
  Box,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Trash2,
  Plus,
  SlidersHorizontal,
  Sparkles,
  ChevronRight,
  X,
  RotateCcw,
  Sun,
  Moon,
  Layers,
  ShieldCheck,
  FileText,
  Terminal,
  Activity,
  Gauge,
  User
} from 'lucide-react';
// ============================================================================
// 1. MULTI-CURRENCY CONFIGURATION & FORMATTER
// ============================================================================
const CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    pdfSymbol: 'USD ',
    name: 'US Dollar',
    rate: 1,
    locale: 'en-US',
    taxRate: 0.0825,
    taxLabel: 'Est. Sales Tax (8.25%)'
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    pdfSymbol: 'AED ',
    name: 'UAE Dirham',
    rate: 3.67,
    locale: 'en-AE',
    taxRate: 0.05,
    taxLabel: 'Est. UAE VAT (5%)'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    pdfSymbol: 'INR ',
    name: 'Indian Rupee',
    rate: 84.5,
    locale: 'en-IN',
    taxRate: 0.18,
    taxLabel: 'Est. India GST (18%)'
  }
};

function formatPrice(usdAmount, currencyCode = 'USD', forPdf = false) {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = Math.round(usdAmount * curr.rate);
  const formattedNumber = converted.toLocaleString(curr.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return `${forPdf ? curr.pdfSymbol : curr.symbol}${formattedNumber}`;
}

// ============================================================================
// 2. CATEGORIES METADATA
// ============================================================================
const CATEGORIES = [
  { id: 'cpu', code: 'SYS-01', name: 'Processor (CPU)', shortName: 'CPU', icon: Cpu },
  { id: 'motherboard', code: 'SYS-02', name: 'Motherboard', shortName: 'Motherboard', icon: CircuitBoard },
  { id: 'gpu', code: 'SYS-03', name: 'Graphics Engine (GPU)', shortName: 'GPU', icon: MonitorPlay },
  { id: 'ram', code: 'SYS-04', name: 'Memory Matrix (RAM)', shortName: 'RAM', icon: MemoryStick },
  { id: 'storage', code: 'SYS-05', name: 'NVMe Storage Array', shortName: 'Storage', icon: HardDrive },
  { id: 'psu', code: 'SYS-06', name: 'Power Core (PSU)', shortName: 'PSU', icon: Zap },
  { id: 'cooler', code: 'SYS-07', name: 'Thermal Loop (Cooler)', shortName: 'Cooler', icon: Fan },
  { id: 'case', code: 'SYS-08', name: 'Exo-Chassis (Case)', shortName: 'Case', icon: Box }
];

// ============================================================================
// 3. PROGRAMMATIC LOCAL DATABASE GENERATOR (100+ REALISTIC PARTS PER CATEGORY)
// ============================================================================
function generateComponentDatabase() {
  const db = {
    cpu: [],
    motherboard: [],
    gpu: [],
    ram: [],
    storage: [],
    psu: [],
    cooler: [],
    case: []
  };

  // --- A. CPUs (114 Realistic SKUs across Budget, Mid-Range, Flagship) ---
  const cpuTemplates = [
    // Budget
    { brand: 'Intel', name: 'Core i3-12100F', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '4C/8T', boost: '4.3 GHz', tdp: 65, tier: 'Budget', basePrice: 89 },
    { brand: 'Intel', name: 'Core i3-13100F', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '4C/8T', boost: '4.5 GHz', tdp: 65, tier: 'Budget', basePrice: 109 },
    { brand: 'Intel', name: 'Core i3-14100F', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '4C/8T', boost: '4.7 GHz', tdp: 65, tier: 'Budget', basePrice: 118 },
    { brand: 'Intel', name: 'Core i5-12400F', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '6C/12T', boost: '4.4 GHz', tdp: 65, tier: 'Budget', basePrice: 132 },
    { brand: 'Intel', name: 'Core i5-12400', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '6C/12T', boost: '4.4 GHz', tdp: 65, tier: 'Budget', basePrice: 149 },
    { brand: 'Intel', name: 'Core i5-13400F', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '10C/16T', boost: '4.6 GHz', tdp: 65, tier: 'Budget', basePrice: 175 },
    { brand: 'AMD', name: 'Ryzen 3 4100', socket: 'AM4', ramType: 'DDR4', cores: '4C/8T', boost: '4.0 GHz', tdp: 65, tier: 'Budget', basePrice: 69 },
    { brand: 'AMD', name: 'Ryzen 5 5500', socket: 'AM4', ramType: 'DDR4', cores: '6C/12T', boost: '4.2 GHz', tdp: 65, tier: 'Budget', basePrice: 85 },
    { brand: 'AMD', name: 'Ryzen 5 5600', socket: 'AM4', ramType: 'DDR4', cores: '6C/12T', boost: '4.4 GHz', tdp: 65, tier: 'Budget', basePrice: 119 },
    { brand: 'AMD', name: 'Ryzen 5 5600X', socket: 'AM4', ramType: 'DDR4', cores: '6C/12T', boost: '4.6 GHz', tdp: 65, tier: 'Budget', basePrice: 135 },
    { brand: 'AMD', name: 'Ryzen 7 5700X', socket: 'AM4', ramType: 'DDR4', cores: '8C/16T', boost: '4.6 GHz', tdp: 65, tier: 'Budget', basePrice: 165 },
    { brand: 'AMD', name: 'Ryzen 5 7500F', socket: 'AM5', ramType: 'DDR5', cores: '6C/12T', boost: '5.0 GHz', tdp: 65, tier: 'Budget', basePrice: 169 },
    { brand: 'AMD', name: 'Ryzen 5 8400F', socket: 'AM5', ramType: 'DDR5', cores: '6C/12T', boost: '4.7 GHz', tdp: 65, tier: 'Budget', basePrice: 155 },

    // Mid-Range
    { brand: 'Intel', name: 'Core i5-13600KF', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '14C/20T', boost: '5.1 GHz', tdp: 125, tier: 'Mid-Range', basePrice: 245 },
    { brand: 'Intel', name: 'Core i5-14600K', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '14C/20T', boost: '5.3 GHz', tdp: 125, tier: 'Mid-Range', basePrice: 279 },
    { brand: 'Intel', name: 'Core Ultra 5 245K', socket: 'LGA1851', ramType: 'DDR5', cores: '14C/14T', boost: '5.2 GHz', tdp: 125, tier: 'Mid-Range', basePrice: 299 },
    { brand: 'Intel', name: 'Core i7-13700KF', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '16C/24T', boost: '5.4 GHz', tdp: 125, tier: 'Mid-Range', basePrice: 315 },
    { brand: 'Intel', name: 'Core i7-14700F', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '20C/28T', boost: '5.4 GHz', tdp: 65, tier: 'Mid-Range', basePrice: 339 },
    { brand: 'AMD', name: 'Ryzen 5 7600', socket: 'AM5', ramType: 'DDR5', cores: '6C/12T', boost: '5.1 GHz', tdp: 65, tier: 'Mid-Range', basePrice: 189 },
    { brand: 'AMD', name: 'Ryzen 5 7600X', socket: 'AM5', ramType: 'DDR5', cores: '6C/12T', boost: '5.3 GHz', tdp: 105, tier: 'Mid-Range', basePrice: 205 },
    { brand: 'AMD', name: 'Ryzen 5 9600X', socket: 'AM5', ramType: 'DDR5', cores: '6C/12T', boost: '5.4 GHz', tdp: 65, tier: 'Mid-Range', basePrice: 249 },
    { brand: 'AMD', name: 'Ryzen 7 5700X3D', socket: 'AM4', ramType: 'DDR4', cores: '8C/16T', boost: '4.1 GHz', tdp: 105, tier: 'Mid-Range', basePrice: 215 },
    { brand: 'AMD', name: 'Ryzen 7 7700X', socket: 'AM5', ramType: 'DDR5', cores: '8C/16T', boost: '5.4 GHz', tdp: 105, tier: 'Mid-Range', basePrice: 285 },
    { brand: 'AMD', name: 'Ryzen 7 9700X', socket: 'AM5', ramType: 'DDR5', cores: '8C/16T', boost: '5.5 GHz', tdp: 65, tier: 'Mid-Range', basePrice: 329 },
    { brand: 'AMD', name: 'Ryzen 7 7800X3D', socket: 'AM5', ramType: 'DDR5', cores: '8C/16T', boost: '5.0 GHz', tdp: 120, tier: 'Mid-Range', basePrice: 389 },

    // Flagship
    { brand: 'Intel', name: 'Core i7-14700K', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '20C/28T', boost: '5.6 GHz', tdp: 125, tier: 'Flagship', basePrice: 379 },
    { brand: 'Intel', name: 'Core Ultra 7 265K', socket: 'LGA1851', ramType: 'DDR5', cores: '20C/20T', boost: '5.5 GHz', tdp: 125, tier: 'Flagship', basePrice: 395 },
    { brand: 'Intel', name: 'Core i9-13900K', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '24C/32T', boost: '5.8 GHz', tdp: 125, tier: 'Flagship', basePrice: 449 },
    { brand: 'Intel', name: 'Core i9-14900KF', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '24C/32T', boost: '6.0 GHz', tdp: 125, tier: 'Flagship', basePrice: 489 },
    { brand: 'Intel', name: 'Core i9-14900K', socket: 'LGA1700', ramType: 'DDR4/DDR5', cores: '24C/32T', boost: '6.0 GHz', tdp: 125, tier: 'Flagship', basePrice: 519 },
    { brand: 'Intel', name: 'Core Ultra 9 285K', socket: 'LGA1851', ramType: 'DDR5', cores: '24C/24T', boost: '5.7 GHz', tdp: 125, tier: 'Flagship', basePrice: 589 },
    { brand: 'AMD', name: 'Ryzen 9 7900X', socket: 'AM5', ramType: 'DDR5', cores: '12C/24T', boost: '5.6 GHz', tdp: 170, tier: 'Flagship', basePrice: 379 },
    { brand: 'AMD', name: 'Ryzen 9 9900X', socket: 'AM5', ramType: 'DDR5', cores: '12C/24T', boost: '5.6 GHz', tdp: 120, tier: 'Flagship', basePrice: 429 },
    { brand: 'AMD', name: 'Ryzen 7 9800X3D', socket: 'AM5', ramType: 'DDR5', cores: '8C/16T', boost: '5.2 GHz', tdp: 120, tier: 'Flagship', basePrice: 479 },
    { brand: 'AMD', name: 'Ryzen 9 7950X', socket: 'AM5', ramType: 'DDR5', cores: '16C/32T', boost: '5.7 GHz', tdp: 170, tier: 'Flagship', basePrice: 499 },
    { brand: 'AMD', name: 'Ryzen 9 7950X3D', socket: 'AM5', ramType: 'DDR5', cores: '16C/32T', boost: '5.7 GHz', tdp: 120, tier: 'Flagship', basePrice: 569 },
    { brand: 'AMD', name: 'Ryzen 9 9950X', socket: 'AM5', ramType: 'DDR5', cores: '16C/32T', boost: '5.7 GHz', tdp: 170, tier: 'Flagship', basePrice: 629 },
    { brand: 'AMD', name: 'Ryzen 9 9950X3D', socket: 'AM5', ramType: 'DDR5', cores: '16C/32T', boost: '5.7 GHz', tdp: 170, tier: 'Flagship', basePrice: 699 }
  ];

  const cpuEditions = [
    { suffix: 'Retail Box', priceDelta: 0 },
    { suffix: 'Tray / OEM Silicon', priceDelta: -14 },
    { suffix: 'Binned Overclock Edition', priceDelta: 22 }
  ];

  cpuTemplates.forEach((tpl, idx) => {
    cpuEditions.forEach((ed, eIdx) => {
      db.cpu.push({
        id: `cpu-${idx}-${eIdx}`,
        sku: `CPU-${tpl.socket}-${1000 + idx * 10 + eIdx}`,
        category: 'cpu',
        brand: tpl.brand,
        name: `${tpl.brand} ${tpl.name} (${ed.suffix})`,
        shortName: `${tpl.brand} ${tpl.name}`,
        tier: tpl.tier,
        price: Math.max(65, tpl.basePrice + ed.priceDelta),
        wattage: tpl.tdp,
        socket: tpl.socket,
        ramType: tpl.ramType,
        specsSummary: `${tpl.socket} • ${tpl.cores} • Up to ${tpl.boost} • ${tpl.tdp}W TDP`,
        specs: {
          Socket: tpl.socket,
          'Cores / Threads': tpl.cores,
          'Max Boost': tpl.boost,
          'Memory Bus': tpl.ramType,
          TDP: `${tpl.tdp}W`
        }
      });
    });
  });

  // --- B. Motherboards (112 Realistic SKUs) ---
  const moboBrands = ['ASUS', 'MSI', 'Gigabyte', 'ASRock'];
  const moboSeries = [
    // Budget
    { series: 'PRIME B550M-A WiFi II', socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 109 },
    { series: 'PRO B550M-VC WiFi', socket: 'AM4', chipset: 'B550', ramType: 'DDR4', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 115 },
    { series: 'X570S Phantom Gaming 4', socket: 'AM4', chipset: 'X570', ramType: 'DDR4', formFactor: 'ATX', tier: 'Budget', basePrice: 149 },
    { series: 'B760M DS3H DDR4', socket: 'LGA1700', chipset: 'B760', ramType: 'DDR4', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 119 },
    { series: 'PRIME B760M-A WiFi', socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 139 },
    { series: 'B650M-HDV/M.2', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 129 },
    { series: 'PRO B650M-A WiFi', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 149 },
    { series: 'B650M Gaming Plus WiFi', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 155 },
    { series: 'B760 Gaming Plus WiFi', socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', formFactor: 'ATX', tier: 'Budget', basePrice: 159 },
    { series: 'B860M Pro RS WiFi', socket: 'LGA1851', chipset: 'B860', ramType: 'DDR5', formFactor: 'Micro-ATX', tier: 'Budget', basePrice: 165 },

    // Mid-Range
    { series: 'TUF Gaming B650-Plus WiFi', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 189 },
    { series: 'MAG B650 Tomahawk WiFi', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 199 },
    { series: 'B650 AORUS Elite AX', socket: 'AM5', chipset: 'B650', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 205 },
    { series: 'B650E-I Mini-ITX Gaming WiFi', socket: 'AM5', chipset: 'B650E', ramType: 'DDR5', formFactor: 'Mini-ITX', tier: 'Mid-Range', basePrice: 249 },
    { series: 'MAG B760 Tomahawk WiFi', socket: 'LGA1700', chipset: 'B760', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 195 },
    { series: 'Z790 Gaming X AX', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 229 },
    { series: 'PRO Z790-A Max WiFi', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 239 },
    { series: 'Z890 AORUS Elite WiFi7', socket: 'LGA1851', chipset: 'Z890', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 269 },
    { series: 'X870 Pro RS WiFi', socket: 'AM5', chipset: 'X870', ramType: 'DDR5', formFactor: 'ATX', tier: 'Mid-Range', basePrice: 249 },

    // Flagship
    { series: 'ROG Strix B650E-F Gaming WiFi', socket: 'AM5', chipset: 'B650E', ramType: 'DDR5', formFactor: 'ATX', tier: 'Flagship', basePrice: 279 },
    { series: 'ROG Strix X670E-E Gaming WiFi', socket: 'AM5', chipset: 'X670E', ramType: 'DDR5', formFactor: 'ATX', tier: 'Flagship', basePrice: 419 },
    { series: 'MPG X870E Carbon WiFi', socket: 'AM5', chipset: 'X870E', ramType: 'DDR5', formFactor: 'ATX', tier: 'Flagship', basePrice: 469 },
    { series: 'X870E AORUS Master', socket: 'AM5', chipset: 'X870E', ramType: 'DDR5', formFactor: 'E-ATX', tier: 'Flagship', basePrice: 499 },
    { series: 'ROG Crosshair X870E Hero', socket: 'AM5', chipset: 'X870E', ramType: 'DDR5', formFactor: 'ATX', tier: 'Flagship', basePrice: 649 },
    { series: 'ROG Strix Z790-E Gaming WiFi II', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'ATX', tier: 'Flagship', basePrice: 399 },
    { series: 'MEG Z790 Ace Max', socket: 'LGA1700', chipset: 'Z790', ramType: 'DDR5', formFactor: 'E-ATX', tier: 'Flagship', basePrice: 549 },
    { series: 'ROG Maximus Z890 Hero', socket: 'LGA1851', chipset: 'Z890', ramType: 'DDR5', formFactor: 'ATX', tier: 'Flagship', basePrice: 629 },
    { series: 'Z890 Taichi OCF', socket: 'LGA1851', chipset: 'Z890', ramType: 'DDR5', formFactor: 'E-ATX', tier: 'Flagship', basePrice: 579 }
  ];

  moboSeries.forEach((m, idx) => {
    moboBrands.forEach((brand, bIdx) => {
      const priceAdjust = (bIdx - 1.5) * 8;
      db.motherboard.push({
        id: `mobo-${idx}-${bIdx}`,
        sku: `MB-${m.chipset}-${2000 + idx * 10 + bIdx}`,
        category: 'motherboard',
        brand,
        name: `${brand} ${m.series}`,
        shortName: `${brand} ${m.series}`,
        tier: m.tier,
        price: Math.round(m.basePrice + priceAdjust),
        wattage: 45,
        socket: m.socket,
        ramType: m.ramType,
        formFactor: m.formFactor,
        specsSummary: `${m.socket} • ${m.chipset} • ${m.ramType} • ${m.formFactor}`,
        specs: {
          Socket: m.socket,
          Chipset: m.chipset,
          Memory: m.ramType,
          'Form Factor': m.formFactor,
          I_O: m.tier === 'Flagship' ? 'Wi-Fi 7 + 5GbE + USB4' : 'Wi-Fi 6E + 2.5GbE'
        }
      });
    });
  });

  // --- C. GPUs (125 Realistic SKUs) ---
  const gpuModels = [
    // Budget
    { chipBrand: 'AMD', model: 'Radeon RX 6600', vram: '8GB GDDR6', tdp: 132, tier: 'Budget', basePrice: 199 },
    { chipBrand: 'AMD', model: 'Radeon RX 6650 XT', vram: '8GB GDDR6', tdp: 176, tier: 'Budget', basePrice: 229 },
    { chipBrand: 'AMD', model: 'Radeon RX 7600', vram: '8GB GDDR6', tdp: 165, tier: 'Budget', basePrice: 259 },
    { chipBrand: 'AMD', model: 'Radeon RX 7600 XT', vram: '16GB GDDR6', tdp: 190, tier: 'Budget', basePrice: 309 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 3060', vram: '12GB GDDR6', tdp: 170, tier: 'Budget', basePrice: 279 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4060', vram: '8GB GDDR6', tdp: 115, tier: 'Budget', basePrice: 299 },
    { chipBrand: 'Intel', model: 'Arc B580 Limited', vram: '12GB GDDR6', tdp: 190, tier: 'Budget', basePrice: 259 },

    // Mid-Range
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4060 Ti', vram: '8GB GDDR6', tdp: 160, tier: 'Mid-Range', basePrice: 389 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4060 Ti 16GB', vram: '16GB GDDR6', tdp: 165, tier: 'Mid-Range', basePrice: 439 },
    { chipBrand: 'AMD', model: 'Radeon RX 6750 XT', vram: '12GB GDDR6', tdp: 250, tier: 'Mid-Range', basePrice: 339 },
    { chipBrand: 'AMD', model: 'Radeon RX 7700 XT', vram: '12GB GDDR6', tdp: 245, tier: 'Mid-Range', basePrice: 399 },
    { chipBrand: 'AMD', model: 'Radeon RX 7800 XT', vram: '16GB GDDR6', tdp: 263, tier: 'Mid-Range', basePrice: 489 },
    { chipBrand: 'AMD', model: 'Radeon RX 9070', vram: '16GB GDDR6', tdp: 220, tier: 'Mid-Range', basePrice: 549 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4070', vram: '12GB GDDR6X', tdp: 200, tier: 'Mid-Range', basePrice: 539 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4070 SUPER', vram: '12GB GDDR6X', tdp: 220, tier: 'Mid-Range', basePrice: 599 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 5070', vram: '12GB GDDR7', tdp: 250, tier: 'Mid-Range', basePrice: 579 },
    { chipBrand: 'AMD', model: 'Radeon RX 7900 GRE', vram: '16GB GDDR6', tdp: 260, tier: 'Mid-Range', basePrice: 549 },

    // Flagship
    { chipBrand: 'AMD', model: 'Radeon RX 9070 XT', vram: '16GB GDDR6', tdp: 304, tier: 'Flagship', basePrice: 649 },
    { chipBrand: 'AMD', model: 'Radeon RX 7900 XT', vram: '20GB GDDR6', tdp: 315, tier: 'Flagship', basePrice: 689 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4070 Ti SUPER', vram: '16GB GDDR6X', tdp: 285, tier: 'Flagship', basePrice: 799 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 5070 Ti', vram: '16GB GDDR7', tdp: 300, tier: 'Flagship', basePrice: 789 },
    { chipBrand: 'AMD', model: 'Radeon RX 7900 XTX', vram: '24GB GDDR6', tdp: 355, tier: 'Flagship', basePrice: 899 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4080 SUPER', vram: '16GB GDDR6X', tdp: 320, tier: 'Flagship', basePrice: 999 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 5080', vram: '16GB GDDR7', tdp: 360, tier: 'Flagship', basePrice: 1099 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 4090', vram: '24GB GDDR6X', tdp: 450, tier: 'Flagship', basePrice: 1749 },
    { chipBrand: 'NVIDIA', model: 'GeForce RTX 5090', vram: '32GB GDDR7', tdp: 575, tier: 'Flagship', basePrice: 2199 }
  ];

  const aibPartners = [
    { partner: 'ASUS', trim: 'Dual / TUF Gaming OC', delta: 20 },
    { partner: 'MSI', trim: 'Ventus 3X / Gaming Trio', delta: 15 },
    { partner: 'Gigabyte', trim: 'Eagle / AORUS Master', delta: 10 },
    { partner: 'Sapphire / Zotac', trim: 'Nitro+ / Twin Edge OC', delta: 0 },
    { partner: 'ASUS ROG / PowerColor', trim: 'ROG Astral / Red Devil', delta: 65 }
  ];

  gpuModels.forEach((g, idx) => {
    aibPartners.forEach((aib, aIdx) => {
      let brandLabel = aib.partner;
      if (aib.partner === 'Sapphire / Zotac') {
        brandLabel = g.chipBrand === 'AMD' ? 'Sapphire' : 'Zotac';
      } else if (aib.partner === 'ASUS ROG / PowerColor') {
        brandLabel = g.chipBrand === 'AMD' ? 'PowerColor' : 'ASUS ROG';
      }
      const trimLabel = aib.trim.includes('/')
        ? g.tier === 'Budget'
          ? aib.trim.split('/')[0].trim()
          : aib.trim.split('/')[1].trim()
        : aib.trim;
      db.gpu.push({
        id: `gpu-${idx}-${aIdx}`,
        sku: `GPU-${g.chipBrand.toUpperCase()}-${3000 + idx * 10 + aIdx}`,
        category: 'gpu',
        brand: brandLabel,
        chipBrand: g.chipBrand,
        name: `${brandLabel} ${g.model} ${trimLabel}`,
        shortName: `${brandLabel} ${g.model}`,
        tier: g.tier,
        price: g.basePrice + aib.delta,
        wattage: g.tdp,
        specsSummary: `${g.vram} • ${g.chipBrand} • ${g.tdp}W TBP`,
        specs: {
          Architecture: g.chipBrand,
          VRAM: g.vram,
          'Board Power': `${g.tdp}W`,
          'Thermal Shroud': aIdx === 4 ? 'Vapor Chamber Tri-Fan' : 'Axial-Tech Cooling'
        }
      });
    });
  });

  // --- D. RAM (112 Realistic SKUs) ---
  const ramBrands = ['Corsair', 'G.Skill', 'Kingston', 'TeamGroup', 'Crucial', 'Patriot', 'ADATA', 'PNY'];
  const ramKits = [
    // Budget
    { series: 'Vengeance LPX / Ripjaws V', ramType: 'DDR4', capacity: '16GB (2x8GB)', speed: '3200 MT/s', cas: 'CL16', tier: 'Budget', basePrice: 36 },
    { series: 'Fury Beast / T-Force Vulcan', ramType: 'DDR4', capacity: '16GB (2x8GB)', speed: '3600 MT/s', cas: 'CL18', tier: 'Budget', basePrice: 41 },
    { series: 'Vengeance RGB Pro / Trident Z', ramType: 'DDR4', capacity: '32GB (2x16GB)', speed: '3200 MT/s', cas: 'CL16', tier: 'Budget', basePrice: 64 },
    { series: 'Pro DDR5 / Flare X5', ramType: 'DDR5', capacity: '16GB (2x8GB)', speed: '5200 MT/s', cas: 'CL40', tier: 'Budget', basePrice: 54 },
    { series: 'Vengeance / T-Create Expert', ramType: 'DDR5', capacity: '32GB (2x16GB)', speed: '5600 MT/s', cas: 'CL36', tier: 'Budget', basePrice: 85 },

    // Mid-Range
    { series: 'Flare X5 / Vengeance', ramType: 'DDR5', capacity: '32GB (2x16GB)', speed: '6000 MT/s', cas: 'CL30', tier: 'Mid-Range', basePrice: 102 },
    { series: 'Trident Z5 Neo RGB', ramType: 'DDR5', capacity: '32GB (2x16GB)', speed: '6000 MT/s', cas: 'CL30', tier: 'Mid-Range', basePrice: 115 },
    { series: 'Vengeance RGB DDR5', ramType: 'DDR5', capacity: '32GB (2x16GB)', speed: '6400 MT/s', cas: 'CL32', tier: 'Mid-Range', basePrice: 122 },
    { series: 'T-Force Delta RGB', ramType: 'DDR5', capacity: '32GB (2x16GB)', speed: '7200 MT/s', cas: 'CL34', tier: 'Mid-Range', basePrice: 139 },
    { series: 'Fury Renegade RGB', ramType: 'DDR5', capacity: '48GB (2x24GB)', speed: '6400 MT/s', cas: 'CL32', tier: 'Mid-Range', basePrice: 165 },

    // Flagship
    { series: 'Dominator Titanium RGB', ramType: 'DDR5', capacity: '64GB (2x32GB)', speed: '6000 MT/s', cas: 'CL30', tier: 'Flagship', basePrice: 229 },
    { series: 'Trident Z5 Royal Neo', ramType: 'DDR5', capacity: '64GB (2x32GB)', speed: '6400 MT/s', cas: 'CL32', tier: 'Flagship', basePrice: 249 },
    { series: 'Vengeance RGB CUDIMM', ramType: 'DDR5', capacity: '48GB (2x24GB)', speed: '8400 MT/s', cas: 'CL40', tier: 'Flagship', basePrice: 299 },
    { series: 'Dominator Titanium Workstation', ramType: 'DDR5', capacity: '192GB (4x48GB)', speed: '5600 MT/s', cas: 'CL38', tier: 'Flagship', basePrice: 649 }
  ];

  ramKits.forEach((k, idx) => {
    ramBrands.forEach((brand, bIdx) => {
      db.ram.push({
        id: `ram-${idx}-${bIdx}`,
        sku: `MEM-${k.ramType}-${4000 + idx * 10 + bIdx}`,
        category: 'ram',
        brand,
        name: `${brand} ${k.series} ${k.capacity} ${k.ramType}-${k.speed.split(' ')[0]}`,
        shortName: `${brand} ${k.capacity} ${k.ramType}-${k.speed.split(' ')[0]}`,
        tier: k.tier,
        price: k.basePrice + (bIdx % 4) * 4,
        wattage: 10,
        ramType: k.ramType,
        specsSummary: `${k.ramType} • ${k.capacity} • ${k.speed} • ${k.cas}`,
        specs: {
          Generation: k.ramType,
          Capacity: k.capacity,
          Frequency: k.speed,
          Latency: k.cas
        }
      });
    });
  });

  // --- E. Storage / NVMe SSD (112 Realistic SKUs) ---
  const ssdBrands = ['Samsung', 'WD_BLACK', 'Crucial', 'Kingston', 'Sabrent', 'Seagate', 'SK Hynix', 'Corsair'];
  const ssdTiers = [
    // Budget
    { model: 'NV2 / P3 Plus Gen4', capacity: '500GB', interface: 'PCIe 4.0 x4', read: '3,500 MB/s', tier: 'Budget', basePrice: 38 },
    { model: 'NV3 / P3 Plus Gen4', capacity: '1TB', interface: 'PCIe 4.0 x4', read: '5,000 MB/s', tier: 'Budget', basePrice: 59 },
    { model: 'SN580 Blue NVMe', capacity: '1TB', interface: 'PCIe 4.0 x4', read: '4,150 MB/s', tier: 'Budget', basePrice: 64 },
    { model: '980 / P31 Gold NVMe', capacity: '1TB', interface: 'PCIe 3.0 x4', read: '3,500 MB/s', tier: 'Budget', basePrice: 69 },

    // Mid-Range
    { model: '980 PRO / SN850X', capacity: '1TB', interface: 'PCIe 4.0 x4', read: '7,300 MB/s', tier: 'Mid-Range', basePrice: 89 },
    { model: '990 EVO Plus', capacity: '1TB', interface: 'PCIe 4.0/5.0', read: '7,250 MB/s', tier: 'Mid-Range', basePrice: 94 },
    { model: 'Platinum P41 / KC3000', capacity: '2TB', interface: 'PCIe 4.0 x4', read: '7,000 MB/s', tier: 'Mid-Range', basePrice: 139 },
    { model: 'SN850X / 990 PRO', capacity: '2TB', interface: 'PCIe 4.0 x4', read: '7,450 MB/s', tier: 'Mid-Range', basePrice: 159 },
    { model: 'T500 Gen4 NVMe', capacity: '2TB', interface: 'PCIe 4.0 x4', read: '7,400 MB/s', tier: 'Mid-Range', basePrice: 149 },

    // Flagship
    { model: 'T700 / MP700 PRO Gen5', capacity: '2TB', interface: 'PCIe 5.0 x4', read: '12,400 MB/s', tier: 'Flagship', basePrice: 239 },
    { model: 'T705 / 9100 PRO Gen5', capacity: '2TB', interface: 'PCIe 5.0 x4', read: '14,700 MB/s', tier: 'Flagship', basePrice: 279 },
    { model: '990 PRO / SN850X Heatsink', capacity: '4TB', interface: 'PCIe 4.0 x4', read: '7,450 MB/s', tier: 'Flagship', basePrice: 299 },
    { model: 'T705 / FireCuda 540 Gen5', capacity: '4TB', interface: 'PCIe 5.0 x4', read: '14,100 MB/s', tier: 'Flagship', basePrice: 449 },
    { model: 'Rocket 4 Plus / SN850X', capacity: '8TB', interface: 'PCIe 4.0 x4', read: '7,200 MB/s', tier: 'Flagship', basePrice: 649 }
  ];

  ssdTiers.forEach((s, idx) => {
    ssdBrands.forEach((brand, bIdx) => {
      db.storage.push({
        id: `ssd-${idx}-${bIdx}`,
        sku: `SSD-NVME-${5000 + idx * 10 + bIdx}`,
        category: 'storage',
        brand,
        name: `${brand} ${s.model} ${s.capacity} M.2 NVMe`,
        shortName: `${brand} ${s.capacity} ${s.interface.split(' ')[0]} NVMe`,
        tier: s.tier,
        price: s.basePrice + (bIdx % 4) * 5,
        wattage: 8,
        specsSummary: `${s.capacity} • ${s.interface} • Up to ${s.read}`,
        specs: {
          Capacity: s.capacity,
          Bus: s.interface,
          'Read Speed': s.read,
          'Form Factor': 'M.2 2280'
        }
      });
    });
  });

  // --- F. Power Supplies / PSU (104 Realistic SKUs) ---
  const psuBrands = ['Corsair', 'Seasonic', 'MSI', 'ASUS', 'be quiet!', 'Cooler Master', 'Thermaltake', 'EVGA'];
  const psuModels = [
    // Budget
    { series: 'CX550 / MWE Bronze', watts: 550, rating: '80+ Bronze', modular: 'Non-Modular', tier: 'Budget', basePrice: 54 },
    { series: 'MAG A650BN / CV650', watts: 650, rating: '80+ Bronze', modular: 'Non-Modular', tier: 'Budget', basePrice: 64 },
    { series: 'CX750 / Smart BM3', watts: 750, rating: '80+ Bronze', modular: 'Semi-Modular', tier: 'Budget', basePrice: 79 },
    { series: 'RM650 / Focus GX-650', watts: 650, rating: '80+ Gold', modular: 'Fully Modular', tier: 'Budget', basePrice: 89 },

    // Mid-Range
    { series: 'RM750e / MAG A750GL PCIe5', watts: 750, rating: '80+ Gold', modular: 'Fully Modular', tier: 'Mid-Range', basePrice: 105 },
    { series: 'Focus GX-750 ATX 3.1', watts: 750, rating: '80+ Gold', modular: 'Fully Modular', tier: 'Mid-Range', basePrice: 115 },
    { series: 'RM850x / MAG A850GL PCIe5', watts: 850, rating: '80+ Gold', modular: 'Fully Modular', tier: 'Mid-Range', basePrice: 129 },
    { series: 'Dark Power 13 / Pure Power 850W', watts: 850, rating: '80+ Gold', modular: 'Fully Modular', tier: 'Mid-Range', basePrice: 135 },
    { series: 'ROG Loki SFX-L 850W Platinum', watts: 850, rating: '80+ Platinum', modular: 'Fully Modular', tier: 'Mid-Range', basePrice: 179 },

    // Flagship
    { series: 'RM1000x Shift / Vertex GX-1000', watts: 1000, rating: '80+ Gold', modular: 'Fully Modular', tier: 'Flagship', basePrice: 179 },
    { series: 'HX1000i / Vertex PX-1000', watts: 1000, rating: '80+ Platinum', modular: 'Fully Modular', tier: 'Flagship', basePrice: 229 },
    { series: 'ROG Thor 1200P2 / MEG Ai1300P', watts: 1200, rating: '80+ Platinum', modular: 'Fully Modular', tier: 'Flagship', basePrice: 289 },
    { series: 'AX1600i / Prime TX-1600 Titanium', watts: 1600, rating: '80+ Titanium', modular: 'Fully Modular', tier: 'Flagship', basePrice: 449 }
  ];

  psuModels.forEach((p, idx) => {
    psuBrands.forEach((brand, bIdx) => {
      db.psu.push({
        id: `psu-${idx}-${bIdx}`,
        sku: `PSU-${p.watts}W-${6000 + idx * 10 + bIdx}`,
        category: 'psu',
        brand,
        name: `${brand} ${p.series} (${p.watts}W ${p.rating})`,
        shortName: `${brand} ${p.watts}W ${p.rating}`,
        tier: p.tier,
        price: p.basePrice + (bIdx % 4) * 5,
        wattage: 0,
        psuWattage: p.watts,
        specsSummary: `${p.watts}W • ${p.rating} • ${p.modular}`,
        specs: {
          Output: `${p.watts}W`,
          Efficiency: p.rating,
          Cabling: p.modular,
          Standard: p.watts >= 750 ? 'ATX 3.1 / PCIe 5.1' : 'ATX 2.52'
        }
      });
    });
  });

  // --- G. CPU Coolers (104 Realistic SKUs) ---
  const coolerBrands = ['Thermalright', 'Noctua', 'Corsair', 'Arctic', 'NZXT', 'DeepCool', 'Lian Li', 'ASUS ROG'];
  const coolerTypes = [
    // Budget
    { model: 'Assassin X 120 Refined SE', type: 'Air Cooler', radiator: '120mm Single Tower', maxTdp: 180, tier: 'Budget', basePrice: 22 },
    { model: 'AK400 Digital / Hyper 212', type: 'Air Cooler', radiator: '120mm Single Tower', maxTdp: 200, tier: 'Budget', basePrice: 32 },
    { model: 'Peerless Assassin 120 SE', type: 'Air Cooler', radiator: '120mm Dual Tower', maxTdp: 260, tier: 'Budget', basePrice: 38 },
    { model: 'Phantom Spirit 120 EVO', type: 'Air Cooler', radiator: '120mm Dual Tower', maxTdp: 280, tier: 'Budget', basePrice: 49 },

    // Mid-Range
    { model: 'Assassin IV / AK620 Zero Dark', type: 'Air Cooler', radiator: '140mm Dual Tower', maxTdp: 280, tier: 'Mid-Range', basePrice: 79 },
    { model: 'NH-D15 G2 chromax.black', type: 'Air Cooler', radiator: '140mm Dual Tower', maxTdp: 300, tier: 'Mid-Range', basePrice: 119 },
    { model: 'Liquid Freezer III 240', type: 'AIO Liquid', radiator: '240mm Radiator', maxTdp: 300, tier: 'Mid-Range', basePrice: 95 },
    { model: 'Liquid Freezer III 280 ARGB', type: 'AIO Liquid', radiator: '280mm Radiator', maxTdp: 330, tier: 'Mid-Range', basePrice: 112 },
    { model: 'Liquid Freezer III 360 ARGB', type: 'AIO Liquid', radiator: '360mm Radiator', maxTdp: 350, tier: 'Mid-Range', basePrice: 129 },

    // Flagship
    { model: 'Galahad II Trinity Performance 360', type: 'AIO Liquid', radiator: '360mm Radiator', maxTdp: 380, tier: 'Flagship', basePrice: 169 },
    { model: 'iCUE LINK H150i LCD 360mm', type: 'AIO Liquid', radiator: '360mm IPS LCD', maxTdp: 380, tier: 'Flagship', basePrice: 219 },
    { model: 'Kraken Elite 360 RGB (2024)', type: 'AIO Liquid', radiator: '360mm IPS LCD', maxTdp: 380, tier: 'Flagship', basePrice: 259 },
    { model: 'Ryujin III 360 ARGB Extreme', type: 'AIO Liquid', radiator: '360mm OLED LCD', maxTdp: 420, tier: 'Flagship', basePrice: 319 }
  ];

  coolerTypes.forEach((c, idx) => {
    coolerBrands.forEach((brand, bIdx) => {
      db.cooler.push({
        id: `cooler-${idx}-${bIdx}`,
        sku: `CLG-${c.type === 'AIO Liquid' ? 'AIO' : 'AIR'}-${7000 + idx * 10 + bIdx}`,
        category: 'cooler',
        brand,
        name: `${brand} ${c.model}`,
        shortName: `${brand} ${c.model}`,
        tier: c.tier,
        price: c.basePrice + (bIdx % 4) * 4,
        wattage: c.type === 'AIO Liquid' ? 15 : 5,
        coolerType: c.type,
        specsSummary: `${c.type} • ${c.radiator} • Up to ${c.maxTdp}W TDP`,
        specs: {
          Architecture: c.type,
          Radiator: c.radiator,
          'Thermal Limit': `${c.maxTdp}W TDP`,
          Sockets: 'AM4 / AM5 / LGA1700 / LGA1851'
        }
      });
    });
  });

  // --- H. PC Cases / Cabinets (104 Realistic SKUs) ---
  const caseBrands = ['Lian Li', 'NZXT', 'Corsair', 'Fractal Design', 'Phanteks', 'Montech', 'Hyte', 'Cooler Master'];
  const caseModels = [
    // Budget
    { model: 'Air 100 ARGB Micro-ATX', supportedFormFactors: ['Micro-ATX', 'Mini-ITX'], style: 'High-Airflow Mesh', tier: 'Budget', basePrice: 59 },
    { model: 'Pop Air RGB Mid-Tower', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Mesh Front', tier: 'Budget', basePrice: 79 },
    { model: '4000D Airflow Mid-Tower', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Minimalist Mesh', tier: 'Budget', basePrice: 89 },
    { model: 'Lancool 207 Compact ATX', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Bottom Intake Mesh', tier: 'Budget', basePrice: 84 },

    // Mid-Range
    { model: 'H6 Flow RGB Dual-Chamber', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Panoramic Wrap', tier: 'Mid-Range', basePrice: 119 },
    { model: 'Lancool 216 RGB', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Dual 160mm Fans', tier: 'Mid-Range', basePrice: 105 },
    { model: 'North Charcoal Black TG', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Walnut Wood Slat', tier: 'Mid-Range', basePrice: 139 },
    { model: 'O11 Vision Compact', supportedFormFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], style: '3-Side Frameless Glass', tier: 'Mid-Range', basePrice: 125 },
    { model: 'Torrent Compact RGB', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], style: '180mm Dynamic Fans', tier: 'Mid-Range', basePrice: 149 },

    // Flagship
    { model: 'O11 Dynamic EVO RGB', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Dual-Chamber Showcase', tier: 'Flagship', basePrice: 169 },
    { model: 'Y70 Touch Infinite Dual-Chamber', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], style: '4K Capacitive LCD', tier: 'Flagship', basePrice: 359 },
    { model: 'NV9 Showcase Full-Tower', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Seamless Glass', tier: 'Flagship', basePrice: 249 },
    { model: 'H9 Elite Dual-Chamber', supportedFormFactors: ['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX'], style: 'Tempered Glass Top/Side', tier: 'Flagship', basePrice: 239 }
  ];

  caseModels.forEach((cs, idx) => {
    caseBrands.forEach((brand, bIdx) => {
      db.case.push({
        id: `case-${idx}-${bIdx}`,
        sku: `CHS-ATX-${8000 + idx * 10 + bIdx}`,
        category: 'case',
        brand,
        name: `${brand} ${cs.model}`,
        shortName: `${brand} ${cs.model}`,
        tier: cs.tier,
        price: cs.basePrice + (bIdx % 4) * 6,
        wattage: 10,
        supportedFormFactors: cs.supportedFormFactors,
        specsSummary: `${cs.supportedFormFactors.join('/')} • ${cs.style}`,
        specs: {
          'Board Fitment': cs.supportedFormFactors.join(', '),
          Architecture: cs.style,
          'Max GPU': cs.tier === 'Flagship' ? '450mm' : '380mm',
          'Front I/O': 'USB-C 3.2 Gen 2x2 + Dual USB-A'
        }
      });
    });
  });

  return db;
}

const COMPONENT_DB = generateComponentDatabase();

// ============================================================================
// 4. COMPATIBILITY ENGINE
// ============================================================================
function checkPartCompatibility(part, currentBuild) {
  const issues = [];

  if (part.category === 'cpu' && currentBuild.motherboard) {
    if (part.socket !== currentBuild.motherboard.socket) {
      issues.push(`Socket mismatch: CPU is ${part.socket}, Motherboard is ${currentBuild.motherboard.socket}`);
    }
  }
  if (part.category === 'motherboard' && currentBuild.cpu) {
    if (part.socket !== currentBuild.cpu.socket) {
      issues.push(`Socket mismatch: Motherboard is ${part.socket}, CPU is ${currentBuild.cpu.socket}`);
    }
  }

  if (part.category === 'ram' && currentBuild.motherboard) {
    if (part.ramType !== currentBuild.motherboard.ramType) {
      issues.push(`Memory mismatch: RAM is ${part.ramType}, Motherboard supports ${currentBuild.motherboard.ramType}`);
    }
  }
  if (part.category === 'motherboard' && currentBuild.ram) {
    if (part.ramType !== currentBuild.ram.ramType) {
      issues.push(`Memory mismatch: Motherboard uses ${part.ramType}, selected RAM is ${currentBuild.ram.ramType}`);
    }
  }

  if (part.category === 'cpu' && currentBuild.ram) {
    if (!part.ramType.includes(currentBuild.ram.ramType)) {
      issues.push(`CPU requires ${part.ramType}, but ${currentBuild.ram.ramType} RAM is selected`);
    }
  }
  if (part.category === 'ram' && currentBuild.cpu) {
    if (!currentBuild.cpu.ramType.includes(part.ramType)) {
      issues.push(`Selected CPU supports ${currentBuild.cpu.ramType}, not ${part.ramType}`);
    }
  }

  if (part.category === 'case' && currentBuild.motherboard) {
    if (!part.supportedFormFactors.includes(currentBuild.motherboard.formFactor)) {
      issues.push(`Chassis cannot mount ${currentBuild.motherboard.formFactor} motherboards`);
    }
  }
  if (part.category === 'motherboard' && currentBuild.case) {
    if (!currentBuild.case.supportedFormFactors.includes(part.formFactor)) {
      issues.push(`${part.formFactor} board does not fit inside ${currentBuild.case.shortName}`);
    }
  }

  if (part.category === 'psu') {
    const otherWatts = Object.values(currentBuild)
      .filter((p) => p && p.category !== 'psu')
      .reduce((sum, p) => sum + (p.wattage || 0), 0);
    if (part.psuWattage < otherWatts + 50) {
      issues.push(`Low headroom: ${part.psuWattage}W PSU for ~${otherWatts}W estimated load`);
    }
  }

  return {
    compatible: issues.length === 0,
    issues
  };
}

function analyzeFullBuild(build) {
  const warnings = [];
  const errors = [];

  const selectedParts = Object.values(build).filter(Boolean);
  const estimatedWattage = selectedParts.reduce((acc, p) => acc + (p.wattage || 0), 0);

  if (build.cpu && build.motherboard && build.cpu.socket !== build.motherboard.socket) {
    errors.push(`CPU (${build.cpu.socket}) is incompatible with Motherboard (${build.motherboard.socket}).`);
  }
  if (build.motherboard && build.ram && build.motherboard.ramType !== build.ram.ramType) {
    errors.push(`Motherboard requires ${build.motherboard.ramType} memory, but ${build.ram.ramType} is selected.`);
  }
  if (build.cpu && build.ram && !build.cpu.ramType.includes(build.ram.ramType)) {
    errors.push(`CPU supports ${build.cpu.ramType}, incompatible with ${build.ram.ramType} RAM.`);
  }
  if (build.motherboard && build.case && !build.case.supportedFormFactors.includes(build.motherboard.formFactor)) {
    errors.push(`${build.motherboard.formFactor} Motherboard will not fit in ${build.case.shortName}.`);
  }
  if (build.psu) {
    if (build.psu.psuWattage < estimatedWattage) {
      errors.push(`Power Deficit: Estimated system draw (${estimatedWattage}W) exceeds PSU capacity (${build.psu.psuWattage}W).`);
    } else if (build.psu.psuWattage < estimatedWattage + 100) {
      warnings.push(`Tight Power Headroom: ${estimatedWattage}W estimated load on a ${build.psu.psuWattage}W PSU (recommend +150W buffer).`);
    }
  }

  return {
    estimatedWattage,
    errors,
    warnings,
    status: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid'
  };
}

// ============================================================================
// 5. FUTURISTIC PRESET BUILDS
// ============================================================================
const PRESET_BUILDS = {
  budget: {
    name: 'Starter Cyber-Rig 1080p',
    badge: 'Starter Cyber-Rig',
    parts: {
      cpu: COMPONENT_DB.cpu.find((p) => p.shortName.includes('Ryzen 5 5600')) || COMPONENT_DB.cpu[0],
      motherboard: COMPONENT_DB.motherboard.find((p) => p.socket === 'AM4' && p.ramType === 'DDR4') || COMPONENT_DB.motherboard[0],
      gpu: COMPONENT_DB.gpu.find((p) => p.shortName.includes('RTX 4060') && !p.shortName.includes('Ti')) || COMPONENT_DB.gpu[0],
      ram: COMPONENT_DB.ram.find((p) => p.ramType === 'DDR4' && p.specs.Capacity.includes('16GB')) || COMPONENT_DB.ram[0],
      storage: COMPONENT_DB.storage.find((p) => p.tier === 'Budget' && p.specs.Capacity === '1TB') || COMPONENT_DB.storage[0],
      psu: COMPONENT_DB.psu.find((p) => p.psuWattage === 650 && p.tier === 'Budget') || COMPONENT_DB.psu[0],
      cooler: COMPONENT_DB.cooler.find((p) => p.tier === 'Budget') || COMPONENT_DB.cooler[0],
      case: COMPONENT_DB.case.find((p) => p.tier === 'Budget' && p.supportedFormFactors.includes('Micro-ATX')) || COMPONENT_DB.case[0]
    }
  },
  midrange: {
    name: '1440p Apex Striker',
    badge: '1440p Apex Striker',
    parts: {
      cpu: COMPONENT_DB.cpu.find((p) => p.shortName.includes('Ryzen 7 7800X3D')) || COMPONENT_DB.cpu[20],
      motherboard: COMPONENT_DB.motherboard.find((p) => p.socket === 'AM5' && p.tier === 'Mid-Range') || COMPONENT_DB.motherboard[40],
      gpu: COMPONENT_DB.gpu.find((p) => p.shortName.includes('RTX 4070 SUPER')) || COMPONENT_DB.gpu[45],
      ram: COMPONENT_DB.ram.find((p) => p.ramType === 'DDR5' && p.specs.Frequency === '6000 MT/s' && p.tier === 'Mid-Range') || COMPONENT_DB.ram[40],
      storage: COMPONENT_DB.storage.find((p) => p.tier === 'Mid-Range' && p.specs.Capacity === '2TB') || COMPONENT_DB.storage[50],
      psu: COMPONENT_DB.psu.find((p) => p.psuWattage === 850 && p.tier === 'Mid-Range') || COMPONENT_DB.psu[48],
      cooler: COMPONENT_DB.cooler.find((p) => p.tier === 'Mid-Range' && p.coolerType === 'AIO Liquid') || COMPONENT_DB.cooler[50],
      case: COMPONENT_DB.case.find((p) => p.tier === 'Mid-Range') || COMPONENT_DB.case[36]
    }
  },
  flagship: {
    name: '4K Quantum Flagship',
    badge: '4K Quantum Flagship',
    parts: {
      cpu: COMPONENT_DB.cpu.find((p) => p.shortName.includes('Ryzen 9 9950X')) || COMPONENT_DB.cpu[COMPONENT_DB.cpu.length - 3],
      motherboard: COMPONENT_DB.motherboard.find((p) => p.socket === 'AM5' && p.tier === 'Flagship' && p.formFactor === 'ATX') || COMPONENT_DB.motherboard[80],
      gpu: COMPONENT_DB.gpu.find((p) => p.shortName.includes('RTX 5090')) || COMPONENT_DB.gpu[COMPONENT_DB.gpu.length - 1],
      ram: COMPONENT_DB.ram.find((p) => p.tier === 'Flagship' && p.specs.Capacity.includes('64GB')) || COMPONENT_DB.ram[80],
      storage: COMPONENT_DB.storage.find((p) => p.tier === 'Flagship' && p.specs.Capacity === '4TB') || COMPONENT_DB.storage[90],
      psu: COMPONENT_DB.psu.find((p) => p.psuWattage === 1200 && p.tier === 'Flagship') || COMPONENT_DB.psu[88],
      cooler: COMPONENT_DB.cooler.find((p) => p.tier === 'Flagship') || COMPONENT_DB.cooler[85],
      case: COMPONENT_DB.case.find((p) => p.tier === 'Flagship') || COMPONENT_DB.case[80]
    }
  }
};

// ============================================================================
// 6. DYNAMIC JSPDF + AUTOTABLE LOADER & ALIGNED A4 PDF SPECIFICATION SHEET
// ============================================================================
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function exportBuildToPDF({ build, buildName, builderName, currency, includeTax, analysis }) {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // --- Header Banner (Obsidian Aerospace Theme) ---
    doc.setFillColor(9, 13, 22); // #090d16
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Cyan/Violet Dual Accent Bar
    doc.setFillColor(6, 182, 212); // Cyan-500
    doc.rect(0, 40, pageWidth * 0.65, 1.6, 'F');
    doc.setFillColor(139, 92, 246); // Violet-500
    doc.rect(pageWidth * 0.65, 40, pageWidth * 0.35, 1.6, 'F');

    // Brand Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('SLEEKRIG // NEXUS', margin, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(56, 189, 248); // Sky-400
    doc.text('AEROSPACE-GRADE CUSTOM SYSTEM CONFIGURATION MANIFEST', margin, 24);

    if (builderName && builderName.trim()) {
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Prepared For: ${builderName.trim().slice(0, 40)}`, margin, 31);
    }

    // Right side metadata
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const refCode = `NX-${Math.floor(100000 + Math.random() * 900000)}`;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`MANIFEST ID: ${refCode}`, pageWidth - margin, 16, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(203, 213, 225);
    doc.text(`Date: ${dateStr}  |  Currency: ${currency}`, pageWidth - margin, 23, { align: 'right' });

    // --- Build Telemetry Strip ---
    const stripY = 47;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, stripY, contentWidth, 20, 2, 2, 'FD');

    // Col 1: Build Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text('SYSTEM DESIGNATION', margin + 4, stripY + 6.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text((buildName || 'Nexus Custom Workstation').slice(0, 34), margin + 4, stripY + 14);

    // Col 2: Power Draw
    const col2X = margin + 84;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text('THERMAL / POWER LOAD', col2X, stripY + 6.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    const psuCap = build.psu ? ` / ${build.psu.psuWattage}W PSU` : '';
    doc.text(`${analysis.estimatedWattage}W${psuCap}`, col2X, stripY + 14);

    // Col 3: Compatibility
    const col3X = margin + 136;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(100, 116, 139);
    doc.text('DIAGNOSTIC STATUS', col3X, stripY + 6.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if (analysis.status === 'error') {
      doc.setTextColor(220, 38, 38);
      doc.text('CONFLICT DETECTED', col3X, stripY + 14);
    } else if (analysis.status === 'warning') {
      doc.setTextColor(217, 119, 6);
      doc.text('PSU HEADROOM LOW', col3X, stripY + 14);
    } else {
      doc.setTextColor(5, 150, 105);
      doc.text('100% VERIFIED', col3X, stripY + 14);
    }

    // --- Component Table ---
    const tableRows = CATEGORIES.map((cat) => {
      const item = build[cat.id];
      if (!item) {
        return [
          cat.shortName,
          'Unassigned Slot',
          '—',
          '—',
          formatPrice(0, currency, true)
        ];
      }
      return [
        cat.shortName,
        item.name,
        item.specsSummary,
        item.tier,
        formatPrice(item.price, currency, true)
      ];
    });

    doc.autoTable({
      startY: stripY + 26,
      margin: { left: margin, right: margin },
      head: [['Subsystem', 'Selected Hardware Component', 'Technical Specifications', 'Tier', 'Unit Price']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5,
        cellPadding: 3.5,
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8.4,
        textColor: [30, 41, 59],
        cellPadding: 3.5,
        valign: 'middle',
        lineColor: [226, 232, 240],
        lineWidth: 0.2
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold', textColor: [71, 85, 105] },
        1: { cellWidth: 62, fontStyle: 'bold' },
        2: { cellWidth: 50, fontSize: 7.7, textColor: [71, 85, 105] },
        3: { cellWidth: 19, halign: 'center', fontSize: 7.7 },
        4: { cellWidth: 26, halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: function (data) {
        if (data.section === 'head' && data.column.index === 4) {
          data.cell.styles.halign = 'right';
        }
        if (data.section === 'head' && data.column.index === 3) {
          data.cell.styles.halign = 'center';
        }
      }
    });

    // --- Totals & Summary Box ---
    const finalY = doc.lastAutoTable.finalY + 8;
    const subtotalUsd = Object.values(build)
      .filter(Boolean)
      .reduce((sum, item) => sum + item.price, 0);

    const currObj = CURRENCIES[currency] || CURRENCIES.USD;
    const taxUsd = includeTax ? subtotalUsd * currObj.taxRate : 0;
    const grandTotalUsd = subtotalUsd + taxUsd;

    const summaryBoxWidth = 86;
    const summaryBoxX = pageWidth - margin - summaryBoxWidth;
    const boxHeight = includeTax ? 36 : 28;

    if (analysis.errors.length > 0 || analysis.warnings.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9);
      doc.text('Telemetry Advisory Notes:', margin, finalY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);
      const notes = [...analysis.errors, ...analysis.warnings].slice(0, 3);
      notes.forEach((note, i) => {
        const wrapped = doc.splitTextToSize(`• ${note}`, contentWidth - summaryBoxWidth - 8);
        doc.text(wrapped, margin, finalY + 10 + i * 7);
      });
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(5, 150, 105);
      doc.text('Hardware Matrix Verified', margin, finalY + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(100, 116, 139);
      const okCopy = doc.splitTextToSize(
        'All selected subsystems pass socket topology, memory generation, chassis clearance, and PSU power headroom checks.',
        contentWidth - summaryBoxWidth - 8
      );
      doc.text(okCopy, margin, finalY + 10);
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(summaryBoxX, finalY, summaryBoxWidth, boxHeight, 2, 2, 'FD');

    let currentRowY = finalY + 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Hardware Subtotal:', summaryBoxX + 4, currentRowY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatPrice(subtotalUsd, currency, true), summaryBoxX + summaryBoxWidth - 4, currentRowY, { align: 'right' });

    if (includeTax) {
      currentRowY += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`${currObj.taxLabel}:`, summaryBoxX + 4, currentRowY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(formatPrice(taxUsd, currency, true), summaryBoxX + summaryBoxWidth - 4, currentRowY, { align: 'right' });
    }

    currentRowY += 4;
    doc.setDrawColor(203, 213, 225);
    doc.line(summaryBoxX + 4, currentRowY, summaryBoxX + summaryBoxWidth - 4, currentRowY);

    currentRowY += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(8, 145, 178); // Cyan-600
    doc.text('GRAND TOTAL:', summaryBoxX + 4, currentRowY);
    doc.text(formatPrice(grandTotalUsd, currency, true), summaryBoxX + summaryBoxWidth - 4, currentRowY, { align: 'right' });

    // --- Footer ---
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by SleekRig // NEXUS PC Configurator • Valuation in ${currObj.name} (${currency}) • Specifications & pricing subject to market availability.`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    const sanitizedFilename = (buildName || 'SleekRig-Nexus-Build')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    doc.save(`${sanitizedFilename}-${currency}.pdf`);
    return true;
  } catch (err) {
    console.error('PDF Generation failed:', err);
    return false;
  }
}

// ============================================================================
// 7. HUD CORNER BRACKETS & TIER BADGE COMPONENTS
// ============================================================================
function HudBrackets({ isDark, active = false }) {
  const colorClass = active
    ? isDark
      ? 'border-cyan-400'
      : 'border-blue-600'
    : isDark
    ? 'border-cyan-500/40 group-hover:border-cyan-400'
    : 'border-slate-300 group-hover:border-blue-500';

  return (
    <>
      <span className={`pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors ${colorClass}`} />
      <span className={`pointer-events-none absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors ${colorClass}`} />
      <span className={`pointer-events-none absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors ${colorClass}`} />
      <span className={`pointer-events-none absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors ${colorClass}`} />
    </>
  );
}

function TierBadge({ tier, isDark }) {
  const styles = isDark
    ? {
        Budget: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        'Mid-Range': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        Flagship: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
      }
    : {
        Budget: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Mid-Range': 'bg-blue-50 text-blue-700 border-blue-200',
        Flagship: 'bg-purple-50 text-purple-700 border-purple-200'
      };

  return (
    <span
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[tier] || styles.Budget}`}
    >
      {tier}
    </span>
  );
}

// ============================================================================
// 8. COMPONENT SELECTOR MODAL (SEARCHABLE 100+ ITEMS PER CATEGORY + WINDOWED)
// ============================================================================
function ComponentSelectorModal({
  isOpen,
  onClose,
  categoryId,
  currentBuild,
  onSelectPart,
  currency,
  isDark
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [compatibleOnly, setCompatibleOnly] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [visibleLimit, setVisibleLimit] = useState(40);

  useEffect(() => {
    setSearchQuery('');
    setSelectedTier('All');
    setSelectedBrand('All');
    setSortBy('featured');
    setVisibleLimit(40);
  }, [categoryId, isOpen]);

  useEffect(() => {
    setVisibleLimit(40);
  }, [searchQuery, selectedTier, selectedBrand, compatibleOnly, sortBy]);

  const categoryMeta = CATEGORIES.find((c) => c.id === categoryId);
  const allItems = useMemo(() => COMPONENT_DB[categoryId] || [], [categoryId]);

  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(allItems.map((i) => i.brand))).sort();
    return ['All', ...brands];
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = allItems.map((item) => {
      const compat = checkPartCompatibility(item, currentBuild);
      return { ...item, compat };
    });

    if (compatibleOnly) {
      list = list.filter((item) => item.compat.compatible);
    }
    if (selectedTier !== 'All') {
      list = list.filter((item) => item.tier === selectedTier);
    }
    if (selectedBrand !== 'All') {
      list = list.filter((item) => item.brand === selectedBrand);
    }
    if (q) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.specsSummary.toLowerCase().includes(q) ||
          item.tier.toLowerCase().includes(q) ||
          (item.sku && item.sku.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'wattage-desc') {
      list.sort((a, b) => (b.wattage || b.psuWattage || 0) - (a.wattage || a.psuWattage || 0));
    }

    return list;
  }, [allItems, currentBuild, compatibleOnly, selectedTier, selectedBrand, searchQuery, sortBy]);

  if (!isOpen || !categoryMeta) return null;
  const Icon = categoryMeta.icon;
  const currentSelected = currentBuild[categoryId];
  const visibleItems = filteredItems.slice(0, visibleLimit);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-0 sm:p-4">
      <div
        className={`relative w-full max-w-5xl h-[92vh] sm:h-[86vh] border sm:rounded-xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#090d16] border-cyan-500/30 text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.18)]'
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
      >
        <HudBrackets isDark={isDark} active />

        {/* Modal Header */}
        <div
          className={`px-4 sm:px-6 py-4 border-b flex items-center justify-between ${
            isDark
              ? 'bg-[#0d1322] border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-lg flex items-center justify-center border ${
                isDark
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-blue-600/10 border-blue-600/20 text-blue-600'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-cyan-500/15 text-cyan-400' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {categoryMeta.code}
                </span>
                <h2
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                  className={`text-base sm:text-lg font-bold tracking-wide uppercase ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {categoryMeta.name}
                </h2>
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-cyan-300'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {allItems.length} UNITS
                </span>
              </div>
              <p
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                DISPLAYING {filteredItems.length} VERIFIED MATCHES // VALUATION: {currency}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Close selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div
          className={`p-4 border-b space-y-3 ${
            isDark ? 'bg-[#0b101b] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Query ${allItems.length} ${categoryMeta.shortName} units by model, architecture, SKU, or brand...`}
                className={`w-full pl-10 pr-9 py-2.5 text-sm rounded-lg border outline-none transition-all ${
                  isDark
                    ? 'bg-[#121929] border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Brand & Sort Selects */}
            <div className="flex gap-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className={`px-3 py-2.5 text-sm rounded-lg border outline-none ${
                  isDark
                    ? 'bg-[#121929] border-slate-700 text-slate-200 focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-600'
                }`}
              >
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'All' ? 'All Manufacturers' : b}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2.5 text-sm rounded-lg border outline-none ${
                  isDark
                    ? 'bg-[#121929] border-slate-700 text-slate-200 focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-600'
                }`}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="wattage-desc">Power: Highest First</option>
              </select>
            </div>
          </div>

          {/* Tier Pills & Compatibility Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Budget', 'Mid-Range', 'Flagship'].map((tier) => {
                const active = selectedTier === tier;
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                      active
                        ? isDark
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isDark
                        ? 'bg-[#121929] border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tier === 'All' ? 'All Tiers' : tier}
                  </button>
                );
              })}
            </div>

            <label
              className={`inline-flex items-center gap-2 cursor-pointer select-none text-xs font-semibold px-3 py-1.5 rounded-md border ${
                isDark
                  ? 'bg-[#121929] border-slate-800 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={compatibleOnly}
                onChange={(e) => setCompatibleOnly(e.target.checked)}
                className="rounded accent-cyan-500 w-3.5 h-3.5"
              />
              <span>Compatible hardware only</span>
            </label>
          </div>
        </div>

        {/* Scrollable Component List */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-2.5 ${
            isDark ? 'bg-[#060911]' : 'bg-slate-50'
          }`}
        >
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-4">
              <SlidersHorizontal className={`w-10 h-10 mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className="text-base font-bold">No hardware modules match your active query</p>
              <p className={`text-xs mt-1 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Reset search parameters or disable compatibility filtering to inspect all {allItems.length} catalog units.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTier('All');
                  setSelectedBrand('All');
                  setCompatibleOnly(false);
                }}
                className={`mt-4 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white'
                }`}
              >
                Reset Matrix Filters
              </button>
            </div>
          ) : (
            <>
              {visibleItems.map((item) => {
                const isSelected = currentSelected?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? isDark
                          ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                          : 'bg-blue-50/90 border-blue-600 ring-1 ring-blue-600'
                        : item.compat.compatible
                        ? isDark
                          ? 'bg-[#0d1322] border-slate-800/90 hover:border-cyan-500/50'
                          : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                        : isDark
                        ? 'bg-rose-950/20 border-rose-900/50 opacity-80'
                        : 'bg-rose-50/60 border-rose-200 opacity-85'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.sku}
                        </span>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isDark ? 'text-cyan-400' : 'text-blue-600'
                          }`}
                        >
                          {item.brand}
                        </span>
                        <TierBadge tier={item.tier} isDark={isDark} />
                        {isSelected && (
                          <span
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                              isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-600 text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" /> INSTALLED
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold truncate">{item.name}</h3>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {Object.entries(item.specs).map(([k, v]) => (
                          <span
                            key={k}
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            className={`text-[11px] px-2 py-0.5 rounded border ${
                              isDark
                                ? 'bg-[#080c15] border-slate-800 text-slate-300'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{k}:</span> {v}
                          </span>
                        ))}
                      </div>

                      {!item.compat.compatible && (
                        <div className="flex items-start gap-1.5 text-xs text-rose-500 pt-1 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{item.compat.issues[0]}</span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 shrink-0 ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      <div className="text-left sm:text-right">
                        <div
                          style={{ fontFamily: "'Orbitron', sans-serif" }}
                          className={`text-base sm:text-lg font-extrabold ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {formatPrice(item.price, currency)}
                        </div>
                        {item.wattage > 0 && (
                          <div
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                          >
                            ~{item.wattage}W LOAD
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onSelectPart(categoryId, item);
                          onClose();
                        }}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-900 text-white'
                            : isDark
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isSelected ? 'Equipped' : '+ Equip'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {visibleLimit < filteredItems.length && (
                <div className="pt-3 pb-2 flex justify-center">
                  <button
                    onClick={() => setVisibleLimit((prev) => prev + 40)}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                      isDark
                        ? 'bg-[#0d1322] border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10'
                        : 'bg-white border-slate-300 text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    Load More ({filteredItems.length - visibleLimit} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. MAIN APPLICATION COMPONENT (SLEEKRIG // NEXUS EDITION)
// ============================================================================
export default function App() {
  // Explicit React state-driven theme (defaults to Dark Mode for futuristic cyber-void aesthetic)
  const [theme, setTheme] = useState('dark');
  const isDark = theme === 'dark';

  const [currency, setCurrency] = useState('USD');
  const [buildName, setBuildName] = useState('NEXUS // MK-IV WORKSTATION');
  const [builderName, setBuilderName] = useState('');
  const [includeTaxInPdf, setIncludeTaxInPdf] = useState(false);

  const [build, setBuild] = useState({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    storage: null,
    psu: null,
    cooler: null,
    case: null
  });

  const [activeModalCategory, setActiveModalCategory] = useState(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync .dark class on <html> and inject Google Fonts ('Orbitron', 'Rajdhani', 'JetBrains Mono')
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const fontHref =
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@500;700;800;900&family=Rajdhani:wght@500;600;700&display=swap';
    if (!document.querySelector(`link[href="${fontHref}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontHref;
      document.head.appendChild(link);
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const totalCatalogCount = useMemo(
    () => Object.values(COMPONENT_DB).reduce((sum, arr) => sum + arr.length, 0),
    []
  );

  const analysis = useMemo(() => analyzeFullBuild(build), [build]);

  const selectedCount = useMemo(
    () => Object.values(build).filter(Boolean).length,
    [build]
  );

  const subtotalUsd = useMemo(
    () =>
      Object.values(build)
        .filter(Boolean)
        .reduce((sum, item) => sum + item.price, 0),
    [build]
  );

  const currObj = CURRENCIES[currency] || CURRENCIES.USD;
  const estimatedTaxUsd = includeTaxInPdf ? subtotalUsd * currObj.taxRate : 0;
  const grandTotalUsd = subtotalUsd + estimatedTaxUsd;

  const wattagePercent = useMemo(() => {
    const cap = build.psu ? build.psu.psuWattage : 1000;
    return Math.min(100, Math.round((analysis.estimatedWattage / cap) * 100));
  }, [analysis.estimatedWattage, build.psu]);

  const handleSelectPart = (categoryId, part) => {
    setBuild((prev) => ({ ...prev, [categoryId]: part }));
    triggerToast(`EQUIPPED: ${part.shortName}`);
  };

  const handleRemovePart = (categoryId) => {
    setBuild((prev) => ({ ...prev, [categoryId]: null }));
  };

  const handleApplyPreset = (presetKey) => {
    const preset = PRESET_BUILDS[presetKey];
    if (!preset) return;
    setBuild({ ...preset.parts });
    setBuildName(preset.name.toUpperCase());
    triggerToast(`LOADED BLUEPRINT: ${preset.name}`);
  };

  const handleClearBuild = () => {
    setBuild({
      cpu: null,
      motherboard: null,
      gpu: null,
      ram: null,
      storage: null,
      psu: null,
      cooler: null,
      case: null
    });
    triggerToast('SYSTEM MATRIX PURGED');
  };

  const handleDownloadPdf = async () => {
    if (selectedCount === 0) {
      triggerToast('SELECT AT LEAST ONE MODULE BEFORE EXPORTING');
      return;
    }
    setIsExportingPdf(true);
    const ok = await exportBuildToPDF({
      build,
      buildName,
      builderName,
      currency,
      includeTax: includeTaxInPdf,
      analysis
    });
    setIsExportingPdf(false);
    if (ok) {
      triggerToast(`MANIFEST EXPORTED (${currency} A4 PDF)`);
    } else {
      triggerToast('PDF EXPORT FAILED — VERIFY NETWORK');
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        backgroundImage: isDark
          ? 'radial-gradient(circle at 18% 0%, rgba(6, 182, 212, 0.12), transparent 40%), radial-gradient(circle at 85% 15%, rgba(139, 92, 246, 0.12), transparent 42%), linear-gradient(rgba(6, 182, 212, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.035) 1px, transparent 1px)'
          : 'radial-gradient(circle at 18% 0%, rgba(37, 99, 235, 0.07), transparent 45%), linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 100% 100%, 36px 36px, 36px 36px'
      }}
      className={`min-h-screen transition-colors duration-300 pb-24 lg:pb-14 ${
        isDark ? 'bg-[#050810] text-slate-100' : 'bg-[#f3f6fb] text-slate-900'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          className={`fixed bottom-20 lg:bottom-6 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold border shadow-2xl transition-all ${
            isDark
              ? 'bg-[#0d1322] border-cyan-500/50 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
              : 'bg-slate-900 border-blue-500 text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================
          STICKY TOP NAVIGATION BAR
      ================================================================ */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
          isDark
            ? 'bg-[#050810]/85 border-cyan-500/20'
            : 'bg-white/90 border-slate-200/90 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Futuristic Brand Emblem */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                isDark
                  ? 'bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 text-white shadow-sm'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                  className={`font-black text-base sm:text-lg tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  SLEEKRIG
                </span>
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    isDark
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  // NEXUS
                </span>
                <span
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className={`hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isDark
                      ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {totalCatalogCount} PARTS
                </span>
              </div>
              <p
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className={`hidden sm:block text-[10px] tracking-widest uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Aerospace Hardware Synthesis Terminal
              </p>
            </div>
          </div>

          {/* Right Controls: Currency Switcher + Instant Theme Toggle + Export PDF */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Currency Switcher (USD, AED, INR) */}
            <div
              className={`inline-flex p-1 rounded-lg border ${
                isDark
                  ? 'bg-[#0b101d] border-slate-800'
                  : 'bg-slate-100 border-slate-200'
              }`}
              role="group"
              aria-label="Currency selector"
            >
              {Object.keys(CURRENCIES).map((code) => {
                const active = currency === code;
                return (
                  <button
                    key={code}
                    onClick={() => setCurrency(code)}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      active
                        ? isDark
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-blue-600 text-white shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>

            {/* Reliable Dark / Light Mode Toggle Button */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0d1322] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-xs'
              }`}
              aria-label="Toggle dark or light theme"
              title={isDark ? 'Switch to Aerospace Blueprint Light Mode' : 'Switch to Cyber-Void Dark Mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="hidden md:inline">DARK</span>
                </>
              )}
            </button>

            {/* Desktop Export PDF CTA */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? 'COMPILING...' : 'EXPORT PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================
          MAIN WORKSPACE CONTAINER
      ================================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Hero HUD & Instant Preset Blueprints */}
        <div
          className={`relative mb-6 p-5 sm:p-6 rounded-xl border backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors ${
            isDark
              ? 'bg-[#090d16]/85 border-cyan-500/25 shadow-[0_0_35px_rgba(6,182,212,0.07)]'
              : 'bg-white/95 border-slate-200 shadow-sm'
          }`}
        >
          <HudBrackets isDark={isDark} />

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className={`text-xs font-bold uppercase tracking-widest ${
                  isDark ? 'text-cyan-400' : 'text-blue-600'
                }`}
              >
                LIVE TELEMETRY // 100+ MODULES PER SUBSYSTEM
              </span>
            </div>
            <h1
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-wide uppercase ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Architect Your Custom Rig
            </h1>
            <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select from <span className="font-bold">{totalCatalogCount}+ verified components</span> across Budget, Mid-Range & Flagship tiers in{' '}
              <span className={`font-bold ${isDark ? 'text-cyan-300' : 'text-blue-600'}`}>
                {currObj.name} ({currency})
              </span>
              .
            </p>
          </div>

          {/* Preset Rig Blueprints */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className={`text-[11px] font-bold uppercase mr-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Blueprints:
            </span>
            {Object.entries(PRESET_BUILDS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#101728] border-slate-700/80 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {preset.badge}
              </button>
            ))}
            {selectedCount > 0 && (
              <button
                onClick={handleClearBuild}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-[#101728] border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-600'
                }`}
                title="Purge All Modules"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Compatibility Diagnostic Banners */}
        {analysis.errors.length > 0 && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
              isDark
                ? 'bg-rose-950/35 border-rose-500/50 text-rose-200'
                : 'bg-rose-50 border-rose-300 text-rose-800'
            }`}
          >
            <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                className="font-bold text-xs uppercase tracking-wider text-rose-500"
              >
                CRITICAL HARDWARE CONFLICT DETECTED
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {analysis.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {analysis.errors.length === 0 && analysis.warnings.length > 0 && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
              isDark
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                className="font-bold text-xs uppercase tracking-wider text-amber-500"
              >
                POWER HEADROOM ADVISORY
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                {analysis.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Two-Column Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: 8 SUBSYSTEM SLOTS */}
          <div className="lg:col-span-8 space-y-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const selectedPart = build[cat.id];
              const catalogCount = COMPONENT_DB[cat.id]?.length || 0;

              return (
                <div
                  key={cat.id}
                  className={`group relative p-4 sm:p-5 rounded-xl border backdrop-blur-sm transition-all ${
                    selectedPart
                      ? isDark
                        ? 'bg-[#090d16]/90 border-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.06)]'
                        : 'bg-white border-slate-200 shadow-xs'
                      : isDark
                      ? 'bg-[#090d16]/55 border-dashed border-slate-800 hover:border-cyan-500/50'
                      : 'bg-white/70 border-dashed border-slate-300 hover:border-blue-500'
                  }`}
                >
                  <HudBrackets isDark={isDark} active={Boolean(selectedPart)} />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Icon & Specs */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          selectedPart
                            ? isDark
                              ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                              : 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : isDark
                            ? 'bg-[#101728] border-slate-800 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isDark ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-blue-700'
                            }`}
                          >
                            {cat.code}
                          </span>
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {cat.name}
                          </span>
                          {selectedPart && <TierBadge tier={selectedPart.tier} isDark={isDark} />}
                        </div>

                        {selectedPart ? (
                          <div className="mt-1">
                            <h3 className="text-base sm:text-lg font-bold truncate">
                              {selectedPart.name}
                            </h3>
                            <p
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              className={`text-xs mt-0.5 truncate ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {selectedPart.specsSummary}
                            </p>
                          </div>
                        ) : (
                          <p
                            className={`text-sm font-medium mt-1 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            Slot Unassigned —{' '}
                            <span
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              className={isDark ? 'text-cyan-400/80 text-xs' : 'text-blue-600 text-xs'}
                            >
                              [{catalogCount} units]
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Price & Action Controls */}
                    <div
                      className={`flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 shrink-0 ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      {selectedPart ? (
                        <>
                          <div className="text-left sm:text-right mr-1">
                            <div
                              style={{ fontFamily: "'Orbitron', sans-serif" }}
                              className={`text-base sm:text-lg font-extrabold ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {formatPrice(selectedPart.price, currency)}
                            </div>
                            {selectedPart.wattage > 0 && (
                              <div
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                              >
                                {selectedPart.wattage}W
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setActiveModalCategory(cat.id)}
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase border transition-colors ${
                                isDark
                                  ? 'bg-[#121929] border-slate-700 text-cyan-300 hover:border-cyan-400'
                                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              Swap
                            </button>
                            <button
                              onClick={() => handleRemovePart(cat.id)}
                              className={`p-2 rounded-lg border transition-colors ${
                                isDark
                                  ? 'bg-[#121929] border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600'
                              }`}
                              aria-label={`Remove ${cat.shortName}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => setActiveModalCategory(cat.id)}
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isDark
                              ? 'bg-[#101728] border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                              : 'bg-slate-900 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Select {cat.shortName}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: STICKY TELEMETRY & EXPORT TERMINAL */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div
              className={`relative p-6 rounded-xl border backdrop-blur-md space-y-5 transition-colors ${
                isDark
                  ? 'bg-[#090d16]/90 border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.08)]'
                  : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <HudBrackets isDark={isDark} active />

              {/* Build Name & Builder Inputs */}
              <div className="space-y-3">
                <div>
                  <label
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${
                      isDark ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    System Designation (PDF Title)
                  </label>
                  <input
                    type="text"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    placeholder="NEXUS // MK-IV"
                    className={`w-full px-3.5 py-2 text-sm font-bold rounded-lg border outline-none transition-all ${
                      isDark
                        ? 'bg-[#101728] border-slate-700 focus:border-cyan-400 text-white'
                        : 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Architect / Client Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={builderName}
                      onChange={(e) => setBuilderName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className={`w-full pl-8 pr-3 py-1.5 text-xs font-semibold rounded-lg border outline-none transition-all ${
                        isDark
                          ? 'bg-[#101728] border-slate-800 focus:border-cyan-400 text-slate-200'
                          : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-800'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Telemetry Readouts: Power & Diagnostics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  className={`p-3 rounded-lg border ${
                    isDark
                      ? 'bg-[#0e1525] border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400"
                  >
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Power Draw</span>
                  </div>
                  <div
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                    className="text-base font-extrabold mt-1"
                  >
                    {analysis.estimatedWattage}W
                    {build.psu && (
                      <span className="text-[11px] font-normal text-slate-400">
                        /{build.psu.psuWattage}W
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800/40 mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        wattagePercent > 90
                          ? 'bg-rose-500'
                          : wattagePercent > 75
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${wattagePercent}%` }}
                    />
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDark
                      ? 'bg-[#0e1525] border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-400"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Diagnostics</span>
                  </div>
                  <div
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                    className={`text-xs font-extrabold mt-1.5 uppercase ${
                      analysis.status === 'error'
                        ? 'text-rose-500'
                        : analysis.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {analysis.status === 'error'
                      ? `${analysis.errors.length} CONFLICT`
                      : analysis.status === 'warning'
                      ? 'LOW PSU'
                      : 'VERIFIED OK'}
                  </div>
                  <div
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-[10px] text-slate-400 mt-1"
                  >
                    {selectedCount}/{CATEGORIES.length} SLOTS
                  </div>
                </div>
              </div>

              {/* Itemized Mini Manifest */}
              <div
                className={`border-t pt-3.5 space-y-2 max-h-48 overflow-y-auto pr-1 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                {CATEGORIES.map((cat) => {
                  const item = build[cat.id];
                  return (
                    <div key={cat.id} className="flex items-center justify-between text-xs gap-2">
                      <span className={`truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <strong className={isDark ? 'text-cyan-400/90' : 'text-blue-700'}>
                          {cat.shortName}:
                        </strong>{' '}
                        <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                          {item ? item.shortName : '—'}
                        </span>
                      </span>
                      <span
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        className="font-bold shrink-0"
                      >
                        {item ? formatPrice(item.price, currency) : formatPrice(0, currency)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Tax Toggle & Valuation Totals */}
              <div
                className={`border-t pt-4 space-y-2.5 ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    Include {currObj.taxLabel}
                  </span>
                  <input
                    type="checkbox"
                    checked={includeTaxInPdf}
                    onChange={(e) => setIncludeTaxInPdf(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                </label>

                <div className="flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Subtotal ({currency})
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="font-bold">
                    {formatPrice(subtotalUsd, currency)}
                  </span>
                </div>

                {includeTaxInPdf && (
                  <div className="flex items-center justify-between text-xs">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {currObj.taxLabel}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="font-bold">
                      {formatPrice(estimatedTaxUsd, currency)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex items-baseline justify-between pt-2.5 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <span
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    TOTAL ({currency})
                  </span>
                  <span
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                    className={`text-2xl font-black tracking-tight ${
                      isDark ? 'text-cyan-400' : 'text-blue-600'
                    }`}
                  >
                    {formatPrice(grandTotalUsd, currency)}
                  </span>
                </div>
              </div>

              {/* Primary PDF Export CTA */}
              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                className={`w-full py-3.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>
                  {isExportingPdf
                    ? 'COMPILING A4 SPEC...'
                    : `DOWNLOAD SPEC PDF (${currency})`}
                </span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================================
          MOBILE STICKY BOTTOM TELEMETRY BAR
      ================================================================ */}
      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl border-t px-4 py-3 shadow-2xl ${
          isDark
            ? 'bg-[#070b14]/95 border-cyan-500/30'
            : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileSummaryOpen(true)}
            className="flex flex-col text-left"
          >
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className={`text-[10px] font-bold flex items-center gap-1 ${
                isDark ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              {selectedCount}/{CATEGORIES.length} SLOTS • {analysis.estimatedWattage}W
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              className="text-lg font-black"
            >
              {formatPrice(grandTotalUsd, currency)}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSummaryOpen(true)}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className={`px-3 py-2.5 rounded-lg text-xs font-bold uppercase border ${
                isDark
                  ? 'bg-[#101728] border-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              Specs
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold uppercase ${
                isDark
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Summary Drawer */}
      {mobileSummaryOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end bg-black/75 backdrop-blur-xs">
          <div
            className={`w-full max-h-[85vh] overflow-y-auto rounded-t-2xl p-5 space-y-4 border-t ${
              isDark
                ? 'bg-[#090d16] border-cyan-500/40 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                className="text-sm font-black uppercase tracking-wider"
              >
                System Manifest & Export
              </h3>
              <button
                onClick={() => setMobileSummaryOpen(false)}
                className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="block text-[10px] font-bold uppercase text-slate-400 mb-1"
                >
                  System Name
                </label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className={`w-full px-3 py-2 text-sm font-bold rounded-lg border outline-none ${
                    isDark ? 'bg-[#101728] border-slate-700 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div>
                <label
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  className="block text-[10px] font-bold uppercase text-slate-400 mb-1"
                >
                  Builder / Client Name
                </label>
                <input
                  type="text"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  placeholder="Optional"
                  className={`w-full px-3 py-2 text-xs font-semibold rounded-lg border outline-none ${
                    isDark ? 'bg-[#101728] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div
              className={`space-y-2 border-y py-3 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              {CATEGORIES.map((cat) => {
                const item = build[cat.id];
                return (
                  <div key={cat.id} className="flex justify-between text-xs">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {cat.shortName}:{' '}
                      <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                        {item ? item.shortName : 'None'}
                      </strong>
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="font-bold">
                      {item ? formatPrice(item.price, currency) : formatPrice(0, currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <label className="flex items-center justify-between text-xs font-semibold">
              <span>Include {currObj.taxLabel}</span>
              <input
                type="checkbox"
                checked={includeTaxInPdf}
                onChange={(e) => setIncludeTaxInPdf(e.target.checked)}
                className="rounded accent-cyan-500"
              />
            </label>

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-bold">Total ({currency})</span>
              <span
                style={{ fontFamily: "'Orbitron', sans-serif" }}
                className={`text-xl font-black ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}
              >
                {formatPrice(grandTotalUsd, currency)}
              </span>
            </div>

            <button
              onClick={() => {
                setMobileSummaryOpen(false);
                handleDownloadPdf();
              }}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-slate-950'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download Config PDF ({currency})</span>
            </button>
          </div>
        </div>
      )}

      {/* ================================================================
          COMPONENT PICKER MODAL (100+ ITEMS PER CATEGORY)
      ================================================================ */}
      <ComponentSelectorModal
        isOpen={Boolean(activeModalCategory)}
        onClose={() => setActiveModalCategory(null)}
        categoryId={activeModalCategory}
        currentBuild={build}
        onSelectPart={handleSelectPart}
        currency={currency}
        isDark={isDark}
      />
      <Footer theme={theme} />
    </div>
  );
}

function Footer({ theme }) {
  const isDark = theme === 'dark';
  return (
    <footer className={`mt-20 border-t transition-colors duration-300 ${
      isDark 
        ? 'bg-[#060810] border-cyan-900/30 text-gray-400' 
        : 'bg-white border-gray-200 text-gray-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-xs">
        <p>© {new Date().getFullYear()} SleekRig // Nexus Edition. All rights reserved.</p>
      </div>
    </footer>
  );
}