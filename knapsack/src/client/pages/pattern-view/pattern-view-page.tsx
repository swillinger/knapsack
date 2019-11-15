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
import { Button, Select, PatternStatusIcon } from '@knapsack/design-system';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from '../../store';
import ErrorCatcher from '../../utils/error-catcher';
// import DosAndDonts from '../../components/dos-and-donts';
import { BASE_PATHS } from '../../../lib/constants';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import TemplateView from './template-view';
import './pattern-view-page.scss';
import './shared/demo-grid-controls.scss';
import { CustomSliceCollection } from '../custom-page/custom-slice-collection';

type Props = {
  patternId: string;
  templateId: string;
};

const PatternViewPage: React.FC<Props> = ({ patternId, templateId }: Props) => {
  const history = useHistory();
  const permissions = useSelector(store => store.userState.role.permissions);
  const pattern = useSelector(store => {
    const thePattern = store.patternsState.patterns[patternId];
    if (!thePattern) {
      throw new Error(
        `The pattern id ${patternId} cannont be found in Redux Store`,
      );
    }
    return thePattern;
  });

  const showAllTemplates = templateId === 'all';

  const {
    title,
    description,
    templates,
    type,
    demoSize: defaultDemoSize,
  } = pattern;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [demoSize, setDemoSize] = useState<string>(defaultDemoSize);

  let hasSchema = false;
  if (showAllTemplates) {
    hasSchema = !!(
      showAllTemplates &&
      !!templates.find(
        t =>
          t.spec &&
          t.spec.props &&
          t.spec.props.properties &&
          Object.keys(t.spec.props.properties).length > 0,
      )
    );
  } else {
    const currentlySelectedTemplate = templates.find(t => t.id === templateId);

    hasSchema = !!(
      currentlySelectedTemplate.spec &&
      currentlySelectedTemplate.spec.props &&
      currentlySelectedTemplate.spec.props.properties &&
      Object.keys(currentlySelectedTemplate.spec.props.properties).length > 0
    );
  }

  return (
    <ErrorCatcher>
      <PageWithSidebar isFullScreen={isFullScreen}>
        <section className="pattern-view-page">
          <header className="pattern-view-page__header">
            <div>
              <h4 className="eyebrow" style={{ textTransform: 'capitalize' }}>
                {type}
              </h4>
              <h2 style={{ marginBottom: '0' }}>{title}</h2>
              <p style={{ marginTop: '1rem' }}>{description}</p>
            </div>
            <div>
              <div className="pattern-view-demo-grid-controls">
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
              <div className="pattern-view-demo-grid-controls">
                <Button
                  type="button"
                  size="s"
                  onClick={() =>
                    setIsFullScreen(prevIsFullScreen => !prevIsFullScreen)
                  }
                >
                  {isFullScreen ? 'Show Controls' : 'Fullscreen'}
                </Button>
              </div>
              <div className="pattern-view-demo-grid-controls">
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

          <CustomSliceCollection
            userCanSave
            handleSave={() => {}}
            initialSlices={[]}
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
