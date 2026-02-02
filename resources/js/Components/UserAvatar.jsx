export default function UserAvatar({ user, className = "w-10 h-10" }) {
    // 1. Cek apakah user punya avatar
    const imageSource = user.avatar 
        ? `/storage/${user.avatar}` // Jika ada, ambil dari storage
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`; // Jika tidak, pakai inisial

    return (
        <img 
            src={imageSource} 
            alt={user.name} 
            className={`rounded-full object-cover border border-slate-200 ${className}`} 
        />
    );
}