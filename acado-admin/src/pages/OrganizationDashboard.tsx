import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Building2, CheckCircle, Clock, TrendingUp, Plus } from 'lucide-react';

const onboardingStages = [
  {
    id: 'stage-1',
    title: 'Account Created',
    description: 'Initial organization profile setup completed',
    count: 12,
    trend: '+3',
  },
  {
    id: 'stage-2',
    title: 'In Review',
    description: 'Awaiting documents or approval',
    count: 5,
    trend: '+1',
  },
  {
    id: 'stage-3',
    title: 'Approved',
    description: 'Ready for full access to the platform',
    count: 8,
    trend: '+2',
  },
  {
    id: 'stage-4',
    title: 'Active',
    description: 'Actively onboarding learners',
    count: 14,
    trend: '+4',
  },
];

const activityFeed = [
  {
    id: 'activity-1',
    title: 'BrightFuture Academy completed onboarding',
    timestamp: '2 hours ago',
    status: 'Completed',
  },
  {
    id: 'activity-2',
    title: 'Global Skills Hub submitted compliance documents',
    timestamp: 'Yesterday',
    status: 'In Review',
  },
  {
    id: 'activity-3',
    title: 'TechBridge Institute scheduled kickoff session',
    timestamp: '2 days ago',
    status: 'Scheduled',
  },
];

const OrganizationDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Organization Onboarding</h1>
        <p className="text-muted-foreground">
          Track onboarding progress, review pending organizations, and manage approvals.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Organizations
            </CardTitle>
            <Building2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">39</div>
            <p className="text-xs text-muted-foreground mt-1">+6 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Organizations
            </CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">28</div>
            <Progress className="mt-3 h-2" value={72} />
            <p className="text-xs text-muted-foreground mt-1">72% of organizations are active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">7</div>
            <p className="text-xs text-muted-foreground mt-1">Documents awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">64%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Learners onboarded per organization this quarter
            </p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="stages" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="stages">Onboarding Stages</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Health</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {onboardingStages.map((stage) => (
              <Card key={stage.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stage.title}</CardTitle>
                    <Badge variant="outline">{stage.trend}</Badge>
                  </div>
                  <CardDescription>{stage.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{stage.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Pipeline Health</CardTitle>
              <CardDescription>
                Identify bottlenecks across the onboarding journey for partner organizations.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Approval Rate
                  </span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="mt-4 text-2xl font-semibold">82%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Organizations approved after compliance review
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Avg. Onboarding Time
                  </span>
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div className="mt-4 text-2xl font-semibold">6.4 days</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Average time from registration to first cohort launch
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Active Learners
                  </span>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-4 text-2xl font-semibold">1,842</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Learners currently engaged with partnered organizations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Onboarding Activity</CardTitle>
              <CardDescription>
                Latest updates from organizations as they progress through onboarding steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 transition hover:bg-muted/50 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                  </div>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;


