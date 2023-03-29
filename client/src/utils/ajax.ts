import cookies from 'browser-cookies';
import envData from '../../../config/env.json';

import type {
  ChallengeFile,
  CompletedChallenge,
  User
} from '../redux/prop-types';

const { apiLocation } = envData;

const base = apiLocation;

const defaultOptions: RequestInit = {
  credentials: 'include'
};

// csrf_token is passed to the client as a cookie. The client must send
// this back as a header.
function getCSRFToken() {
  const token =
    typeof window !== 'undefined' ? cookies.get('csrf_token') : null;
  return token ?? '';
}

// TODO: Might want to handle flash messages as close to the request as possible
// to make use of the Response object (message, status, etc)
async function get<T>(path: string): Promise<T> {
  return fetch(`${base}${path}`, defaultOptions).then<T>(res => res.json());
}

export function post<T = void>(path: string, body: unknown): Promise<T> {
  return request('POST', path, body);
}

function put<T = void>(path: string, body: unknown): Promise<T> {
  return request('PUT', path, body);
}

function deleteRequest<T = void>(path: string, body: unknown): Promise<T> {
  return request('DELETE', path, body);
}

async function request<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  path: string,
  body: unknown
): Promise<T> {
  const options: RequestInit = {
    ...defaultOptions,
    method,
    headers: {
      'CSRF-Token': getCSRFToken(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
  return fetch(`${base}${path}`, options).then<T>(res => res.json());
}

// Make the `request` function generic
// to specify the return data type:
async function requestModule<TResponse>(
  url: string,
  // `RequestInit` is a type for configuring
  // a `fetch` request. By default, an empty object.
  config: RequestInit = {}

  // This function is async, it will return a Promise:
): Promise<TResponse> {
  // Inside, we call the `fetch` function with
  // a URL and config given:
  const response = await fetch(url, config)
    // When got a response call a `json` method on it
    .then(response => response.json())
    // and return the result data.
    .then(data => data as TResponse);
  // We also can use some post-response
  // data-transformations in the last `then` clause.
  return response;
}

/** GET **/

interface SessionUser {
  user?: { [username: string]: User };
  sessionMeta: { activeDonations: number };
}

type ChallengeFilesForFiles = {
  files: Array<Omit<ChallengeFile, 'fileKey'> & { key: string }>;
} & Omit<CompletedChallenge, 'challengeFiles'>;

type ApiSessionResponse = Omit<SessionUser, 'user'>;
type ApiUser = {
  user: {
    [username: string]: Omit<User, 'completedChallenges'> & {
      completedChallenges?: ChallengeFilesForFiles[];
    };
  };
  result?: string;
};

type UserResponse = {
  user: { [username: string]: User } | Record<string, never>;
  result: string | undefined;
};

function parseApiResponseToClientUser(data: ApiUser): UserResponse {
  const userData = data.user?.[data?.result ?? ''];
  let completedChallenges: CompletedChallenge[] = [];
  if (userData) {
    completedChallenges =
      userData.completedChallenges?.reduce(
        (acc: CompletedChallenge[], curr: ChallengeFilesForFiles) => {
          return [
            ...acc,
            {
              ...curr,
              challengeFiles: curr.files.map(({ key: fileKey, ...file }) => ({
                ...file,
                fileKey
              }))
            }
          ];
        },
        []
      ) ?? [];
  }
  return {
    user: { [data.result ?? '']: { ...userData, completedChallenges } },
    result: data.result
  };
}

export function getSessionUser(): Promise<SessionUser> {
  const response: Promise<ApiUser & ApiSessionResponse> = get(
    '/user/get-session-user'
  );
  // TODO: Once DB is migrated, no longer need to parse `files` -> `challengeFiles` etc.
  return response.then(data => {
    const { result, user } = parseApiResponseToClientUser(data);
    return {
      sessionMeta: data.sessionMeta,
      result,
      user
    };
  });
}

type UserProfileResponse = {
  entities: Omit<UserResponse, 'result'>;
  result: string | undefined;
};
export function getUserProfile(username: string): Promise<UserProfileResponse> {
  const response: Promise<{ entities?: ApiUser; result?: string }> = get(
    `/api/users/get-public-profile?username=${username}`
  );
  return response.then(data => {
    const { result, user } = parseApiResponseToClientUser({
      user: data.entities?.user ?? {},
      result: data.result
    });
    return {
      entities: { user },
      result
    };
  });
}

interface Cert {
  certTitle: string;
  username: string;
  date: Date;
  completionTime: string;
}
export function getShowCert(username: string, certSlug: string): Promise<Cert> {
  return get(`/certificate/showCert/${username}/${certSlug}`);
}

export function getUsernameExists(username: string): Promise<boolean> {
  return get(`/api/users/exists?username=${username}`);
}

// interface MoodleCourse {
//   id: number;
//   shortname: string;
//   categoryid: number;
//   categorysortorder: number;
//   fullname: string;
//   displayname: string;
//   summary: string;
// }

// interface MoodleCourse {
//   userId: number;
//   id: number;
//   title: string;
//   body: string;
// }

export async function getExternalCoursesCatalog<T>(urlEndPoint: string) {
  let response: T | null;
  try {
    response = await requestModule<T>(urlEndPoint, {
      method: 'GET', //GET, POST, PUT, DELETE, etc.
      mode: 'cors', //no-cors,cors, same-origin
      cache: 'no-cache', //default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', //include, *same-origin, omit
      headers: {
        // 'CSRF-Token': getCSRFToken(),
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
  } catch (error) {
    response = null;
  }
  return response;
}

export async function getDatabaseResource<T>(urlEndPoint: string) {
  let response: T | null;
  try {
    response = await get(urlEndPoint);
  } catch (error) {
    response = null;
  }
  return response;
}

/** POST **/

interface Donation {
  email: string;
  amount: number;
  duration: string;
  provider: string;
  subscriptionId: string;
  customerId: string;
  startDate: Date;
}
// TODO: Verify if the body has and needs this Donation type. The api seems to
// just need the body to exist, but doesn't seem to use the properties.
export function addDonation(body: Donation): Promise<void> {
  return post('/donate/add-donation', body);
}

export function postChargeStripe(body: Donation): Promise<void> {
  return post('/donate/charge-stripe', body);
}

export function postChargeStripeCard(body: Donation): Promise<void> {
  return post('/donate/charge-stripe-card', body);
}
interface Report {
  username: string;
  reportDescription: string;
}
export function postReportUser(body: Report): Promise<void> {
  return post('/user/report-user', body);
}

// Both are called without a payload in danger-zone-saga,
// which suggests both are sent without any body
// TODO: Convert to DELETE
export function postDeleteAccount(): Promise<void> {
  return post('/account/delete', {});
}

export function postResetProgress(): Promise<void> {
  return post('/account/reset-progress', {});
}

export function postWebhookToken(): Promise<void> {
  return post('/user/webhook-token', {});
}

/** PUT **/

interface MyAbout {
  name: string;
  location: string;
  gender: string;
  codeTime: string;
  about: string;
  picture: string;
}
export function putUpdateMyAbout(values: MyAbout): Promise<void> {
  return put('/update-my-about', { ...values });
}

interface MyEducation {
  fieldOfStudy: string;
  levelOfStudy: string;
}
export function putUpdateMyEducation(values: MyEducation): Promise<void> {
  return put('/update-my-education', { ...values });
}

interface MyWorkExperience {
  employedWhere: string;
  sinceWhen: string;
  position: string;
}
export function putUpdateMyWorkExperience(
  values: MyWorkExperience
): Promise<void> {
  return put('/update-my-work-experience', { ...values });
}

export function putUpdateMyUsername(username: string): Promise<void> {
  return put('/update-my-username', { username });
}

interface CurrentSuperBlock {
  superBlockName: string;
  superBlockTranslatedName: string;
  superBlockDashedName: string;
  blockName: string;
  blockDashedName: string;
  isCurrentBlockCompleted: boolean;
  superBlockPath: string;
  currentChallengeId: string;
  totalChallenges: number;
  totalCompletedChallenges: number;
}

interface MyCurrentsSuperBlockList {
  currentsSuperBlock: CurrentSuperBlock[];
}

export function putUpdateMyCurrentsSuperBlock(
  values: MyCurrentsSuperBlockList
): Promise<void> {
  return put('/update-my-currents-super-block', { ...values });
}

export function putUpdateMyProfileUI(
  profileUI: User['profileUI']
): Promise<void> {
  return put('/update-my-profileui', { profileUI });
}

// Update should contain only one flag and one new value
// It's possible to constrain to only one key with TS, but is overkill for this
// https://stackoverflow.com/a/60807986
export function putUpdateUserFlag(
  update: Record<string, string>
): Promise<void> {
  return put('/update-user-flag', update);
}

export function putUserAcceptsTerms(quincyEmails: boolean): Promise<void> {
  return put('/update-privacy-terms', { quincyEmails });
}

export function putUserUpdateEmail(email: string): Promise<void> {
  return put('/update-my-email', { email });
}

export function putVerifyCert(certSlug: string): Promise<void> {
  return put('/certificate/verify', { certSlug });
}

/** DELETE **/
export function deleteWebhookToken(): Promise<void> {
  return deleteRequest('/user/webhook-token', {});
}
