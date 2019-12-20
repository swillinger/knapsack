import React, { useContext } from 'react';
import cn from 'classnames';
import { KsButton, SchemaForm } from '@knapsack/design-system';
import Template, { Props as TemplateProps } from '../../../components/template';
import { CurrentTemplateContext } from '../current-template-context';
import { isDataDemo, KnapsackTemplateData } from '../../../../schemas/patterns';
import { InlineEditText } from '../../../components/inline-edit';
import { updateTemplateDemo, useDispatch } from '../../../store';
import { Tabs } from '../../../components/tabs';
import { KsSlotsForm } from './slots-form';
import './demo-stage.scss';

const calculateDemoStageWidth = (size: string) => {
  switch (size) {
    case 's':
      return '33%';
    case 'm':
      return '50%';
    case 'l':
      return '67%';
    default:
      return '100%';
  }
};

const calculateSchemaFormWidth = (size: string) => {
  switch (size) {
    case 's':
      return '67%';
    case 'm':
      return '50%';
    case 'l':
      return '33%';
    default:
      return '100%';
  }
};

type Props = {
  /**
   * @todo remove `string` - it's just to make Typescript happy
   */
  demoSize?: 's' | 'm' | 'l' | 'full' | string;
  isFormVisible?: boolean;
  setTemplateInfo: TemplateProps['handleTemplateInfo'];
  handlePropsChange: (props: {}) => void;
  handleSlotsChange: (slotsData: KnapsackTemplateData['slots']) => void;
};

export const KsDemoStage: React.FC<Props> = ({
  demoSize = 'm',
  isFormVisible = true,
  setTemplateInfo,
  handlePropsChange,
  handleSlotsChange,
}: Props) => {
  const {
    templateInfo,
    template,
    hasSchema,
    spec,
    demo,
    patternId,
    templateId,
    assetSetId,
    demos,
    canEdit,
  } = useContext(CurrentTemplateContext);
  const dispatch = useDispatch();

  const classes = cn(
    'ks-demo-stage',
    'ks-template-view__demo-editor',
    (isFormVisible ? demoSize : 'full') === 'full'
      ? 'ks-template-view__demo-editor--full'
      : '',
    (demos && demos.length > 1) || canEdit
      ? 'ks-template-view__demo-editor--has-demos'
      : '',
  );
  return (
    <div className={classes}>
      <div
        className="ks-demo-stage__stage"
        style={{
          width: calculateDemoStageWidth(isFormVisible ? demoSize : 'full'),
        }}
      >
        <span className="ks-demo-stage__stage__open-btn">
          <KsButton
            kind="icon"
            icon="external-link"
            flush
            onClick={() => {
              if (templateInfo?.url) {
                window.open(templateInfo.url, '_blank');
              }
            }}
          >
            Open in New Window
          </KsButton>
        </span>
        <Template
          patternId={patternId}
          templateId={templateId}
          assetSetId={assetSetId}
          demo={demo}
          isResizable
          handleTemplateInfo={setTemplateInfo}
        />
      </div>
      {hasSchema && isFormVisible && isDataDemo(demo) && (
        <div
          className="ks-demo-stage__form"
          style={{
            width: calculateSchemaFormWidth(demoSize),
          }}
        >
          <div className="ks-demo-stage__form__inner">
            <header className="ks-demo-stage__form__header">
              <div className="ks-demo-stage__form__header__title">
                <h3>
                  <InlineEditText
                    text={demo.title}
                    isHeading
                    handleSave={text => {
                      dispatch(
                        updateTemplateDemo({
                          patternId,
                          templateId,
                          demo: {
                            ...demo,
                            title: text,
                          },
                        }),
                      );
                    }}
                  />
                </h3>
              </div>
              <p>
                <InlineEditText
                  text={demo.description}
                  handleSave={text => {
                    dispatch(
                      updateTemplateDemo({
                        patternId,
                        templateId,
                        demo: {
                          ...demo,
                          description: text,
                        },
                      }),
                    );
                  }}
                />
              </p>
            </header>
            <Tabs
              panes={[
                {
                  menuItem: 'Props',
                  render: () => {
                    return (
                      <>
                        <SchemaForm
                          schema={spec.props}
                          formData={demo.data.props}
                          onChange={({ formData }) => {
                            handlePropsChange(formData);
                          }}
                        />
                      </>
                    );
                  },
                },
                spec.slots
                  ? {
                      menuItem: 'Slots',
                      render: () => {
                        if (!isDataDemo(demo)) return;
                        return (
                          <KsSlotsForm
                            slotsData={demo.data.slots}
                            slotsSpec={spec.slots}
                            templateLanguageId={template.templateLanguageId}
                            handleData={slotsData => {
                              handleSlotsChange(slotsData);
                            }}
                          />
                        );
                      },
                    }
                  : null,
              ].filter(Boolean)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
