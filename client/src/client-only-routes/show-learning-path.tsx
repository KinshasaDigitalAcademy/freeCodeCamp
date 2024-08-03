import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid } from '@freecodecamp/react-bootstrap';
import { Link } from 'gatsby';

import {
  addRavenTokenToLocalStorage,
  generateRavenTokenAcces,
  getExternalResource,
  getRavenTokenDataFromLocalStorage,
  getAwsPath
} from '../utils/ajax';
import { createFlashMessage } from '../components/Flash/redux';
import {
  Loader,
  Spacer,
  renderCourseCardSkeletons,
  splitArray
} from '../components/helpers';
import LaptopIcon from '../assets/images/laptop.svg';
import CloudShield from '../assets/images/cloudShield.svg';
import PhBookBookmark from '../assets/images/ph-book-bookmark-thin.svg';
import awsLogo from '../assets/images/aws-logo.png';

import {
  signInLoadingSelector,
  userSelector,
  isSignedInSelector,
  hardGoTo as navigate
} from '../redux';

import { User } from '../redux/prop-types';
import envData from '../../../config/env.json';
import PathCard from '../components/PathCard/path-card';

const { moodleApiBaseUrl, moodleApiToken, ravenAwsApiKey } = envData;

// TODO: update types for actions
interface ShowLearningPathProps {
  createFlashMessage: typeof createFlashMessage;
  isSignedIn: boolean;
  navigate: (location: string) => void;
  showLoading: boolean;
  user: User;
  path?: string;
  location?: { state: { description: string } };
}

type MoodleCourseCategorie = {
  id: number;
  name: string;
  description: string;
  coursecount: number;
  visible: number;
  parent: number;
};

type MoodleCoursesCatalogue = {
  result: MoodleCourseCategorie[][];
  size: number;
};
interface RavenTokenData {
  token: string;
  expiresIn: number;
  validFrom: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  valid_to: string;
}
type RavenCourse = {
  learningobjectid: number;
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  launch_url: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  long_description: string;
  createddate: string;
  updateddate: string;
  contenttype: string;
};
interface RavenFetchCoursesDto {
  apiKey: string;
  token: string;
  fromDate: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  valid_to: string;
}

const mapStateToProps = createSelector(
  signInLoadingSelector,
  userSelector,
  isSignedInSelector,
  (showLoading: boolean, user: User, isSignedIn) => ({
    showLoading,
    user,
    isSignedIn
  })
);

const mapDispatchToProps = {
  createFlashMessage,
  navigate
};

