import { Card } from '@/components/ui/card';

const UniversityContent = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Content Hub</h1>
      <p className="text-muted-foreground">Manage stories, highlights, and featured assets for prospective students.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      Content management tooling is coming soon. In the meantime, coordinate with the central admin team to publish updates.
    </Card>
  </div>
);

export default UniversityContent;
