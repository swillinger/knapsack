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
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { SignUp, Authenticator } from 'aws-amplify-react';
import awsconfig from '../aws-exports';
import { saveClientToken } from '../lib/user';
import { useDispatch, useSelector, updateUser } from '../client/store';
import './user-page.scss';

export const UserPage: React.FC = () => {
  const user = useSelector(s => s.userState.user);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { token } = qs.parse(search);
  if (token) {
    saveClientToken(Array.isArray(token) ? token[0] : token);
    // console.log('set token in local storage');
  }

  return (
    <section className="ks-user-page">
      <div className="ks-user-page__amplify-components">
        <Authenticator
          amplifyConfig={awsconfig}
          hide={[SignUp]}
          onStateChange={() => {
            // console.log('authState', authState);
            dispatch(updateUser());
          }}
        />
      </div>
    </section>
  );
};
