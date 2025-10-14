import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { BackButton } from '@/components/BackButton';
import { FormActions } from '@/components/FormActionButton';
import { TextField } from '@/components/TextField';
import { useId } from '@/hooks/useId';
import { deleteList, fetchLists, updateList } from '@/store/list';

import './index.css';

const EditList = () => {
  const id = useId();

  const { listId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const list = useSelector(state =>
    state.list.lists?.find(list => list.id === listId)
  );

  useEffect(() => {
    if (list) {
      setTitle(list.title);
    }
  }, [list]);

  useEffect(() => {
    void dispatch(fetchLists());
  }, [dispatch, listId]);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(updateList({ id: listId, title }))
        .unwrap()
        .then(() => {
          navigate(`/lists/${listId}`);
        })
        .catch(err => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [dispatch, listId, title, navigate]
  );

  return (
    <main className="edit_list">
      <BackButton />
      <h2 className="edit_list__title">Edit List</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <TextField
          label={'Name'}
          id={id}
          idTitle="title"
          placeholder="Family"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <FormActions
          cancelPath={`/lists/${listId}`}
          onDelete={() => dispatch(deleteList({ id: listId })).unwrap()}
          onDeleteSuccess={() => navigate('/')}
          onDeleteError={error => setErrorMessage(error.message)}
          deleteConfirmMessage="Are you sure you want to delete this list?"
          submitLabel="Update"
          isSubmitting={isSubmitting}
        />
      </form>
    </main>
  );
};

export default EditList;
