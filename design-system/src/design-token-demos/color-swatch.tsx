import React, { useState } from 'react';
import { KnapsackDesignToken } from '@knapsack/core/dist/types';
import { convertColor, hasOpacity, parseColor } from '@knapsack/utils';
import { KsSelect, SelectOptionProps, KsButton } from '../atoms';
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard';
import './color-swatch.scss';

/**
 * Creates Sketch Palette file format from tokens
 * Requires Sketch Palettes plugin
 * @link https://github.com/andrewfiorillo/sketch-palettes
 */
function tokensToSketchPalettes(tokens: KnapsackDesignToken[]): string {
  return JSON.stringify({
    compatibleVersion: '2.0',
    pluginVersion: '2.14',
    // {
    //   red: 0.035,
    //   green: 0.11800000000000001,
    //   blue: 0.259,
    //   alpha: 0.019999999552965164,
    // },
    colors: tokens.map(({ value }) => {
      const color = convertColor(value, 'rgb');
      const { r, g, b, alpha = 1 } = parseColor(color);
      return {
        red: r / 255,
        green: g / 255,
        blue: b / 255,
        alpha,
      };
    }),
  });
}

type ColorSwatchProps = {
  color: KnapsackDesignToken;
  format: string;
};

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  format,
}: ColorSwatchProps) => {
  const colorValue = convertColor(color.value, format);
  return (
    <div className="ks-color-swatch">
      <div className="ks-color-swatch__swatch-info">
        <h5>{color.name}</h5>
        {color.code && (
          <h6>
            Code: <CopyToClipboard snippet={color.code} />
            <br />
            Value: <CopyToClipboard snippet={colorValue} />
          </h6>
        )}
        {color.comment && (
          <p>
            <small>{color.comment}</small>
          </p>
        )}
      </div>
      <div className="ks-color-swatch__swatch-color-gradient-background">
        <div
          style={{
            backgroundColor: color.value ? color.value : 'auto',
            margin: hasOpacity(color.value) ? '20px' : '0',
            height: `calc(100% - ${hasOpacity(color.value) ? '40px' : '0px'})`,
          }}
        />
      </div>
    </div>
  );
};

type ColorSwatchesProps = {
  tokens: KnapsackDesignToken[];
};

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  tokens = [],
}: ColorSwatchesProps) => {
  const colorFormatOptions: SelectOptionProps[] = [
    {
      label: 'RGB',
      value: 'rgb',
    },
    {
      label: 'HEX',
      value: 'hex',
    },
    {
      label: 'HSL',
      value: 'hsl',
    },
  ];

  const [format, setFormat] = useState<SelectOptionProps>(
    colorFormatOptions[0],
  );

  const blob = new window.Blob([tokensToSketchPalettes(tokens)], {
    type: 'application/json',
  });
  const blobURL = window.URL.createObjectURL(blob);

  const colorSwatches = tokens.map(token => (
    <ColorSwatch key={token.name} color={token} format={format.value} />
  ));
  /* eslint-disable jsx-a11y/label-has-for */
  return (
    <div>
      <div className="ks-color-swatch__right-label">
        <span
          style={{
            width: 'calc(var(--space-xxl) * 3)',
          }}
        >
          <KsSelect
            label="Color Format"
            isLabelInline
            value={format}
            options={colorFormatOptions}
            handleChange={value => {
              setFormat(value);
            }}
          />
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <span>
            <a
              href="https://github.com/andrewfiorillo/sketch-palettes"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sketch Palette plugin
            </a>{' '}
            format:{' '}
          </span>
          <a href={blobURL} download="my-sketch.sketchpalette">
            <KsButton>Download Sketch Palette</KsButton>
          </a>
        </div>
      </div>
      <div className="ks-color-swatch__swatches-wrapper">{colorSwatches}</div>
    </div>
  );
};
