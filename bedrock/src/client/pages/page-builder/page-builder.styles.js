import styled, { keyframes, css } from 'styled-components';
import SchemaForm from '@basalt/bedrock-schema-form';
import { Link } from 'react-router-dom';

// index.js

export const MainContent = styled.div`
  flex-grow: 1;
  box-sizing: border-box;
`;

export const StartInsertSlice = styled.div`
  display: ${props => (props.hasVisibleControls ? 'block' : 'none')};
  border: ${props =>
    props.isActive ? 'solid 1px #e1c933' : 'dashed 1px rgba(0,0,0,0.3)'};
  text-align: center;
  cursor: pointer;
  padding: 1rem 1rem 0.6rem;
  margin: 1rem 0;
  transition: all 0.3s ease-in-out;
  &:hover,
  &:active {
    border: ${props => !props.isActive && '1px dashed #e1c933'};
  }
`;

// page-builder-sidebar.jsx

export const PatternListWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

// prop.thumb is set via the global config `enablePatternIcons` If set false, we present a list instead of a grid
function noIconStyles(props) {
  if (!props.thumb)
    return `
    background: #FFF;
    padding: ${props.theme.globals.spacing.s} ${
      props.theme.globals.spacing.s
    } 3px;
    border: 1px solid ${props.theme.globals.colors.neutralLight};
  `;
}
export const PatternListItemWrapper = styled.li`
  width: ${props =>
    props.thumb ? `calc(50% - ${props.theme.globals.spacing.m})` : '100%'};
  filter: ${props => (props.thumb ? 'grayscale(75%)' : 'none')};
  transition: ${props => props.theme.transitions.all};
  &:hover {
    filter: grayscale(0%);
  }
  h5 {
    color: ${props => props.theme.globals.colors.primary};
    font-size: ${props => (props.thumb ? 'inherit' : '1rem')};
    margin: ${props =>
      props.thumb ? `0 0 ${props.theme.globals.spacing.s}` : '0 0 4px'};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  > div {
    &:hover,
    &:active {
      cursor: pointer;
    }
  }
  a:link,
  a:visited {
    color: ${props => props.theme.links.color};
    font-size: calc(${props => props.theme.globals.fontSize} * 0.61);
    text-decoration: none;
    transition: ${props => props.theme.transitions.all};
  }
  div[role='button']:focus,
  div[role='button']:active {
    outline: none;
  }
  /* Specific styling only when props.thumb (enablePatternIcons) is false */
  ${props => noIconStyles(props)};
`;

export const PatternListItemThumb = styled.img`
  width: auto;
  height: 50px;
  margin-bottom: ${props => props.theme.globals.spacing.s};
`;

export const PatternListItemDescription = styled.div`
  line-height: 1.25;
  font-size: 11px;
  color: hsl(0, 0%, 35%);
  font-style: italic;
`;

export const PlaygroundStyledSchemaForm = styled(SchemaForm)`
  & > .rjsf > div {
    margin: 0;
    & > label {
      display: none;
    }
  }
  label {
    color: ${props => props.theme.globals.colors.primary};
  }
  margin-bottom: 1rem;
`;

// page-builder-slice.jsx

export const PlaygroundIcon = styled.div`
  display: block;
  transition: all 0.3s ease;
  width: 21px;
  height: 21px;
  background-size: contain;
  position: relative;
  cursor: ${props => (props.active ? 'pointer' : 'auto')};
  &::after {
    background: ${props =>
      props.backgroundImage ? props.backgroundImage : ''};
    background-size: contain;
    opacity: ${props => (props.active ? 1 : 0.25)};
    content: '';
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: 1;
  }
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
  &:hover,
  &:active {
    cursor: ${props => (props.disabled ? '' : 'pointer')};
  }
  &:focus,
  &:active {
    outline: none;
  }
  > svg {
    width: 100%;
    height: 100%;
  }
`;

export const briefHighlight = keyframes`
  from {
    box-shadow: 0 0 1.5rem #e1c933;
  } to {
    box-shadow: none;
  }
`;

export const PlaygroundIconWrapper = styled.div`
  box-sizing: border-box;
  ${props =>
    props.active
      ? `
        background: #fffdec;
        border-left: solid 1px ${props.theme.globals.colors.active};
        `
      : `
        background: #f9f9f9;
        border: solid 1px ${props.theme.globals.colors.neutral};
        `};
  margin-bottom: 0;
  display: ${props => (props.hasVisibleControls ? 'block' : 'none')};
  height: 100%;
  text-align: center;
  padding: 0.5rem;
  margin-left: 1rem;
`;

export const PlaygroundSliceWrapper = styled.div`
  background: #fff;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  box-sizing: border-box;
  ${props =>
    props.active && props.hasVisibleControls
      ? `border: solid 1px ${props.theme.globals.colors.active};`
      : 'border: none;'};
  ${props =>
    props.isChanged &&
    css`
      animation: ${briefHighlight} 1.5s;
    `};
  &:active {
    border: solid 1px ${props => props.theme.globals.colors.neutral};
    ${PlaygroundIconWrapper} {
      background: #f9f9f9;
      border-color: ${props => props.theme.globals.colors.neutral};
      border-width: 0 0 0 1px;
    }
  }
`;

export const PlaygroundStyledLink = styled(Link)`
  height: ${props => props.theme.buttons.height};
  line-height: ${props => props.theme.buttons.height};
  border: ${props => props.theme.buttons.border};
  color: #000;
  font-size: ${props => props.theme.buttons.fontSize};
  font-weight: 400;
  font-family: system-ui;
  padding: 1px 7px 2px;
  &:link,
  &:visited {
    color: #000;
  }
  &:hover {
    text-decoration: none;
  }
`;
