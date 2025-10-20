// components/FormActions/index.jsx
import { useState } from 'react';

import './FormActionButton.css';

export const FormActions = ({
  onCancel,
  onDelete,
  onDeleteSuccess,
  onDeleteError,
  deleteConfirmMessage = 'Are you sure you want to delete this item?',
  submitLabel = 'Update',
  isSubmitting = false,
  showDelete = true,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(deleteConfirmMessage)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      onDeleteSuccess?.();
    } catch (error) {
      onDeleteError?.(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="form_actions">
      <button
        type="button"
        data-variant="secondary"
        className="app_button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <div className="form_actions_spacer" />
      {showDelete && (
        <button
          type="button"
          className="app_button form_actions_delete"
          disabled={isSubmitting || isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
      <button
        type="submit"
        className="app_button"
        disabled={isSubmitting || isDeleting}
      >
        {isSubmitting ? 'Updating...' : submitLabel}
      </button>
    </div>
  );
};
