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
import { Select } from '@knapsack/design-system';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  updatePatternInfo,
  useSelector,
  useDispatch,
  updatePatternSlices,
} from '../../store';
import ErrorCatcher from '../../utils/error-catcher';
// import DosAndDonts from '../../components/dos-and-donts';
import { BASE_PATHS } from '../../../lib/constants';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import TemplateView from './template-view';
import './pattern-view-page.scss';
import './shared/demo-grid-controls.scss';
import { CustomSliceCollection } from '../custom-page/custom-slice-collection';
import { InlineEditText } from '../../components/inline-edit';
import { getBreadcrumb } from '../../utils';

type Props = {
  patternId: string;
  templateId: string;
};

const PatternViewPage: React.FC<Props> = ({ patternId, templateId }: Props) => {
  const history = useHistory();
  const canEdit = useSelector(store => store.userState.canEdit);
  const pattern = useSelector(store => {
    const thePattern = store.patternsState.patterns[patternId];
    if (!thePattern) {
      throw new Error(
        `The pattern id ${patternId} cannont be found in Redux Store`,
      );
    }
    return thePattern;
  });
  const breadcrumb: string[] = useSelector(s => {
    const patternNavItem = s.navsState.secondary.find(
      item => item.path === `${BASE_PATHS.PATTERN}/${patternId}`,
    );
    if (!patternNavItem) return [];
    return getBreadcrumb({
      navItem: patternNavItem,
      navItems: s.navsState.secondary,
    });
  });
  const dispatch = useDispatch();

  const showAllTemplates = templateId === 'all';

  const { title, description, templates, demoSize: defaultDemoSize } = pattern;

  const [demoSize, setDemoSize] = useState<string>(defaultDemoSize);

  let hasSchema = false;
  if (showAllTemplates) {
    hasSchema = !!(
      showAllTemplates &&
      !!templates.find(
        t =>
          t.spec?.props?.properties &&
          Object.keys(t.spec.props.properties).length > 0,
      )
    );
  } else {
    const currentlySelectedTemplate = templates.find(t => t.id === templateId);

    hasSchema = !!(
      currentlySelectedTemplate?.spec?.props?.properties &&
      Object.keys(currentlySelectedTemplate.spec.props.properties).length > 0
    );
  }

  return (
    <ErrorCatcher>
      <PageWithSidebar>
        <section className="ks-pattern-view-page">
          <header className="ks-pattern-view-page__header">
            <div className="ks-pattern-view-page__header__info-wrap">
              <h4
                className="ks-eyebrow"
                style={{ textTransform: 'capitalize' }}
              >
                {breadcrumb.join(' / ')} /
              </h4>
              <h2 className="ks-pattern-view-page__header__info-wrap__title">
                <InlineEditText
                  text={title}
                  isHeading
                  handleSave={text => {
                    dispatch(
                      updatePatternInfo(patternId, {
                        title: text,
                      }),
                    );
                  }}
                />
              </h2>

              <p className="ks-pattern-view-page__header__info-wrap__description">
                <InlineEditText
                  text={description}
                  handleSave={text => {
                    dispatch(
                      updatePatternInfo(patternId, {
                        description: text,
                      }),
                    );
                  }}
                />
              </p>
            </div>
            <div className="ks-pattern-view-page__header__controls">
              <div>
                {templates.length > 1 && (
                  <Select
                    label="Template"
                    value={templateId}
                    items={[
                      {
                        value: 'all',
                        title: 'Show All',
                      },
                      ...templates.map(t => ({
                        value: t.id,
                        title: t.title,
                      })),
                    ]}
                    handleChange={value => {
                      history.push(
                        `${BASE_PATHS.PATTERN}/${patternId}/${value}`,
                      );
                    }}
                  />
                )}
              </div>
              <div>
                {hasSchema && (
                  <Select
                    items={[
                      {
                        value: 's',
                        title: 'Small',
                      },
                      {
                        value: 'm',
                        title: 'Medium',
                      },
                      {
                        value: 'l',
                        title: 'Large',
                      },
                      {
                        value: 'full',
                        title: 'Full',
                      },
                    ]}
                    value={demoSize}
                    handleChange={setDemoSize}
                    label="Stage Size"
                  />
                )}
              </div>
            </div>
          </header>

          {!showAllTemplates && (
            <TemplateView
              id={patternId}
              templateId={templateId}
              key={`${patternId}-${templateId}`}
              demoSize={demoSize || defaultDemoSize}
              isVerbose
              isCodeBlockShown
            />
          )}

          {showAllTemplates &&
            templates.map(template => (
              <div key={template.id}>
                <TemplateView
                  id={patternId}
                  key={template.id}
                  templateId={template.id}
                  demoSize={demoSize || defaultDemoSize}
                  isVerbose={!showAllTemplates}
                />
                <br />
                <hr />
                <br />
              </div>
            ))}

          <hr />

          <CustomSliceCollection
            userCanSave={canEdit}
            handleSave={slices => {
              dispatch(updatePatternSlices(patternId, slices));
            }}
            initialSlices={pattern.slices}
          />

          {/* {dosAndDonts.map(item => ( */}
          {/* <DosAndDonts */}
          {/* key={JSON.stringify(item)} */}
          {/* title={item.title} */}
          {/* description={item.description} */}
          {/* items={item.items} */}
          {/* /> */}
          {/* ))} */}
        </section>
      </PageWithSidebar>
    </ErrorCatcher>
  );
};

PatternViewPage.propTypes = {
  patternId: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
};

export default PatternViewPage;
