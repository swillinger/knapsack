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
import { useSelector } from '../store';
import PageSidebar from '../layouts/page-with-sidebar';
import { HomeSplash } from '../components/home-splash';

const HomePage: React.FC = () => {
  const { title, subtitle, slogan } = useSelector(s => {
    return {
      title: s.settingsState.settings.title,
      subtitle: s.settingsState.settings.subtitle,
      slogan: s.settingsState.settings.slogan,
    };
  });
  const version = useSelector(s => s.metaState.meta.version);

  return (
    <PageSidebar>
      <HomeSplash
        title={title}
        subtitle={subtitle}
        slogan={slogan}
        version={version}
      />
    </PageSidebar>
  );
};

export default HomePage;
