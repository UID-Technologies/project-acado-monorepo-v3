import {
  getprofile,
  addProfileSectionEntry,
  deleteProfileSectionEntry,
  updateProfileSectionEntry,
  updateProfileImage,
  updateCoverImage,
  RequestVerification,
  UpatePreferences,
  addSocialLinks,
  uploadResume,
  deleteResumeById,
} from "./services/profileService";
import { useState, useEffect, useRef } from "react";
import type { Profile, BasicInfoSection } from "./services/profileService";
import type { Section } from "./services/sectionService";
import { FiPlus } from "react-icons/fi";
import { Pencil, BadgeCheck, EllipsisVertical } from "lucide-react";
import CustomButton from "./components/ui/CustomButton";
import DynamicSectionForm from "./components/DynamicSectionForm";
import DynamicEditSectionForm from "./components/DynamicEditSectionForm";
import SharePopup from "./components/SharePopup";
import PreferencesPopup from "./components/PreferencesPopup";
import Resumes from "./components/Resumes";
import SocialLinks from "./components/SocialLinks";
import { SHARE_PROFILE_URL } from "./config";
import { RenderWhenNoEditKeyFound } from "./NoEditKeyFound";
import { addResume, fetchUpdateImage } from "@services/learner/PortfolioService";
import ExportMenu from "./exports/ExportMenu";
import QRCode from 'qrcode';

// extra
import { useAuth } from "@app/providers/auth";
// import { Link } from "react-router-dom";
// import { LEARNER, FACULTY } from "@app/config/constants/roles.constant";

type Resume = {
  id: string;
  resume: string;
  title: string;
  isLatest: boolean;
};

