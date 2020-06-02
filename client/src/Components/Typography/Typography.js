import React from 'react';

/**
 * 
 * @param {boolean} bold Whether the text is bold. Default: false
 * @param {String} margin Margin string. Default: "0"
 * @param {String} Variant Type of html element that should be rendered. Default: "p"
 * @param {String} fontSize Font size of the text. Default: 1rem
 * @param {String} color Color of the text. Default: "#333"
 * @param {Object} additionalStyles Additional non-conventional styles. Default: {}
 */
const Typography = ({ bold = false, margin = "0", Variant = "p", fontSize = "1rem", color = "#333", align = "left", additionalStyles = {}, children }) => {
  const styles = {
    fontWeight: bold ? 700 : 400,
    margin, fontSize, color,
    textAlign: align,
    ...additionalStyles
  }
  return (
    <Variant style={styles}>{children}</Variant>
  );
}

export default Typography