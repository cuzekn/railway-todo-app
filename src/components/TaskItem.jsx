import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { CheckIcon } from '@/icons/CheckIcon';
import { PencilIcon } from '@/icons/PencilIcon';
import { updateTask } from '@/store/task';

import './TaskItem.css';

export const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const { listId } = useParams();
  const { id, title, detail, done, limit } = task;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = useCallback(() => {
    setIsSubmitting(true);
    void dispatch(updateTask({ id, done: !done })).finally(() => {
      setIsSubmitting(false);
    });
  }, [id, done, dispatch]);

  const formattedLimit = useMemo(() => {
    if (!limit) return null;

    const limitDate = new Date(limit);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limitDay = new Date(limitDate.getFullYear(), limitDate.getMonth(), limitDate.getDate());

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
        <Link
          to={`/lists/${listId}/tasks/${id}`}
          className="task_item__title_action"
        >
          <PencilIcon aria-label="Edit" />
        </Link>
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
    </div>
  );
};
