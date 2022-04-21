import {
  HelpBlock,
  Alert,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from '@freecodecamp/react-bootstrap';
import { Link } from 'gatsby';
import React, { useState } from 'react';
import { TFunction, Trans, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import isEmail from 'validator/lib/isEmail';

import { updateMyEmail } from '../../redux/settings';
import { maybeEmailRE } from '../../utils';

import BlockSaveButton from '../helpers/form/block-save-button';
import FullWidthRow from '../helpers/full-width-row';

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ updateMyEmail }, dispatch);

type EmailProps = {
  email: string;
  isEmailVerified: boolean;
  sendQuincyEmail: boolean;
  t: TFunction;
  updateMyEmail: (email: string) => void;
  updateQuincyEmail: (sendQuincyEmail: boolean) => void;
};

interface EmailForm {
  currentEmail: string;
  newEmail: string;
  confirmNewEmail: string;
  isPristine: boolean;
}

function EmailSettings({
  email,
  isEmailVerified,
  updateMyEmail
}: EmailProps): JSX.Element {
  const [emailForm, setEmailForm] = useState<EmailForm>({
    currentEmail: email,
    newEmail: '',
    confirmNewEmail: '',
    isPristine: true
  });

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    updateMyEmail(emailForm.newEmail);
  }

  function createHandleEmailFormChange(
    key: 'newEmail' | 'confirmNewEmail'
  ): (e: React.ChangeEvent<HTMLInputElement>) => void {
    return e => {
      e.preventDefault();
      const userInput = e.target.value.slice();
      setEmailForm(prev => ({
        ...prev,
        [key]: userInput,
        isPristine: userInput === prev.currentEmail
      }));
    };
  }

  function getValidationForNewEmail() {
    const { newEmail, currentEmail } = emailForm;
    if (!maybeEmailRE.test(newEmail)) {
      return {
        state: null,
        message: ''
      };
    }
    if (newEmail === currentEmail) {
      return {
        state: 'error',
        message: 'Cet email est le même que votre email actuel'
      };
    }
    if (isEmail(newEmail)) {
      return { state: 'success', message: '' };
    } else {
      return {
        state: 'error',
        message:
          "Nous n'avons pas pu valider votre e-mail correctement, veuillez vous assurer qu'il est correct."
      };
    }
  }

  function getValidationForConfirmEmail() {
    const { confirmNewEmail, newEmail } = emailForm;
    if (!maybeEmailRE.test(newEmail)) {
      return {
        state: null,
        message: ''
      };
    }
    const isMatch = newEmail === confirmNewEmail;
    if (maybeEmailRE.test(confirmNewEmail)) {
      return {
        state: isMatch ? 'success' : 'error',
        message: isMatch
          ? ''
          : 'Les deux nouvelles adresses électroniques doivent être les mêmes'
      };
    } else {
      return {
        state: null,
        message: ''
      };
    }
  }

  const { newEmail, confirmNewEmail, currentEmail, isPristine } = emailForm;

  const { state: newEmailValidation, message: newEmailValidationMessage } =
    getValidationForNewEmail();

  const {
    state: confirmEmailValidation,
    message: confirmEmailValidationMessage
  } = getValidationForConfirmEmail();

  if (!currentEmail) {
    return (
      <div>
        <FullWidthRow>
          <p className='large-p text-center'>
            {"Vous n'avez pas d'adresse électronique associée à ce compte."}
          </p>
        </FullWidthRow>
        <FullWidthRow>
          <Link style={{ textDecoration: 'none' }} to='/update-email'>
            <Button block={true} bsSize='lg' bsStyle='primary'>
              {'Modifier'}
            </Button>
          </Link>
        </FullWidthRow>
      </div>
    );
  }
  return (
    <div className='email-settings'>
      {isEmailVerified ? null : (
        <div>
          <HelpBlock>
            <Alert bsStyle='info' className='text-center' closeLabel={'Fermer'}>
              {"Votre courriel n'a pas été vérifié."}
              <br />
              <Trans i18nKey='settings.email.check'>
                <Link to='/update-email' />
              </Trans>
            </Alert>
          </HelpBlock>
        </div>
      )}
      <div>
        <form id='form-update-email' onSubmit={handleSubmit}>
          <FormGroup controlId='current-email'>
            <ControlLabel>{'Email actuel'}</ControlLabel>
            <FormControl.Static>{currentEmail}</FormControl.Static>
          </FormGroup>
          <FormGroup controlId='new-email' validationState={newEmailValidation}>
            <ControlLabel>{'Nouvel email'}</ControlLabel>
            <FormControl
              onChange={createHandleEmailFormChange('newEmail')}
              type='email'
              value={newEmail}
            />
            {newEmailValidationMessage ? (
              <HelpBlock>{newEmailValidationMessage}</HelpBlock>
            ) : (
              <HelpBlock className='none-help-block'>{'none'}</HelpBlock>
            )}
          </FormGroup>
          <FormGroup
            controlId='confirm-email'
            validationState={confirmEmailValidation}
          >
            <ControlLabel>{'Confirmer le nouvel email'}</ControlLabel>
            <FormControl
              onChange={createHandleEmailFormChange('confirmNewEmail')}
              type='email'
              value={confirmNewEmail}
            />
            {confirmEmailValidationMessage ? (
              <HelpBlock>{confirmEmailValidationMessage}</HelpBlock>
            ) : (
              <HelpBlock className='none-help-block'>{'none'}</HelpBlock>
            )}
          </FormGroup>
          <BlockSaveButton
            disabled={
              newEmailValidation !== 'success' ||
              confirmEmailValidation !== 'success' ||
              isPristine
            }
          />
        </form>
      </div>
    </div>
  );
}

EmailSettings.displayName = 'EmailSettings';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EmailSettings));
