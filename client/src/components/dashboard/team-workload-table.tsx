import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeamWorkloadProps {
  data: {
    user: any;
    total: number;
    inProgress: number;
    overdue: number;
  }[];
}
export default function TeamWorkloadTable({ data }: TeamWorkloadProps) {
  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="h-12 bg-accent">
            <TableHead className="pl-5">Member</TableHead>
            <TableHead className="">Total Tasks</TableHead>
            <TableHead className="">In Progress</TableHead>
            <TableHead className="">Overdue</TableHead>
            <TableHead className="pr-5">Load</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((item, index) => {
            const loadLevel = item?.total >= 10 ? "High" : item?.total >= 5 ? "Medium" : "Low";

            return (
              <TableRow key={index} className="h-12">
                <TableCell className="font-medium pl-5">{item?.user}</TableCell>

                <TableCell>{item?.total}</TableCell>

                <TableCell>
                  <Badge variant="secondary">{item?.inProgress}</Badge>
                </TableCell>

                <TableCell>
                  {item?.overdue > 0 ? (
                    <Badge variant="destructive">{item?.overdue}</Badge>
                  ) : (
                    <Badge variant="outline">0</Badge>
                  )}
                </TableCell>

                <TableCell className="pr-5">
                  <Badge
                    variant={loadLevel === "High" ? "destructive" : loadLevel === "Medium" ? "secondary" : "outline"}
                  >
                    {loadLevel}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
