import { useState } from "react"
import type { UserPortfolio } from "@app/types/learner/portfolio"
import { Hexagon } from "lucide-react"

type portfolio = {
  portfolio: UserPortfolio
}

const Template2 = ({ portfolio: initialPortfolio }: portfolio) => {
  const [portfolio] = useState<UserPortfolio>(initialPortfolio)

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Hexagon className="w-16 h-16 text-blue-600" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold dark:text-blue-600 text-blue-600">
              {portfolio?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <h1 className="text-4xl font-bold dark:text-blue-600">{portfolio?.name}</h1>
        </div>
        <div className="text-right text-gray-600">
          {portfolio?.portfolio_social?.[0]?.email && <p>{portfolio?.portfolio_social?.[0]?.email}</p>}
          {portfolio?.portfolio_social?.[0]?.mob_num && <p>{portfolio?.portfolio_social?.[0]?.mob_num}</p>}
          {/* <p>{portfolio?.portfolio_social?.[0]?.location}</p> */}
        </div>
      </div>

      <div className="grid grid-cols-[2fr_3fr] gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Summary Section */}
          <section>
            <h2 className="text-blue-600 dark:text-blue-600 text-xl font-semibold mb-3">Summary</h2>
            <p className="text-gray-700">
              Experienced professional with expertise in {portfolio?.skill?.map((s) => s.name).join(", ")}
            </p>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-blue-600 dark:text-blue-600 text-xl font-semibold mb-3">Skills</h2>
            <ul className="space-y-1 text-gray-700">
              {portfolio?.skill?.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-blue-600 text-xl dark:text-blue-600 font-semibold mb-3">Education and Training</h2>
            {Array.isArray(portfolio.Education) &&
              portfolio.Education.map((education, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold">{education.title}</h3>
                  <p className="text-gray-700">{education.institute}</p>
                  <p className="text-gray-600">{education.location}</p>
                  <p className="text-gray-600">
                    {formatDate(education.start_date)} - {formatDate(education.end_date)}
                  </p>
                </div>
              ))}
          </section>

          {/* Languages Section */}
          <section>
            <h2 className="text-blue-600 dark:text-blue-600 text-xl font-semibold mb-3">Languages</h2>
            <div className="space-y-2">
              {/* {portfolio?.portfolio_social?.[0]?.languages?.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{lang}</span>
                </div>
              ))} */}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Experience Section */}
          <section>
            <h2 className="text-blue-600 dark:text-blue-600 text-xl font-semibold mb-3">Experience</h2>
            {Array.isArray(portfolio.Experience) &&
              portfolio.Experience.map((experience, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{experience.title}</h3>
                      <p className="text-gray-700">{experience.institute}</p>
                    </div>
                    <div className="text-right text-gray-600">
                      <p>{experience.location}</p>
                      <p>
                        {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{experience.description}</p>
                </div>
              ))}
          </section>

          {/* Certificates Section */}
          <section>
            <h2 className="text-blue-600 dark:text-blue-600 text-xl font-semibold mb-3">Certificates</h2>
            {Array.isArray(portfolio.certificate) &&
              portfolio.certificate.map((certificate, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{certificate.title}</h3>
                      <p className="text-gray-700">{certificate.institute}</p>
                    </div>
                    <p className="text-gray-600">
                      {formatDate(certificate.start_date)} - {formatDate(certificate.end_date)}
                    </p>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  )
}

const formatDate = (dateString?: string) => {
  const date = new Date(`${dateString}-01`)
  const options = { year: "numeric", month: "short" } as Intl.DateTimeFormatOptions
  return date.toLocaleDateString("en-US", options)
}

export default Template2

