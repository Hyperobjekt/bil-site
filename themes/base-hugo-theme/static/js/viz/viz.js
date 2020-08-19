// TODOS_
// _ make sure label appears on highlight
//   _ and for all focused?
// _ make masked opacity higher (issue)
// _ fix single-fire js collapse handler (https://stackoverflow.com/a/17202426/13174944)
// _ merge master
// _ implement tabbed subthemes
// _ 
// 
// 
// 

//   viz.chart.dispatchAction({
//     type: 'downplay/highlight', 
//     name: 'Work',
//    })
// viz.chart.dispatchAction({
//     type: 'focusNodeAdjacency',
// Use seriesId or seriesIndex or seriesName to specify
// the target series.
// Use either `dataIndex` or `edgeDataIndex` to specify
// the target node or target edge.
//     dataIndex: 14,
// })


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
setup.strings.subtheme = 'SUB-THEME';
setup.strings.bibliography = 'BIBLIOGRAPHY';
setup.strings.summary = 'SUMMARY';
setup.strings.claims = 'CLAIMS';
setup.strings.relatedTopics = 'RELATED TOPICS';
setup.strings.readMore = 'READ MORE';
setup.nodes = [];
setup.links = [];
setup.linkIndex = 0;
setup.colorIndex = 0;
setup.childRepulsion = 75000;
setup.childAngle = 18;
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
  show: false,
  position: 'right',
  contain: false,
  backgroundColor: 'transparent',
  textStyle: {
    color: '#000',
    fontWeight: 'bold',
    fontFace: 'sofia-pro'
  }
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
  normal: {
    position: 'right',
    show: true,
    textStyle: {
      color: '#000',
      // fontWeight: '600',
      fontFamily: 'SofiaPro-Regular',
      fontSize: 18,
      lineHeight: 43.2
    },
  },
  formatter: function(el) {
    console.log('formatter', el);
    if (el.data.id === viz.active.hovered) {
      return el.data.value + '<br>Click for more';
    } else {
      return el.data.value + 'blah';
    }
  }
}
viz.showSubtopicLabel = false;
let subtopicLabel = {
  // show: false,
  normal: {
    show: viz.showSubtopicLabel,
    position: 'right',
    textStyle: {
      color: '#000',
      fontWeight: '100',
      fontFamily: 'SofiaPro-Regular',
      fontSize: 16,
      fontStyle: 'normal'
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
    hoverAnimation: false,
    x: 0,
    y: 0,
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
  viz.parents.forEach(function(el, idx) {
    // console.log(el.title);
    if (!!el.display) {
      // Add item to nodes array
      const item = {
        id: el.id,
        // dataIndex: idx+1, TODO: fix and replace hard-coded values in parentNodes.yml
        name: el.title,
        value: el.title,
        category: el.id,
        x: el.xAxis,
        y: el.yAxis,
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
      // const label = { ...subtopicLabel }
      // if (el.id === viz.active.hovered || el.id === viz.active.clicked) {
      //   label.normal.show = true;
      // }
      const item = {
        id: el.id,
        name: el.title,
        value: el.title,
        category: el.id,
        x: el.xAxis,
        y: el.yAxis,
        symbol: 'circle',
        symbolSize: 15,
        itemStyle: {
          color: _parent[0].itemStyle.color,
        },
        tooltip: subtopicTooltip,
        label: subtopicLabel // label
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
  coordinateSystem: 'cartesian2d',
  animation: true,
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  tooltip: {
    show: false,
  },
  // textStyle: {
  //   extraCssText: 'z-index:500;'
  // },
  series : [
    {
      name: 'UBI',
      type: 'graph',
      zlevel: 1000,
      layout: 'none',
      nodeScaleRatio: 0.35,
      roam: true,
      draggable: true,
      data: setup.nodes,
      links: setup.links,
      focusNodeAdjacency: false,
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
        curveness: 0.2,
        width: 1.5
      },
      // emphasis: {
      //   lineStyle: {
      //     width: 6
      //   }
      // }
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

// open and close text-panel
jQuery('#text-panel .toggle').click(function(){
  jQuery('#viz-parent').toggleClass('text-panel-open');
  setTimeout(() => {
    viz.chart.resize();
  }, 300);
});

// remove node focus when closing text-panel section
jQuery('#text-panel .collapse').on('hide.bs.collapse', function(e) {
  viz.chart.dispatchAction({
    type: 'unfocusNodeAdjacency',
    seriesName: 'UBI',
  });
});

// focus node when opening corresponding text-panel section
jQuery('#text-panel .collapse').on('show.bs.collapse', function(e) {
  const id = e.currentTarget.dataset.id;
  var _item_obj = viz.getItemObj(id);

  // without setTimeout, this may fire before hide.bs.collapse's 'unfocusNodeAdjacency',
  // so user wouldn't see the new node focused
  setTimeout(() => {
    viz.chart.dispatchAction({
      type: 'focusNodeAdjacency',
      seriesName: 'UBI',
      dataIndex: _item_obj.dataIndex,
    });
  }, 200);
});

window.onresize = function(){
  viz.chart.resize();
  viz.chart.dispatchAction({
    type: 'unfocusNodeAdjacency',
    seriesName: 'UBI',
  });
};

// Init eCharts
viz.chart = echarts.init(document.getElementById('viz-space'));
viz.chart.showLoading();
viz.chart.setOption(setup.options);
viz.chart.hideLoading();

viz.zoomLevel = null;
// Item click listener

viz.chart.on('click', function(e) {

  if (e.dataType === 'node') {

    if (e.data.id === 'root') {
      return;
    }
    var nodeID = e.data.id;
    var vSp = jQuery('#viz-space');
    viz.active.clicked = e.data.id;
    var evt = window.event;
    
    var _item_obj = viz.getItemObj(nodeID);

    var parentId = nodeID;
    var dataIndex = _item_obj.dataIndex;
    if (_item_obj.type === 'child') {
      parentId = _item_obj.parent;
      var _parent_obj = viz.getItemObj(parentId);
      dataIndex = _parent_obj.dataIndex;
    }
    
    // make sure text-panel is open
    jQuery('#viz-parent').addClass('text-panel-open');

    // open the corresponding text-panel section
    // TODO: only works once(?)
    // jQuery.prototype.trigger = jQuery.prototype.triggerHandler;
    jQuery(`#text-panel .collapse[data-id='${parentId}'`).collapse();

    if (_item_obj.type === 'child') {
      jQuery(`#text-panel a[href="#pills-${nodeID}"]`).tab('show');
    }

    // wait a beat...
    setTimeout(() => {
      // then resize chart (in case panel just opened)
      viz.chart.resize();

      // and focus the corresponding node
      viz.chart.dispatchAction({
        type: 'focusNodeAdjacency',
        seriesName: 'UBI',
        dataIndex: dataIndex,
      });

      // scroll to the section in the text-panel (https://stackoverflow.com/a/2906009/13174944)
      var $container = jQuery('#text-panel .content'),
        $scrollTo = jQuery('#heading-' + parentId);
      $container.animate({
        scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
      });
    }, 300);

    // var offset = e.data.symbolSize + (e.data.symbolSize * viz.zoomlevel * 400);
    // var _item_obj = viz.getItemObj(e.data.id);
    // // console.log('_item_obj')
    // // console.log(_item_obj);
    // var _item_links = viz.getItemLinks(e.data.id);
    // var _style = 'style="max-height:' + (jQuery(window).height() * 0.75) + 'px;overflow-y:scroll;"';
    // let _tooltip = '<div class="tip">';
    // // Set up accordion content.
    // if (_item_obj.type === 'parent') {
    //   // console.log('it\'s a parent');
    //   _tooltip += '<span class="subtext">' + setup.strings.theme + '</span>' +
    //   '<div class="theme title">' + e.data.name + '</div>';
    //   // If there are links, render them.
    //   if (_item_links.length >= 1) {
    //     _tooltip += '<span class="subtext">' + setup.strings.subthemes + '</span>';
    //     _item_links.forEach(function(item) {
    //       const related = viz.getItemObj(item.target);
    //     _tooltip += '<div class="related title">' + related.title + '</div>';
    //     });
    //   }

    //   var parentNodes = Object.values(viz.parents);
    //   var parentNode = parentNodes.filter(function(el) {
    //     return el.id == nodeID
    //   })
    //   // console.log('parentNode');
    //   // console.log(parentNode);
    //   if (parentNode[0].bibliography) {
    //     _tooltip += '<a class="toggle-info" data-toggle="collapse" href="#collapseBib" role="button" aria-expanded="false" aria-controls="collapseBib">' +
    //       '<span class="label">' +
    //         setup.strings.bibliography +
    //       '</span>' +
    //       '<span class="icon">&plus;</span>' +
    //     '</a>' +
    //     '<div class="collapse" id="collapseBib">' +
    //       '<div class="card card-body">' +
    //         '<p>' + parentNode[0].bibliography + '</p>' +
    //       '</div>' +
    //     '</div>';
    //   }
    // }
    // if (_item_obj.type === 'child') {
    //   // console.log('it\'s a child');
    //   const parentTitle = viz.getItemObj(_item_obj.parent).title;
    //   // console.log('Parent is ' + parentTitle);
    //   _tooltip += '<span class="subtext">' + setup.strings.theme + '</span>' +
    //     '<div class="theme title">' + parentTitle + '</div>';
    //   _tooltip += '<span class="subtext">' + setup.strings.subtheme + '</span>' +
    //     '<div class="theme title">' + e.data.name + '</div>';

    //   if (_item_obj.summary) {
    //     _tooltip += '<a class="toggle-info" data-toggle="collapse" href="#collapseSumm" role="button" aria-expanded="false" aria-controls="collapseSumm">' +
    //       '<span class="label">' +
    //         setup.strings.summary +
    //       '</span>' +
    //       '<span class="icon">&plus;</span>' +
    //     '</a>' +
    //     '<div class="collapse" id="collapseSumm">' +
    //       '<div class="card card-body">' +
    //         '<p>' + _item_obj.summary + '</p>' +
    //       '</div>' +
    //     '</div>';
    //   }

    //   if (_item_obj.claims) {
    //     _tooltip += '<a class="toggle-info" data-toggle="collapse" href="#collapseClaims" role="button" aria-expanded="false" aria-controls="collapseClaims">' +
    //       '<span class="label">' +
    //         setup.strings.claims +
    //       '</span>' +
    //       '<span class="icon">&plus;</span>' +
    //     '</a>' +
    //     '<div class="collapse" id="collapseClaims">' +
    //       '<div class="card card-body">' +
    //         '<p>' + _item_obj.claims + '</p>' +
    //       '</div>' +
    //     '</div>';
    //   }

    //   if (_item_obj.relatedTopics) {
    //     _tooltip += '<a class="toggle-info" data-toggle="collapse" href="#collapseRelatedTopics" role="button" aria-expanded="false" aria-controls="collapseRelatedTopics">' +
    //       '<span class="label">' +
    //         setup.strings.relatedTopics +
    //       '</span>' +
    //       '<span class="icon">&plus;</span>' +
    //     '</a>' +
    //     '<div class="collapse" id="collapseRelatedTopics">' +
    //       '<div class="card card-body">' +
    //         '<ul>';
    //           _item_obj.relatedTopics.forEach((el) => {
    //             _tooltip += '<li>' + el + '</li>';
    //           });
    //         _tooltip += '</ul>' +
    //       '</div>' +
    //     '</div>';
    //   }

    //   if (_item_obj.readMore) {
    //     _tooltip += '<a class="toggle-info" data-toggle="collapse" href="#collapseReadMore" role="button" aria-expanded="false" aria-controls="collapseReadMore">' +
    //       '<span class="label">' +
    //         setup.strings.readMore +
    //       '</span>' +
    //       '<span class="icon">&plus;</span>' +
    //     '</a>' +
    //     '<div class="collapse" id="collapseReadMore">' +
    //       '<div class="card card-body">' +
    //         '<p>' + _item_obj.readMore + '</p>' +
    //       '</div>' +
    //     '</div>';
    //   }
    // }
    // _tooltip += '</div>';

    // // Build dialog
    // $dialog = jQuery('#dialog');
    // _dialog_width = $dialog.width();
    // // console.log('width = ' + _dialog_width);
    // var _left = 0;
    // if ((evt.pageX + _dialog_width) > jQuery(window).width()) {
    //   // console.log('too far to the right');
    //   _left = evt.pageX - 450;
    // } else {
    //   _left = evt.pageX;
    // }
    // $dialog.find('.dialog-body').html(_tooltip);
    // $dialog
    //   .css({
    //     'top': evt.pageY - offset * 2,
    //     'left': _left,
    //     'padding': offset,
    //     'width': '450px',
    //     'z-index': 2998
    //   })
    //   .fadeIn('slow');
    // $dialog.on('mouseenter', function() {
    //   // console.log('mouseenter');
    //   $dialog.bind('mouseleave', function() {
    //     // console.log('mouseleave');
    //       $dialog.fadeOut('slow');
    //       $dialog.unbind('mouseenter mouseleave');
    //   })
    // })
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
    if (viz.zoomLevel > 0.75) {
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
