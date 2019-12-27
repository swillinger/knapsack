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
import React from 'react';
import classnames from 'classnames';
import { KsButton } from '@knapsack/design-system';
import { Sidebar } from '../components/sidebar/sidebar';
import ErrorCatcher from '../utils/error-catcher';
import { SiteHeaderConnected } from '../components/site-header';
import { PageHeaderContainer } from '../components/page-header';
import './page-with-sidebar.scss';
import { useDispatch, useSelector, setSidebarVisibility } from '../store';

type Props = {
  /**
   * Slot for navigation on the left
   */
  sidebar?: React.ReactNode;
  /**
   * Slot for details on a page, aka the rigth sidebar
   */
  slottedDetails?: React.ReactNode;
  title?: string;
  section?: string;
  children: React.ReactNode;
};

const PageWithSidebar: React.FC<Props> = ({
  sidebar,
  children,
  slottedDetails,
  title,
  section,
}: Props) => {
  const { pageDetailsOpen, sidebarOpen } = useSelector(s => s.ui);
  const dispatch = useDispatch();

  return (
    <div
      className={classnames({
        'ks-page-with-sidebar': true,
        'ks-page-with-sidebar--sidebar-collapsed': !sidebarOpen,
        'ks-page-with-sidebar--details-collapsed':
          slottedDetails && !pageDetailsOpen,
      })}
    >
      <SiteHeaderConnected />
      <div
        className={classnames({
          'ks-page-with-sidebar__sidebar': true,
          'ks-page-with-sidebar__sidebar--collapsed': !sidebarOpen,
        })}
      >
        {sidebar || <Sidebar />}
        <div
          className={classnames({
            'ks-page-with-sidebar__sidebar__collapse-ctrl': true,
            'ks-page-with-sidebar__sidebar__collapse-ctrl--collapsed': !sidebarOpen,
          })}
        >
          <KsButton
            kind="icon-standard"
            icon="collapser"
            onClick={() =>
              dispatch(setSidebarVisibility({ isOpen: !sidebarOpen }))
            }
          >
            {sidebarOpen ? 'Collapse' : 'Expand'}
          </KsButton>
        </div>
      </div>
      <ErrorCatcher>
        <main className="ks-page-with-sidebar__page">
          <PageHeaderContainer title={title} section={section} />
          {children}
        </main>
      </ErrorCatcher>
      {slottedDetails && (
        <aside className="ks-page-with-sidebar__details">
          {slottedDetails}
        </aside>
      )}
    </div>
  );
};

export default PageWithSidebar;
