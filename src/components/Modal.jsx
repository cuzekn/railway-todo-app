import React, { useEffect } from 'react';
import Modal from 'react-modal';

import Tasks from './Task';

// アプリケーションのルート要素を設定
Modal.setAppElement('#root');

const NormalModal = ({
  setisOpen,
  modalIsOpen,
  children,
  tasks,
  selectListId,
  isDoneDisplay,
}) => {
  return (
    <>
      <Modal isOpen={modalIsOpen}>
        <button onClick={() => setisOpen(prev => !prev)}>
          モーダルを閉じる
        </button>
        <div>{children}</div>
      </Modal>
      <button onClick={() => setisOpen(prev => !prev)}>モーダルを開く</button>
      {tasks && (
        <Tasks
          tasks={tasks}
          selectListId={selectListId}
          isDoneDisplay={isDoneDisplay}
        />
      )}
    </>
  );
};

export default NormalModal;
