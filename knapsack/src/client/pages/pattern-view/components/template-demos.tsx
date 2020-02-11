import React, { useContext, useRef } from 'react';
import cn from 'classnames';
import shortid from 'shortid';
import {
  Icon,
  KsButton,
  KsPopover,
  KsDeleteButton,
} from '@knapsack/design-system';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import { useHistory } from 'react-router-dom';
import arrayMove from 'array-move';
import { CurrentTemplateContext } from '../current-template-context';
import './template-demos.scss';
import {
  removeTemplateDemo,
  useDispatch,
  addTemplateDataDemo,
  addTemplateTemplateDemo,
  updateTemplateDemo,
  duplicateDemo,
  updateTemplateInfo,
} from '../../../store';
import { BASE_PATHS } from '../../../../lib/constants';
import { TemplateThumbnail } from '../../../components/template-thumbnail';
import { EditTemplateDemo } from './edit-template-demo';
import {
  isTemplateDemo,
  KnapsackTemplateDemo,
} from '../../../../schemas/patterns';
import { useKsDragDrop } from '../../../hooks';

type Props = {
  index: number;
  demo: KnapsackTemplateDemo;
};

const DRAG_TYPE = 'demo';
interface DragItem {
  index: number;
  type: typeof DRAG_TYPE;
}

const KsTemplateDemo: React.FC<Props> = ({ index, demo }: Props) => {
  const {
    demos,
    demo: activeDemo,
    assetSetId,
    patternId,
    templateId,
    canEdit,
    isLocalDev,
    template,
  } = useContext(CurrentTemplateContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const ref = useRef<HTMLDivElement>(null);
  const { isDragging } = useKsDragDrop({
    dragTypeId: DRAG_TYPE,
    index,
    ref,
    handleDrop: ({ dragIndex }) => {
      dispatch(
        updateTemplateInfo({
          patternId,
          templateId,
          template: {
            demos: arrayMove(template.demos, dragIndex, index),
          },
        }),
      );
    },
  });

  const opacity = isDragging ? 0 : 1;

  return (
    <figure
      ref={ref}
      className={cn('ks-template-demos__item', {
        'ks-template-demos__item--active': activeDemo.id === demo.id,
      })}
      style={{ opacity }}
    >
      <div className="ks-template-demos__item__actions">
        {demo.description && (
          <KsPopover
            trigger="hover"
            content={
              <p
                style={{
                  maxWidth: '200px',
                }}
              >
                {demo.description}
              </p>
            }
          >
            <Icon symbol="info" size="s" />
          </KsPopover>
        )}
        {isLocalDev && isTemplateDemo(demo) && (
          <KsPopover
            content={
              <EditTemplateDemo
                data={{
                  title: demo?.title,
                  description: demo?.description ?? '',
                  path: demo?.templateInfo?.path,
                  alias: demo?.templateInfo?.alias,
                }}
                maxWidth={360}
                handleSubmit={({ path, alias, title, description }) => {
                  dispatch(
                    updateTemplateDemo({
                      patternId,
                      templateId,
                      demo: {
                        ...demo,
                        title,
                        description,
                        templateInfo: {
                          ...demo.templateInfo,
                          path,
                          alias,
                        },
                      },
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
          <KsPopover content={<p>Duplicate</p>} trigger="hover">
            <KsButton
              size="s"
              kind="icon"
              icon="duplicate"
              flush
              onClick={() => {
                const newDemoId = shortid.generate();
                dispatch(
                  duplicateDemo({
                    patternId,
                    templateId,
                    demoId: demo.id,
                    newDemoId,
                  }),
                );
                setTimeout(() => {
                  history.push(
                    `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${newDemoId}`,
                  );
                }, 250);
              }}
            >
              Duplicate Demo
            </KsButton>
          </KsPopover>
        )}
        {canEdit && (
          <KsDeleteButton
            confirmationMessage="Are you sure you want to delete this pattern demo?"
            size="s"
            flush
            handleTrigger={() => {
              dispatch(
                removeTemplateDemo({
                  patternId,
                  templateId,
                  demoId: demo.id,
                }),
              );
              const isRemovedDemoCurrent = activeDemo.id === demo.id;
              if (isRemovedDemoCurrent) {
                const [aFirstDemo] = demos.filter(d => d.id !== demo.id);
                history.push(
                  `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${aFirstDemo.id}`,
                );
              }
            }}
          />
        )}
      </div>
      <div className="ks-template-demos__item__thumbnail-wrap">
        <TemplateThumbnail
          patternId={patternId}
          templateId={templateId}
          assetSetId={assetSetId}
          demo={demo}
          handleSelection={() => {
            history.push(
              `${BASE_PATHS.PATTERN}/${patternId}/${templateId}/${demo.id}`,
            );
          }}
        />
      </div>
      <figcaption>{demo.title}</figcaption>
    </figure>
  );
};

export const KsTemplateDemos: React.FC = () => {
  const { demos, patternId, templateId, isLocalDev } = useContext(
    CurrentTemplateContext,
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = cn({
    'ks-template-demos': true,
  });
  return (
    <nav className={classes}>
      <div className="ks-template-demos__items">
        {demos.map((demo, i) => (
          <KsTemplateDemo index={i} demo={demo} key={demo.id} />
        ))}
        <div className="ks-template-demos__item ks-template-demos__item--btns">
          {isLocalDev && (
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
          )}

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
        </div>
      </div>
    </nav>
  );
};
