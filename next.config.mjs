/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                // Pastikan hostname ini sesuai dengan proyek Anda
                hostname: 'lytxgujwpbloelmvvjej.supabase.co', 
                port: '',
                // Gunakan pathname yang lebih umum ini
                pathname: '/storage/v1/object/public/**', 
            },
        ],
    },
};

export default nextConfig;