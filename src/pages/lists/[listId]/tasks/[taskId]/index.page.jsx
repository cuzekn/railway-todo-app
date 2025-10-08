import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { BackButton } from '@/components/BackButton';
import { CheckboxField } from '@/components/CheckboxField';
import { DeleteButton } from '@/components/DeleteButton';
import { TextField } from '@/components/TextField';
import { useId } from '@/hooks/useId';
import { setCurrentList } from '@/store/list';
import { deleteTask, fetchTasks, updateTask } from '@/store/task';

import './index.css';

const EditTask = () => {
  const id = useId();

  const { listId, taskId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [done, setDone] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = useSelector(state =>
    state.task.tasks?.find(task => task.id === taskId)
  );

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDetail(task.detail);
      setDone(task.done);
    }
  }, [task]);

  useEffect(() => {
    void dispatch(setCurrentList(listId));
    void dispatch(fetchTasks());
  }, [listId, dispatch]);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      setIsSubmitting(true);

      void dispatch(updateTask({ id: taskId, title, detail, done }))
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
    [title, taskId, listId, detail, done, navigate, dispatch]
  );

  return (
    <main className="edit_list">
      <BackButton />
      <h2 className="edit_list__title">Edit List</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <TextField
          label={'Title'}
          id={id}
          idTitle="title"
          placeholder="Buy some milk"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <TextField
          label={'Description'}
          id={id}
          idTitle="detail"
          placeholder="Blah blah blah"
          value={detail}
          onChange={event => setDetail(event.target.value)}
        />
        <CheckboxField
          label={'Is Done'}
          id={id}
          idTitle="done"
          type="checkbox"
          checked={done}
          onChange={event => setDone(event.target.checked)}
        />
        <div className="edit_list__form_actions">
          <Link to="/" data-variant="secondary" className="app_button">
            Cancel
          </Link>
          <div className="edit_list__form_actions_spacer"></div>
          <DeleteButton
            onDelete={() => dispatch(deleteTask({ id: taskId })).unwrap()}
            onSuccess={() => navigate('/')}
            onError={error => setErrorMessage(error.message)}
            confirmMessaage="Are you sure you want to delete this task?"
          />
          <button
            type="button"
            className="app_button edit_list__form_actions_delete"
            disabled={isSubmitting}
          >
            Delete
          </button>
          <button type="submit" className="app_button" disabled={isSubmitting}>
            Update
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditTask;
