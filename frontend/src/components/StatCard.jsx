import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils"; // shadcn utility for merging classes

export function StatCard({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  className,
}) {
  return (
    <Card
      className={cn(
        "bg-white/60 dark:bg-gray-800/80 backdrop-blur-md",
        "border-white/20 dark:border-gray-700/50 shadow-md rounded-2xl",
        "flex flex-col h-full transition-all duration-200",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground/80 lowercase">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>

      <CardContent className="flex-1">{children}</CardContent>

      {footer && (
        <CardFooter className="pt-2 border-t border-white/10 dark:border-gray-700/30">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
