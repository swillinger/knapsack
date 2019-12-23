import React from 'react';
import cn from 'classnames';
import { Select } from '@knapsack/design-system';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch, setCurrentTemplateRenderer } from '../store';
import { BASE_PATHS } from '../../lib/constants';

export const KsTemplateLanguageSelect: React.FC = () => {
  const dispatch = useDispatch();
  const renderers = useSelector(s => s.patternsState.renderers);
  const patterns = useSelector(s => s.patternsState.patterns);
  const currentTemplateRenderer =
    useSelector(s => s.ui.currentTemplateRenderer) ??
    Object.keys(renderers ?? {})[0];
  const history = useHistory();
  const { pathname } = useLocation();
  if (!renderers || Object.keys(renderers ?? {}).length < 2) return null;

  const classes = cn({
    'ks-template-language-select': true,
  });
  return (
    <div className={classes}>
      <Select
        value={currentTemplateRenderer}
        items={Object.values(renderers).map(({ meta }) => {
          return {
            title: meta.title,
            value: meta.id,
          };
        })}
        handleChange={id => {
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
