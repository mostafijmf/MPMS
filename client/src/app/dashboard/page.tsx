import PageContainer from "@/components/dashboard/page-container";
import TeamWorkloadTable from "@/components/dashboard/team-workload-table";
import ErrorPage from "@/components/error-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSummary } from "@/fetch-api/summary";
import { cn } from "@/lib/utils";
import { CheckCircle2, ClipboardClock, ClockAlert, Folder, FolderClock, ListTodo } from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {
  const { data, error, message } = await getSummary();

  if (error) return <ErrorPage error={message} />;
  // console.log(data);
  const role = data?.data?.role;
  const isMember = role === "member";
  const stats = data?.data?.stats;
  const myTasks = data?.data?.myTasks;
  const activeProjects = data?.data?.activeProjects;
  const teamWorkload = data?.data?.teamWorkload;

  return (
    <PageContainer title="Dashboard">
      <div className="py-6 space-y-6 max-w-450 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {isMember ? (
            <>
              <StatCard icon={ListTodo} label="My Tasks" value={stats?.myTasks} color="bg-blue-500" />
              <StatCard
                icon={ClipboardClock}
                label="In Progress Tasks"
                value={stats?.inProgressTasks}
                color="bg-indigo-500"
              />
              <StatCard
                icon={CheckCircle2}
                label="Completed Tasks"
                value={stats?.completedTasks}
                color="bg-emerald-500"
              />
              <StatCard icon={ClockAlert} label="Over Due Tasks" value={stats?.overdueTasks} color="bg-red-500" />
            </>
          ) : (
            <>
              <StatCard icon={Folder} label="Total Projects" value={stats?.totalProjects} color="bg-amber-500" />
              <StatCard icon={FolderClock} label="Active Projects" value={stats?.activeProjects} color="bg-blue-500" />
              <StatCard icon={ListTodo} label="Total Tasks" value={stats?.totalTasks} color="bg-indigo-500" />
              <StatCard
                icon={CheckCircle2}
                label="Completed Tasks"
                value={stats?.completedTasks}
                color="bg-emerald-500"
              />
            </>
          )}
        </div>

        {isMember && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Tasks</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={"/dashboard/projects"}>View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {myTasks?.length === 0 ? (
                <p className="text-muted-foreground">No tasks assigned</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myTasks?.map((task: any) => (
                      <TableRow key={task._id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.projectId?.title ?? "—"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "done"
                                ? "outline"
                                : task.status === "in_progress"
                                ? "default"
                                : task.status === "review"
                                ? "secondary"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {!isMember && (
          <Card className="max-sm:border-0 max-sm:shadow-none bg-accent">
            <CardHeader className="max-sm:p-0">
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="max-sm:p-0 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeProjects?.length === 0 ? (
                <p className="text-muted-foreground">No active projects</p>
              ) : (
                activeProjects?.map((p: any) => (
                  <Link key={p?._id} href={`/dashboard/projects/${p?._id}`}>
                    <Card className="border hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="text-base">{p?.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{p?.progress ?? 0}%</span>
                        </div>
                        <div className="h-2 w-full rounded bg-muted">
                          <div className="h-2 rounded bg-primary" style={{ width: `${p?.progress ?? 0}%` }} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {!isMember && <TeamWorkloadTable data={teamWorkload} />}
      </div>
    </PageContainer>
  );
};

export default DashboardPage;

const StatCard: React.FC<{ icon: any; label: string; value: number; color: string }> = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div className="p-6 rounded-xl shadow-sm border flex items-center">
    <div className={cn("p-4 rounded-lg text-white mr-4 shadow-md", color)}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);
