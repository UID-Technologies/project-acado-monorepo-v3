import { useState } from "react"
import { Link } from "react-router-dom"
import { useMentors } from "@app/hooks/data/useMentors"
import LoadingSection from "@/components/LoadingSection"

const SocialIcons = {
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  ),
  twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
  ),
  pinterest: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  ),
}

export default function MentorShipPlatform() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: mentor, isLoading } = useMentors()

  const filteredMentors =
    mentor?.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primary text-2xl font-bold">{`Mentor's`}</h1>
        <input
          type="search"
          placeholder="Search Mentor"
          className="w-1/3 px-4 py-2 rounded-lg border border-gray-600 bg-gray-50 dark:bg-gray-800 text-black dark:text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-w-7xl mx-auto">
        {isLoading && <LoadingSection isLoading={isLoading} title="Mentors" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer dark:hover:bg-[#333333] transition-all duration-200"
              onClick={() =>
                (window.location.href = `https://elms.edulystventures.com/portfolio-detail?user_id=${mentor.id}`)
              }
            >
              <h3 className="text-black dark:text-white font-semibold text-xl mb-2">{mentor.name}</h3>
              {/* <p className="text-gray-400 text-sm mb-4">{mentor.email}</p> */}
              <div className="flex flex-wrap gap-3 mb-6">
                {mentor.social_links &&
                  Object.entries(mentor.social_links).map(([key, value]) => {
                    if (value && key in SocialIcons && value !== "") {
                      return (
                        <a
                          key={key}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {SocialIcons[key as keyof typeof SocialIcons]}
                        </a>
                      )
                    }
                    return null
                  })}
              </div>
              <div className="flex items-center gap-3">
                <Link to={"/calender"} className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="w-full bg-primary text-white dark:text-black font-medium py-3 px-6 rounded-lg
                    hover:bg-primary transition-colors duration-200"
                  >
                    Connect
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

