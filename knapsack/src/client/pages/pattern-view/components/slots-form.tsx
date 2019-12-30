import React from 'react';
import {
  KsButton,
  KsButtonGroup,
  KsTextField,
  Select,
  Icon,
} from '@knapsack/design-system';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import {
  Formik,
  Form,
  FieldArray,
  Field,
  ArrayHelpers,
  FieldInputProps,
  FieldProps,
} from 'formik';
import { validateDataAgainstSchema } from '@knapsack/schema-utils';
import './slots-form.scss';
import {
  isSlottedTemplateDemo,
  isSlottedText,
  KnapsackPatternTemplate,
  KnapsackTemplateData,
} from '../../../../schemas/patterns';
import { useSelector } from '../../../store';
import { BASE_PATHS } from '../../../../lib/constants';
// import slotsDataSchema from '../../../../json-schemas/schemaKnapsackTemplateDataSlots';

type Props = {
  slotsData?: KnapsackTemplateData['slots'];
  slotsSpec: KnapsackPatternTemplate['spec']['slots'];
  handleData?: (slotsData: KnapsackTemplateData['slots']) => void;
  templateLanguageId: string;
};

const validateSimpleString = value => {
  if (typeof value === 'string' && value.length === 0) {
    return 'Cannot be empty';
  }
};

