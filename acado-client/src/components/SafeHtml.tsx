import React from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

interface SafeHtmlProps {
  html: string;
  className?: string;
  preserveLineBreaks?: boolean;
  prose?: boolean;
  maxLines?: number;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  className,
  preserveLineBreaks = true,
  maxLines,
}) => {
  const formatHtml = (content: string): string => {
    if (!content.trim()) return "";

    const hasHtmlTags = /<[^>]*>/.test(content);

    if (hasHtmlTags) {
      return DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
          "p",
          "br",
          "div",
          "span",
          "strong",
          "em",
          "b",
          "i",
          "u",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "a",
          "img",
          "blockquote",
          "code",
          "pre",
          "hr",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style", "target"],
      });
    } else {
      let formattedContent = content;

      if (preserveLineBreaks) {
        formattedContent = content
          .replace(/\r\n/g, "\n")
          .split(/\n\s*\n/)
          .map((paragraph) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return "";

            // Handle bullet points
            if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
              return `<ul><li>${trimmed.substring(2)}</li></ul>`;
            }

            return `<p>${trimmed}</p>`;
          })
          .join("");

        formattedContent = formattedContent.replace(
          /(?<!<\/p>)\n(?!<p>)/g,
          "<br>"
        );
      } else {
        formattedContent = `<p>${content.trim()}</p>`;
      }

      return DOMPurify.sanitize(formattedContent, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ["p", "br", "ul", "ol", "li"],
        ALLOWED_ATTR: [],
      });
    }
  };

  const sanitizedHtml = formatHtml(html);

  if (!sanitizedHtml) {
    return (
      <div className={cn("text-gray-400 dark:text-gray-300 italic", className)}>
        No description available
      </div>
    );
  }

  const containerClasses = cn(
    // Base styling for text and color mode
    "max-w-none prose prose-sm leading-relaxed text-gray-800 dark:text-white",
    // Make sure child elements also follow color scheme
    "[&_*]:text-gray-800 dark:[&_*]:text-white",
    // Bullet styling for better visibility
    "[&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:my-1 [&>ul>li]:marker:text-primary dark:[&>ul>li]:marker:text-yellow-400",
    // Optional line clamp
    {
      "line-clamp-3": maxLines === 3,
      "line-clamp-4": maxLines === 4,
      "line-clamp-5": maxLines === 5,
    },
    className
  );

  const style = maxLines ? { WebkitLineClamp: maxLines } : undefined;

  return (
    <div
      className={containerClasses}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtml;
