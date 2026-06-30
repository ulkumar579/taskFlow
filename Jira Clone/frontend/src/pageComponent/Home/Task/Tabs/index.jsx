import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabList } from "./TabList";

export function Tab() {
  return (
    <Tabs defaultValue="allTasks" className="">
      <TabsList className="bg-transparent gap-1.5">
        <TabsTrigger
          className="p-3 py-4 bg-white shadow-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          value="allTasks"
        >
          All Tasks (7)
        </TabsTrigger>
        <TabsTrigger
          className="p-3 py-4 bg-white shadow-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          value="active"
        >
          Active (7)
        </TabsTrigger>
        <TabsTrigger
          className="p-3 py-4 bg-white shadow-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          value="completed"
        >
          Completed (0)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="allTasks">
        {/* <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              View your key metrics and recent project activity. Track progress
              across all your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 12 active projects and 3 pending tasks.
          </CardContent>
        </Card> */}
        <TabList/>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Track performance and user engagement metrics. Monitor trends and
              identify growth opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Page views are up 25% compared to last month.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Generate and download your detailed reports. Export data in
              multiple formats for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have 5 reports ready and available to export.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and options. Customize your
              experience to fit your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Configure notifications, security, and themes.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
