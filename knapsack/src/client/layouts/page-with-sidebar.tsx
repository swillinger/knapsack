/**
 *  Copyright (C) 2018 Basalt
    This file is part of Knapsack.
    Knapsack is free software; you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by the Free
    Software Foundation; either version 2 of the License, or (at your option)
    any later version.

    Knapsack is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
    FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along
    with Knapsack; if not, see <https://www.gnu.org/licenses>.
 */
import React, { useState } from 'react';
import classnames from 'classnames';
import { FaChevronLeft } from 'react-icons/fa';
import { Sidebar } from '../components/sidebar/sidebar';
import ErrorCatcher from '../utils/error-catcher';
import { SiteHeaderConnected } from '../components/site-header';
import { PageHeaderContainer } from '../components/page-header';
import './page-with-sidebar.scss';
import { AddEntity } from '../components/sidebar/add-entity';
import {
  addPage,
  addSecondaryNavItem,
  useDispatch,
  useSelector,
} from '../store';

type Props = {
  isInitiallyCollapsed?: boolean;
  isFullScreen?: boolean;
  sidebar?: React.ReactNode;
  title?: string;
  section?: string;
  children: React.ReactNode;
};

const PageWithSidebar: React.FC<Props> = ({
  isInitiallyCollapsed = false,
  sidebar,
  children,
  isFullScreen = false,
  title,
  section,
}: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    isInitiallyCollapsed,
  );
  const canEdit = useSelector(s => s.userState.canEdit);
  const dispatch = useDispatch();

  if (!isFullScreen) {
    return (
      <div
        className={classnames({
          'ks-page-with-sidebar': true,
          'ks-page-with-sidebar--sidebar-collapsed': isSidebarCollapsed,
        })}
      >
        <SiteHeaderConnected />
        <div
          className={classnames({
            'ks-page-with-sidebar__sidebar': true,
            'ks-page-with-sidebar__sidebar--collapsed': isSidebarCollapsed,
          })}
        >
          {sidebar || <Sidebar />}
          <button
            className="ks-page-with-sidebar__sidebar__collapse-ctrl"
            type="button"
            onClick={() => setIsSidebarCollapsed(current => !current)}
          >
            <FaChevronLeft
              style={{
                height: '16px',
                color: '#222222',
                transform: isSidebarCollapsed ? 'rotate(180deg)' : '',
              }}
            />
          </button>
          <div className="ks-page-with-sidebar__sidebar-footer">
            {canEdit && (
              <AddEntity
                icon="Add Icon"
                handleAdd={({ title: theTitle, entityType }) => {
                  // eslint-disable-next-line default-case
                  switch (entityType) {
                    case 'page': {
                      dispatch(
                        addPage({
                          title: theTitle,
                        }),
                      );
                      break;
                    }
                    case 'group': {
                      dispatch(
                        addSecondaryNavItem({
                          name: theTitle,
                        }),
                      );
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        <ErrorCatcher>
          <main className="ks-page-with-sidebar__page">
            <PageHeaderContainer title={title} section={section} />
            {children}
          </main>
        </ErrorCatcher>
      </div>
    );
  }
  return (
    <ErrorCatcher>
      <main>{children}</main>
    </ErrorCatcher>
  );
};

export default PageWithSidebar;
