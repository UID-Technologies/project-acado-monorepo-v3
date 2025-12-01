import { Card } from '@/components/ui/card';

const UniversityCommunications = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Communications</h1>
      <p className="text-muted-foreground">Plan campaigns, schedule outreach, and review inbox activity.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      Messaging workflows will surface here. Hook this view up to your CRM or marketing automation when available.
    </Card>
  </div>
);

export default UniversityCommunications;
