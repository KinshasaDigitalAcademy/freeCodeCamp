// filterUtils.ts
import {
  RavenCourse,
  MoodleCourse,
  MoodleCoursesCatalogue
} from '../show-courses';
import { filterLogics } from '../../utils/routes';
import { ProgramationCourses } from '../../utils/ajax';

// eslint-disable-next-line @typescript-eslint/naming-convention
type CourseType = RavenCourse | MoodleCourse | ProgramationCourses;

export const manyCategoryFilter = (
  valueOfUrl: string,
  filteredRavenCourses: RavenCourse[],
  filteredMoodleCourses: MoodleCoursesCatalogue | null | undefined,
  filterProgramationCourses: ProgramationCourses[],
  currentUrl: string,
  valueOfCurrentCategorie: number | null
): CourseType[] => {
  let courses: CourseType[] | undefined;
  let category: 'programation' | 'aws' | 'moodle';

  if (valueOfUrl === 'programmation') {
    courses = filterProgramationCourses;
    category = 'programation';
  } else if (valueOfUrl === 'amazon web service') {
    courses = filteredRavenCourses;
    category = 'aws';
  } else if (
    valueOfUrl === 'intelligence artificielle' ||
    valueOfUrl.includes('Intelligence%20%20artificielle')
  ) {
    const moodleIACourses = filteredMoodleCourses?.result
      .flatMap(course => course)
      .filter(course => course.categoryid === 14) as MoodleCourse[];

    courses = [...moodleIACourses];
    category = 'moodle';
  } else {
    // Vérification de l'existence de `filteredMoodleCourses`
    if (filteredMoodleCourses) {
      courses = filteredMoodleCourses?.result
        .flatMap(course => course)
        .filter(course => course.categoryid === valueOfCurrentCategorie);
    }
    category = 'moodle';
  }

  if (!courses) return [];

  switch (category) {
    case 'programation':
      return courses.filter(
        course =>
          filterLogics.programation.language(
            course as ProgramationCourses,
            currentUrl
          ) &&
          filterLogics.programation.type(
            course as ProgramationCourses,
            currentUrl
          ) &&
          filterLogics.programation.level(
            course as ProgramationCourses,
            currentUrl
          ) &&
          filterLogics.programation.duration(
            course as ProgramationCourses,
            currentUrl
          )
      );

    case 'aws':
      return courses.filter(
        course =>
          filterLogics.aws.language(course as RavenCourse, currentUrl) &&
          filterLogics.aws.type(course as RavenCourse, currentUrl) &&
          filterLogics.aws.level(course as RavenCourse, currentUrl) &&
          filterLogics.aws.duration(course as RavenCourse, currentUrl) &&
          filterLogics.aws.domain(course as RavenCourse, currentUrl)
      );

    case 'moodle':
      return courses.filter(
        course =>
          filterLogics.moodle.language(course as MoodleCourse, currentUrl) &&
          filterLogics.moodle.type(course as MoodleCourse, currentUrl) &&
          filterLogics.moodle.level(course as MoodleCourse, currentUrl) &&
          filterLogics.moodle.duration(course as MoodleCourse, currentUrl)
      );

    default:
      return [];
  }
};
