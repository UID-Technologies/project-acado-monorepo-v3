import React from "react";
import {
  FileText,
  Headphones,
  Video,
  ClipboardList,
  HelpCircle,
  Video as VideoIcon,
  BarChart,
  FileQuestion,
  FileText as TextIcon
} from "lucide-react";
import { ContentType } from "@app/types/learning/courses";



interface ContentTypeIconProps {
  type: ContentType;
  size?: number;
  className?: string;
}

const ContentTypeIcon: React.FC<ContentTypeIconProps> = ({
  type,
  size = 24,
  className = ""
}) => {
  const iconProps = { size, className };

  switch (type) {
    case "notes":
      return <FileText {...iconProps} />;
    case "audio":
      return <Headphones {...iconProps} />;
    case "video":
      return <Video {...iconProps} />;
    case "assignment":
      return <ClipboardList {...iconProps} />;
    case "assessment":
      return <HelpCircle {...iconProps} />;
    case "zoomclass":
      return <VideoIcon {...iconProps} />;
    case "scorm":
      return <BarChart {...iconProps} />;
    case "survey":
      return <FileQuestion {...iconProps} />;
    case "text":
      return <TextIcon {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

export default ContentTypeIcon;
