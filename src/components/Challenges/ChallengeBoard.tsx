import { useState, useEffect } from 'react';
import type { Challenge } from '../../types';
import ChallengeCard from './ChallengeCard';
import { useAuth } from '../../context/AuthContext';
import { getDocument, createDocument } from '../../lib/firestore';

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'zero-meat-monday',
    title: 'Zero-Meat Monday',
    description: 'Skip meat for one full day and opt for plant-based or vegetarian meals.',
    estimated_saving_kg: 6.0,
    duration_days: 1,
    category: 'food',
    completed: false,
  },
  {
    id: 'public-transit-week',
    title: 'Public Transit Week',
    description: 'Avoid using your private car for all 5 workdays — take bus, metro, or train instead.',
    estimated_saving_kg: 9.6,
    duration_days: 5,
    category: 'transport',
    completed: false,
  },
  {
    id: 'cold-shower',
    title: 'Cold Shower Challenge',
    description: 'Skip water heating for 7 consecutive days and take cold showers to reduce energy use.',
    estimated_saving_kg: 4.9,
    duration_days: 7,
    category: 'energy',
    completed: false,
  },
  {
    id: 'local-produce',
    title: 'Local Produce Only',
    description: 'Avoid air-freighted food for 3 days — choose locally grown or seasonal produce.',
    estimated_saving_kg: 3.0,
    duration_days: 3,
    category: 'food',
    completed: false,
  },
  {
    id: 'no-car-day',
    title: 'Car-Free Day',
    description: 'Walk or cycle for every trip today — leave your car keys at home.',
    estimated_saving_kg: 1.9,
    duration_days: 1,
    category: 'transport',
    completed: false,
  },
  {
    id: 'unplug-standby',
    title: 'Unplug Standby',
    description: 'Kill phantom load by unplugging all standby devices for 1 full week.',
    estimated_saving_kg: 2.0,
    duration_days: 7,
    category: 'energy',
    completed: false,
  },
  {
    id: 'secondhand-only',
    title: 'Second-Hand Only',
    description: 'Pledge no new clothing purchases for 2 weeks — shop secondhand or swap with friends.',
    estimated_saving_kg: 5.0,
    duration_days: 14,
    category: 'shopping',
    completed: false,
  },
  {
    id: 'carpool-week',
    title: 'Carpool Week',
    description: 'Share rides with colleagues or neighbours every workday for 5 days.',
    estimated_saving_kg: 4.8,
    duration_days: 5,
    category: 'transport',
    completed: false,
  },
];

export default function ChallengeBoard() {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  useEffect(() => {
    let isMounted = true;
    async function loadChallenges() {
      if (!currentUser) {
        if (isMounted) setChallenges(INITIAL_CHALLENGES);
        return;
      }
      // Anonymous users: use localStorage
      if (currentUser.isAnonymous) {
        try {
          const raw = localStorage.getItem('ecolens_demo_challenges');
          if (raw && isMounted) {
            const completedIds = new Set<string>(JSON.parse(raw));
            setChallenges(INITIAL_CHALLENGES.map(c => ({ ...c, completed: completedIds.has(c.id) })));
          } else if (isMounted) {
            setChallenges(INITIAL_CHALLENGES);
          }
        } catch {
          if (isMounted) setChallenges(INITIAL_CHALLENGES);
        }
        return;
      }
      try {
        const doc = await getDocument<{ completedIds: string[] }>(`users/${currentUser.uid}/data`, 'challenges');
        if (isMounted && doc?.completedIds) {
          const completedSet = new Set(doc.completedIds);
          setChallenges(INITIAL_CHALLENGES.map(c => ({
            ...c,
            completed: completedSet.has(c.id)
          })));
        } else if (isMounted) {
          setChallenges(INITIAL_CHALLENGES);
        }
      } catch (err) {
        console.error('Failed to load challenges:', err);
      }
    }
    loadChallenges();
    return () => { isMounted = false; };
  }, [currentUser]);

  async function handleToggle(id: string) {
    if (!currentUser) return;

    let newChallenges: Challenge[] = [];
    setChallenges(prev => {
      newChallenges = prev.map(c => (c.id === id ? { ...c, completed: true } : c));
      return newChallenges;
    });

    const completedIds = newChallenges.filter(c => c.completed).map(c => c.id);

    if (currentUser.isAnonymous) {
      localStorage.setItem('ecolens_demo_challenges', JSON.stringify(completedIds));
      return;
    }

    try {
      await createDocument(`users/${currentUser.uid}/data`, 'challenges', { completedIds });
    } catch (err) {
      console.error('Failed to save challenge progress:', err);
      setChallenges(prev => prev.map(c => (c.id === id ? { ...c, completed: false } : c)));
    }
  }

  const completedChallenges = challenges.filter(c => c.completed);
  const totalSaving = completedChallenges.reduce((s, c) => s + c.estimated_saving_kg, 0);
  const completedCount = completedChallenges.length;
  const progressPct = (completedCount / challenges.length) * 100;

  return (
    <section aria-labelledby="challenges-heading">
      {/* Stats banner */}
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="challenges-heading" className="text-base font-semibold text-white">
              Your Progress
            </h2>
            <p className="text-white/40 text-xs mt-0.5">Complete challenges to reduce your footprint</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-[#2DC878] tabular-nums">{completedCount}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-wide">Done</p>
            </div>
            <div className="w-px h-8 bg-white/10" aria-hidden="true" />
            <div className="text-center">
              <p className="text-xl font-bold text-[#2DC878] tabular-nums">{totalSaving.toFixed(1)}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-wide">kg saved</p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div
          className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={challenges.length}
          aria-label={`${completedCount} of ${challenges.length} challenges completed`}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%`, background: '#2DC878' }}
          />
        </div>
        <p className="text-white/25 text-[9px] mt-1.5 text-right">{completedCount}/{challenges.length} challenges</p>
      </div>

      {/* Challenge grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children"
        aria-label="List of eco challenges"
      >
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  );
}
