// src/lib/db.ts
// Bu dosya veritabanı bağlantısını veya ORM kullanımını yönetir
// (örneğin Prisma, Supabase, Firebase vb.)

// Şimdilik sadece örnek bir yapı ekleyelim

export const db = {
  // Örnek kullanıcıları getir
  async getUsers() {
    // Gerçek uygulamada burada veritabanı sorgusu olacak
    return [
      { id: '1', name: 'Kullanıcı 1', email: 'user1@example.com' },
      { id: '2', name: 'Kullanıcı 2', email: 'user2@example.com' },
    ];
  },
  
  // Kaydedilen yapılandırmaları getir
  async getSavedBuilds(userId: string) {
    // Gerçek uygulamada burada veritabanı sorgusu olacak
    return [
      { id: 'build1', name: 'Oyun Bilgisayarı', userId: '1', createdAt: new Date().toISOString() },
      { id: 'build2', name: 'İş İstasyonu', userId: '1', createdAt: new Date().toISOString() },
    ];
  },
  
  // Yapılandırmayı kaydet
  async saveBuild(buildData: any) {
    console.log('Yapılandırma kaydediliyor:', buildData);
    // Gerçek uygulamada burada veritabanına kayıt yapılacak
    return { id: `build${Date.now()}`, ...buildData };
  }
};