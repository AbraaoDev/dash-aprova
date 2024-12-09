import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type RecentSalesProps = {
  top10Processes: { name: string; count: number }[];
};

export function RecentSales({ top10Processes }: RecentSalesProps) {
  return (
    <ScrollArea className="h-[250px] w-full pr-4">
      <div className="space-y-4">
        {top10Processes.map((process, index) => (
          <div 
            className="flex items-center border-b pb-3 last:border-b-0" 
            key={index}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>{process.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 flex-grow">
              <p className="text-sm font-medium leading-none">{process.name}</p>
            </div>
            <div className="ml-auto font-medium">{process.count}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}