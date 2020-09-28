// ___________ LOGIC NEEDED PRE-INIT ___________
const NAVBAR_HEIGHT = 64; // keep in sync with bil-custom.scss $NAVBAR_HEIGHT (in rem)
const BREAKPOINT_LG = 1200; // breakpoint where we switch from side panel to inline content

jQuery('.scroll-button').click(function (e) {
  const $container = jQuery('html');
  const targetId = jQuery(e.currentTarget).attr('data-target');
  const $scrollTo = jQuery(targetId);
  console.log('TARGET: ', targetId);

  $container.animate({
    scrollTop: $scrollTo.offset().top - NAVBAR_HEIGHT
  }, 700);
})
// ___________ END PRE-INIT LOGIC ___________

/*
 * wait to init until viz scrolled into view
 * anything not needed on page load goes inside this function
 */
const init = () => {
// _______ CONSTS _______
const ZOOM_MAX = 10;
const ZOOM_MIN = .7;
const ZOOM_INITIAL = 1;
const ZOOM_LABEL_CUTOFF = 1.75;
const SHOW_SUBTOPIC_LABEL_DEFAULT = ZOOM_INITIAL > ZOOM_LABEL_CUTOFF;
// how much to change zoom on zoom in/out click (as a proportion, so should be > 1)
const ZOOM_FACTOR = 2;

// viz.zoomLevel = 1;

// _______ SETUP CHARTS _______
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
// viz.active.hovered = null;
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
viz.getParentItemObj = (id) => {
  var _obj = viz.getItemObj(id);
  if (_obj.type === 'parent') {
    return _obj;
  } else {
    var parentId = _obj.parent;
    return viz.getItemObj(parentId);
  }
}
viz.getItemLinks = (id) => {
  // let _obj = null;
  const _links = viz.links.filter(
    function(value) { return value.source === id }
  )
  return _links;
};

// Label for topics and subtopics
const topicLabel = {
  normal: {
    position: 'right',
    show: true,
    textStyle: {
      color: '#6C6349',
      // fontWeight: '600',
      fontFamily: 'SofiaPro-Regular',
      fontSize: 16,
      lineHeight: 43.2
    },
  },
  // formatter: function(el) {
  //   console.log('formatter', el);
  //   if (el.data.id === viz.active.hovered) {
  //     return el.data.value + '<br>Click for more';
  //   } else {
  //     return el.data.value + 'blah';
  //   }
  // }
}
let subtopicLabel = {
  normal: {
    show: SHOW_SUBTOPIC_LABEL_DEFAULT,
    position: 'right',
    textStyle: {
      color: '#6C6349',
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
    name: 'ubi',
    value: 'UBI',
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
        // tooltip: topicTooltip,
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
    )[0]
    const _viz_parent = viz.parents.filter(
      function(value){ return value.id === el.parent }
    )[0]

    if (!_viz_parent.childrenIds) {
      _viz_parent.childrenIds = [];
    }
    _viz_parent.childrenIds.push(el.id);

    if (!!el.display && !!_viz_parent.display) {
      
      // Add item to nodes array
      let label = subtopicLabel

      // TODO: figure out why we can't set an individual label to show
      // if (el.id === viz.active.hovered || el.id === viz.active.clicked) {
      //   label = jQuery.extend(true, {}, label);
      //   label.normal.show = true;
      //   console.log("! ", el.id, label);
      // }

      const item = {
        id: el.id,
        name: el.title, // node name has same value as obj item title (for highlighting)
        value: el.title,
        category: el.id,
        x: el.xAxis,
        y: el.yAxis,
        symbol: 'circle',
        symbolSize: 15,
        itemStyle: {
          color: _parent.itemStyle.color,
        },
        tooltip: {
          show: true,
          formatter: '{c}',
        },
        label: label
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
  toolbox: {
    show: true,
    top: 20,
    left: 20,
    orient: 'vertical',
    // showTitle: false,
    // itemGap: 10,
    title: {
      position: 'right'
    },
    zlevel: 40000,
    feature: {
      myZoomIn: {
        show: true,
        title: ' ',
        icon: 'M13.388,9.624h-3.011v-3.01c0-0.208-0.168-0.377-0.376-0.377S9.624,6.405,9.624,6.613v3.01H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h3.011v3.01c0,0.208,0.168,0.378,0.376,0.378s0.376-0.17,0.376-0.378v-3.01h3.011c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z',
        onclick: function () {
          // figure out new zoom level
          let zoomLevel = getZoomLevel() * ZOOM_FACTOR;
          zoomLevel = (zoomLevel > ZOOM_MAX) ? ZOOM_MAX : zoomLevel;

          // decide whether to show subtheme labels based on zoom level
          const showLabels = (zoomLevel > ZOOM_LABEL_CUTOFF);
          if (showLabels !== subtopicLabel.normal.show) {
            subtopicLabel.normal.show = showLabels;
            viz.rebuild();
          }

          // set zoom on cloned options as not to mutate original with zoomLevel
          const options = jQuery.extend(true, {}, setup.options);
          options.series[0].zoom = zoomLevel;
          viz.chart.setOption(options);
          
          console.log('zoomLevel = ' + zoomLevel);

          // reset highlight if necessary 
          const activeId = viz.active.clicked;
          if (activeId) {
            highlightNodeGroup(activeId);
          }
        }
      },
      myZoomOut: {
        show: true,
        title: ' ',
        icon: 'M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z M13.388,9.624H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h6.775c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z',
        onclick: function () {
          // figure out new zoom level
          let zoomLevel = getZoomLevel() / ZOOM_FACTOR;
          zoomLevel = (zoomLevel < ZOOM_MIN) ? ZOOM_MIN : zoomLevel;

          // decide whether to show subtheme labels based on zoom level
          const showLabels = (zoomLevel > ZOOM_LABEL_CUTOFF);
          if (showLabels !== subtopicLabel.normal.show) {
            subtopicLabel.normal.show = showLabels;
            viz.rebuild();
          }

          // set zoom on cloned options as not to mutate original with zoomLevel
          const options = jQuery.extend(true, {}, setup.options);
          options.series[0].zoom = zoomLevel;
          viz.chart.setOption(options);

          console.log('zoomLevel = ' + zoomLevel);

          // reset highlight if necessary 
          const activeId = viz.active.clicked;
          if (activeId) {
            highlightNodeGroup(activeId);
          }
        }
      },
      myRestore: {
        show: true,
        showTitle: true,
        title: 'Restore',
        icon: 'M3.254,6.572c0.008,0.072,0.048,0.123,0.082,0.187c0.036,0.07,0.06,0.137,0.12,0.187C3.47,6.957,3.47,6.978,3.484,6.988c0.048,0.034,0.108,0.018,0.162,0.035c0.057,0.019,0.1,0.066,0.164,0.066c0.004,0,0.01,0,0.015,0l2.934-0.074c0.317-0.007,0.568-0.271,0.56-0.589C7.311,6.113,7.055,5.865,6.744,5.865c-0.005,0-0.01,0-0.015,0L5.074,5.907c2.146-2.118,5.604-2.634,7.971-1.007c2.775,1.912,3.48,5.726,1.57,8.501c-1.912,2.781-5.729,3.486-8.507,1.572c-0.259-0.18-0.618-0.119-0.799,0.146c-0.18,0.262-0.114,0.621,0.148,0.801c1.254,0.863,2.687,1.279,4.106,1.279c2.313,0,4.591-1.1,6.001-3.146c2.268-3.297,1.432-7.829-1.867-10.101c-2.781-1.913-6.816-1.36-9.351,1.058L4.309,3.567C4.303,3.252,4.036,3.069,3.72,3.007C3.402,3.015,3.151,3.279,3.16,3.597l0.075,2.932C3.234,6.547,3.251,6.556,3.254,6.572z',
        onclick: function () {
          subtopicLabel.normal.show = SHOW_SUBTOPIC_LABEL_DEFAULT;

          // reset zoom
          viz.rebuild();
          const options = jQuery.extend(true, {}, setup.options);
          options.series[0].zoom = ZOOM_INITIAL;
          // options.series[0].center = null;
          viz.chart.setOption(options);

          // reset pan (doesn't center properly without timeout)
          setTimeout(() => {
            viz.chart.dispatchAction({
              type: 'restore',
            });
          }, 10);

          collapsePanelSections();
        }
      },
    },
  },
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
  animationDelay: 700, // wait a beat before initial animation
  animationDurationUpdate: 1000, // resize duration
  animationEasingUpdate: 'quinticInOut',
  tooltip: {
    show: false,
  },
  // textStyle: {
  //   extraCssText: 'z-index:500;'
  // },
  series: [
    {
      // zoom: 1,
      name: 'UBI',
      type: 'graph',
      zlevel: 1000,
      layout: 'none',
      nodeScaleRatio: 0.35,
      roam: 'pan',
      draggable: true,
      data: setup.nodes,
      links: setup.links,
      focusNodeAdjacency: false,
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 16,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        emphasis: {
          borderColor: 'rgb(180,180,180)',
          shadowBlur: 16,
          shadowColor: 'rgba(0, 0, 0, 0.4)'
        }
      },
      lineStyle: {
        //color: 'source',
        color: '#DED8C7',
        curveness: 0.2,
        //width: 1.5
        width: 2,
      },
      // emphasis: {
      //   lineStyle: {
      //     width: 6
      //   }
      // }
    }
  ]
};

// Init eCharts
viz.chart = echarts.init(document.getElementById('viz-space'));
viz.chart.showLoading();
viz.chart.setOption(setup.options);
viz.chart.hideLoading();


// _______ ECHARTS EVENT LISTENERS _______
viz.chart.on('click', function(e) {

  if (e.dataType === 'node') {
    if (e.data.id === 'root') {
      togglePanel()
      return;
    }
    fadeAndRemove('.click-hint')
    
    const nodeId = e.data.id;
    const _item_obj = viz.getItemObj(nodeId);
    
    let subthemeId = nodeId;
    if (_item_obj.type === 'parent') {
      // navigate to first subtheme if it's a parent
      subthemeId = _item_obj.childrenIds[0];
    }

    navigateToSubtheme(subthemeId);
  }
});

// Zoom event listener
viz.chart.on('graphRoam', function(e) {
  // console.log('zoomed', e);
  
  // console.log(e);
  if (e.zoom) {

    let zoomLevel = getZoomLevel();
    console.log('zoomLevel = ' + zoomLevel);
    
    // Update label display based on zoom level, if needed
    const showLabels = (zoomLevel > ZOOM_LABEL_CUTOFF);
    if (showLabels !== subtopicLabel.normal.show) {
      subtopicLabel.normal.show = showLabels;
      viz.rebuild();
      viz.chart.setOption(setup.options);
    } else if (zoomLevel < ZOOM_MIN) { // cap at min
      const options = jQuery.extend(true, {}, setup.options);
      options.series[0].zoom = ZOOM_MIN;
      options.series[0].center = null; // otherwise can center incorrectly
      viz.chart.setOption(options);
    } else if (zoomLevel > ZOOM_MAX) { // cap at max
      const options = jQuery.extend(true, {}, setup.options);
      options.series[0].zoom = ZOOM_MAX;
      viz.chart.setOption(options);
    } else {
      return; // don't need to rehighlight if no rebuild
    }

    // rehighlight if necessary
    const activeId = viz.active.clicked;
    if (activeId) {
      highlightNodeGroup(activeId);
    }
    
  }
});

// _______ OTHER VIZ ELEMENTS LISTENERS _______

// open and close text-panel
jQuery('.viz-parent .toggle, .viz-blocker').click(function (e) {
  togglePanel();
});

// remove node highlight when closing text-panel section
jQuery('#text-panel .collapse').on('hide.bs.collapse', function (e) {
  // scroll up the text-panel before section closes to avoid the collapse causing page scroll on Chrome
  const $container = window.innerWidth > BREAKPOINT_LG ? jQuery("html, body") : jQuery('#text-panel');
  const scrollPos = window.innerWidth > BREAKPOINT_LG ? jQuery("#text-panel").offset().top : 0;
  $container.animate({
    scrollTop: scrollPos
  }, 100);

  const id = e.currentTarget.dataset.id;

  const activeParent = viz.getParentItemObj(viz.active.clicked);
  if (id === activeParent.id) {
    // only allow this event to cancel out the active clicked item if *this section* is the one
    // marked active (could've already been overwritten if this collapse was triggered by a click
    // to another node/section header). ensures we make the proper check below in shown.bs.collapse  
    viz.active.clicked = null;
  }

  viz.chart.dispatchAction({
    type: 'downplay',
    seriesName: 'UBI',
  });
});

// highlight node when opening corresponding text-panel section
// use 'shown' rather than 'show' so it doesn't fire before hide.bs.collapse's
// 'downplay', which would immediately undo this highlight
jQuery('#text-panel .collapse').on('shown.bs.collapse', function (e) {
  const id = e.currentTarget.dataset.id;

  const activeParent = viz.getParentItemObj(viz.active.clicked);

  if (id === activeParent.id) {
    // this event *may* have been triggered by the clicking of a subtheme viz node
    // (which then triggered the showing of this parent theme section)
    // in that case we don't want to overwrite our newly active subtheme id
    return;
  }

  viz.active.clicked = id;
  highlightNodeGroup(id);
});

// highlight subtheme node when its tab is clicked
jQuery('#text-panel .nav-link').on('shown.bs.tab', function (e) {
  // will also fire when subtheme node is clicked directly, leading to an "echoed" call of
  // highlightNodeGroup/repeat setting of active.clicked, but with same value so with no impact
  const id = e.currentTarget.dataset.id;

  viz.active.clicked = id;
  highlightNodeGroup(id);
});

// navigate to related topics
jQuery('.related-link').click(function (e) {
  const { target } = e.currentTarget.dataset;

  navigateToSubtheme(target);
})

// open citation links in new tab
jQuery('.citations a').click(function (e) {
  window.open(e.currentTarget.href);
  return false;
})

// Give cards sticky headers when open
jQuery('.btn-link').parent().addClass('card-header-sticky');


// wait for user to finish resizing before adjusting
window.onresize = debounce(function () {
  viz.chart.resize();

  if (viz.active.clicked) {
    highlightNodeGroup(viz.active.clicked);
  }
}, 100);

// _______ HELPERS _______
function highlightNodeGroup(elId) {
  if (!elId) {
    return;
  }

  viz.chart.dispatchAction({
    type: 'downplay',
    seriesName: 'UBI',
  });
  
  const el = viz.getItemObj(elId);
  const elsToHighlight = [el];
  if (el.type === 'parent') { // parent node was clicked - highlight first child as well
    const child = viz.getItemObj(el.childrenIds[0]);
    elsToHighlight.push(child);
  } else {
    const parent = viz.getParentItemObj(elId);
    elsToHighlight.push(parent);
  }
  elsToHighlight.forEach(elem => {
    viz.chart.dispatchAction({
      type: 'highlight',
      seriesName: 'UBI',
      name: elem.title, // node name has same value as obj item title
    });
  })
}

function scrollToTheme (themeId) {
  // scroll container depends on width
  const $container = window.innerWidth > BREAKPOINT_LG 
    ? jQuery("html, body") 
    : jQuery('#text-panel');
  const $scrollTo = jQuery('#heading-' + themeId);
  const scrollPos = window.innerWidth > BREAKPOINT_LG 
    ? $scrollTo.parent('.card').offset().top - 64 
    : $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - 64

  $container.animate({
    scrollTop: scrollPos
  });
}

function navigateToSubtheme(subthemeId) {
  if (subthemeId === viz.active.clicked) {
    return; // nothing to do here
  }

  const _parent_obj = viz.getParentItemObj(subthemeId);
  const parentId = _parent_obj.id;
  
  const sameParent = viz.active.clicked &&
    parentId === viz.getParentItemObj(viz.active.clicked).id;

  viz.active.clicked = subthemeId; // now we can update

  if (sameParent) {
    jQuery(`#text-panel a[href='#pills-${subthemeId}']`).tab('show');
    
    // technically redundant, as it will also be triggered by bs.tab.shown
    highlightNodeGroup(subthemeId);

    // use the card's offset - otherwise if user has scrolled down in the subtheme,
    // that scroll offset will be preserved. we want to scroll to theme's top
    scrollToTheme(parentId)
    return
  }

  // make sure text-panel is open
  jQuery('body').addClass('text-panel-open');

  // open the corresponding text-panel section and subtheme tab
  jQuery(`#text-panel .collapse[data-id='${parentId}'`).collapse('show');
  jQuery(`#text-panel a[href='#pills-${subthemeId}']`).tab('show');

  
  // then highlight the corresponding node group
  highlightNodeGroup(subthemeId);
  
  // wait a beat...
  setTimeout(() => {
    // resize chart (in case panel just opened)
    viz.chart.resize();
    scrollToTheme(parentId)
  }, 450); // if we don't wait long enough, the scroll lands at the wrong place due to dynamically collapsing/expanding sections (bumped from 300)
}

function collapsePanelSections() {
  const parent = viz.getParentItemObj(viz.active.clicked);
  jQuery(`#text-panel .collapse[data-id='${parent.id}'`).collapse('hide');
  viz.active.clicked = null;
}

function togglePanel() {
  fadeAndRemove('.click-hint')
  jQuery('body').toggleClass('text-panel-open');

  // only needs to happen on close, but when toggle is clicked to open nothing should be active anyways
  collapsePanelSections();

  setTimeout(() => {
    viz.chart.resize();
  }, 450); // gives panel enough time to expand (on open) to avoid showing an awkward gap in the page
}

function getZoomLevel() {
  console.log('zoom: ', viz.chart.getOption().series[0].zoom);
  return viz.chart.getOption().series[0].zoom;
}

function fadeAndRemove(selector, duration=1000) {
  const $elem = jQuery(selector)
  $elem.animate({
    opacity: 0
  }, duration, () => {
    $elem.remove();
  })
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

}
// ___________ END INIT ___________

function initOnceScrolled(e) {
  const { innerHeight, pageYOffset } = window;
  const vizThreshold = jQuery('#viz-section').offset().top;
  const buffer = 25; // must pass vizThreshold by at least this much to trigger init
  
  if ((innerHeight + pageYOffset) > (vizThreshold + buffer)) {
    init();
    jQuery(window).off('scroll', initOnceScrolled); // no longer needed
  }
}

jQuery(window).on('scroll', initOnceScrolled);
initOnceScrolled(); // in case page loads already scrolled
