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

// DO NOT USE ENV VARS IN HERE!!!!!
module.exports = {
  enableBlockquotes: false,
  enableUiSettings: true,
  // @todo fix ability to create new patterns via UI
  enableUiCreatePattern: false,
  enableTemplatePush: true,
  // @todo enablePatternIcons is not support in pattern-grid.jsx and playground-sidebar--pattern-list-item as of adoption of gql over REST API
  enablePatternIcons: false,
  enableCodeBlockLiveEdit: false,
};
