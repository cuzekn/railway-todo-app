// src/components/Modal.jsx
import { useEffect, useRef } from 'react';

import './Modal.css';

// フォーカス可能な要素のセレクター
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const Modal = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // スクロール防止
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // フォーカストラップとフォーカス管理
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // モーダルを開いたときに、現在のフォーカスを保存
    previousActiveElement.current = document.activeElement;

    // モーダル内のフォーカス可能な要素を取得
    const getFocusableElements = () => {
      return modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
    };

    // 最初のフォーカス可能な要素にフォーカス
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Tabキーによるフォーカストラップ
    const handleTab = e => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return; // フォーカス可能な要素がない場合は何もしない

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: 最初の要素にいる場合、最後の要素に移動
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: 最後の要素にいる場合、最初の要素に移動
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      // モーダルを閉じたときに、元の要素にフォーカスを戻す
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal_content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal_header">
          <h2 id="modal-title" className="modal_title">
            {title}
          </h2>
        </div>
        <div className="modal_body">{children}</div>
      </div>
    </div>
  );
};
