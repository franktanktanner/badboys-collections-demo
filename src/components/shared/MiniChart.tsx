import { Area, AreaChart, ResponsiveContainer, Line, LineChart } from 'recharts';

type Datum = { value: number; [key: string]: number };

export function MiniSparkline({
  data,
  color = '#EAB308',
  height = 40,
  variant = 'area',
}: {
  data: Datum[];
  color?: string;
  height?: number;
  variant?: 'area' | 'line';
}) {
  const id = `grad-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        {variant === 'area' ? (
          <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.75}
              fill={`url(#${id})`}
              isAnimationActive
              animationDuration={900}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.75}
              dot={false}
              isAnimationActive
              animationDuration={900}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
