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
import { KsButton } from '@knapsack/design-system';
import { Sidebar } from '../components/sidebar/sidebar';
import ErrorCatcher from '../utils/error-catcher';
import { SiteHeaderConnected } from '../components/site-header';
import { PageHeaderContainer } from '../components/page-header';
import './page-with-sidebar.scss';
import {
  useDispatch,
  useSelector,
  saveToServer,
  disableEditMode,
  enableEditMode,
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
  const isEditMode = useSelector(s => s.ui.isEditMode);
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
          <KsButton
            className={classnames({
              'ks-page-with-sidebar__sidebar__collapse-ctrl': true,
              'ks-page-with-sidebar__sidebar__collapse-ctrl--collapsed': isSidebarCollapsed,
            })}
            kind="icon-standard"
            icon="collapser"
            onClick={() => setIsSidebarCollapsed(current => !current)}
          >
            {isSidebarCollapsed ? 'Expand' : 'Collapse'}
          </KsButton>
        </div>
        <ErrorCatcher>
          <main className="ks-page-with-sidebar__page">
            <PageHeaderContainer title={title} section={section} />
            {/* @TODO: Remove these KsButtons once the edit flow is established. */}
            {canEdit && (
              <div>
                <KsButton
                  kind="primary"
                  size="m"
                  onClick={() => dispatch(saveToServer())}
                >
                  Save it all
                </KsButton>
                <KsButton
                  size="m"
                  onClick={() =>
                    dispatch(isEditMode ? disableEditMode() : enableEditMode())
                  }
                >
                  Turn edit mode {isEditMode ? 'off' : 'on'}
                </KsButton>
                <hr />
              </div>
            )}
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