const ProfileView = () => {
  const [isEditKeyAvailable, setIsEditKeyAvailable] = useState(false);
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [basicInfo, setBasicInfo] = useState<BasicInfoSection>(
    {} as BasicInfoSection
  );
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [profileSections, setProfileSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editEntry, setEditEntry] = useState<any | null>(null); // entry to edit
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [preferencesPopupOpen, setPreferencesPopupOpen] = useState(false);
  const [addProfileSectionPopupOpen, setAddProfileSectionPopupOpen] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [exportPopupOpen, setExportPopupOpen] = useState(false);
  const ProfileInputRef = useRef<HTMLInputElement | null>(null);
  const CoverInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // extra
  const { user } = useAuth();

  const loadSections = async () => {
    try {
      const response = await getprofile();
      setShareUrl(`${SHARE_PROFILE_URL}/${response?.portfolio?.org_id}/${response?.portfolio?.uniqueIdentifier}`);
      setProfile((response?.portfolio as Profile) || {});
      // ts-ignore
      setBasicInfo(response?.portfolio?.profileSection?.basic_info?.[0] as BasicInfoSection);
      setSocialLinks(response?.portfolio?.profileSection?.social_links?.[0] || []);
      setResumes(response?.portfolio?.profileSection?.resumes || []);
      setProfileSections(response?.sections || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shareUrl, { width: 160 });
    }
  }, [shareUrl]);

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
    const isEditKey = localStorage.getItem("editKey"); // check if editKey exists in localStorage
    if (isEditKey) {
      setIsEditKeyAvailable(true);
      loadSections();
    } else {
      setIsEditKeyAvailable(false);
    }
  }, []);

  const handleAddClick = (section: Section) => {
    setActiveSection(section);
    setEditEntry(null); // ensure clean add mode
    setIsModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (section: Section, entry: any) => {
    setActiveSection(section);
    setEditEntry(entry); // populate form with data
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveSection(null);
    setEditEntry(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSectionSubmit = async (data: { Key: string; value: any }[]) => {
    const formData = new FormData();
    formData.append("SectionKey", activeSection?.SectionKey || "");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileSection: { Key: string; value: any }[] = [];

    for (const field of data) {
      const isFile = field.value instanceof File;
      if (isFile) {
        formData.append(field.Key, field.value);
      }
      profileSection.push({
        Key: field.Key,
        value: isFile ? null : field.value,
      });
    }

    if (editEntry?.id) {
      formData.append("entryId", editEntry.id); // include id for editing
    }

    formData.append("profileSection", JSON.stringify(profileSection));
    await addProfileSectionEntry(formData);
    handleModalClose();
    loadSections();
  };

  const handleEditSectionSubmit = async (data: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileSection: { Key: string; value: any }[];
    files: Record<string, File | null>;
  }) => {
    if (!activeSection) return;

    try {
      await updateProfileSectionEntry(
        data.id,
        activeSection.SectionKey,
        data.profileSection,
        data.files,
      );
      handleModalClose();
      loadSections();
    } catch (error) {
      console.error("Failed to update section entry:", error);
      alert("Failed to update section entry");
    }
  };

  const deleteProfileEntry = async (sectionKey: string, id: string) => {
    await deleteProfileSectionEntry(sectionKey, id);
    loadSections();
  };

  const handleUpdateProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      await updateProfileImage(formData);
      await fetchUpdateImage(file);
      loadSections();
    } catch (error) {
      console.error("Failed to update profile image:", error);
      alert("Failed to update profile image");
    }
  };

  const onProfileImageClick = () => {
    ProfileInputRef.current?.click();
  };

  const handleUpdateCoverImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("coverPicture", file);
      await updateCoverImage(formData);
      loadSections();
    } catch (error) {
      console.error("Failed to update cover image:", error);
      alert("Failed to update cover image");
    }
  };

  const onCoverImageClick = () => {
    CoverInputRef.current?.click();
  };

  const SendRequestForVerfication = async () => {
    try {
      await RequestVerification();
      loadSections();
    } catch (error) {
      console.error("Failed to send verification request:", error);
      alert("Failed to send verification request");
    }
  };


  const handleSavePreferences = async (payload: { show_personal_info: boolean }) => {
    try {
      await UpatePreferences(payload);
      loadSections();
      alert('Preferences updated successfully');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      alert('Failed to update preferences');
    }
  };

  const handleSocialLinkSave = async (
    activePlatform: string,
    inputValue: string
  ) => {
    if (!activePlatform || !inputValue) return;

    try {
      await addSocialLinks(activePlatform, inputValue);

      // Optional: Update local state if needed
      setSocialLinks((prev) => ({
        ...prev,
        [activePlatform]: inputValue,
      }));
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleResumeUploaded = async (file: File, title: string) => {
  try {
    // Always upload resume first
    await uploadResume(file, title);

    // Check if the uploaded file is a PDF
    if (file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      await addResume(formData);
    }

    // Reload sections after upload
    loadSections();
  } catch (error) {
    console.error("Failed to update resume:", error);
    alert("Failed to update resume");
  }
};


  const deleteResume = async (id: string) => {
    try {
      await deleteResumeById(id);
      loadSections();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      alert("Failed to delete resume");
    }
  };

  if (isEditKeyAvailable === false) {
    return <RenderWhenNoEditKeyFound></RenderWhenNoEditKeyFound>;
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="w-full items-center min-h-screen space-y-4">
        {/* --- Header (Banner) --- */}
        <section className="rounded-md border border-gray-200 overflow-hidden">
          <div className="relative w-full aspect-[3/1] sm:aspect-[6/1] bg-gray-100">
            <div className="relative w-full aspect-[3/1] sm:aspect-[6/1]">
              <img
                src={`${basicInfo?.coverPicture}?${Date.now()}`}
                // alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute top-4 right-4 z-10">
                <button
                  type="button"
                  className="px-2 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  onClick={onCoverImageClick}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <input
                  ref={CoverInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      handleUpdateCoverImage(file);
                    }
                  }}
                />
              </div>

              {/* Optional dark overlay */}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="absolute bottom-[10%] sm:bottom-[15%] left-6 translate-y-1/2 flex items-end gap-4 group cursor-pointer">
              <div className="relative" onClick={onProfileImageClick} >
                <img
                  src={`${basicInfo?.profilePicture}?${Date.now()}`}
                  // alt="Profile"
                  className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-gray-50 drop-shadow-sm object-cover transition hover:brightness-90"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                  <span className="text-white text-sm font-medium">Change</span>
                </div>
                <input
                  ref={ProfileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      handleUpdateProfileImage(file);
                    }
                  }}
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

            <div className="hidden sm:block absolute right-4 -bottom-[11.5rem]">
              <canvas ref={canvasRef} />
            </div>
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
                  <p className="text-sm text-gray-600">{user?.department}</p>
                </div>
              </div>

              <div className="flex justify-start p-4 px-0 pt-2 mb-0">
                <SocialLinks data={socialLinks} handleSocialLinkSave={handleSocialLinkSave}></SocialLinks>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 relative">
                {/* <CustomButton className="hidden sm:block">Upload Resume</CustomButton> */}
                <CustomButton onClick={() => setAddProfileSectionPopupOpen(true)}>Add <span className="hidden sm:inline">Profile</span> Section</CustomButton>
                <CustomButton
                  className="hidden sm:block"
                  onClick={() => {
                    setShowMenu(false);
                    setExportPopupOpen(true);
                  }}
                >Export Resume</CustomButton>
                <CustomButton onClick={() => setSharePopupOpen(true)}>Share Profile</CustomButton>
                <div className="relative">
                  <EllipsisVertical
                    className="block cursor-pointer w-6 h-6 text-gray-600"
                    onClick={() => setShowMenu((prev) => !prev)}
                  />
                  <div
                    className={`absolute  right-[0%] sm:left-[110%] transform -translate-y-[140%] sm:-translate-y-[130%] mt-2 w-48 border border-gray-200 rounded shadow-lg z-10 transition-all duration-300 ease-in-out
                    ${showMenu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
                  `}
                    style={{ willChange: "opacity, transform" }}
                  >
                    {/* <button
                    className="sm:hidden block w-full border-b border-gray-200 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Preview Resume
                  </button> */}
                    <button
                      className="sm:hidden block w-full border-b border-gray-200 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowMenu(false);
                        setExportPopupOpen(true);
                      }}
                    >
                      Export Resume
                    </button>
                    <button
                      className="block w-full border-b border-gray-200 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowMenu(false);
                        setPreferencesPopupOpen(true);
                      }}
                    >
                      Manage Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="rounded-md border border-gray-200 overflow-hidden py-3 px-5">
          <Resumes
            resumes={resumes}
            deleteResume={deleteResume}
            onResumeUploaded={handleResumeUploaded}
          />
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
                className="rounded-md border border-gray-200 overflow-hidden py-3 px-5"
              >
                <div className="flex justify-between mb-2 sm:mb-4">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-900">
                    {section.name}
                  </h2>
                  {(section.isLocked === false || profile.isVerified === false) && (sectionData.length === 0 || sectionData.length < section.maxEntries) && (
                    <div className="flex gap-3">
                      <button
                        className="p-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600"
                        onClick={() => handleAddClick(section)}
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                  )}
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
                        {(section.isLocked === false || profile.isVerified === false) && (
                          <div className="absolute bg-white p-1  hover:bg-gray-100 rounded-full border shadow top-0 right-0 flex gap-3">
                            <button
                              title="Edit"
                              className="p-1 text-primary transition"
                              onClick={() => handleEditClick(section, entry)}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
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

        {/* --- Add/Edit Modal --- */}
        {isModalOpen && activeSection && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg w-full max-w-3xl shadow-lg relative">
              {editEntry ? (
                <DynamicEditSectionForm
                  section={activeSection}
                  entry={editEntry}
                  onclose={handleModalClose}
                  deleteProfileEntry={deleteProfileEntry}
                  onSubmit={handleEditSectionSubmit}
                />
              ) : (
                <DynamicSectionForm
                  section={activeSection}
                  onclose={handleModalClose}
                  onSubmit={handleSectionSubmit}
                />
              )}
            </div>
          </div>
        )}

        {addProfileSectionPopupOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg w-full max-w-xl shadow-lg relative flex flex-col"
              style={{ maxHeight: '90vh' }}>
              <div className="flex justify-between shadow rounded-t-lg border-b border-gray-200 py-4 px-6 items-center sticky top-0 bg-white z-10">
                <p className="text-lg font-semibold">Add Profile Section</p>
                <button
                  className="text-gray-400 text-lg hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full hover:text-gray-600"
                  onClick={() => setAddProfileSectionPopupOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div
                className="px-4 sm:px-6 pb-3 overflow-y-auto"
                style={{ maxHeight: '70vh', minHeight: '200px' }}
              >
                {profileSections.map((section) => (
                  <div
                    key={section.SectionKey}
                    className="border-b cursor-pointer pt-3 border-gray-200 pb-3 flex justify-between gap-2"
                  >
                    <div className="flex flex-col flex-1 min-w-0" onClick={() => {
                      setAddProfileSectionPopupOpen(false);
                      handleAddClick(section);
                    }}>
                      <p className="text-base font-semibold capitalize truncate">{section.name}</p>
                      <p className="text-sm text-gray-500 truncate">{section.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      <CustomButton
                        className="w-full sm:w-auto"
                        onClick={() => {
                          setAddProfileSectionPopupOpen(false);
                          handleAddClick(section);
                        }}
                      >
                        Add
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <SharePopup shareUrl={shareUrl} open={sharePopupOpen} onClose={() => setSharePopupOpen(false)} />
        <PreferencesPopup
          open={preferencesPopupOpen}
          data={basicInfo}
          onRequestVerification={SendRequestForVerfication}
          onClose={() => setPreferencesPopupOpen(false)}
          onSave={handleSavePreferences}
        />
        <ExportMenu profile={profile} open={exportPopupOpen} onClose={() => setExportPopupOpen(false)} />
      </div>
    </div>
  );
};

export default ProfileView;
