import { Row, Col, Table } from '@freecodecamp/react-bootstrap';
import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
// import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getDatabaseResource } from '../../utils/ajax';
import envData from '../../../../config/env.json';
import { createFlashMessage } from '../../components/Flash/redux';
import { Loader, Spacer } from '../../components/helpers';

import {
  signInLoadingSelector,
  userSelector,
  isSignedInSelector,
  hardGoTo as navigate
} from '../../redux';

import { User } from '../../redux/prop-types';

const { apiLocation } = envData;

// TODO: update types for actions
interface ShowAdminMembersProps {
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

type Member = {
  id: string;
  email: string;
  name: string;
  gender: string;
};

type UserList = {
  userList: Member[];
  totalPages: number;
  currentPage: number;
};

export function ShowAdminMembers(props: ShowAdminMembersProps): JSX.Element {
  const { isSignedIn, navigate, showLoading } = props;

  const [members, setMembers] = useState<Member[]>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getMembers = async () => {
    const pageNumber = currentPage;
    const memberList = await getDatabaseResource<UserList>(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `/all-users?page=${pageNumber}`
    );
    if (memberList != null) {
      setMembers(memberList.userList);
      if (totalPages == 0) {
        setTotalPages(Number(memberList.totalPages));
        setCurrentPage(Number(memberList.currentPage));
      }
    } else {
      setMembers([]);
    }
  };

  // const navigateToPage = (forwardOrBackward: boolean) => {
  //   if (forwardOrBackward) {
  //     setCurrentPage(Number(currentPage + 1));
  //     void getMembers();
  //   } else {
  //     setCurrentPage(Number(currentPage - 1));
  //     void getMembers();
  //   }
  // };

  useEffect(() => {
    void getMembers();
    return () => {
      setMembers([]); // cleanup useEffect to perform a React state update
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!isSignedIn) {
    navigate(`${apiLocation}/signin`);
    return <Loader fullScreen={true} />;
  }

  console.log('totalPages : ', totalPages);
  console.log('currentPage : ', currentPage);
  console.log('members : ', members);

  return (
    <>
      <Helmet title={`Tableau de bord - Membres | Kadea Online`} />

      <div className=''>
        <Row>
          <Col md={12} sm={12} xs={12}>
            <div className=''>
              <h1
                className='big-subheading'
                style={{ overflowWrap: 'break-word' }}
              >
                {'Membres'}
              </h1>
            </div>
          </Col>
        </Row>
        <Spacer size={1} />
        <Row>
          <Col md={12} sm={12} xs={12}>
            <div className=''>
              {members && members.length > 0 ? (
                <Table striped responsive hover>
                  <thead className='bg-dark-gray'>
                    <tr>
                      <th className='text-light'>Email</th>
                      <th className='text-light'>Name</th>
                      <th className='text-light'>Genre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => {
                      return (
                        <tr key={index}>
                          <td>{member.email}</td>
                          <td>{member.name}</td>
                          <td>{member.gender}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <></>
              )}
            </div>
          </Col>
          {/* <Col md={12} sm={12} xs={12}>
            <button
              onClick={() => {
                navigateToPage(false);
              }}
            >{`<-`}</button>
            {`  ${currentPage}...${totalPages}  `}
            <button
              onClick={() => {
                navigateToPage(true);
              }}
            >{`->`}</button>
          </Col> */}
        </Row>
        <Spacer size={1} />
      </div>
    </>
  );
}

ShowAdminMembers.displayName = 'ShowAdminMembers';

export default connect(mapStateToProps, mapDispatchToProps)(ShowAdminMembers);
