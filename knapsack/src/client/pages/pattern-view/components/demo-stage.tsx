import React, { useContext } from 'react';
import cn from 'classnames';
import {
  KsButton,
  useValueDebounce,
  SchemaForm,
} from '@knapsack/design-system';
import Template, { Props as TemplateProps } from '../../../components/template';
import { FunctionField } from '../../../components/function-field';
import { CurrentTemplateContext } from '../current-template-context';
import {
  isDataDemo,
  isTemplateDemo,
  KnapsackTemplateData,
} from '../../../../schemas/patterns';
import { InlineEditText } from '../../../components/inline-edit';
import { updateTemplateDemo, useDispatch } from '../../../store';
import { KsSlotsForm } from './slots-form';
import './demo-stage.scss';
import ErrorCatcher from '../../../utils/error-catcher';

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
  handleDemoReset: () => void;
  codeBlock?: React.ReactNode;
};

export const KsDemoStage: React.FC<Props> = ({
  demoSize,
  isFormVisible = true,
  setTemplateInfo,
  handlePropsChange,
  handleSlotsChange,
  handleDemoReset,
  codeBlock,
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
  const [props, setProps] = useValueDebounce(
    isDataDemo(demo) ? demo?.data?.props ?? {} : {},
    handlePropsChange,
  );

  const hasSlots = Object.keys(spec?.slots || {}).length > 0;

  const classes = cn(
    'ks-demo-stage',
    (isFormVisible ? demoSize : 'full') === 'full' ? 'ks-demo-stage--full' : '',
    (demos && demos.length > 1) || canEdit ? 'ks-demo-stage--has-demos' : '',
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
      {isTemplateDemo(demo) && codeBlock && (
        <div
          className="ks-demo-stage__form"
          style={{
            width: calculateSchemaFormWidth(demoSize),
          }}
        >
          {codeBlock}
        </div>
      )}
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
            <div className="ks-demo-stage__form__content">
              <ErrorCatcher>
                <h4>Props</h4>
                <SchemaForm
                  schema={spec.props}
                  formData={props}
                  onChange={({ formData }) => {
                    setProps(formData);
                    // handlePropsChange(formData);
                  }}
                  customFields={{ FunctionField }}
                />
              </ErrorCatcher>

              {hasSlots && (
                <ErrorCatcher>
                  <h4>Slots</h4>
                  <KsSlotsForm
                    slotsData={demo.data.slots}
                    slotsSpec={spec.slots}
                    templateLanguageId={template.templateLanguageId}
                    handleData={slotsData => {
                      handleSlotsChange(slotsData);
                    }}
                  />
                </ErrorCatcher>
              )}
            </div>
            <footer className="ks-demo-stage__footer ks-u-margin-top--m">
              <KsButton
                size="s"
                handleTrigger={handleDemoReset}
                emphasis="danger"
              >
                Reset Demo
              </KsButton>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
