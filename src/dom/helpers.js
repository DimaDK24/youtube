function setAttributes(element, attributes) {
  const entries = Object.entries(attributes);
  entries.forEach(attribute => element.setAttribute(attribute[0], attribute[1]));
  return element;
}

function createElementWithClasses(elementName, ...classes) {
  if (!elementName) throw new Error('elementName should be truthy');
  if (typeof elementName !== 'string') throw new Error('elementName should be string');
  const element = document.createElement(elementName);
  if (classes.length) element.classList.add(...classes);
  return element;
}

function createDivWithClasses(...classes) {
  return createElementWithClasses('div', ...classes);
}

function createIcon(name) {
  return createElementWithClasses('i', name);
}

function appendChildren(elem, children) {
  children.forEach((child) => {
    elem.appendChild(child);
  });
}

export {
  createElementWithClasses,
  createDivWithClasses,
  appendChildren,
  createIcon,
  setAttributes,
};
