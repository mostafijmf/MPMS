import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanSkeleton() {
  const columns = [
    { title: "To Do", cardCount: 4 },
    { title: "In Progress", cardCount: 4 },
    { title: "Review", cardCount: 4 },
    { title: "Done", cardCount: 4 },
  ];

  return (
    <section className="max-w-450">
      <div className="flex overflow-x-auto overflow-visible snap-x snap-mandatory gap-x-4 gap-y-6 py-7 px-2">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="min-w-[320px] w-full snap-start bg-accent rounded group border transition-all duration-300 pb-5"
          >
            <div className="p-4">
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="px-3 space-y-2">
              {Array.from({ length: column.cardCount }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-card border rounded-sm p-3 space-y-3">
                  <Skeleton className="h-5 w-3/4" />

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
