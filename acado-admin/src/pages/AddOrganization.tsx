import React, { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationSelector, type LocationSelectorValue } from '@/components/location/LocationSelector';
import { generateSlug } from '@/lib/slug';
import { organizationsApi, type CreateOrganizationPayload } from '@/api/organizations.api';

const organizationTypes = ['University', 'Corporate', 'Non-Profit'];
const onboardingStages = ['Profile Created', 'Documents Submitted', 'Approved', 'Live'];

const AddOrganization: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [type, setType] = useState<'University' | 'Corporate' | 'Non-Profit'>('University');
  const [onboardingStage, setOnboardingStage] =
    useState<'Profile Created' | 'Documents Submitted' | 'Approved' | 'Live'>('Profile Created');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationSelectorValue>({
    country: '',
    state: '',
    city: '',
  });
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [primaryContactPhone, setPrimaryContactPhone] = useState('');
  const [secondaryContactName, setSecondaryContactName] = useState('');
  const [secondaryContactEmail, setSecondaryContactEmail] = useState('');
  const [secondaryContactPhone, setSecondaryContactPhone] = useState('');

  const [onboardingEmails, setOnboardingEmails] = useState('');
  const [weeklyUpdates, setWeeklyUpdates] = useState(true);

  const [successManager, setSuccessManager] = useState('');
  const [supportChannel, setSupportChannel] = useState<'email' | 'slack' | 'whatsapp'>('email');
  const [supportNotes, setSupportNotes] = useState('');

  const contacts = useMemo(() => {
    const primary =
      primaryContactName || primaryContactEmail || primaryContactPhone
        ? {
            name: primaryContactName || undefined,
            email: primaryContactEmail || undefined,
            phone: primaryContactPhone || undefined,
          }
        : undefined;

    const secondary =
      secondaryContactName || secondaryContactEmail || secondaryContactPhone
        ? {
            name: secondaryContactName || undefined,
            email: secondaryContactEmail || undefined,
            phone: secondaryContactPhone || undefined,
          }
        : undefined;

    return primary || secondary ? { primary, secondary } : undefined;
  }, [primaryContactEmail, primaryContactName, primaryContactPhone, secondaryContactEmail, secondaryContactName, secondaryContactPhone]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const payload: CreateOrganizationPayload = {
      name: name.trim(),
      shortName: shortName.trim() || undefined,
      type,
      onboardingStage,
      description: description.trim() || undefined,
      contacts,
      location: {
        country: location.country || undefined,
        state: location.state || undefined,
        city: location.city || undefined,
      },
      website: website.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      communications:
        onboardingEmails.trim() || weeklyUpdates !== undefined
          ? {
              onboardingEmails: onboardingEmails
                .split(',')
                .map((email) => email.trim())
                .filter(Boolean),
              weeklyUpdates,
            }
          : undefined,
      support:
        successManager || supportNotes || supportChannel
          ? {
              successManager: successManager.trim() || undefined,
              supportChannel,
              supportNotes: supportNotes.trim() || undefined,
            }
          : undefined,
    };

    organizationsApi
      .create(payload)
      .then((response) => {
        toast({
          title: 'Organization created',
          description:
            response.adminCredentials
              ? `Temporary admin credentials generated:\nEmail: ${response.adminCredentials.email}\nPassword: ${response.adminCredentials.password}`
              : 'The organization onboarding profile has been created successfully.',
        });
        navigate('/organization/list');
      })
      .catch((error: any) => {
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          'Failed to create the organization. Please try again.';
        toast({
          title: 'Unable to save organization',
          description: message,
          variant: 'destructive',
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Organization</h1>
          <p className="text-muted-foreground">
            Provide onboarding details for a new partner organization.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/organization/list')}>
            Cancel
          </Button>
          <Button form="add-organization-form" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Organization'}
          </Button>
        </div>
      </header>

      <form
        id="add-organization-form"
        onSubmit={handleSubmit}
        className="space-y-6"
        autoComplete="off"
      >
        <Card>
          <CardHeader>
            <CardTitle>Organization Overview</CardTitle>
            <CardDescription>
              Key details used across the onboarding dashboard and directory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., BrightFuture Academy"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onBlur={() => {
                    if (!shortName.trim() && name.trim()) {
                      setShortName(generateSlug(name));
                    }
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  placeholder="e.g., brightfuture"
                  value={shortName}
                  onChange={(event) => setShortName(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Organization Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as typeof type)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Onboarding Stage</Label>
                <Select
                  value={onboardingStage}
                  onValueChange={(value) => setOnboardingStage(value as typeof onboardingStage)}
                >
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {onboardingStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Overview of the organization, mission, and focus areas."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Primary Contacts</CardTitle>
            <CardDescription>
              These contacts receive onboarding updates and communications.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="primaryContactName">Primary Contact Name</Label>
              <Input
                id="primaryContactName"
                placeholder="e.g., Priya Sharma"
                value={primaryContactName}
                onChange={(event) => setPrimaryContactName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactEmail">Primary Contact Email</Label>
              <Input
                id="primaryContactEmail"
                type="email"
                placeholder="hello@example.com"
                value={primaryContactEmail}
                onChange={(event) => setPrimaryContactEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactPhone">Primary Contact Phone</Label>
              <Input
                id="primaryContactPhone"
                placeholder="+91 98765 43210"
                value={primaryContactPhone}
                onChange={(event) => setPrimaryContactPhone(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactName">Secondary Contact Name</Label>
              <Input
                id="secondaryContactName"
                placeholder="Optional"
                value={secondaryContactName}
                onChange={(event) => setSecondaryContactName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactEmail">Secondary Contact Email</Label>
              <Input
                id="secondaryContactEmail"
                type="email"
                placeholder="Optional"
                value={secondaryContactEmail}
                onChange={(event) => setSecondaryContactEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactPhone">Secondary Contact Phone</Label>
              <Input
                id="secondaryContactPhone"
                placeholder="Optional"
                value={secondaryContactPhone}
                onChange={(event) => setSecondaryContactPhone(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Branding</CardTitle>
            <CardDescription>
              Information displayed on public-facing organization profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationSelector value={location} onChange={setLocation} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.org"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://cdn.example.org/logo.png"
                  value={logoUrl}
                  onChange={(event) => setLogoUrl(event.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Preferences</CardTitle>
            <CardDescription>
              Configure communications, support, and engagement preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Communications</h3>
                <p className="text-sm text-muted-foreground">
                  Keep stakeholders in the loop throughout the onboarding journey.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="onboardingEmails">Onboarding email recipients</Label>
                <Textarea
                  id="onboardingEmails"
                  rows={3}
                  placeholder="Comma-separated email addresses"
                  value={onboardingEmails}
                  onChange={(event) => setOnboardingEmails(event.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium text-foreground">Weekly progress updates</p>
                  <p className="text-sm text-muted-foreground">
                    Send automated onboarding status updates every Monday.
                  </p>
                </div>
                <Switch checked={weeklyUpdates} onCheckedChange={setWeeklyUpdates} />
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Support & Success</h3>
                <p className="text-sm text-muted-foreground">
                  Assign internal owners and channels for this organization&apos;s onboarding.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="successManager">Customer success manager</Label>
                  <Input
                    id="successManager"
                    placeholder="e.g., Priya Sharma"
                    value={successManager}
                    onChange={(event) => setSuccessManager(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportChannel">Support channel</Label>
                  <Select value={supportChannel} onValueChange={(value) => setSupportChannel(value as typeof supportChannel)}>
                    <SelectTrigger id="supportChannel">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportNotes">Support notes</Label>
                <Textarea
                  id="supportNotes"
                  rows={3}
                  placeholder="Document any special onboarding considerations or agreements."
                  value={supportNotes}
                  onChange={(event) => setSupportNotes(event.target.value)}
                />
              </div>
            </section>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate('/organization/list')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Organization'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrganization;


