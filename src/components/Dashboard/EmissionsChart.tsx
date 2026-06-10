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

function DarkTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-white/40 text-[9px] mb-0.5">{label}</p>
      <p className="text-[#2DC878] text-sm font-semibold tabular-nums">
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
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={weeklyData} barCategoryGap="20%">
            <XAxis
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val: string) => DAY_MAP[new Date(val).getDay()] ?? ''}
            />
            <Tooltip
              content={<DarkTooltip />}
              cursor={{ fill: 'rgba(45,200,120,0.05)' }}
            />
            <Bar dataKey="total" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={600}>
              {weeklyData.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === weeklyData.length - 1 ? '#2DC878' : 'rgba(45,200,120,0.28)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown bars */}
      <div className="mt-5 space-y-3">
        <p className="text-white/25 text-[9px] uppercase tracking-widest">Category breakdown (7 days)</p>
        {(Object.entries(categoryBreakdown) as [Category, number][]).map(([cat, value]) => {
          const config = CATEGORY_CONFIG[cat];
          const pct = maxCategory > 0 ? (value / maxCategory) * 100 : 0;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden="true">{config.icon}</span>
                  <span className="text-xs text-white/50">{config.label}</span>
                </div>
                <span className="text-xs font-semibold text-white tabular-nums">{value.toFixed(2)} kg</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: '#2DC878', opacity: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
