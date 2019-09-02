console.log('viz.js loaded');
console.log(viz.theme);
console.log(viz.nodes);
console.log(viz.nodes[0]);
const setup = {};
setup.categories = [];
setup.nodes = [];
setup.links = [];
let linkIndex = 0;
let colorIndex = 0;
const item = {
  name: "ubi",
  value: "UBI",
  category: 'root',
  fixed: false,
  symbol: 'circle',
  symbolSize: 30,
  itemStyle: {
    color: viz.theme[colorIndex]
  }
};
(setup.nodes).push(item);
colorIndex++;
viz.nodes.forEach(function(el) {
  // console.log(i);
  // console.log(el.title);
  // Add item to nodes array
  const item = {
    name: el.id,
    value: el.title,
    category: el.id,
    fixed: false,
    symbol: 'circle',
    symbolSize: 20,
    itemStyle: {
      color: viz.theme[colorIndex]
    }
  };
  (setup.nodes).push(item);
  // Add children to nodes array
  el.children.forEach((el) => {
    const item = {
      name: el.id,
      value: el.title,
      category: el.id,
      fixed: false,
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        color: viz.theme[colorIndex]
      }
    };
    (setup.nodes).push(item);
  });
  // If node category not already in categories, add it.
  if (!setup.categories[name === el.id]) {
    (setup.categories).push({
      name: el.id,
      itemStyle: {
        color: viz.theme[colorIndex]
      }
    });
  }
  // Build links obj
  // Link to parent
  const link = {
    id: linkIndex,
    source: 'root',
    target: el.id
  };
  (setup.links).push(link);
  linkIndex++;
  // Links to siblings
  (el.linksTo).forEach((link) => {
    const linkObj = viz.nodes.find(o => o.id === link);
    const linkTo = {
      id: linkIndex,
      source: el.id,
      target: linkObj.id
    };
    (setup.links).push(linkTo);
    linkIndex++;
  });
  // Links to children
  (el.children).forEach((child) => {
    const childLink = {
      id: linkIndex,
      source: el.id,
      target: child.id
    };
    (setup.links).push(childLink);
    linkIndex++;
  });
  // Increment color index for next "theme".
  colorIndex++;
});
console.log('setup.categories');
console.log(setup.categories);
console.log('setup.nodes');
console.log(setup.nodes);
console.log('setup.links');
console.log(setup.links);
