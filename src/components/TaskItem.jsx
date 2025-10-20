import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CheckboxField } from '@/components/CheckboxField';
import { FormActions } from '@/components/FormActionButton';
import { Modal } from '@/components/Modal';
import { TextField } from '@/components/TextField';
import { useId } from '@/hooks/useId';
import { CheckIcon } from '@/icons/CheckIcon';
import { PencilIcon } from '@/icons/PencilIcon';
import { deleteTask, updateTask } from '@/store/task';

import './TaskItem.css';

export const TaskItem = ({ task }) => {
  const formId = useId();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, title, detail, done, limit } = task;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // モーダル用のフォーム状態
  const [editTitle, setEditTitle] = useState('');
  const [editDetail, setEditDetail] = useState('');
  const [editDone, setEditDone] = useState(false);
  const [editLimit, setEditLimit] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // タスクデータをフォームに反映
  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDetail(task.detail);
      setEditDone(task.done);
      const limitValue = task.limit ? task.limit.split('T')[0] : '';
      setEditLimit(limitValue);
    }
  }, [task]);

  const handleToggle = useCallback(() => {
    setIsSubmitting(true);
    void dispatch(updateTask({ id, done: !done })).finally(() => {
      setIsSubmitting(false);
    });
  }, [id, done, dispatch]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      setIsUpdating(true);

      const limitValue = editLimit ? new Date(editLimit).toISOString() : null;

      void dispatch(
        updateTask({
          id: task.id,
          title: editTitle,
          detail: editDetail,
          done: editDone,
          limit: limitValue,
        })
      )
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
        })
        .catch(err => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    },
    [editTitle, task.id, editDetail, editDone, editLimit, dispatch]
  );

  const handleDelete = useCallback(() => {
    return dispatch(deleteTask({ id: task.id })).unwrap();
  }, [task.id, dispatch]);

  const formattedLimit = useMemo(() => {
    if (!limit) return null;

    const limitDate = new Date(limit);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limitDay = new Date(
      limitDate.getFullYear(),
      limitDate.getMonth(),
      limitDate.getDate()
    );

    // 期限切れの場合、経過日数を表示
    if (limitDay < today) {
      const diffTime = today.getTime() - limitDay.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `期限切れ (${diffDays}日経過)`;
    }

    // 今日判定
    if (limitDay.getTime() === today.getTime()) {
      return '今日';
    }

    // 明日判定
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (limitDay.getTime() === tomorrow.getTime()) {
      return '明日';
    }

    // 期限前の残り日数を表示
    const diffTime = limitDay.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 通常の日付表示
    const options = { month: 'numeric', day: 'numeric' };
    const formatted = limitDate.toLocaleDateString('ja-JP', options);

    // 年が異なる場合
    if (limitDate.getFullYear() !== now.getFullYear()) {
      return `${limitDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })} (残り${diffDays}日)`;
    }

    return `${formatted} (残り${diffDays}日)`;
  }, [limit]);

  return (
    <div className="task_item">
      <div className="task_item__title_container">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isSubmitting}
          className="task__item__mark_button"
        >
          {done ? (
            <div className="task_item__mark____complete" aria-label="Completed">
              <CheckIcon className="task_item__mark____complete_check" />
            </div>
          ) : (
            <div
              className="task_item__mark____incomplete"
              aria-label="Incomplete"
            ></div>
          )}
        </button>
        <div className="task_item__title" data-done={done}>
          {title}
        </div>
        <div aria-hidden className="task_item__title_spacer"></div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="task_item__title_action"
        >
          <PencilIcon aria-label="Edit" />
        </button>
      </div>
      <div className="task_item__detail">{detail}</div>
      {limit && !done && (
        <div
          className={`task_item__due_date ${
            formattedLimit?.startsWith('期限切れ') ? 'overdue' : ''
          } ${formattedLimit === '今日' ? 'today' : ''} ${
            formattedLimit === '明日' ? 'tomorrow' : ''
          }`}
        >
          期限: {formattedLimit}
        </div>
      )}

      {/* TaskEditModalの機能をインライン化 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Task"
      >
        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="error_message">{errorMessage}</p>}

          <TextField
            label={'Title'}
            id={formId}
            idTitle="title"
            placeholder="Buy some milk"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
          />

          <TextField
            label={'Description'}
            id={formId}
            idTitle="detail"
            placeholder="Blah blah blah"
            value={editDetail}
            onChange={event => setEditDetail(event.target.value)}
          />

          <TextField
            label={'Due Date'}
            id={formId}
            idTitle="limit"
            type="date"
            placeholder=""
            value={editLimit}
            onChange={event => setEditLimit(event.target.value)}
          />

          <CheckboxField
            label={'Is Done'}
            id={formId}
            idTitle="done"
            type="checkbox"
            checked={editDone}
            onChange={event => setEditDone(event.target.checked)}
          />

          <FormActions
            cancelPath={null}
            onCancel={() => setIsModalOpen(false)}
            onDelete={handleDelete}
            onDeleteSuccess={() => setIsModalOpen(false)}
            onDeleteError={error => setErrorMessage(error.message)}
            deleteConfirmMessage="Are you sure you want to delete this task?"
            submitLabel="Update"
            isSubmitting={isUpdating}
          />
        </form>
      </Modal>
    </div>
  );
};
