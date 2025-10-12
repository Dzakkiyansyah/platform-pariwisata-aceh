/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            // Naikkan batas ukuran body menjadi 10 MB
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;