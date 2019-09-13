console.log('viz.js loaded');
// console.log(viz.theme);
// console.log(viz.parents);
// console.log(viz.children);
// console.log(viz.parents[0]);
// console.log(viz.links);
const setup = {};
setup.strings = {};
setup.strings.theme = 'THEME';
setup.strings.subthemes = 'SUB-THEMES';
setup.nodes = [];
setup.links = [];
let linkIndex = 0;
let colorIndex = 0;
const symbolSizeBase = 20;
// Track who is hovered
viz.active = {};
viz.active.hovered = null;
viz.active.clicked = null;
viz.getItemObj = (id) => {
  // check both parents and children data
  let _obj = null;
  _obj = viz.parents.filter(
    function(value) { return value.id === id }
  )
  if (_obj.length === 1) {
    _obj[0].type = 'parent';
    return _obj[0];
  } else {
    _obj = viz.children.filter(
      function(value) { return value.id === id }
    )
  }
  if (_obj.length === 1) {
    _obj[0].type = 'child';
    return _obj[0];
  } else {
    return false;
  }
};
viz.getItemLinks = (id) => {
  // let _obj = null;
  const _links = viz.links.filter(
    function(value) { return value.source === id }
  )
  return _links;
};
// Tooltip for topics and subtopics
const topicTooltip = {
  // trigger: 'item',
  // formatter: '{c}' + '<br>Click for more',
  show: true,
  position: 'right',
  // itemStyle: {
    // color: '#000',
    backgroundColor: 'transparent',
    textStyle: {
      color: '#000',
      fontWeight: 'bold',
      fontFace: 'sofia-pro'
    }
  // }
}
const subtopicTooltip = {

}
// Label for topics and subtopics
const topicLabel = {
  // position: 'right',
  // show: false,
  normal: {
    position: 'right',
    show: function(el) {
      console.log('show' + (el.data.id == viz.active.hovered));
      return el.data.id == viz.active.hovered;
      // return false;
    },
    textStyle: {
      color: '#000',
      fontWeight: 'bold',
      fontFace: 'sofia-pro',
      fontSize: 16
    },
  },
  // itemStyle: {
  //   // color: 'black',
  //   textStyle: {
  //     color: '#000',
  //     fontWeight: 'bold',
  //     fontFace: 'sofia-pro',
  //     fontSize: 20
  //   }
  // },
  // textStyle: {
  //   color: '#000',
  //   fontWeight: 'bold',
  //   fontFace: 'sofia-pro',
  //   fontSize: 20
  // },
  formatter: function(el) {
    console.log('formatter', el);
    if (el.data.id === viz.active.hovered) {
      return el.data.value + '<br>Click for more';
    } else {
      return el.data.value + 'blah';
    }
  },
  // color: '#000',
}
const subtopicLabel = {
  show: false,
}
// Add root node
const root = {
  id: 'root',
  name: "ubi",
  value: "UBI",
  category: 'root',
  // fixed: true,
  symbol: 'circle',
  symbolSize: 80,
  itemStyle: {
    color: viz.theme[colorIndex]
  },
  tooltip: {
    show: false
  },
  label: {
    show: true,
    position: 'inside',
    formatter: '{c}',
    textStyle: {
      // color: '#000',
      fontSize: 20,
      fontWeight: 'normal',
      fontFace: 'sofia-pro'
    }
  },
};
(setup.nodes).push(root);
colorIndex++;

viz.parents.forEach(function(el) {
  // console.log(i);
  // console.log(el.title);
  if (!!el.display) {
    // Add item to nodes array
    const item = {
      id: el.id,
      name: el.title,
      value: el.title,
      category: el.id,
      // fixed: true,
      symbol: 'circle',
      symbolSize: 40,
      itemStyle: {
        color: viz.theme[colorIndex]
      },
      // tooltip: topicTooltip,
      label: topicLabel
    };
    (setup.nodes).push(item);
    colorIndex++;
  }
});
// console.log('Done adding parent nodes');
// console.log(setup.nodes);

