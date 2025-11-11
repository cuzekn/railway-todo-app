import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { TextField } from '@/components/TextField';
import { useId } from '@/hooks/useId';
import { useSignup } from '@/hooks/useSignup';

import './index.css';

const SignUp = () => {
  const auth = useSelector(state => state.auth.token !== null);

  const id = useId();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { signup } = useSignup();

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      setIsSubmitting(true);

      signup({ email, name, password })
        .catch(err => {
          setErrorMessage(`サインアップに失敗しました: ${err.message}`);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [email, name, password, signup]
  );

  if (auth) {
    return <Navigate to="/" />;
  }

  return (
    <main className="signup">
      <h2 className="signup__title">Register</h2>
      <p className="signup__error">{errorMessage}</p>
      <form className="signup__form" onSubmit={onSubmit}>
        <TextField
          label={'E-mail Address'}
          id={id}
          idTitle="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <TextField
          label={'Name'}
          id={id}
          idTitle="name"
          autoComplete="name"
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <TextField
          label={'Password'}
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          idTitle="password"
          id={id}
          autoComplete="new-password"
        />
        <div className="signup__form_actions">
          <Link className="app_button" data-variant="secondary" to="/signin">
            Login
          </Link>
          <div className="signup__form_actions_spacer"></div>
          <button type="submit" className="app_button" disabled={isSubmitting}>
            Register
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
