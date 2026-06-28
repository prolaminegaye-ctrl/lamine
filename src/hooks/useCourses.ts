import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Course } from '@/data/courseCatalog';

type CourseRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  duration: string;
  lessons: number;
  level: string;
  price: number;
  image: string;
  instructor: string;
  tag: string | null;
  certification: boolean;
  platform_url: string;
};

function mapCourse(row: CourseRow): Course {
  return {
    ...row,
    tag: row.tag ?? undefined,
    platformUrl: row.platform_url,
  };
}

export function useCourses() {
  return useQuery({
    queryKey: ['campusforma-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campusforma_courses')
        .select('*')
        .eq('is_active', true)
        .order('position');
      if (error) throw error;
      return (data as CourseRow[]).map(mapCourse);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourse(id?: string) {
  return useQuery({
    queryKey: ['campusforma-course', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campusforma_courses')
        .select('*')
        .eq('id', id!)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      return mapCourse(data as CourseRow);
    },
  });
}
