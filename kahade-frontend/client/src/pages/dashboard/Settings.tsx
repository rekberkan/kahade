/*
 * KAHADE SETTINGS PAGE
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock, Bell, Shield, Smartphone, Eye, EyeOff, Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transaction: true,
    marketing: false
  });
  const [twoFactor, setTwoFactor] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }
    toast.success('Password berhasil diubah');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleToggle2FA = () => {
    if (!twoFactor) {
      toast.info('Fitur 2FA coming soon');
    } else {
      setTwoFactor(false);
      toast.success('2FA dinonaktifkan');
    }
  };

  return (
    <DashboardLayout title="Pengaturan" subtitle="Kelola preferensi akun Anda">
      <div className="max-w-3xl space-y-6">
        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Ubah Password</h3>
              <p className="text-sm text-muted-foreground">Perbarui password akun Anda</p>
            </div>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="pr-10 bg-white/5 border-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="pr-10 bg-white/5 border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            
            <Button type="submit" className="btn-accent">
              Ubah Password
            </Button>
          </form>
        </motion.div>
        
        {/* Two-Factor Authentication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-display font-semibold">Autentikasi Dua Faktor (2FA)</h3>
                <p className="text-sm text-muted-foreground">
                  Tambahkan lapisan keamanan ekstra dengan 2FA
                </p>
              </div>
            </div>
            <Switch checked={twoFactor} onCheckedChange={handleToggle2FA} />
          </div>
          
          {twoFactor && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">2FA Aktif</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Akun Anda dilindungi dengan autentikasi dua faktor.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Notifikasi</h3>
              <p className="text-sm text-muted-foreground">Kelola preferensi notifikasi</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <div className="font-medium">Notifikasi Email</div>
                <div className="text-sm text-muted-foreground">Terima update via email</div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <div className="font-medium">Push Notification</div>
                <div className="text-sm text-muted-foreground">Notifikasi browser</div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <div className="font-medium">Update Transaksi</div>
                <div className="text-sm text-muted-foreground">Notifikasi status transaksi</div>
              </div>
              <Switch
                checked={notifications.transaction}
                onCheckedChange={(checked) => setNotifications({ ...notifications, transaction: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <div className="font-medium">Email Marketing</div>
                <div className="text-sm text-muted-foreground">Promo dan penawaran khusus</div>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </div>
        </motion.div>
        
        {/* Connected Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Perangkat Terhubung</h3>
              <p className="text-sm text-muted-foreground">Kelola sesi login aktif</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Chrome - Windows</div>
                  <div className="text-sm text-muted-foreground">Jakarta, Indonesia • Aktif sekarang</div>
                </div>
              </div>
              <span className="text-xs text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded-full">
                Perangkat ini
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 border-red-500/20"
        >
          <h3 className="font-display font-semibold text-red-500 mb-4">Zona Berbahaya</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.
          </p>
          <Button 
            variant="outline" 
            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
            onClick={() => toast.info('Fitur coming soon')}
          >
            Hapus Akun
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
