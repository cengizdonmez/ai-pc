// src/components/layout/footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">PC Builder</h3>
            <p className="text-muted-foreground">
              Profesyonel bilgisayar toplama platformu. AI destekli öneriler ve
              kapsamlı performans analizleriyle ideal bilgisayarınızı oluşturun.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/build" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bilgisayar Topla
                </Link>
              </li>
              <li>
                <Link href="/components" className="text-muted-foreground hover:text-foreground transition-colors">
                  Parça Kataloğu
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-muted-foreground hover:text-foreground transition-colors">
                  Oyun Performansı
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Parça Karşılaştırma
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Parçalar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/components/cpu" className="text-muted-foreground hover:text-foreground transition-colors">
                  İşlemciler
                </Link>
              </li>
              <li>
                <Link href="/components/gpu" className="text-muted-foreground hover:text-foreground transition-colors">
                  Ekran Kartları
                </Link>
              </li>
              <li>
                <Link href="/components/motherboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Anakartlar
                </Link>
              </li>
              <li>
                <Link href="/components/ram" className="text-muted-foreground hover:text-foreground transition-colors">
                  RAM
                </Link>
              </li>
              <li>
                <Link href="/components/storage" className="text-muted-foreground hover:text-foreground transition-colors">
                  Depolama
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">İletişim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sık Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-muted-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} PC Builder. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Facebook</span>
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Instagram</span>
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">YouTube</span>
                <YouTubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// Sosyal medya ikonları
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);