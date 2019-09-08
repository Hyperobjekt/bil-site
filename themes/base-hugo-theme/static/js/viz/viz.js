console.log('viz.js loaded');
// console.log(viz.theme);
// console.log(viz.parents);
// console.log(viz.children);
// console.log(viz.parents[0]);
// console.log(viz.links);
const setup = {};
setup.nodes = [];
setup.links = [];
let linkIndex = 0;
let colorIndex = 0;
const symbolSizeBase = 20;
// Track who is hovered
viz.active = {};
viz.active.hovered = null;
viz.active.clicked = null;
// Tooltip for topics and subtopics
const topicTooltip = {
  // trigger: 'item',
  formatter: '{c}' + '<br>Click for more',
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
      tooltip: topicTooltip,
      label: topicLabel
    };
    (setup.nodes).push(item);
    colorIndex++;
  }
});
console.log('Done adding parent nodes');
console.log(setup.nodes);

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
      tooltip: topicTooltip,
      label: topicLabel
    };
    (setup.nodes).push(item);
  }
});
console.log('Done adding child nodes');
console.log(setup.nodes);

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
console.log('setup.nodes');
console.log(setup.nodes);
console.log('setup.links');
console.log(setup.links);
setup.options = {
  title: {
    // text: 'Les Miserables',
    subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  // toolbox: {
  //   feature: {
  //     dataZoom: {
  //       show: true,
  //       title: {
  //         zoom: 'Zoom',
  //         back: 'Back'
  //       }
  //     }
  //   }
  // },
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
  // console.log(e);
  viz.active.clicked = e.data.id;
});
viz.chart.on('mouseover', (e) => {
  console.log('mouseover');
  console.log(e);
  viz.active.hovered = e.data.id;
  console.log(viz.active);
});
viz.chart.on('mouseout', (e) => {
  // console.log(e);
  viz.active.hovered = null;
  console.log(viz.active);
})
