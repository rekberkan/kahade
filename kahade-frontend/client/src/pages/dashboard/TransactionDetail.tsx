/*
 * KAHADE TRANSACTION DETAIL PAGE
 */

import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CheckCircle2, AlertCircle, User, Calendar,
  FileText, MessageSquare, Upload, Shield, ExternalLink, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock transaction data
const mockTransaction = {
  id: '1',
  orderNumber: 'KHD-2025-0001',
  title: 'Pembelian iPhone 15 Pro',
  description: 'iPhone 15 Pro 256GB Natural Titanium, kondisi baru, garansi resmi Apple Indonesia 1 tahun.',
  amount: 18500000,
  platformFee: 185000,
  totalAmount: 18685000,
  status: 'PAID',
  role: 'buyer',
  category: 'ELECTRONICS',
  buyer: {
    id: '1',
    username: 'johndoe',
    reputationScore: 4.8
  },
  seller: {
    id: '2',
    username: 'TechStore',
    reputationScore: 4.9
  },
  createdAt: '2025-01-24T10:00:00Z',
  paidAt: '2025-01-24T10:30:00Z',
  timeline: [
    { status: 'CREATED', timestamp: '2025-01-24T10:00:00Z', description: 'Transaksi dibuat oleh pembeli' },
    { status: 'ACCEPTED', timestamp: '2025-01-24T10:15:00Z', description: 'Transaksi diterima oleh penjual' },
    { status: 'PAID', timestamp: '2025-01-24T10:30:00Z', description: 'Pembayaran diterima' },
  ],
  blockchainHash: '0x1234567890abcdef...',
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING_ACCEPT: { label: 'Menunggu Persetujuan', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  ACCEPTED: { label: 'Diterima', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  PAID: { label: 'Dibayar - Menunggu Pengiriman', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  SHIPPED: { label: 'Dikirim', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  DISPUTED: { label: 'Dalam Dispute', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  CANCELLED: { label: 'Dibatalkan', color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export default function TransactionDetail() {
  const { id } = useParams();
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  
  const tx = mockTransaction;
  const status = statusConfig[tx.status];

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(tx.orderNumber);
    toast.success('Nomor order disalin');
  };

  const handleConfirmReceived = () => {
    toast.success('Konfirmasi berhasil!', {
      description: 'Dana akan dilepaskan ke penjual.'
    });
  };

  const handleSubmitDispute = () => {
    if (!disputeReason.trim()) {
      toast.error('Mohon isi alasan dispute');
      return;
    }
    toast.success('Dispute diajukan', {
      description: 'Tim kami akan meninjau dalam 1-3 hari kerja.'
    });
    setIsDisputeOpen(false);
    setDisputeReason('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/dashboard/transactions">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Transaksi
          </Button>
        </Link>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={handleCopyOrderNumber}
                  className="font-mono text-sm text-muted-foreground hover:text-accent flex items-center gap-1"
                >
                  {tx.orderNumber}
                  <Copy className="w-3 h-3" />
                </button>
                <span className={`text-xs px-3 py-1 rounded-full ${status.color} ${status.bgColor}`}>
                  {status.label}
                </span>
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">{tx.title}</h1>
              <p className="text-muted-foreground">{tx.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-display font-bold gradient-text">
                {formatCurrency(tx.amount)}
              </div>
              <div className="text-sm text-muted-foreground">
                + Biaya platform {formatCurrency(tx.platformFee)}
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-display font-semibold mb-4">Pihak Terkait</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-sm text-muted-foreground mb-2">Pembeli</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-semibold">
                      {tx.buyer.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{tx.buyer.username}</div>
                      <div className="text-sm text-muted-foreground">⭐ {tx.buyer.reputationScore}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-sm text-muted-foreground mb-2">Penjual</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                      {tx.seller.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{tx.seller.username}</div>
                      <div className="text-sm text-muted-foreground">⭐ {tx.seller.reputationScore}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-display font-semibold mb-4">Timeline</h2>
              <div className="space-y-4">
                {tx.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      </div>
                      {index < tx.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-accent/20 mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="font-medium">{event.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(event.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Actions */}
            {tx.status === 'PAID' && tx.role === 'buyer' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-display font-semibold mb-4">Aksi</h2>
                <div className="flex flex-wrap gap-3">
                  <Button className="btn-accent" onClick={handleConfirmReceived}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Konfirmasi Diterima
                  </Button>
                  <Dialog open={isDisputeOpen} onOpenChange={setIsDisputeOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Ajukan Dispute
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajukan Dispute</DialogTitle>
                        <DialogDescription>
                          Jelaskan alasan Anda mengajukan dispute untuk transaksi ini.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Jelaskan masalah yang Anda alami..."
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        rows={4}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDisputeOpen(false)}>
                          Batal
                        </Button>
                        <Button className="bg-red-500 hover:bg-red-600" onClick={handleSubmitDispute}>
                          Ajukan Dispute
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-6"
            >
              <h2 className="text-lg font-display font-semibold mb-4">Detail Transaksi</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kategori</span>
                  <span>{tx.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dibuat</span>
                  <span>{formatDate(tx.createdAt)}</span>
                </div>
                {tx.paidAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dibayar</span>
                    <span>{formatDate(tx.paidAt)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(tx.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Biaya Platform</span>
                    <span>{formatCurrency(tx.platformFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-accent">{formatCurrency(tx.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Blockchain Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-display font-semibold">Blockchain</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Transaksi ini tercatat di blockchain untuk transparansi.
              </p>
              <div className="p-3 rounded-lg bg-white/5 font-mono text-xs break-all">
                {tx.blockchainHash}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-3 text-accent">
                <ExternalLink className="w-4 h-4 mr-2" />
                Lihat di Explorer
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
