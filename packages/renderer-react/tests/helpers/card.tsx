import * as React from 'react';
import cn from 'classnames';

// export const CardButton = ({ disabled = false, text }) => (
//   <button>{text}</button>
// );

type Props = {
  textAlign?: 'left' | 'center' | 'right';
  // cardHeader?: string;
  imgSrc?: string;
  isDark: boolean;
  cardTitle?: string;
  cardSubTitle?: string;
  cardBody: string;
  handleIt?: (x: string) => boolean;
  header?: React.ReactNode;
  /**
   * Goes in footer
   */
  children?: React.ReactNode;
};

export const Card: React.FC<Props> = ({
  textAlign = 'left',
  children,
  cardBody,
  // cardHeader,
  cardSubTitle,
  cardTitle,
  imgSrc,
  isDark = true,
}: Props) => {
  const classes = cn('card', `text-${textAlign}`, {});
  return (
    <div className={classes}>
      {imgSrc && <img src={imgSrc} className="card-img-top" alt="hi" />}
      <div className="card-body">
        <h5 className="card-title">{cardTitle}</h5>
        {cardSubTitle && (
          <h6 className="card-subtitle mb-2 text-muted">{cardSubTitle}</h6>
        )}
        <p className="card-text">{cardBody}</p>
        {children}
      </div>
    </div>
  );
};

export default Card;
