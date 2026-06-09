import ChallengeBoard from '../components/Challenges/ChallengeBoard';

export default function ChallengePage() {
  return (
    <div className="min-h-screen gradient-leaf-radial">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-2xl">🏆</span> Eco Challenges
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Take on daily and weekly challenges to meaningfully cut your carbon footprint.
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ChallengeBoard />
        </div>
      </div>
    </div>
  );
}
