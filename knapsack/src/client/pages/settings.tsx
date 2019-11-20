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
// import { Tab } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { Tabs } from '../components/tabs';
import { SiteSettings } from './settings/site-settings';
import PageWithSidebar from '../layouts/page-with-sidebar';
import PatternsSettings from '../components/patterns-settings';

type Props = {
  /**
   * If this matches any of the `panes` `menuItem`, it will be tab loaded
   * `some-value` will match `Some Value`
   */
  initialTab?: string;
};

const SettingsPage: React.FC<Props> = ({ initialTab = '' }: Props) => {
  const history = useHistory();
  const panes = [
    {
      render: () => <SiteSettings />,
      menuItem: 'Site',
    },
    {
      render: () => <PatternsSettings />,
      menuItem: 'Patterns',
    },
  ];

  const defaultActiveIndex = panes.reduce((prev, pane, current) => {
    if (
      pane.menuItem.toLowerCase() ===
      initialTab.toLowerCase().replace(/-/g, ' ')
    ) {
      return current;
    }
    return prev;
  }, 0);

  return (
    <PageWithSidebar title="Settings" section="Configuration">
      <Tabs
        defaultActiveIndex={defaultActiveIndex}
        as="section"
        menu={{ pointing: true }}
        panes={panes}
        onTabChange={(event, data) => {
          const newPath = panes[data.activeIndex].menuItem
            .toLowerCase()
            .replace(/ /g, '-');
          // @todo prevent whole App from re-rendering when tab is changed; Just doing this so URL stays up to date
          history.push(`/settings/${newPath}`);
        }}
      />
      <hr />
    </PageWithSidebar>
  );
};

export default SettingsPage;
