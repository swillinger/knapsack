import * as React from 'react';
import cn from 'classnames';

type Props = {
  textAlign?: string;
  // cardHeader?: string;
  imgSrc?: string;
  cardTitle?: string;
  cardSubTitle?: string;
  cardBody: string;
  children?: React.ReactNode;
};

const Card: React.FC<Props> = ({
  textAlign = 'left',
  children,
  cardBody,
  // cardHeader,
  cardSubTitle,
  cardTitle,
  imgSrc,
}: Props) => {
  const classes = cn('card', `text-${textAlign}`, {});
  return (
    <div className={classes}>
      {imgSrc && <img src={imgSrc} className="card-img-top" />}
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
