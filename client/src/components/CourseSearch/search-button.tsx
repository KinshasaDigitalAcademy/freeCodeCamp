import React, { useState } from 'react';
import { navigate } from 'gatsby';
import './search-button.css';

const SearchButton = ({
  courseOrPath
}: {
  courseOrPath: 'course' | 'path';
}) => {
  const [searchKey, setSearchKey] = useState<string>('');

  const goToSearchPage = () => {
    void navigate('/search/' + searchKey.toLocaleLowerCase());
  };

  return (
    <form
      className='search-button-container'
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchKey.trim() !== '') {
          void goToSearchPage();
        }
      }}
    >
      <input
        placeholder={
          courseOrPath == 'path'
            ? 'Rechercher les parcours ...'
            : 'Rechercher les cours ...'
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchKey(event.target.value);
        }}
        value={searchKey}
        required
      />
      <button
        className={
          courseOrPath == 'course'
            ? 'course-search-button'
            : 'path-search-button'
        }
        type='submit'
      >
        <svg
          width='25px'
          height='25px'
          viewBox='0 -0.5 25 25'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M7.30524 15.7137C6.4404 14.8306 5.85381 13.7131 5.61824 12.4997C5.38072 11.2829 5.50269 10.0233 5.96924 8.87469C6.43181 7.73253 7.22153 6.75251 8.23924 6.05769C10.3041 4.64744 13.0224 4.64744 15.0872 6.05769C16.105 6.75251 16.8947 7.73253 17.3572 8.87469C17.8238 10.0233 17.9458 11.2829 17.7082 12.4997C17.4727 13.7131 16.8861 14.8306 16.0212 15.7137C14.8759 16.889 13.3044 17.5519 11.6632 17.5519C10.0221 17.5519 8.45059 16.889 7.30524 15.7137V15.7137Z'
            stroke='#fff'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.6702 7.20292C11.2583 7.24656 10.9598 7.61586 11.0034 8.02777C11.0471 8.43968 11.4164 8.73821 11.8283 8.69457L11.6702 7.20292ZM13.5216 9.69213C13.6831 10.0736 14.1232 10.2519 14.5047 10.0904C14.8861 9.92892 15.0644 9.4888 14.9029 9.10736L13.5216 9.69213ZM16.6421 15.0869C16.349 14.7943 15.8741 14.7947 15.5815 15.0879C15.2888 15.381 15.2893 15.8559 15.5824 16.1485L16.6421 15.0869ZM18.9704 19.5305C19.2636 19.8232 19.7384 19.8228 20.0311 19.5296C20.3237 19.2364 20.3233 18.7616 20.0301 18.4689L18.9704 19.5305ZM11.8283 8.69457C12.5508 8.61801 13.2384 9.02306 13.5216 9.69213L14.9029 9.10736C14.3622 7.83005 13.0496 7.05676 11.6702 7.20292L11.8283 8.69457ZM15.5824 16.1485L18.9704 19.5305L20.0301 18.4689L16.6421 15.0869L15.5824 16.1485Z'
            fill='#fff'
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchButton;
