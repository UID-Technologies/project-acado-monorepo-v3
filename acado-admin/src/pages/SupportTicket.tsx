import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AcadoLogo } from "@/components/AcadoLogo";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Loader2,
  Paperclip,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

const priorityOptions = ["low", "medium", "high"] as const;

const ticketSchema = z.object({
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters long.")
    .max(120, "Subject can be up to 120 characters."),
  priority: z.enum(priorityOptions, {
    required_error: "Please select a priority.",
  }),
  message: z
    .string()
    .min(10, "Tell us a little more so the team can help faster.")
    .max(2000, "Message can be up to 2000 characters."),
  copyEmail: z
    .string()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
});

type TicketFormValues = z.infer<typeof ticketSchema>;
type TicketPriority = (typeof priorityOptions)[number];

const defaultValues: TicketFormValues = {
  subject: "",
  priority: "medium",
  message: "",
  copyEmail: "",
};

const priorityBadges: Record<TicketPriority, { label: string; hint: string }> = {
  low: {
    label: "Low",
    hint: "Question / nice-to-have. Typical response in 1-2 days.",
  },
  medium: {
    label: "Medium",
    hint: "Blocking soon or needs help within a day.",
  },
  high: {
    label: "High",
    hint: "Production down or time-sensitive launch. We'll jump right in.",
  },
};

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "text/plain",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_ATTACHMENTS = 4;

const SupportTicket = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { isSubmitting } = form.formState;

  const attachmentQuota = useMemo(
    () => ({
      remaining: MAX_TOTAL_ATTACHMENTS - attachments.length,
      reachedLimit: attachments.length >= MAX_TOTAL_ATTACHMENTS,
    }),
    [attachments.length]
  );

  const onSubmit = async (values: TicketFormValues) => {
    try {
      // Placeholder for future API integration
      await new Promise((resolve) => setTimeout(resolve, 600));

      toast({
        title: "Ticket sent!",
        description:
          "Our support specialists will reach out shortly. You'll also get an email confirmation.",
      });

      console.groupCollapsed("[Support Ticket Submitted]");
      console.log({
        ...values,
        attachments,
      });
      console.groupEnd();

      form.reset(defaultValues);
      setAttachments([]);
    } catch (error) {
      console.error("Ticket submission failed", error);
      toast({
        title: "Something went wrong",
        description:
          "We couldn't submit your ticket. Please try again or email support@acado.ai.",
        variant: "destructive",
      });
    }
  };

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (unsupported type)`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (exceeds 10 MB)`);
        continue;
      }

      validFiles.push(file);
    }

    const limitedFiles = validFiles.slice(
      0,
      Math.max(0, attachmentQuota.remaining)
    );

    if (invalidFiles.length) {
      toast({
        title: "Some files were skipped",
        description: invalidFiles.join(", "),
        variant: "destructive",
      });
    }

    if (!limitedFiles.length) {
      event.target.value = "";
      return;
    }

    setAttachments((prev) => [...prev, ...limitedFiles]);
    event.target.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
    const units = ["bytes", "KB", "MB", "GB"];
    const exponent = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );
    const value = bytes / Math.pow(1024, exponent);
    return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
  };

  return (
    <div className="min-h-screen bg-muted/15 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <AcadoLogo className="h-8" />
          <Badge variant="outline" className="gap-1 bg-background/60 backdrop-blur">
            <LifeBuoy className="h-4 w-4" />
            Raise a ticket
          </Badge>
        </header>

        <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-border/60 bg-background/95 px-6 py-6 shadow-lg backdrop-blur-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              How can we help today?
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Share as much context as you can and our success team will follow up quickly.
              We typically respond within a couple of business hours.
            </p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium">Priority support</span>
            </div>
            <p className="mt-1 text-primary/80">
              Logged in as{" "}
              <span className="font-semibold">
                {user?.name || user?.email || "ACADO Admin"}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,_1fr)_320px]">
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle>Ticket details</CardTitle>
              <CardDescription>
                Give your ticket a short subject, choose the urgency, and describe
                the context. Attach screenshots or logs if that helps.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-6"
                >
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Something isn't syncing between courses and applications"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A quick headline that shows up in your ticket summary.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="mt-2 flex items-center gap-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          {priorityBadges[field.value].hint}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What's going on?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share steps to reproduce, expected behaviour, affected users, and anything else that helps us resolve this quickly."
                            className="min-h-[160px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more detail, the faster we can troubleshoot.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="copyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send a copy to</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="colleague@company.com (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          We'll CC this person on the ticket updates if provided.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium">Attachments</h3>
                        <p className="text-xs text-muted-foreground">
                          Add up to {MAX_TOTAL_ATTACHMENTS} files. PNG, JPG, PDF,
                          TXT. Max 10 MB each.
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {attachments.length}/{MAX_TOTAL_ATTACHMENTS} uploaded
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      disabled={attachmentQuota.reachedLimit}
                      onClick={() =>
                        document.getElementById("ticket-attachment")?.click()
                      }
                    >
                      <UploadCloud className="h-4 w-4" />
                      Upload file
                    </Button>
                    <Input
                      id="ticket-attachment"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleAttachmentChange}
                      accept={allowedMimeTypes.join(",")}
                    />
                    {!!attachments.length && (
                      <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                        {attachments.map((file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between gap-4 rounded-md bg-background px-3 py-2 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveAttachment(index)}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove attachment</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {attachmentQuota.reachedLimit && (
                      <p className="flex items-center gap-2 text-xs text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        Maximum attachment limit reached.
                      </p>
                    )}
                  </div>

                  <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:px-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        form.reset(defaultValues);
                        setAttachments([]);
                      }}
                    >
                      Clear form
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit ticket
                          <LifeBuoy className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">What happens next?</CardTitle>
              </div>
              <CardDescription>
                A dedicated success specialist reviews every ticket. Here's how
                the process typically flows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">We triage immediately</p>
                  <p className="text-xs text-muted-foreground">
                    Tickets marked high priority trigger pager notifications so
                    the on-call team jumps in.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">
                    You get a tailored response
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expect a reply with next steps, troubleshooting, or a quick
                    fix ETA.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">We keep you in the loop</p>
                  <p className="text-xs text-muted-foreground">
                    You'll receive updates by email and inside the portal using
                    real-time status tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-lg">Quick tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <FileText className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    Share reproduction steps
                  </p>
                  <p>
                    If something is broken, let us know what you clicked,
                    expected, and saw instead.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <UploadCloud className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    Attach screenshots or logs
                  </p>
                  <p>
                    A quick screen recording or console log speeds up root-cause
                    analysis dramatically.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    Security issue?
                  </p>
                  <p>
                    Mark the ticket as high priority or reach our security desk
                    directly at security@acado.ai.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Need something else?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Prefer chatting live? Reach us weekdays 08:00-18:00 CET.
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start gap-2" asChild>
                  <a href="mailto:support@acado.ai">
                    <LifeBuoy className="h-4 w-4" />
                    Email support@acado.ai
                  </a>
                </Button>
                <Button variant="outline" className="justify-start gap-2" asChild>
                  <a href="tel:+441234567890">
                    <CheckCircle2 className="h-4 w-4" />
                    Call +44 1234 567 890
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
};

export default SupportTicket;

