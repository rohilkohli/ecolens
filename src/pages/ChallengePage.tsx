import ChallengeBoard from '../components/Challenges/ChallengeBoard';
import DemoBanner from '../components/auth/DemoBanner';

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
      <DemoBanner />

      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/[0.07]">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          🏆 Eco Challenges
        </h1>
        <p className="text-white/40 text-xs mt-1">
          Take on daily and weekly habits to cut your carbon footprint.
        </p>
      </div>

      <div className="px-4 pt-4 animate-fade-in-up">
        <ChallengeBoard />
      </div>
    </div>
  );
}
