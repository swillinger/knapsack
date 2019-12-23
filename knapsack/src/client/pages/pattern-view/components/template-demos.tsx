import React, { useContext } from 'react';
import cn from 'classnames';
import shortid from 'shortid';
import { Icon, KsButton, KsPopover } from '@knapsack/design-system';
import { useHistory } from 'react-router-dom';
import { CurrentTemplateContext } from '../current-template-context';
import './template-demos.scss';
import {
  removeTemplateDemo,
  useDispatch,
  addTemplateDataDemo,
  addTemplateTemplateDemo,
} from '../../../store';
import { BASE_PATHS } from '../../../../lib/constants';
import { TemplateThumbnail } from '../../../components/template-thumbnail';
import { EditTemplateDemo } from './edit-template-demo';
import { isTemplateDemo } from '../../../../schemas/patterns';

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
    isLocalDev,
    setDemo,
  } = useContext(CurrentTemplateContext);
  const dispatch = useDispatch();
  const history = useHistory();

  const demoWidth =
    pattern.demoWidths && pattern.demoWidths.length > 0
      ? pattern.demoWidths[0].width
      : 400;

  const patternWidth = Array.isArray(pattern.demoWidths)
    ? pattern.demoWidths[0]?.width
    : undefined;

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
                <KsPopover
                  isHoverTriggered
                  content={
                    <p style={{ maxWidth: '200px' }}>{aDemo.description}</p>
                  }
                >
                  <Icon symbol="info" size="s" />
                </KsPopover>
              )}
              {isLocalDev && isTemplateDemo(aDemo) && (
                <KsPopover
                  content={
                    <EditTemplateDemo
                      data={{
                        path: aDemo?.templateInfo?.path,
                        alias: aDemo?.templateInfo?.alias,
                      }}
                      maxWidth={360}
                      handleSubmit={({ path, alias }) => {
                        dispatch(
                          addTemplateTemplateDemo({
                            alias,
                            path,
                            patternId,
                            templateId,
                          }),
                        );
                        // toggleOpen();
                      }}
                    />
                  }
                  trigger="click"
                >
                  <KsButton
                    kind="icon"
                    // emphasis="danger"
                    icon="edit"
                    size="s"
                    flush
                  >
                    Edit
                  </KsButton>
                </KsPopover>
              )}
              {canEdit && (
                <KsButton
                  kind="icon"
                  emphasis="danger"
                  icon="delete"
                  size="s"
                  flush
                  onClick={() => {
                    dispatch(
                      removeTemplateDemo({
                        patternId,
                        templateId,
                        demoId: aDemo.id,
                      }),
                    );
                    const isRemovedDemoCurrent = aDemo.id === demo.id;
                    if (isRemovedDemoCurrent) {
                      const [aFirstDemo] = demos.filter(d => d.id !== aDemo.id);
                      history.push(
                        `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aFirstDemo.id}`,
                      );
                      setDemo(aFirstDemo);
                    }
                  }}
                >
                  Delete Demo
                </KsButton>
              )}
            </div>
            <div className="ks-template-demos__item__thumbnail-wrap">
              <TemplateThumbnail
                patternId={patternId}
                patternWidth={patternWidth}
                templateId={templateId}
                assetSetId={assetSetId}
                demo={aDemo}
                handleSelection={() => {
                  history.push(
                    `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aDemo.id}`,
                  );
                  setDemo(aDemo);
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
          <KsPopover
            content={
              <EditTemplateDemo
                maxWidth={360}
                handleSubmit={({ path, alias }) => {
                  dispatch(
                    addTemplateTemplateDemo({
                      alias,
                      path,
                      patternId,
                      templateId,
                    }),
                  );
                  // @todo close
                }}
              />
            }
            trigger="click"
          >
            <KsButton kind="standard" icon="add" size="s">
              Template Demo
            </KsButton>
          </KsPopover>

          <KsButton
            size="s"
            kind="standard"
            icon="add"
            onClick={() => {
              const demoId = shortid.generate();
              dispatch(
                addTemplateDataDemo({
                  patternId,
                  templateId,
                  demoId,
                }),
              );
              setTimeout(() => {
                history.push(
                  `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${demoId}`,
                );
              }, 100);
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
