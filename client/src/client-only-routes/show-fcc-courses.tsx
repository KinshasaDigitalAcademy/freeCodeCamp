import { Grid } from '@freecodecamp/react-bootstrap';
import React from 'react';
import Helmet from 'react-helmet';
// import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import envData from '../../../config/env.json';
import { createFlashMessage } from '../components/Flash/redux';
import { Loader, Spacer } from '../components/helpers';
import CourseCard from '../components/CourseCard/course-card';
import LaptopIcon from '../assets/images/laptop.svg';
import AlgoIcon from '../assets/images/algorithmIcon.svg';
import LaediesActIcon from '../assets/images/partners/ladies-act-logo.png';
import {
  signInLoadingSelector,
  userSelector,
  isSignedInSelector,
  hardGoTo as navigate
} from '../redux';

import { User } from '../redux/prop-types';

const { apiLocation } = envData;

// TODO: update types for actions
interface ShowFccCoursesProps {
  createFlashMessage: typeof createFlashMessage;
  isSignedIn: boolean;
  navigate: (location: string) => void;
  showLoading: boolean;
  user: User;
  path?: string;
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

export function ShowFccCourses(props: ShowFccCoursesProps): JSX.Element {
  // const { t } = useTranslation();
  const { isSignedIn, navigate, showLoading } = props;

  if (showLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!isSignedIn) {
    navigate(`${apiLocation}/signin`);
    return <Loader fullScreen={true} />;
  }

  return (
    <>
      {/* <Helmet title={`${t('buttons.settings')} | Code Learning Plateform`} /> */}
      <Helmet title={`Parcours Responsive Web Design | Kadea Online`} />
      <Grid className='bg-light'>
        <main>
          <div className='landing-top'>
            <div>
              <h2 className='big-heading'>{`Parcours Responsive Web Design`}</h2>
            </div>
            <Spacer size={2} />
            <div className='card-course-detail-container'>
              <CourseCard
                icon={LaptopIcon}
                sponsorIcon={LaediesActIcon}
                alt=''
                isAvailable={true}
                isSignedIn={isSignedIn}
                title={`Responsive Web Design`}
                buttonText={`Suivre le cours  `}
                description={`
                Dans cette formation en ligne, tu apprendras les langages que les développeurs 
                utilisent pour créer des pages Web : HTML (Hypertext Markup Language) 
                pour le contenu, et CSS (Cascading Style Sheets) pour la conception. 
                Enfin, tu apprendras à créer des pages Web adaptées à différentes tailles d'écran.
                `}
              />
              <CourseCard
                icon={AlgoIcon}
                alt=''
                isAvailable={false}
                isSignedIn={isSignedIn}
                title={`JavaScript Algorithms and Data Structures`}
                description={`Alors que HTML et CSS contrôlent le contenu et le style  d'une page, 
                JavaScript est utilisé pour la rendre interactive. Dans le cadre de 
                la certification JavaScript Algorithm and Data Structures, tu apprendras 
                les principes fondamentaux de JavaScript, etc.`}
              />
            </div>
          </div>
          <Spacer size={2} />
        </main>
      </Grid>
    </>
  );
}

ShowFccCourses.displayName = 'ShowFccCourses';

export default connect(mapStateToProps, mapDispatchToProps)(ShowFccCourses);
