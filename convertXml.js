/* Source: https://gist.github.com/erickoledadevrel/6b1e9e2796e3c21f669f */
/**
 * Converts an XML string to a JSON object, using logic similar to the
 * sunset method Xml.parse().
 * @param {string} xml The XML to parse.
 * @returns {Object} The parsed XML.
 */
function XML_to_JSON(xml) {
  let doc = XmlService.parse(xml);
  let result = {};
  let root = doc.getRootElement();
  result[root.getName()] = elementToJSON(root);
  return result;
}

/**
 * Converts an XmlService element to a JSON object, using logic similar to
 * the sunset method Xml.parse().
 * @param {XmlService.Element} element The element to parse.
 * @returns {Object} The parsed element.
 */
function elementToJSON(element) {
  let result = {};
  // Attributes.
  element.getAttributes().forEach(function (attribute) {
    result[attribute.getName()] = attribute.getValue();
  });
  // Child elements.
  element.getChildren().forEach(function (child) {
    let key = child.getName();
    let value = elementToJSON(child);
    if (result[key]) {
      if (!(result[key] instanceof Array)) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });
  // Text content.
  if (element.getText()) {
    result['Text'] = element.getText();
  }
  return result;
}