viz.children.forEach(function(el) {
  // console.log(i);
  // console.log(el.title);
  const _parent = setup.nodes.filter(
    function(value){ return value.id === el.parent }
  )
  const _viz_parent = viz.parents.filter(
    function(value){ return value.id === el.parent }
  )
  // console.log('_parent');
  // console.log(_parent);
  if (!!el.display && !!_viz_parent[0].display) {
    // console.log('display is on');
    // Add item to nodes array
    const item = {
      id: el.id,
      name: el.title,
      value: el.title,
      category: el.id,
      // fixed: true,
      symbol: 'circle',
      symbolSize: 20,
      itemStyle: {
        color: _parent[0].itemStyle.color,
      },
      // tooltip: topicTooltip,
      label: topicLabel
    };
    (setup.nodes).push(item);
  }
});
// console.log('Done adding child nodes');
// console.log(setup.nodes);
// Build links object
viz.links.forEach(function(el) {
  const link = {
    id: linkIndex,
    source: el.source,
    target: el.target
  };
  (setup.links).push(link);
  linkIndex++;
});


// console.log('setup.categories');
// console.log(setup.categories);
// console.log('setup.nodes');
// console.log(setup.nodes);
// console.log('setup.links');
// console.log(setup.links);
setup.options = {
  title: {
    // text: 'Les Miserables',
    subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  tooltip: {
    triggerOn: 'none',
    trigger: 'item',
    position: 'right',
    backgroundColor: '#fff',
    borderColor: '#979797',
    extraCssText: 'box-shadow: 0 1px 4px rgba(79, 79, 79, 0.18);border-radius:6px;width:30%;',
    padding: 40,
    enterable: true,
    formatter: function(item) {
      // console.log('formatter item');
      // console.log(item);
      const _item_obj = viz.getItemObj(item.data.id);
      // console.log('_item_obj');
      // console.log(_item_obj);
      const _item_links = viz.getItemLinks(item.data.id);
      // console.log('_item_links');
      // console.log(_item_links);
      // Add the item title.
      let _tooltip =    '<div class="tip">' +
                        '<button class="btn close">&times;</button>' +
                        '<span class="subtext">' + setup.strings.theme + '</span>' +
                        '<div class="theme title">' + item.data.name + '</div>';
      // If there are links, render them.
      if (_item_links.length >= 1) {
        _tooltip += '<span class="subtext">' + setup.strings.subthemes + '</span>';
        _item_links.forEach(function(item) {
          const related = viz.getItemObj(item.target);
        _tooltip += '<div class="related title">' + related.title + '</div>';
        });
      }
      // Set up accordion content.
      if (_item_obj.type === 'parent') {
        console.log('it\'s a parent');
      }
      if (_item_obj.type === 'child') {
        console.log('it\'s a child');
      }
      _tooltip += '</div>';
      return _tooltip;
    },
    textStyle: {
      color: '#000',
    }
  },
  series : [
    {
      name: 'UBI',
      type: 'graph',
      layout: 'force',
      force: {
        repulsion: 95,
        gravity: 0.015,
        edgeLength: 40,
        layoutAnimation: false
      },
      data: setup.nodes,
      links: setup.links,
      // categories: setup.categories,
      focusNodeAdjacency: true,
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        lineStyle: {
          width: 10
        }
      },
      roam: true,
    }
  ]
};
/**
 * Stops scrolling over the eCharts div
 * @param  Object e Event object
 * @return null
 */
function stopWheel(e){
  if(!e){ /* IE7, IE8, Chrome, Safari */
    e = window.event;
  }
  if(e.preventDefault) { /* Chrome, Safari, Firefox */
    e.preventDefault();
  }
  e.returnValue = false; /* IE7, IE8 */
}
jQuery('#viz-space').hover(function() {
  jQuery(document).bind('mousewheel DOMMouseScroll',function(){
    stopWheel();
  });
}, function() {
  jQuery(document).unbind('mousewheel DOMMouseScroll');
});
// Init eCharts
viz.chart = echarts.init(document.getElementById('viz-space'));
viz.chart.showLoading();
viz.chart.setOption(setup.options);
viz.chart.hideLoading();
viz.chart.on('click', (e) => {
  console.log('click');
  // console.log(e.dataType);
  viz.active.clicked = e.data.id;
  if (e.dataType === 'node') {
    // console.log('trying to show tooltip');
    // console.log(e);
    viz.chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: e.dataIndex
    });
    // viz.chart.action.tooltip.showTip;
    jQuery('.tip .btn.close').on('click', () => {
      console.log('close button clicked');
      viz.chart.dispatchAction({
        type: 'hideTip'
      });
      jQuery('.tip .btn.close').off('click');
    })
  }
});
// viz.chart.on('mouseover', (e) => {
//   // console.log('mouseover');
//   // console.log(e);
//   viz.active.hovered = e.data.id;
// });
// viz.chart.on('mouseout', (e) => {
//   // console.log(e);
//   viz.active.hovered = null;
// })
