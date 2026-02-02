import ApplicationLogo from '@/Components/ApplicationLogo'; // Kita akan buat komponen logo sendiri
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            {/* Hapus div ini jika ingin tampilan split-screen sepenuhnya */}
            {/* <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div> */}
            {children} {/* Children adalah konten dari Login.jsx */}
        </div>
    );
}