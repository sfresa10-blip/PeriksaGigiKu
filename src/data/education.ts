export interface EducationMaterial {
  id: string;
  title: string;
  category: 'Menyikat Gigi' | 'Diet & Nutrisi' | 'Penyakit Gigi' | 'Pencegahan' | 'Video Edukasi';
  content: string;
  imageUrl: string;
  videoUrl?: string;
  steps?: string[];
}

export const EDUCATION_MATERIALS: EducationMaterial[] = [
  {
    id: 'video-brushing',
    title: 'Video: Cara Menyikat Gigi yang Benar',
    category: 'Video Edukasi',
    content: 'Tonton video tutorial langkah demi langkah menyikat gigi dengan teknik yang efektif untuk menjaga kebersihan mulut.',
    imageUrl: 'https://picsum.photos/seed/brushing-teeth-video/800/450',
    videoUrl: 'https://www.youtube.com/embed/DdVTN0bU7gI',
    steps: [
      'Siapkan sikat gigi dan pasta gigi berfluoride.',
      'Ikuti gerakan dalam video dengan seksama.',
      'Pastikan semua permukaan gigi tersikat.',
      'Jangan lupa menyikat lidah.'
    ]
  },
  {
    id: 'video-flossing',
    title: 'Video: Tutorial Dental Flossing',
    category: 'Video Edukasi',
    content: 'Pelajari cara menggunakan benang gigi (dental floss) untuk membersihkan sela-sela gigi yang tidak terjangkau sikat.',
    imageUrl: 'https://picsum.photos/seed/dental-floss-video/800/450',
    videoUrl: 'https://www.youtube.com/embed/Gkxh6uZSbOo',
    steps: [
      'Ambil benang gigi sepanjang 45cm.',
      'Lilitkan di jari tengah kedua tangan.',
      'Gerakkan perlahan di sela gigi mengikuti lengkungan gigi.',
      'Gunakan bagian benang yang bersih untuk setiap sela gigi.'
    ]
  },
  {
    id: 'video-scaling',
    title: 'Video: Mengenal Prosedur Scaling Gigi',
    category: 'Video Edukasi',
    content: 'Tonton bagaimana karang gigi dibersihkan menggunakan alat ultrasonik untuk mencegah penyakit gusi.',
    imageUrl: 'https://picsum.photos/seed/dental-scaling-video/800/450',
    videoUrl: 'https://www.youtube.com/embed/-9UG3ee9Y2Y',
    steps: [
      'Pemeriksaan awal kondisi karang gigi.',
      'Pembersihan dengan alat ultrasonik scaler.',
      'Pembersihan sela-sela gigi secara manual.',
      'Polishing (pemolesan) permukaan gigi.',
      'Instruksi perawatan pasca scaling.'
    ]
  },
  {
    id: 'video-kids',
    title: 'Video: Edukasi Gigi Sehat untuk Anak',
    category: 'Video Edukasi',
    content: 'Video animasi yang menyenangkan untuk mengajarkan anak-anak pentingnya menjaga kebersihan gigi.',
    imageUrl: 'https://picsum.photos/seed/kids-dental-care-video/800/450',
    videoUrl: 'https://www.youtube.com/embed/6CYi4-id8Hg',
    steps: [
      'Tonton video bersama anak.',
      'Praktikkan gerakan menyikat gigi bersama.',
      'Gunakan pasta gigi rasa buah yang disukai anak.',
      'Jadikan menyikat gigi sebagai rutinitas yang menyenangkan.'
    ]
  },
  {
    id: 'pregnancy-dental',
    title: 'Kesehatan Gigi dan Mulut pada Ibu Hamil',
    category: 'Pencegahan',
    content: 'Perubahan hormon saat hamil dapat meningkatkan risiko radang gusi (gingivitis kehamilan).',
    imageUrl: 'https://picsum.photos/seed/pregnant-woman-dentist/800/450',
    steps: [
      'Tetap lakukan pemeriksaan gigi rutin saat hamil.',
      'Waspadai gusi bengkak dan mudah berdarah.',
      'Kumur air garam hangat jika gusi terasa tidak nyaman.',
      'Konsumsi makanan bergizi untuk pembentukan gigi janin.',
      'Segera periksa jika ada keluhan gigi yang mengganggu.'
    ]
  },
  {
    id: 'denture-care',
    title: 'Cara Merawat Gigi Tiruan (Gigi Palsu)',
    category: 'Pencegahan',
    content: 'Gigi tiruan juga perlu dibersihkan setiap hari agar tidak menjadi tempat berkumpulnya bakteri.',
    imageUrl: 'https://picsum.photos/seed/dentures-care/800/450',
    steps: [
      'Lepaskan gigi tiruan setiap malam sebelum tidur.',
      'Sikat gigi tiruan dengan sikat khusus dan sabun lembut.',
      'Rendam dalam air bersih atau larutan pembersih khusus.',
      'Bersihkan juga gusi dan lidah sebelum memasang kembali.',
      'Jangan gunakan air panas karena dapat merusak bentuk gigi tiruan.'
    ]
  },
  {
    id: 'brushing-tech',
    title: 'Teknik Menyikat Gigi yang Benar (Metode Bass)',
    category: 'Menyikat Gigi',
    content: 'Metode Bass adalah teknik menyikat gigi yang paling direkomendasikan untuk membersihkan plak di area gusi.',
    imageUrl: 'https://picsum.photos/seed/toothbrush-technique/800/450',
    steps: [
      'Pegang sikat gigi dengan sudut 45 derajat terhadap gusi.',
      'Gerakkan sikat maju-mundur dengan getaran pendek (vibrasi).',
      'Sikat permukaan luar, dalam, dan permukaan kunyah gigi.',
      'Untuk membersihkan permukaan dalam gigi depan, pegang sikat secara vertikal.',
      'Sikat lidah untuk menghilangkan bakteri dan menyegarkan napas.'
    ]
  },
  {
    id: 'diet-counseling',
    title: 'Diet Sehat untuk Gigi Kuat',
    category: 'Diet & Nutrisi',
    content: 'Apa yang Anda makan sangat mempengaruhi kesehatan gigi dan mulut Anda.',
    imageUrl: 'https://picsum.photos/seed/healthy-food-teeth/800/450',
    steps: [
      'Batasi konsumsi makanan dan minuman manis (gula).',
      'Perbanyak konsumsi serat dari buah dan sayuran.',
      'Minum air putih yang cukup, terutama yang mengandung fluoride.',
      'Konsumsi kalsium dari susu, keju, atau yogurt.',
      'Hindari ngemil di antara waktu makan utama.'
    ]
  },
  {
    id: 'caries-prevention',
    title: 'Mengenal dan Mencegah Karies (Gigi Berlubang)',
    category: 'Pencegahan',
    content: 'Karies terjadi karena asam yang dihasilkan oleh bakteri dari sisa makanan yang menempel.',
    imageUrl: 'https://picsum.photos/seed/tooth-decay-prevention/800/450',
    steps: [
      'Sikat gigi 2 kali sehari (pagi setelah sarapan dan malam sebelum tidur).',
      'Gunakan pasta gigi berfluoride.',
      'Gunakan benang gigi (dental floss) setidaknya sekali sehari.',
      'Lakukan pemeriksaan rutin ke dokter gigi setiap 6 bulan.',
      'Gunakan obat kumur jika direkomendasikan oleh dokter.'
    ]
  },
  {
    id: 'gum-health',
    title: 'Menjaga Kesehatan Gusi (Gingiva)',
    category: 'Penyakit Gigi',
    content: 'Gusi yang sehat berwarna merah muda pucat dan tidak mudah berdarah.',
    imageUrl: 'https://picsum.photos/seed/healthy-gums/800/450',
    steps: [
      'Waspadai gusi berdarah saat menyikat gigi.',
      'Lakukan scaling (pembersihan karang gigi) secara rutin.',
      'Hindari merokok karena dapat merusak jaringan penyangga gigi.',
      'Pijat gusi dengan lembut saat menyikat gigi.'
    ]
  },
  {
    id: 'preventive-tgm',
    title: 'Tindakan Preventif: Fissure Sealant & TAF',
    category: 'Pencegahan',
    content: 'Tindakan pencegahan yang dilakukan oleh Terapis Gigi untuk melindungi gigi dari lubang.',
    imageUrl: 'https://picsum.photos/seed/dental-prevention/800/450',
    steps: [
      'Fissure Sealant: Melapisi celah gigi geraham yang dalam untuk mencegah sisa makanan terjebak.',
      'Topical Application Fluoride (TAF): Mengoleskan gel fluoride untuk memperkuat email gigi.',
      'Scaling: Membersihkan karang gigi yang menjadi tempat berkumpulnya bakteri.',
      'Pemeriksaan Rutin: Mendeteksi dini masalah gigi sebelum menjadi parah.'
    ]
  }
];
