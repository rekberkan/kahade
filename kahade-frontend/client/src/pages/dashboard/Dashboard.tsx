/*
 * KAHADE USER DASHBOARD
 * Design: Overview with stats, recent transactions, quick actions
 */

import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Wallet, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  AlertCircle, Plus, ArrowRight, TrendingUp, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const stats = [
  { label: 'Saldo Wallet', value: 'Rp 5.250.000', icon: Wallet, change: '+12%', color: 'text-accent' },
  { label: 'Total Transaksi', value: '25', icon: TrendingUp, change: '+5', color: 'text-emerald-500' },
  { label: 'Dalam Proses', value: '3', icon: Clock, change: '', color: 'text-amber-500' },
  { label: 'Selesai Bulan Ini', value: '8', icon: CheckCircle2, change: '+2', color: 'text-emerald-500' },
];

const recentTransactions = [
  {
    id: '1',
    title: 'Pembelian iPhone 15 Pro',
    amount: 'Rp 18.500.000',
    status: 'PAID',
    role: 'buyer',
    counterparty: 'TechStore',
    date: '2 jam lalu'
  },
  {
    id: '2',
    title: 'Jasa Desain Logo',
    amount: 'Rp 2.500.000',
    status: 'PENDING_ACCEPT',
    role: 'seller',
    counterparty: 'StartupXYZ',
    date: '5 jam lalu'
  },
  {
    id: '3',
    title: 'Pembelian Laptop Gaming',
    amount: 'Rp 15.000.000',
    status: 'COMPLETED',
    role: 'buyer',
    counterparty: 'GamingGear',
    date: '1 hari lalu'
  },
  {
    id: '4',
    title: 'Jasa Konsultasi IT',
    amount: 'Rp 5.000.000',
    status: 'COMPLETED',
    role: 'seller',
    counterparty: 'PT ABC',
    date: '2 hari lalu'
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PENDING_ACCEPT: { label: 'Menunggu', color: 'text-amber-500 bg-amber-500/10', icon: Clock },
  ACCEPTED: { label: 'Diterima', color: 'text-blue-500 bg-blue-500/10', icon: CheckCircle2 },
  PAID: { label: 'Dibayar', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
  DISPUTED: { label: 'Dispute', color: 'text-red-500 bg-red-500/10', icon: AlertCircle },
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Dashboard" subtitle={`Selamat datang, ${user?.username || 'User'}!`}>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
                )}
              </div>
              <div className="text-2xl font-display font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-display font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/transactions/new">
              <Button className="w-full h-auto py-4 flex-col gap-2 btn-accent">
                <Plus className="w-5 h-5" />
                <span>Transaksi Baru</span>
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-white/5">
                <ArrowDownRight className="w-5 h-5" />
                <span>Top Up</span>
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-white/5">
                <ArrowUpRight className="w-5 h-5" />
                <span>Tarik Dana</span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-white/5">
                <Shield className="w-5 h-5" />
                <span>Verifikasi KYC</span>
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold">Transaksi Terbaru</h2>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm" className="text-accent">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((tx) => {
              const status = statusConfig[tx.status];
              return (
                <Link key={tx.id} href={`/dashboard/transactions/${tx.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.role === 'buyer' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {tx.role === 'buyer' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{tx.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.role === 'buyer' ? 'Pembeli' : 'Penjual'} • {tx.counterparty}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{tx.amount}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${status.color}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
        
        {/* KYC Reminder */}
        {user?.kycStatus !== 'VERIFIED' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 border-amber-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold mb-1">Verifikasi Identitas Anda</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tingkatkan limit transaksi dan akses fitur premium dengan verifikasi KYC.
                </p>
                <Link href="/dashboard/profile">
                  <Button className="btn-secondary">
                    Mulai Verifikasi
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
