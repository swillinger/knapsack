import React from 'react';
import { KsButton, KsTextField, Select } from '@knapsack/design-system';
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
  KnapsackPatternTemplate,
  KnapsackTemplateData,
} from '../../../../schemas/patterns';
import { useSelector } from '../../../store';
import slotsDataSchema from '../../../../json-schemas/schemaKnapsackTemplateDataSlots';

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
    return Object.values(patternsState.patterns).map(
      ({ id, title, templates }) => ({
        id,
        title,
        value: id, // for <select>s
        // only can include other templates that are the same language as this one. PS asset sets not accounted for
        templates: templates
          .filter(t => t.templateLanguageId === templateLanguageId)
          .map(t => ({
            id: t.id,
            value: t.id,
            title: t.title,
            demos: t.demos.map(demoId => {
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

  return (
    <div className={classes}>
      <h4>Slots Form</h4>
      <Formik
        initialValues={slotsData}
        onSubmit={({ values, actions }) => {
          console.log('formik submit', { values, actions });
          // handleData(values);
        }}
        validateOnChange
        validate={values => {
          const errors = {};
          Object.keys(values).forEach(value => {
            const slotDatas = values[value];
            slotDatas.forEach(slotData => {
              const results = validateDataAgainstSchema(
                slotsDataSchema,
                slotData,
              );
              if (!results.ok) {
                console.log(results, values);
                errors[value] = results.message;
              }
            });
          });
          return errors;
        }}
      >
        {({
          values,
          setFieldValue,
          handleChange,
          isValid,
          errors,
          submitForm,
        }) => {
          // console.log('isValid?', isValid);
          // console.log(values);
          if (isValid) {
            console.log('form sending data up');
            handleData(values);
          } else {
            console.log('not valid', errors, values);
          }
          return (
            <Form>
              {Object.keys(slotsSpec).map(slotName => {
                const slotDef = slotsSpec[slotName];
                const { allowedPatternIds, disallowText } = slotDef;
                return (
                  <div key={slotName} className="ks-slots-form__slot">
                    <h5 title={`${slotDef.title} - ${slotDef.description}`}>
                      <code>{slotName}</code>
                    </h5>
                    <FieldArray name={slotName}>
                      {arrayHelpers => {
                        const slottedDatas = values[slotName];
                        const addButtons = (
                          <div className="ks-slots-form__add-buttons">
                            <button
                              onClick={() =>
                                arrayHelpers.push({
                                  patternId: '',
                                  templateId: '',
                                  demoId: '',
                                })
                              } // remove a friend from the list
                              // onKeyPress={() => arrayHelpers.insert(index)} // remove a friend from the list
                            >
                              Add Pattern Demo
                            </button>
                            <button
                              onClick={() => arrayHelpers.push('Text')} // remove a friend from the list
                              // onKeyPress={() => arrayHelpers.insert(index)} // remove a friend from the list
                            >
                              Add Text
                            </button>
                          </div>
                        );
                        if (!slottedDatas) {
                          return addButtons;
                        }
                        const allowedPatterns = Array.isArray(allowedPatternIds)
                          ? patternList.filter(({ id }) =>
                              allowedPatternIds.includes(id),
                            )
                          : patternList;
                        return (
                          <div>
                            {addButtons}
                            {slottedDatas.map((slottedData, index) => {
                              // const key = JSON.stringify(slottedData);
                              const key = index;
                              const controls = (
                                <div>
                                  {index !== 0 && (
                                    <button
                                      onClick={() =>
                                        arrayHelpers.move(index, index - 1)
                                      } // remove a friend from the list
                                    >
                                      Up
                                    </button>
                                  )}
                                  {index !== slottedDatas.length - 1 && (
                                    <button
                                      onClick={() =>
                                        arrayHelpers.move(index, index + 1)
                                      } // remove a friend from the list
                                    >
                                      Down
                                    </button>
                                  )}
                                  <KsButton
                                    icon="delete"
                                    kind="icon"
                                    size="s"
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                    onKeyPress={() =>
                                      arrayHelpers.remove(index)
                                    } // remove a friend from the list
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
                                    <div className="ks-text-field">
                                      <label className="ks-text-field__label">
                                        <span>Text</span>
                                        <Field
                                          className="ks-text-field__input"
                                          name={`${slotName}.${index}`}
                                          type="text"
                                          validate={validateSimpleString}
                                        />
                                      </label>
                                    </div>
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
                                        handleChange={newValue => {
                                          setFieldValue(
                                            `${slotName}.${index}`,
                                            {
                                              patternId: newValue,
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
                                        handleChange={newValue => {
                                          setFieldValue(
                                            `${slotName}.${index}`,
                                            {
                                              patternId,
                                              templateId: newValue,
                                            },
                                          );
                                        }}
                                        items={[
                                          { value: '', title: '' },
                                          ...templateItems,
                                        ]}
                                      />
                                    )}
                                  </Field>
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
                                          { value: '', title: '' },
                                          ...demoItems,
                                        ]}
                                      />
                                    )}
                                  </Field>
                                </div>
                              );
                            })}
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
