import { School, BookOpen, Star, Award } from "lucide-react";

const Statistics: React.FC = () => {
    return (
        <div className="">
            <h1 className="mt-5 sm:mt-10 text-3xl sm:text-3xl sm:text-left">
                Connecting students with{" "}
                <span className="dark:text-primary text-primary">
                    Universities Worldwide
                </span>
            </h1>

            {/* Large Screen Layout */}
            <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                <CardLarge icon={<School />} value="15+" label="University Partners" />
                <CardLarge icon={<BookOpen />} value="50+" label="Degree Programs" />
                <CardLarge icon={<Star />} value="200+" label="Success Stories" />
                <CardLarge icon={<Award />} value="100+" label="Scholarships" />
            </div>

            {/* Mobile Layout */}
            <div className="flex flex-col sm:hidden gap-4 mt-8">
                <CardMobile icon={<School />} value="15+" label="University Partners" />
                <CardMobile icon={<BookOpen />} value="50+" label="Degree Programs" />
                <CardMobile icon={<Star />} value="200+" label="Success Stories" />
                <CardMobile icon={<Award />} value="100+" label="Scholarships" />
            </div>
        </div>
    );
};

export default Statistics;

// Large Screen Card
const CardLarge: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center justify-center dark:bg-gray-900 bg-white p-6 rounded-lg min-w-[150px] shadow-md">
        <div className="w-10 h-10 flex items-center justify-center bg-primary text-white dark:text-black rounded-full">{icon}</div>
        <h1 className="text-2xl font-semibold mt-3">{value}</h1>
        <p className="text-primary text-base text-center">{label}</p>
    </div>
);

// Mobile Card
const CardMobile: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
    <div className="flex items-center gap-4 dark:bg-gray-900 bg-white p-4 rounded-lg shadow-md">
        <div className="w-12 h-12 flex items-center justify-center bg-primary text-white dark:text-black rounded-full">{icon}</div>
        <div>
            <h1 className="text-lg font-semibold">{value}</h1>
            <p className="text-primary text-sm">{label}</p>
        </div>
    </div>
);
