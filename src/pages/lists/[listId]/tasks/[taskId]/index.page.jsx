import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { CheckboxField } from '@/components/CheckboxField';
import { FormActions } from '@/components/FormActionButton';
import { Modal } from '@/components/Modal';
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
  const [limit, setLimit] = useState('');

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
      const limitValue = task.limit ? task.limit.split('T')[0] : '';
      setLimit(limitValue);
    }
  }, [task]);

  useEffect(() => {
    void dispatch(setCurrentList(listId));
    void dispatch(fetchTasks());
  }, [listId, dispatch]);

  const handleClose = useCallback(() => {
    navigate(`/lists/${listId}`);
  }, [navigate, listId]);

  const handleCancel = useCallback(() => {
    // EditListと統一：キャンセル時もリスト詳細に戻る
    navigate(`/lists/${listId}`);
  }, [navigate, listId]);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      setIsSubmitting(true);

      const limitValue = limit ? new Date(limit).toISOString() : null;

      void dispatch(
        updateTask({
          id: taskId,
          title,
          detail,
          done,
          limit: limitValue,
        })
      )
        .unwrap()
        .then(() => {
          handleClose();
        })
        .catch(err => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [title, taskId, detail, done, limit, dispatch, handleClose]
  );

  const handleDelete = useCallback(() => {
    return dispatch(deleteTask({ id: taskId })).unwrap();
  }, [taskId, dispatch]);

  if (!task) return null;

  return (
    <Modal isOpen={true} onClose={handleClose} title="Edit Task">
      <form onSubmit={onSubmit}>
        {errorMessage && <p className="error_message">{errorMessage}</p>}

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

        <TextField
          label={'Due Date'}
          id={id}
          idTitle="limit"
          type="date"
          placeholder=""
          value={limit}
          onChange={event => setLimit(event.target.value)}
        />

        <CheckboxField
          label={'Is Done'}
          id={id}
          idTitle="done"
          type="checkbox"
          checked={done}
          onChange={event => setDone(event.target.checked)}
        />

        <FormActions
          cancelPath={null}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onDeleteSuccess={() => navigate('/')}
          onDeleteError={error => setErrorMessage(error.message)}
          deleteConfirmMessage="Are you sure you want to delete this task?"
          submitLabel="Update"
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  );
};

export default EditTask;
