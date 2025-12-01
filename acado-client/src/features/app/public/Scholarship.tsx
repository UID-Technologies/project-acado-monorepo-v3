import ScholarshipPage from './scholarship/schlorship-page'

const Scholarship: React.FC = () => {
    return (
        <div className="py-16 overflow-hidden px-3">
            <div className="container px-3">
                <h1 className="dark:text-primary">Scholarship</h1>
                <p className="mt-5 dark:text-gray-300">
                    {`Bachelor's`} programs in universities offer a range of fields,
                    from sciences and engineering to humanities and business,
                    designed to equip students with foundational skills and
                    specialized knowledge. These programs typically span three
                    to four years, combining theoretical learning with practical
                    experience, preparing graduates for professional careers or
                    advanced studies.
                </p>
            </div>

            <div className="mt-10">
                <ScholarshipPage />
            </div>
        </div>
    )
}

export default Scholarship
