import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Card from '../ui/Card';
import type { Category } from '../../types';
import ProgressBar from '../ui/ProgressBar';

interface WeeklyData {
  date: string;
  total: number;
}

interface CategoryBreakdown {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
}

interface EmissionsChartProps {
  weeklyData: WeeklyData[];
  categoryBreakdown: CategoryBreakdown;
}

const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: 'leaf' | 'amber' | 'danger' | 'sky' }> = {
  transport: { label: 'Transport',  icon: '🚗', color: 'sky' },
  food:      { label: 'Food',       icon: '🍽️', color: 'amber' },
  energy:    { label: 'Energy',     icon: '⚡',  color: 'danger' },
  shopping:  { label: 'Shopping',   icon: '🛍️', color: 'leaf' },
};

function formatDateLabel(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-2.5 shadow-lg border border-[var(--border-subtle)]">
      <p className="text-xs text-[var(--text-muted)] font-medium">{label}</p>
      <p className="text-sm font-bold text-leaf tabular-nums">{payload[0].value.toFixed(2)} kg CO₂e</p>
    </div>
  );
}

export default function EmissionsChart({ weeklyData, categoryBreakdown }: EmissionsChartProps) {
  const chartData = weeklyData.map(d => ({
    ...d,
    label: formatDateLabel(d.date),
  }));

  const maxCategory = Math.max(...Object.values(categoryBreakdown), 0.01);

  return (
    <Card variant="elevated">
      {/* 7-day bar chart */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">7-Day Emissions Trend</h3>
        <div role="img" aria-label="7-day CO₂ emissions bar chart">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-leaf-light)" stopOpacity={1} />
                  <stop offset="100%" stopColor="var(--color-leaf)" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}kg`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'color-mix(in srgb, var(--color-leaf) 8%, transparent)' }} />
              <Bar
                dataKey="total"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
                name="CO₂e (kg)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">Category Breakdown (7 days)</h3>
        <div className="space-y-4">
          {(Object.entries(categoryBreakdown) as [Category, number][]).map(([cat, value]) => {
            const config = CATEGORY_CONFIG[cat];
            return (
              <div key={cat} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="text-base group-hover:scale-110 transition-transform">{config.icon}</span>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{config.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">{value.toFixed(2)} kg</span>
                </div>
                <ProgressBar
                  value={value}
                  max={maxCategory}
                  label={`${config.label} emissions`}
                  showLabel={false}
                  color={config.color}
                  size="md"
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
