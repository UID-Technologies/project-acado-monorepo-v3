import { Card } from '@/components/ui/card';

const UniversityAnalytics = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Analytics Dashboard</h1>
      <p className="text-muted-foreground">Monitor funnel performance, conversion trends, and application health.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      Connect your analytics source to populate this view with live metrics.
    </Card>
  </div>
);

export default UniversityAnalytics;
