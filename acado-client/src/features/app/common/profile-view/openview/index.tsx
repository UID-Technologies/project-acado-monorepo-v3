import {
  getprofile,
} from "./openService";
import { useState, useEffect } from "react";
import type { Profile, BasicInfoSection, Section} from "./openService";
import { BadgeCheck } from "lucide-react";
import { useParams } from "react-router-dom";

const ProfileView = () => {
  const { org_id, uniqueIdentifier } = useParams();
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [basicInfo, setBasicInfo] = useState<BasicInfoSection>(
    {} as BasicInfoSection
  );
  const [profileSections, setProfileSections] = useState<Section[]>([]);
  
  const loadSections = async () => {
    try {
      if (!org_id || !uniqueIdentifier) {
        console.error("org_id or uniqueIdentifier is missing");
        return;
      }
      const response = await getprofile(org_id, uniqueIdentifier);
      setProfile((response?.portfolio as Profile) || {});
      // ts-ignore
      setBasicInfo(response?.portfolio?.profileSection?.basic_info?.[0] as BasicInfoSection);
      setProfileSections(response?.sections || []);
    } catch (error) {
      console.error(error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatDate(value: any) {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch {
      return String(value);
    }
  }

  function renderSectionHtml(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entry: Record<string, any>,
    html: string,
    fields: { fieldKey: string; dataType: string }[]
  ): string {
    return html.replace(/\${(.*?)}/g, (_, keyRaw) => {
      const key = keyRaw.trim();
      const value = entry[key];

      if (value === undefined || value === null || value === "") return "";

      const field = fields.find((f) => f.fieldKey === key);
      if (field?.dataType === "binary" && typeof value === "string") {
        return `<img src="${value}" alt="${key}" style="max-width: 100%; max-height: 150px; border-radius: 8px;" />`;
      }
      if (field?.dataType === "longtext") {
        return `<div style="white-space: pre-wrap;" class="line-clamp-2 text-sm">${value}</div>`;
      }
      if (field?.dataType === "date") {
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
            });
          }
        } catch {
          return String(value);
        }
      }
      return String(value);
    });
  }

  useEffect(() => {
      loadSections();
      // eslint-disable-next-line
  }, [org_id, uniqueIdentifier]);

  return (
    <div className="p-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full items-center min-h-screen space-y-4">
        {/* --- Header (Banner) --- */}
        <section className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="relative w-full aspect-[3/1] sm:aspect-[6/1] bg-gray-100">
            <div className="relative w-full aspect-[3/1] sm:aspect-[6/1]">
              <img
                src={`${basicInfo?.coverPicture}?${Date.now()}`}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Optional dark overlay */}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="absolute bottom-[10%] sm:bottom-[15%] left-6 translate-y-1/2 flex items-end gap-4 group">
              <div className="relative">
                <img
                  src={`${basicInfo?.profilePicture}?${Date.now()}`}
                  alt="Profile"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg object-cover transition"
                />
              </div>
               
            </div>
            {profile.isVerified && (
                  <div className="hidden sm:block absolute bottom-[-3.5rem] right-6">
                    <span className="flex items-center bg-gray-100 text-sm px-2.5 py-2 rounded-full border border-gray-300 shadow-sm">
                      <div className="rounded-full p-[3px] bg-green-500 mr-2">
                        <BadgeCheck className="text-white w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-black">
                        Verified profile
                      </p>
                    </span>
                  </div>
                )}

            <img
                src='/img/logo/logo-light-full.png'
                alt="Profile"
                className="absolute w-32 sm:w-44 bottom-[-20%] sm:bottom-[-20%] right-2 sm:right-6 translate-y-1/2 flex items-end gap-4 group cursor-pointer"
              />

                {profile.isVerified && (
                  <div className="sm:hidden absolute bottom-[-3rem] right-3">
                      <div className="rounded-full p-[3.5px] bg-green-500 mr-2">
                        <BadgeCheck className="text-white w-6 h-6" />
                      </div>
                  </div>
                )}
          </div>

          <div className="mt-8 sm:mt-8">


            <div className="pt-8 px-6 pb-6">
              <div className="flex justify-between">


                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {basicInfo?.name}
                    {/* {profile?.uniqueIdentifier && (
                      <span className="ml-2 text-xs text-gray-500">
                        @{profile?.uniqueIdentifier}
                      </span>
                    )} */}

                  </h2>
                  <p className="text-sm text-gray-600">{basicInfo?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Dynamic Sections --- */}
        {profileSections
          .filter((s) =>
            profile?.profileSection
              ? Object.hasOwn(profile.profileSection, s.SectionKey)
              : false
          )
          .map((section) => {
            const sectionData = profile?.profileSection?.[section.SectionKey] || [];

            return (
              <section
                key={section.SectionKey}
                className="bg-white rounded-md border border-gray-200 overflow-hidden py-3 px-5"
              >
                <div className="flex justify-between mb-2 sm:mb-4">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-900">
                    {section.name}
                  </h2>
                </div>

                {sectionData.length > 0 ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {sectionData.map((entry: any, i: number) => (
                      <div key={i} className="relative">
                        {section.sectionHtml ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: renderSectionHtml(
                                entry,
                                section.sectionHtml,
                                section.fields
                              ),
                            }}
                          />
                        ) : (
                          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            {section.fields.map((field) => {
                              const key = field.fieldKey;
                              const value = entry[key];
                              if (key === "id" || value === null || value === undefined) return null;

                              if (field.dataType === "binary" && typeof value === "string") {
                                return (
                                  <li key={key}>
                                    <strong>{field.name}:</strong>
                                    <div className="mt-1">
                                      <img
                                        src={value}
                                        alt={field.name}
                                        className="max-h-36 rounded"
                                      />
                                    </div>
                                  </li>
                                );
                              }

                              if (field.dataType === "date") {
                                return (
                                  <li key={key}>
                                    <strong>{field.name}:</strong> {formatDate(value)}
                                  </li>
                                );
                              }

                              return (
                                <li key={key}>
                                  <strong>{field.name}:</strong> {String(value)}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No data yet.</p>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
};

export default ProfileView;
