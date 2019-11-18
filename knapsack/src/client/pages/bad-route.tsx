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
import PageWithSidebar from '../layouts/page-with-sidebar';

type Props = {
  title?: string;
  subtitle?: string;
  message?: string;
};

const BadRoute: React.FC<Props> = ({
  title = '404 - Error',
  subtitle = 'Oh no,',
  message = 'Seems there was an error.',
}: Props) => {
  return (
    <PageWithSidebar>
      <h4 className="ks-eyebrow">{subtitle}</h4>
      <h2>{title}</h2>
      <p>{message}</p>
    </PageWithSidebar>
  );
};

export default BadRoute;
