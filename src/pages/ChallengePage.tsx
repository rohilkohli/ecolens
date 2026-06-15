import ChallengeBoard from '../components/Challenges/ChallengeBoard';
import DemoBanner from '../components/auth/DemoBanner';

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pb-24 md:pb-8">
      <DemoBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pt-6 pb-4 border-b border-[var(--border-color)]">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
            🏆 Eco Challenges
          </h1>
          <p className="text-[var(--text-muted)] text-xs mt-1">
            Take on daily and weekly habits to cut your carbon footprint.
          </p>
        </div>

        <div className="pt-5 animate-fade-in-up">
          <ChallengeBoard />
        </div>
      </div>
    </div>
  );
}
