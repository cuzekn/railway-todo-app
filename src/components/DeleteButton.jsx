import { useState } from 'react';

import './DeleteButton.css';

export const DeleteButton = ({
  onDelete,
  confirmMessaage = 'Are you sure you want to delete this list?',
  children = 'Delete',
  onError,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (!window.confirm(confirmMessaage)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      className="app_button actions_delete"
      disabled={isDeleting}
      onClick={handleClick}
    >
      {isDeleting ? 'Deleting...' : children}
    </button>
  );
};
