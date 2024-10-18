import { styled } from "styled-components";

export const Div = styled.div`
  display: ${(props) => props.display || "flex"};
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify && props.justify};
  gap: ${(props) => props.gap && props.gap};
  flex-direction: ${(props) => props.direction || "row"};
  width: ${(props) => props.$fullWidth && "100%"};
  height: ${(props) => props.$fullHeight && "100%"};
  max-height: ${(props) => props.$maxHeight};
  max-width: ${(props) => props.$maxWidth};
  overflow: ${(props) => props.overflow};
  ${(props) => props.margin && `margin: ${props.margin};`}
  ${(props) => props.padding && `padding: ${props.padding};`}
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.$minWidth && `min-width: ${props.$minWidth};`}
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => props.wrap && `flex-wrap: ${props.wrap};`}
  ${(props) => props.$avoidPageBreak && "break-inside: avoid !important;"}
  ${(props) => props.$alignSelf && `align-self: ${props.$alignSelf};`}
  ${(props) =>
    props.$backgroundColor && `background-color: ${props.$backgroundColor};`}
  ${(props) => props.$borderRadius && `border-radius: ${props.$borderRadius};`}
  ${(props) => props.borderTop && `border-top: ${props.borderTop};`}
  ${(props) => props.borderBottom && `border-bottom: ${props.borderBottom};`}
  ${(props) => props.flex && `flex: ${props.flex};`}
  ${(props) => props.$whiteSpace && `white-space: ${props.$whiteSpace};`}
  ${(props) => props.$flexWrap && `flex-wrap: ${props.$flexWrap};`}
  ${(props) => props.$textAlign && `text-align: ${props.$textAlign};`}
`;
