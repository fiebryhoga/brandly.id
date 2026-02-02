/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                brandPrimary: '#2f74a9',   // Biru Utama
                brandSecondary: '#47be9e', // Hijau Aksen
                brandDark: '#1a2b4e',      // Biru Gelap / Text Primer
                // Tambahan netral jika diperlukan
                // grayLight: '#f8f9fa',
                // grayMedium: '#dee2e6',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Font modern seperti Inter, Poppins, Montserrat
                // Kamu bisa tambahkan font lain jika perlu
            },
        },
    },

    plugins: [require('@tailwindcss/forms')],
};