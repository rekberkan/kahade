/*
 * KAHADE NOTIFICATIONS PAGE
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, CheckCircle2, AlertCircle, Info, Wallet, ArrowLeftRight,
  Check, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Mock data
const notifications = [
  {
    id: '1',
    type: 'transaction',
    title: 'Transaksi Baru',
    message: 'Anda menerima undangan transaksi dari TechStore untuk pembelian iPhone 15 Pro.',
    read: false,
    createdAt: '2025-01-24T14:00:00Z'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Pembayaran Diterima',
    message: 'Pembayaran untuk transaksi #KHD-2025-0001 telah diterima.',
    read: false,
    createdAt: '2025-01-24T10:30:00Z'
  },
  {
    id: '3',
    type: 'info',
    title: 'Verifikasi KYC',
    message: 'Tingkatkan limit transaksi Anda dengan verifikasi KYC.',
    read: true,
    createdAt: '2025-01-23T09:00:00Z'
  },
  {
    id: '4',
    type: 'transaction',
    title: 'Transaksi Selesai',
    message: 'Transaksi #KHD-2025-0003 telah selesai. Terima kasih telah menggunakan Kahade!',
    read: true,
    createdAt: '2025-01-22T16:00:00Z'
  },
  {
    id: '5',
    type: 'alert',
    title: 'Dispute Diajukan',
    message: 'Pembeli mengajukan dispute untuk transaksi #KHD-2025-0005.',
    read: true,
    createdAt: '2025-01-21T11:00:00Z'
  },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string; bgColor: string }> = {
  transaction: { icon: ArrowLeftRight, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  payment: { icon: Wallet, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  info: { icon: Info, color: 'text-accent', bgColor: 'bg-accent/10' },
  alert: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short'
  }).format(date);
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(notifications);
  
  const unreadCount = notifs.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
    toast.success('Semua notifikasi ditandai sudah dibaca');
  };

  const handleMarkRead = (id: string) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id: string) => {
    setNotifs(notifs.filter(n => n.id !== id));
    toast.success('Notifikasi dihapus');
  };

  return (
    <DashboardLayout title="Notifikasi" subtitle={`${unreadCount} notifikasi belum dibaca`}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            <span className="font-medium">{notifs.length} Notifikasi</span>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
              <Check className="w-4 h-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
        
        {/* Notifications List */}
        <div className="space-y-3">
          {notifs.length > 0 ? (
            notifs.map((notif, index) => {
              const config = typeConfig[notif.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 flex gap-4 ${!notif.read ? 'border-l-2 border-l-accent' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-medium ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notif.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {!notif.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleMarkRead(notif.id)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Tandai Dibaca
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(notif.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">Tidak ada notifikasi</h3>
              <p className="text-sm text-muted-foreground">
                Anda akan menerima notifikasi tentang transaksi dan aktivitas akun di sini.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
