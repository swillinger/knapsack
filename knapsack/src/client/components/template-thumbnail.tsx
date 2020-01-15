import React from 'react';
import Template, { Props as TemplateProps } from './template';
import { useSelector } from '../store';
import './template-thumbnail.scss';

type Props = Partial<Omit<TemplateProps, 'isResizable'>> & {
  handleSelection?: () => void;
  /**
   * The width in pixels that the pattern prefers to be demoed at; a button might be 150, a card 450, and a hero 1100
   */
  patternWidth?: number;
  patternId: string;
  /** Width and height of thumbnail. Defaults to 120. */
  thumbnailSize?: number;
};

/**
 * Shows a small thumbnail of a single pattern's template. Can just pass in `patternId` and sensible defaults are chosen or be specific and pass in all the same props as `<Template />`
 * @example <TemplateThumbnail patternId="card" />
 */
export const TemplateThumbnail: React.FC<Props> = ({
  handleSelection = () => {},
  patternWidth,
  templateId,
  thumbnailSize = 120,
  ...rest
}: Props) => {
  const pattern = useSelector(s => s.patternsState.patterns[rest.patternId]);
  const { currentTemplateRenderer } = useSelector(s => s.ui);
  const [firstTemplate] = pattern?.templates;
  const template =
    pattern?.templates?.find(t =>
      templateId
        ? t.id === templateId
        : t.templateLanguageId === currentTemplateRenderer,
    ) ?? firstTemplate;
  if (!template) return null;
  const demo = rest.demo ?? template?.demosById[template?.demos[0]];
  const centeringTranslate = 'translate(-50%, -50%)';

  const width =
    patternWidth ??
    (Array.isArray(pattern.demoWidths) && pattern.demoWidths.length > 0)
      ? pattern?.demoWidths[0]?.width
      : 400;

  return (
    <div
      className="ks-template-thumbnail"
      style={{ width: `${thumbnailSize}px`, height: `${thumbnailSize}px` }}
    >
      <div
        className="ks-template-thumbnail__template"
        style={{
          width: `${width}px`,
          transform:
            thumbnailSize / width < 1
              ? `${centeringTranslate} scale(${thumbnailSize / width})`
              : centeringTranslate,
        }}
      >
        <Template
          {...rest}
          templateId={template.id}
          demo={demo}
          isResizable={false}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="ks-template-thumbnail__overlay"
        onKeyPress={() => handleSelection()}
        onClick={() => handleSelection()}
      />
    </div>
  );
};
