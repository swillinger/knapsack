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
import { KsFigure } from '@knapsack/design-system';
import { useHistory } from 'react-router-dom';
import { BASE_PATHS } from '../../lib/constants';
import { KnapsackPattern } from '../../schemas/patterns';
import { TemplateThumbnail } from './template-thumbnail';
import './pattern-grid.scss';

type Props = {
  // patternStatuses: KnapsackPatternStatus[];
  // patternTypes: KnapsackPatternType[];
  patterns: {
    /**
     * patternId
     */
    id: KnapsackPattern['id'];
    title: string;
    /**
     * @see {KnapsackPatternType}
     */
    // typeId: KnapsackPatternType['id'];
    /**
     * @see {KnapsackPatternStatus}
     */
  }[];
};

export const PatternGrid: React.FC<Props> = ({
  patterns,
}: // patternStatuses,
// patternTypes,
Props) => {
  const history = useHistory();

  const items = patterns.map(({ id, title }) => {
    const path = `${BASE_PATHS.PATTERN}/${id}`;
    return (
      <div
        className="ks-pattern-grid__item"
        key={id}
        style={{ width: '240px' }}
      >
        <KsFigure
          figcaption={<p>{title}</p>}
          figure={<TemplateThumbnail patternId={id} thumbnailSize={240} />}
          handleTrigger={() => {
            history.push(path);
          }}
        />
      </div>
    );
  });
  return <div className="ks-pattern-grid">{items}</div>;
};
