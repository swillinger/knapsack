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
import cn from 'classnames';
import {
  updatePatternInfo,
  useSelector,
  useDispatch,
  updatePatternSlices,
  addTemplate,
} from '../../store';
import ErrorCatcher from '../../utils/error-catcher';
// import DosAndDonts from '../../components/dos-and-donts';
import { BASE_PATHS } from '../../../lib/constants';
import PageWithSidebar from '../../layouts/page-with-sidebar';
import { KsPatternSettings } from './components/pattern-settings';
import TemplateView from './template-view';
import './pattern-view-page.scss';
import './shared/demo-grid-controls.scss';
import { CustomSliceCollection } from '../custom-page/custom-slice-collection';
import { InlineEditText } from '../../components/inline-edit';
import { getBreadcrumb } from '../../utils';
import { EditTemplateDemo } from './components';

type Props = {
  patternId: string;
  templateId?: string;
  demoId?: string;
};

const PatternViewPage: React.FC<Props> = ({
  patternId,
  templateId,
  demoId,
}: Props) => {
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
  const currentTemplateRenderer = useSelector(
    s => s.ui.currentTemplateRenderer,
  );
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
  const { title, templates, description, demoSize: defaultDemoSize } = pattern;
  const templatesList = templates.filter(
    t => t.templateLanguageId === currentTemplateRenderer,
  );

  const [hasTemplates, setHasTemplates] = useState(templatesList.length > 0);

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

  const classes = cn('ks-pattern-view-page', {
    'ks-pattern-view-page--right-sidebar-open': false,
  });

  return (
    <ErrorCatcher>
      <PageWithSidebar
        slottedDetails={
          <KsPatternSettings pattern={pattern} activeTemplateId={templateId} />
        }
      >
        <section className={classes}>
          <header className="ks-pattern-view-page__header">
            <div className="ks-pattern-view-page__header__info-wrap">
              {breadcrumb.length > 0 && (
                <p className="ks-pattern-view-page__header__info-wrap__breadcrumbs">
                  {breadcrumb.join(' / ')} /
                </p>
              )}
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
              {templatesList.length > 1 && (
                <div>
                  <Select
                    label="Template"
                    value={templateId}
                    items={[
                      {
                        // @todo consider how to show all when we only have 1 template of each language
                        value: 'all',
                        title: 'Show All',
                      },
                      ...templatesList.map(t => ({
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
                </div>
              )}
              {hasSchema && (
                <div>
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
                </div>
              )}
            </div>
          </header>

          {templatesList.length === 0 && (
            <div
              className="ks-u-shade-bg"
              style={{
                padding: 'var(--space-l)',
                borderRadius: 'var(--radius-l)',
              }}
            >
              <h3>Add Template</h3>
              <EditTemplateDemo
                handleSubmit={({ path, alias }) => {
                  dispatch(
                    addTemplate({
                      alias,
                      path,
                      patternId,
                      templateLanguageId: currentTemplateRenderer,
                    }),
                  );
                  // delay a beat so server can be ready to render new template
                  setTimeout(() => setHasTemplates(true), 100);
                }}
              />
            </div>
          )}

          {hasTemplates && templatesList.length > 0 && !showAllTemplates && (
            <TemplateView
              id={patternId}
              templateId={templateId}
              demoId={demoId}
              key={`${patternId}-${templateId}`}
              demoSize={demoSize || defaultDemoSize}
              isVerbose
              isCodeBlockShown
            />
          )}

          {hasTemplates &&
            templatesList.length > 0 &&
            showAllTemplates &&
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

export default PatternViewPage;
