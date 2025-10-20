import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { FormActions } from '@/components/FormActionButton';
import { Modal } from '@/components/Modal';
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

  // リストデータをフォームに反映
  useEffect(() => {
    if (list) {
      setTitle(list.title);
    }
  }, [list]);

  useEffect(() => {
    void dispatch(fetchLists());
  }, [dispatch, listId]);

  const handleClose = useCallback(() => {
    // モーダルを閉じてリスト詳細ページに戻る
    navigate(`/lists/${listId}`);
  }, [navigate, listId]);

  const handleDeleteSuccess = useCallback(() => {
    // リスト削除後はホーム（リスト一覧）に戻る
    navigate('/');
  }, [navigate]);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();
      setIsSubmitting(true);

      void dispatch(
        updateList({
          id: listId,
          title,
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
    [title, listId, dispatch, handleClose]
  );

  const handleDelete = useCallback(() => {
    return dispatch(deleteList({ id: listId })).unwrap();
  }, [listId, dispatch]);

  if (!list) return null;

  return (
    <Modal isOpen={true} onClose={handleClose} title="Edit List">
      <form onSubmit={onSubmit}>
        {errorMessage && <p className="error_message">{errorMessage}</p>}

        <TextField
          label={'Name'}
          id={id}
          idTitle="title"
          placeholder="Family"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />

        <FormActions
          cancelPath={null}
          onCancel={handleClose}
          onDelete={handleDelete}
          onDeleteSuccess={handleDeleteSuccess}
          onDeleteError={error => setErrorMessage(error.message)}
          deleteConfirmMessage="Are you sure you want to delete this list?"
          submitLabel="Update"
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  );
};

export default EditList;
