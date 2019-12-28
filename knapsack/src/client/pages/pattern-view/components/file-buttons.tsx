import React, { useEffect, useState } from 'react';
import { KsButton, KsButtonGroup, KsPopover } from '@knapsack/design-system';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { files, Files } from '../../../data';

type Props = {
  filePath: string;
};

export const KsFileButtons: React.FC<Props> = ({ filePath }: Props) => {
  const [absolutePath, setAbsolutePath] = useState('');
  useEffect(() => {
    files({
      type: Files.ACTIONS.verify,
      payload: {
        path: filePath,
      },
    }).then(results => {
      if (results.type === Files.ACTIONS.verify) {
        if (results.payload.exists) {
          setAbsolutePath(results.payload.absolutePath);
        }
      }
    });
  }, [filePath]);

  const handleOpen = () => {
    files({
      type: Files.ACTIONS.openFile,
      payload: {
        filePath: absolutePath,
      },
    });
  };

  const disabledBtns = !absolutePath;
  return (
    <div className="ks-file-buttons">
      <KsButtonGroup>
        <KsPopover
          content={
            <p>
              Open in external editor; passes <br />
              absolute path to <code>open</code> command.
            </p>
          }
          trigger="hover"
        >
          <KsButton disabled={disabledBtns} handleTrigger={handleOpen} size="s">
            Open in Editor
          </KsButton>
        </KsPopover>
        <KsPopover
          content={<p>Copy absolute file path to clipboard</p>}
          trigger="hover"
        >
          <CopyToClipboard text={absolutePath}>
            <KsButton disabled={disabledBtns} size="s">
              Copy Path
            </KsButton>
          </CopyToClipboard>
        </KsPopover>
      </KsButtonGroup>
    </div>
  );
};
