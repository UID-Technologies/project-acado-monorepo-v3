import React from "react";
import type { Profile } from "../services/profileService";

interface ResumeTemplateProps {
  profile: Profile;
}

const ResumeTemplateModern: React.FC<ResumeTemplateProps> = ({ profile }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const sectionsData = profile.profileSection || {};

  // Limits same as before
  const experience = (sectionsData.experience || []).slice(0, 2);
  const education = (sectionsData.education || []).slice(0, 2);
  const volunteering = (sectionsData.volunteering || []).slice(0, 2);
  const publications = (sectionsData.publications || []).slice(0, 2);
  const skills = (sectionsData.skills || []).slice(0, 6);
  const languages = (sectionsData.languages || []).slice(0, 6);
  const about = sectionsData.about?.[0]?.about_me || "";

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 794,
        margin: "auto",
        padding: 24,
        color: "#2e3440",
        fontSize: 12,
        lineHeight: 1.5,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: "3px solid #5e81ac", paddingBottom: 12, marginBottom: 0 }}>
        <h1 style={{ margin: 0, fontSize: 28, color: "#3b4252" }}>{profile.name}</h1>
        <p style={{ fontWeight: "600", color: "#81a1c1", marginTop: 4 }}>{sectionsData.basic_info?.[0]?.email}</p>
      </header>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* Left Column */}
        <div style={{ flex: 1, minWidth: 250 }}>
          {/* About */}
          {about && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, borderBottom: "2px solid #88c0d0", paddingBottom: 4, marginBottom: 8, color: "#5e81ac" }}>
                About
              </h2>
              <p style={{ color: "#434c5e" }}>{about}</p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, borderBottom: "2px solid #88c0d0", paddingBottom: 4, marginBottom: 8, color: "#5e81ac" }}>
                Skills
              </h2>
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {skills.map((skill, idx) => (
                    <li
                        key={skill.id}
                        style={{
                            fontSize: 12,
                            fontWeight: "400",
                            display: "inline",
                        }}
                    >
                        {skill.skill_name} ({skill.skill_proficiency}%)
                        {idx < skills.length - 1 && <span>, </span>}
                    </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 style={{ fontSize: 16, borderBottom: "2px solid #88c0d0", paddingBottom: 4, marginBottom: 8, color: "#5e81ac" }}>
                Languages
              </h2>
              <ul style={{ listStyle: "none", paddingLeft: 0, color: "#434c5e", fontSize: 11 }}>
                {languages.map((lang) => (
                  <li key={lang.id} style={{ marginBottom: 6 }}>
                    • {lang.lang_name} ({lang.proficiency})
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div style={{ flex: 2, minWidth: 350 }}>
          {/* Experience */}
          {experience.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, borderBottom: "3px solid #5e81ac", paddingBottom: 6, marginBottom: 12, color: "#3b4252" }}>
                Experience
              </h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 16 }}>
                  <p style={{ fontWeight: "700", fontSize: 14, marginBottom: 2 }}>
                    {exp.title} @ {exp.company_name}
                  </p>
                  <p style={{ fontStyle: "italic", color: "#65737e", fontSize: 12, marginBottom: 2 }}>
                    {exp.employment_type} | {exp.location}
                  </p>
                  <p style={{ fontSize: 11, color: "#81a1c1", marginBottom: 6 }}>
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date) || "Present"}
                  </p>
                  {exp.description && <p style={{ color: "#434c5e", fontSize: 12 }}>{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, borderBottom: "3px solid #5e81ac", paddingBottom: 6, marginBottom: 12, color: "#3b4252" }}>
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: 16 }}>
                  <p style={{ fontWeight: "700", fontSize: 14, marginBottom: 2 }}>
                    {edu.field_of_study} — {edu.Institution_name}
                  </p>
                  <p style={{ fontStyle: "italic", color: "#65737e", fontSize: 12, marginBottom: 2 }}>
                    {edu.education_type} | {edu.location}
                  </p>
                  <p style={{ fontSize: 11, color: "#81a1c1", marginBottom: 2 }}>
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date) || "Present"}
                  </p>
                  <p style={{ fontSize: 12, color: "#434c5e" }}>Grade: {edu.grade}</p>
                </div>
              ))}
            </section>
          )}

          {/* Volunteering */}
          {volunteering.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, borderBottom: "2px solid #88c0d0", paddingBottom: 4, marginBottom: 8, color: "#5e81ac" }}>
                Volunteering
              </h2>
              {volunteering.map((vol) => (
                <div key={vol.id} style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: "600", marginBottom: 2 }}>{vol.role}</p>
                  <p style={{ fontStyle: "italic", color: "#65737e", fontSize: 12 }}>{vol.organization}</p>
                  <p style={{ fontSize: 10, color: "#81a1c1" }}>
                    {formatDate(vol.start_date)} - {formatDate(vol.end_date) || "Present"}
                  </p>
                  {vol.description && <p style={{ fontSize: 12, color: "#434c5e" }}>{vol.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <section>
              <h2 style={{ fontSize: 16, borderBottom: "2px solid #88c0d0", paddingBottom: 4, marginBottom: 8, color: "#5e81ac" }}>
                Publications
              </h2>
              {publications.map((pub) => (
                <div key={pub.id} style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: "600", marginBottom: 2 }}>{pub.publication_title}</p>
                  <p style={{ fontSize: 11, color: "#65737e", marginBottom: 2 }}>
                    {pub.publisher_name} — {formatDate(pub.publication_date)}
                  </p>
                  {pub.publication_link && (
                    <a
                      href={pub.publication_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 11, color: "#5e81ac", textDecoration: "underline" }}
                    >
                      View Publication
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplateModern;
