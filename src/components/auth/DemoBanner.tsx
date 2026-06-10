import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DemoBanner() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser?.isAnonymous) return null;

  return (
    <div className="bg-[#2DC878]/10 border-b border-[#2DC878]/20 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2DC878] animate-pulse" />
        <span className="text-[#2DC878] text-[11px] font-medium">Demo mode — data won't be saved</span>
      </div>
      <button
        onClick={() => navigate('/auth')}
        className="text-[#2DC878] text-[11px] underline underline-offset-2 hover:text-[#5CE8A0] transition-colors"
      >
        Sign up to save
      </button>
    </div>
  );
}
