import React from 'react';
import { useTranslation } from 'react-i18next';

function ResponsiveDesign(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <span className='sr-only'>{t('icons.responsive-design')}</span>
      <svg
        width='118'
        height='100'
        viewBox='0 0 118 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
      >
        <path
          d='M111.75 0H5.75C2.58 0 0 2.58 0 5.75V79.75C0 82.92 2.58 85.5 5.75 85.5H45V96H34.81C33.84 96 33.06 96.78 33.06 97.75C33.06 98.72 33.84 99.5 34.81 99.5H97.75C100.37 99.5 102.5 97.37 102.5 94.75V85.5H111.75C114.92 85.5 117.5 82.92 117.5 79.75V5.75C117.5 2.58 114.92 0 111.75 0ZM48.5 85.5H69V94.75C69 95.19 69.08 95.6 69.19 96H48.5V85.5ZM60 68H23.5V47.68H60V68ZM61.75 44.18H21.75C20.78 44.18 20 44.96 20 45.93V68H9.5V9.5H108V68H102.5V48.93C102.5 46.31 100.37 44.18 97.75 44.18H73.75C71.13 44.18 69 46.31 69 48.93V68H63.5V45.93C63.5 44.96 62.72 44.18 61.75 44.18ZM90.21 47.68L90.06 49.43H81.45L81.3 47.68H90.21ZM99 94.75C99 95.44 98.44 96 97.75 96H73.75C73.06 96 72.5 95.44 72.5 94.75V48.93C72.5 48.24 73.06 47.68 73.75 47.68H77.78L78.1 51.33C78.18 52.23 78.94 52.93 79.84 52.93H91.66C92.57 52.93 93.33 52.24 93.4 51.33L93.72 47.68H97.75C98.44 47.68 99 48.24 99 48.93V94.75ZM114 79.75C114 80.99 112.99 82 111.75 82H102.5V71.5H109.75C110.72 71.5 111.5 70.72 111.5 69.75V7.75C111.5 6.78 110.72 6 109.75 6H7.75C6.78 6 6 6.78 6 7.75V69.75C6 70.72 6.78 71.5 7.75 71.5H69V82H5.75C4.51 82 3.5 80.99 3.5 79.75V5.75C3.5 4.51 4.51 3.5 5.75 3.5H111.75C112.99 3.5 114 4.51 114 5.75V79.75Z'
          fill='#E60000'
        />
        <path
          d='M88.3299 90.5H83.1699C82.1999 90.5 81.4199 91.28 81.4199 92.25C81.4199 93.22 82.1999 94 83.1699 94H88.3299C89.2999 94 90.0799 93.22 90.0799 92.25C90.0799 91.28 89.2999 90.5 88.3299 90.5Z'
          fill='#E60000'
        />
        <path
          d='M97.5 36.93V21.75C97.5 20.78 96.72 20 95.75 20H21.75C20.78 20 20 20.78 20 21.75V36.93C20 37.9 20.78 38.68 21.75 38.68H95.75C96.72 38.68 97.5 37.89 97.5 36.93ZM94 35.18H23.5V23.5H94V35.18Z'
          fill='#E60000'
        />
        <path
          d='M94.25 55.9299H77.25C76.28 55.9299 75.5 56.7099 75.5 57.6799V65.6799C75.5 66.6499 76.28 67.4299 77.25 67.4299H94.25C95.22 67.4299 96 66.6499 96 65.6799V57.6799C96 56.7099 95.22 55.9299 94.25 55.9299ZM92.5 63.9299H79V59.4299H92.5V63.9299Z'
          fill='#E60000'
        />
        <path
          d='M94.25 70.4299H77.25C76.28 70.4299 75.5 71.2099 75.5 72.1799V85.7499C75.5 86.7199 76.28 87.4999 77.25 87.4999H94.25C95.22 87.4999 96 86.7199 96 85.7499V72.1799C96 71.2099 95.22 70.4299 94.25 70.4299ZM92.5 83.9999H79V73.9299H92.5V83.9999Z'
          fill='black'
        />
      </svg>
    </>
  );
}

ResponsiveDesign.displayName = 'ResponsiveDesign';

export default ResponsiveDesign;
