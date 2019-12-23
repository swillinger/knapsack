// @ts-ignore
import React, { useState } from 'react';
import cn from 'classnames';
import JSZip from 'jszip';
// import { Document } from 'react-pdf/dist/entry.webpack';
// import './sketch.scss';

type Props = {};

/**
 * @link https://github.com/AnimaApp/sketch-web-viewer/blob/master/src/App.vue
 */
async function handleSketchFile(data) {
  const zip = await JSZip.loadAsync(data);
  const promises = [];

  zip.forEach((relativePath, zipEntry) => {
    if (relativePath.endsWith('.pdf')) {
      promises.push(
        (async () => {
          const { name, comment } = zipEntry;

          return {
            type: 'pdf',
            name,
            comment,
            content: `data:application/pdf;base64,${await zipEntry.async(
              'base64',
            )}`,
          };
        })(),
      );
    }
    if (relativePath === 'previews/preview.png') {
      promises.push(
        (async () => {
          const { name, comment } = zipEntry;

          return {
            type: 'png',
            name,
            comment,
            content: `data:image/png;base64,${await zipEntry.async('base64')}`,
          };
        })(),
      );
    }
    if (relativePath.endsWith('.png') && false) {
      promises.push(
        (async () => {
          const { name, comment } = zipEntry;

          return {
            type: 'png',
            name,
            comment,
            content: `data:image/png;base64,${await zipEntry.async('base64')}`,
          };
        })(),
      );
    }
    if (relativePath.endsWith('.json')) {
    }
  });

  return Promise.all(promises)
    .then(results => {
      console.log('promises.all results', results);
      return results;
    })
    .catch(err => {
      console.log('promises.all error', err);
    });
}

export const Sketch: React.FC<Props> = ({}: Props) => {
  const [sketchData, setSketchData] = useState();

  const classes = cn({
    'k-sketch': true,
  });
  return (
    <div className={classes}>
      <input
        type="file"
        onChange={ev => {
          const file = ev.target.files[0];
          const reader = new FileReader();
          reader.onload = e => {
            const data = e.target.result;
            console.log('data', data);
            handleSketchFile(data).then(setSketchData);
          };
          reader.readAsArrayBuffer(file);
          // Storage.put(file.name, file, {
          //   progressCallback(progress) {
          //     console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          //   },
          // })
          //   .then(result => {
          //     console.log('storage result', result);
          //   })
          //   .catch(err => {
          //     console.error('storage error', err);
          //   });
        }}
      />
      {sketchData &&
        sketchData.map(item => {
          return (
            <div
              key={item.name}
              style={{ border: 'solid 1px black', marginBottom: '1rem' }}
            >
              <h3>Item: {item.name}</h3>
              <p>{item.comment}</p>
              {item.type === 'png' && <img src={item.content} />}
            </div>
          );
        })}
    </div>
  );
};
