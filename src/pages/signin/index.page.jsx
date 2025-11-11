import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { TextField } from '@/components/TextField';
import { useId } from '@/hooks/useId';
import { useLogin } from '@/hooks/useLogin';

import './index.css';

const SignIn = () => {
  const auth = useSelector(state => state.auth.token !== null);
  const { login } = useLogin();

  const id = useId();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      setIsSubmitting(true);

      login({ email, password })
        .catch(err => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [email, password, login]
  );

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="signin">
      <h2 className="signin__title">Login</h2>
      <p className="signin__error">{errorMessage}</p>
      <form className="signin__form" onSubmit={onSubmit}>
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
          label={'Password'}
          id={id}
          idTitle="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <div className="signin__form_actions">
          <Link className="app_button" data-variant="secondary" to="/signup">
            Register
          </Link>
          <div className="signin__form_actions_spacer"></div>
          <button type="submit" className="app_button" disabled={isSubmitting}>
            Login
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
