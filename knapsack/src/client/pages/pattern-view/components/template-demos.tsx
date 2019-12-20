import React, { useContext } from 'react';
import cn from 'classnames';
import { Icon, KsButton } from '@knapsack/design-system';
import { CurrentTemplateContext } from '../current-template-context';
import './template-demos.scss';
import { removeTemplateDemo } from '../../../store';
import { BASE_PATHS } from '../../../../lib/constants';
import { TemplateThumbnail } from '../../../components/template-thumbnail';
import { AddTemplateDemo } from './add-template-demo';

type Props = {};

// eslint-disable-next-line no-empty-pattern
export const KsTemplateDemos: React.FC<Props> = ({}: Props) => {
  const {
    pattern,
    demos,
    demo,
    assetSetId,
    patternId,
    templateId,
    canEdit,
  } = useContext(CurrentTemplateContext);

  const demoWidth =
    pattern.demoWidths && pattern.demoWidths.length > 0
      ? pattern.demoWidths[0].width
      : 400;

  const classes = cn({
    'ks-template-demos': true,
  });
  return (
    <nav className={classes}>
      <div className="ks-template-demos__items">
        {demos.map((aDemo, i) => (
          <figure
            key={aDemo.id}
            className={cn('ks-template-demos__item', {
              'ks-template-demos__item--active': demo.id === aDemo.id,
            })}
          >
            <div className="ks-template-demos__item__actions">
              {aDemo.description && (
                <span title={aDemo.description}>
                  <Icon symbol="info" size="s" />
                </span>
              )}
              {canEdit && (
                <KsButton
                  kind="icon"
                  emphasis="danger"
                  icon="delete"
                  size="s"
                  flush
                  onClick={() => {
                    // @todo re-enable
                    // dispatch(
                    //   removeTemplateDemo({
                    //     patternId,
                    //     templateId,
                    //     demoId: aDemo.id,
                    //   }),
                    // );
                    // const isRemovedDemoCurrent = aDemo.id === demo.id;
                    // if (isRemovedDemoCurrent) {
                    //   const [aFirstDemo] = demos.filter(d => d.id !== aDemo.id);
                    //   history.push(
                    //     `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aFirstDemo.id}`,
                    //   );
                    //   setDemo(aFirstDemo);
                    // }
                  }}
                >
                  Delete Demo
                </KsButton>
              )}
            </div>
            <div className="ks-template-demos__item__thumbnail-wrap">
              <TemplateThumbnail
                patternId={patternId}
                templateId={templateId}
                assetSetId={assetSetId}
                demo={aDemo}
                handleSelection={() => {
                  // @todo re-enable
                  // history.push(
                  //   `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aDemo.id}`,
                  // );
                  // setDemo(aDemo);
                }}
              />
            </div>
            <figcaption>{aDemo.title}</figcaption>
          </figure>
        ))}
        <div
          className="ks-template-demos__item ks-template-demos__item--btns"
          style={
            {
              // width: '200px',
              // display: 'flex',
              // flexDirection: 'column',
              // alignItems: 'center',
            }
          }
        >
          <AddTemplateDemo />
          <KsButton
            size="s"
            kind="standard"
            icon="add"
            onClick={() => {
              // @todo re-enable
              // dispatch(
              //   addTemplateDataDemo({
              //     patternId,
              //     templateId,
              //   }),
              // );
              // @todo go to it after
            }}
          >
            Data Demo
          </KsButton>
          {/* <KsButton */}
          {/*  kind="standard" */}
          {/*  size="m" */}
          {/*  handleTrigger={() => { */}
          {/*    // */}
          {/*  }} */}
          {/* > */}
          {/*  <Icon symbol="add" /> */}
          {/*  <br /> */}
          {/*  Data Demo */}
          {/* </KsButton> */}
        </div>
      </div>
    </nav>
  );
};
