import { useState } from "react"
import type { UserPortfolio } from "@app/types/learner/portfolio"

type portfolio = {
  portfolio: UserPortfolio
}

const Template3 = ({ portfolio: initialPortfolio }: portfolio) => {
  const [portfolio] = useState<UserPortfolio>(initialPortfolio)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm font-sans relative">
      {/* Black vertical bar */}
      <div className="absolute left-0 top-0 w-2 h-full bg-black" />

      {/* Main content with padding to account for vertical bar */}
      <div className="pl-8 pr-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{portfolio?.name}</h1>
          <div className="flex gap-4 text-sm">
            {portfolio?.portfolio_social?.[0]?.mob_num && <span>{portfolio?.portfolio_social?.[0]?.mob_num}</span>}
            {portfolio?.portfolio_social?.[0]?.email && (
              <>
                <span>•</span>
                <span>{portfolio?.portfolio_social?.[0]?.email}</span>
              </>
            )}
            {/* {portfolio?.portfolio_social?.[0]?.location && (
              <>
                <span>•</span>
                <span>{portfolio?.portfolio_social?.[0]?.location}</span>
              </>
            )} */}
          </div>
        </div>

        {/* Main content with two columns */}
        <div className="grid grid-cols-[250px_1fr]">
          {/* Left column with section headings */}
          <div className="space-y-8">
            <div className="bg-[#f5f2ee] p-4">
              <h2 className="font-bold italic">Summary</h2>
            </div>
            <div className="bg-[#f5f2ee] p-4">
              <h2 className="font-bold italic">Skills</h2>
            </div>
            <div className="bg-[#f5f2ee] p-4">
              <h2 className="font-bold italic">Experience</h2>
            </div>
            <div className="bg-[#f5f2ee] p-4">
              <h2 className="font-bold italic">Education And Training</h2>
            </div>
            <div className="bg-[#f5f2ee] p-4">
              <h2 className="font-bold italic">Languages</h2>
            </div>
          </div>

          {/* Right column with content */}
          <div className="pl-6 space-y-8">
            {/* Summary content */}
            <div className="pr-4">
              <p className="text-sm">
                Professional with expertise in {portfolio?.skill?.map((s) => s.name).join(", ")}. Demonstrated
                experience in delivering quality solutions and exceeding expectations.
              </p>
            </div>

            {/* Skills content */}
            <div className="pr-4">
              <div className="grid grid-cols-2 gap-4">
                {portfolio?.skill?.map((skill, index) => (
                  <div key={index} className="text-sm">
                    • {skill.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience content */}
            <div className="space-y-6 pr-4">
              {Array.isArray(portfolio.Experience) &&
                portfolio.Experience.map((experience, index) => (
                  <div key={index}>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                        </span>
                      </div>
                      <div className="font-semibold">
                        {experience.title}, <span className="font-bold">{experience.institute}</span>,{" "}
                        {experience.location}
                      </div>
                    </div>
                    <p className="text-sm">{experience.description}</p>
                  </div>
                ))}
            </div>

            {/* Education content */}
            <div className="space-y-4 pr-4">
              {Array.isArray(portfolio.Education) &&
                portfolio.Education.map((education, index) => (
                  <div key={index}>
                    <div className="text-sm">
                      {formatDate(education.start_date)} - {formatDate(education.end_date)}
                    </div>
                    <div className="font-semibold">{education.title}</div>
                    <div className="text-sm">
                      {education.institute}, {education.location}
                    </div>
                  </div>
                ))}
            </div>

            {/* Languages content */}
            <div className="pr-4">
              {/* {portfolio?.portfolio_social?.[0]?.languages?.map((lang, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span>{lang}</span>
                    <span>{index === 0 ? "Native speaker" : index === 1 ? "C2" : "B2"}</span>
                  </div>
                  <div className="h-2 bg-[#f5f2ee] mt-1">
                    <div
                      className="h-full bg-black"
                      style={{ width: index === 0 ? "100%" : index === 1 ? "90%" : "75%" }}
                    />
                  </div>
                </div>
              ))} */}
            </div>
          </div>
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

export default Template3

