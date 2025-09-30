import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import "./task.scss";

const Tasks = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;

  if (isDoneDisplay == "done") {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link">
                {task.title}
                <br />
                {task.done ? "完了" : "未完了"}
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <>
      <ul>
        {tasks
          .filter((task) => {
            return task.done === false;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <button className="task-item-link">
                {task.title}
                <br />
                {task.done ? "完了" : "未完了"}
                <br />
                {task.limit ? (
                  <>
                    <p>期限</p>
                    {new Date(task.limit).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                    <p>残り日数</p>
                    {(() => {
                      const limitDate = new Date(task.limit);
                      const today = new Date();

                      // 日付のみを比較するために時刻を00:00:00に設定
                      const limitDateOnly = new Date(
                        limitDate.getFullYear(),
                        limitDate.getMonth(),
                        limitDate.getDate()
                      );
                      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                      // 日数の差を計算（ミリ秒を日数に変換）
                      const diffDays = Math.floor((limitDateOnly - todayOnly) / (1000 * 60 * 60 * 24));

                      if (diffDays === 0) {
                        return <span style={{ color: "blue" }}>今日が期限です</span>;
                      } else if (diffDays < 0) {
                        return <span style={{ color: "red" }}>期限が過ぎています</span>;
                      } else {
                        return <span>残り{diffDays}日</span>;
                      }
                    })()}
                  </>
                ) : (
                  <p>期限なし</p>
                )}
              </button>
            </li>
          ))}
      </ul>
    </>
  );
};

export default Tasks;

// // アプリケーションのルート要素を設定
// Modal.setAppElement("#root");

// const NormalModal = ({ setisOpen, modalIsOpen, children, tasks, selectListId, isDoneDisplay }) => {
//   return (
//     <>
//       <Modal isOpen={modalIsOpen}>
//         <button onClick={() => setisOpen((prev) => !prev)}>モーダルを閉じる</button>
//         <div>{children}</div>
//       </Modal>
//       {/* <button onClick={() => setisOpen((prev) => !prev)}>モーダルを開く</button> */}
//       {tasks && <Tasks tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />}
//     </>
//   );
// };

// export default NormalModal;
