import styled from 'styled-components';

export const BordersDemoBox = styled.div`
  display: inline-block;
  min-height: 155px;
  margin: 0 2.5rem 2.5rem 0;
  position: relative;
  width: 325px;
  vertical-align: top;
  padding: 0.7rem;
`;

export const ColorsDemoBox = styled.div`
  display: inline-block;
  min-height: 135px;
  margin: 0 2.5rem 2.5rem 0;
  position: relative;
  width: 325px;
  vertical-align: top;
  padding: 0.7rem;
`;

export const StyledTextColorDemo = styled.div`
  display: inline-block;
  margin: 0 2.5rem 2rem 0;
  position: relative;
  width: 325px;
  vertical-align: top;
  padding: 0.7rem;
  * {
    color: ${props => props.color};
  }
`;

export const ShadowDemoBox = styled.div`
  display: inline-block;
  height: 155px;
  margin: 0 2.5rem 2.5rem 0;
  position: relative;
  width: 325px;
  vertical-align: top;
  padding: 0.7rem;
`;

export const TypographyChildrenDemoWrapper = styled.div`
  font-family: ${props => props.fontFamily};
  padding: 1rem 1rem 0;
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
  font-style: ${props => (props.fontStyle ? props.fontStyle : 'normal')};
  p {
    line-height: ${props => (props.lineHeight ? props.lineHeight : 'inherit')};
  }
  blockquote::first-line {
    font-weight: 800;
  }
  blockquote[contenteditable] {
    border-top: 1px dashed transparent;
    border-right: 1px dashed transparent;
    border-bottom: 1px dashed transparent;
    transition: ${props => props.theme.transitions.all};
    &:focus {
      outline: none;
    }
  }
  blockquote[contenteditable]:hover {
    border-top: 1px dashed ${props => props.theme.globals.colors.neutralLight};
    border-right: 1px dashed ${props => props.theme.globals.colors.neutralLight};
    border-bottom: 1px dashed
      ${props => props.theme.globals.colors.neutralLight};
  }
  [contenteditable]:not(blockquote) {
    border: 1px dashed transparent;
    transition: ${props => props.theme.transitions.all};
  }
  [contenteditable]:not(blockquote):hover {
    border: 1px dashed ${props => props.theme.globals.colors.neutralLight};
  }
`;

export const StyledFontSizeDemo = styled.div`
  font-size: ${props => props.fontSize};
  border-bottom: ${props =>
    props.length !== props.index
      ? `1px dotted ${props.theme.globals.colors.neutralLight}`
      : ''};
  padding-bottom: ${props =>
    props.length !== props.index ? props.theme.globals.spacing.m : ''};
  margin-bottom: ${props =>
    props.length !== props.index ? props.theme.globals.spacing.l : ''};

  blockquote::first-line {
    font-weight: 800;
  }
`;

export const DemoTransitionOpacity = styled.div`
  background: ${props => props.theme.globals.colors.neutralLight};
  padding: ${props => props.theme.globals.spacing.m};
  margin-bottom: ${props => props.theme.globals.spacing.m};
  text-align: center;
  border-radius: 0;
  cursor: pointer;
  max-width: 800px;
  transition: opacity ${props => props.theme.transitions.speed_and_function};
  &:hover {
    opacity: 0;
  }
`;

export const DemoTransitionMove = styled.div`
  background: ${props => props.theme.globals.colors.neutralLight};
  padding: ${props => props.theme.globals.spacing.m};
  margin-bottom: ${props => props.theme.globals.spacing.m};
  text-align: center;
  border-radius: 0;
  cursor: pointer;
  max-width: 800px;
  position: relative;
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 3px;
    top: 0;
    left: 8px;
    bottom: 0;
    background: black;
    transition: left ${props => props.theme.transitions.speed_and_function};
  }
  &:hover:after {
    left: calc(100% - 8px);
  }
`;
