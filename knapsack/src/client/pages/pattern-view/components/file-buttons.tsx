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
        <KsButton disabled={disabledBtns} handleTrigger={handleOpen} size="s">
          <KsPopover
            content={
              <p>
                Open in external editor; passes <br />
                absolute path to <code>open</code> command.
              </p>
            }
            trigger="hover"
          >
            <div>Open in Editor</div>
          </KsPopover>
        </KsButton>

        <KsButton disabled={disabledBtns} size="s">
          <KsPopover
            maxWidth={310}
            content={
              <p>
                Copy absolute file path to clipboard.
                <br />
                <code
                  style={{
                    wordBreak: 'break-word',
                    fontSize: 'var(--font-size-s)',
                  }}
                >
                  {absolutePath}
                </code>
              </p>
            }
            trigger="hover"
          >
            <CopyToClipboard text={absolutePath}>
              <span>Copy Path</span>
            </CopyToClipboard>
          </KsPopover>
        </KsButton>
      </KsButtonGroup>
    </div>
  );
};
