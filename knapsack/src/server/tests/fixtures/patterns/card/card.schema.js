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
module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema',
  type: 'object',
  title: 'Card',
  description: 'A Card that powers the internet',
  required: ['title', 'body'],
  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    body: {
      type: 'string',
      title: 'Body',
    },
    img: {
      type: 'string',
      title: 'Image Path',
    },
    align: {
      title: 'Image Alignment',
      type: 'string',
      enum: ['top', 'right', 'bottom', 'left'],
      default: 'left',
    },
  },
  examples: [
    {
      title: "I'm a Card Title",
      body:
        "I'm a body - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      img: '',
    },
  ],
};
