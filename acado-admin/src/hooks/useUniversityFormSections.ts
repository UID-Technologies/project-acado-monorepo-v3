import { useState, useEffect } from 'react';
import { universityFormSectionsApi, UniversityFormSection } from '@/api/universityFormSections.api';

export const useUniversityFormSections = () => {
  const [sections, setSections] = useState<UniversityFormSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load data from JSON server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await universityFormSectionsApi.getUniversityFormSections();
        setSections(data);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch university form sections:', err);
        // Fallback to empty array on error
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createSection = async (section: Omit<UniversityFormSection, 'id'>) => {
    try {
      const newSection = await universityFormSectionsApi.createUniversityFormSection(section);
      setSections([...sections, newSection]);
      return newSection;
    } catch (err) {
      console.error('Failed to create section:', err);
      throw err;
    }
  };

  const updateSection = async (sectionId: string, updates: Partial<Omit<UniversityFormSection, 'id'>>) => {
    try {
      const updatedSection = await universityFormSectionsApi.updateUniversityFormSection(sectionId, updates);
      setSections(sections.map(s => s.id === sectionId ? updatedSection : s));
      return updatedSection;
    } catch (err) {
      console.error('Failed to update section:', err);
      throw err;
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      await universityFormSectionsApi.deleteUniversityFormSection(sectionId);
      setSections(sections.filter(s => s.id !== sectionId));
    } catch (err) {
      console.error('Failed to delete section:', err);
      throw err;
    }
  };

  return {
    sections,
    loading,
    error,
    createSection,
    updateSection,
    deleteSection,
  };
};