export function ShowLearningPath(props: ShowLearningPathProps): JSX.Element {
  const { showLoading, isSignedIn } = props;
  const [moodleCoursesCategories, setMoodleCoursesCategories] =
    useState<MoodleCoursesCatalogue | null>();
  const [isDataOnLoading, setIsDataOnLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [awsCoursesIsAviable, setAwsCoursesIsAviable] =
    useState<boolean>(false);
  const [ravenPath, setRavenPath] = useState<RavenCourse[]>([]);
  console.log('state courses ', ravenPath);

  const getRavenResourcesPath = async (data: RavenFetchCoursesDto) => {
    const getReveanCourses = await getAwsPath(data);
    setRavenPath(getReveanCourses as RavenCourse[]);
    console.log('les ', getReveanCourses);
  };
  const getMoodleCoursesCategories = async () => {
    const moodleCategoriesCatalogue = await getExternalResource<
      MoodleCourseCategorie[]
    >(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${moodleApiBaseUrl}?wstoken=${moodleApiToken}&wsfunction=core_course_get_categories&moodlewsrestformat=json`
    );
    if (moodleCategoriesCatalogue != null) {
      setMoodleCoursesCategories(
        splitArray<MoodleCourseCategorie>(
          moodleCategoriesCatalogue.filter(moodleCourse => {
            return moodleCourse.parent != 0 && moodleCourse.visible == 1;
          }),
          20
        )
      );
    } else {
      setMoodleCoursesCategories(null);
    }
  };

  const getRavenToken = async () => {
    const ravenLocalToken = getRavenTokenDataFromLocalStorage();

    if (ravenLocalToken === null) {
      const generateRavenToken = await generateRavenTokenAcces();

      if (generateRavenToken)
        addRavenTokenToLocalStorage(generateRavenToken as RavenTokenData);
      setAwsCoursesIsAviable(true);
    } else {
      setAwsCoursesIsAviable(true);
    }
  };
  const ravenLocalToken = getRavenTokenDataFromLocalStorage();
  const ravenData: RavenFetchCoursesDto = {
    apiKey: ravenAwsApiKey,
    token: ravenLocalToken?.token || '',
    fromDate: '01-01-2023',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    valid_to: '06-24-2024'
  };
  useEffect(() => {
    void getRavenResourcesPath(ravenData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    void getRavenToken();
  }, []);
  useEffect(() => {
    void getRavenToken();
  }, []);
  useEffect(() => {
    void getMoodleCoursesCategories();
    const timer = setTimeout(() => {
      if (isDataOnLoading) {
        setIsDataOnLoading(false);
      }
    }, 3000);
    return () => {
      setMoodleCoursesCategories(null); // cleanup useEffect to perform a React state update
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showLoading) {
    return <Loader fullScreen={true} />;
  }

  return (
    <>
      <Helmet title={`Nos parcours | Kadea Online`} />
      <Grid className='bg-light'>
        <main>
          <div className=''>
            <Spacer size={1} />
            <div>
              <h1 className='big-subheading'>{`Nos parcours.`}</h1>
              <p className='text-responsive'>
                {`
          Nos parcours te permettent d’apprendre par la pratique. Tu gagneras donc un véritable savoir-faire .
          `}
              </p>
            </div>
            <Spacer />
            <div>
              {!isDataOnLoading ? (
                <div className='card-course-detail-container'>
                  <Link to='/learning-path/developpement-web'>
                    <div className='card-link'>
                      <PathCard
                        icon={LaptopIcon}
                        alt=''
                        isAvailable={true}
                        isSignedIn={isSignedIn}
                        title={`Développement Web`}
                        buttonText={`Suivre le parcours  `}
                        link={`/learning-path/developpement-web`}
                        cardType='parcours'
                        description={`
                        Dans ce parcours en ligne, tu apprendras les langages que les développeurs 
                        utilisent pour créer des pages Web : HTML (Hypertext Markup Language) 
                        pour le contenu, et CSS (Cascading Style Sheets) pour la conception. 
                        Enfin, tu apprendras à créer des pages Web adaptées à différentes tailles d'écran.
                     `}
                      />
                    </div>
                  </Link>

                  <PathCard
                    icon={CloudShield}
                    alt=''
                    isAvailable={awsCoursesIsAviable}
                    isSignedIn={isSignedIn}
                    title={`Parcours AWS`}
                    buttonText={`Suivre le parcours  `}
                    link={`/aws-courses`}
                    cardType='parcours'
                    description={`Ce parcours est conçu pour montrer aux participants comment 
                  optimiser l'utilisation du cloud AWS grâce à la compréhension 
                  de ces nombreux services et de leur intégration dans la création 
                  de solutions basées sur le cloud.`}
                  />

                  {moodleCoursesCategories &&
                    moodleCoursesCategories.result.length >= 0 &&
                    moodleCoursesCategories.result[currentPage - 1].map(
                      (category, index) => {
                        return (
                          <Link
                            key={index}
                            to={`/learning-path/${category.name
                              .replace(/ /g, '-')
                              .replace(/&amp;/g, 'et')}/${category.id}`}
                            className='link'
                          >
                            <div className='card-link'>
                              <PathCard
                                icon={PhBookBookmark}
                                isAvailable={category.visible == 1}
                                isSignedIn={isSignedIn}
                                title={category.name.replace(/&amp;/g, 'et')}
                                buttonText={`Suivre le parcours`}
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                link={`/learning-path/${category.name
                                  .replace(/ /g, '-')
                                  .replace(/&amp;/g, 'et')}/${category.id}`}
                                cardType='parcours'
                                description={category.description}
                              />
                            </div>
                          </Link>
                        );
                      }
                    )}

                  {ravenPath &&
                    ravenPath.length >= 0 &&
                    ravenPath.map((course, index) => {
                      return (
                        <PathCard
                          key={course.name}
                          icon={awsLogo}
                          isAvailable={true}
                          isSignedIn={isSignedIn}
                          title={`${index + 1}. ${course.name}`}
                          buttonText={`Suivre le cours  `}
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                          link={`${course.launch_url}`}
                          description={course.long_description}
                        />
                      );
                    })}
                </div>
              ) : (
                <div className='card-course-detail-container'>
                  {renderCourseCardSkeletons(6)}
                </div>
              )}
            </div>
          </div>
        </main>
      </Grid>
    </>
  );
}

ShowLearningPath.displayName = 'ShowLearningPath';

export default connect(mapStateToProps, mapDispatchToProps)(ShowLearningPath);
