import React, { useEffect, useState } from 'react';
import './course-filter.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  changeState,
  valueOfCurrentCategory,
  valueOfTypeDuration
} from '../../redux/atoms';
import { AddFilterQueryString } from '../../utils/allFunctions';

const FilterByDuration = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSubjectFilter, setShowSubjectFilter] = useState(true);
  const setValueDuration = useSetRecoilState(valueOfTypeDuration);
  const [checkedState, setCheckedState] = useState<{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '>1h': boolean /* eslint-disable @typescript-eslint/no-unsafe-assignment */;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1>5h': boolean;
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '>5h': boolean;
  }>({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '>1h': false,
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1>5h': false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '>5h': false /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  });
  const [currentCategorieValue, setValue0fCurrentCategory] = useRecoilState(
    valueOfCurrentCategory
  );

  const [queryString, setQueryString] = useState<string>('');
  const setChangeState = useSetRecoilState(changeState);

  useEffect(() => {
    AddFilterQueryString('durée', queryString ? queryString : '');
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  }, [queryString]);

  // Charger l'état des checkboxes depuis le localStorage lors du montage du composant
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  useEffect(() => {
    const savedState = JSON.parse(
      localStorage.getItem('filterDurationState') || '{}'
    );
    if (savedState) {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      setCheckedState(
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        savedState /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      );
    }
  }, []);

  // Sauvegarder l'état des checkboxes dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('filterDurationState', JSON.stringify(checkedState));
  }, [checkedState]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    // Mise à jour de l'état des checkboxes
    setCheckedState(prevState => {
      const updatedState = {
        ...prevState,
        [value]: checked // Mise à jour dynamique basée sur 'value'
      };

      setQueryString(value);

      // Mettre à jour les états dans Recoil
      setValueDuration(value);
      AddFilterQueryString('durée', queryString ? queryString : '');
      setChangeState(false);
      setValue0fCurrentCategory(currentCategorieValue);
      console.log(showFilter);

      return updatedState;
    });
  };

  return (
    <div className='filter-container'>
      <div className='main-title-filter-container'>
        <svg
          onClick={() => {
            setShowFilter(e => !e);
          }}
          width='30px'
          height='30px'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
        >
          <path d='M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z'></path>
        </svg>
      </div>
      <details className='filter__contenaire' open>
        <summary
          onClick={() => setShowSubjectFilter(e => !e)}
          className='filter-title-container'
        >
          <p className='filter-title'>Durée</p>
          {showSubjectFilter ? (
            <svg
              width='30px'
              height='30px'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect width='24' height='24' fill='white' />
              <path d='M7 14.5L12 9.5L17 14.5' stroke='#000000' />
            </svg>
          ) : (
            <svg
              width='30px'
              height='30px'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect width='24' height='24' fill='white' />
              <path d='M17 9.5L12 14.5L7 9.5' stroke='#000000' />
            </svg>
          )}
        </summary>
        <ul className='filter-items-container'>
          <div className='language-filter'>
            <label className='language__Label'>
              <input
                type='checkbox'
                value='>1h'
                checked={checkedState['>1h']}
                onChange={handleLanguageChange}
              />
              Moins d&apos;1 heure
            </label>
            <label className='language__Label'>
              <input
                type='checkbox'
                value='1>5h'
                checked={checkedState['1>5h']}
                onChange={handleLanguageChange}
              />
              1 à 5 heures
            </label>
            <label className='language__Label'>
              <input
                type='checkbox'
                value='>5h'
                checked={checkedState['>5h']}
                onChange={handleLanguageChange}
              />
              5+ heures
            </label>
          </div>
        </ul>
      </details>
    </div>
  );
};

FilterByDuration.displayName = 'FilterByDuration';
export default FilterByDuration;
