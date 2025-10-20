import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { useLogout } from '@/hooks/useLogout';
import { CloseIcon } from '@/icons/CloseIcon';
import { ListIcon } from '@/icons/ListIcon';
import { MenuIcon } from '@/icons/MenuIcon';
import { PlusIcon } from '@/icons/PlusIcon';
import { fetchLists } from '@/store/list/index';

import './Sidebar.css';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const lists = useSelector(state => state.list.lists);
  const activeId = useSelector(state => state.list.current);
  const isLoggedIn = useSelector(state => state.auth.token !== null);
  const userName = useSelector(state => state.auth.user?.name);

  // リスト新規作成ページではリストをハイライトしない
  const shouldHighlight = !pathname.startsWith('/list/new');

  const { logout } = useLogout();

  useEffect(() => {
    void dispatch(fetchLists());
  }, [dispatch]);

  // ルート変更時にモバイルメニューを閉じる
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // モバイルメニューが開いている時はスクロールを防止
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleCloseSidebar = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleOpenSidebar = () => {
    setIsMobileMenuOpen(true);
  };

  return (
    <>
      {/* ハンバーガーメニューボタン (モバイルのみ表示) */}
      <button
        type="button"
        className="hamburger_button"
        onClick={handleOpenSidebar}
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      {/* オーバーレイ背景 */}
      {isMobileMenuOpen && (
        <div className="sidebar__overlay" onClick={handleCloseSidebar} />
      )}

      <div className="sidebar" data-open={isMobileMenuOpen}>
        {/* モバイル用の閉じるボタン */}
        <button
          type="button"
          className="sidebar__close"
          onClick={handleCloseSidebar}
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>

        <Link to="/" onClick={handleLinkClick}>
          <h1 className="sidebar__title">Todos</h1>
        </Link>
        {isLoggedIn ? (
          <>
            {lists && (
              <div className="sidebar__lists">
                <h2 className="sidebar__lists_title">Lists</h2>
                <ul className="sidebar__lists_items">
                  {lists.map(listItem => (
                    <li key={listItem.id}>
                      <Link
                        data-active={
                          shouldHighlight && listItem.id === activeId
                        }
                        to={`/lists/${listItem.id}`}
                        className="sidebar__lists_item"
                        onClick={handleLinkClick}
                      >
                        <ListIcon aria-hidden className="sidebar__lists_icon" />
                        {listItem.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/list/new"
                      className="sidebar__lists_button"
                      onClick={handleLinkClick}
                    >
                      <PlusIcon className="sidebar__lists_plus_icon" />
                      New List...
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            <div className="sidebar__spacer" aria-hidden />
            <div className="sidebar__account">
              <p className="sidebar__account_name">{userName}</p>
              <button
                type="button"
                className="sidebar__account_logout"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="sidebar__login"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </>
  );
};
