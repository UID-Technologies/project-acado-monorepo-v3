import React from "react";
import type { Profile } from "../services/profileService";

interface ResumeTemplateProps {
  profile: Profile;
}

const ResumeTemplateClassic: React.FC<ResumeTemplateProps> = ({ profile }) => {
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

  // Slice data with limits
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
        padding: 20,
        fontFamily: "'Inter', sans-serif",
        maxWidth: 794,
        margin: "auto",
        color: "#333",
        lineHeight: 1.4,
        fontSize: 12,
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: "2px solid #222", paddingBottom: 10 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>{profile.name}</h1>
        <p>{sectionsData.basic_info?.[0]?.email}</p>
      </header>

      {/* About */}
      {about && (
        <section style={{ marginTop: 10 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            About
          </h2>
          <p>{about}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginTop: 15 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: "600", marginBottom: 2 }}>
                {exp.title} — {exp.company_name}
              </p>
              <p style={{ fontStyle: "italic", color: "#666", marginBottom: 2 }}>
                {exp.employment_type} | {exp.location}
              </p>
              <p style={{ fontSize: 10, color: "#999" }}>
                {formatDate(exp.start_date)} - {formatDate(exp.end_date) || "Present"}
              </p>
              {exp.description && <p>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginTop: 15 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: "600", marginBottom: 2 }}>
                {edu.field_of_study} — {edu.Institution_name}
              </p>
              <p style={{ fontStyle: "italic", color: "#666", marginBottom: 2 }}>
                {edu.education_type} | {edu.location}
              </p>
              <p style={{ fontSize: 10, color: "#999" }}>
                {formatDate(edu.start_date)} - {formatDate(edu.end_date) || "Present"}
              </p>
              <p>Grade: {edu.grade}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section style={{ marginTop: 15 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            Skills
          </h2>
          <ul
            style={{
              listStyleType: "none",
              paddingLeft: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
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
        <section style={{ marginTop: 15 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            Languages
          </h2>
          <ul style={{ listStyleType: "none", marginTop: 8, paddingLeft: 0, display: "flex", gap: "12px" }}>
            {languages.map((lang, idx) => (
              <li key={lang.id} style={{ fontSize: 11 }}>
                {lang.lang_name} ({lang.proficiency})
                {idx < skills.length - 1 && <span>, </span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Volunteering */}
      {volunteering.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            Volunteering
          </h2>
          {volunteering.map((vol) => (
            <div key={vol.id} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: "600", marginBottom: 2 }}>{vol.role}</p>
              <p style={{ fontStyle: "italic", color: "#666" }}>{vol.organization}</p>
              <p style={{ fontSize: 10, color: "#999" }}>
                {formatDate(vol.start_date)} - {formatDate(vol.end_date) || "Present"}
              </p>
              {vol.description && <p>{vol.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <section style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 16, borderBottom: "1px solid #ddd" }}>
            Publications
          </h2>
          {publications.map((pub) => (
            <div key={pub.id} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: "600", marginBottom: 2 }}>{pub.publication_title}</p>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>
                {pub.publisher_name} — {formatDate(pub.publication_date)}
              </p>
              {pub.publication_link && (
                <a
                  href={pub.publication_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: "#0077cc", textDecoration: "underline" }}
                >
                  View Publication
                </a>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ResumeTemplateClassic;
