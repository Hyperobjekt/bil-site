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
setup.linkIndex = 0;
setup.colorIndex = 0;
const symbolSizeBase = 20;
// Track who is hovered
viz.active = {};
viz.active.hovered = null;
viz.active.clicked = null;
// viz.showTip = false;
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
  show: false,
  position: 'right',
  contain: false,
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
  show: false,
  position: 'right',
  contain: false,
  // itemStyle: {
    // color: '#000',
  backgroundColor: 'transparent',
  textStyle: {
    color: '#000',
    fontWeight: '300',
    fontFace: 'sofia-pro',
    fontSize: 16
  }
}
// Label for topics and subtopics
const topicLabel = {
  // position: 'right',
  // show: false,
  // show: false,
  // function(el) {
    // console.log('show' + (el.data.id == viz.active.hovered));
    // return el.data.id === viz.active.hovered;
    // return false;
  // },
  normal: {
    position: 'right',
    show: true,
    // function(el) {
    //   // console.log('show' + (el.data.id == viz.active.hovered));
    //   // return el.data.id == viz.active.hovered;
    //   return false;
    // },
    textStyle: {
      color: '#000',
      fontWeight: '600',
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
viz.showSubtopicLabel = false;
let subtopicLabel = {
  // show: false,
  normal: {
    show: viz.showSubtopicLabel,
    position: 'right',
    textStyle: {
      color: '#000',
      fontWeight: '300',
      fontFace: 'sofia-pro',
      fontSize: 16
    },
  },
}

viz.rebuild = () => {
  // Clear out nodes object.
  setup.nodes = [];
  setup.colorIndex = 0;
  setup.linkIndex = 0;
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
      color: viz.theme[setup.colorIndex]
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
        fontWeight: 200,
        fontFace: 'sofia-pro'
      }
    },
  };
  (setup.nodes).push(root);
  setup.colorIndex++;
  // Build parent nodes
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
          color: viz.theme[setup.colorIndex]
        },
        tooltip: topicTooltip,
        label: topicLabel
      };
      (setup.nodes).push(item);
      setup.colorIndex++;
    }
  });
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
        tooltip: subtopicTooltip,
        label: subtopicLabel
      };
      (setup.nodes).push(item);
    }
  });
  // Build links object
  viz.links.forEach(function(el) {
    const link = {
      id: setup.linkIndex,
      source: el.source,
      target: el.target
    };
    (setup.links).push(link);
    setup.linkIndex++;
  });
}
viz.rebuild();
// console.log('Done adding child nodes');
// console.log(setup.nodes);
setup.options = {
  title: {
    show: false,
    text: 'Exploring Universal Basic Income',
    // subtext: 'Default layout',
    top: 'bottom',
    left: 'right'
  },
  animation: false,
  tooltip: {
    show: false,
  },
  // extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
  textStyle: {
    // color: '#000',
    extraCssText: 'z-index:500;'
  },
  series : [
    {
      name: 'UBI',
      type: 'graph',
      zlevel: 1000,
      layout: 'force',
      force: {
        repulsion: 270,
        gravity: 0.015,
        edgeLength: 40,
        layoutAnimation: false
      },
      roam: true,
      // nodeScaleRatio: 0,
      draggable: true,
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
      }
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
  jQuery(document).bind('mousewheel DOMMouseScroll', function(){
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
// console.log(viz.chart);
viz.zoomLevel = null;
// Item click listener
viz.chart.on('click', function(e) {
  console.log('click');
  console.log(e);
  if (e.dataType === 'node') {
    var nodeID = e.data.id;
    var vSp = jQuery('#viz-space');
    viz.active.clicked = e.data.id;
    var evt = window.event;
    // console.log(evt);
    var offset = e.data.symbolSize + (e.data.symbolSize * viz.zoomlevel);
    var _item_obj = viz.getItemObj(e.data.id);
    var _item_links = viz.getItemLinks(e.data.id);
    let _tooltip =    '<div class="tip">' +
                      // '<button class="btn close">&times;</button>' +
                      '<span class="subtext">' + setup.strings.theme + '</span>' +
                      '<div class="theme title">' + e.data.name + '</div>';
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
      var parentNodes = Object.values(viz.parents);
      var parentNode = parentNodes.filter(function(el) {
        return el.id == nodeID
      })
      parentNode = parentNode[0];
      // var parentNode = viz.parents.filter(function(el) {
      //   return this.id = nodeID;
      // });
      // console.log(parentNode);
      // console.log(viz.parents[nodeID]);
      _tooltip += '<a class="" data-toggle="collapse" href="#collapseBib" role="button" aria-expanded="false" aria-controls="collapseBib">' +
        'BIBLIOGRAPHY' +
        '<span class="icon">&plus;</span>' +
      '</a>' +
      '<div class="collapse" id="collapseBib">' +
        '<div class="card card-body">' +
          '<p>' + parentNode.bibliography + '</p>' +
        '</div>' +
      '</div>';
    }
    if (_item_obj.type === 'child') {
      console.log('it\'s a child');
    }
    _tooltip += '</div>';

    // Build dialog
    $dialog = jQuery('#dialog');
    _dialog_width = $dialog.width();
    console.log('width = ' + _dialog_width);
    var _left = 0;
    if ((evt.pageX + _dialog_width) > jQuery(window).width()) {
      console.log('too far to the right');
      _left = evt.pageX - 450;
    } else {
      _left = evt.pageX;
    }
    $dialog.find('.dialog-body').html(_tooltip);
    $dialog
      .css({
        'top': evt.pageY - offset * 2,
        'left': _left,
        'padding': offset,
        'width': '450px',
        // 'border': '1px solid black'
      })
      .fadeIn('slow');
    $dialog.on('mouseenter', function() {
      // console.log('mouseenter');
      $dialog.bind('mouseleave', function() {
        // console.log('mouseleave');
          $dialog.fadeOut('slow');
          $dialog.unbind('mouseenter mouseleave');
      })
    })
  }
});
viz.zoomlevel = 0;
// Zoom event listener
viz.chart.on('graphRoam', function(e) {
  // console.log('zoomed');
  // console.log(e);
  if (e.zoom) {
    // console.log('has zoom node');
    // Update zoom level
    if (e.zoom < 1) {
      viz.zoomLevel = viz.zoomLevel - Math.abs( e.zoom - 1 );
    } else {
      viz.zoomLevel = viz.zoomLevel + Math.abs( e.zoom - 1 );
    }
    // console.log('viz.zoomLevel = ' + viz.zoomLevel);
    // Update label display based on zoom level
    if (viz.zoomLevel > 0.35) {
      subtopicLabel.normal.show = true;
      viz.rebuild();
      viz.chart.setOption(setup.options);
    } else {
      subtopicLabel.normal.show = false;
      viz.rebuild();
      viz.chart.setOption(setup.options);
    }
  }
});
