import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { KsSelect, SelectOptionProps, KsSvg } from '@knapsack/design-system';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch, setCurrentTemplateRenderer } from '../store';
import { TemplateRendererMeta } from '../../schemas/knapsack-config';
import { BASE_PATHS } from '../../lib/constants';
import './template-language-select.scss';

export const KsTemplateLanguageSelect: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { pathname } = useLocation();
  const patterns = useSelector(s => s.patternsState.patterns);
  const renderersRaw = useSelector(s => s.patternsState.renderers);
  const currentTemplateRenderer = useSelector(
    s => s.ui.currentTemplateRenderer,
  );

  const renderers = Object.values(renderersRaw).map(r => {
    return {
      ...r,
      label: r.meta.title,
      value: r.meta.id,
    };
  });

  const initialRenderer = currentTemplateRenderer
    ? renderers.find(r => r.meta.id === currentTemplateRenderer)
    : renderers[0];

  const [selectedRenderer, setSelectedRenderer] = useState<SelectOptionProps>(
    initialRenderer,
  );

  useEffect(() => {
    setSelectedRenderer(
      renderers.find(r => r.meta.id === currentTemplateRenderer),
    );
  }, [currentTemplateRenderer]);

  if (!renderers || renderers.length < 2) return null;

  const classes = cn({
    'ks-template-language-select': true,
  });

  return (
    <div className={classes}>
      <KsSelect
        value={selectedRenderer}
        options={renderers.map(r => ({
          ...r,
          icon: <KsSvg svg={r.meta.iconSvg} />,
        }))}
        handleChange={option => {
          const id = option.value;

          setSelectedRenderer(option);
          dispatch(setCurrentTemplateRenderer({ id }));

          if (pathname?.startsWith(`${BASE_PATHS.PATTERN}/`)) {
            const [_, base, patternId, templateId, demoId] = pathname.split(
              '/',
            );
            const newTemplateId =
              patterns[patternId]?.templates?.find(
                t => t.templateLanguageId === id,
              )?.id ?? '';
            const url = `${BASE_PATHS.PATTERN}/${patternId}/${newTemplateId}`;
            history.push(url);
          }
        }}
      />
    </div>
  );
};
