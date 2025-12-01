import { cn } from "@/lib/utils";
import { stripHtmlTags } from "@/utils/stripHtmlTags";

export default function Heading({ title, description, className }: { title: string; description?: string; className?: string }) {
    return (
        <div className={cn("mb-8 space-y-0.5", className)}>
            <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-darkPrimary  capitalize">{title}</h2>
            {description && <p className="text-muted-foreground text-sm line-clamp-1">{stripHtmlTags(description)}</p>}
        </div>
    );
}