import { Card } from '@/components/ui/card';

const UniversityCourseEditor = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Course Wizard</h1>
      <p className="text-muted-foreground">Create or update programmes offered to prospective learners.</p>
    </div>
    <Card className="p-6 text-sm text-muted-foreground">
      The course builder will surface here; until then, coordinate with the central team for structural changes.
    </Card>
  </div>
);

export default UniversityCourseEditor;
