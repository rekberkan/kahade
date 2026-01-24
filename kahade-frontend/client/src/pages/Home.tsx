/*
 * KAHADE HOME PAGE - Landing Page
 * 
 * Design: Glassmorphic Tech with blockchain transparency theme
 * Sections: Hero, Features, How It Works, Stats, Testimonials, CTA
 */

import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Zap, Users, ArrowRight, CheckCircle2, 
  Wallet, FileCheck, Clock, Star, ChevronRight, Globe,
  Blocks, Eye, BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Shield,
    title: 'Escrow Aman',
    description: 'Dana ditahan dengan aman hingga kedua pihak puas dengan transaksi.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Blocks,
    title: 'Integrasi Blockchain',
    description: 'Setiap transaksi tercatat di blockchain untuk transparansi maksimal.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Lock,
    title: 'Keamanan Berlapis',
    description: 'Enkripsi end-to-end, 2FA, dan sistem keamanan tingkat enterprise.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Zap,
    title: 'Proses Cepat',
    description: 'Transaksi diproses dalam hitungan menit, bukan hari.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Eye,
    title: 'Transparansi Penuh',
    description: 'Pantau status transaksi secara real-time kapan saja.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: BadgeCheck,
    title: 'Verifikasi KYC',
    description: 'Sistem verifikasi identitas untuk keamanan tambahan.',
    color: 'from-violet-500 to-indigo-500'
  }
];

const steps = [
  {
    step: '01',
    title: 'Buat Transaksi',
    description: 'Pembeli atau penjual membuat transaksi baru dengan detail lengkap.',
    icon: FileCheck
  },
  {
    step: '02',
    title: 'Setorkan Dana',
    description: 'Pembeli menyetorkan dana ke escrow Kahade yang aman.',
    icon: Wallet
  },
  {
    step: '03',
    title: 'Konfirmasi Pengiriman',
    description: 'Penjual mengirim barang/jasa dan mengupload bukti.',
    icon: Clock
  },
  {
    step: '04',
    title: 'Dana Dilepaskan',
    description: 'Setelah pembeli konfirmasi, dana dilepaskan ke penjual.',
    icon: CheckCircle2
  }
];

const stats = [
  { value: 'Rp 50M+', label: 'Total Transaksi' },
  { value: '10,000+', label: 'Pengguna Aktif' },
  { value: '99.9%', label: 'Tingkat Keberhasilan' },
  { value: '24/7', label: 'Dukungan Pelanggan' }
];

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Pengusaha Online',
    content: 'Kahade memberikan ketenangan pikiran dalam setiap transaksi. Tidak ada lagi kekhawatiran tentang penipuan.',
    rating: 5
  },
  {
    name: 'Sarah Wijaya',
    role: 'Freelancer',
    content: 'Sebagai freelancer, Kahade memastikan saya dibayar untuk pekerjaan saya. Sangat recommended!',
    rating: 5
  },
  {
    name: 'Ahmad Rahman',
    role: 'Kolektor',
    content: 'Membeli barang koleksi mahal jadi lebih aman dengan escrow Kahade. Blockchain-nya bikin tenang.',
    rating: 5
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Blocks className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">Powered by Blockchain</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
              >
                Transaksi Aman dengan{' '}
                <span className="gradient-text">Escrow P2P</span>{' '}
                Terpercaya
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Lindungi setiap transaksi Anda dengan sistem escrow yang didukung teknologi blockchain. 
                Aman, transparan, dan terpercaya.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button className="btn-accent text-base px-8 py-4 h-auto group">
                    Mulai Gratis
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button className="btn-secondary text-base px-8 py-4 h-auto">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </motion.div>
              
              {/* Trust Badges */}
              <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Terdaftar OJK</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>ISO 27001</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>PCI DSS</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img 
                  src="/images/escrow-illustration.png" 
                  alt="Secure Escrow" 
                  className="w-full max-w-lg mx-auto drop-shadow-2xl"
                />
                <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 border-y border-white/10 bg-white/[0.02]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Mengapa Memilih <span className="gradient-text">Kahade</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform escrow terlengkap dengan fitur keamanan terdepan untuk melindungi setiap transaksi Anda.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Cara Kerja <span className="gradient-text">Kahade</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proses sederhana dalam 4 langkah untuk transaksi yang aman dan terpercaya.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                )}
                
                <div className="glass-card p-6 text-center relative z-10">
                  <div className="text-5xl font-display font-bold text-accent/20 mb-4">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/how-it-works">
              <Button className="btn-secondary group">
                Lihat Detail Lengkap
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Blockchain Feature Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="/images/blockchain-feature.png" 
                alt="Blockchain Technology" 
                className="w-full max-w-md mx-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Teknologi Terdepan</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Transparansi dengan{' '}
                <span className="gradient-text">Blockchain</span>
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Setiap transaksi di Kahade tercatat secara permanen di blockchain, 
                memberikan bukti yang tidak dapat diubah dan dapat diverifikasi oleh siapa saja.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Catatan transaksi yang tidak dapat diubah',
                  'Verifikasi independen oleh semua pihak',
                  'Audit trail yang lengkap dan transparan',
                  'Keamanan kriptografi tingkat tinggi'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/about">
                <Button className="btn-primary group">
                  Pelajari Teknologi Kami
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Dipercaya oleh <span className="gradient-text">Ribuan Pengguna</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lihat apa kata mereka tentang pengalaman menggunakan Kahade.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass-card p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <img 
                src="/images/security-shield.png" 
                alt="Security" 
                className="w-24 h-24 mx-auto mb-6"
              />
              
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Siap Bertransaksi dengan <span className="gradient-text">Aman</span>?
              </h2>
              
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Bergabung dengan ribuan pengguna yang sudah mempercayakan transaksi mereka kepada Kahade.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button className="btn-accent text-base px-8 py-4 h-auto group">
                    Daftar Sekarang - Gratis
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-secondary text-base px-8 py-4 h-auto">
                    Hubungi Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
