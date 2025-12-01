import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
    route: string;
    title: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ route, title }) => {
    return (
        <div className="flex gap-3 justify-start items-center mb-4">
            <Link to={route} className="text-primary dark:text-primary">
                <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-start dark:text-primary text-primary">
                {title}
            </h1>
        </div>
    );
};

export default Breadcrumb;
