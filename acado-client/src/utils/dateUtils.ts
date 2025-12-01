type DateFormats = "dd/MM/yyyy" | "dd MMM yyyy" | "dd MMMM yyyy" | "MM/dd/yyyy";

export const formatDate = (dateString: string, format?: DateFormats): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    if (!format) {
        return date.toLocaleDateString("en-GB");
    }

    const options: Record<DateFormats, string> = {
        "dd/MM/yyyy": date.toLocaleDateString("en-GB"), // 31/12/2024
        "dd MMM yyyy": date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }), // 31 Dec 2024
        "dd MMMM yyyy": date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }), // 31 December 2024
        "MM/dd/yyyy": date.toLocaleDateString("en-US"), // 12/31/2024
    };

    return options[format] || "Invalid format";
};
