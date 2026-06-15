import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { Category } from '../../types';

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

const DAY_MAP: Record<number, string> = { 0: 'S', 1: 'M', 2: 'T', 3: 'W', 4: 'T', 5: 'F', 6: 'S' };

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-[var(--text-muted)] text-[9px] mb-0.5">{label}</p>
      <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
        {payload[0].value.toFixed(2)} kg CO₂e
      </p>
    </div>
  );
}

const CATEGORY_CONFIG: Record<Category, { label: string; icon: string }> = {
  transport: { label: 'Transport', icon: '🚗' },
  food:      { label: 'Food',      icon: '🍽️' },
  energy:    { label: 'Energy',    icon: '⚡' },
  shopping:  { label: 'Shopping',  icon: '🛍️' },
};

export default function EmissionsChart({ weeklyData, categoryBreakdown }: EmissionsChartProps) {
  const maxCategory = Math.max(...Object.values(categoryBreakdown), 0.01);

  return (
    <div>
      {/* 7-day bar chart */}
      <div role="img" aria-label="7-day CO₂ emissions bar chart">
        <ResponsiveContainer width="100%" height={90}>
          <BarChart data={weeklyData} barCategoryGap="20%">
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val: string) => DAY_MAP[new Date(val).getDay()] ?? ''}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: 'var(--bg-card-hover)' }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600}>
              {weeklyData.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === weeklyData.length - 1 ? 'var(--accent)' : 'var(--accent)'}
                  fillOpacity={index === weeklyData.length - 1 ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown bars */}
      <div className="mt-5 space-y-3">
        <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider font-medium">Category breakdown (7 days)</p>
        {(Object.entries(categoryBreakdown) as [Category, number][]).map(([cat, value]) => {
          const config = CATEGORY_CONFIG[cat];
          const pct = maxCategory > 0 ? (value / maxCategory) * 100 : 0;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden="true">{config.icon}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{config.label}</span>
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">{value.toFixed(2)} kg</span>
              </div>
              <div className="h-1.5 bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: 'var(--accent)', opacity: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
