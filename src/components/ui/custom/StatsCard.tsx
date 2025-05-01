
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string | number;
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn("rounded-lg border bg-card p-5 shadow-sm", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-semibold mt-1">{value}</h4>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          {trend === "up" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-emerald-500 mr-1"
            >
              <path d="m5 12 7-7 7 7"></path>
              <path d="M12 19V5"></path>
            </svg>
          )}
          {trend === "down" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-rose-500 mr-1"
            >
              <path d="M12 5v14"></path>
              <path d="m5 12 7 7 7-7"></path>
            </svg>
          )}
          <span
            className={cn(
              trend === "up" && "text-emerald-500",
              trend === "down" && "text-rose-500",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trendValue}
          </span>
          <span className="ml-1 text-muted-foreground">vs previous</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
