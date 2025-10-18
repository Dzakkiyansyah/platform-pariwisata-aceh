import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1C2C4A] text-white">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo dan Deskripsi */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-2xl mb-4 text-white">Jelajah Aceh</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform pariwisata digital resmi Kota Banda Aceh yang
              menghubungkan wisatawan dengan destinasi terverifikasi dan
              pengalaman otentik.
            </p>
          </div>

          {/* Navigasi  */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Navigasi Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/destinasi" className="text-gray-300 hover:text-white transition-colors">
                  Destinasi
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-gray-300 hover:text-white transition-colors">
                  Berita & Acara
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-gray-300 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/hubungi" className="text-gray-300 hover:text-white transition-colors">
                  Hubungi
                </Link>
              </li>
            </ul>
          </div>

          {/*  untuk Mitra */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Untuk Mitra</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/daftar-pengelola" className="text-gray-300 hover:text-white transition-colors">
                  Daftar Pengelola
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-300">+62 821 6535 8189</li>
              <li className="text-gray-300">contact@dzakkiyansyah.my.id</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="border-t border-gray-600 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Dzakkiyansyah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;