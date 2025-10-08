import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { BackButton } from '@/components/BackButton';
import { TextField } from '@/components/TextField';
import { useId } from '@/hooks/useId';
import { createList, setCurrentList } from '@/store/list/index';

import './index.css';

const NewList = () => {
  const id = useId();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(createList({ title }))
        .unwrap()
        .then(listId => {
          dispatch(setCurrentList(listId));
          navigate(`/`);
        })
        .catch(err => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [dispatch, navigate, title]
  );

  return (
    <main className="new_list">
      <BackButton />
      <h2 className="new_list__title">New List</h2>
      <p className="new_list__error">{errorMessage}</p>
      <form className="new_list__form" onSubmit={onSubmit}>
        <TextField
          label={'Name'}
          id={id}
          idTitle="title"
          placeholder="Family"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <div className="new_list__form_actions">
          <Link to="/" data-variant="secondary" className="app_button">
            Cancel
          </Link>
          <div className="new_list__form_actions_spacer"></div>
          <button type="submit" className="app_button" disabled={isSubmitting}>
            Create
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewList;
