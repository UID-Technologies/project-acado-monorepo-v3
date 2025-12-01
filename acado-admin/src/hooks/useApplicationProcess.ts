import { useState, useEffect } from 'react';
import { applicationsApi } from '@/api';

export interface MatchingCriterion {
  id: string;
  fieldName: string;
  type: 'required' | 'weighted' | 'preferred';
  weight: number;
  conditions: string[];
}

export interface MatchingCriteriaConfig {
  courseId: string;
  minimumScore: number;
  criteria: MatchingCriterion[];
  createdAt: Date;
  updatedAt: Date;
}

export const useApplicationProcess = () => {
  const [criteriaConfigs, setCriteriaConfigs] = useState<MatchingCriteriaConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const processes = await applicationsApi.getApplicationProcesses('all');
        // Map the processes to criteria configs
        const configs = processes.map((process: any) => ({
          courseId: process.id,
          minimumScore: process.minimumScore || 70,
          criteria: process.steps?.map((step: any) => ({
            id: step.id,
            fieldName: step.name,
            type: step.required ? 'required' : 'preferred',
            weight: 10,
            conditions: []
          })) || [],
          createdAt: new Date(process.createdAt),
          updatedAt: new Date(process.updatedAt)
        }));
        setCriteriaConfigs(configs as MatchingCriteriaConfig[]);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch application processes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveCriteriaConfig = async (courseId: string, minimumScore: number, criteria: MatchingCriterion[]) => {
    try {
      const existingIndex = criteriaConfigs.findIndex(c => c.courseId === courseId);
      const now = new Date();
      
      let updatedConfigs;
      if (existingIndex >= 0) {
        updatedConfigs = [...criteriaConfigs];
        updatedConfigs[existingIndex] = {
          courseId,
          minimumScore,
          criteria,
          createdAt: criteriaConfigs[existingIndex].createdAt,
          updatedAt: now
        };
        // Update via API
        await applicationsApi.updateApplicationProcess('all', courseId, {
          name: `Process for ${courseId}`,
          minimumScore,
        });
      } else {
        updatedConfigs = [...criteriaConfigs, {
          courseId,
          minimumScore,
          criteria,
          createdAt: now,
          updatedAt: now
        }];
        // Create via API
        await applicationsApi.createApplicationProcess('all', {
          name: `Process for ${courseId}`,
          description: 'Application process',
          steps: criteria.map((c, idx) => ({
            id: c.id,
            name: c.fieldName,
            order: idx + 1,
            required: c.type === 'required'
          }))
        });
      }
      
      setCriteriaConfigs(updatedConfigs);
      return true;
    } catch (err) {
      console.error('Failed to save criteria config:', err);
      throw err;
    }
  };

  const getCriteriaByCoursId = (courseId: string): MatchingCriteriaConfig | undefined => {
    return criteriaConfigs.find(c => c.courseId === courseId);
  };

  const deleteCriteriaConfig = async (courseId: string) => {
    try {
      await applicationsApi.deleteApplicationProcess('all', courseId);
      const updatedConfigs = criteriaConfigs.filter(c => c.courseId !== courseId);
      setCriteriaConfigs(updatedConfigs);
    } catch (err) {
      console.error('Failed to delete criteria config:', err);
      throw err;
    }
  };

  return {
    criteriaConfigs,
    loading,
    error,
    saveCriteriaConfig,
    getCriteriaByCoursId,
    deleteCriteriaConfig
  };
};