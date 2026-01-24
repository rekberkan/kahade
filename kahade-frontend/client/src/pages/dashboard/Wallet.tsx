/*
 * KAHADE WALLET PAGE
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Plus, 
  CreditCard, Building2, Smartphone, History, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data
const walletBalance = 5250000;
const pendingBalance = 2500000;

const transactions = [
  { id: '1', type: 'credit', description: 'Top Up via BCA', amount: 1000000, date: '2025-01-24', status: 'completed' },
  { id: '2', type: 'debit', description: 'Pembayaran Transaksi #KHD-2025-0001', amount: 500000, date: '2025-01-24', status: 'completed' },
  { id: '3', type: 'credit', description: 'Penerimaan dari Transaksi #KHD-2025-0002', amount: 2500000, date: '2025-01-23', status: 'pending' },
  { id: '4', type: 'debit', description: 'Penarikan ke BCA ****1234', amount: 3000000, date: '2025-01-22', status: 'completed' },
  { id: '5', type: 'credit', description: 'Top Up via GoPay', amount: 500000, date: '2025-01-21', status: 'completed' },
];

const banks = [
  { value: 'bca', label: 'BCA' },
  { value: 'mandiri', label: 'Mandiri' },
  { value: 'bni', label: 'BNI' },
  { value: 'bri', label: 'BRI' },
  { value: 'cimb', label: 'CIMB Niaga' },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function Wallet() {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleTopUp = () => {
    toast.success('Top up berhasil diproses!', {
      description: 'Silakan selesaikan pembayaran.'
    });
    setIsTopUpOpen(false);
    setTopUpAmount('');
  };

  const handleWithdraw = () => {
    toast.success('Penarikan diproses!', {
      description: 'Dana akan masuk dalam 1-3 hari kerja.'
    });
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
  };

  const quickAmounts = [100000, 250000, 500000, 1000000];

  return (
    <DashboardLayout title="Wallet" subtitle="Kelola saldo dan transaksi keuangan Anda">
      <div className="space-y-6">
        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Tersedia</p>
                <p className="text-3xl font-display font-bold gradient-text">
                  {formatCurrency(walletBalance)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <WalletIcon className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex gap-3">
              <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-accent flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Top Up
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Saldo</DialogTitle>
                    <DialogDescription>
                      Pilih nominal dan metode pembayaran
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nominal</Label>
                      <Input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        placeholder="Masukkan nominal"
                      />
                      <div className="flex gap-2 flex-wrap">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setTopUpAmount(amount.toString())}
                          >
                            {formatCurrency(amount)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Metode Pembayaran</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="h-auto py-3 flex-col gap-1">
                          <Building2 className="w-5 h-5" />
                          <span className="text-xs">Transfer Bank</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex-col gap-1">
                          <CreditCard className="w-5 h-5" />
                          <span className="text-xs">Kartu</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-3 flex-col gap-1">
                          <Smartphone className="w-5 h-5" />
                          <span className="text-xs">E-Wallet</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTopUpOpen(false)}>
                      Batal
                    </Button>
                    <Button className="btn-accent" onClick={handleTopUp}>
                      Lanjutkan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-white/5">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Tarik Dana
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tarik Dana</DialogTitle>
                    <DialogDescription>
                      Tarik saldo ke rekening bank Anda
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nominal Penarikan</Label>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Masukkan nominal"
                      />
                      <p className="text-xs text-muted-foreground">
                        Saldo tersedia: {formatCurrency(walletBalance)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Tujuan</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nomor Rekening</Label>
                      <Input placeholder="Masukkan nomor rekening" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                      Batal
                    </Button>
                    <Button className="btn-accent" onClick={handleWithdraw}>
                      Tarik Dana
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Pending</p>
                <p className="text-3xl font-display font-bold text-amber-500">
                  {formatCurrency(pendingBalance)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <History className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Dana dari transaksi yang sedang dalam proses. Akan tersedia setelah transaksi selesai.
            </p>
          </motion.div>
        </div>
        
        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-display font-semibold mb-4">Riwayat Transaksi</h2>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="credit">Masuk</TabsTrigger>
              <TabsTrigger value="debit">Keluar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tx.description}</div>
                    <div className="text-sm text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className={`text-xs ${tx.status === 'pending' ? 'text-amber-500' : 'text-muted-foreground'}`}>
                      {tx.status === 'pending' ? 'Pending' : 'Selesai'}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="credit" className="space-y-3">
              {transactions.filter(tx => tx.type === 'credit').map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                    <ArrowDownRight className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tx.description}</div>
                    <div className="text-sm text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-500">+{formatCurrency(tx.amount)}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="debit" className="space-y-3">
              {transactions.filter(tx => tx.type === 'debit').map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{tx.description}</div>
                    <div className="text-sm text-muted-foreground">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-500">-{formatCurrency(tx.amount)}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
