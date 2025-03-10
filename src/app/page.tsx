// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero bölümü */}
      <section className="py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Hayalindeki Bilgisayarı<br />
              <span className="text-primary">Kolayca Topla</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Profesyonel bilgisayar toplama platformumuzla, ihtiyaçlarınıza uygun en ideal bilgisayarı
              AI destekli öneriler eşliğinde bir araya getirin. Oyun performansını önceden görün.
              Tüm parçaların uyumluluğunu kontrol edin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-md">
                <Link href="/build">Bilgisayar Topla</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-md">
                <Link href="/games">Oyun Performansları</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-72 md:h-96 w-full mt-8 md:mt-0">
            <Image
              src="/images/hero-pc.png"
              alt="Bilgisayar Toplama"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Özellikler bölümü */}
      <section className="py-12 md:py-20" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Öne Çıkan Özellikler</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Her seviyedeki kullanıcılar için geliştirdiğimiz yapay zeka destekli platformumuz, 
            bilgisayar toplama sürecini kolay ve keyifli hale getiriyor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🧠" 
            title="AI Destekli Öneriler" 
            description="Kullanım amacınıza ve bütçenize göre en ideal parçaları size özel olarak öneren yapay zeka destekli sistem."
          />
          <FeatureCard 
            icon="📊" 
            title="Performans Tahminleri" 
            description="Seçtiğiniz parçalarla oluşturduğunuz sistemin farklı oyunlardaki ve uygulamalardaki performansını önceden görün."
          />
          <FeatureCard 
            icon="🧩" 
            title="Uyumluluk Kontrolü" 
            description="Seçtiğiniz tüm parçaların birbiriyle uyumlu olup olmadığını otomatik olarak kontrol eden gelişmiş uyumluluk sistemi."
          />
          <FeatureCard 
            icon="💰" 
            title="En İyi Fiyat Karşılaştırma" 
            description="Farklı mağazalardaki fiyatları karşılaştırarak en uygun fiyatlı alışveriş listesi oluşturun."
          />
          <FeatureCard 
            icon="🔧" 
            title="Özelleştirilebilir Yapılandırmalar" 
            description="İhtiyaçlarınıza göre sisteminizdeki her bir parçayı özelleştirerek size özel bir bilgisayar oluşturun."
          />
          <FeatureCard 
            icon="📱" 
            title="Yapılandırma Paylaşımı" 
            description="Oluşturduğunuz bilgisayar yapılandırmalarını arkadaşlarınızla kolayca paylaşın ve görüşlerini alın."
          />
        </div>
      </section>

      {/* Nasıl Çalışır bölümü */}
      <section className="py-12 md:py-20 bg-muted/30 rounded-3xl px-8 my-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Nasıl Çalışır?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sadece birkaç adımda hayalinizdeki bilgisayarı toplayın ve performansını önceden görün.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            number="1" 
            title="Kullanım Amacını Seçin" 
            description="Oyun, tasarım, yazılım geliştirme veya ofis işlemleri gibi kullanım amaçlarınızı belirleyin."
          />
          <StepCard 
            number="2" 
            title="Bütçenizi Belirleyin" 
            description="Harcamak istediğiniz miktarı belirleyin ve bütçenize en uygun parçaları bulun."
          />
          <StepCard 
            number="3" 
            title="Parçaları Seçin" 
            description="AI destekli önerilerle veya manuel olarak bilgisayarınızın parçalarını seçin."
          />
          <StepCard 
            number="4" 
            title="Performansı Görün" 
            description="Oluşturduğunuz sistemin oyun ve uygulama performansını önceden görün ve satın alın."
          />
        </div>
      </section>

      {/* Kullanıcı değerlendirmeleri */}
      <section className="py-12 md:py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Kullanıcı Yorumları</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Platformumuzu kullanan binlerce kişinin deneyimlerini okuyun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Ahmet Yılmaz" 
            role="Oyun Geliştirici" 
            testimonial="İş için yüksek performanslı bir bilgisayar toplamam gerekiyordu ve bu platform sayesinde bütçemi aşmadan idealini bulabildim. Özellikle parça uyumluluğu kontrolü çok işime yaradı."
          />
          <TestimonialCard 
            name="Zeynep Kaya" 
            role="Oyun Yayıncısı" 
            testimonial="Yayınlar için iyi bir sisteme ihtiyacım vardı ama teknik bilgim sınırlıydı. AI önerileri ve FPS tahminleri sayesinde mükemmel bir yayın bilgisayarı toplayabildim."
          />
          <TestimonialCard 
            name="Mehmet Demir" 
            role="Öğrenci" 
            testimonial="Sınırlı bir bütçeyle oyun bilgisayarı toplamak istiyordum. Fiyat karşılaştırma özelliği sayesinde en uygun fiyatlı parçaları bularak harika bir sistem kurdum."
          />
        </div>
      </section>

      {/* CTA bölümü */}
      <section className="py-12 md:py-20 bg-primary/5 rounded-3xl my-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Hayalinizdeki Bilgisayarı Toplamaya Başlayın</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Ücretsiz ve kayıt gerektirmeden hemen şimdi bilgisayarınızı oluşturmaya başlayın.
          İstediğiniz performansı elde edin.
        </p>
        <Button asChild size="lg" className="text-md px-8">
          <Link href="/build">Hemen Başla</Link>
        </Button>
      </section>
    </div>
  );
}

// Özellik Kartı Bileşeni
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="text-4xl mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Adım Kartı Bileşeni
function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

// Kullanıcı Yorumu Kartı Bileşeni
function TestimonialCard({ name, role, testimonial }: { name: string; role: string; testimonial: string }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {name.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{testimonial}</p>
      </CardContent>
    </Card>
  );
}