export const KsSlotsForm: React.FC<Props> = ({
  slotsSpec,
  slotsData = {},
  handleData = () => {},
  templateLanguageId,
}: Props) => {
  const patternList = useSelector(({ patternsState }) => {
    return Object.values(patternsState.patterns || {}).map(
      ({ id, title, templates }) => ({
        id,
        title,
        value: id, // for <select>s
        // only can include other templates that are the same language as this one. PS asset sets not accounted for
        templates: templates
          .filter(t => t.templateLanguageId === templateLanguageId)
          ?.map(t => ({
            id: t.id,
            value: t.id,
            title: t.title,
            demos: t.demos?.map(demoId => {
              const demo = t.demosById[demoId];
              return {
                id: demoId,
                value: demoId,
                title: demo.title,
              };
            }),
          })),
      }),
    );
  });
  if (!slotsSpec) return null;

  const classes = cn({
    'k-slots-form': true,
  });

  const validateForm = values => {
    const errors = {};
    Object.keys(values).forEach(value => {
      const slotDatas = values[value];
      slotDatas.forEach((slotData, i) => {
        if (isSlottedText(slotData)) {
          if (!slotData) {
            errors[value + i] = 'Need non-empty strings';
          }
        }
        if (isSlottedTemplateDemo(slotData)) {
          const { patternId, templateId, demoId } = slotData;
          if (!patternId || !templateId || !demoId) {
            errors[value + i] = 'Need more info';
          }
        }
      });
    });

    return errors;
  };

  const checkAndHandleData = (data: KnapsackTemplateData['slots']): void => {
    const errors = validateForm(data);
    if (Object.keys(errors).length === 0) {
      handleData(data);
    }
  };

  return (
    <div className={classes}>
      <Formik
        initialValues={slotsData}
        // @todo come up with something better than `key` it's caching the `slotsData` too aggressively; need to trigger a remount when it changes sadly. try using "Reset Demo" to test
        key={JSON.stringify(slotsData)}
        onSubmit={({ values, actions }) => {
          console.log('formik submit', { values, actions });
          // handleData(values);
        }}
        validateOnBlur
        validateOnChange
        validate={validateForm}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          isValid,
          errors,
          submitForm,
          handleSubmit,
          handleReset,
        }) => {
          checkAndHandleData(values);
          return (
            <Form>
              {Object.keys(slotsSpec || {}).map(slotName => {
                const slotDef = slotsSpec[slotName];
                const { allowedPatternIds, disallowText } = slotDef;
                return (
                  <div key={slotName} className="ks-slots-form__slot">
                    <p className="ks-slots-form__slot__slot-name">
                      Slot Name: <code>{slotName}</code>
                    </p>

                    <FieldArray name={slotName}>
                      {arrayHelpers => {
                        const slottedDatas = values[slotName];

                        const allowedPatterns = Array.isArray(allowedPatternIds)
                          ? patternList.filter(({ id }) =>
                              allowedPatternIds.includes(id),
                            )
                          : patternList;

                        const isPatternItemsAllowed =
                          allowedPatterns.length !== 0;
                        const isTextItemsAllowed = !disallowText;

                        const addButtons = (
                          <div className="ks-slots-form__add-buttons">
                            <KsButtonGroup>
                              {isPatternItemsAllowed && (
                                <KsButton
                                  icon="add"
                                  size="s"
                                  // onKeyPress={() => arrayHelpers.insert(index)} // remove a friend from the list
                                  onClick={() =>
                                    arrayHelpers.push({
                                      patternId: '',
                                      templateId: '',
                                      demoId: '',
                                    })
                                  } // remove a friend from the list
                                >
                                  Pattern Demo
                                </KsButton>
                              )}

                              {isTextItemsAllowed && (
                                <KsButton
                                  icon="add"
                                  size="s"
                                  onClick={() => arrayHelpers.push('Text')} // remove a friend from the list
                                  // onKeyPress={() => arrayHelpers.insert(index)} // remove a friend from the list
                                >
                                  Add Text
                                </KsButton>
                              )}
                            </KsButtonGroup>
                          </div>
                        );

                        if (!slottedDatas) {
                          return addButtons;
                        }

                        return (
                          <div>
                            {slottedDatas.map((slottedData, index) => {
                              // const key = JSON.stringify(slottedData);
                              const key = index;

                              const controls = (
                                <div className="ks-slots-form__slot-controls">
                                  {index !== 0 && (
                                    <KsButton
                                      size="s"
                                      onClick={() =>
                                        arrayHelpers.move(index, index - 1)
                                      }
                                    >
                                      Move Up
                                    </KsButton>
                                  )}
                                  {index !== slottedDatas.length - 1 && (
                                    <KsButton
                                      size="s"
                                      onClick={() =>
                                        arrayHelpers.move(index, index + 1)
                                      }
                                    >
                                      Move Down
                                    </KsButton>
                                  )}
                                  <KsButton
                                    icon="delete"
                                    kind="icon"
                                    emphasis="danger"
                                    size="s"
                                    flush
                                    onClick={() => arrayHelpers.remove(index)}
                                    onKeyPress={() =>
                                      arrayHelpers.remove(index)
                                    }
                                  />
                                </div>
                              );

                              if (typeof slottedData === 'string') {
                                return (
                                  <div
                                    key={key}
                                    className="ks-slots-form__slot-item"
                                  >
                                    {controls}
                                    <Field
                                      name={`${slotName}.${index}`}
                                      validate={validateSimpleString}
                                    >
                                      {({ field, form, meta }) => (
                                        <KsTextField
                                          label="Text"
                                          inputProps={field}
                                          error={meta.error}
                                          flush
                                        />
                                      )}
                                    </Field>
                                  </div>
                                );
                              }

                              const {
                                patternId,
                                templateId,
                                demoId,
                              } = slottedData;

                              const templateItems = patternId
                                ? allowedPatterns.find(p => p.id === patternId)
                                    .templates
                                : [];

                              const demoItems =
                                templateId && templateItems
                                  ? templateItems.find(t => t.id === templateId)
                                      .demos
                                  : [];

                              return (
                                <div
                                  key={key}
                                  className="ks-slots-form__slot-item"
                                >
                                  {controls}
                                  <Field
                                    name={`${slotName}.${index}.patternId`}
                                    validate={validateSimpleString}
                                  >
                                    {({
                                      field: { name, value },
                                    }: FieldProps) => (
                                      <Select
                                        label="Pattern"
                                        isLabelInline={false}
                                        value={value}
                                        handleChange={newPatternId => {
                                          const [
                                            firstTemplate,
                                          ] = allowedPatterns.find(
                                            p => p.id === newPatternId,
                                          ).templates;

                                          const [
                                            firstDemo,
                                          ] = firstTemplate.demos;

                                          setFieldValue(
                                            `${slotName}.${index}`,
                                            {
                                              patternId: newPatternId,
                                              templateId: firstTemplate.id,
                                              demoId: firstDemo.id,
                                            },
                                          );
                                        }}
                                        items={[
                                          { value: '', title: '' },
                                          ...allowedPatterns,
                                        ]}
                                      />
                                    )}
                                  </Field>
                                  {templateItems && templateItems.length > 1 && (
                                    <Field
                                      name={`${slotName}.${index}.templateId`}
                                      validate={validateSimpleString}
                                    >
                                      {({
                                        field: { name, value },
                                      }: FieldProps) => (
                                        <Select
                                          label="Template"
                                          isLabelInline={false}
                                          value={value}
                                          handleChange={newTemplateId => {
                                            const [
                                              firstDemo,
                                            ] = allowedPatterns
                                              .find(p => p.id === patternId)
                                              .templates.find(
                                                t => t.id === newTemplateId,
                                              ).demos;

                                            setFieldValue(
                                              `${slotName}.${index}`,
                                              {
                                                patternId,
                                                templateId: newTemplateId,
                                                demoId: firstDemo.id,
                                              },
                                            );
                                          }}
                                          items={[
                                            // { value: '', title: '' },
                                            ...templateItems,
                                          ]}
                                        />
                                      )}
                                    </Field>
                                  )}

                                  {demoItems && demoItems.length > 1 && (
                                    <Field
                                      name={`${slotName}.${index}.demoId`}
                                      validate={validateSimpleString}
                                    >
                                      {({
                                        field: { name, value },
                                      }: FieldProps) => (
                                        <Select
                                          label="Demo"
                                          value={value}
                                          isLabelInline={false}
                                          handleChange={newValue => {
                                            setFieldValue(name, newValue);
                                          }}
                                          items={[
                                            // { value: '', title: '' },
                                            ...demoItems,
                                          ]}
                                        />
                                      )}
                                    </Field>
                                  )}
                                  {patternId && templateId && demoId && (
                                    <span className="ks-slots-form__pattern-link">
                                      <Link
                                        to={`${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${demoId}`}
                                        target="_blank"
                                      >
                                        View Pattern{' '}
                                        <Icon symbol="external-link" size="s" />
                                      </Link>
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {addButtons}
                          </div>
                        );
                      }}
                    </FieldArray>
                  </div>
                );
              })}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
