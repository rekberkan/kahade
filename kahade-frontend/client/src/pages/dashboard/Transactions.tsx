/*
 * KAHADE TRANSACTIONS LIST PAGE
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, ArrowUpRight, ArrowDownRight, Clock,
  CheckCircle2, AlertCircle, ChevronRight, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data
const transactions = [
  {
    id: '1',
    orderNumber: 'KHD-2025-0001',
    title: 'Pembelian iPhone 15 Pro',
    amount: 18500000,
    status: 'PAID',
    role: 'buyer',
    counterparty: 'TechStore',
    category: 'ELECTRONICS',
    createdAt: '2025-01-24T10:00:00Z'
  },
  {
    id: '2',
    orderNumber: 'KHD-2025-0002',
    title: 'Jasa Desain Logo',
    amount: 2500000,
    status: 'PENDING_ACCEPT',
    role: 'seller',
    counterparty: 'StartupXYZ',
    category: 'SERVICES',
    createdAt: '2025-01-24T08:00:00Z'
  },
  {
    id: '3',
    orderNumber: 'KHD-2025-0003',
    title: 'Pembelian Laptop Gaming',
    amount: 15000000,
    status: 'COMPLETED',
    role: 'buyer',
    counterparty: 'GamingGear',
    category: 'ELECTRONICS',
    createdAt: '2025-01-23T15:00:00Z'
  },
  {
    id: '4',
    orderNumber: 'KHD-2025-0004',
    title: 'Jasa Konsultasi IT',
    amount: 5000000,
    status: 'COMPLETED',
    role: 'seller',
    counterparty: 'PT ABC',
    category: 'SERVICES',
    createdAt: '2025-01-22T09:00:00Z'
  },
  {
    id: '5',
    orderNumber: 'KHD-2025-0005',
    title: 'Pembelian Kamera DSLR',
    amount: 12000000,
    status: 'DISPUTED',
    role: 'buyer',
    counterparty: 'CameraWorld',
    category: 'ELECTRONICS',
    createdAt: '2025-01-21T14:00:00Z'
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PENDING_ACCEPT: { label: 'Menunggu', color: 'text-amber-500 bg-amber-500/10', icon: Clock },
  ACCEPTED: { label: 'Diterima', color: 'text-blue-500 bg-blue-500/10', icon: CheckCircle2 },
  PAID: { label: 'Dibayar', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
  DISPUTED: { label: 'Dispute', color: 'text-red-500 bg-red-500/10', icon: AlertCircle },
  CANCELLED: { label: 'Dibatalkan', color: 'text-gray-500 bg-gray-500/10', icon: AlertCircle },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesRole = roleFilter === 'all' || tx.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <DashboardLayout title="Transaksi" subtitle="Kelola semua transaksi Anda">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING_ACCEPT">Menunggu</SelectItem>
                <SelectItem value="PAID">Dibayar</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="DISPUTED">Dispute</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36 bg-white/5 border-white/10">
                <SelectValue placeholder="Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="buyer">Pembeli</SelectItem>
                <SelectItem value="seller">Penjual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/dashboard/transactions/new">
            <Button className="btn-accent">
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </Button>
          </Link>
        </div>
        
        {/* Transactions List */}
        <div className="glass-card overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-white/10">
              {filteredTransactions.map((tx, index) => {
                const status = statusConfig[tx.status];
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/dashboard/transactions/${tx.id}`}>
                      <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.role === 'buyer' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {tx.role === 'buyer' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{tx.orderNumber}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="font-medium truncate">{tx.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{tx.role === 'buyer' ? 'Pembeli' : 'Penjual'}</span>
                            <span>•</span>
                            <span>{tx.counterparty}</span>
                          </div>
                        </div>
                        
                        <div className="text-right hidden sm:block">
                          <div className="font-semibold">{formatCurrency(tx.amount)}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Calendar className="w-3 h-3" />
                            {formatDate(tx.createdAt)}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">Tidak ada transaksi</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'Tidak ada transaksi yang sesuai dengan filter.'
                  : 'Anda belum memiliki transaksi.'}
              </p>
              <Link href="/dashboard/transactions/new">
                <Button className="btn-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Transaksi Pertama
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
