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
  const [editTime, setEditTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // タスクデータをフォームに反映
  useEffect(() => {
    if (task) {
      setEditTitle(task.title);
      setEditDetail(task.detail);
      setEditDone(task.done);
      if (task.limit) {
        const limitDate = new Date(task.limit);
        const dateValue = task.limit.split('T')[0];
        const hasTime =
          limitDate.getHours() !== 0 || limitDate.getMinutes() !== 0;
        const timeValue = hasTime
          ? `${String(limitDate.getHours()).padStart(2, '0')}:${String(limitDate.getMinutes()).padStart(2, '0')}`
          : '';
        setEditLimit(dateValue);
        setEditTime(timeValue);
      } else {
        setEditLimit('');
        setEditTime('');
      }
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

      // 日付と時刻を結合してISO形式に変換
      let limitValue = null;
      if (editLimit) {
        const dateTimeString = editTime
          ? `${editLimit}T${editTime}`
          : editLimit;
        limitValue = new Date(dateTimeString).toISOString();
      }

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
    [editTitle, task.id, editDetail, editDone, editLimit, editTime, dispatch]
  );

  const handleDelete = useCallback(() => {
    return dispatch(deleteTask({ id: task.id })).unwrap();
  }, [task.id, dispatch]);

  const formattedLimit = useMemo(() => {
    if (!limit) return null;

    const limitDate = new Date(limit);
    const now = new Date();

    // 期限日時の表示（年月日 時:分）
    const dateString = limitDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const hasTime = limitDate.getHours() !== 0 || limitDate.getMinutes() !== 0;
    const timeString = hasTime
      ? ` ${limitDate.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      : '';
    const fullDateTimeString = `${dateString}${timeString}`;

    // 残り時間を計算（ミリ秒単位）
    const diffMs = limitDate.getTime() - now.getTime();

    // 期限切れの場合
    if (diffMs < 0) {
      return { dateTime: fullDateTimeString, remaining: '期限切れ', className: 'overdue' };
    }

    // 残り時間を日・時間・分に変換
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const remainingHours = diffHours % 24;
    const remainingMinutes = diffMinutes % 60;

    // 残り時間の表示
    let remainingString = '';
    if (diffDays > 0) {
      if (remainingHours > 0) {
        remainingString = `あと${diffDays}日${remainingHours}時間`;
      } else {
        remainingString = `あと${diffDays}日`;
      }
    } else if (diffHours > 0) {
      if (remainingMinutes > 0) {
        remainingString = `あと${diffHours}時間${remainingMinutes}分`;
      } else {
        remainingString = `あと${diffHours}時間`;
      }
    } else {
      remainingString = `あと${diffMinutes}分`;
    }

    // 残り時間に応じたクラス名を設定
    let className = '';
    if (diffHours < 24) {
      // 24時間以内は「今日」扱い
      className = 'today';
    } else if (diffHours < 48) {
      // 24~48時間は「明日」扱い
      className = 'tomorrow';
    }

    return { dateTime: fullDateTimeString, remaining: remainingString, className };
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
      {limit && !done && formattedLimit && (
        <div
          className={`task_item__due_date ${formattedLimit.className}`}
        >
          <div>期限: {formattedLimit.dateTime}</div>
          <div>残り時間: {formattedLimit.remaining}</div>
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

          <TextField
            label={'Time'}
            id={formId}
            idTitle="time"
            type="time"
            placeholder="--:--"
            value={editTime}
            onChange={event => setEditTime(event.target.value)}
            disabled={!editLimit}
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
