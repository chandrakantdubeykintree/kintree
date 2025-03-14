var FamilyTree = function (e, t) {
  var i = this;
  if (
    ((this.element = e),
    (this.config = FamilyTree.mergeDeep(FamilyTree._defaultConfig(t), t)),
    (this._layoutConfigs = {
      base: {
        orientation: this.config.orientation,
        levelSeparation: this.config.levelSeparation,
        mixedHierarchyNodesSeparation:
          this.config.mixedHierarchyNodesSeparation,
        assistantSeparation: this.config.assistantSeparation,
        subtreeSeparation: this.config.subtreeSeparation,
        siblingSeparation: this.config.siblingSeparation,
        layout: this.config.layout,
        columns: this.config.columns,
        collapse: this.config.collapse,
        partnerNodeSeparation: this.config.partnerNodeSeparation,
      },
    }),
    this.config.tags)
  )
    for (var r in this.config.tags) {
      var a = this.config.tags[r];
      null != a.subTreeConfig &&
        (this._layoutConfigs[r] = {
          orientation:
            null != a.subTreeConfig.orientation
              ? a.subTreeConfig.orientation
              : this.config.orientation,
          levelSeparation:
            null != a.subTreeConfig.levelSeparation
              ? a.subTreeConfig.levelSeparation
              : this.config.levelSeparation,
          mixedHierarchyNodesSeparation:
            null != a.subTreeConfig.mixedHierarchyNodesSeparation
              ? a.subTreeConfig.mixedHierarchyNodesSeparation
              : this.config.mixedHierarchyNodesSeparation,
          assistantSeparation:
            null != a.subTreeConfig.assistantSeparation
              ? a.subTreeConfig.assistantSeparation
              : this.config.assistantSeparation,
          subtreeSeparation:
            null != a.subTreeConfig.subtreeSeparation
              ? a.subTreeConfig.subtreeSeparation
              : this.config.subtreeSeparation,
          siblingSeparation:
            null != a.subTreeConfig.siblingSeparation
              ? a.subTreeConfig.siblingSeparation
              : this.config.siblingSeparation,
          layout:
            null != a.subTreeConfig.layout
              ? a.subTreeConfig.layout
              : this.config.layout,
          columns:
            null != a.subTreeConfig.columns
              ? a.subTreeConfig.columns
              : this.config.columns,
          collapse:
            null != a.subTreeConfig.collapse
              ? a.subTreeConfig.collapse
              : this.config.collapse,
          partnerNodeSeparation:
            null != a.subTreeConfig.partnerNodeSeparation
              ? a.subTreeConfig.partnerNodeSeparation
              : this.config.partnerNodeSeparation,
        });
    }
  if (
    ((this._event_id = FamilyTree._guid()),
    !this.config.searchFields.length && this.config.nodeBinding)
  )
    for (var n in this.config.nodeBinding)
      -1 == n.indexOf("img") &&
        "function" != typeof this.config.nodeBinding[n] &&
        this.config.searchFields.push(this.config.nodeBinding[n]);
  FamilyTree._validateConfig(this.config) &&
    ((this._vScroll = {}),
    this.config.ui || (this.ui = FamilyTree.ui),
    this.config.editUI
      ? (this.editUI = this.config.editUI)
      : (this.editUI = new FamilyTree.editUI()),
    this.editUI.init(this),
    (this.manager = new FamilyTree.manager(this.config, this._layoutConfigs)),
    this.config.searchUI
      ? (this.searchUI = this.config.searchUI)
      : (this.searchUI = new FamilyTree.searchUI()),
    this.config.nodeMenuUI
      ? (this.nodeMenuUI = this.config.nodeMenuUI)
      : (this.nodeMenuUI = new FamilyTree.menuUI()),
    this.nodeMenuUI.init(this, this.config.nodeMenu),
    this.config.nodeCircleMenuUI
      ? (this.nodeCircleMenuUI = this.config.nodeCircleMenuUI)
      : (this.nodeCircleMenuUI = new FamilyTree.circleMenuUI()),
    this.nodeCircleMenuUI.init(this, this.config.nodeCircleMenu),
    this.config.nodeContextMenuUI
      ? (this.nodeContextMenuUI = this.config.nodeContextMenuUI)
      : (this.nodeContextMenuUI = new FamilyTree.menuUI()),
    this.nodeContextMenuUI.init(this, this.config.nodeContextMenu),
    this.config.toolbarUI
      ? (this.toolbarUI = this.config.toolbarUI)
      : (this.toolbarUI = new FamilyTree.toolbarUI()),
    this.config.notifierUI
      ? (this.notifierUI = this.config.notifierUI)
      : (this.notifierUI = new FamilyTree.notifierUI()),
    this.notifierUI.init(this),
    this.config.menuUI
      ? (this.menuUI = this.config.menuUI)
      : (this.menuUI = new FamilyTree.menuUI()),
    this.menuUI.init(this, this.config.menu),
    this.config.xScrollUI ||
      (this.xScrollUI = new FamilyTree.xScrollUI(
        this.element,
        this.config,
        function () {
          return {
            boundary: i.response.boundary,
            scale: i.getScale(),
            viewBox: i.getViewBox(),
            padding: i.config.padding,
          };
        },
        function (e) {
          i.setViewBox(e);
        },
        function () {
          i._draw(!0, FamilyTree.action.xScroll);
        }
      )),
    this.config.yScrollUI ||
      (this.yScrollUI = new FamilyTree.yScrollUI(
        this.element,
        this.config,
        function () {
          return {
            boundary: i.response.boundary,
            scale: i.getScale(),
            viewBox: i.getViewBox(),
            padding: i.config.padding,
          };
        },
        function (e) {
          i.setViewBox(e);
        },
        function () {
          i._draw(!0, FamilyTree.action.xScroll);
        }
      )),
    this.element.classList.add("bft-" + this.config.mode),
    (this._gragStartedId = null),
    (this._timeout = null),
    (this._touch = null),
    (this._initialized = !1),
    (this._moveInterval = null),
    (this._movePosition = null),
    (this.response = null),
    (this.nodes = null),
    this._setInitialSizeIfNotSet(),
    this.config.nodes.length > 0 && this._draw(!1, FamilyTree.action.init));
};
(FamilyTree._defaultConfig = function (e) {
  return {
    interactive: !0,
    mode: "light",
    lazyLoading: !0,
    enableDragDrop: !1,
    enableSearch: !0,
    enableTouch: !1,
    enableKeyNavigation: !1,
    miniMap: !1,
    nodeMenu: null,
    nodeCircleMenu: null,
    nodeContextMenu: null,
    menu: null,
    toolbar: !1,
    sticky: !0,
    nodeMouseClick: FamilyTree.action.details,
    nodeMouseDbClick: FamilyTree.none,
    mouseScrool: FamilyTree.action.zoom,
    showXScroll: FamilyTree.none,
    showYScroll: FamilyTree.none,
    template: "ana",
    tags: {},
    min: !1,
    nodeBinding: {},
    linkBinding: {},
    searchFields: [],
    searchDisplayField: null,
    searchFieldsWeight: null,
    nodes: [],
    clinks: [],
    slinks: [],
    levelSeparation: 60,
    siblingSeparation: 20,
    subtreeSeparation: 40,
    mixedHierarchyNodesSeparation: 15,
    assistantSeparation: 100,
    minPartnerSeparation: 50,
    partnerChildrenSplitSeparation: 20,
    partnerNodeSeparation: 15,
    columns: 10,
    padding: 30,
    orientation: FamilyTree.orientation.top,
    layout: FamilyTree.normal,
    scaleInitial: 1,
    scaleMin: 0.1,
    scaleMax: 5,
    orderBy: null,
    editUI: null,
    searchUI: null,
    xScrollUI: null,
    yScrollUI: null,
    nodeMenuUI: null,
    nodeCircleMenuUI: null,
    nodeContextMenuUI: null,
    toolbarUI: null,
    notifierUI: null,
    menuUI: null,
    exportUrl: "https://balkan.app/export",
    collapse: {},
    expand: {},
    align: FamilyTree.CENTER,
    UI: null,
    anim: {
      func: FamilyTree.anim.outPow,
      duration: 200,
    },
    zoom: {
      speed: 120,
      smooth: 12,
    },
    roots: null,
    state: null,
    editForm: {
      readOnly: !1,
      titleBinding: "name",
      photoBinding: "img",
      addMore: "Add more fileds",
      addMoreBtn: "Add",
      addMoreFieldName: "Field name",
      generateElementsFromFields: !0,
      buttons: {
        edit: {
          icon: FamilyTree.icon.edit(24, 24, "#fff"),
          text: "Edit",
          hideIfEditMode: !0,
          hideIfDetailsMode: !1,
        },
        share: {
          icon: FamilyTree.icon.share(24, 24, "#fff"),
          text: "Share",
        },
        pdf: {
          icon: FamilyTree.icon.pdf(24, 24, "#fff"),
          text: "Save as PDF",
        },
        remove: {
          icon: FamilyTree.icon.remove(24, 24, "#fff"),
          text: "Remove",
          hideIfDetailsMode: !0,
        },
      },
      elements: [],
    },
  };
}),
  (FamilyTree.prototype.load = function (e) {
    return (
      (this.config.nodes = e), this._draw(!1, FamilyTree.action.init), this
    );
  }),
  (FamilyTree.prototype.loadXML = function (e) {
    var t = FamilyTree._xml2json(e);
    this.load(t);
  }),
  (FamilyTree.prototype.getXML = function () {
    return FamilyTree._json2xml(this.config.nodes);
  }),
  (FamilyTree.prototype.on = function (e, t) {
    return FamilyTree.events.on(e, t, this._event_id), this;
  }),
  (FamilyTree.prototype.draw = function (e, t, i) {
    null == e && (e = FamilyTree.action.update), this._draw(!1, e, t, i);
  }),
  (FamilyTree.prototype._draw = function (e, t, i, r) {
    var a = this;
    this._hideBeforeAnimationCompleted = !1;
    var n = t == FamilyTree.action.init ? null : this.getViewBox();
    this.manager.read(
      e,
      this.width(),
      this.height(),
      n,
      t,
      i,
      function (e) {
        t != FamilyTree.action.exporting &&
          ((a.nodes = e.nodes),
          (a.visibleNodeIds = e.visibleNodeIds),
          (a.roots = e.roots)),
          (a.editUI.fields = e.allFields);
        var n = {
          defs: "",
        };
        FamilyTree.events.publish("renderdefs", [a, n]);
        var o = a.ui.defs(n.defs),
          l = a.getScale(e.viewBox);
        o += a.ui.pointer(a.config, t, l);
        var s = a.getViewBox(),
          d = e.viewBox;
        n = {
          content: o,
          res: e,
        };
        FamilyTree.events.publish("prerender", [a, n]), (o = n.content);
        for (var c = 0; c < e.visibleNodeIds.length; c++) {
          var m = e.nodes[e.visibleNodeIds[c]],
            h = a._get(m.id);
          FamilyTree.RENDER_LINKS_BEFORE_NODES &&
            (o += a.ui.link(m, a, l, e.bordersByRootIdAndLevel, e.nodes, t)),
            (o += a.ui.node(
              m,
              h,
              e.animations,
              a.config,
              void 0,
              void 0,
              void 0,
              t,
              l,
              a
            ));
        }
        for (c = 0; c < e.visibleNodeIds.length; c++) {
          m = e.nodes[e.visibleNodeIds[c]];
          FamilyTree.RENDER_LINKS_BEFORE_NODES ||
            (o += a.ui.link(m, a, l, e.bordersByRootIdAndLevel, e.nodes, t)),
            (o += a.ui.expandCollapseBtn(a, m, a._layoutConfigs, t, l));
        }
        n = {
          content: o,
          res: e,
        };
        if (
          (FamilyTree.events.publish("render", [a, n]),
          (o = n.content),
          (e = n.res),
          (o += a.ui.lonely(a.config)),
          t !== FamilyTree.action.exporting)
        ) {
          (t !== FamilyTree.action.centerNode &&
            t !== FamilyTree.action.insert &&
            t !== FamilyTree.action.expand &&
            t !== FamilyTree.action.collapse &&
            t !== FamilyTree.action.update) ||
            (d = s),
            t === FamilyTree.action.init && null != s && (d = s),
            (a.response = e);
          v = a.ui.svg(a.width(), a.height(), d, a.config, o);
          if (a._initialized) {
            var p = a.getSvg(),
              f = p.parentNode;
            f.removeChild(p),
              f.insertAdjacentHTML("afterbegin", v),
              a._attachEventHandlers(),
              a.xScrollUI.addListener(a.getSvg()),
              a.yScrollUI.addListener(a.getSvg()),
              a.xScrollUI.setPosition(),
              a.yScrollUI.setPosition();
          } else
            (a.element.innerHTML = a.ui.css() + v + a.ui.menuButton(a.config)),
              a._attachInitEventHandlers(),
              a._attachEventHandlers(),
              a.xScrollUI.create(a.width(), a.config.padding),
              a.xScrollUI.setPosition(),
              a.xScrollUI.addListener(a.getSvg()),
              a.yScrollUI.create(a.height(), a.config.padding),
              a.yScrollUI.setPosition(),
              a.yScrollUI.addListener(a.getSvg()),
              a.config.enableSearch && a.searchUI.init(a),
              a.toolbarUI.init(a, a.config.toolbar);
          var y = !1;
          a.notifierUI.show(e.notif);
          var u = a.response.animations;
          if (u[0].length > 0) {
            a._hideBeforeAnimation(u[0].length);
            for (c = 0; c < u[0].length; c++)
              u[0][c] = a.getNodeElement(u[0][c]);
            FamilyTree.anim(
              u[0],
              u[1],
              u[2],
              a.config.anim.duration,
              a.config.anim.func,
              function () {
                y ||
                  (r && r(),
                  FamilyTree.events.publish("redraw", [a]),
                  a._showAfterAnimation(),
                  (y = !0));
              }
            );
          }
          t === FamilyTree.action.centerNode
            ? FamilyTree.anim(
                a.getSvg(),
                {
                  viewbox: s,
                },
                {
                  viewbox: a.response.viewBox,
                },
                a.config.anim.duration,
                a.config.anim.func,
                function () {
                  a.ripple(i.options.rippleId),
                    y ||
                      (r && r(),
                      FamilyTree.events.publish("redraw", [a]),
                      a._showAfterAnimation(),
                      (y = !0));
                },
                function () {
                  a.xScrollUI.setPosition(), a.yScrollUI.setPosition();
                }
              )
            : !s ||
              !a.response ||
              (s[0] == a.response.viewBox[0] &&
                s[1] == a.response.viewBox[1] &&
                s[2] == a.response.viewBox[2] &&
                s[3] == a.response.viewBox[3]) ||
              (t !== FamilyTree.action.insert &&
                t !== FamilyTree.action.expand &&
                t !== FamilyTree.action.collapse &&
                t !== FamilyTree.action.update &&
                t !== FamilyTree.action.init)
            ? 0 == u[0].length &&
              (y ||
                (r && r(), FamilyTree.events.publish("redraw", [a]), (y = !0)))
            : FamilyTree.anim(
                a.getSvg(),
                {
                  viewbox: s,
                },
                {
                  viewbox: a.response.viewBox,
                },
                500,
                FamilyTree.anim.inOutPow,
                function () {
                  a.xScrollUI.setPosition(),
                    a.yScrollUI.setPosition(),
                    y ||
                      (r && r(),
                      FamilyTree.events.publish("redraw", [a]),
                      (y = !0));
                }
              ),
            a._initialized ||
              ((a._initialized = !0), FamilyTree.events.publish("init", [a]));
        } else {
          var g = e.boundary,
            b = g.maxX - g.minX,
            T = g.maxY - g.minY,
            v = a.ui.svg(b, T, [g.minX, g.minY, b, T], a.config, o, l);
          r(v);
        }
      },
      function (e) {
        FamilyTree.events.publish("ready", [a, e]);
      }
    );
  }),
  (FamilyTree.prototype._setInitialSizeIfNotSet = function () {
    (this.element.style.overflow = "hidden"),
      (this.element.style.position = "relative"),
      0 == this.element.offsetHeight &&
        ((this.element.style.height = "100%"),
        0 == this.element.offsetHeight &&
          (this.element.style.height = "700px")),
      0 == this.element.offsetWidth &&
        ((this.element.style.width = "100%"),
        0 == this.element.offsetWidth && (this.element.style.width = "700px"));
  }),
  (FamilyTree.prototype.getViewBox = function () {
    var e = this.getSvg();
    return FamilyTree._getViewBox(e);
  }),
  (FamilyTree.prototype.setViewBox = function (e) {
    this.getSvg().setAttribute("viewBox", e.toString());
  }),
  (FamilyTree.prototype.width = function () {
    return this.element.offsetWidth;
  }),
  (FamilyTree.prototype.height = function () {
    return this.element.offsetHeight;
  }),
  (FamilyTree.prototype.getScale = function (e) {
    return (
      e || (e = this.getViewBox()),
      FamilyTree.getScale(
        e,
        this.width(),
        this.height(),
        this.config.scaleInitial,
        this.config.scaleMax,
        this.config.scaleMin
      )
    );
  }),
  (FamilyTree.prototype.ripple = function (e, t, i) {
    var r = this.getNode(e);
    if (null != r) {
      var a = this.getNodeElement(e);
      if (null != a) {
        var n = this.getScale(),
          o = r.w / 2,
          l = r.h / 2;
        if (void 0 !== t && void 0 !== i) {
          var s = a.getBoundingClientRect();
          (o = t / n - s.left / n), (l = i / n - s.top / n);
        }
        var d = r.w,
          c = r.h,
          m = d - o > o ? d - o : o,
          h = c - l > l ? c - l : l,
          p = (m = m) > (h = h) ? m : h,
          f = document.createElementNS("http://www.w3.org/2000/svg", "g"),
          y = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "clipPath"
          ),
          u = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
          g = document.createElementNS("http://www.w3.org/2000/svg", "circle"),
          b = FamilyTree.randomId();
        y.setAttribute("id", b);
        var T = {
          ripple: FamilyTree.t(r.templateName, r.min, this.getScale()).ripple,
          node: r,
        };
        FamilyTree.events.publish("ripple", [this, T]),
          u.setAttribute("x", T.ripple.rect ? T.ripple.rect.x : 0),
          u.setAttribute("y", T.ripple.rect ? T.ripple.rect.y : 0),
          u.setAttribute("width", T.ripple.rect ? T.ripple.rect.width : r.w),
          u.setAttribute("height", T.ripple.rect ? T.ripple.rect.height : r.h),
          u.setAttribute("rx", T.ripple.radius),
          u.setAttribute("ry", T.ripple.radius),
          g.setAttribute("clip-path", "url(#" + b + ")"),
          g.setAttribute("cx", o),
          g.setAttribute("cy", l),
          g.setAttribute("r", 0),
          g.setAttribute("fill", T.ripple.color),
          g.setAttribute("class", "bft-ripple"),
          y.appendChild(u),
          f.appendChild(y),
          f.appendChild(g),
          a.appendChild(f),
          FamilyTree.anim(
            g,
            {
              r: 0,
              opacity: 1,
            },
            {
              r: p,
              opacity: 0,
            },
            500,
            FamilyTree.anim.outPow,
            function () {
              a.removeChild(f);
            }
          );
      }
    }
  }),
  (FamilyTree.prototype.center = function (e, t, i) {
    var r,
      a,
      n = e,
      o = !0,
      l = !0;
    t && null != t.parentState && (r = t.parentState),
      t && null != t.childrenState && (a = t.childrenState),
      t && null != t.rippleId && (n = t.rippleId),
      t && null != t.vertical && (o = t.vertical),
      t && null != t.horizontal && (l = t.horizontal);
    var s = {
      parentState: r,
      childrenState: a,
      rippleId: n,
      vertical: o,
      horizontal: l,
    };
    this._draw(
      !1,
      FamilyTree.action.centerNode,
      {
        id: e,
        options: s,
      },
      i
    );
  }),
  (FamilyTree.prototype.fit = function (e) {
    (this.config.scaleInitial = FamilyTree.match.boundary),
      this._draw(
        !0,
        FamilyTree.action.init,
        {
          method: "fit",
        },
        e
      );
  }),
  (FamilyTree.prototype.toggleFullScreen = function () {
    var e = document.querySelector(
      "[" + FamilyTree.attr.tlbr + "r='fullScreen']"
    );
    document.fullscreenElement == this.element ||
    document.webkitFullscreenElement == this.element ||
    document.mozFullScreenElement == this.element ||
    document.msFullscreenElement == this.element
      ? (document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
          ? document.mozCancelFullScreen()
          : document.webkitExitFullscreen
          ? document.webkitExitFullscreen()
          : document.msExitFullscreen && document.msExitFullscreen(),
        e && (e.innerHTML = FamilyTree.toolbarUI.openFullScreenIcon))
      : (this.element.requestFullscreen
          ? this.element.requestFullscreen()
          : this.element.mozRequestFullScreen
          ? this.element.mozRequestFullScreen()
          : this.element.webkitRequestFullscreen
          ? this.element.webkitRequestFullscreen()
          : this.element.msRequestFullscreen &&
            this.element.msRequestFullscreen(),
        e && (e.innerHTML = FamilyTree.toolbarUI.closeFullScreenIcon));
  }),
  (FamilyTree.prototype.getNode = function (e) {
    return this.nodes[e];
  }),
  (FamilyTree.prototype.setLayout = function (e, t) {
    t || (t = "base"),
      (this._layoutConfigs[t].layout = e),
      this._draw(!1, FamilyTree.action.update);
  }),
  (FamilyTree.prototype.setOrientation = function (e, t) {
    t || (t = "base"),
      (this._layoutConfigs[t].orientation = e),
      this._draw(!1, FamilyTree.action.update);
  }),
  (FamilyTree.prototype.search = function (e, t, i) {
    return (
      FamilyTree.isNEU(t) && (t = this.config.searchFields),
      FamilyTree.isNEU(i) && (i = t),
      FamilyTree._search.search(
        this.config.nodes,
        e,
        t,
        i,
        this.config.searchDisplayField,
        this.config.searchFieldsWeight
      )
    );
  }),
  (FamilyTree.prototype._hideBeforeAnimation = function (e) {
    if (
      1 != this._hideBeforeAnimationCompleted &&
      !(e && e < FamilyTree.ANIM_THRESHOLD)
    ) {
      var t = this.element.getElementsByTagName("text");
      if (t.length > FamilyTree.TEXT_THRESHOLD)
        for (var i = 0; i < t.length; i++) t[i].style.display = "none";
      var r = this.element.getElementsByTagName("image");
      if (r.length > FamilyTree.IMAGES_THRESHOLD)
        for (i = 0; i < r.length; i++) r[i].style.display = "none";
      var a = this.element.querySelectorAll(
        "[" + FamilyTree.attr.link_id + "]"
      );
      if (a.length > FamilyTree.LINKS_THRESHOLD)
        for (i = 0; i < a.length; i++) a[i].style.display = "none";
      var n = this.element.querySelectorAll(
        "[" + FamilyTree.attr.control_expcoll_id + "]"
      );
      if (n.length > FamilyTree.BUTTONS_THRESHOLD)
        for (i = 0; i < n.length; i++) n[i].style.display = "none";
      var o = this.element.querySelectorAll(
        "[" + FamilyTree.attr.control_up_id + "]"
      );
      if (o.length > FamilyTree.BUTTONS_THRESHOLD)
        for (i = 0; i < o.length; i++) o[i].style.display = "none";
      this._hideBeforeAnimationCompleted = !0;
    }
  }),
  (FamilyTree.prototype._showAfterAnimation = function () {
    for (
      var e = this.element.getElementsByTagName("text"), t = 0;
      t < e.length;
      t++
    )
      e[t].style.display = "";
    var i = this.element.getElementsByTagName("image");
    for (t = 0; t < i.length; t++) i[t].style.display = "";
    var r = this.element.querySelectorAll("[" + FamilyTree.attr.link_id + "]");
    for (t = 0; t < r.length; t++) r[t].style.display = "";
    var a = this.element.querySelectorAll(
      "[" + FamilyTree.attr.control_expcoll_id + "]"
    );
    for (t = 0; t < a.length; t++) a[t].style.display = "";
    var n = this.element.querySelectorAll(
      "[" + FamilyTree.attr.control_up_id + "]"
    );
    for (t = 0; t < n.length; t++) n[t].style.display = "";
    this._hideBeforeAnimationCompleted = !1;
  }),
  (FamilyTree.prototype.isChild = function (e, t) {
    for (var i = this.getNode(t); i; ) {
      if (i.id == e) return !0;
      i = i.parent ? i.parent : i.stParent;
    }
    return !1;
  }),
  (FamilyTree.prototype.getCollapsedIds = function (e) {
    for (var t = [], i = 0; i < e.childrenIds.length; i++) {
      var r = this.getNode(e.childrenIds[i]);
      1 == r.collapsed && t.push(r.id);
    }
    return t;
  }),
  (FamilyTree.prototype.stateToUrl = function () {
    if (this.manager.state) {
      var e = {};
      return (
        (e.exp = this.manager.state.exp.join("*")),
        (e.min = this.manager.state.min.join("*")),
        (e.adjustify =
          this.manager.state.adjustify.x +
          "*" +
          this.manager.state.adjustify.y),
        (e.scale = this.manager.state.scale),
        (e.y = this.manager.state.x),
        (e.x = this.manager.state.y),
        new URLSearchParams(e).toString()
      );
    }
    return "";
  }),
  (FamilyTree.prototype.generateId = function () {
    for (;;) {
      var e =
        "_" +
        ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(
          -4
        );
      if (!this.nodes.hasOwnProperty(e)) return e;
    }
  }),
  (FamilyTree.prototype._nodeHasHiddenParent = function (e) {
    return !e.parent && !FamilyTree.isNEU(e.pid) && this.getNode(e.pid);
  }),
  (FamilyTree.prototype.destroy = function () {
    this._removeEvent(window, "resize"),
      FamilyTree.events.removeForEventId(this._event_id),
      (this.element.innerHTML = null);
  }),
  (FamilyTree.__defaultConfig = FamilyTree._defaultConfig),
  (FamilyTree._defaultConfig = function (e) {
    var t = FamilyTree.__defaultConfig();
    return (
      (t.nodeTreeMenu = null),
      (t.template = "tommy"),
      (t.mode = "light"),
      (t.minPartnerSeparation = 30),
      (t.partnerChildrenSplitSeparation = 10),
      (t.siblingSeparation = 35),
      (t.tags["children-group"] = {
        template: "cgroup",
        subTreeConfig: {
          siblingSeparation: 7,
          columns: 1,
        },
      }),
      e.template
        ? ((t.tags.male = {
            template: e.template + "_male",
          }),
          (t.tags.female = {
            template: e.template + "_female",
          }))
        : ((t.tags.male = {
            template: t.template + "_male",
          }),
          (t.tags.female = {
            template: t.template + "_female",
          })),
      t
    );
  }),
  (FamilyTree.prototype.getRecentRootsByNodeId = function (e) {
    this.recentRoots || (this.recentRoots = []);
    var t = this.recentRoots,
      i = this.getNode(e);
    return i
      ? (i.rids.sort(function (e, i) {
          var r = t.indexOf(e),
            a = t.indexOf(i);
          return -1 == r ? 1e3 : -1 == a ? -1e3 : r - a;
        }),
        i.rids)
      : [];
  }),
  (FamilyTree.prototype._nodeHasHiddenParent = function (e) {
    return (
      !(e.parent || FamilyTree.isNEU(e.pid) || !this.getNode(e.pid)) ||
      !(!e.isPartner || FamilyTree.isNEU(e.mid) || !this.getNode(e.mid)) ||
      !(!e.isPartner || FamilyTree.isNEU(e.fid) || !this.getNode(e.fid)) ||
      !!(e.isPartner && e.pids.length > 1)
    );
  }),
  (FamilyTree.prototype._center = FamilyTree.prototype.center),
  (FamilyTree.prototype.center = function (e, t, i) {
    var r = this.getRecentRootsByNodeId(e);
    Array.isArray(this.config.roots) || (roots = []),
      FamilyTree._changeRootOption(this.config.roots, r, this.manager.rootList),
      this._center(e, t, i);
  }),
  (FamilyTree.localStorage = {}),
  (FamilyTree.localStorage.getItem = function (e) {
    return localStorage.getItem(e);
  }),
  (FamilyTree.localStorage.setItem = function (e, t) {
    try {
      localStorage.setItem(e, t);
    } catch (e) {
      e.code == e.QUOTA_EXCEEDED_ERR
        ? (console.warn("Local storage quota exceeded"), localStorage.clear())
        : (console.error("Local storage error code:" + e.code),
          console.error(e));
    }
  }),
  (FamilyTree.prototype._canUpdateLink = function (e, t) {
    if (null == t || null == t) return !1;
    if (null == e || null == e) return !1;
    if (e == t) return !1;
    var i = this.getNode(t),
      r = this.getNode(e);
    return (
      !(
        i &&
        r &&
        (i.isAssistant ||
          i.isPartner ||
          (i.hasPartners && r.isAssistant) ||
          (i.hasAssistants && r.isPartner))
      ) && !this.isChild(e, t)
    );
  }),
  (FamilyTree.prototype.updateNode = function (e, t, i) {
    var r = this,
      a = this.get(e.id);
    if (!0 === i && !1 === FamilyTree.events.publish("update", [this, a, e]))
      return !1;
    this.update(e);
    var n = this.getNode(e.id),
      o = n.pid;
    null == o && (o = n.stpid),
      this._draw(
        !1,
        FamilyTree.action.update,
        {
          id: o,
        },
        function () {
          r.ripple(e.id),
            t && t(),
            FamilyTree.events.publish("updated", [r, a, e]);
        }
      );
  }),
  (FamilyTree.prototype.update = function (e) {
    for (var t = 0; t < this.config.nodes.length; t++)
      if (this.config.nodes[t].id == e.id) {
        this.config.nodes[t] = e;
        break;
      }
    return this;
  }),
  (FamilyTree.prototype.removeNode = function (e, t, i) {
    var r = this;
    if (!this.canRemove(e)) return !1;
    var a = this._getNewPidsAndStpidsForIds(e);
    if (!0 === i && !1 === FamilyTree.events.publish("remove", [this, e, a]))
      return !1;
    return (
      this.remove(e),
      this._draw(!1, FamilyTree.action.update, null, function () {
        r.config.sticky &&
          FamilyTree._moveToBoundaryArea(
            r.getSvg(),
            r.getViewBox(),
            r.response.boundary
          ),
          t && t(),
          FamilyTree.events.publish("removed", [r, e, a]);
      }),
      !0
    );
  }),
  (FamilyTree.prototype.remove = function (e) {
    var t = this.get(e);
    if (t)
      for (var i = this.config.nodes.length - 1; i >= 0; i--)
        (this.config.nodes[i].pid != e && this.config.nodes[i].stpid != e) ||
          ((this.config.nodes[i].pid = t.pid),
          (this.config.nodes[i].stpid = t.stpid)),
          this.config.nodes[i].id == e && this.config.nodes.splice(i, 1);
    return this;
  }),
  (FamilyTree.prototype._getNewPidsAndStpidsForIds = function (e) {
    var t = this.get(e),
      i = {},
      r = {};
    if (t)
      for (var a = this.config.nodes.length - 1; a >= 0; a--)
        this.config.nodes[a].pid == e
          ? (i[this.config.nodes[a].id] = t.pid)
          : this.config.nodes[a].stpid == e &&
            (r[this.config.nodes[a].id] = t.stpid);
    return {
      newPidsForIds: i,
      newStpidsForIds: r,
    };
  }),
  (FamilyTree.prototype.addNode = function (e, t, i) {
    var r = this;
    if (!0 === i && !1 === FamilyTree.events.publish("add", [this, e]))
      return !1;
    this.add(e),
      r._draw(
        !1,
        FamilyTree.action.insert,
        {
          id: e.pid,
          insertedNodeId: e.id,
        },
        function () {
          r.ripple(e.id),
            t && t(),
            FamilyTree.events.publish("added", [r, e.id]);
        }
      ),
      FamilyTree.events.publish("adding", [r, e.id]);
  }),
  (FamilyTree.prototype.add = function (e) {
    return (
      null == e.id && console.error("Call addNode without id"),
      this.config.nodes.push(e),
      this
    );
  }),
  (FamilyTree.prototype._get = function (e) {
    for (var t = 0; t < this.config.nodes.length; t++)
      if (this.config.nodes[t].id == e) return this.config.nodes[t];
    return null;
  }),
  (FamilyTree.prototype.get = function (e) {
    for (var t = 0; t < this.config.nodes.length; t++)
      if (this.config.nodes[t].id == e)
        return JSON.parse(JSON.stringify(this.config.nodes[t]));
    return null;
  }),
  (FamilyTree.prototype.canRemove = function (e) {
    var t = this.getNode(e);
    return !!t && !t.hasPartners && !t.hasAssistants;
  }),
  (FamilyTree.prototype.addChildNode = function (e, t, i) {
    this.hideTreeMenu(!1);
    var r = this;
    if (!e || (FamilyTree.isNEU(e.mid) && FamilyTree.isNEU(e.fid)))
      console.error("addSonNode invalid data");
    else {
      FamilyTree.isNEU(e.id) && (e.id = this.generateId());
      var a = {
        addNodesData: [e],
        updateNodesData: [],
        removeNodeId: null,
      };
      this._fireUpdate_addUpdateRemove(a, i);
      var n = "";
      FamilyTree.isNEU(a.addNodesData[0].pid)
        ? FamilyTree.isNEU(a.addNodesData[0].mid)
          ? FamilyTree.isNEU(a.addNodesData[0].fid) ||
            (n = a.addNodesData[0].fid)
          : (n = a.addNodesData[0].mid)
        : (n = a.addNodesData[0].pid),
        r._draw(
          !1,
          FamilyTree.action.insert,
          {
            id: n,
            insertedNodeId: a.addNodesData[0].id,
          },
          function () {
            r.ripple(a.addNodesData[0].id),
              t && t(),
              FamilyTree.events.publish("updated", [r, a]);
          }
        ),
        FamilyTree.events.publish("updating", [r, a]);
    }
  }),
  (FamilyTree.prototype.addChildAndPartnerNodes = function (e, t, i, r, a) {
    this.hideTreeMenu(!1);
    var n = this;
    if (!t || (FamilyTree.isNEU(t.mid) && FamilyTree.isNEU(t.fid)))
      console.error("addChildAndPartnerNodes invalid childData");
    else if (i) {
      FamilyTree.isNEU(t.id) && (t.id = this.generateId()),
        FamilyTree.isNEU(i.id) && (i.id = this.generateId()),
        "_ft_partner" == t.mid
          ? (t.mid = i.id)
          : "_ft_partner" == t.fid && (t.fid = i.id);
      var o = [],
        l = null;
      Array.isArray(i.pids) &&
        (1 != i.pids.length &&
          console.error(
            "addChildAndPartnerNodes parentData.pids has to have one partner"
          ),
        (l = this.get(i.pids[0])),
        (oldPartnerData = JSON.parse(JSON.stringify(l))),
        Array.isArray(l.pids) || (l.pids = []),
        l.pids.push(i.id),
        o.push(l));
      var s = {
        addNodesData: [t, i],
        updateNodesData: o,
        removeNodeId: null,
      };
      this._fireUpdate_addUpdateRemove(s, a);
      var d = this.getRecentRootsByNodeId(e);
      FamilyTree._changeRootOption(this.config.roots, d, this.manager.rootList);
      var c = "";
      l
        ? (c = l.id)
        : FamilyTree.isNEU(t.pid)
        ? FamilyTree.isNEU(t.mid)
          ? FamilyTree.isNEU(t.fid) || (c = t.fid)
          : (c = t.mid)
        : (c = t.pid),
        n._draw(
          !1,
          FamilyTree.action.update,
          {
            id: c,
          },
          function () {
            n.ripple(t.id),
              n.ripple(i.id),
              r && r(),
              FamilyTree.events.publish("updated", [n, s]);
          }
        ),
        FamilyTree.events.publish("updating", [n, s]);
    } else console.error("addChildAndPartnerNodes invalid data");
  }),
  (FamilyTree.prototype.addPartnerNode = function (e, t, i) {
    this.hideTreeMenu(!1);
    var r = this;
    if (e && Array.isArray(e.pids) && 1 == e.pids.length) {
      FamilyTree.isNEU(e.id) && (e.id = this.generateId());
      var a = this.get(e.pids[0]);
      Array.isArray(a.pids) || (a.pids = []), a.pids.push(e.id);
      var n = {
        removeNodeId: null,
        updateNodesData: [a],
        addNodesData: [e],
      };
      this._fireUpdate_addUpdateRemove(n, i);
      var o = this.getRecentRootsByNodeId(n.updateNodesData[0].id);
      FamilyTree._changeRootOption(this.config.roots, o, this.manager.rootList);
      var l = n.updateNodesData[0].id;
      r._draw(
        !1,
        FamilyTree.action.insert,
        {
          id: l,
          insertedNodeId: n.addNodesData[0].id,
        },
        function () {
          r.ripple(n.addNodesData[0].id),
            t && t(),
            FamilyTree.events.publish("updated", [r, n]);
        }
      ),
        FamilyTree.events.publish("updating", [r, n]);
    } else console.error("addPartnerNode invalid data");
  }),
  (FamilyTree.prototype.addParentNode = function (e, t, i, r, a) {
    this.hideTreeMenu(!1);
    var n = this;
    if (i) {
      if (["mid", "fid"].has(t))
        if (FamilyTree.isNEU(e)) console.error("addParentNode invalid childId");
        else {
          FamilyTree.isNEU(i.id) && (i.id = this.generateId());
          var o = [],
            l = this.get(e);
          (l[t] = i.id), o.push(l);
          var s = null;
          Array.isArray(i.pids) &&
            (1 != i.pids.length &&
              console.error("addParentNode: data has to have one partner"),
            (s = this.get(i.pids[0])),
            Array.isArray(s.pids) || (s.pids = []),
            s.pids.push(i.id),
            o.push(s));
          var d = {
            removeNodeId: null,
            updateNodesData: o,
            addNodesData: [i],
          };
          this._fireUpdate_addUpdateRemove(d, a);
          var c = e;
          (this.config.roots = [d.addNodesData[0].id]),
            this._draw(
              !1,
              FamilyTree.action.insert,
              {
                id: c,
                insertedNodeId: d.addNodesData[0].id,
              },
              function () {
                n.ripple(d.addNodesData[0].id),
                  r && r(),
                  FamilyTree.events.publish("updated", [n, d]);
              }
            ),
            FamilyTree.events.publish("updating", [n, d]);
        }
      else console.error("addParentNode invalid type");
    } else console.error("addParentNode invalid data");
  }),
  (FamilyTree.prototype.canRemove = function (e) {
    var t = this.getNode(e);
    return !!t && !(t.pids.length > 1) && !(t.childrenIds.length > 0);
  }),
  (FamilyTree.prototype.removeNode = function (e, t, i) {
    var r = this;
    if (this.canRemove(e)) {
      var a = this.getNode(e),
        n = [];
      if (Array.isArray(a.pids))
        for (var o = 0; o < a.pids.length; o++) {
          var l = this.get(a.pids[o]);
          if (l) {
            var s = l.pids.indexOf(a.id);
            -1 != s && (l.pids.splice(s, 1), n.push(l));
          }
        }
      if (Array.isArray(a.ftChildrenIds))
        for (o = 0; o < a.ftChildrenIds.length; o++) {
          var d = this.get(a.ftChildrenIds[o]);
          d &&
            (d.mid == a.id
              ? ((d.mid = void 0), n.push(d))
              : d.fid == a.id && ((d.fid = void 0), n.push(d)));
        }
      var c = {
        removeNodeId: e,
        updateNodesData: n,
        addNodesData: [],
      };
      this._fireUpdate_addUpdateRemove(c, i),
        this._draw(!1, FamilyTree.action.update, null, function () {
          r.config.sticky &&
            FamilyTree._moveToBoundaryArea(
              r.getSvg(),
              r.getViewBox(),
              r.response.boundary
            ),
            t && t(),
            FamilyTree.events.publish("updated", [r, c]);
        }),
        FamilyTree.events.publish("updating", [r, c]);
    }
  }),
  (FamilyTree.prototype._fireUpdate_addUpdateRemove = function (e, t) {
    if (!0 === t && !1 === FamilyTree.events.publish("update", [this, e]))
      return !1;
    for (var i = 0; i < e.addNodesData.length; i++) this.add(e.addNodesData[i]);
    for (i = 0; i < e.updateNodesData.length; i++)
      this.update(e.updateNodesData[i]);
    FamilyTree.isNEU(e.removeNodeId) || this.remove(e.removeNodeId);
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree._ajax = function (e, t, i, r, a) {
    null == r && (r = "arraybuffer");
    var n = new XMLHttpRequest();
    (n.onload = function (e) {
      4 == n.readyState &&
        200 === this.status &&
        (null == e.target ? a(this.response) : a(e.target.response));
    }),
      (n.onerror = function (e) {
        a({
          error: e,
        });
      }),
      n.open(t, e),
      (n.responseType = r),
      n.setRequestHeader("Content-Type", "application/json"),
      null == i ? n.send() : n.send(i);
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.anim = function (e, t, i, r, a, n, o) {
    var l,
      s = 10,
      d = 1,
      c = r / s + 1;
    document.getElementsByTagName("g");
    return (
      Array.isArray(e) || (e = [e]),
      Array.isArray(t) || (t = [t]),
      Array.isArray(i) || (i = [i]),
      (l = setInterval(function () {
        for (var m = 0; m < e.length; m++)
          for (var h in i[m]) {
            var p = FamilyTree._arrayContains(
              ["top", "left", "right", "bottom", "width", "height"],
              h.toLowerCase()
            )
              ? "px"
              : "";
            switch (h.toLowerCase()) {
              case "d":
                var f =
                    a((d * s - s) / r) * (i[m][h][0] - t[m][h][0]) + t[m][h][0],
                  y =
                    a((d * s - s) / r) * (i[m][h][1] - t[m][h][1]) + t[m][h][1];
                e[m].setAttribute(
                  "d",
                  e[m].getAttribute("d") + " L" + f + " " + y
                );
                break;
              case "r":
                var u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m].setAttribute("r", u);
                break;
              case "x1":
                u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m].setAttribute("x1", u);
                break;
              case "x2":
                u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m].setAttribute("x2", u);
                break;
              case "y1":
                u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m].setAttribute("y1", u);
                break;
              case "y2":
                u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m].setAttribute("y2", u);
                break;
              case "rotate3d":
                if (i[m][h]) {
                  var g = t[m][h],
                    b = i[m][h],
                    T = [0, 0, 0, 0];
                  for (var v in g)
                    T[v] = a((d * s - s) / r) * (b[v] - g[v]) + g[v];
                  e[m].style.transform = "rotate3d(" + T.toString() + "deg)";
                }
                break;
              case "transform":
                if (i[m][h]) {
                  (g = t[m][h]), (b = i[m][h]), (T = [0, 0, 0, 0, 0, 0]);
                  for (var v in g)
                    T[v] = a((d * s - s) / r) * (b[v] - g[v]) + g[v];
                  e[m].hasAttribute("transform")
                    ? e[m].setAttribute(
                        "transform",
                        "matrix(" + T.toString() + ")"
                      )
                    : (e[m].style.transform = "matrix(" + T.toString() + ")");
                }
                break;
              case "viewbox":
                if (i[m][h]) {
                  (g = t[m][h]), (b = i[m][h]), (T = [0, 0, 0, 0]);
                  for (var v in g)
                    T[v] = a((d * s - s) / r) * (b[v] - g[v]) + g[v];
                  e[m].setAttribute("viewBox", T.toString());
                }
                break;
              case "margin":
                if (i[m][h]) {
                  (g = t[m][h]), (b = i[m][h]), (T = [0, 0, 0, 0]);
                  for (var v in g)
                    T[v] = a((d * s - s) / r) * (b[v] - g[v]) + g[v];
                  var F = "";
                  for (v = 0; v < T.length; v++) F += parseInt(T[v]) + "px ";
                  e[m] && e[m].style && (e[m].style[h] = F);
                }
                break;
              case "scrolly":
                u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m].scrollTo(0, u);
                break;
              default:
                u = a((d * s - s) / r) * (i[m][h] - t[m][h]) + t[m][h];
                e[m] && e[m].style && (e[m].style[h] = u + p);
            }
          }
        o && o(), (d += 1) > c + 1 && (clearInterval(l), n && n(e));
      }, s))
    );
  }),
  (FamilyTree.anim.inPow = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : Math.pow(e, 2);
  }),
  (FamilyTree.anim.outPow = function (e) {
    if (e < 0) return 0;
    if (e > 1) return 1;
    return -1 * (Math.pow(e - 1, 2) + -1);
  }),
  (FamilyTree.anim.inOutPow = function (e) {
    if (e < 0) return 0;
    if (e > 1) return 1;
    if ((e *= 2) < 1) return FamilyTree.anim.inPow(e, 2) / 2;
    return -0.5 * (Math.pow(e - 2, 2) + -2);
  }),
  (FamilyTree.anim.inSin = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : 1 - Math.cos(e * (Math.PI / 2));
  }),
  (FamilyTree.anim.outSin = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : Math.sin(e * (Math.PI / 2));
  }),
  (FamilyTree.anim.inOutSin = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : -0.5 * (Math.cos(Math.PI * e) - 1);
  }),
  (FamilyTree.anim.inExp = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : Math.pow(2, 10 * (e - 1));
  }),
  (FamilyTree.anim.outExp = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : 1 - Math.pow(2, -10 * e);
  }),
  (FamilyTree.anim.inOutExp = function (e) {
    return e < 0
      ? 0
      : e > 1
      ? 1
      : e < 0.5
      ? 0.5 * Math.pow(2, 10 * (2 * e - 1))
      : 0.5 * (2 - Math.pow(2, 10 * (-2 * e + 1)));
  }),
  (FamilyTree.anim.inCirc = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : -(Math.sqrt(1 - e * e) - 1);
  }),
  (FamilyTree.anim.outCirc = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : Math.sqrt(1 - (e - 1) * (e - 1));
  }),
  (FamilyTree.anim.inOutCirc = function (e) {
    return e < 0
      ? 0
      : e > 1
      ? 1
      : e < 1
      ? -0.5 * (Math.sqrt(1 - e * e) - 1)
      : 0.5 * (Math.sqrt(1 - (2 * e - 2) * (2 * e - 2)) + 1);
  }),
  (FamilyTree.anim.rebound = function (e) {
    return e < 0
      ? 0
      : e > 1
      ? 1
      : e < 1 / 2.75
      ? 1 - 7.5625 * e * e
      : e < 2 / 2.75
      ? 1 - (7.5625 * (e - 1.5 / 2.75) * (e - 1.5 / 2.75) + 0.75)
      : e < 2.5 / 2.75
      ? 1 - (7.5625 * (e - 2.25 / 2.75) * (e - 2.25 / 2.75) + 0.9375)
      : 1 - (7.5625 * (e - 2.625 / 2.75) * (e - 2.625 / 2.75) + 0.984375);
  }),
  (FamilyTree.anim.inBack = function (e) {
    return e < 0 ? 0 : e > 1 ? 1 : e * e * (2.70158 * e - 1.70158);
  }),
  (FamilyTree.anim.outBack = function (e) {
    return e < 0
      ? 0
      : e > 1
      ? 1
      : (e - 1) * (e - 1) * (2.70158 * (e - 1) + 1.70158) + 1;
  }),
  (FamilyTree.anim.inOutBack = function (e) {
    return e < 0
      ? 0
      : e > 1
      ? 1
      : e < 0.5
      ? 4 * e * e * (7.1898 * e - 2.5949) * 0.5
      : 0.5 * ((2 * e - 2) * (2 * e - 2) * (3.5949 * (2 * e - 2) + 2.5949) + 2);
  }),
  (FamilyTree.anim.impulse = function (e) {
    var t = 2 * e;
    return t * Math.exp(1 - t);
  }),
  (FamilyTree.anim.expPulse = function (e) {
    return Math.exp(-2 * Math.pow(e, 2));
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.prototype._attachInitEventHandlers = function (e) {
    this._addEvent(window, "resize", this._resizeHandler);
  }),
  (FamilyTree.prototype._attachEventHandlers = function (e) {
    if (this.config.interactive) {
      e = this.getSvg();
      this.config.enableTouch || FamilyTree.isMobile()
        ? (this._addEvent(e, "touchstart", this._globalMouseDownHandler),
          this._addEvent(e, "touchend", this._globalClickHandler))
        : (this._addEvent(e, "mousedown", this._globalMouseDownHandler),
          this._addEvent(e, "click", this._globalClickHandler),
          this._addEvent(e, "contextmenu", this._globalContextHandler),
          this._addEvent(e, "dblclick", this._globalDbClickHandler),
          (this.config.mouseScrool != FamilyTree.action.zoom &&
            this.config.mouseScrool != FamilyTree.action.ctrlZoom) ||
            (this._addEvent(e, "DOMMouseScroll", this._mouseScrollHandler),
            this._addEvent(e, "mousewheel", this._mouseScrollHandler)));
      var t = this.getMenuButton();
      t && this._addEvent(t, "click", this._menuClickHandler);
    }
  }),
  (FamilyTree.prototype._addEvent = function (e, t, i, r) {
    var a, n;
    (r || (r = ""),
    e.getListenerList || (e.getListenerList = {}),
    e.getListenerList[t + r]) ||
      ((a = this),
      (n = i),
      (i = function () {
        if (n) return n.apply(a, [this, arguments[0]]);
      }),
      e.addEventListener
        ? "mousewheel" == t
          ? e.addEventListener(t, o, {
              passive: !1,
            })
          : e.addEventListener(t, o, !1)
        : e.attachEvent("on" + t, function () {
            var t = i.call(e, window.event);
            return (
              !1 === t &&
                ((window.event.returnValue = !1),
                (window.event.cancelBubble = !0)),
              t
            );
          }),
      (e.getListenerList[t + r] = o));

    function o(e) {
      var t = i.apply(this, arguments);
      return !1 === t && (e.stopPropagation(), e.preventDefault()), t;
    }
  }),
  (FamilyTree.prototype._removeEvent = function (e, t) {
    if (e.getListenerList[t]) {
      var i = e.getListenerList[t];
      e.removeEventListener(t, i, !1), delete e.getListenerList[t];
    }
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.VERSION = "8.01.02"),
  (FamilyTree.orientation = {}),
  (FamilyTree.orientation.top = 0),
  (FamilyTree.orientation.bottom = 1),
  (FamilyTree.orientation.right = 2),
  (FamilyTree.orientation.left = 3),
  (FamilyTree.orientation.top_left = 4),
  (FamilyTree.orientation.bottom_left = 5),
  (FamilyTree.orientation.right_top = 6),
  (FamilyTree.orientation.left_top = 7),
  (FamilyTree.CENTER = 8),
  (FamilyTree.ORIENTATION = 9),
  (FamilyTree.TEXT_THRESHOLD = 400),
  (FamilyTree.IMAGES_THRESHOLD = 100),
  (FamilyTree.LINKS_THRESHOLD = 200),
  (FamilyTree.BUTTONS_THRESHOLD = 70),
  (FamilyTree.ANIM_THRESHOLD = 50),
  (FamilyTree.attr = {}),
  (FamilyTree.attr.l = "data-l"),
  (FamilyTree.attr.id = "data-id"),
  (FamilyTree.attr.sl = "data-sl"),
  (FamilyTree.attr.lbl = "data-lbl"),
  (FamilyTree.attr.val = "data-val"),
  (FamilyTree.attr.tlbr = "data-tlbr"),
  (FamilyTree.attr.item = "data-item"),
  (FamilyTree.attr.layout = "data-layout"),
  (FamilyTree.attr.node_id = "data-n-id"),
  (FamilyTree.attr.link_id = "data-l-id"),
  (FamilyTree.attr.field_name = "data-f-name"),
  (FamilyTree.attr.c_link_to = "data-c-l-to"),
  (FamilyTree.attr.c_link_from = "data-c-l-from"),
  (FamilyTree.attr.s_link_to = "data-s-l-to"),
  (FamilyTree.attr.s_link_from = "data-s-l-from"),
  (FamilyTree.attr.control_add = "data-ctrl-add"),
  (FamilyTree.attr.control_expcoll_id = "data-ctrl-ec-id"),
  (FamilyTree.attr.control_up_id = "data-ctrl-up-id"),
  (FamilyTree.attr.control_export_menu = "data-ctrl-menu"),
  (FamilyTree.attr.control_node_menu_id = "data-ctrl-n-menu-id"),
  (FamilyTree.attr.control_node_circle_menu_id = "data-ctrl-n-c-menu-id"),
  (FamilyTree.attr.control_node_circle_menu_name = "data-ctrl-n-c-menu-name"),
  (FamilyTree.attr.control_node_circle_menu_wrraper_id =
    "data-ctrl-n-c-menu-wrapper-id"),
  (FamilyTree.attr.width = "data-width"),
  (FamilyTree.attr.text_overflow = "data-text-overflow"),
  (FamilyTree.ID = "id"),
  (FamilyTree.PID = "pid"),
  (FamilyTree.STPID = "stpid"),
  (FamilyTree.TAGS = "tags"),
  (FamilyTree.NODES = "nodes"),
  (FamilyTree.ELASTIC = "elastic"),
  (FamilyTree.MAX_DEPTH = 200),
  (FamilyTree.SCALE_FACTOR = 1.44),
  (FamilyTree.LAZY_LOADING_FACTOR = 500),
  (FamilyTree.action = {}),
  (FamilyTree.action.expand = 0),
  (FamilyTree.action.collapse = 1),
  (FamilyTree.action.maximize = 101),
  (FamilyTree.action.minimize = 102),
  (FamilyTree.action.expandCollapse = 501),
  (FamilyTree.action.edit = 1),
  (FamilyTree.action.zoom = 2),
  (FamilyTree.action.ctrlZoom = 22),
  (FamilyTree.action.scroll = 41),
  (FamilyTree.action.xScroll = 3),
  (FamilyTree.action.yScroll = 4),
  (FamilyTree.action.none = 5),
  (FamilyTree.action.init = 6),
  (FamilyTree.action.update = 7),
  (FamilyTree.action.pan = 8),
  (FamilyTree.action.centerNode = 9),
  (FamilyTree.action.resize = 10),
  (FamilyTree.action.insert = 11),
  (FamilyTree.action.insertfirst = 12),
  (FamilyTree.action.details = 13),
  (FamilyTree.action.exporting = 14),
  (FamilyTree.none = 400001),
  (FamilyTree.scroll = {}),
  (FamilyTree.scroll.visible = 1),
  (FamilyTree.scroll.smooth = 12),
  (FamilyTree.scroll.speed = 120),
  (FamilyTree.scroll.safari = {
    smooth: 12,
    speed: 250,
  }),
  (FamilyTree.match = {}),
  (FamilyTree.match.height = 100001),
  (FamilyTree.match.width = 100002),
  (FamilyTree.match.boundary = 100003),
  (FamilyTree.COLLAPSE_PARENT_NEIGHBORS = 1),
  (FamilyTree.COLLAPSE_SUB_CHILDRENS = 2),
  (FamilyTree.COLLAPSE_PARENT_SUB_CHILDREN_EXCEPT_CLICKED = 3),
  (FamilyTree.normal = 0),
  (FamilyTree.mixed = 1),
  (FamilyTree.tree = 2),
  (FamilyTree.treeLeftOffset = 3),
  (FamilyTree.treeRightOffset = 4),
  (FamilyTree.nodeOpenTag =
    "<g " +
    FamilyTree.attr.node_id +
    '="{id}" style="opacity: {opacity}" transform="matrix(1,0,0,1,{x},{y})" class="{class}" ' +
    FamilyTree.attr.sl +
    '="{sl}" ' +
    FamilyTree.attr.l +
    "={level} {lcn}>"),
  (FamilyTree.linkOpenTag =
    "<g " + FamilyTree.attr.link_id + '="[{id}][{child-id}]" class="{class}">'),
  (FamilyTree.expcollOpenTag =
    "<g " +
    FamilyTree.attr.control_expcoll_id +
    '="{id}" transform="matrix(1,0,0,1,{x},{y})"  style="cursor:pointer;">'),
  (FamilyTree.upOpenTag =
    "<g " +
    FamilyTree.attr.control_up_id +
    '="{id}" transform="matrix(1,0,0,1,{x},{y})" style="cursor:pointer;">'),
  (FamilyTree.linkFieldsOpenTag =
    '<g transform="matrix(1,0,0,1,{x},{y}) rotate({rotate})">'),
  (FamilyTree.grCloseTag = "</g>"),
  (FamilyTree.IT_IS_LONELY_HERE =
    '<g transform="translate(-100, 0)" style="cursor:pointer;"  ' +
    FamilyTree.attr.control_add +
    '="control-add"><text fill="#039be5">{link}</text></g>'),
  (FamilyTree.RES = {}),
  (FamilyTree.RES.IT_IS_LONELY_HERE_LINK =
    "It's lonely here, add your first node"),
  (FamilyTree.FIRE_DRAG_NOT_CLICK_IF_MOVE = 3),
  (FamilyTree.STRING_TAGS = !1),
  (FamilyTree.MAX_NODES_MESS =
    "The trial has expired or 200 nodes limit was reached! <br /><a style='color: #039BE5;' target='_blank' href='https://balkan.app/FamilyTreeJS/Docs/Evaluation'>See more</a>"),
  (FamilyTree.OFFLINE_MESS =
    "The evaluation version requires internet connection! <br /><a style='color: #039BE5;' target='_blank' href='https://balkan.app/FamilyTreeJS/Docs/Evaluation'>See more</a>"),
  (FamilyTree.SEARCH_PLACEHOLDER = "Search"),
  (FamilyTree.IMPORT_MESSAGE =
    "Choose the columns (fields) in your data file that contain the required information."),
  (FamilyTree.FIXED_POSITION_ON_CLICK = !1),
  (FamilyTree.ADD_NEW_FIELD = "Add new field"),
  (FamilyTree.ASSISTANT = "Assistant"),
  (FamilyTree.RENDER_LINKS_BEFORE_NODES = !1),
  (FamilyTree.A5w = 420),
  (FamilyTree.A5h = 595),
  (FamilyTree.A4w = 595),
  (FamilyTree.A4h = 842),
  (FamilyTree.A3w = 842),
  (FamilyTree.A3h = 1191),
  (FamilyTree.A2w = 1191),
  (FamilyTree.A2h = 1684),
  (FamilyTree.A1w = 1684),
  (FamilyTree.A1h = 2384),
  (FamilyTree.Letterw = 612),
  (FamilyTree.Letterh = 791),
  (FamilyTree.Legalw = 612),
  (FamilyTree.Legalh = 1009),
  (FamilyTree.LINK_ROUNDED_CORNERS = 5),
  (FamilyTree.MOVE_STEP = 5),
  (FamilyTree.MOVE_INTERVAL = 25),
  (FamilyTree.MIXED_LAYOUT_ALL_NODES = !0),
  (FamilyTree.MIXED_LAYOUT_FOR_NODES_WITH_COLLAPSED_CHILDREN = !1),
  (FamilyTree.CLINK_CURVE = 1),
  (FamilyTree.SEARCH_RESULT_LIMIT = 10),
  "undefined" != typeof module && (module.exports = FamilyTree),
  (FamilyTree.OC_VERSION = FamilyTree.VERSION),
  (FamilyTree.VERSION = "1.01.03"),
  (FamilyTree.RENDER_LINKS_BEFORE_NODES = !0),
  (FamilyTree._intersects = function (e, t, i) {
    var r = e.x - i.siblingSeparation / 4,
      a = e.y,
      n = e.x + e.w + i.siblingSeparation / 4,
      o = e.y;
    switch (i.orientation) {
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        (r = e.x),
          (a = e.y - i.siblingSeparation / 4),
          (n = e.x),
          (o = e.y + e.h + i.siblingSeparation / 4);
    }
    var l,
      s,
      d,
      c = t.p,
      m = t.q,
      h = t.r,
      p = t.s;
    return (
      0 !== (l = (n - r) * (p - m) - (h - c) * (o - a)) &&
      ((s = ((a - o) * (h - r) + (n - r) * (p - a)) / l),
      0 < (d = ((p - m) * (h - r) + (c - h) * (p - a)) / l) &&
        d < 1 &&
        0 < s &&
        s < 1)
    );
  }),
  (FamilyTree._addPoint = function (e, t, i, r, a) {
    switch (i.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
        return FamilyTree._addPointTop(e, t, i, r, a);
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return FamilyTree._addPointBottom(e, t, i, r, a);
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return FamilyTree._addPointLeft(e, t, i, r, a);
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
        return FamilyTree._addPointRight(e, t, i, r, a);
    }
  }),
  (FamilyTree._addPointTop = function (e, t, i, r, a) {
    var n, o, l;
    return (
      "left" == a
        ? (n = e.leftNeighbor
            ? e.x + (e.leftNeighbor.x + e.leftNeighbor.w - e.x) / 2
            : e.x - i.siblingSeparation / 2)
        : "right" == a &&
          (n = e.rightNeighbor
            ? e.x + e.w + (e.rightNeighbor.x - (e.x + e.w)) / 2
            : e.x + e.w + i.siblingSeparation / 2),
      t.push([n, t[t.length - 1][1]]),
      t.push([n, e.y - i.levelSeparation / 3]),
      (o = t[t.length - 1][1]),
      (l = n),
      (r.p = n),
      (r.q = o),
      (r.r = l),
      r
    );
  }),
  (FamilyTree._addPointBottom = function (e, t, i, r, a) {
    var n, o, l;
    return (
      "left" == a
        ? (n = e.leftNeighbor
            ? e.x + (e.leftNeighbor.x + e.leftNeighbor.w - e.x) / 2
            : e.x - i.siblingSeparation / 2)
        : "right" == a &&
          (n = e.rightNeighbor
            ? e.x + e.w + (e.rightNeighbor.x - (e.x + e.w)) / 2
            : e.x + e.w + i.siblingSeparation / 2),
      t.push([n, t[t.length - 1][1]]),
      t.push([n, e.y + e.h + i.levelSeparation / 3]),
      (o = t[t.length - 1][1]),
      (l = n),
      (r.p = n),
      (r.q = o),
      (r.r = l),
      r
    );
  }),
  (FamilyTree._addPointLeft = function (e, t, i, r, a) {
    var n,
      o = t[t.length - 1][0];
    return (
      "bottom" == a
        ? (n = e.rightNeighbor
            ? e.y + e.h + (e.rightNeighbor.y - (e.y + e.h)) / 2
            : e.y + e.h + i.siblingSeparation / 2)
        : "top" == a &&
          (n = e.leftNeighbor
            ? e.y + (e.leftNeighbor.y + e.leftNeighbor.h - e.y) / 2
            : e.y - i.siblingSeparation / 2),
      t.push([t[t.length - 1][0], n]),
      t.push([e.x - i.levelSeparation / 3, n]),
      (o = t[t.length - 1][0]),
      (s = n),
      (r.p = o),
      (r.q = n),
      (r.s = s),
      r
    );
  }),
  (FamilyTree._addPointRight = function (e, t, i, r, a) {
    var n,
      o = t[t.length - 1][0];
    return (
      "bottom" == a
        ? (n = e.rightNeighbor
            ? e.y + e.h + (e.rightNeighbor.y - (e.y + e.h)) / 2
            : e.y + e.h + i.siblingSeparation / 2)
        : "top" == a &&
          (n = e.leftNeighbor
            ? e.y + (e.leftNeighbor.y + e.leftNeighbor.h - e.y) / 2
            : e.y - i.siblingSeparation / 2),
      t.push([t[t.length - 1][0], n]),
      t.push([e.x + e.w + i.levelSeparation / 3, n]),
      (o = t[t.length - 1][0]),
      (s = n),
      (r.p = o),
      (r.q = n),
      (r.s = s),
      r
    );
  }),
  (FamilyTree.editUI = function () {}),
  (FamilyTree.editUI.prototype.init = function (e) {
    (this.obj = e), (this.fields = null), (this._event_id = FamilyTree._guid());
  }),
  (FamilyTree.editUI.prototype.on = function (e, t) {
    return FamilyTree.events.on(e, t, this._event_id), this;
  }),
  (FamilyTree.editUI.prototype.show = function (e, t, i) {
    if ((this.hide(), !1 === FamilyTree.events.publish("show", [this, e])))
      return !1;
    var r = this,
      a = this.content(e, t, i);
    this.obj.element.appendChild(a.element),
      FamilyTree.input.init(this.obj.element),
      i
        ? !t && a.focusId && FamilyTree.editUI.ficusElement(a.focusId)
        : (this.interval = FamilyTree.anim(
            a.element,
            {
              right: -20,
              opacity: 0,
            },
            {
              right: 0,
              opacity: 1,
            },
            300,
            FamilyTree.anim.outSin,
            function () {
              !t && a.focusId && FamilyTree.editUI.ficusElement(a.focusId);
            }
          )),
      this.obj.element
        .querySelector("[data-edit-from-close]")
        .addEventListener("click", function (e) {
          r.hide();
        }),
      this.obj.element
        .querySelector("[data-edit-from-cancel]")
        .addEventListener("click", function (e) {
          r.hide();
        }),
      this.obj.element
        .querySelector("[data-edit-from-save]")
        .addEventListener("click", function (t) {
          var i = FamilyTree.input.validateAndGetData(a.element);
          if (!1 !== i) {
            var n = r.obj.get(e),
              o = FamilyTree.mergeDeep(n, i);
            r.obj.updateNode(o, null, !0), r.hide();
          }
        });
    for (
      var n = this.obj.element.querySelectorAll("[bft-input-btn]"), o = 0;
      o < n.length;
      o++
    ) {
      n[o].addEventListener("click", function (t) {
        FamilyTree.events.publish("element-btn-click", [
          r,
          {
            input: this.parentNode.querySelector("input"),
            nodeId: e,
          },
        ]);
      });
    }
    this.obj.element
      .querySelector("[data-add-more-fields-btn]")
      .addEventListener("click", function (e) {
        e.stopPropagation(), e.preventDefault();
        var t = this,
          i = FamilyTree.elements.textbox(
            {},
            {
              type: "textbox",
              label: r.obj.config.editForm.addMoreFieldName,
              btn: r.obj.config.editForm.addMoreBtn,
            },
            "280px"
          );
        t.parentNode.insertAdjacentHTML("beforebegin", i.html),
          (t.style.display = "none"),
          FamilyTree.input.init(t.parentNode.previousSibling);
        var a = document.getElementById(i.id);
        a.focus(),
          a.nextElementSibling.addEventListener("click", function (e) {
            e.stopPropagation(), e.preventDefault();
            var i = r.obj.element.querySelector(
              '[data-binding="' + a.value + '"]'
            );
            if (FamilyTree.isNEU(a.value) || i) a.focus();
            else {
              var n = FamilyTree.elements.textbox(
                {},
                {
                  type: "textbox",
                  label: a.value,
                  binding: a.value,
                },
                "280px"
              );
              a.parentNode.parentNode.parentNode.removeChild(
                a.parentNode.parentNode
              ),
                t.parentNode.insertAdjacentHTML("beforebegin", n.html),
                (t.style.display = ""),
                FamilyTree.input.init(t.parentNode.previousSibling),
                document.getElementById(n.id).focus();
            }
          });
      }),
      this.obj.element
        .querySelector("[data-bft-edit-from-btns]")
        .addEventListener("click", function (t) {
          for (
            var i = t.target;
            i && i.hasAttribute && !i.hasAttribute("data-edit-from-btn");

          )
            i = i.parentNode;
          if (i && i.hasAttribute) {
            var n = i.getAttribute("data-edit-from-btn"),
              o = {
                button: r.obj.config.editForm.buttons[n],
                name: n,
                nodeId: e,
                event: t,
              };
            if (!1 === FamilyTree.events.publish("button-click", [r, o]))
              return !1;
            switch (n) {
              case "edit":
                r.obj.editUI.show(e, !1, !0);
                break;
              case "pdf":
                r.obj.exportPDFProfile({
                  id: e,
                  filename: a.title,
                }),
                  r.hide();
                break;
              case "png":
                r.obj.exportPNGProfile({
                  id: e,
                  filename: a.title,
                }),
                  r.hide();
                break;
              case "share":
                r.obj.shareProfile(e);
                break;
              case "remove":
                r.obj.removeNode(e, null, !0), r.hide();
            }
          }
        });
  }),
  (FamilyTree.editUI.ficusElement = function (e) {
    if (!FamilyTree.isNEU(e)) {
      var t = document.getElementById(e);
      t &&
        (t.focus(),
        t.value &&
          t.value.length &&
          (t.selectionStart = t.selectionEnd = t.value.length));
    }
  }),
  (FamilyTree.editUI.prototype.content = function (e, t, i, r, a) {
    var n,
      o = this.obj.config.editForm.readOnly,
      l = JSON.parse(JSON.stringify(this.obj.config.editForm.elements)),
      s = this.obj.config.editForm.addMore,
      d = this.obj.config.editForm.buttons,
      c = this.obj.config.editForm.titleBinding,
      m = this.obj.config.editForm.photoBinding,
      h = this.obj.getNode(e),
      p = this.obj._get(e),
      f = FamilyTree.t(h.templateName, h.min, this.obj.getScale()),
      y = p[c],
      u = p[m];
    if (this.obj.config.editForm.generateElementsFromFields)
      for (var g = 0; g < this.fields.length; g++) {
        var b = this.fields[g];
        if ("tags" != b) {
          for (var T = !1, v = 0; v < l.length; v++) {
            if (Array.isArray(l[v])) {
              for (var F = 0; F < l[v].length; F++)
                if (b == l[v][F].binding) {
                  T = !0;
                  break;
                }
            } else if (b == l[v].binding) {
              T = !0;
              break;
            }
            if (T) break;
          }
          T ||
            l.push({
              type: "textbox",
              label: b,
              binding: b,
            });
        }
      }
    FamilyTree.isNEU(y) && (y = ""),
      (u = FamilyTree.isNEU(u)
        ? FamilyTree.icon.user(150, 150, "#8C8C8C", 0, 0)
        : `<img style="width: 100%;height:100%;border-radius: 50%;" src="${u}"></img>`);
    var x = !t,
      _ = t ? "display:none;" : "",
      w = t || !s ? "display:none;" : "",
      k = f.editFormHeaderColor
        ? `style="background-color:${f.editFormHeaderColor};"`
        : "",
      S = document.createElement("form");
    if (
      (S.setAttribute("data-bft-edit-form", ""),
      S.classList.add("bft-edit-form"),
      S.classList.add(this.obj.config.mode),
      S.classList.add(h.templateName),
      S.classList.add(FamilyTree.ui._defsIds[h.templateName]),
      Array.isArray(h.tags) && h.tags.length)
    )
      for (g = 0; g < h.tags.length; g++) S.classList.add(h.tags[g]);
    (S.style.display = "flex"),
      (S.style.opacity = i ? 1 : 0),
      (S.style.right = i ? 0 : "-20px"),
      r && (S.style.width = r);
    var C = [],
      N = a
        ? ""
        : '<svg data-edit-from-close class="bft-edit-form-close"><path style="fill:#ffffff;" d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z"></path></svg>';
    return (
      (S.innerHTML = `<div>\n                        <div class="bft-edit-form-header" ${k}>\n                            ${N}\n                            <h1 class="bft-edit-form-title">${y}</h1>\n                            <div class="bft-edit-form-avatar">${u}</div>                        \n                        </div>\n                        <div data-bft-edit-from-btns class="bft-edit-form-instruments">\n                        ${(function () {
        if (a) return "";
        var e = "";
        for (var i in d) {
          var r = d[i];
          FamilyTree.isNEU(r) ||
            (x && r.hideIfEditMode) ||
            (t && r.hideIfDetailsMode) ||
            (o && "Edit" == r.text) ||
            (e += `<div data-edit-from-btn='${i}' class="bft-img-button" ${k} title="${r.text}">${r.icon}</div>`);
        }
        return e;
      })()}    \n                        </div>\n                    </div>\n                    <div class="bft-edit-form-fields">\n                        <div class="bft-edit-form-fields-inner">\n                            <div class="bft-form-fieldset">\n                                ${(function () {
        for (var e = "", i = 0; i < l.length; i++) {
          var r = l[i];
          if (Array.isArray(r)) {
            e += '<div class="bft-form-field-100 bft-form-fieldset">';
            for (var a = 0; a < r.length; a++) {
              var o = r[a],
                s = FamilyTree.elements[o.type](p, o, "unset", t);
              !FamilyTree.isNEU(s.id) &&
                FamilyTree.isNEU(n) &&
                FamilyTree.isNEU(s.value) &&
                (n = s.id),
                FamilyTree.isNEU(s.value) || C.push(`${o.label}: ${s.value}`),
                (e += s.html);
            }
            e += "</div>";
          } else {
            s = FamilyTree.elements[r.type](p, r, "280px", t);
            !FamilyTree.isNEU(s.id) &&
              FamilyTree.isNEU(n) &&
              FamilyTree.isNEU(s.value) &&
              (n = s.id),
              FamilyTree.isNEU(s.value) ||
                C.push(`
    $ {
        r.label
    }: $ {
        s.value
    }
    `),
              (e += s.html);
          }
        }
        return e;
      })()}\n\n                                <div class="bft-form-field" style="min-width: 280px; text-align:center; ${w}">\n                                    <a data-add-more-fields-btn href="#" class="bft-link">${s}</a>\n                                </div>\n                            </div>        \n                        </div>\n                    </div>\n                    <div class="bft-form-fieldset" style="padding: 14px 10px; ${_}">\n                        <div class="bft-form-field" style="min-width: initial;">\n                            <button data-edit-from-cancel type="button" class="bft-button transparent">Cancel</button>\n                        </div>\n                        <div class="bft-form-field" style="min-width: initial;">\n                            <button type="submit" data-edit-from-save type="button" class="bft-button">Save and close</button>\n                        </div>\n                    </div>`),
      {
        element: S,
        focusId: n,
        title: y,
        shareText: C.join("\n"),
      }
    );
  }),
  (FamilyTree.editUI.prototype.hide = function () {
    if (!1 === FamilyTree.events.publish("hide", [this])) return !1;
    FamilyTree.isNEU(this.interval) &&
      (clearInterval(this.interval), (this.interval = null));
    var e = this.obj.element.querySelector("[data-bft-edit-form]");
    e && e.parentNode && e.parentNode.removeChild(e);
  }),
  (FamilyTree.prototype.getSvg = function () {
    var e = this.element.getElementsByTagName("svg");
    return e && e.length ? e[0] : null;
  }),
  (FamilyTree.prototype.getPointerElement = function () {
    return this.element.querySelector("g[data-pointer]");
  }),
  (FamilyTree.prototype.getNodeElement = function (e) {
    return this.element.querySelector(
      "g[" + FamilyTree.attr.node_id + "='" + e + "']"
    );
  }),
  (FamilyTree.prototype.getMenuButton = function () {
    return this.element.querySelector(
      "[" + FamilyTree.attr.control_export_menu + "]"
    );
  }),
  (FamilyTree.menuUI = function () {}),
  (FamilyTree.menuUI.prototype.init = function (e, t) {
    (this.obj = e),
      (this.wrapper = null),
      (this.menu = t),
      (this._event_id = FamilyTree._guid());
  }),
  (FamilyTree.menuUI.prototype.showStickIn = function (e, t, i, r) {
    this._show(e, null, t, i, r);
  }),
  (FamilyTree.menuUI.prototype.show = function (e, t, i, r, a) {
    this._show(e, t, i, r, a);
  }),
  (FamilyTree.menuUI.prototype._show = function (e, t, i, r, a) {
    var n = this;
    this.hide();
    var o = "";
    a || (a = this.menu);
    var l = {
      firstNodeId: i,
      secondNodeId: r,
      menu: a,
    };
    if (!1 === FamilyTree.events.publish("show", [this, l])) return !1;
    for (var s in (a = l.menu)) {
      var d = a[s].icon,
        c = a[s].text;
      void 0 === d && (d = FamilyTree.icon[s](24, 24, "#7A7A7A")),
        "function" == typeof c && (c = c()),
        "function" == typeof d && (d = d()),
        (o +=
          "<div " +
          FamilyTree.attr.item +
          '="' +
          s +
          '">' +
          d +
          "<span>&nbsp;&nbsp;" +
          c +
          "</span></div>");
    }
    if ("" != o) {
      if (
        ((this.wrapper = document.createElement("div")),
        (this.wrapper.className = "bft-chart-menu"),
        (this.wrapper.style.left = "-99999px"),
        (this.wrapper.style.top = "-99999px"),
        (this.wrapper.innerHTML = o),
        this.obj.element.appendChild(this.wrapper),
        null == t)
      ) {
        var m = FamilyTree._menuPosition(e, this.wrapper, this.obj.getSvg());
        (e = m.x), (t = m.y);
      }
      var h = e + 45;
      (this.wrapper.style.left = h + "px"),
        (this.wrapper.style.top = t + "px"),
        (this.wrapper.style.left = h - this.wrapper.offsetWidth + "px");
      var p = e - this.wrapper.offsetWidth;
      FamilyTree.anim(
        this.wrapper,
        {
          opacity: 0,
          left: h - this.wrapper.offsetWidth,
        },
        {
          opacity: 1,
          left: p,
        },
        300,
        FamilyTree.anim.inOutPow
      );
      for (
        var f = this.wrapper.getElementsByTagName("div"), y = 0;
        y < f.length;
        y++
      ) {
        (s = f[y]).addEventListener("click", function (e) {
          var t,
            o = this.getAttribute(FamilyTree.attr.item);
          if (void 0 === a[o].onClick)
            if ("add" === o) {
              var l = {
                id: n.obj.generateId(),
                pid: i,
              };
              n.obj.addNode(l, null, !0);
            } else if ("edit" === o) {
              var s = n.obj.getNode(i);
              n.obj.editUI.show(s.id);
            } else if ("details" === o) {
              s = n.obj.getNode(i);
              n.obj.editUI.show(s.id, !0);
            } else
              "remove" === o
                ? n.obj.removeNode(i, null, !0)
                : "svg" === o
                ? n.obj.exportSVG({
                    filename: "FamilyTree.svg",
                    expandChildren: !1,
                    nodeId: i,
                  })
                : "pdf" === o
                ? n.obj.exportPDF({
                    filename: "FamilyTree.pdf",
                    expandChildren: !1,
                    nodeId: i,
                  })
                : "png" === o
                ? n.obj.exportPNG({
                    filename: "FamilyTree.png",
                    expandChildren: !1,
                    nodeId: i,
                  })
                : "csv" === o
                ? n.obj.exportCSV()
                : "xml" === o && n.obj.exportXML();
          else t = a[o].onClick.call(n.obj, i, r);
          0 != t && n.hide();
        });
      }
    }
  }),
  (FamilyTree.menuUI.prototype.hide = function () {
    null != this.wrapper &&
      (this.obj.element.removeChild(this.wrapper), (this.wrapper = null));
  }),
  (FamilyTree.menuUI.prototype.on = function (e, t) {
    return FamilyTree.events.on(e, t, this._event_id), this;
  }),
  (FamilyTree.circleMenuUI = function () {}),
  (FamilyTree.circleMenuUI.prototype.init = function (e, t) {
    (this.obj = e),
      (this.menu = t),
      (this._menu = null),
      (this._buttonsInterval = []),
      (this._linesInterval = []),
      (this._event_id = FamilyTree._guid());
  }),
  (FamilyTree.circleMenuUI.prototype.show = function (e, t) {
    this._show(e, t);
  }),
  (FamilyTree.circleMenuUI.prototype._show = function (e, t) {
    var i = this,
      r = this.obj.getNode(e),
      a = FamilyTree.t(r.templateName, r.min, this.obj.getScale());
    if (!FamilyTree.isNEU(a.nodeCircleMenuButton)) {
      var n = this.obj.getSvg(),
        o = this.obj.element.querySelector(
          "[" + FamilyTree.attr.control_node_circle_menu_id + '="' + e + '"]'
        ),
        l = this.obj.getNodeElement(e),
        s = FamilyTree._getTransform(o),
        d = FamilyTree._getTransform(l),
        c = s[4] + d[4],
        m = s[5] + d[5],
        h = o.querySelectorAll("line"),
        p = this.obj.element.querySelector(
          "[" + FamilyTree.attr.control_node_circle_menu_wrraper_id + "]"
        );
      if (
        FamilyTree.isNEU(p) ||
        p.getAttribute(FamilyTree.attr.control_node_circle_menu_wrraper_id) != e
      ) {
        this.hide(), t || (t = this.menu);
        var f = {
            nodeId: e,
            menu: t,
          },
          y = FamilyTree.events.publish("show", [this, f]);
        if (((this._menu = t), !1 === y)) return !1;
        for (
          var u = 0,
            g = Object.keys(f.menu).length,
            b = 2 * a.nodeCircleMenuButton.radius + 4,
            T = 2 * Math.PI * b,
            v = T / g - (2 * a.nodeCircleMenuButton.radius + 2);
          v < 0;

        )
          (b += 8),
            (v =
              (T = 2 * Math.PI * b) / g -
              (2 * a.nodeCircleMenuButton.radius + 2));
        for (var F in ((p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        )).setAttribute(FamilyTree.attr.control_node_circle_menu_wrraper_id, e),
        p.setAttribute("transform", "matrix(1,0,0,1," + c + "," + m + ")"),
        n.appendChild(p),
        f.menu)) {
          var x = f.menu[F].icon,
            _ = f.menu[F].color,
            w = f.menu[F].text;
          "function" == typeof x && (x = x()),
            "function" == typeof _ && (_ = _()),
            "function" == typeof w && (w = w());
          var k = document.createElementNS("http://www.w3.org/2000/svg", "g");
          k.setAttribute("transform", "matrix(1,0,0,1,0,0)"),
            k.setAttribute(FamilyTree.attr.control_node_circle_menu_name, F),
            (k.style.cursor = "pointer");
          var S = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          FamilyTree.isNEU(w) || (S.innerHTML = w);
          var C = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          C.setAttribute("cx", 0),
            C.setAttribute("cy", 0),
            C.setAttribute("r", a.nodeCircleMenuButton.radius),
            C.setAttribute("fill", _),
            C.setAttribute("stroke-width", "1"),
            C.setAttribute("stroke", a.nodeCircleMenuButton.stroke),
            k.appendChild(C),
            k.appendChild(S),
            (k.innerHTML += x),
            p.appendChild(k);
          var N = k.getElementsByTagName("svg")[0];
          if ((N.setAttribute("pointer-events", "none"), N)) {
            var I = parseInt(N.getAttribute("width")),
              A = parseInt(N.getAttribute("height"));
            N.setAttribute("x", -I / 2), N.setAttribute("y", -A / 2);
          }
          var M = (u * Math.PI) / (g / 2);
          u++;
          var L = Math.cos(M) * b,
            E = Math.sin(M) * b;
          this._buttonsInterval.push(
            FamilyTree.anim(
              k,
              {
                transform: [1, 0, 0, 1, 0, 0],
              },
              {
                transform: [1, 0, 0, 1, L, E],
              },
              250,
              FamilyTree.anim.outBack,
              function (e) {
                var t = e[0].getAttribute(
                    FamilyTree.attr.control_node_circle_menu_name
                  ),
                  r = e[0].parentNode.getAttribute(
                    FamilyTree.attr.control_node_circle_menu_wrraper_id
                  );
                e[0].addEventListener("mouseenter", function (e) {
                  FamilyTree.events.publish("mouseenter", [
                    i,
                    {
                      from: r,
                      menuItem: f.menu[t],
                      menuItemName: t,
                      event: e,
                    },
                  ]);
                }),
                  e[0].addEventListener("mouseout", function (e) {
                    FamilyTree.events.publish("mouseout", [
                      i,
                      {
                        from: r,
                        menuItem: f.menu[t],
                        menuItemName: t,
                        event: e,
                      },
                    ]);
                  });
              }
            )
          );
        }
        this._linesInterval.push(
          FamilyTree.anim(
            h[0],
            {
              x1: -a.nodeCircleMenuButton.radius / 2,
              y1: -6,
              x2: a.nodeCircleMenuButton.radius / 2,
              y2: -6,
            },
            {
              x1: -7,
              y1: -7,
              x2: 7,
              y2: 7,
            },
            500,
            FamilyTree.anim.inOutSin
          )
        ),
          this._linesInterval.push(
            FamilyTree.anim(
              h[1],
              {
                x1: -a.nodeCircleMenuButton.radius / 2,
                y1: 0,
                x2: a.nodeCircleMenuButton.radius / 2,
                y2: 0,
              },
              {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
              },
              500,
              FamilyTree.anim.inOutSin
            )
          ),
          this._linesInterval.push(
            FamilyTree.anim(
              h[2],
              {
                x1: -a.nodeCircleMenuButton.radius / 2,
                y1: 6,
                x2: a.nodeCircleMenuButton.radius / 2,
                y2: 6,
              },
              {
                x1: -7,
                y1: 7,
                x2: 7,
                y2: -7,
              },
              500,
              FamilyTree.anim.inOutSin
            )
          );
      } else this.hide();
    }
  }),
  (FamilyTree.circleMenuUI.prototype.hide = function () {
    for (var e = this._buttonsInterval.length - 1; e >= 0; e--)
      clearInterval(this._buttonsInterval[e]),
        this._buttonsInterval.splice(e, 1);
    this._buttonsInterval = [];
    for (e = this._linesInterval.length - 1; e >= 0; e--)
      clearInterval(this._linesInterval[e]), this._linesInterval.splice(e, 1);
    this._linesInterval = [];
    var t = this.obj.element.querySelector(
      "[" + FamilyTree.attr.control_node_circle_menu_wrraper_id + "]"
    );
    if (null != t) {
      var i = t.getAttribute(
          FamilyTree.attr.control_node_circle_menu_wrraper_id
        ),
        r = this.obj.getNode(i),
        a = FamilyTree.t(r.templateName, r.min, this.obj.getScale()),
        n = this.obj.element
          .querySelector(
            "[" + FamilyTree.attr.control_node_circle_menu_id + '="' + i + '"]'
          )
          .querySelectorAll("line");
      n[0].setAttribute("x1", -a.nodeCircleMenuButton.radius / 2),
        n[0].setAttribute("x2", a.nodeCircleMenuButton.radius / 2),
        n[0].setAttribute("y1", -6),
        n[0].setAttribute("y2", -6),
        n[1].setAttribute("x1", -a.nodeCircleMenuButton.radius / 2),
        n[1].setAttribute("x2", a.nodeCircleMenuButton.radius / 2),
        n[1].setAttribute("y1", 0),
        n[1].setAttribute("y2", 0),
        n[2].setAttribute("x1", -a.nodeCircleMenuButton.radius / 2),
        n[2].setAttribute("x2", a.nodeCircleMenuButton.radius / 2),
        n[2].setAttribute("y1", 6),
        n[2].setAttribute("y2", 6),
        t.parentElement.removeChild(t),
        (t = null);
    }
  }),
  (FamilyTree.circleMenuUI.prototype.on = function (e, t) {
    return FamilyTree.events.on(e, t, this._event_id), this;
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.idb = {
    version: 1,
    dbName: "BALKAN",
    tableName: "familytree-js",
    keyPath: "id",
  }),
  (FamilyTree.idb.db = null),
  (FamilyTree.idb._open = function (e) {
    if (FamilyTree._browser().msie) e && e(!1);
    else if (
      (navigator.userAgent.toLowerCase().indexOf("safari") > 0 ||
        navigator.userAgent.toLowerCase().indexOf("firefox") > 0) &&
      window.location !== window.parent.location
    )
      e && e(!1);
    else {
      if (!window.indexedDB)
        return (
          console.error(
            "Your browser doesn't support a stable version of IndexedDB."
          ),
          void (e && e(!1))
        );
      if (null == FamilyTree.idb.db) {
        var t = indexedDB.open(FamilyTree.idb.dbName, FamilyTree.idb.version);
        (t.onerror = function (t) {
          console.error("Cannot open database!"), e && e(!1);
        }),
          (t.onsuccess = function (t) {
            (FamilyTree.idb.db = t.target.result), e && e(!0);
          }),
          (t.onupgradeneeded = function (e) {
            var t = e.target.result;
            t.objectStoreNames.contains(FamilyTree.idb.tableName) &&
              t.deleteObjectStore(FamilyTree.idb.tableName);
            t.createObjectStore(FamilyTree.idb.tableName, {
              keyPath: FamilyTree.idb.keyPath,
            });
          });
      } else e && e(!0);
    }
  }),
  (FamilyTree.idb.read = function (e, t) {
    FamilyTree.idb._open(function (i) {
      if (i) {
        var r = FamilyTree.idb.db
          .transaction([FamilyTree.idb.tableName])
          .objectStore(FamilyTree.idb.tableName)
          .get(e);
        (r.onerror = function (e) {
          console.error("Unable to retrieve data from database!"), t && t(!1);
        }),
          (r.onsuccess = function (e) {
            r.result ? t && t(!0, r.result) : t && t(null);
          });
      } else t && t(!1);
    });
  }),
  (FamilyTree.idb.write = function (e, t) {
    FamilyTree.idb.read(e.id, function (i) {
      if (null == i) {
        var r = FamilyTree.idb.db
          .transaction([FamilyTree.idb.tableName], "readwrite")
          .objectStore(FamilyTree.idb.tableName)
          .add(e);
        (r.onerror = function (e) {
          console.error("Unable to add data to database!"), t && t(!1);
        }),
          (r.onsuccess = function (e) {
            t && t(!0);
          });
      } else t && t(i);
    });
  }),
  (FamilyTree.idb.put = function (e, t) {
    FamilyTree.idb._open(function (i) {
      if (i) {
        var r = FamilyTree.idb.db
          .transaction([FamilyTree.idb.tableName], "readwrite")
          .objectStore(FamilyTree.idb.tableName)
          .put(e);
        (r.onerror = function (e) {
          console.error("Unable to put data to database!"), t && t(!1);
        }),
          (r.onsuccess = function (e) {
            t && t(!0);
          });
      } else t && t(!1);
    });
  }),
  (FamilyTree.idb.delete = function (e, t) {
    FamilyTree.idb._open(function (i) {
      if (i) {
        var r = FamilyTree.idb.db
          .transaction([FamilyTree.idb.tableName], "readwrite")
          .objectStore(FamilyTree.idb.tableName)
          .delete(e);
        (r.onerror = function (e) {
          console.error("Unable to retrieve data from database!"), t && t(!1);
        }),
          (r.onsuccess = function (e) {
            r.error ? t && t(!1) : t && t(!0);
          });
      } else t && t(!1);
    });
  }),
  (FamilyTree.toolbarUI = function () {}),
  (FamilyTree.toolbarUI.expandAllIcon =
    '<svg style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#757575" /></marker><line x1="11" y1="11" x2="6" y2="6" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="21" y1="11" x2="26" y2="6" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="21" y1="21" x2="26" y2="26" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><line x1="11" y1="21" x2="6" y2="26" stroke="#757575" stroke-width="2" marker-end="url(#arrow)" /><rect x="12" y="12" width="8" height="8" fill="#757575"></rect></svg>'),
  (FamilyTree.toolbarUI.fitIcon =
    '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><circle cx="16" cy="16" r="5" fill="#757575"></circle></svg>'),
  (FamilyTree.toolbarUI.openFullScreenIcon =
    '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><line x1="5" y1="5" x2="27" y2="27" stroke-width="3" stroke="#757575"></line><line x1="5" y1="27" x2="27" y2="5" stroke-width="3" stroke="#757575"></line></svg>'),
  (FamilyTree.toolbarUI.closeFullScreenIcon =
    '<svg  style="margin-bottom:7px;box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M4,11 L4,4 L11,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,11 L28,4 L21,4"></path><path stroke-width="3" fill="none" stroke="#757575" d="M28,21 L28,28 L21,28"></path><path stroke-width="3" fill="none" stroke="#757575" d="M4,21 L4,28 L11,28"></path><rect x="11" y="11" width="10" height="10" stroke-width="3" fill="none" stroke="#757575" ></rect></svg>'),
  (FamilyTree.toolbarUI.zoomInIcon =
    '<svg style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border-left: 1px solid #cacaca; border-right: 1px solid #cacaca; border-top: 1px solid #cacaca; background-color: #f9f9f9;display: block; cursor: pointer;" width="32px" height="32px" ><g><rect fill="#f9f9f9" x="0" y="0" width="32" height="32" ></rect><line x1="8" y1="16" x2="24" y2="16" stroke-width="3" stroke="#757575"></line><line x1="16" y1="8" x2="16" y2="24" stroke-width="3" stroke="#757575"></line></g><line x1="4" y1="32" x2="28" y2="32" stroke-width="1" stroke="#cacaca"></line></svg>'),
  (FamilyTree.toolbarUI.zoomOutIcon =
    '<svg style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); margin-bottom:7px; border-left: 1px solid #cacaca; border-right: 1px solid #cacaca; border-bottom: 1px solid #cacaca; background-color: #f9f9f9;display: block; cursor: pointer;" width="32px" height="32px" ><g><rect fill="#f9f9f9" x="0" y="0" width="32" height="32" ></rect><line x1="8" y1="16" x2="24" y2="16" stroke-width="3" stroke="#757575"></line></g></svg>'),
  (FamilyTree.toolbarUI.layoutIcon =
    "<svg " +
    FamilyTree.attr.tlbr +
    '="layout" style="box-shadow: 0px 1px 4px rgba(0,0,0,0.3); border: 1px solid #cacaca;background-color: #f9f9f9;display: block;cursor: pointer;" width="32px" height="32px"><path stroke-width="3" fill="none" stroke="#757575" d="M8,24 L16,14 L24,24"></path><path stroke-width="3" fill="none" stroke="#757575" d="M8,16 L16,8 L24,16"></path></svg>'),
  (FamilyTree.toolbarUI.prototype.init = function (e, t) {
    if (t) {
      (this.obj = e),
        (this.toolbar = t),
        (this._visible = !1),
        (this.div = document.createElement("div")),
        this.div.classList.add("bft-toolbar-container"),
        this.div.classList.add("inner-fabs"),
        Object.assign(this.div.style, {
          position: "absolute",
          padding: "3px",
          right: this.obj.config.padding - 10 + "px",
          top: this.obj.config.padding - 10 + "px",
        }),
        t.expandAll &&
          (this.div.innerHTML +=
            "<div " +
            FamilyTree.attr.tlbr +
            '="expand">' +
            FamilyTree.toolbarUI.expandAllIcon +
            "</div>"),
        t.zoom &&
          ((this.div.innerHTML +=
            "<div class='fab' " +
            FamilyTree.attr.tlbr +
            '="minus">' +
            FamilyTree.toolbarUI.zoomOutIcon +
            "</div>"),
          (this.div.innerHTML +=
            "<div class='fab' " +
            FamilyTree.attr.tlbr +
            '="plus">' +
            FamilyTree.toolbarUI.zoomInIcon +
            "</div>")),
        t.fit &&
          (this.div.innerHTML +=
            "<div class='fab' " +
            FamilyTree.attr.tlbr +
            '="fit">' +
            FamilyTree.toolbarUI.fitIcon +
            "</div>"),
        t.layout &&
          ((this.div.innerHTML +=
            "<div " +
            FamilyTree.attr.tlbr +
            '="layout">' +
            FamilyTree.toolbarUI.layoutIcon +
            "</div>"),
          (this.layouts = document.createElement("div")),
          (this.layouts.innerHTML =
            "<svg " +
            FamilyTree.attr.layout +
            '="normal" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="41" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="32" x2="88" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="32" x2="32" y1="35" y2="41" stroke-width="1"></line><line stroke="#000000" x1="88" x2="88" y1="35" y2="41" stroke-width="1"></line></svg><svg ' +
            FamilyTree.attr.layout +
            '="treeRightOffset" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="40" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="40" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="60" x2="35" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="35" x2="35" y1="35" y2="86" stroke-width="1"></line><line stroke="#000000" x1="35" x2="40" y1="86" y2="86" stroke-width="1"></line><line stroke="#000000" x1="35" x2="40" y1="54" y2="54" stroke-width="1"></line></svg><svg ' +
            FamilyTree.attr.layout +
            '="treeLeftOffset" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="30" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="30" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="35" stroke-width="1"></line><line stroke="#000000" x1="60" x2="85" y1="35" y2="35" stroke-width="1"></line><line stroke="#000000" x1="85" x2="85" y1="35" y2="86" stroke-width="1"></line><line stroke="#000000" x1="80" x2="85" y1="86" y2="86" stroke-width="1"></line><line stroke="#000000" x1="80" x2="85" y1="54" y2="54" stroke-width="1"></line></svg><svg ' +
            FamilyTree.attr.layout +
            '="mixed" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="35" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="35" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="41" stroke-width="1"></line><line stroke="#000000" x1="60" x2="60" y1="68" y2="73" stroke-width="1"></line></svg><svg ' +
            FamilyTree.attr.layout +
            '="tree" style="cursor: pointer;" width="110" height="100"><rect fill="#039BE5" x="35" y="0" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="7" y="73" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="41" width="50" height="27"></rect><rect fill="#F57C00" x="63" y="73" width="50" height="27"></rect><line stroke="#000000" x1="60" x2="60" y1="27" y2="86" stroke-width="1"></line><line stroke="#000000" x1="57" x2="63" y1="54" y2="54" stroke-width="1"></line><line stroke="#000000" x1="57" x2="63" y1="86" y2="86" stroke-width="1"></line></svg>'),
          this.obj.element.appendChild(this.layouts),
          Object.assign(this.layouts.style, {
            position: "absolute",
            width: "100%",
            left: "0",
            bottom: "-145px",
            "box-shadow": "0px 1px 4px rgba(0,0,0,0.3)",
            "background-color": "#f9f9f9",
            height: "123px",
            "padding-top": "20px",
            "border-top": "1px solid #cacaca",
          })),
        t.fullScreen &&
          (this.div.innerHTML +=
            "<div " +
            FamilyTree.attr.tlbr +
            '="fullScreen">' +
            FamilyTree.toolbarUI.openFullScreenIcon +
            "</div>"),
        this.obj.element.appendChild(this.div),
        (this.layoutBtn = this.div.querySelector(
          "[" + FamilyTree.attr.tlbr + '="layout"]'
        ));
      var i = this.div.querySelector("[" + FamilyTree.attr.tlbr + '="plus"]'),
        r = this.div.querySelector("[" + FamilyTree.attr.tlbr + '="minus"]'),
        a = this.div.querySelector("[" + FamilyTree.attr.tlbr + '="fit"]'),
        n = this.div.querySelector(
          "[" + FamilyTree.attr.tlbr + '="fullScreen"]'
        ),
        o = this.div.querySelector("[" + FamilyTree.attr.tlbr + '="expand"]'),
        l = this;
      i &&
        i.addEventListener("click", function () {
          l.obj.zoom(!0, null, !0);
        }),
        r &&
          r.addEventListener("click", function () {
            l.obj.zoom(!1, null, !0);
          }),
        a &&
          a.addEventListener("click", function () {
            l.obj.fit();
          }),
        n &&
          n.addEventListener("click", function () {
            l.obj.toggleFullScreen();
          }),
        o &&
          o.addEventListener("click", function () {
            l.obj.expand(null, "all");
          }),
        this.layoutBtn &&
          this.layoutBtn.addEventListener("click", function () {
            l._visible ? l.hideLayout() : l.showLayout();
          }),
        this.layouts &&
          this.layouts.addEventListener("click", function (e) {
            for (var t = e.target; t; ) {
              if (t.hasAttribute && t.hasAttribute(FamilyTree.attr.layout)) {
                (t = t.getAttribute(FamilyTree.attr.layout)),
                  l.obj.setLayout(FamilyTree[t]);
                break;
              }
              t = t.parentNode;
            }
          });
    }
  }),
  (FamilyTree.toolbarUI.prototype.showLayout = function () {
    (this._visible = !0),
      (this.layoutBtn.style.transform =
        "rotate(180deg) translateX(0px) translateY(0px)"),
      FamilyTree.anim(
        this.div,
        {
          bottom: this.obj.config.padding - 10,
        },
        {
          bottom: this.obj.config.padding + 135,
        },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
      ),
      FamilyTree.anim(
        this.layouts,
        {
          bottom: -145,
        },
        {
          bottom: 0,
        },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
      );
  }),
  (FamilyTree.toolbarUI.prototype.hideLayout = function () {
    (this._visible = !1),
      (this.layoutBtn.style.transform =
        "rotate(0deg) translateX(0px) translateY(0px)"),
      FamilyTree.anim(
        this.div,
        {
          bottom: this.obj.config.padding + 135,
        },
        {
          bottom: this.obj.config.padding - 10,
        },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
      ),
      FamilyTree.anim(
        this.layouts,
        {
          bottom: 0,
        },
        {
          bottom: -145,
        },
        this.obj.config.anim.duration,
        this.obj.config.anim.func
      );
  }),
  (FamilyTree.notifierUI = function () {}),
  (FamilyTree.notifierUI.prototype.init = function (e) {
    this.obj = e;
  }),
  (FamilyTree.notifierUI.prototype.show = function (e, t) {
    if (null != e) {
      1 == e && ((e = FamilyTree.MAX_NODES_MESS), (t = "#FFCA28")),
        2 == e && ((e = FamilyTree.OFFLINE_MESS), (t = "#FFCA28"));
      var i = document.createElement("div");
      (i.innerHTML = e),
        Object.assign(i.style, {
          position: "absolute",
          "background-color": t,
          color: "#ffffff",
          padding: "15px",
          "border-radius": "40px",
          opacity: 0,
          overflow: "hidden",
          "white-space": "nowrap",
          "text-align": "center",
        }),
        this.obj.element.appendChild(i);
      var r = this.obj.width() / 2 - i.offsetWidth / 2,
        a = this.obj.height() / 2 - i.offsetHeight / 2;
      (i.style.left = r + "px"), (i.style.top = a + "px");
      var n = i.offsetWidth;
      (i.style.width = "20px"),
        FamilyTree.anim(
          i,
          {
            opacity: 0,
            width: 10,
          },
          {
            opacity: 1,
            width: n,
          },
          this.obj.config.anim.duration,
          this.obj.config.anim.func
        );
    }
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree._validateConfig = function (e) {
    return !!e || (console.error("config is not defined"), !1);
  }),
  (FamilyTree._arrayContains = function (e, t) {
    if (e && Array.isArray(e))
      for (var i = e.length; i--; ) if (e[i] === t) return !0;
    return !1;
  }),
  (FamilyTree._interceptions = function (e, t) {
    if (!e) return [];
    if (!t) return [];
    var i = [];
    if (Array.isArray(e) && Array.isArray(t))
      for (var r in e) for (var a in t) e[r] == t[a] && i.push(e[r]);
    else if (Array.isArray(e) && !Array.isArray(t))
      for (var r in e) for (var a in t) e[r] == a && i.push(e[r]);
    else if (!Array.isArray(e) && Array.isArray(t))
      for (var r in e) for (var a in t) r == t[a] && i.push(t[a]);
    return i;
  }),
  (FamilyTree._getTags = function (e) {
    return e.tags && !Array.isArray(e.tags)
      ? e.tags.split(",")
      : e.tags && Array.isArray(e.tags)
      ? e.tags
      : [];
  }),
  (FamilyTree._centerPointInPercent = function (e, t, i) {
    var r = e.getBoundingClientRect(),
      a = t - r.left,
      n = i - r.top;
    return [a / (r.width / 100), n / (r.height / 100)];
  }),
  (FamilyTree._trim = function (e) {
    return e.replace(/^\s+|\s+$/g, "");
  }),
  (FamilyTree._getTransform = function (e) {
    var t = e.getAttribute("transform");
    return (
      (t = t.replace("matrix", "").replace("(", "").replace(")", "")),
      FamilyTree._browser().msie && (t = t.replace(/ /g, ",")),
      (t = "[" + (t = FamilyTree._trim(t)) + "]"),
      (t = JSON.parse(t))
    );
  }),
  (FamilyTree.getScale = function (e, t, i, r, a, n, o, l) {
    var s = 1;
    if (e || r !== FamilyTree.match.boundary)
      if (e || r !== FamilyTree.match.width)
        if (e || r !== FamilyTree.match.height)
          if (e) {
            var d, c;
            s = (d = t / e[2]) > (c = i / e[3]) ? c : d;
          } else s = r;
        else s = i / l;
      else s = t / o;
    else s = (d = t / o) > (c = i / l) ? c : d;
    return s && s > a && (s = a), s && s < n && (s = n), s;
  }),
  (FamilyTree.isObject = function (e) {
    return e && "object" == typeof e && !Array.isArray(e) && null !== e;
  }),
  (FamilyTree.fileUploadDialog = function (e, t) {
    var i = document.createElement("INPUT");
    i.setAttribute("type", "file"),
      (i.style.display = "none"),
      (i.onchange = function () {
        var e = this.files[0];
        t(e);
      }),
      document.body.appendChild(i),
      i.click();
  }),
  (FamilyTree.mergeDeep = function (e, t) {
    if (FamilyTree.isObject(e) && FamilyTree.isObject(t))
      for (var i in t)
        FamilyTree.isObject(t[i])
          ? (e[i] ||
              Object.assign(e, {
                [i]: {},
              }),
            FamilyTree.mergeDeep(e[i], t[i]))
          : Object.assign(e, {
              [i]: t[i],
            });
    return e;
  }),
  (FamilyTree._lblIsImg = function (e, t) {
    return !(
      !e.nodeBinding ||
      "string" != typeof t ||
      -1 == t.indexOf("img") ||
      !e.nodeBinding[t]
    );
  }),
  (FamilyTree._getFistImgField = function (e) {
    if (e.nodeBinding)
      for (var t in e.nodeBinding)
        if (-1 != t.indexOf("img")) return e.nodeBinding[t];
    return !1;
  }),
  (FamilyTree._fieldIsImg = function (e, t) {
    if (e.nodeBinding)
      for (var i in e.nodeBinding)
        if (e.nodeBinding[i] == t) return FamilyTree._lblIsImg(e, i);
    return !1;
  }),
  (FamilyTree._guid = function () {
    function e() {
      return Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
    }
    return (
      e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e()
    );
  }),
  (FamilyTree.htmlRipple = function (e) {
    var t = document.createElement("style");
    (t.type = "text/css"),
      (t.innerHTML =
        " .bft-ripple-container {position: absolute; top: 0; right: 0; bottom: 0; left: 0; } .bft-ripple-container span {transform: scale(0);border-radius:100%;position:absolute;opacity:0.75;background-color:#fff;animation: bft-ripple 1000ms; }@-moz-keyframes bft-ripple {to {opacity: 0;transform: scale(2);}}@-webkit-keyframes bft-ripple {to {opacity: 0;transform: scale(2);}}@-o-keyframes bft-ripple {to {opacity: 0;transform: scale(2);}}@keyframes bft-ripple {to {opacity: 0;transform: scale(2);}}"),
      document.head.appendChild(t);
    var i,
      r,
      a,
      n = document.createElement("div");
    (n.className = "bft-ripple-container"),
      e.addEventListener("mousedown", function (t) {
        var i, r, a, n, o;
        return (
          this,
          (r = document.createElement("span")),
          (a = this.offsetWidth),
          (i = this.getBoundingClientRect()),
          (o = t.pageX - i.left - a / 2),
          (n =
            "top:" +
            (t.pageY - i.top - a / 2) +
            "px; left: " +
            o +
            "px; height: " +
            a +
            "px; width: " +
            a +
            "px;"),
          e.rippleContainer.appendChild(r),
          r.setAttribute("style", n)
        );
      }),
      e.addEventListener(
        "mouseup",
        ((i = function () {
          for (; this.rippleContainer.firstChild; )
            this.rippleContainer.removeChild(this.rippleContainer.firstChild);
        }),
        (r = 2e3),
        (a = void 0),
        function () {
          var e, t;
          return (
            (t = this),
            (e = arguments),
            clearTimeout(a),
            (a = setTimeout(function () {
              return i.apply(t, e);
            }, r))
          );
        })
      ),
      (e.rippleContainer = n),
      e.appendChild(n);
  }),
  (FamilyTree._moveToBoundaryArea = function (e, t, i, r) {
    var a = t.slice(0);
    t[0] < i.left &&
      t[0] < i.right &&
      (a[0] = i.left > i.right ? i.right : i.left),
      t[0] > i.right &&
        t[0] > i.left &&
        (a[0] = i.left > i.right ? i.left : i.right),
      t[1] < i.top &&
        t[1] < i.bottom &&
        (a[1] = i.top > i.bottom ? i.bottom : i.top),
      t[1] > i.bottom &&
        t[1] > i.top &&
        (a[1] = i.top > i.bottom ? i.top : i.bottom),
      t[0] !== a[0] || t[1] !== a[1]
        ? FamilyTree.anim(
            e,
            {
              viewBox: t,
            },
            {
              viewBox: a,
            },
            300,
            FamilyTree.anim.outPow,
            function () {
              r && r();
            }
          )
        : r && r();
  }),
  (FamilyTree.randomId = function () {
    return (
      "_" +
      ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4)
    );
  }),
  (FamilyTree._getClientXY = function (e) {
    return -1 == e.type.indexOf("touch")
      ? {
          x: e.clientX,
          y: e.clientY,
        }
      : e.changedTouches.length
      ? {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        }
      : void 0;
  }),
  (FamilyTree._getClientTouchesXY = function (e, t) {
    return -1 != e.type.indexOf("touch")
      ? e.touches.length < t + 1
        ? {
            x: null,
            y: null,
          }
        : {
            x: e.touches[t].clientX,
            y: e.touches[t].clientY,
          }
      : {
          x: e.clientX,
          y: e.clientY,
        };
  }),
  (FamilyTree._getOffset = function (e, t) {
    e &&
      ((t.x += e.offsetLeft),
      (t.y += e.offsetTop),
      FamilyTree._getOffset(e.offsetParent, t));
  }),
  (FamilyTree._getTopLeft = function (e) {
    var t = {
      x: 0,
      y: 0,
    };
    return FamilyTree._getOffset(e, t), t;
  }),
  (FamilyTree._getOffsetXY = function (e, t) {
    if (-1 == t.type.indexOf("touch"))
      return {
        x: t.offsetX,
        y: t.offsetY,
      };
    if (t.touches.length) {
      var i = FamilyTree._getTopLeft(e);
      return {
        x: t.touches[0].pageX - i.x,
        y: t.touches[0].pageY - i.y,
      };
    }
    if (t.changedTouches.length) {
      i = FamilyTree._getTopLeft(e);
      return {
        x: t.changedTouches[0].pageX - i.x,
        y: t.changedTouches[0].pageY - i.y,
      };
    }
  }),
  (FamilyTree._pinchMiddlePointInPercent = function (e, t, i, r) {
    var a = FamilyTree._getTopLeft(e),
      n = r.touches[0].pageX - a.x,
      o = r.touches[0].pageY - a.y,
      l = r.touches[1].pageX - a.x,
      s = r.touches[1].pageY - a.y;
    return [((n - l) / 2 + l) / (t / 100), ((o - s) / 2 + s) / (i / 100)];
  }),
  (FamilyTree._browser = function () {
    var e =
        (!!window.opr && !!opr.addons) ||
        !!window.opera ||
        navigator.userAgent.indexOf(" OPR/") >= 0,
      t = "undefined" != typeof InstallTrigger,
      i =
        /constructor/i.test(window.HTMLElement) ||
        "[object SafariRemoteNotification]" ===
          (
            !window.safari ||
            ("undefined" != typeof safari && safari.pushNotification)
          ).toString(),
      r = !!document.documentMode,
      a = !r && !!window.StyleMedia,
      n = !(
        !window.chrome ||
        (!window.chrome.webstore && !window.chrome.runtime)
      );
    return {
      opera: e,
      firefox: t,
      safari: i,
      msie: r,
      edge: a,
      chrome: n,
      blink: (n || e) && !!window.CSS,
    };
  }),
  (FamilyTree._menuPosition = function (e, t, i) {
    var r = e.getBoundingClientRect(),
      a = i.getBoundingClientRect(),
      n = t.getBoundingClientRect(),
      o = r.left - a.left,
      l = r.top - a.top;
    return (
      r.top + n.height > a.top + a.height && (l -= n.height),
      r.left - n.width < a.left && (o += n.width),
      {
        x: o,
        y: l,
      }
    );
  }),
  (FamilyTree._getTemplate = function (e, t, i) {
    if (Array.isArray(e))
      for (var r = 0; r < e.length; r++) {
        var a = t[e[r]];
        if (a && a.template) return a.template;
      }
    return i;
  }),
  (FamilyTree._getMin = function (e, t) {
    if (e.tags && e.tags.length && t.tags)
      for (var i = 0; i < e.tags.length; i++) {
        var r = t.tags[e.tags[i]];
        if (r && !0 === r.min) return !0;
      }
    return t.min;
  }),
  (FamilyTree._getSubLevels = function (e, t) {
    if (e && e.length)
      for (var i = 0; i < e.length; i++) {
        var r = t[e[i]];
        if (r && r.subLevels) return r.subLevels;
      }
    return 0;
  }),
  (FamilyTree._isHTML = function (e) {
    var t = document.createElement("div");
    t.innerHTML = e;
    for (var i = t.childNodes, r = i.length; r--; )
      if (1 == i[r].nodeType) return !0;
    return !1;
  }),
  (FamilyTree._getTestDiv = function () {
    var e = document.getElementById("familytree_js_test_div");
    return (
      e ||
        (((e = document.createElement("div")).id = "familytree_js_test_div"),
        (e.style.position = "fixed"),
        (e.style.top = "-10000px"),
        (e.style.left = "-10000px"),
        document.body.appendChild(e)),
      e
    );
  }),
  (FamilyTree._getLabelSize = function (e) {
    var t = FamilyTree._getTestDiv();
    return (
      (t.innerHTML = "<svg>" + e + "</svg>"),
      t.querySelector("text").getBoundingClientRect()
    );
  }),
  (FamilyTree.wrapText = function (e, t) {
    var i = t.toLowerCase();
    if (-1 == i.indexOf("<text")) return e;
    if (-1 == i.indexOf(FamilyTree.attr.width)) return e;
    if (-1 != i.indexOf("foreignobject")) return e;
    if (-1 == t.indexOf(FamilyTree.attr.width)) return e;
    if (FamilyTree._isHTML(e)) return e;
    var r = FamilyTree._getTestDiv();
    (t = t.replaceAll("{cw}", 0)), (r.innerHTML = "<svg>" + t + "</svg>");
    var a,
      n,
      o = new DOMParser()
        .parseFromString(t, "text/xml")
        .getElementsByTagName("text")[0],
      l = parseFloat(o.getAttribute("x")),
      s = parseFloat(o.getAttribute("y")),
      d = o.getAttribute("text-anchor"),
      c = o.getAttribute(FamilyTree.attr.width),
      m = o.getAttribute(FamilyTree.attr.text_overflow),
      h = "http://www.w3.org/2000/svg",
      p = r.getElementsByTagName("svg")[0].getElementsByTagName("text")[0];
    m || (m = "ellipsis");
    var f = m.split("-");
    if (
      (f.length > 1 &&
        ((a = parseInt(m.split("-")[1])),
        f.length > 2 && "ellipsis" == f[2] && (n = !0)),
      !c)
    )
      return e;
    if (
      ((c = parseFloat(c)),
      l || (l = 0),
      s || (s = 0),
      l || (d = "start"),
      "ellipsis" == m)
    ) {
      p.removeChild(p.firstChild), (p.textContent = e);
      for (var y = p.getComputedTextLength(), u = 2; y > c; )
        (p.textContent = e.substring(0, e.length - u)),
          (p.textContent += "..."),
          (y = p.getComputedTextLength()),
          u++;
      return u > 2 ? "<title>" + e + "</title>" + p.textContent : e;
    }
    if (-1 != m.indexOf("multiline")) {
      var g = e.split(" "),
        b = p.getBBox().height;
      p.textContent = "";
      var T = document.createElementNS(h, "tspan"),
        v = document.createTextNode(g[0]);
      T.setAttributeNS(null, "x", l),
        T.setAttributeNS(null, "y", s),
        T.setAttributeNS(null, "text-anchor", d),
        T.appendChild(v),
        p.appendChild(T);
      u = 1;
      for (var F = 1, x = 1; x < g.length; x++) {
        var _ = T.firstChild.data.length;
        if (
          ((T.firstChild.data += " " + g[x]), T.getComputedTextLength() > c)
        ) {
          if (
            ((T.firstChild.data = T.firstChild.data.slice(0, _)),
            F++,
            a && F > a)
          ) {
            if (n && p.children.length == a) {
              var w = p.children[a - 1].textContent;
              p.children[a - 1].textContent =
                w.substring(0, w.length - 3) + "...";
            }
            break;
          }
          (T = document.createElementNS(h, "tspan")).setAttributeNS(
            null,
            "x",
            l
          ),
            T.setAttributeNS(null, "y", s + b * u),
            T.setAttributeNS(null, "text-anchor", d),
            (v = document.createTextNode(g[x])),
            T.appendChild(v),
            p.appendChild(T),
            u++;
        }
      }
      var k = "";
      if (null != p.innerHTML) (k = p.innerHTML), (p.innerHTML = "");
      else {
        var S = "";
        for (x = p.childNodes.length - 1; x >= 0; x--)
          (S = XMLSerializer().serializeToString(p.childNodes[x]) + S),
            p.removeChild(p.childNodes[x]);
        k = S;
      }
      return k;
    }
  }),
  (FamilyTree._downloadFile = function (e, t, i, r) {
    var a = new Blob([t], {
      type: e,
    });
    if (1 == r) {
      var n = URL.createObjectURL(a);
      window.open(n, "_blank").focus();
    } else if (navigator.msSaveBlob) navigator.msSaveBlob(a, i);
    else {
      var o = document.createElement("a");
      if (void 0 !== o.download) {
        n = URL.createObjectURL(a);
        o.setAttribute("href", n),
          o.setAttribute("download", i),
          (o.style.visibility = "hidden"),
          document.body.appendChild(o),
          o.click(),
          document.body.removeChild(o);
      }
    }
  }),
  (FamilyTree._getPosition = function (e, t, i, r) {
    var a = {
      x: t.x,
      y: t.y,
    };
    if ((null != i && (a.x = i), null != r && (a.y = i), e && 3 == e.length)) {
      var n = e[0].indexOf(t.id);
      -1 != n &&
        null != e[1][n].transform &&
        (null == i && (a.x = e[1][n].transform[4]),
        null == r && (a.y = e[1][n].transform[5]));
    }
    return a;
  }),
  (FamilyTree._getOpacity = function (e, t) {
    var i = 1;
    if (e && 3 == e.length) {
      var r = e[0].indexOf(t.id);
      -1 != r && null != e[1][r].opacity && (i = e[1][r].opacity);
    }
    return i;
  }),
  (FamilyTree.t = function (e, t, i) {
    var r = FamilyTree.templates[e],
      a = null;
    if (null != i && r.scaleLessThen) {
      var n = [];
      for (var o in r.scaleLessThen) {
        var l = parseFloat(o);
        i < l && n.push(l);
      }
      if (n.length > 0) {
        n.sort(function (e, t) {
          return e - t;
        });
        var s = r.scaleLessThen[n[0]];
        for (var d in s) null == a && (a = Object.assign({}, r)), (a[d] = s[d]);
      }
    }
    return t
      ? null == a
        ? r.min
          ? r.min
          : r
        : a.min
        ? a.min
        : a
      : null == a
      ? r
      : a;
  }),
  (FamilyTree.setNodeSize = function (e) {
    var t = FamilyTree.t(e.templateName, e.min);
    (e.w = t && t.size ? t.size[0] : 0), (e.h = t && t.size ? t.size[1] : 0);
  }),
  (FamilyTree._imgs2base64 = function (e, t, i, r) {
    var a = e.getElementsByTagName(t),
      n = a.length;
    0 == n && r();
    for (var o = 0; o < n; o++)
      !(function () {
        var e = o,
          t = a[e];
        FamilyTree._getDataUri(t.getAttribute(i), function (a) {
          a.success && t.setAttribute(i, a.result), e == n - 1 && r();
        });
      })();
  }),
  (FamilyTree._getDataUri = function (e, t) {
    if (-1 != e.indexOf("base64"))
      t({
        success: !1,
      });
    else {
      var i = new XMLHttpRequest();
      i.open("GET", e),
        (i.responseType = "blob"),
        (i.onload = function () {
          200 === i.status
            ? r.readAsDataURL(i.response)
            : 404 === i.status &&
              t({
                success: !1,
                result: i.status,
              });
        });
      var r = new FileReader();
      (r.onloadend = function () {
        t({
          success: !0,
          result: r.result,
        });
      }),
        i.send();
    }
  }),
  (FamilyTree._csvToArray = function (e, t) {
    t = t || ",";
    for (
      var i = new RegExp(
          "(\\" +
            t +
            '|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\' +
            t +
            "\\r\\n]*))",
          "gi"
        ),
        r = [[]],
        a = null;
      (a = i.exec(e));

    ) {
      var n,
        o = a[1];
      o.length && o !== t && r.push([]),
        (n = a[2] ? a[2].replace(new RegExp('""', "g"), '"') : a[3]),
        r[r.length - 1].push(n);
    }
    return r;
  }),
  (FamilyTree._json2xml = function (e) {
    for (
      var t = document.implementation.createDocument("", "", null),
        i = t.createElement("nodes"),
        r = 0;
      r < e.length;
      r++
    ) {
      var a = t.createElement("node"),
        n = e[r];
      for (var o in n) {
        var l = n[o];
        "tags" == o && (l = l.join()), a.setAttribute(o, l);
      }
      i.appendChild(a);
    }
    return (
      t.appendChild(i),
      '<?xml version="1.0" encoding="utf-8" ?>' +
        new XMLSerializer().serializeToString(t.documentElement)
    );
  }),
  (FamilyTree._xml2json = function (e) {
    for (
      var t = new DOMParser()
          .parseFromString(e, "text/xml")
          .getElementsByTagName("node"),
        i = [],
        r = 0;
      r < t.length;
      r++
    ) {
      for (var a = t[r], n = {}, o = 0; o < a.attributes.length; o++) {
        var l = a.attributes[o],
          s = l.value;
        "tags" == l.name && (s = s.split(",")), (n[l.name] = s);
      }
      i.push(n);
    }
    return i;
  }),
  (FamilyTree._json2csv = function (e) {
    for (
      var t = [],
        i = function (e) {
          for (var i = "", r = 0; r < t.length; r++) {
            var a;
            (a =
              "reportsTo" == t[r]
                ? null
                : null == e[t[r]]
                ? ""
                : e[t[r]]) instanceof Date && (a = a.toLocaleString());
            var n = (a = null === a ? "" : a.toString()).replace(/"/g, '""');
            n.search(/("|,|\n)/g) >= 0 && (n = '"' + n + '"'),
              r > 0 && (i += ","),
              (i += n);
          }
          return i + "\n";
        },
        r = "",
        a = 0;
      a < e.length;
      a++
    )
      for (var n in e[a])
        FamilyTree._arrayContains(t, n) || (t.push(n), (r += n + ","));
    (r = r.substring(0, r.length - 1)), (r += "\n");
    for (a = 0; a < e.length; a++) r += i(e[a]);
    return (r = r.substring(0, r.length - 1));
  }),
  (FamilyTree.accentFold = function (e) {
    return (e = e.toString().toLowerCase()).replace(
      /([àáâãäå])|([ç])|([èéêë])|([ìíîï])|([ñ])|([òóôõöø])|([ß])|([ùúûü])|([ÿ])|([æ])/g,
      function (e, t, i, r, a, n, o, l, s, d, c) {
        return t
          ? "a"
          : i
          ? "c"
          : r
          ? "e"
          : a
          ? "i"
          : n
          ? "n"
          : o
          ? "o"
          : l
          ? "s"
          : s
          ? "u"
          : d
          ? "y"
          : c
          ? "ae"
          : void 0;
      }
    );
  }),
  (FamilyTree.copy = function (e) {
    if (null === e || "object" != typeof e || "isActiveClone" in e) return e;
    if (e instanceof Date) var t = new e.constructor();
    else t = e.constructor();
    for (var i in e)
      Object.prototype.hasOwnProperty.call(e, i) &&
        ((e.isActiveClone = null),
        (t[i] = FamilyTree.copy(e[i])),
        delete e.isActiveClone);
    return t;
  }),
  (FamilyTree._getScrollSensitivity = function () {
    var e = FamilyTree._browser();
    return e.msie && FamilyTree.scroll.ie
      ? FamilyTree.scroll.ie
      : e.edge && FamilyTree.scroll.edge
      ? FamilyTree.scroll.edge
      : e.safari && FamilyTree.scroll.safari
      ? FamilyTree.scroll.safari
      : e.chrome && FamilyTree.scroll.chrome
      ? FamilyTree.scroll.chrome
      : e.firefox && FamilyTree.scroll.firefox
      ? FamilyTree.scroll.firefox
      : e.opera && FamilyTree.scroll.opera
      ? FamilyTree.scroll.opera
      : {
          smooth: FamilyTree.scroll.smooth,
          speed: FamilyTree.scroll.speed,
        };
  }),
  (FamilyTree.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }),
  (FamilyTree.isTrial = function () {
    return void 0 !== FamilyTree.remote;
  }),
  (FamilyTree.childrenCount = function (e, t, i) {
    null == i && (i = 0);
    for (var r = 0; r < t.childrenIds.length; r++) {
      var a = e.nodes[t.childrenIds[r]];
      a && (i++, FamilyTree.childrenCount(e, a, i));
    }
    return i;
  }),
  (FamilyTree.collapsedChildrenCount = function (e, t, i) {
    null == i && (i = 0);
    for (var r = 0; r < t.childrenIds.length; r++) {
      var a = e.nodes[t.childrenIds[r]];
      a &&
        (!0 === a.collapsed && i++, FamilyTree.collapsedChildrenCount(e, a, i));
    }
    return i;
  }),
  (FamilyTree._setMinMaxXY = function (e, t) {
    (null == t.minX || (null != e.x && e.x < t.minX)) && (t.minX = e.x),
      (null == t.minY || (null != e.y && e.y < t.minY)) && (t.minY = e.y),
      (null == t.maxX || (null != e.x && e.x + e.w > t.maxX)) &&
        (t.maxX = e.x + e.w),
      (null == t.maxY || (null != e.y && e.y + e.h > t.maxY)) &&
        (t.maxY = e.y + e.h);
  }),
  (FamilyTree.getStParentNodes = function (e, t) {
    for (t || (t = []); e.parent; ) e = e.parent;
    return (
      e.stParent &&
        (t.push(e.stParent), FamilyTree.getStParentNodes(e.stParent, t)),
      t
    );
  }),
  (FamilyTree.getRootOf = function (e) {
    for (; e && e.parent; ) e = e.parent;
    return e;
  }),
  (FamilyTree._getViewBox = function (e) {
    var t = null;
    return e
      ? ((t = (t = "[" + (t = e.getAttribute("viewBox")) + "]").replace(
          /\ /g,
          ","
        )),
        (t = JSON.parse(t)))
      : null;
  }),
  (FamilyTree.isNEU = function (e) {
    return null == e || "" === e;
  }),
  (FamilyTree.gradientCircleForDefs = function (e, t, i, r) {
    function a(e, t, i, r) {
      var a = ((r - 90) * Math.PI) / 180;
      return {
        x: e + i * Math.cos(a),
        y: t + i * Math.sin(a),
      };
    }

    function n(e, t, i, r, n) {
      var o = a(e, t, i, n),
        l = a(e, t, i, r),
        s = n - r <= 180 ? "0" : "1";
      return ["M", o.x, o.y, "A", i, i, 0, s, 0, l.x, l.y].join(" ");
    }
    return `<linearGradient id="${e}_linearColors1" x1="0" y1="0" x2="1" y2="1">\n            <stop offset="0%" stop-color="${
      t[0]
    }"></stop>\n            <stop offset="100%" stop-color="${
      t[1]
    }"></stop>\n        </linearGradient>\n        <linearGradient id="${e}_linearColors2" x1="0.5" y1="0" x2="0.5" y2="1">\n            <stop offset="0%" stop-color="${
      t[1]
    }"></stop>\n            <stop offset="100%" stop-color="${
      t[2]
    }"></stop>\n        </linearGradient>\n        <linearGradient id="${e}_linearColors3" x1="1" y1="0" x2="0" y2="1">\n            <stop offset="0%" stop-color="${
      t[2]
    }"></stop>\n            <stop offset="100%" stop-color="${
      t[3]
    }"></stop>\n        </linearGradient>\n        <linearGradient id="${e}_linearColors4" x1="1" y1="1" x2="0" y2="0">\n            <stop offset="0%" stop-color="${
      t[3]
    }"></stop>\n            <stop offset="100%" stop-color="${
      t[4]
    }"></stop>\n        </linearGradient>\n        <linearGradient id="${e}_linearColors5" x1="0.5" y1="1" x2="0.5" y2="0">\n            <stop offset="0%" stop-color="${
      t[4]
    }"></stop>\n            <stop offset="100%" stop-color="${
      t[5]
    }"></stop>\n        </linearGradient>\n        <linearGradient id="${e}_linearColors6" x1="0" y1="1" x2="1" y2="0">\n            <stop offset="0%" stop-color="${
      t[5]
    }"></stop>\n            <stop offset="100%" stop-color="${
      t[0]
    }"></stop>\n        </linearGradient>        \n        <g id="${e}">\n            <path stroke-width="${r}" fill="none" stroke="url(#${e}_linearColors1)" d="${n(
      i,
      i,
      i,
      1,
      60
    )}"  />\n            <path stroke-width="${r}" fill="none" stroke="url(#${e}_linearColors2)" d="${n(
      i,
      i,
      i,
      60,
      120
    )}"/>\n            <path stroke-width="${r}" fill="none" stroke="url(#${e}_linearColors3)" d="${n(
      i,
      i,
      i,
      120,
      180
    )}" />\n            <path stroke-width="${r}" fill="none" stroke="url(#${e}_linearColors4)" d="${n(
      i,
      i,
      i,
      180,
      240
    )}" />\n            <path stroke-width="${r}" fill="none" stroke="url(#${e}_linearColors5)" d="${n(
      i,
      i,
      i,
      240,
      300
    )}" />\n            <path stroke-width="${r}" fill="none" stroke="url(#${e}_linearColors6)" d="${n(
      i,
      i,
      i,
      300,
      1
    )}"/>\n        </g>`;
  }),
  (FamilyTree._changeRootOption = function (e, t, i) {
    for (var r = [], a = 0; a < t.length; a++)
      for (var n = 0; n < i.length; n++)
        if (i[n].has(t[a])) {
          r = i[n];
          break;
        }
    for (a = 0; a < r.length; a++) {
      var o = e.indexOf(r[a]);
      -1 != o && e.splice(o, 1);
    }
    t.length && e.push(t[0]);
  }),
  (FamilyTree.icon = {}),
  (FamilyTree.icon.png = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 550.801 550.801"><path fill="' +
      i +
      '" d="M146.747,276.708c0-13.998-9.711-22.352-26.887-22.352c-6.99,0-11.726,0.675-14.204,1.355v44.927 c2.932,0.676,6.539,0.896,11.52,0.896C135.449,301.546,146.747,292.28,146.747,276.708z"/><path fill="' +
      i +
      '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M234.344,335.86v45.831h-31.601V229.524h40.184 l31.611,55.759c9.025,16.031,18.064,34.983,24.825,52.154h0.675c-2.257-20.103-2.933-40.643-2.933-63.44v-44.473h31.614v152.167 h-36.117l-32.516-58.703c-9.049-16.253-18.971-35.892-26.438-53.727l-0.665,0.222C233.906,289.58,234.344,311.027,234.344,335.86z M71.556,381.691V231.56c10.613-1.804,25.516-3.159,46.506-3.159c21.215,0,36.353,4.061,46.509,12.192 c9.698,7.673,16.255,20.313,16.255,35.219c0,14.897-4.959,27.549-13.999,36.123c-11.738,11.063-29.123,16.031-49.441,16.031 c-4.522,0-8.593-0.231-11.736-0.675v54.411H71.556V381.691z M453.601,523.353H97.2V419.302h356.4V523.353z M485.652,374.688 c-10.61,3.607-30.713,8.585-50.805,8.585c-27.759,0-47.872-7.003-61.857-20.545c-13.995-13.1-21.684-32.97-21.452-55.318 c0.222-50.569,37.03-79.463,86.917-79.463c19.644,0,34.783,3.829,42.219,7.446l-7.214,27.543c-8.369-3.617-18.752-6.55-35.458-6.55 c-28.656,0-50.341,16.256-50.341,49.22c0,31.382,19.649,49.892,47.872,49.892c7.895,0,14.218-0.901,16.934-2.257v-31.835h-23.493 v-26.869h56.679V374.688z"/></svg>'
    );
  }),
  (FamilyTree.icon.pdf = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 550.801 550.801"><path fill="' +
      i +
      '" d="M160.381,282.225c0-14.832-10.299-23.684-28.474-23.684c-7.414,0-12.437,0.715-15.071,1.432V307.6 c3.114,0.707,6.942,0.949,12.192,0.949C148.419,308.549,160.381,298.74,160.381,282.225z"/><path fill="' +
      i +
      '" d="M272.875,259.019c-8.145,0-13.397,0.717-16.519,1.435v105.523c3.116,0.729,8.142,0.729,12.69,0.729 c33.017,0.231,54.554-17.946,54.554-56.474C323.842,276.719,304.215,259.019,272.875,259.019z"/><path fill="' +
      i +
      '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M362.359,309.023c0,30.876-11.243,52.165-26.82,65.333 c-16.971,14.117-42.82,20.814-74.396,20.814c-18.9,0-32.297-1.197-41.401-2.389V234.365c13.399-2.149,30.878-3.346,49.304-3.346 c30.612,0,50.478,5.508,66.039,17.226C351.828,260.69,362.359,280.547,362.359,309.023z M80.7,393.499V234.365 c11.241-1.904,27.042-3.346,49.296-3.346c22.491,0,38.527,4.308,49.291,12.928c10.292,8.131,17.215,21.534,17.215,37.328 c0,15.799-5.25,29.198-14.829,38.285c-12.442,11.728-30.865,16.996-52.407,16.996c-4.778,0-9.1-0.243-12.435-0.723v57.67H80.7 V393.499z M453.601,523.353H97.2V419.302h356.4V523.353z M484.898,262.127h-61.989v36.851h57.913v29.674h-57.913v64.848h-36.593 V232.216h98.582V262.127z"/></svg>'
    );
  }),
  (FamilyTree.icon.svg = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 550.801 550.801"><path fill="' +
      i +
      '" d="M488.426,197.019H475.2v-63.816c0-0.398-0.063-0.799-0.116-1.202c-0.021-2.534-0.827-5.023-2.562-6.995L366.325,3.694 c-0.032-0.031-0.063-0.042-0.085-0.076c-0.633-0.707-1.371-1.295-2.151-1.804c-0.231-0.155-0.464-0.285-0.706-0.419 c-0.676-0.369-1.393-0.675-2.131-0.896c-0.2-0.056-0.38-0.138-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.873v160.545 c0,17.043,13.824,30.87,30.873,30.87h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87v-160.54C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.513c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M338.871,225.672L284.545,386.96h-42.591 l-51.69-161.288h39.967l19.617,68.196c5.508,19.143,10.531,37.567,14.36,57.67h0.717c4.061-19.385,9.089-38.527,14.592-56.953 l20.585-68.918h38.77V225.672z M68.458,379.54l7.415-30.153c9.811,5.021,24.888,10.051,40.439,10.051 c16.751,0,25.607-6.935,25.607-17.465c0-10.052-7.662-15.795-27.05-22.734c-26.8-9.328-44.263-24.168-44.263-47.611 c0-27.524,22.971-48.579,61.014-48.579c18.188,0,31.591,3.823,41.159,8.131l-8.126,29.437c-6.465-3.116-17.945-7.657-33.745-7.657 c-15.791,0-23.454,7.183-23.454,15.552c0,10.296,9.089,14.842,29.917,22.731c28.468,10.536,41.871,25.365,41.871,48.094 c0,27.042-20.812,50.013-65.09,50.013C95.731,389.349,77.538,384.571,68.458,379.54z M453.601,523.353H97.2V419.302h356.4V523.353z M488.911,379.54c-11.243,3.823-32.537,9.103-53.831,9.103c-29.437,0-50.73-7.426-65.57-21.779 c-14.839-13.875-22.971-34.942-22.738-58.625c0.253-53.604,39.255-84.235,92.137-84.235c20.81,0,36.852,4.073,44.74,7.896 l-7.657,29.202c-8.859-3.829-19.849-6.95-37.567-6.95c-30.396,0-53.357,17.233-53.357,52.173c0,33.265,20.81,52.882,50.73,52.882 c8.375,0,15.072-0.96,17.94-2.395v-33.745h-24.875v-28.471h60.049V379.54L488.911,379.54z" /></svg>'
    );
  }),
  (FamilyTree.icon.csv = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 548.29 548.291" ><path fill="' +
      i +
      '" d="M486.2,196.121h-13.164V132.59c0-0.399-0.064-0.795-0.116-1.2c-0.021-2.52-0.824-5-2.551-6.96L364.656,3.677 c-0.031-0.034-0.064-0.044-0.085-0.075c-0.629-0.707-1.364-1.292-2.141-1.796c-0.231-0.157-0.462-0.286-0.704-0.419 c-0.672-0.365-1.386-0.672-2.121-0.893c-0.199-0.052-0.377-0.134-0.576-0.188C358.229,0.118,357.4,0,356.562,0H96.757 C84.893,0,75.256,9.649,75.256,21.502v174.613H62.093c-16.972,0-30.733,13.756-30.733,30.73v159.81 c0,16.966,13.761,30.736,30.733,30.736h13.163V526.79c0,11.854,9.637,21.501,21.501,21.501h354.777 c11.853,0,21.502-9.647,21.502-21.501V417.392H486.2c16.966,0,30.729-13.764,30.729-30.731v-159.81 C516.93,209.872,503.166,196.121,486.2,196.121z M96.757,21.502h249.053v110.006c0,5.94,4.818,10.751,10.751,10.751h94.973v53.861 H96.757V21.502z M258.618,313.18c-26.68-9.291-44.063-24.053-44.063-47.389c0-27.404,22.861-48.368,60.733-48.368 c18.107,0,31.447,3.811,40.968,8.107l-8.09,29.3c-6.43-3.107-17.862-7.632-33.59-7.632c-15.717,0-23.339,7.149-23.339,15.485 c0,10.247,9.047,14.769,29.78,22.632c28.341,10.479,41.681,25.239,41.681,47.874c0,26.909-20.721,49.786-64.792,49.786 c-18.338,0-36.449-4.776-45.497-9.77l7.38-30.016c9.772,5.014,24.775,10.006,40.264,10.006c16.671,0,25.488-6.908,25.488-17.396 C285.536,325.789,277.909,320.078,258.618,313.18z M69.474,302.692c0-54.781,39.074-85.269,87.654-85.269 c18.822,0,33.113,3.811,39.549,7.149l-7.392,28.816c-7.38-3.084-17.632-5.939-30.491-5.939c-28.822,0-51.206,17.375-51.206,53.099 c0,32.158,19.051,52.4,51.456,52.4c10.947,0,23.097-2.378,30.241-5.238l5.483,28.346c-6.672,3.34-21.674,6.919-41.208,6.919 C98.06,382.976,69.474,348.424,69.474,302.692z M451.534,520.962H96.757v-103.57h354.777V520.962z M427.518,380.583h-42.399 l-51.45-160.536h39.787l19.526,67.894c5.479,19.046,10.479,37.386,14.299,57.397h0.709c4.048-19.298,9.045-38.352,14.526-56.693 l20.487-68.598h38.599L427.518,380.583z" /></svg>'
    );
  }),
  (FamilyTree.icon.excel = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 512 512"><path fill="#ECEFF1" d="M496,432.011H272c-8.832,0-16-7.168-16-16s0-311.168,0-320s7.168-16,16-16h224 c8.832,0,16,7.168,16,16v320C512,424.843,504.832,432.011,496,432.011z" /><path fill="' +
      i +
      '" d="M336,176.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,176.011,336,176.011z" /><path fill="' +
      i +
      '" d="M336,240.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,240.011,336,240.011z" /><path fill="' +
      i +
      '" d="M336,304.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,304.011,336,304.011z" /><path fill="' +
      i +
      '" d="M336,368.011h-64c-8.832,0-16-7.168-16-16s7.168-16,16-16h64c8.832,0,16,7.168,16,16 S344.832,368.011,336,368.011z" /><path fill="' +
      i +
      '" d="M432,176.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,176.011,432,176.011z" /><path fill="' +
      i +
      '" d="M432,240.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,240.011,432,240.011z" /><path fill="' +
      i +
      '" d="M432,304.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,304.011,432,304.011z" /><path fill="' +
      i +
      '" d="M432,368.011h-32c-8.832,0-16-7.168-16-16s7.168-16,16-16h32c8.832,0,16,7.168,16,16 S440.832,368.011,432,368.011z" /><path fill="' +
      i +
      '"  d="M282.208,19.691c-3.648-3.04-8.544-4.352-13.152-3.392l-256,48C5.472,65.707,0,72.299,0,80.011v352 c0,7.68,5.472,14.304,13.056,15.712l256,48c0.96,0.192,1.952,0.288,2.944,0.288c3.712,0,7.328-1.28,10.208-3.68 c3.68-3.04,5.792-7.584,5.792-12.32v-448C288,27.243,285.888,22.731,282.208,19.691z" /><path fill="#FAFAFA" d="M220.032,309.483l-50.592-57.824l51.168-65.792c5.44-6.976,4.16-17.024-2.784-22.464 c-6.944-5.44-16.992-4.16-22.464,2.784l-47.392,60.928l-39.936-45.632c-5.856-6.72-15.968-7.328-22.56-1.504 c-6.656,5.824-7.328,15.936-1.504,22.56l44,50.304L83.36,310.187c-5.44,6.976-4.16,17.024,2.784,22.464 c2.944,2.272,6.432,3.36,9.856,3.36c4.768,0,9.472-2.112,12.64-6.176l40.8-52.48l46.528,53.152 c3.168,3.648,7.584,5.504,12.032,5.504c3.744,0,7.488-1.312,10.528-3.968C225.184,326.219,225.856,316.107,220.032,309.483z" /></svg>'
    );
  }),
  (FamilyTree.icon.edit = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 528.899 528.899"><path fill="' +
      i +
      '" d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" /></svg>'
    );
  }),
  (FamilyTree.icon.details = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 512 512"><path fill="' +
      i +
      '" d="M447.933,103.629c-0.034-3.076-1.224-6.09-3.485-8.352L352.683,3.511c-0.004-0.004-0.007-0.005-0.011-0.008 C350.505,1.338,347.511,0,344.206,0H89.278C75.361,0,64.04,11.32,64.04,25.237v461.525c0,13.916,11.32,25.237,25.237,25.237 h333.444c13.916,0,25.237-11.32,25.237-25.237V103.753C447.96,103.709,447.937,103.672,447.933,103.629z M356.194,40.931 l50.834,50.834h-49.572c-0.695,0-1.262-0.567-1.262-1.262V40.931z M423.983,486.763c0,0.695-0.566,1.261-1.261,1.261H89.278 c-0.695,0-1.261-0.566-1.261-1.261V25.237c0-0.695,0.566-1.261,1.261-1.261h242.94v66.527c0,13.916,11.322,25.239,25.239,25.239 h66.527V486.763z"/><path fill="' +
      i +
      '" d="M362.088,164.014H149.912c-6.62,0-11.988,5.367-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.368,11.988-11.988C374.076,169.381,368.707,164.014,362.088,164.014z"/><path fill="' +
      i +
      '" d="M362.088,236.353H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.62,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.368,11.988-11.988C374.076,241.721,368.707,236.353,362.088,236.353z"/><path fill="' +
      i +
      '" d="M362.088,308.691H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988h212.175 c6.62,0,11.988-5.367,11.988-11.988C374.076,314.06,368.707,308.691,362.088,308.691z"/><path fill="' +
      i +
      '" d="M256,381.031H149.912c-6.62,0-11.988,5.368-11.988,11.988c0,6.621,5.368,11.988,11.988,11.988H256 c6.62,0,11.988-5.367,11.988-11.988C267.988,386.398,262.62,381.031,256,381.031z"/></svg>'
    );
  }),
  (FamilyTree.icon.remove = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '"  viewBox="0 0 900.5 900.5"><path fill="' +
      i +
      '" d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"/><path fill="' +
      i +
      '" d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874 c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576 c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"/></svg>'
    );
  }),
  (FamilyTree.icon.add = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '"   viewBox="0 0 922 922"><path fill="' +
      i +
      '" d="M922,453V81c0-11.046-8.954-20-20-20H410c-11.045,0-20,8.954-20,20v149h318c24.812,0,45,20.187,45,45v198h149 C913.046,473.001,922,464.046,922,453z" /><path fill="' +
      i +
      '" d="M557,667.001h151c11.046,0,20-8.954,20-20v-174v-198c0-11.046-8.954-20-20-20H390H216c-11.045,0-20,8.954-20,20v149h194 h122c24.812,0,45,20.187,45,45v4V667.001z" /><path fill="' +
      i +
      '" d="M0,469v372c0,11.046,8.955,20,20,20h492c11.046,0,20-8.954,20-20V692v-12.501V667V473v-4c0-11.046-8.954-20-20-20H390H196 h-12.5H171H20C8.955,449,0,457.955,0,469z" /></svg>'
    );
  }),
  (FamilyTree.icon.search = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 485.213 485.213"><path fill="' +
      i +
      '" d="M471.882,407.567L360.567,296.243c-16.586,25.795-38.536,47.734-64.331,64.321l111.324,111.324 c17.772,17.768,46.587,17.768,64.321,0C489.654,454.149,489.654,425.334,471.882,407.567z" /><path fill="' +
      i +
      '" d="M363.909,181.955C363.909,81.473,282.44,0,181.956,0C81.474,0,0.001,81.473,0.001,181.955s81.473,181.951,181.955,181.951 C282.44,363.906,363.909,282.437,363.909,181.955z M181.956,318.416c-75.252,0-136.465-61.208-136.465-136.46 c0-75.252,61.213-136.465,136.465-136.465c75.25,0,136.468,61.213,136.468,136.465 C318.424,257.208,257.206,318.416,181.956,318.416z" /><path fill="' +
      i +
      '" d="M75.817,181.955h30.322c0-41.803,34.014-75.814,75.816-75.814V75.816C123.438,75.816,75.817,123.437,75.817,181.955z" /></svg>'
    );
  }),
  (FamilyTree.icon.xml = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 550.801 550.801"><path fill="' +
      i +
      '"  d="M488.426,197.019H475.2v-63.816c0-0.401-0.063-0.799-0.116-1.205c-0.021-2.534-0.827-5.023-2.562-6.992L366.325,3.691 c-0.032-0.031-0.063-0.042-0.085-0.073c-0.633-0.707-1.371-1.298-2.151-1.804c-0.231-0.158-0.464-0.287-0.706-0.422 c-0.676-0.366-1.393-0.675-2.131-0.896c-0.2-0.053-0.38-0.135-0.58-0.19C359.87,0.119,359.037,0,358.193,0H97.2 c-11.918,0-21.6,9.693-21.6,21.601v175.413H62.377c-17.049,0-30.873,13.818-30.873,30.87v160.542 c0,17.044,13.824,30.876,30.873,30.876h13.224V529.2c0,11.907,9.682,21.601,21.6,21.601h356.4c11.907,0,21.6-9.693,21.6-21.601 V419.302h13.226c17.044,0,30.871-13.827,30.871-30.87V227.89C519.297,210.838,505.47,197.019,488.426,197.019z M97.2,21.605 h250.193v110.51c0,5.967,4.841,10.8,10.8,10.8h95.407v54.108H97.2V21.605z M369.531,374.53h-32.058l-2.156-55.519 c-0.644-17.434-1.298-38.518-1.298-59.611h-0.633c-4.514,18.516-10.547,39.166-16.137,56.162l-17.645,56.601h-25.618 l-15.494-56.157c-4.725-16.996-9.671-37.658-13.123-56.6h-0.43c-0.854,19.585-1.508,41.961-2.586,60.038l-2.576,55.086h-30.343 l9.26-145.035h43.677l14.207,48.421c4.517,16.774,9.041,34.847,12.258,51.843h0.654c4.081-16.77,9.038-35.923,13.774-52.064 l15.493-48.199h42.82L369.531,374.53z M69.992,374.53l41.955-73.385l-40.444-71.65h37.655l12.688,26.465 c4.316,8.828,7.533,15.928,10.99,24.092h0.422c3.438-9.242,6.23-15.694,9.893-24.092l12.274-26.465h37.434l-40.89,70.796 l43.044,74.239h-37.866l-13.134-26.257c-5.376-10.108-8.817-17.639-12.909-26.04h-0.433c-3.009,8.401-6.674,15.932-11.19,26.04 l-12.042,26.257H69.992z M453.601,523.353H97.2V419.302h356.4V523.353z M485.325,374.53h-90.608V229.495h32.933v117.497h57.682 v27.538H485.325z"/></svg>'
    );
  }),
  (FamilyTree.icon.link = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 512.092 512.092"  ><path fill="' +
      i +
      '" d="M312.453,199.601c-6.066-6.102-12.792-11.511-20.053-16.128c-19.232-12.315-41.59-18.859-64.427-18.859 c-31.697-0.059-62.106,12.535-84.48,34.987L34.949,308.23c-22.336,22.379-34.89,52.7-34.91,84.318 c-0.042,65.98,53.41,119.501,119.39,119.543c31.648,0.11,62.029-12.424,84.395-34.816l89.6-89.6 c1.628-1.614,2.537-3.816,2.524-6.108c-0.027-4.713-3.87-8.511-8.583-8.484h-3.413c-18.72,0.066-37.273-3.529-54.613-10.581 c-3.195-1.315-6.867-0.573-9.301,1.877l-64.427,64.512c-20.006,20.006-52.442,20.006-72.448,0 c-20.006-20.006-20.006-52.442,0-72.448l108.971-108.885c19.99-19.965,52.373-19.965,72.363,0 c13.472,12.679,34.486,12.679,47.957,0c5.796-5.801,9.31-13.495,9.899-21.675C322.976,216.108,319.371,206.535,312.453,199.601z" /><path fill="' +
      i +
      '" d="M477.061,34.993c-46.657-46.657-122.303-46.657-168.96,0l-89.515,89.429c-2.458,2.47-3.167,6.185-1.792,9.387 c1.359,3.211,4.535,5.272,8.021,5.205h3.157c18.698-0.034,37.221,3.589,54.528,10.667c3.195,1.315,6.867,0.573,9.301-1.877 l64.256-64.171c20.006-20.006,52.442-20.006,72.448,0c20.006,20.006,20.006,52.442,0,72.448l-80.043,79.957l-0.683,0.768 l-27.989,27.819c-19.99,19.965-52.373,19.965-72.363,0c-13.472-12.679-34.486-12.679-47.957,0 c-5.833,5.845-9.35,13.606-9.899,21.845c-0.624,9.775,2.981,19.348,9.899,26.283c9.877,9.919,21.433,18.008,34.133,23.893 c1.792,0.853,3.584,1.536,5.376,2.304c1.792,0.768,3.669,1.365,5.461,2.048c1.792,0.683,3.669,1.28,5.461,1.792l5.035,1.365 c3.413,0.853,6.827,1.536,10.325,2.133c4.214,0.626,8.458,1.025,12.715,1.195h5.973h0.512l5.12-0.597 c1.877-0.085,3.84-0.512,6.059-0.512h2.901l5.888-0.853l2.731-0.512l4.949-1.024h0.939c20.961-5.265,40.101-16.118,55.381-31.403 l108.629-108.629C523.718,157.296,523.718,81.65,477.061,34.993z" /></svg>'
    );
  }),
  (FamilyTree.icon.happy = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 512 512"><path fill="' +
      i +
      '" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480 C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z"/><path fill="' +
      i +
      '" d="M176,176c17.673,0,32,14.327,32,32h32c0-35.346-28.654-64-64-64c-35.346,0-64,28.654-64,64h32 C144,190.327,158.327,176,176,176z"/><path fill="' +
      i +
      '" d="M336,144c-35.346,0-64,28.654-64,64h32c0-17.673,14.327-32,32-32c17.673,0,32,14.327,32,32h32 C400,172.654,371.346,144,336,144z"/><path fill="' +
      i +
      '" d="M256,368c-53.019,0-96-42.981-96-96h-32c0,70.692,57.308,128,128,128s128-57.308,128-128h-32 C352,325.019,309.019,368,256,368z"/></svg>'
    );
  }),
  (FamilyTree.icon.sad = function (e, t, i) {
    return (
      '<svg width="' +
      e +
      '" height="' +
      t +
      '" viewBox="0 0 512 512"><path fill="' +
      i +
      '" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M256,480 C132.288,480,32,379.712,32,256S132.288,32,256,32s224,100.288,224,224S379.712,480,256,480z"/><path fill="' +
      i +
      '" d="M336,192c-17.673,0-32-14.327-32-32h-32c0,35.346,28.654,64,64,64c35.346,0,64-28.654,64-64h-32 C368,177.673,353.673,192,336,192z"/><path fill="' +
      i +
      '" d="M176,224c35.346,0,64-28.654,64-64h-32c0,17.673-14.327,32-32,32s-32-14.327-32-32h-32C112,195.346,140.654,224,176,224z "/><path fill="' +
      i +
      '" d="M256,256c-70.692,0-128,57.308-128,128h32c0-53.019,42.981-96,96-96s96,42.981,96,96h32C384,313.308,326.692,256,256,256 z"/></svg>'
    );
  }),
  (FamilyTree.icon.share = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512 512">\n                <path fill="${i}" d="M406,332c-29.641,0-55.761,14.581-72.167,36.755L191.99,296.124c2.355-8.027,4.01-16.346,4.01-25.124\n                    c0-11.906-2.441-23.225-6.658-33.636l148.445-89.328C354.307,167.424,378.589,180,406,180c49.629,0,90-40.371,90-90\n                    c0-49.629-40.371-90-90-90c-49.629,0-90,40.371-90,90c0,11.437,2.355,22.286,6.262,32.358l-148.887,89.59\n                    C156.869,193.136,132.937,181,106,181c-49.629,0-90,40.371-90,90c0,49.629,40.371,90,90,90c30.13,0,56.691-15.009,73.035-37.806\n                    l141.376,72.395C317.807,403.995,316,412.75,316,422c0,49.629,40.371,90,90,90c49.629,0,90-40.371,90-90\n                    C496,372.371,455.629,332,406,332z"/>\n                </svg>`
    );
  }),
  (FamilyTree.icon.user = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 24 24">\n                <path fill="${i}" d="M12 11.796C14.7189 11.796 16.9231 9.60308 16.9231 6.89801C16.9231 4.19294 14.7189 2.00005 12 2.00005C9.28106 2.00005 7.07692 4.19294 7.07692 6.89801C7.07692 9.60308 9.28106 11.796 12 11.796Z" fill="#030D45"/>\n                <path fill="${i}" d="M14.5641 13.8369H9.4359C6.46154 13.8369 4 16.2859 4 19.245C4 19.9593 4.30769 20.5716 4.92308 20.8777C5.84615 21.3879 7.89744 22.0001 12 22.0001C16.1026 22.0001 18.1538 21.3879 19.0769 20.8777C19.5897 20.5716 20 19.9593 20 19.245C20 16.1838 17.5385 13.8369 14.5641 13.8369Z" fill="#030D45"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.ft = function (e, t, i, r, a) {
    return `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512 512"  >\n                <path fill="${i}" d="m336.061 377.731c-5.086-6.54-14.511-7.717-21.049-2.631l-44.012 34.231v-200.331c0-8.284-6.716-15-15-15s-15 6.716-15 15v200.331l-44.011-34.231c-6.538-5.086-15.962-3.908-21.049 2.631-5.086 6.539-3.908 15.963 2.631 21.049l62.429 48.556v49.664c0 8.284 6.716 15 15 15s15-6.716 15-15v-49.664l62.429-48.556c6.54-5.086 7.717-14.51 2.632-21.049z" />\n                <path fill="${i}" d="m271 497v-49.664l62.429-48.556c6.54-5.086 7.717-14.51 2.631-21.049-5.086-6.54-14.511-7.717-21.049-2.631l-44.011 34.231v-200.331c0-8.284-6.716-15-15-15v318c8.284 0 15-6.716 15-15z" />\n                <path fill="${i}" d="m320 512h-128c-8.284 0-15-6.716-15-15s6.716-15 15-15h128c8.284 0 15 6.716 15 15s-6.716 15-15 15z" />\n                <path fill="${i}" d="m320 482h-64v30h64c8.284 0 15-6.716 15-15s-6.716-15-15-15z" />\n                <path fill="${i}" d="m400 439c-61.206 0-111-49.794-111-111s49.794-111 111-111 111 49.794 111 111-49.794 111-111 111z" />\n                <path fill="${i}" d="m112 439c-61.206 0-111-49.794-111-111s49.794-111 111-111 111 49.794 111 111-49.794 111-111 111z" />\n                <path fill="${i}" d="m256 222c-61.206 0-111-49.794-111-111s49.794-111 111-111 111 49.794 111 111-49.794 111-111 111z" />\n                <path fill="${i}" d="m367 111c0-61.206-49.794-111-111-111v222c61.206 0 111-49.794 111-111z" />\n            </svg>`;
  }),
  (FamilyTree.icon.addUser = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512 512" >\n                <path fill="${i}" d="M300.434,257.599c-25.945,27.304-60.622,43.875-98.602,43.875c-37.979,0-72.656-16.571-98.602-43.875 c-45.617,28.738-77.826,76.818-85.092,132.736c-1.659,12.77,8.291,24.107,21.201,24.107h225.846 c0-53.371,32.011-99.402,77.838-119.914C330.812,280.165,316.452,267.69,300.434,257.599z"/>\n                <ellipse fill="${i}" cx="201.828" cy="133.868" rx="112.229" ry="133.868"/>\n                <path fill="${i}" d="M396.486,316.885c-53.794,0-97.558,43.764-97.558,97.558S342.693,512,396.486,512c53.792,0,97.557-43.764,97.557-97.558 S450.279,316.885,396.486,316.885z M435.199,431.315h-21.841v21.841c0,9.318-7.554,16.872-16.872,16.872 c-9.318,0-16.872-7.554-16.872-16.872v-21.841h-21.842c-9.318,0-16.872-7.554-16.872-16.872c0-9.319,7.554-16.872,16.872-16.872 h21.842v-21.841c0-9.318,7.554-16.872,16.872-16.872c9.318,0,16.872,7.554,16.872,16.872v21.841h21.841 c9.318,0,16.872,7.554,16.872,16.872C452.072,423.761,444.518,431.315,435.199,431.315z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.close = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512 512">\n    <path fill="${i}" d="m256 0c-141.49 0-256 114.5-256 256 0 141.49 114.5 256 256 256 141.49 0 256-114.5 256-256 0-141.49-114.5-256-256-256zm-12.284 317.397-58.121 58.132c-6.565 6.553-15.283 10.166-24.557 10.166-19.196 0-34.734-15.526-34.734-34.734 0-9.274 3.612-17.992 10.166-24.557l58.132-58.121c6.785-6.784 6.785-17.783 0-24.568l-58.132-58.121c-6.553-6.565-10.166-15.283-10.166-24.557 0-19.196 15.526-34.734 34.734-34.734 9.274 0 17.992 3.613 24.557 10.166l58.121 58.132c6.785 6.773 17.784 6.773 24.568 0l58.121-58.132c6.565-6.553 15.283-10.166 24.557-10.166 19.196 0 34.734 15.526 34.734 34.734 0 9.274-3.612 17.992-10.166 24.557l-58.132 58.121c-6.785 6.784-6.785 17.783 0 24.568l58.132 58.121c6.553 6.565 10.166 15.283 10.166 24.557 0 19.196-15.526 34.734-34.734 34.734-9.274 0-17.992-3.613-24.557-10.166l-58.121-58.132c-6.784-6.784-17.784-6.773-24.568 0z"/>\n    </svg>`
    );
  }),
  (FamilyTree.icon.daughter = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512.879 512.879">\n                <path fill="${i}" d="M213.773,238.933c4.71,0,8.533-3.823,8.533-8.533v-5.615c0.546,0.529,0.922,0.964,0.964,1.024 c1.519,2.918,4.497,4.591,7.578,4.591c1.323,0,2.671-0.307,3.934-0.964c4.181-2.176,5.803-7.33,3.627-11.511 c-2.534-4.872-10.581-13.124-24.636-13.124c-14.054,0-22.101,8.252-24.636,13.124c-2.125,4.087-0.555,8.969,3.456,11.23 c4.011,2.287,9.156,0.811,11.563-3.123c0.077-0.128,0.495-0.623,1.084-1.195v5.564 C205.239,235.11,209.062,238.933,213.773,238.933z"/>\n                <path fill="${i}" d="M256.439,332.8c20.028,0,30.507-9.907,31.633-11.034c3.294-3.294,3.285-8.568,0.043-11.913 c-3.234-3.354-8.61-3.439-12.015-0.247c-0.265,0.247-6.699,6.127-19.661,6.127c-12.774,0-19.209-5.709-19.652-6.118 c-3.336-3.251-8.678-3.217-11.981,0.085c-3.337,3.337-3.337,8.73,0,12.066C225.933,322.893,236.412,332.8,256.439,332.8z"/>\n                <path fill="${i}" d="M365.666,293.547c-49.826-66.441-75.093-133.623-75.093-199.68c0-4.71-3.823-8.533-8.533-8.533s-8.533,3.823-8.533,8.533 c0,68.369,25.31,137.489,75.255,205.542c-12.228,21.623-50.483,76.058-92.322,76.058c-45.218,0-86.255-63.59-94.763-80.614 c-8.388-16.768-24.704-66.765-24.704-98.586v-25.754c20.378-0.572,73.404-3.405,121.813-17.246 c4.531-1.289,7.151-6.016,5.854-10.547c-1.289-4.531-6.008-7.159-10.547-5.854C196.254,153.387,129.114,153.6,128.439,153.6 c-4.71,0-8.533,3.823-8.533,8.533v34.133c0,34.935,17.254,87.723,26.496,106.214c0.452,0.905,46.797,90.052,110.037,90.052 s109.585-89.148,110.037-90.052C367.919,299.588,367.603,296.132,365.666,293.547z"/>\n                <path fill="${i}" d="M316.173,392.533c-4.71,0-8.533,3.823-8.533,8.533v17.067c0,0.06,0.034,0.111,0.034,0.171 c0,0.051-0.034,0.094-0.034,0.154c-0.034,5.205-1.749,50.876-51.2,50.876s-51.166-45.986-51.2-51.2v-17.067 c0-4.71-3.823-8.533-8.533-8.533s-8.533,3.823-8.533,8.533v8.687c-116.028,1.638-168.917,35.9-178.765,65.417l-8.533,25.6 c-1.493,4.471,0.93,9.301,5.402,10.795C7.172,511.863,8.085,512,8.973,512c3.575,0,6.903-2.261,8.098-5.837l8.533-25.6 c6.076-18.227,48.034-52.335,163.132-53.845c3.106,24.422,19.721,59.682,67.704,59.682c53.999,0,68.267-44.425,68.267-67.917 c0-0.06-0.034-0.111-0.034-0.171c0-0.068,0.034-0.119,0.034-0.179v-17.067C324.706,396.356,320.883,392.533,316.173,392.533z"/>\n                <path fill="${i}" d="M256.695,273.067h-0.085c-4.71,0-8.491,3.823-8.491,8.533c0,4.71,3.866,8.533,8.576,8.533 c4.719,0,8.533-3.823,8.533-8.533C265.229,276.89,261.414,273.067,256.695,273.067z"/>\n                <path fill="${i}" d="M512.004,501.641l-8.533-25.591c-4.659-13.978-22.34-28.228-49.792-40.141c-4.318-1.877-9.352,0.102-11.23,4.429 c-1.869,4.318,0.111,9.353,4.437,11.221c26.266,11.401,38.178,23.219,40.388,29.884l8.533,25.6 c1.195,3.575,4.523,5.837,8.098,5.837c0.887,0,1.801-0.145,2.697-0.444C511.074,510.942,513.498,506.112,512.004,501.641z"/>\n                <path fill="${i}" d="M256.439,0c-115.558,0-179.2,63.642-179.2,179.2V256c0,66.039-24.909,141.611-25.165,142.37 c-1.485,4.471,0.93,9.301,5.402,10.795c4.48,1.476,9.301-0.93,10.795-5.402c1.058-3.191,26.035-78.908,26.035-147.763v-76.8 c0-134.008,88.175-162.133,162.133-162.133c100.454,0,162.133,94.43,162.133,162.133v17.067 c0,34.458-21.111,74.163-41.532,112.572c-18.133,34.116-35.268,66.338-35.268,92.228c0,54.11,35.14,89.873,36.634,91.366 c1.596,1.604,3.772,2.5,6.033,2.5c2.261,0,4.437-0.896,6.033-2.5c1.493-1.493,36.634-37.257,36.634-91.366 c0-53.197-17.562-72.303-19.567-74.3c-3.285-3.285-8.559-3.285-11.904-0.051c-3.354,3.234-3.439,8.61-0.265,12.015 c0.145,0.154,14.669,16.256,14.669,62.336c0,33.937-16.444,60.16-25.617,72.149c-9.19-11.947-25.583-38.05-25.583-72.149 c0-21.632,16.162-52.036,33.271-84.215c21.402-40.252,43.529-81.869,43.529-120.585V179.2C435.639,94.438,362.04,0,256.439,0z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.son = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}"  viewBox="0 0 512.002 512.002">\n                <path fill="${i}" d="M238.934,213.334c0-4.71-3.823-8.533-8.533-8.533h-34.133c-4.71,0-8.533,3.823-8.533,8.533 c0,4.71,3.823,8.533,8.533,8.533h8.533c0,4.71,3.823,8.533,8.533,8.533c4.71,0,8.533-3.823,8.533-8.533h8.533 C235.111,221.867,238.934,218.044,238.934,213.334z"/>\n                <path fill="${i}" d="M121.601,255.19c4.565,13.466,17.178,49.98,24.371,64.358c13.551,27.11,51.977,72.986,110.029,72.986 s96.478-45.875,110.037-72.986c7.185-14.379,19.797-50.893,24.371-64.358c11.025-2.85,19.191-12.885,19.191-24.789v-34.133 c0-11.127-7.134-20.617-17.067-24.141v-44.126c0-33.69-17.741-95.923-83.354-101.931c-0.137-4.028-1.476-7.27-2.953-9.668 c-8.38-13.559-31.94-16.401-50.227-16.401c-151.842,0-153.6,143.616-153.6,145.067c0,4.71,3.814,8.525,8.525,8.525h0.009 c4.702,0,8.525-3.806,8.533-8.516c0.017-5.222,1.937-128.009,136.533-128.009c24.132,0,33.801,5.222,35.703,8.311 c0.282,0.435,0.998,1.604-0.666,4.941c-1.323,2.645-1.178,5.786,0.375,8.303c1.553,2.509,4.301,4.045,7.253,4.045 c75.656,0,76.791,81.86,76.8,85.333v51.2c0,4.71,3.823,8.533,8.533,8.533c4.702,0,8.533,3.831,8.533,8.533v34.133 c0,4.702-3.831,8.533-8.533,8.533c-3.669,0-6.929,2.347-8.098,5.837c-0.162,0.503-16.964,50.816-25.131,67.149 c-1.297,2.594-32.495,63.548-94.771,63.548s-93.466-60.954-94.763-63.548c-8.166-16.333-24.977-66.645-25.139-67.149 c-1.161-3.49-4.42-5.837-8.098-5.837c-4.702,0-8.533-3.831-8.533-8.533v-34.133c0-2.313,0.93-4.412,2.423-5.948 c3.396,7.62,10.607,14.481,23.177,14.481c3.234,0,6.187-1.826,7.637-4.719c7.535-15.061,15.283-30.575,17.399-46.652 c43.665-1.758,108.979-17.323,139.742-41.105c8.201,29.764,32.742,54.596,33.988,55.842c3.337,3.337,8.738,3.337,12.066,0 c3.337-3.336,3.337-8.73,0-12.066c-0.316-0.316-31.633-31.983-31.633-62.234c0-3.831-2.56-7.202-6.255-8.226 c-3.703-1.024-7.62,0.546-9.591,3.831c-14.549,24.243-94.746,47.061-146.287,47.061c-4.71,0-8.533,3.823-8.533,8.533 c0,13.295-6.127,27.102-13.286,41.6c-2.901-1.604-3.703-4.753-3.78-7.467c0-4.71-3.823-8.533-8.533-8.533 c-14.114,0-25.6,11.486-25.6,25.6v34.133C102.401,242.305,110.576,252.34,121.601,255.19z"/>\n                <path fill="${i}" d="M256.001,332.801c20.028,0,30.507-9.907,31.633-11.034c3.294-3.294,3.285-8.567,0.051-11.913 c-3.243-3.354-8.619-3.439-12.023-0.247c-0.265,0.247-6.699,6.127-19.661,6.127c-12.774,0-19.209-5.709-19.652-6.118 c-3.336-3.251-8.678-3.217-11.981,0.085c-3.328,3.337-3.328,8.73,0,12.066C225.503,322.893,235.982,332.801,256.001,332.801z"/>\n                <path fill="${i}" d="M264.79,281.601c0-4.71-3.814-8.533-8.533-8.533h-0.085c-4.71,0-8.491,3.823-8.491,8.533c0,4.71,3.866,8.533,8.576,8.533 C260.976,290.134,264.79,286.311,264.79,281.601z"/>\n                <path fill="${i}" d="M511.745,501.394l-8.713-34.756c-4.386-13.158-30.285-55.484-178.765-56.636v-8.934c0-4.71-3.823-8.533-8.533-8.533 s-8.533,3.823-8.533,8.533v17.067c0,0.06,0.034,0.111,0.034,0.171c0,0.051-0.034,0.094-0.034,0.154 c-0.034,5.205-1.749,50.876-51.2,50.876s-51.166-45.986-51.2-51.2v-17.067c0-4.71-3.823-8.533-8.533-8.533 s-8.533,3.823-8.533,8.533v8.619C77.168,410.556,21.786,428.203,8.79,467.26l-8.533,34.133 c-1.143,4.574,1.638,9.207,6.212,10.351c4.557,1.143,9.199-1.638,10.342-6.204l8.354-33.51 c9.916-29.739,63.309-44.595,163.132-45.338c3.098,24.431,19.712,59.708,67.704,59.708c47.983,0,64.597-35.063,67.703-59.366 c116.958,0.862,157.628,28.467,162.953,44.373l8.533,34.133c0.973,3.874,4.446,6.46,8.269,6.46c0.691,0,1.382-0.077,2.082-0.256 C510.115,510.601,512.888,505.968,511.745,501.394z"/>\n                <path fill="${i}" d="M298.668,230.401c4.71,0,8.533-3.823,8.533-8.533h8.533c4.71,0,8.533-3.823,8.533-8.533c0-4.71-3.823-8.533-8.533-8.533 h-34.133c-4.71,0-8.533,3.823-8.533,8.533c0,4.71,3.823,8.533,8.533,8.533h8.533 C290.134,226.578,293.957,230.401,298.668,230.401z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.wife = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512 512" >\n                <path fill="${i}" d="M128,307.2c4.719,0,8.533-3.823,8.533-8.533V281.6c0-4.71-3.814-8.533-8.533-8.533c-4.719,0-8.533,3.823-8.533,8.533 v17.067C119.467,303.377,123.281,307.2,128,307.2z"/>\n                <path fill="${i}" d="M384,273.067c-4.719,0-8.533,3.823-8.533,8.533v17.067c0,4.71,3.814,8.533,8.533,8.533c4.719,0,8.533-3.823,8.533-8.533 V281.6C392.533,276.89,388.719,273.067,384,273.067z"/>\n                <path fill="${i}" d="M392.183,433.109c-0.162-0.606-0.418-1.152-0.7-1.715c-0.162-0.299-0.196-0.64-0.384-0.93 c-0.094-0.128-0.23-0.196-0.324-0.324c-0.358-0.469-0.802-0.845-1.254-1.246c-0.418-0.375-0.819-0.742-1.306-1.016 c-0.145-0.094-0.23-0.23-0.392-0.316l-34.133-17.067c-2.748-1.357-6.008-1.161-8.55,0.538l-51.209,34.133 c-2.372,1.587-3.797,4.25-3.797,7.1v30.259c-5.077,4.062-17.545,12.407-34.133,12.407c-16.427,0-29.013-8.388-34.133-12.433 v-30.234c0-2.85-1.425-5.513-3.797-7.1l-51.2-34.133c-2.543-1.698-5.803-1.894-8.55-0.538l-34.133,17.067 c-0.154,0.077-0.239,0.213-0.375,0.299c-0.512,0.29-0.939,0.674-1.374,1.075c-0.435,0.384-0.853,0.734-1.186,1.178 c-0.102,0.137-0.256,0.213-0.35,0.35c-0.205,0.307-0.239,0.657-0.401,0.99c-0.265,0.529-0.521,1.05-0.674,1.63 c-0.137,0.529-0.179,1.05-0.205,1.596c-0.034,0.538-0.06,1.058,0.008,1.604c0.068,0.597,0.265,1.143,0.461,1.707 c0.119,0.341,0.111,0.7,0.273,1.024c0.077,0.154,0.222,0.247,0.307,0.393c0.282,0.495,0.666,0.913,1.058,1.348 c0.384,0.427,0.742,0.853,1.186,1.195c0.137,0.102,0.213,0.256,0.35,0.35l51.2,34.133c1.459,0.973,3.106,1.434,4.727,1.434 c2.756,0,5.47-1.331,7.108-3.797c2.62-3.925,1.562-9.225-2.364-11.836l-38.972-25.975l16.555-8.277l43.281,28.851V486.4 c0,2.261,0.896,4.437,2.5,6.033C208.102,493.235,227.2,512,256,512s47.898-18.765,48.7-19.567c1.604-1.596,2.5-3.772,2.5-6.033 v-29.568l43.29-28.851l16.546,8.277l-38.972,25.975c-3.925,2.611-4.983,7.91-2.364,11.836c1.638,2.466,4.352,3.797,7.108,3.797 c1.621,0,3.268-0.461,4.727-1.434l51.2-34.133c0.137-0.094,0.205-0.239,0.333-0.341c0.478-0.35,0.853-0.794,1.254-1.246 c0.358-0.427,0.725-0.811,0.998-1.289c0.085-0.154,0.239-0.247,0.324-0.41c0.171-0.35,0.171-0.725,0.29-1.084 c0.179-0.538,0.367-1.05,0.435-1.613c0.077-0.58,0.051-1.126,0.009-1.698C392.354,434.108,392.32,433.613,392.183,433.109z"/>\n                <path fill="${i}" d="M57.037,409.165c0.896,0.29,1.809,0.435,2.697,0.435c3.575,0,6.903-2.261,8.09-5.837 C68.89,400.572,93.867,324.855,93.867,256v-76.8C93.867,45.193,182.033,17.067,256,17.067c25.199,0,77.636,0,85.649,11.128 c0.333,0.452,0.828,1.135,0.128,3.243c-0.956,2.842-0.341,5.965,1.604,8.235c1.946,2.278,4.932,3.362,7.885,2.876 c10.863-1.792,20.412,0.93,29.184,8.354c22.895,19.396,37.683,69.76,37.683,128.299V256c0,77.457,25.071,145.22,26.138,148.062 c1.656,4.412,6.571,6.639,10.991,5.001c4.412-1.655,6.647-6.571,5.001-10.991C460.006,397.406,435.2,330.257,435.2,256v-76.8 c0-50.415-11.486-114.014-43.716-141.321c-9.745-8.243-20.932-12.621-32.836-12.902c-0.683-2.773-1.903-5.035-3.149-6.767 C343.356,1.374,303.258,0,256,0C140.442,0,76.8,63.642,76.8,179.2V256c0,66.039-24.909,141.611-25.156,142.37 C50.15,402.842,52.565,407.672,57.037,409.165z"/>\n                <path fill="${i}" d="M91.802,426.923C19.814,444.919,1.195,498.492,0.444,500.77c-1.493,4.471,0.922,9.301,5.393,10.795 C6.733,511.864,7.646,512,8.533,512c3.576,0,6.904-2.261,8.09-5.837c0.162-0.469,16.316-46.942,79.309-62.686 c4.574-1.143,7.356-5.777,6.212-10.351C101.001,428.561,96.367,425.771,91.802,426.923z"/>\n                <path fill="${i}" d="M213.333,238.933c4.719,0,8.533-3.823,8.533-8.533v-5.615c0.546,0.529,0.922,0.964,0.964,1.024 c1.519,2.918,4.497,4.591,7.578,4.591c1.323,0,2.671-0.307,3.934-0.964c4.173-2.176,5.803-7.33,3.627-11.511 c-2.534-4.873-10.59-13.124-24.636-13.124c-14.046,0-22.101,8.252-24.636,13.124c-2.125,4.087-0.546,8.969,3.456,11.23 c3.985,2.261,9.148,0.819,11.554-3.123c0.085-0.128,0.503-0.623,1.092-1.195v5.564C204.8,235.11,208.614,238.933,213.333,238.933 z"/>\n                <path fill="${i}" d="M511.556,500.77c-0.751-2.278-19.371-55.851-91.358-73.847c-4.574-1.161-9.199,1.638-10.342,6.204 c-1.143,4.574,1.638,9.207,6.212,10.351c62.524,15.633,78.66,60.809,79.309,62.686c1.186,3.576,4.514,5.837,8.09,5.837 c0.888,0,1.801-0.137,2.697-0.435C510.635,510.071,513.05,505.242,511.556,500.77z"/>\n                <path fill="${i}" d="M256,332.8c20.028,0,30.507-9.907,31.633-11.034c3.294-3.294,3.285-8.567,0.051-11.913 c-3.251-3.345-8.61-3.439-12.015-0.247c-0.273,0.247-6.707,6.127-19.669,6.127c-12.774,0-19.208-5.709-19.652-6.118 c-3.32-3.251-8.67-3.226-11.981,0.085c-3.337,3.337-3.337,8.73,0,12.066C225.493,322.893,235.972,332.8,256,332.8z"/>\n                <path fill="${i}" d="M298.667,238.933c4.719,0,8.533-3.823,8.533-8.533v-5.615c0.546,0.529,0.922,0.964,0.964,1.024 c1.519,2.918,4.497,4.591,7.578,4.591c1.323,0,2.671-0.307,3.934-0.964c4.173-2.176,5.803-7.33,3.627-11.511 c-2.534-4.873-10.59-13.124-24.636-13.124c-14.046,0-22.101,8.252-24.636,13.124c-2.125,4.087-0.546,8.969,3.456,11.23 c3.994,2.261,9.156,0.819,11.554-3.123c0.085-0.128,0.503-0.623,1.092-1.195v5.564 C290.133,235.11,293.948,238.933,298.667,238.933z"/>\n                <path fill="${i}" d="M389.129,189.449c-8.542-6.443-30.729-26.957-30.729-44.382c0-4.71-3.814-8.533-8.533-8.533s-8.533,3.823-8.533,8.533 c0,24.678,24.354,47.249,34.014,55.228c-1.835,33.476-24.917,95.223-33.118,111.625c-7.654,15.317-48.154,63.548-86.229,63.548 s-78.575-48.23-86.229-63.548c-8.542-17.084-33.237-83.379-33.237-115.652v-25.728c33.835-0.802,157.321-6.929,218.453-52.779 c3.772-2.825,4.54-8.175,1.707-11.947c-2.825-3.772-8.175-4.54-11.947-1.707C279.561,152.994,129.51,153.6,128,153.6 c-4.719,0-8.533,3.823-8.533,8.533v34.133c0,36.625,26.871,106.965,35.029,123.281c10.385,20.77,55.834,72.986,101.504,72.986 s91.119-52.216,101.504-72.986c8.158-16.316,35.029-86.656,35.029-123.281C392.533,193.587,391.27,191.061,389.129,189.449z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.husband = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512.007 512.007" >\n                <path fill="${i}" d="M121.835,255.249c6.229,16.196,26.803,68.42,41.737,90.82l1.348,2.039c10.957,16.614,29.295,44.425,91.085,44.425 c61.79,0,80.128-27.81,91.085-44.425l1.348-2.039c14.933-22.4,35.507-74.624,41.737-90.82c11.145-2.773,19.43-12.86,19.43-24.849 v-34.133c0-11.127-7.134-20.617-17.067-24.141V128c0-33.69-17.741-95.923-83.362-101.931c-0.128-4.028-1.459-7.27-2.944-9.668 C297.844,2.85,274.292,0,256.005,0c-151.842,0-153.6,143.616-153.6,145.067c0,4.71,3.814,8.525,8.516,8.525h0.017 c4.702,0,8.516-3.806,8.533-8.508c0.017-5.231,1.937-128.017,136.533-128.017c24.132,0,33.801,5.222,35.712,8.311 c0.265,0.435,0.99,1.604-0.683,4.941c-1.323,2.645-1.178,5.786,0.375,8.303c1.562,2.509,4.301,4.045,7.262,4.045 c75.657,0,76.791,81.86,76.8,85.333v51.2c0,4.71,3.814,8.533,8.533,8.533c4.71,0,8.533,3.831,8.533,8.533V230.4 c0,4.702-3.823,8.533-8.533,8.533c-3.558,0-6.741,2.21-7.996,5.538c-0.247,0.674-25.446,67.644-41.771,92.126l-1.399,2.116 c-10.223,15.514-24.235,36.753-76.834,36.753c-52.599,0-66.611-21.239-76.834-36.753l-1.399-2.116 c-16.324-24.482-41.523-91.452-41.771-92.126c-1.254-3.328-4.437-5.538-7.996-5.538c-4.71,0-8.533-3.831-8.533-8.533v-34.133 c0-2.313,0.922-4.412,2.423-5.948c3.089,6.955,9.421,13.21,20.053,14.268l29.193,21.897c2.27,16.623,16.418,29.517,33.664,29.517 h17.067c18.825,0,34.133-15.309,34.133-34.133c0,18.825,15.309,34.133,34.133,34.133h17.067 c17.237,0,31.394-12.894,33.664-29.517l31.189-23.39c3.772-2.825,4.54-8.175,1.707-11.947c-2.825-3.772-8.175-4.548-11.947-1.707 l-21.751,16.316c-3.251-10.402-12.86-18.022-24.329-18.022h-34.133c-14.114,0-25.6,11.486-25.6,25.6 c0-14.114-11.486-25.6-25.6-25.6h-34.133c-11.469,0-21.077,7.62-24.328,18.022l-16.282-12.211 c6.716-16.23,12.8-40.235,14.524-57.088c26.897-0.478,104.713-3.763,139.332-25.37c7.851,30.31,33.058,55.817,34.321,57.08 c3.336,3.336,8.73,3.336,12.066,0c3.336-3.337,3.336-8.73,0-12.066c-0.316-0.316-31.633-31.983-31.633-62.234 c0-3.831-2.56-7.202-6.255-8.226c-3.661-1.016-7.629,0.546-9.591,3.831c-12.425,20.693-93.022,29.995-146.287,29.995 c-4.719,0-8.533,3.823-8.533,8.533c0,13.858-6.554,41.515-13.508,58.539c-2.722-1.638-3.49-4.693-3.558-7.339 c0-4.71-3.814-8.533-8.533-8.533c-14.114,0-25.6,11.486-25.6,25.6V230.4C102.405,242.389,110.691,252.476,121.835,255.249z M273.071,213.333c0-4.702,3.823-8.533,8.533-8.533h34.133c4.71,0,8.533,3.831,8.533,8.533v8.533 c0,9.412-7.654,17.067-17.067,17.067h-17.067c-9.412,0-17.067-7.654-17.067-17.067V213.333z M187.738,213.333 c0-4.702,3.823-8.533,8.533-8.533h34.133c4.71,0,8.533,3.831,8.533,8.533v8.533c0,9.412-7.654,17.067-17.067,17.067h-17.067 c-9.412,0-17.067-7.654-17.067-17.067V213.333z"/>\n                <path fill="${i}" d="M298.663,307.226c0.009-4.702-3.797-8.533-8.499-8.559c-0.162,0-15.42-0.171-30.345-7.629 c-2.398-1.203-5.231-1.203-7.629,0c-14.925,7.458-30.182,7.629-30.319,7.629c-4.719,0-8.533,3.823-8.533,8.533 s3.814,8.533,8.533,8.533c0.725,0,16.853-0.094,34.133-7.646c17.28,7.552,33.408,7.646,34.133,7.646 C294.84,315.733,298.646,311.927,298.663,307.226z"/>\n                <path fill="${i}" d="M247.471,324.267c-4.719,0-8.533,3.823-8.533,8.533c0,4.71,3.814,8.533,8.533,8.533h17.067 c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533H247.471z"/>\n                <path fill="${i}" d="M511.749,501.393l-8.721-34.756c-12.706-38.135-73.114-56.687-184.67-56.687c-0.879,0-1.758,0-2.645,0.009 c-4.053,0.009-7.544,2.867-8.337,6.852l-17.067,84.975c-0.93,4.625,2.065,9.122,6.682,10.052 c4.608,0.896,9.114-2.074,10.044-6.69l15.693-78.114c97.724,0.452,154.436,15.957,163.934,44.373l8.533,34.133 c0.973,3.874,4.446,6.468,8.269,6.46c0.683,0,1.382-0.077,2.074-0.256C510.11,510.601,512.892,505.976,511.749,501.393z"/>\n                <path fill="${i}" d="M204.634,416.461c-0.794-3.994-4.292-6.861-8.363-6.861c-116.386,0-174.148,17.596-187.477,57.66l-8.533,34.133 c-1.152,4.582,1.638,9.207,6.212,10.351C7.164,511.923,7.864,512,8.547,512c3.823,0,7.296-2.586,8.269-6.46l8.346-33.51 c9.95-29.841,63.667-44.689,164.122-45.338l15.693,78.447c0.913,4.617,5.367,7.629,10.035,6.699 c4.617-0.93,7.62-5.427,6.69-10.044L204.634,416.461z"/>\n                <path fill="${i}" d="M256.005,409.6c-14.114,0-25.6,11.486-25.6,25.6c0,11.11,7.159,20.489,17.067,24.021v44.245 c0,4.71,3.814,8.533,8.533,8.533c4.719,0,8.533-3.823,8.533-8.533V459.23c9.907-3.541,17.067-12.919,17.067-24.03 C281.605,421.086,270.119,409.6,256.005,409.6z M256.005,443.733c-4.71,0-8.533-3.831-8.533-8.533 c0-4.702,3.823-8.533,8.533-8.533c4.71,0,8.533,3.831,8.533,8.533C264.538,439.902,260.715,443.733,256.005,443.733z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.father = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512.002 512.002" >\n                <path fill="${i}" d="M366.934,128.001c0-4.71-3.814-8.533-8.533-8.533c-2.091,0-51.2-0.683-51.2-59.733c0-4.71-3.814-8.533-8.533-8.533 s-8.533,3.823-8.533,8.533c0,75.921,67.584,76.8,68.267,76.8C363.12,136.534,366.934,132.711,366.934,128.001z"/>\n                <path fill="${i}" d="M256.001,196.268c0-14.114-11.486-25.6-25.6-25.6h-34.133c-11.46,0-21.069,7.62-24.329,18.022l-21.751-16.316 c-3.772-2.825-9.114-2.048-11.947,1.707c-2.825,3.772-2.065,9.122,1.707,11.947l31.189,23.39 c2.278,16.623,16.418,29.517,33.664,29.517h17.067c18.825,0,34.133-15.309,34.133-34.133c0,18.825,15.309,34.133,34.133,34.133 h17.067c17.237,0,31.394-12.894,33.664-29.517l31.189-23.39c3.772-2.825,4.54-8.175,1.707-11.947 c-2.825-3.772-8.175-4.548-11.947-1.707l-21.751,16.316c-3.251-10.402-12.86-18.022-24.329-18.022h-34.133 C267.487,170.668,256.001,182.153,256.001,196.268z M238.934,204.801c0,9.412-7.654,17.067-17.067,17.067h-17.067 c-9.412,0-17.067-7.654-17.067-17.067v-8.533c0-4.702,3.831-8.533,8.533-8.533h34.133c4.702,0,8.533,3.831,8.533,8.533V204.801z M324.268,196.268v8.533c0,9.412-7.654,17.067-17.067,17.067h-17.067c-9.412,0-17.067-7.654-17.067-17.067v-8.533 c0-4.702,3.823-8.533,8.533-8.533h34.133C320.445,187.734,324.268,191.566,324.268,196.268z"/>\n                <path fill="${i}" d="M298.659,307.226c0.009-4.702-3.797-8.533-8.499-8.559c-0.162,0-15.42-0.171-30.345-7.629 c-2.398-1.203-5.231-1.203-7.629,0c-14.925,7.458-30.191,7.629-30.319,7.629c-4.71,0-8.533,3.823-8.533,8.533 s3.823,8.533,8.533,8.533c0.725,0,16.845-0.094,34.133-7.646c17.28,7.552,33.408,7.646,34.133,7.646 C294.836,315.734,298.642,311.928,298.659,307.226z"/>\n                <path fill="${i}" d="M120.986,237.953c4.378,18.611,18.91,76.877,34.048,99.584c10.974,16.452,36.668,54.997,100.966,54.997 s89.993-38.545,100.966-54.997c15.138-22.707,29.67-80.973,34.048-99.584c10.718-3.055,18.586-12.937,18.586-24.619v-34.133 c0-11.127-7.134-20.617-17.067-24.141v-44.126c0-1.109-1.562-110.933-136.533-110.933c-151.842,0-153.6,126.72-153.6,128 c0,4.702,3.806,8.516,8.516,8.525h0.017c4.693,0,8.516-3.806,8.533-8.499c0.017-4.54,2.048-110.959,136.533-110.959 c117.581,0,119.441,90.061,119.467,93.867v51.2c0,4.71,3.814,8.533,8.533,8.533c4.71,0,8.533,3.831,8.533,8.533v34.133 c0,4.702-3.823,8.533-8.533,8.533c-4.002,0-7.458,2.782-8.337,6.682c-0.162,0.751-16.896,75.52-32.896,99.516 c-10.257,15.386-31.599,47.403-86.767,47.403s-76.51-32.017-86.767-47.403c-15.992-23.979-32.734-98.765-32.905-99.516 c-0.87-3.9-4.326-6.682-8.329-6.682c-4.702,0-8.533-3.831-8.533-8.533v-34.133c0-4.702,3.831-8.533,8.533-8.533 c1.323,0,2.637-0.307,3.814-0.896c2.978-1.493,72.986-37.333,72.986-110.037c0-4.71-3.823-8.533-8.533-8.533 s-8.533,3.823-8.533,8.533c0,56.678-52.523,88.636-62.08,93.978c-13.022,1.186-23.253,12.169-23.253,25.489v34.133 C102.401,225.016,110.269,234.898,120.986,237.953z"/>\n                <path fill="${i}" d="M196.097,416.462c-0.794-3.994-4.292-6.861-8.363-6.861c-140.399,0-168.892,27.409-178.944,57.66l-8.533,34.133 c-1.143,4.582,1.638,9.207,6.204,10.351c0.7,0.179,1.391,0.256,2.082,0.256c3.823,0,7.296-2.586,8.269-6.46l8.354-33.51 c7.339-22.025,31.718-44.527,155.58-45.338l15.693,78.447c0.913,4.617,5.393,7.603,10.035,6.699 c4.625-0.93,7.62-5.427,6.69-10.044L196.097,416.462z"/>\n                <path fill="${i}" d="M511.745,501.394l-8.721-34.756c-7.117-21.342-39.689-57.216-178.782-56.678c-4.062,0.009-7.544,2.867-8.337,6.852 l-17.067,84.975c-0.93,4.625,2.065,9.122,6.682,10.052c4.591,0.896,9.114-2.074,10.044-6.69l15.693-78.114 c103.714,0.674,148.412,23.484,155.401,44.373l8.533,34.133c0.973,3.874,4.446,6.468,8.269,6.46c0.683,0,1.382-0.077,2.074-0.256 C510.106,510.601,512.888,505.976,511.745,501.394z"/>\n                <path fill="${i}" d="M256.257,426.668h-0.085c-4.71,0-8.491,3.823-8.491,8.533s3.866,8.533,8.576,8.533c4.71,0,8.533-3.823,8.533-8.533 S260.967,426.668,256.257,426.668z"/>\n                <path fill="${i}" d="M256.257,494.934h-0.085c-4.71,0-8.491,3.823-8.491,8.533s3.866,8.533,8.576,8.533c4.71,0,8.533-3.823,8.533-8.533 S260.967,494.934,256.257,494.934z"/>\n                <path fill="${i}" d="M247.468,324.268c-4.71,0-8.533,3.823-8.533,8.533c0,4.71,3.823,8.533,8.533,8.533h17.067 c4.719,0,8.533-3.823,8.533-8.533c0-4.71-3.814-8.533-8.533-8.533H247.468z"/>\n                <path fill="${i}" d="M256.257,460.801h-0.085c-4.71,0-8.491,3.823-8.491,8.533c0,4.71,3.866,8.533,8.576,8.533 c4.71,0,8.533-3.823,8.533-8.533C264.79,464.624,260.967,460.801,256.257,460.801z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.mother = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512.011 512.011" >\n                <path fill="${i}" d="M299.355,445.356c-1.621,1.536-2.56,3.755-2.56,5.973c0,2.304,0.939,4.437,2.56,6.059 c1.536,1.621,3.755,2.475,5.973,2.475c2.304,0,4.523-0.853,6.059-2.475c1.621-1.536,2.475-3.755,2.475-6.059 c0-2.219-0.853-4.437-2.475-5.973C308.23,442.113,302.512,442.199,299.355,445.356z"/>\n                <path fill="${i}" d="M276.23,458.668c-1.621,1.621-2.475,3.755-2.475,6.059c0,2.219,0.939,4.437,2.475,5.973 c1.621,1.621,3.84,2.56,6.059,2.56c2.219,0,4.437-0.939,5.973-2.56c1.621-1.536,2.56-3.755,2.56-5.973 c0-2.304-0.939-4.437-2.56-6.059C285.104,455.511,279.387,455.511,276.23,458.668z"/>\n                <path fill="${i}" d="M392.539,196.268c0-2.68-1.263-5.205-3.405-6.818c-8.55-6.443-30.729-26.957-30.729-44.382 c0-4.71-3.823-8.533-8.533-8.533s-8.533,3.823-8.533,8.533c0,24.678,24.354,47.249,34.014,55.228 c-1.835,33.476-24.917,95.223-33.118,111.625c-7.654,15.317-48.154,63.548-86.229,63.548s-78.575-48.23-86.229-63.548 c-8.542-17.084-33.237-83.379-33.237-115.652V170.54c33.835-0.802,157.321-6.929,218.453-52.779 c3.772-2.825,4.531-8.175,1.707-11.947c-2.825-3.763-8.166-4.531-11.947-1.707c-65.186,48.887-215.236,49.493-216.747,49.493 c-4.71,0-8.533,3.823-8.533,8.533v34.133c0,36.625,26.871,106.965,35.029,123.281c10.394,20.77,55.834,72.986,101.504,72.986 s91.11-52.215,101.504-72.986C365.668,303.233,392.539,232.893,392.539,196.268z"/>\n                <path fill="${i}" d="M249.947,463.276c-1.536,1.621-2.475,3.84-2.475,6.059c0,2.219,0.939,4.437,2.475,6.059 c1.621,1.536,3.84,2.475,6.059,2.475s4.437-0.939,6.059-2.475c1.536-1.621,2.475-3.84,2.475-6.059 c0-2.219-0.939-4.437-2.475-6.059C258.907,460.119,253.104,460.119,249.947,463.276z"/>\n                <path fill="${i}" d="M34.139,230.401c0,18.85,6.75,36.659,19.098,50.688c-1.348,5.76-2.031,11.648-2.031,17.579 c0,42.342,34.458,76.8,76.8,76.8c6.494,0,12.954-0.819,19.191-2.432c4.565-1.178,7.305-5.828,6.127-10.394 c-1.178-4.565-5.828-7.305-10.394-6.127c-4.847,1.254-9.865,1.886-14.925,1.886c-32.939,0-59.733-26.795-59.733-59.733 c0-5.922,0.879-11.793,2.603-17.459c0.922-3.021,0.102-6.298-2.133-8.525c-11.307-11.298-17.536-26.308-17.536-42.283 c0-19.251,9.421-37.453,25.199-48.674c3.78-2.688,4.719-7.893,2.116-11.742c-6.707-9.89-10.249-21.461-10.249-33.451 c0-28.843,20.591-53.53,48.947-58.701c2.432-0.452,4.557-1.929,5.811-4.053c18.987-32.137,40.892-56.713,133.888-56.713 c71.714,0,128.947,23.484,142.413,58.436c0.888,2.304,2.731,4.105,5.052,4.949c23.535,8.559,39.356,31.095,39.356,56.081 c0,11.989-3.541,23.561-10.249,33.451c-2.603,3.849-1.664,9.054,2.116,11.742c15.778,11.221,25.199,29.423,25.199,48.674 c0,15.974-6.229,30.984-17.536,42.283c-2.236,2.227-3.055,5.504-2.133,8.525c1.724,5.666,2.603,11.537,2.603,17.459 c0,32.939-26.795,59.733-59.733,59.733c-5.018,0-10.001-0.623-14.814-1.852c-4.574-1.186-9.207,1.579-10.377,6.144 c-1.169,4.574,1.587,9.216,6.153,10.385c6.195,1.587,12.595,2.389,19.038,2.389c42.342,0,76.8-34.458,76.8-76.8 c0-5.931-0.683-11.819-2.031-17.579c12.348-14.029,19.098-31.838,19.098-50.688c0-22.11-9.643-43.128-26.138-57.643 c5.956-11.102,9.071-23.475,9.071-36.224c0-30.865-18.748-58.82-47.044-70.733C395.475,25.704,334.598,0.001,256.919,0.001 c-90.172,0-121.984,21.7-146.62,61.85c-34.475,8.115-59.093,38.921-59.093,74.684c0,12.749,3.115,25.122,9.071,36.224 C43.782,187.274,34.139,208.291,34.139,230.401z"/>\n                <path fill="${i}" d="M316.507,424.876c-1.621,1.621-2.475,3.84-2.475,6.059c0,2.304,0.853,4.437,2.475,6.059 c1.621,1.536,3.755,2.475,5.973,2.475c2.304,0,4.437-0.939,6.059-2.475c1.621-1.621,2.475-3.755,2.475-6.059 c0-2.219-0.853-4.437-2.475-6.059C325.382,421.719,319.664,421.719,316.507,424.876z"/>\n                <path fill="${i}" d="M223.664,458.668c-1.536,1.621-2.475,3.755-2.475,6.059c0,2.219,0.939,4.437,2.475,6.059 c1.621,1.536,3.84,2.475,6.059,2.475c2.304,0,4.437-0.939,6.059-2.475c1.621-1.621,2.475-3.84,2.475-6.059 c0-2.219-0.853-4.437-2.475-6.059C232.624,455.511,226.907,455.511,223.664,458.668z"/>\n                <path fill="${i}" d="M337.67,411.905c1.621-1.621,2.475-3.755,2.475-6.059c0-2.219-0.853-4.437-2.475-6.059 c-3.157-3.157-8.875-3.072-12.032,0.085c-1.621,1.536-2.56,3.755-2.56,5.973c0,2.304,0.939,4.437,2.56,6.059 c1.536,1.621,3.755,2.475,5.973,2.475C333.915,414.38,336.048,413.527,337.67,411.905z"/>\n                <path fill="${i}" d="M213.339,238.935c4.71,0,8.533-3.823,8.533-8.533v-5.615c0.546,0.529,0.922,0.964,0.964,1.024 c1.519,2.918,4.497,4.591,7.578,4.591c1.323,0,2.671-0.307,3.934-0.964c4.181-2.176,5.803-7.33,3.627-11.511 c-2.534-4.873-10.581-13.124-24.636-13.124c-14.054,0-22.101,8.252-24.636,13.124c-2.125,4.087-0.555,8.969,3.456,11.23 c4.011,2.287,9.156,0.811,11.563-3.123c0.077-0.128,0.495-0.623,1.084-1.195v5.564 C204.806,235.112,208.629,238.935,213.339,238.935z"/>\n                <path fill="${i}" d="M256.006,332.801c20.028,0,30.507-9.907,31.633-11.034c3.294-3.294,3.285-8.567,0.043-11.913 c-3.234-3.345-8.61-3.439-12.015-0.247c-0.265,0.247-6.699,6.127-19.661,6.127c-12.774,0-19.208-5.709-19.652-6.118 c-3.336-3.251-8.678-3.217-11.981,0.085c-3.337,3.336-3.337,8.73,0,12.066C225.499,322.894,235.978,332.801,256.006,332.801z"/>\n                <path fill="${i}" d="M298.672,238.935c4.71,0,8.533-3.823,8.533-8.533v-5.615c0.546,0.529,0.922,0.964,0.964,1.024 c1.519,2.918,4.497,4.591,7.578,4.591c1.323,0,2.671-0.307,3.934-0.964c4.181-2.176,5.803-7.33,3.627-11.511 c-2.534-4.873-10.581-13.124-24.636-13.124s-22.101,8.252-24.636,13.124c-2.125,4.087-0.555,8.969,3.456,11.23 c4.011,2.287,9.165,0.811,11.563-3.123c0.077-0.128,0.495-0.623,1.084-1.195v5.564 C290.139,235.112,293.962,238.935,298.672,238.935z"/>\n                <path fill="${i}" d="M511.571,500.771l-8.533-25.6c-8.883-26.658-62.464-65.212-136.098-65.212c-3.482,0-6.613,2.116-7.919,5.333 c-0.316,0.802-33.015,79.642-103.014,79.642c-69.99,0-102.69-79.181-103.014-79.983c-1.306-3.226-4.437-5.35-7.919-5.35 c-106.001,0-130.97,50.185-136.098,65.57l-8.533,25.6c-1.493,4.471,0.93,9.301,5.402,10.795c4.48,1.502,9.301-0.93,10.795-5.402 l8.533-25.6c8.465-25.412,42.974-52.514,114.381-53.845c9.293,19.703,45.577,85.282,116.454,85.282 c70.827,0,107.102-65.229,116.437-84.898c64.051,1.835,108.339,35.294,114.398,53.461l8.533,25.6 c1.195,3.576,4.523,5.837,8.098,5.837c0.887,0,1.801-0.137,2.697-0.435C510.64,510.073,513.064,505.243,511.571,500.771z"/>\n                <path fill="${i}" d="M375.472,281.601v17.067c0,4.71,3.823,8.533,8.533,8.533c4.71,0,8.533-3.823,8.533-8.533v-17.067 c0-4.71-3.823-8.533-8.533-8.533C379.295,273.068,375.472,276.891,375.472,281.601z"/>\n                <path fill="${i}" d="M188.934,405.847c0-2.219-0.939-4.437-2.56-5.973c-3.157-3.243-8.875-3.243-12.032,0 c-1.621,1.536-2.475,3.755-2.475,5.973c0,2.304,0.853,4.437,2.475,6.059s3.755,2.475,6.059,2.475 c2.219,0,4.437-0.853,5.973-2.475C187.995,410.284,188.934,408.151,188.934,405.847z"/>\n                <path fill="${i}" d="M189.531,439.468c2.219,0,4.437-0.939,5.973-2.475c1.621-1.621,2.475-3.755,2.475-6.059c0-2.219-0.853-4.437-2.475-6.059 c-3.157-3.157-8.875-3.157-12.032,0c-1.621,1.621-2.475,3.84-2.475,6.059c0,2.304,0.853,4.437,2.475,6.059 C185.008,438.529,187.227,439.468,189.531,439.468z"/>\n                <path fill="${i}" d="M200.624,445.356c-1.621,1.621-2.56,3.755-2.56,6.059c0,2.219,0.939,4.437,2.56,5.973c1.621,1.621,3.755,2.56,6.059,2.56 c2.219,0,4.437-0.939,5.973-2.56c1.621-1.536,2.475-3.755,2.475-5.973c0-2.304-0.853-4.523-2.475-6.059 C209.499,442.199,203.782,442.199,200.624,445.356z"/>\n                <path fill="${i}" d="M119.472,281.601v17.067c0,4.71,3.823,8.533,8.533,8.533s8.533-3.823,8.533-8.533v-17.067 c0-4.71-3.823-8.533-8.533-8.533S119.472,276.891,119.472,281.601z"/>\n            </svg>`
    );
  }),
  (FamilyTree.icon.teddy = function (e, t, i, r, a) {
    return (
      FamilyTree.isNEU(r) && (r = 0),
      FamilyTree.isNEU(a) && (a = 0),
      `<svg width="${e}" height="${t}" x="${r}" y="${a}" viewBox="0 0 512 512">\n                <path fill="${i}" d="M234.513,246.613c9.378-1.929,16.555-9.02,21.487-15.863c4.932,6.844,12.109,13.935,21.487,15.863 c1.459,0.299,3.089,0.486,4.873,0.486c6.118,0,13.978-2.304,22.34-10.667c3.337-3.337,3.337-8.73,0-12.066s-8.73-3.337-12.066,0 c-4.361,4.369-8.337,6.212-11.699,5.53c-6.912-1.408-13.611-12.203-16.401-18.364c9.523-3.866,17.067-13.577,17.067-23.799 c0-9.353-9.566-14.933-25.6-14.933c-16.026,0-25.6,5.581-25.6,14.933c0,10.223,7.535,19.934,17.067,23.799 c-2.807,6.178-9.498,16.956-16.401,18.364c-3.405,0.666-7.339-1.178-11.699-5.53c-3.336-3.337-8.73-3.337-12.066,0 s-3.337,8.73,0,12.066C218.104,247.236,228.062,247.91,234.513,246.613z M263.748,190.669c-1.502,2.944-4.873,5.598-7.748,5.598\ts-6.246-2.654-7.748-5.598C251.793,189.833,260.207,189.833,263.748,190.669z"/>\n                <path fill="${i}" d="M390.033,53.7c1.621,1.613,2.5,3.755,2.5,6.033s-0.879,4.42-2.5,6.025c-3.337,3.337-3.337,8.738,0,12.075 c1.664,1.664,3.849,2.5,6.033,2.5s4.369-0.836,6.033-2.492c4.838-4.838,7.501-11.273,7.501-18.108s-2.662-13.269-7.501-18.099 c-9.984-9.984-26.214-9.984-36.198,0c-3.337,3.328-3.337,8.73,0,12.066s8.73,3.337,12.066,0 C381.303,50.372,386.697,50.372,390.033,53.7z"/>\n                <path fill="${i}" d="M311.467,136.533c7.057,0,12.8-5.743,12.8-12.8c0-7.057-5.743-12.8-12.8-12.8s-12.8,5.743-12.8,12.8 C298.667,130.79,304.41,136.533,311.467,136.533z"/>\n                <path fill="${i}" d="M200.533,136.533c7.057,0,12.8-5.743,12.8-12.8c0-7.057-5.743-12.8-12.8-12.8s-12.8,5.743-12.8,12.8 C187.733,130.79,193.476,136.533,200.533,136.533z"/>\n                <path fill="${i}" d="M115.934,80.333c2.185,0,4.369-0.836,6.042-2.5c3.328-3.337,3.328-8.738-0.009-12.075c-1.613-1.604-2.5-3.746-2.5-6.025 s0.887-4.42,2.509-6.033c3.209-3.226,8.841-3.226,12.058,0c3.328,3.337,8.738,3.328,12.066,0 c3.337-3.328,3.337-8.738,0.009-12.066c-9.677-9.677-26.539-9.668-36.207-0.009c-4.838,4.838-7.501,11.273-7.501,18.108 s2.662,13.269,7.501,18.108C111.565,79.497,113.749,80.333,115.934,80.333z"/>\n                <path fill="${i}" d="M498.552,286.191c-28.262-23.945-91.742-14.2-98.884-13.005c-4.651,0.768-7.791,5.171-7.014,9.813 c0.777,4.651,5.171,7.799,9.813,7.014c17.246-2.867,66.133-6.827,85.052,9.199c5.06,4.284,7.415,9.54,7.415,16.521 c0,3.977-1.476,6.946-4.779,9.626c-24.098,19.567-114.33,5.982-147.063-0.913c-3.703-0.776-7.441,0.981-9.242,4.275 c-1.801,3.311-1.212,7.424,1.434,10.095c0.12,0.119,8.499,8.755,12.493,19.951c-2.125-0.222-4.267-0.367-6.443-0.367 c-37.641,0-68.267,34.458-68.267,76.8c0,7.629,1.024,14.993,2.884,21.956c-3.823,1.715-10.197,3.644-19.951,3.644 c-10.052,0-16.367-2.082-19.908-3.814c1.826-6.912,2.842-14.217,2.842-21.786c0-42.342-30.626-76.8-68.267-76.8 c-2.176,0-4.318,0.145-6.443,0.367c3.994-11.196,12.373-19.831,12.476-19.934c2.671-2.671,3.268-6.775,1.468-10.095 c-1.792-3.319-5.521-5.069-9.259-4.292c-32.725,6.895-122.974,20.48-147.063,0.913c-3.302-2.68-4.779-5.649-4.779-9.626 c0-6.98,2.355-12.228,7.407-16.512c18.867-15.991,67.806-12.066,85.06-9.208c4.651,0.794,9.045-2.364,9.813-7.014 c0.776-4.651-2.364-9.045-7.006-9.813c-7.151-1.195-70.613-10.957-98.884,13.005C4.651,293.649,0,303.863,0,315.733 c0,9.079,3.831,16.998,11.093,22.886c27.179,22.05,102.818,12.783,140.535,6.426c-2.825,5.47-5.188,11.896-6.11,18.825 c-25.216,11.29-43.119,38.98-43.119,71.33c0,42.342,30.626,76.8,68.267,76.8c25.446,0,47.642-15.778,59.383-39.057 c5.743,2.56,14.174,4.924,25.95,4.924c11.674,0,20.164-2.287,26.035-4.77C293.794,496.29,315.938,512,341.333,512 c37.641,0,68.267-34.458,68.267-76.8c0-32.35-17.903-60.041-43.119-71.33c-0.922-6.929-3.277-13.355-6.101-18.825 c37.717,6.357,113.365,15.633,140.527-6.426c7.262-5.888,11.093-13.807,11.093-22.886 C512,303.863,507.349,293.649,498.552,286.191z M170.667,494.933c-28.237,0-51.2-26.795-51.2-59.733s22.963-59.733,51.2-59.733 s51.2,26.795,51.2,59.733S198.904,494.933,170.667,494.933z M392.533,435.2c0,32.939-22.963,59.733-51.2,59.733 c-20.983,0-39.04-14.814-46.942-35.942c-0.145-0.614-0.324-1.186-0.606-1.766c-2.338-6.818-3.652-14.242-3.652-22.025 c0-32.939,22.963-59.733,51.2-59.733C369.57,375.467,392.533,402.261,392.533,435.2z"/>\n                <path fill="${i}" d="M307.2,443.733c0,18.825,15.309,34.133,34.133,34.133c18.825,0,34.133-15.309,34.133-34.133 c0-18.825-15.309-34.133-34.133-34.133C322.509,409.6,307.2,424.909,307.2,443.733z M358.4,443.733 c0,9.412-7.654,17.067-17.067,17.067c-9.404,0-17.067-7.654-17.067-17.067c0-9.412,7.663-17.067,17.067-17.067 C350.746,426.667,358.4,434.321,358.4,443.733z"/>\n                <path fill="${i}" d="M115.541,118.161c-8.619,21.709-13.141,45.525-13.141,69.572c0,67.849,52.762,136.533,153.6,136.533 s153.6-68.685,153.6-136.533c0-24.491-4.412-47.846-13.107-69.581c26.957-5.76,47.24-29.764,47.24-58.419 C443.733,26.795,416.93,0,384,0c-24.67,0-46.14,14.916-55.108,36.745C307.115,23.859,282.368,17.067,256,17.067 c-26.615,0-51.2,6.716-73.259,19.925C174.08,14.754,153.088,0,128,0C95.061,0,68.267,26.795,68.267,59.733 C68.267,88.397,88.559,112.41,115.541,118.161z M128,17.067c19.226,0,35.021,12.177,40.115,30.054 c-11.085,8.61-21.163,18.816-29.901,30.592c-2.807,3.789-2.014,9.131,1.775,11.938c3.789,2.816,9.139,2.022,11.938-1.766 c8.9-12.006,19.26-22.281,30.788-30.507C204.288,41.95,228.949,34.133,256,34.133c41.429,0,78.396,19.098,104.098,53.786 c1.681,2.253,4.25,3.447,6.869,3.447c1.766,0,3.55-0.546,5.077-1.681c3.78-2.799,4.574-8.149,1.775-11.938 c-8.969-12.092-19.157-22.485-30.345-31.104c5.427-17.374,21.632-29.577,40.525-29.577c23.526,0,42.667,19.14,42.667,42.667 S407.526,102.4,384,102.4c-2.935,0-5.658,1.502-7.228,3.985c-1.553,2.483-1.732,5.589-0.461,8.243 c10.761,22.443,16.222,47.044,16.222,73.105C392.533,247.1,345.634,307.2,256,307.2s-136.533-60.1-136.533-119.467 c0-25.617,5.615-50.901,16.23-73.122c1.263-2.637,1.084-5.751-0.478-8.226c-1.562-2.483-4.292-3.985-7.219-3.985 c-23.526,0-42.667-19.14-42.667-42.667S104.474,17.067,128,17.067z"/>\n                <path fill="${i}" d="M256,290.133c47.053,0,85.333-30.626,85.333-68.267c0-36.258-36.489-76.8-85.333-76.8s-85.333,40.542-85.333,76.8 C170.667,259.507,208.947,290.133,256,290.133z M256,162.133c38.451,0,68.267,32.111,68.267,59.733 c0,28.237-30.626,51.2-68.267,51.2c-37.641,0-68.267-22.963-68.267-51.2C187.733,194.244,217.557,162.133,256,162.133z"/>\n                <path fill="${i}" d="M170.667,409.6c-18.825,0-34.133,15.309-34.133,34.133c0,18.825,15.309,34.133,34.133,34.133 s34.133-15.309,34.133-34.133C204.8,424.909,189.491,409.6,170.667,409.6z M170.667,460.8c-9.412,0-17.067-7.654-17.067-17.067 c0-9.412,7.654-17.067,17.067-17.067c9.412,0,17.067,7.654,17.067,17.067C187.733,453.146,180.079,460.8,170.667,460.8z"/>\n            </svg>`
    );
  }),
  (FamilyTree.prototype.exportPDFProfile = function (e, t) {
    (e = this._defaultExportProfileOptions(e, "pdf")),
      this._exportProfile(e, t);
  }),
  (FamilyTree.prototype.exportPNGProfile = function (e, t) {
    (e = this._defaultExportProfileOptions(e, "png")),
      this._exportProfile(e, t);
  }),
  (FamilyTree.prototype.shareProfile = function (e) {
    var t;
    "object" == typeof e
      ? (e = (t = e).focusId)
      : (t = this.editUI.content(e, !0, !0, "100%", !0));
    var i = new URL(window.location.href);
    i.searchParams.append("nodeId", e);
    var r = {
      title: t.title,
      text: t.shareText,
      url: i.href,
    };
    try {
      navigator.share(r);
    } catch (e) {
      console.error("error: " + e);
    }
  }),
  (FamilyTree.prototype.exportPDF = function (e, t) {
    (e = this._defaultExportOptions(e, "pdf")), this._export(e, t);
  }),
  (FamilyTree.prototype.exportPNG = function (e, t) {
    (e = this._defaultExportOptions(e, "png")), this._export(e, t);
  }),
  (FamilyTree.prototype.exportSVG = function (e, t) {
    (e = this._defaultExportOptions(e, "svg")), this._export(e, t);
  }),
  (FamilyTree.prototype._defaultExportOptions = function (e, t) {
    return (
      null == e && (e = {}),
      "svg" == t
        ? ((e.ext = "svg"), (e.mime = "image/svg+xml"))
        : "pdf" == t
        ? ((e.mime = "application/pdf"), (e.ext = "pdf"))
        : "png" == t && ((e.mime = "image/png"), (e.ext = "png")),
      null == e.margin && (e.margin = [50, 40, 50, 40]),
      null == e.padding && (e.padding = 0),
      null == e.landscape && (e.landscape = !1),
      null == e.filename && (e.filename = "FamilyTree." + e.ext),
      null == e.scale && (e.scale = "fit"),
      null == e.format && (e.format = "fit"),
      null == e.header && (e.header = ""),
      null == e.footer && (e.footer = "Page {current-page} of {total-pages}"),
      null == e.openInNewTab && (e.openInNewTab = !1),
      null == e.mode && (e.mode = this.config.mode),
      e
    );
  }),
  (FamilyTree.prototype._export = function (e, t) {
    var i = this,
      r = {
        id: e.nodeId,
        expandChildren: e.expandChildren,
      };
    e.margin && e.margin[0] < 2 && (e.margin[0] = 2),
      e.margin && e.margin[1] < 2 && (e.margin[1] = 2),
      e.margin && e.margin[2] < 2 && (e.margin[2] = 2),
      e.margin && e.margin[3] < 2 && (e.margin[3] = 2),
      this._draw(!1, FamilyTree.action.exporting, r, function (r) {
        var a = document.createElement("div");
        if (((a.innerHTML = r), e.padding > 0)) {
          var n = a.querySelector("svg"),
            o = FamilyTree._getViewBox(n);
          (o[0] -= e.padding),
            (o[1] -= e.padding),
            (o[2] += 2 * e.padding),
            (o[3] += 2 * e.padding),
            n.setAttribute("viewBox", o.join()),
            n.setAttribute("width", o[2]),
            n.setAttribute("height", o[3]);
        }
        if ("svg" == e.ext)
          if (t) t(e, a.innerHTML);
          else {
            (n = a.querySelector("svg")).classList.add(i.config.mode);
            var l = {
                content: a.innerHTML,
                options: e,
                styles: "",
              },
              s = FamilyTree.events.publish("exportstart", [i, l]),
              d = i.element.querySelector("[data-bft-styles]");
            if (
              (d && (l.styles += d.outerHTML),
              l.styles &&
                (a.childNodes[0].insertAdjacentHTML("afterbegin", l.styles),
                (l.content = a.innerHTML)),
              !1 === s)
            )
              return !1;
            if (!1 === (s = FamilyTree.events.publish("exportend", [i, l])))
              return !1;
            FamilyTree._downloadFile(
              e.mime,
              l.content,
              l.options.filename,
              l.options.openInNewTab
            );
          }
        else
          i._pages(e, a.querySelector("svg"), function (r) {
            var n = {
                content: a.innerHTML,
                options: e,
                pages: r,
                styles: "",
              },
              o = FamilyTree.events.publish("exportstart", [i, n]),
              l = i.element.querySelector("[data-bft-styles]");
            if ((l && (n.styles += l.outerHTML), !1 === o)) return !1;
            t || FamilyTree.loading.show(i),
              t
                ? t(i, n, a.querySelector("svg"))
                : ((n = JSON.stringify(n)),
                  FamilyTree._ajax(
                    i.config.exportUrl + "/v3",
                    "POST",
                    n,
                    "arraybuffer",
                    function (t) {
                      var r = FamilyTree.events.publish("exportend", [i, t]);
                      if ((FamilyTree.loading.hide(i), !1 === r)) return !1;
                      FamilyTree._downloadFile(
                        e.mime,
                        t,
                        e.filename,
                        e.openInNewTab
                      );
                    }
                  ));
          });
      });
  }),
  (FamilyTree.prototype.exportCSV = function (e) {
    e || (e = "FamilyTree.csv");
    var t = {
      ext: "csv",
      filename: e,
      nodes: JSON.parse(JSON.stringify(this.config.nodes)),
    };
    if (!1 === FamilyTree.events.publish("exportstart", [this, t])) return !1;
    var i = FamilyTree._json2csv(t.nodes),
      r = {
        ext: t.ext,
        filename: t.filename,
        nodes: t.nodes,
        content: i,
      };
    if (!1 === FamilyTree.events.publish("exportend", [this, r])) return !1;
    FamilyTree._downloadFile(
      "text/csv;charset=utf-8;",
      "\ufeff" + r.content,
      r.filename,
      r.openInNewTab
    );
  }),
  (FamilyTree.prototype.exportXML = function (e) {
    e || (e = "FamilyTree.xml");
    var t = {
      ext: "xml",
      filename: e,
      nodes: JSON.parse(JSON.stringify(this.config.nodes)),
    };
    if (!1 === FamilyTree.events.publish("exportstart", [this, t])) return !1;
    var i = FamilyTree._json2xml(t.nodes),
      r = {
        ext: t.ext,
        filename: t.filename,
        nodes: t.nodes,
        content: i,
      };
    if (!1 === FamilyTree.events.publish("exportend", [this, r])) return !1;
    FamilyTree._downloadFile(
      "application/xml",
      r.content,
      r.filename,
      r.openInNewTab
    );
  }),
  (FamilyTree.prototype._pages = function (e, t, i) {
    ("A5" == e.format && "fit" != e.scale) ||
    ("A4" == e.format && "fit" != e.scale) ||
    ("A3" == e.format && "fit" != e.scale) ||
    ("A2" == e.format && "fit" != e.scale) ||
    ("A1" == e.format && "fit" != e.scale) ||
    ("Letter" == e.format && "fit" != e.scale) ||
    ("Legal" == e.format && "fit" != e.scale)
      ? i(this._pagesA100(e, t, e.scale))
      : ("A5" == e.format && "fit" == e.scale) ||
        ("A4" == e.format && "fit" == e.scale) ||
        ("A3" == e.format && "fit" == e.scale) ||
        ("A2" == e.format && "fit" == e.scale) ||
        ("A1" == e.format && "fit" == e.scale) ||
        ("Letter" == e.format && "fit" == e.scale) ||
        ("Legal" == e.format && "fit" == e.scale)
      ? i(this._pagesAfit(e, t))
      : "fit" == e.format && i(this._pagesFit(e, t));
  }),
  (FamilyTree.prototype._pagesFit = function (e, t) {
    var i = t.getAttribute("width"),
      r = t.getAttribute("height"),
      a = FamilyTree._getViewBox(t),
      n = {
        w: parseFloat(i),
        h: parseFloat(r),
      };
    return [
      {
        vb: a,
        size: {
          w: n.w + (e.margin[1] + e.margin[3]),
          h: n.h + (e.margin[0] + e.margin[2]),
        },
        innerSize: n,
      },
    ];
  }),
  (FamilyTree.prototype._pagesAfit = function (e, t) {
    var i = t.getAttribute("width"),
      r = 0,
      a = 0;
    switch (e.format) {
      case "A5":
        (r = FamilyTree.A5w), (a = FamilyTree.A5h);
        break;
      case "A4":
        (r = FamilyTree.A4w), (a = FamilyTree.A4h);
        break;
      case "A3":
        (r = FamilyTree.A3w), (a = FamilyTree.A3h);
        break;
      case "A2":
        (r = FamilyTree.A2w), (a = FamilyTree.A2h);
        break;
      case "A1":
        (r = FamilyTree.A1w), (a = FamilyTree.A1h);
        break;
      case "Letter":
        (r = FamilyTree.Letterw), (a = FamilyTree.Letterh);
        break;
      case "Legal":
        (r = FamilyTree.Legalw), (a = FamilyTree.Legalh);
    }
    var n = e.landscape
        ? a - (e.margin[1] + e.margin[3])
        : r - (e.margin[1] + e.margin[3]),
      o =
        (e.landscape ? (e.margin[0], e.margin[2]) : (e.margin[0], e.margin[2]),
        n / i);
    return this._pagesA100(e, t, 100 * o);
  }),
  (FamilyTree.prototype._pagesA100 = function (e, t, i) {
    var r = FamilyTree._getViewBox(t),
      a = 0,
      n = 0;
    switch (e.format) {
      case "A5":
        (a = FamilyTree.A5w), (n = FamilyTree.A5h);
        break;
      case "A4":
        (a = FamilyTree.A4w), (n = FamilyTree.A4h);
        break;
      case "A3":
        (a = FamilyTree.A3w), (n = FamilyTree.A3h);
        break;
      case "A2":
        (a = FamilyTree.A2w), (n = FamilyTree.A2h);
        break;
      case "A1":
        (a = FamilyTree.A1w), (n = FamilyTree.A1h);
        break;
      case "Letter":
        (a = FamilyTree.Letterw), (n = FamilyTree.Letterh);
        break;
      case "Legal":
        (a = FamilyTree.Legalw), (n = FamilyTree.Legalh);
    }
    var o = r[0],
      l = r[1],
      s = r[2],
      d = r[3],
      c = {
        w: e.landscape
          ? n - (e.margin[1] + e.margin[3])
          : a - (e.margin[1] + e.margin[3]),
        h: e.landscape
          ? a - (e.margin[0] + e.margin[2])
          : n - (e.margin[0] + e.margin[2]),
      },
      m = {
        w: e.landscape ? n : a,
        h: e.landscape ? a : n,
      };
    t.setAttribute("preserveAspectRatio", "xMinYMin slice"),
      t.setAttribute("width", c.w),
      t.setAttribute("height", c.h);
    for (
      var h = c.w * (100 / i), p = c.h * (100 / i), f = o, y = l, u = [];
      f < s + o;

    ) {
      for (; y < d + l; ) {
        var g = [f, y, h, p];
        (g = g.join()),
          u.push({
            vb: g,
            innerSize: c,
            size: m,
          }),
          (y += p);
      }
      (f += h), (y = l);
    }
    return u;
  }),
  (FamilyTree.prototype._defaultExportProfileOptions = function (e, t) {
    return (
      (FamilyTree.isNEU(e) || FamilyTree.isNEU(e.id)) &&
        console.error("options.id is not defilned"),
      "svg" == t
        ? ((e.ext = "svg"), (e.mime = "image/svg+xml"))
        : "pdf" == t
        ? ((e.mime = "application/pdf"), (e.ext = "pdf"))
        : "png" == t && ((e.mime = "image/png"), (e.ext = "png")),
      null == e.margin && (e.margin = [50, 40, 50, 40]),
      null == e.padding && (e.padding = 0),
      null == e.landscape && (e.landscape = !1),
      null == e.filename && (e.filename = "Profile." + e.ext),
      null == e.scale && (e.scale = "fit"),
      null == e.format && (e.format = "A4"),
      null == e.header && (e.header = ""),
      null == e.footer && (e.footer = ""),
      null == e.openInNewTab && (e.openInNewTab = !1),
      null == e.mode && (e.mode = this.config.mode),
      e
    );
  }),
  (FamilyTree.prototype._exportProfile = function (e, t) {
    var i = this,
      r = 0,
      a = 0;
    switch (e.format) {
      case "A5":
        (r = FamilyTree.A5w), (a = FamilyTree.A5h);
        break;
      case "A4":
        (r = FamilyTree.A4w), (a = FamilyTree.A4h);
        break;
      case "A3":
        (r = FamilyTree.A3w), (a = FamilyTree.A3h);
        break;
      case "A2":
        (r = FamilyTree.A2w), (a = FamilyTree.A2h);
        break;
      case "A1":
        (r = FamilyTree.A1w), (a = FamilyTree.A1h);
        break;
      case "Letter":
        (r = FamilyTree.Letterw), (a = FamilyTree.Letterh);
        break;
      case "Legal":
        (r = FamilyTree.Legalw), (a = FamilyTree.Legalh);
    }
    var n = {
        w: e.landscape
          ? a - (e.margin[1] + e.margin[3])
          : r - (e.margin[1] + e.margin[3]),
        h: e.landscape
          ? r - (e.margin[0] + e.margin[2])
          : a - (e.margin[0] + e.margin[2]),
      },
      o = {
        w: e.landscape ? a : r,
        h: e.landscape ? r : a,
      },
      l = this.editUI.content(e.id, !0, !0, "100%", !0).element;
    FamilyTree.input.init(l);
    var s = {
      content: l.outerHTML,
      options: e,
      pages: [
        {
          vb: "",
          innerSize: n,
          size: o,
        },
      ],
      styles: "",
    };
    if (!t) {
      if (!1 === FamilyTree.events.publish("exportstart", [i, s])) return !1;
      FamilyTree.loading.show(i);
    }
    var d = this.element.querySelector("[data-bft-styles]");
    d && (s.styles += d.outerHTML);
    var c = this.getSvg().querySelector("defs");
    if (c)
      for (var m = 0; m < c.children.length; m++)
        "style" == c.children[m].nodeName.toLowerCase() &&
          (s.styles += c.children[m].outerHTML);
    (s = JSON.stringify(s)),
      FamilyTree._ajax(
        this.config.exportUrl + "/v3",
        "POST",
        s,
        "arraybuffer",
        function (r) {
          if (t) t(i, r);
          else {
            var a = FamilyTree.events.publish("exportend", [i, r]);
            if ((FamilyTree.loading.hide(i), !1 === a)) return !1;
            FamilyTree._downloadFile(e.mime, r, e.filename, e.openInNewTab);
          }
        }
      );
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.events = (function () {
    var e = {};
    return {
      on: function (t, i, r) {
        Array.isArray(e[t]) || (e[t] = []),
          e[t].push({
            listener: i,
            event_id: r,
          });
      },
      removeAll: function (t) {
        Array.isArray(e[t]) || (e[t] = []), (e[t] = []);
      },
      removeForEventId: function (t) {
        for (var i in e)
          if (Array.isArray(e[i]))
            for (var r = e[i].length - 1; r >= 0; r--)
              e[i][r].event_id == t && e[i].splice(r, 1);
      },
      publish: function (t, i) {
        if (e[t]) {
          for (var r = [], a = 0; a < e[t].length; a++) {
            var n = e[t][a];
            (null != n.event_id && n.event_id != i[0]._event_id) ||
              r.push(n.listener);
          }
          if (r.length > 0) {
            var o = !0;
            for (a = 0; a < r.length; a++)
              1 == i.length
                ? (o = r[a](i[0]) && o)
                : 2 == i.length
                ? (o = r[a](i[0], i[1]) && o)
                : 3 == i.length
                ? (o = r[a](i[0], i[1], i[2]) && o)
                : 4 == i.length
                ? (o = r[a](i[0], i[1], i[2], i[3]) && o)
                : 5 == i.length &&
                  (o = r[a](i[0], i[1], i[2], i[3], i[4]) && o);
            return o;
          }
        }
      },
    };
  })()),
  (FamilyTree.prototype.importCSV = function () {
    var e = this,
      t = document.createElement("INPUT");
    t.setAttribute("type", "file"),
      t.setAttribute("accept", ".csv"),
      (t.style.display = "none"),
      (t.onchange = function (t) {
        var i = t.target,
          r = new FileReader();
        (r.onload = function () {
          var t = r.result,
            i = FamilyTree._csvToArray(t, ","),
            a = [],
            n = i[0];
          FamilyTree._importSetColumnNames(n, function (t) {
            for (var r = 1; r < i.length; r++) {
              for (var n = {}, o = 0; o < i[r].length; o++) {
                var l = t[o],
                  s = i[r][o];
                if ("tags" == l && "" != s) s = s.split(",");
                else if ("tags" == l && "" == s) continue;
                n[l] = s;
              }
              "" != n.id.trim() && a.push(n);
            }
            var d = {
              nodes: a,
              columnNames: i[0],
            };
            0 != FamilyTree.events.publish("import", [e, d]) &&
              ((e.config.nodes = d.nodes), e.draw());
          });
        }),
          r.readAsText(i.files[0]);
      }),
      t.click();
  }),
  (FamilyTree._importSetColumnNames = function (e, t) {
    if (-1 == e.indexOf("id") || -1 == e.indexOf("pid")) {
      var i = document.createElement("DIV"),
        r = document.createElement("P");
      (r.style.padding = "5px"),
        (r.style.color = "rgb(122, 122, 122)"),
        (r.innerHTML = FamilyTree.IMPORT_MESSAGE),
        i.appendChild(r);
      var a = document.createElement("div"),
        n = document.createElement("div"),
        o = document.createElement("div"),
        l = document.createElement("span");
      a.setAttribute("id", "bft-sampleDialog"),
        (a.style.height = "260px"),
        (a.style.width = "400px"),
        (a.style.background = "white"),
        (a.style.border = "0.5px solid grey"),
        (a.style.position = "fixed"),
        (a.style.overflow = "hidden"),
        (a.style.zIndex = "99"),
        n.setAttribute("id", "title"),
        (n.style.backgroundColor = "#e5e5e5"),
        (n.style.fontWeight = "bold"),
        (n.style.color = "rgb(122, 122, 122)"),
        (n.style.height = "20px"),
        (n.style.padding = "3px 0 0 7px"),
        l.setAttribute("id", "close"),
        (l.style.cursor = "pointer"),
        (l.style.position = "absolute"),
        (l.style.color = "rgb(122, 122, 122)"),
        (l.style.fontWeight = "bold"),
        (l.style.top = "2px"),
        (l.style.zIndex = 100),
        o.setAttribute("id", "content"),
        (o.style.padding = "2px"),
        (n.innerHTML = "Import Organizational Chart Data"),
        (l.innerHTML = "&times;");
      var s = document.createElement("HR");
      (s.style.height = "0.1px"),
        (s.style.backgroundColor = "#aeaeae"),
        (s.style.border = "none"),
        (s.style.margin = "0"),
        a.appendChild(n),
        a.appendChild(s),
        o.appendChild(i),
        a.appendChild(o),
        a.appendChild(l),
        document.body.appendChild(a),
        FamilyTree._importCenter(a),
        (l.style.left = a.offsetWidth - 20 + "px");
      var d = document.createElement("div");
      d.setAttribute("id", "overlay"),
        (d.style.width = "100%"),
        (d.style.height = "100%"),
        (d.style.left = 0),
        (d.style.top = 0),
        (d.style.position = "fixed"),
        (d.style.background = "grey"),
        (d.style.opacity = "0.5"),
        (d.style.zIndex = 98),
        document.body.appendChild(d),
        (a._overlay = d);
      var c = document.createElement("LABEL"),
        m = document.createTextNode("Name:");
      c.setAttribute("for", "bft-id-select"),
        c.appendChild(m),
        (c.style.fontSize = "16px"),
        (c.style.color = "rgb(122, 122, 122)"),
        (c.style.padding = "5px"),
        (c.style.margin = "5px"),
        (c.style.width = "30%"),
        (c.style.textAlign = "right"),
        (c.style.display = "inline-block"),
        i.appendChild(c);
      var h = document.createElement("SELECT");
      (h.id = "bft-id-select"),
        (h.style.fontSize = "16px"),
        (h.style.color = "rgb(122, 122, 122)"),
        (h.style.padding = "5px"),
        (h.style.margin = "5px"),
        (h.style.width = "60%"),
        (h.style.border = "1px solid #aeaeae"),
        i.appendChild(h);
      var p = document.createElement("BR");
      i.appendChild(p);
      for (var f = 0; f < e.length; f++) {
        (T = document.createElement("option")).setAttribute("value", e[f]);
        var y = document.createTextNode(e[f]);
        T.appendChild(y), h.appendChild(T);
      }
      var u = document.createElement("LABEL"),
        g = document.createTextNode("Reports to:");
      u.setAttribute("for", "pid-select"),
        u.appendChild(g),
        (u.style.fontSize = "16px"),
        (u.style.color = "rgb(122, 122, 122)"),
        (u.style.padding = "5px"),
        (u.style.margin = "5px"),
        (u.style.width = "30%"),
        (u.style.textAlign = "right"),
        (u.style.display = "inline-block"),
        i.appendChild(u);
      var b = document.createElement("SELECT");
      (b.id = "pid-select"),
        (b.style.fontSize = "16px"),
        (b.style.color = "rgb(122, 122, 122)"),
        (b.style.padding = "5px"),
        (b.style.margin = "5px"),
        (b.style.width = "60%"),
        (b.style.border = "1px solid #aeaeae"),
        i.appendChild(b);
      for (f = 0; f < e.length; f++) {
        var T;
        (T = document.createElement("option")).setAttribute("value", e[f]);
        y = document.createTextNode(e[f]);
        T.appendChild(y), b.appendChild(T);
      }
      var v = document.createElement("BUTTON");
      (v.innerHTML = "Import"),
        (v.style.fontSize = "16px"),
        (v.style.color = "rgb(122, 122, 122)"),
        (v.style.padding = "5px 20px"),
        (v.style.margin = "20px auto"),
        (v.style.display = "block"),
        (v.onclick = function () {
          (a.style.display = "none"),
            a._overlay && a._overlay.parentNode.removeChild(a._overlay);
          var i = h.options[h.selectedIndex].value,
            r = e.indexOf(i);
          e[r] = "id";
          var n = b.options[b.selectedIndex].value,
            o = e.indexOf(n);
          (e[o] = "pid"), t(e);
        });
      var F = document.createElement("DIV");
      return (
        F.appendChild(v),
        i.appendChild(F),
        (l.onclick = function (e) {
          a._overlay && a._overlay.parentNode.removeChild(a._overlay),
            a.parentNode.removeChild(a),
            e.stopPropagation();
        }),
        (n.onmousedown = function (e) {
          (e = e || window.event),
            (a._dragging = !0),
            (a._originalLeft = a.offsetLeft),
            (a._originalTop = a.offsetTop),
            (a._mouseLeft = e.clientX),
            (a._mouseTop = e.clientY);
        }),
        (document.onmousemove = function (e) {
          (e = e || window.event),
            a._dragging &&
              ((a.style.left =
                a._originalLeft + e.clientX - a._mouseLeft + "px"),
              (a.style.top = a._originalTop + e.clientY - a._mouseTop + "px"));
        }),
        (document.onmouseup = function (e) {
          (e = e || window.event),
            a._dragging &&
              ((a.style.left =
                a._originalLeft + e.clientX - a._mouseLeft + "px"),
              (a.style.top = a._originalTop + e.clientY - a._mouseTop + "px"),
              (a._dragging = !1));
        }),
        a
      );
    }
    t(e);
  }),
  (FamilyTree._importCenter = function (e) {
    e &&
      ((e.style.left = (window.innerWidth - e.offsetWidth) / 2 + "px"),
      (e.style.top = (window.innerHeight - e.offsetHeight) / 2 + "px"));
  }),
  (FamilyTree.prototype.importXML = function () {
    var e = this,
      t = document.createElement("INPUT");
    t.setAttribute("type", "file"),
      t.setAttribute("accept", ".xml"),
      (t.style.display = "none"),
      (t.onchange = function (t) {
        var i = t.target,
          r = new FileReader();
        (r.onload = function () {
          var t = r.result,
            i = FamilyTree._xml2json(t);
          0 != FamilyTree.events.publish("import", [e, i]) &&
            ((e.config.nodes = i), e.draw());
        }),
          r.readAsText(i.files[0]);
      }),
      t.click();
  }),
  (FamilyTree.prototype.expand = function (e, t, i) {
    var r = {
      id: e,
      ids: t,
    };
    this._draw(!1, FamilyTree.action.expand, r, i);
  }),
  (FamilyTree.prototype.collapse = function (e, t, i) {
    var r = {
      id: e,
      ids: t,
    };
    this._draw(!1, FamilyTree.action.collapse, r, i);
  }),
  (FamilyTree.prototype.changeRoots = function (e, t, i) {
    this.config.roots = t;
    var r = {
      id: e,
    };
    this._draw(!1, FamilyTree.action.update, r, i);
  }),
  (FamilyTree.prototype.expandCollapse = function (e, t, i, r) {
    Array.isArray(t) || (t = []), Array.isArray(i) || (i = []);
    var a = {
      id: e,
      expandIds: t,
      collapseIds: i,
      ids: t.concat(i),
    };
    this._draw(!1, FamilyTree.action.collapse, a, r);
  }),
  (FamilyTree.prototype.expandCollapseToLevel = function (e, t, i, r) {
    (this.config.collapse = t), null == i && (i = {}), (this.config.expand = i);
    var a = {
      id: e,
      method: "expandCollapseToLevel",
    };
    this._draw(!1, FamilyTree.action.collapse, a, r);
  }),
  (FamilyTree.prototype.maximize = function (e, t, i, r) {
    var a = this,
      n = {
        id: e,
        options: {},
      };
    FamilyTree.isNEU(n.id) && ((n.id = this.roots[0].id), (n.all = !0)),
      (n.options.horizontal = !1),
      (n.options.vertical = !1),
      t && (n.options.horizontal = t),
      i && (n.options.vertical = i),
      this._draw(!1, FamilyTree.action.maximize, n, function () {
        a.ripple(e), r && r();
      });
  }),
  (FamilyTree.prototype.minimize = function (e, t) {
    var i = this,
      r = {
        id: e,
      };
    FamilyTree.isNEU(r.id) && ((r.id = this.roots[0].id), (r.all = !0)),
      this._draw(!1, FamilyTree.action.minimize, r, function () {
        i.ripple(e), t && t();
      });
  }),
  (FamilyTree.prototype._expCollHandler = function (e) {
    this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.hide(),
      this.nodeCircleMenuUI.hide();
    var t = this.getNode(e),
      i = this.getCollapsedIds(t);
    if (i.length) {
      if (!1 === FamilyTree.events.publish("expcollclick", [this, !1, e, i]))
        return !1;
      this.expand(e, i, !1);
    } else {
      if (
        !1 ===
        FamilyTree.events.publish("expcollclick", [this, !0, e, t.childrenIds])
      )
        return !1;
      this.collapse(e, t.childrenIds, !1);
    }
  }),
  (FamilyTree.prototype._upHandler = function (e) {
    this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.hide(),
      this.nodeCircleMenuUI.hide();
    var t = this._upHandlerCreateArgs(e);
    if (!1 === FamilyTree.events.publish("up-click", [this, t])) return !1;
    this.changeRoots(t.id, t.roots, !1);
  }),
  (FamilyTree.prototype._upHandlerCreateArgs = function (e) {
    var t,
      i = this.getNode(e),
      r = Object.assign([], this.config.roots),
      a = this.getNode(i.pid);
    if ((a && (t = a), t)) {
      if (Array.isArray(r)) {
        var n = r.indexOf(i.id);
        -1 != n && r.splice(n, 1);
      } else r = [];
      r.push(t.id);
    }
    return {
      id: i.id,
      roots: r,
    };
  }),
  (FamilyTree.prototype._upHandlerCreateArgs = function (e) {
    var t = this.getNode(e),
      i = Object.assign([], this.config.roots),
      r = this.getRecentRootsByNodeId(e);
    return (
      Array.isArray(i) || (i = []),
      FamilyTree._changeRootOption(i, r, this.manager.rootList),
      {
        id: t.id,
        roots: i,
      }
    );
  }),
  String.prototype.replaceAll ||
    (String.prototype.replaceAll = function (e, t) {
      return this.replace(new RegExp(e, "g"), t);
    }),
  (String.prototype.splice = function (e, t, i) {
    return this.slice(0, e) + i + this.slice(e + Math.abs(t));
  }),
  (String.prototype.insert = function (e, t) {
    return e > 0 ? this.substring(0, e) + t + this.substr(e) : t + this;
  }),
  Array.prototype.unique ||
    Object.defineProperty(Array.prototype, "unique", {
      value: function () {
        for (var e = this.concat(), t = 0; t < e.length; ++t)
          for (var i = t + 1; i < e.length; ++i)
            e[t] === e[i] && e.splice(i--, 1);
        return e;
      },
      writable: !0,
      configurable: !0,
      enumerable: !1,
    }),
  Object.defineProperty(Array.prototype, "has", {
    value: function (e) {
      for (var t = 0; t < this.length; t++) if (this[t] == e) return !0;
      return !1;
    },
    writable: !0,
    configurable: !0,
    enumerable: !1,
  }),
  "function" != typeof Object.assign &&
    Object.defineProperty(Object, "assign", {
      value: function (e, t) {
        "use strict";
        if (null == e)
          throw new TypeError("Cannot convert undefined or null to object");
        for (var i = Object(e), r = 1; r < arguments.length; r++) {
          var a = arguments[r];
          if (null != a)
            for (var n in a)
              Object.prototype.hasOwnProperty.call(a, n) && (i[n] = a[n]);
        }
        return i;
      },
      writable: !0,
      configurable: !0,
    }),
  "function" != typeof String.prototype.endsWith &&
    (String.prototype.endsWith = function (e) {
      return -1 !== this.indexOf(e, this.length - e.length);
    }),
  (FamilyTree.prototype._globalMouseDownHandler = function (e, t) {
    var i = {
      move: "mousemove",
      up: "mouseup",
      leave: "mouseleave",
    };
    if (
      (-1 != t.type.indexOf("touch") &&
        (1 == t.touches.length
          ? (this._touch = {
              x: t.touches[0].clientX,
              y: t.touches[0].clientY,
            })
          : (this._touch = null),
        (i = {
          move: "touchmove",
          up: "touchend",
          touchstart: "touchstart",
        })),
      e == t.target)
    )
      return (
        t.stopPropagation(),
        t.preventDefault(),
        void this._mouseDownHandler(e, t, i)
      );
    if (this.config.nodeMouseClick == FamilyTree.action.pan) {
      for (
        var r = t.target;
        r != e &&
        !r.hasAttribute(FamilyTree.attr.control_expcoll_id) &&
        !r.hasAttribute(FamilyTree.attr.control_up_id);

      )
        r = r.parentNode;
      if (
        !r.hasAttribute(FamilyTree.attr.control_expcoll_id) &&
        !r.hasAttribute(FamilyTree.attr.control_up_id)
      )
        return (
          t.stopPropagation(),
          t.preventDefault(),
          void this._mouseDownHandler(e, t, i)
        );
    }
    for (var a = t.target; a != e; ) {
      if (a.hasAttribute(FamilyTree.attr.node_id))
        return void this._nodeMouseDownHandler(a, t, i);
      if (a.hasAttribute(FamilyTree.attr.control_node_circle_menu_name))
        return (
          t.stopPropagation(),
          t.preventDefault(),
          void this._nodeCircleNodeMenuItemMouseDownHandler(a, t, i)
        );
      a = a.parentNode;
    }
  }),
  (FamilyTree.prototype._globalClickHandler = function (e, t) {
    if (
      -1 != t.type.indexOf("touch") &&
      this._touch &&
      1 == t.changedTouches.length
    ) {
      if (t.changedTouches.length) {
        var i = {
            x: t.changedTouches[0].clientX,
            y: t.changedTouches[0].clientY,
          },
          r = FamilyTree.t(this.config.template, !1, this.getScale()).size,
          a = this.getScale(),
          n = Math.abs(i.x - this._touch.x) / a,
          o = Math.abs(i.y - this._touch.y) / a;
        if (((this._touch = null), n > r[0] / 10)) return;
        if (o > r[1] / 10) return;
      }
    } else if (-1 != t.type.indexOf("touch") && null == this._touch) return;
    for (var l = t.target; l != e; ) {
      if (l.hasAttribute(FamilyTree.attr.control_expcoll_id)) {
        var s = l.getAttribute(FamilyTree.attr.control_expcoll_id),
          d = this.getNode(s);
        return void this._expCollHandler(d.id);
      }
      if (l.hasAttribute(FamilyTree.attr.node_id)) {
        (s = l.getAttribute(FamilyTree.attr.node_id)), (d = this.getNode(s));
        return void this._nodeClickHandler(d.id, t);
      }
      if (l.hasAttribute(FamilyTree.attr.control_node_menu_id)) {
        t.stopPropagation(), t.preventDefault();
        (s = l.getAttribute(FamilyTree.attr.control_node_menu_id)),
          (d = this.getNode(s));
        return void this._nodeMenuClickHandler(d.id, l, t);
      }
      if (l.hasAttribute(FamilyTree.attr.control_node_circle_menu_id)) {
        t.stopPropagation(), t.preventDefault();
        s = l.getAttribute(FamilyTree.attr.control_node_circle_menu_id);
        return void this._nodeCircleMenuClickHandler(s);
      }
      if (l.hasAttribute(FamilyTree.attr.control_node_circle_menu_name))
        return (
          t.stopPropagation(),
          t.preventDefault(),
          void this._nodeCircleMenuItemClickHandler(l, t)
        );
      if (l.hasAttribute(FamilyTree.attr.control_add))
        return void this._lonelyButtonHandler();
      if (l.hasAttribute(FamilyTree.attr.control_up_id)) {
        s = l.getAttribute(FamilyTree.attr.control_up_id);
        return t.stopPropagation(), t.preventDefault(), void this._upHandler(s);
      }
      if (l.hasAttribute(FamilyTree.attr.c_link_from))
        return void FamilyTree.events.publish("clink-click", [
          this,
          {
            from: l.getAttribute(FamilyTree.attr.c_link_from),
            to: l.getAttribute(FamilyTree.attr.c_link_to),
            event: t,
          },
        ]);
      if (l.hasAttribute(FamilyTree.attr.s_link_from))
        return void FamilyTree.events.publish("slink-click", [
          this,
          {
            from: l.getAttribute(FamilyTree.attr.s_link_from),
            to: l.getAttribute(FamilyTree.attr.s_link_to),
            event: t,
          },
        ]);
      l = l.parentNode;
    }
  }),
  (FamilyTree.prototype._globalContextHandler = function (e, t) {
    for (var i = t.target; i != e; ) {
      if (i.hasAttribute(FamilyTree.attr.node_id)) {
        var r = i.getAttribute(FamilyTree.attr.node_id),
          a = this.getNode(r);
        return void this._nodeContextHandler(a.id, t);
      }
      i = i.parentNode;
    }
  }),
  (FamilyTree.prototype._nodeContextHandler = function (e, t) {
    t.preventDefault(),
      this.searchUI.hide(),
      this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.hide(),
      this.nodeCircleMenuUI.hide();
    var i = this.get(e),
      r = null;
    if (null != i && Array.isArray(i.tags))
      for (var a = 0; a < i.tags.length; a++) {
        var n = i.tags[a];
        this.config.tags[n] &&
          this.config.tags[n].nodeContextMenu &&
          (r = this.config.tags[n].nodeContextMenu);
      }
    this.nodeContextMenuUI.show(t.pageX, t.pageY, e, null, r);
  }),
  (FamilyTree.prototype._globalDbClickHandler = function (e, t) {
    for (var i = t.target; i != e; ) {
      if (i.hasAttribute(FamilyTree.attr.node_id)) {
        var r = i.getAttribute(FamilyTree.attr.node_id),
          a = this.getNode(r);
        return void this._nodeDbClickHandler(a.id, t);
      }
      i = i.parentNode;
    }
  }),
  (FamilyTree.prototype._mouseScrollHandler = function (e, t) {
    if (this.config.mouseScrool != FamilyTree.action.ctrlZoom || t.ctrlKey) {
      var i = this,
        r = !1,
        a = this.config.zoom.speed,
        n = this.config.zoom.smooth,
        o = 0,
        l = this.getScale(),
        s = FamilyTree._centerPointInPercent(i.getSvg(), t.pageX, t.pageY),
        d =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (e) {
            setTimeout(e, 20);
          };
      t.preventDefault();
      var c = t.delta || t.wheelDelta;
      void 0 === c && (c = -t.detail),
        (c = Math.max(-1, Math.min(1, c))),
        (o += -c * a),
        r ||
          (function e() {
            r = !0;
            var t = (o - l) / n;
            t > 0 ? t++ : t--,
              (l += t),
              i.zoom(1 - t / 12 / 50, s),
              parseInt(l) == parseInt(o) ? (r = !1) : d(e);
          })();
    }
  }),
  (FamilyTree.prototype._nodeCircleNodeMenuItemMouseDownHandler = function (
    e,
    t,
    i
  ) {
    var r = e.parentNode.getAttribute(
        FamilyTree.attr.control_node_circle_menu_wrraper_id
      ),
      a = e.getAttribute(FamilyTree.attr.control_node_circle_menu_name),
      n = this.nodeCircleMenuUI._menu[a];
    if (n.draggable) {
      var o = this,
        l = FamilyTree._getClientXY(t),
        s = this.getNode(r);
      e._dragEventFired = !1;
      var d = o.getScale(),
        c = null,
        m = null;
      (this._gragStartedId = r),
        (document.body.style.mozUserSelect =
          document.body.style.webkitUserSelect =
          document.body.style.userSelect =
            "none");
      var h = this.getSvg(),
        p = {
          x: l.x,
          y: l.y,
        },
        f = e.cloneNode(!0);
      h.insertBefore(f, h.firstChild);
      var y = FamilyTree._getTransform(f),
        u = y[4],
        g = y[5],
        b = (function (e) {
          for (
            ;
            e &&
            !e.hasAttribute(
              FamilyTree.attr.control_node_circle_menu_wrraper_id
            );

          )
            e = e.parentNode;
          if (e) {
            var t = FamilyTree._getTransform(e);
            return {
              x: t[4],
              y: t[5],
            };
          }
          console.error(
            "cannot find parent" +
              FamilyTree.attr.control_node_circle_menu_wrraper_id
          );
        })(e);
      f.setAttribute(
        "transform",
        "matrix(1,0,0,1," + (u + b.x) + "," + (g + b.y) + ")"
      ),
        (f.style.opacity = 0.7);
      var T = function (e, t) {
          if (null != e) {
            t.classList.remove("bft-drag-over");
            for (
              var i = FamilyTree.getStParentNodes(o.getNode(c)), r = 0;
              r < i.length;
              r++
            ) {
              var a = o.getNodeElement(i[r].id);
              a && (a.style.opacity = 1);
            }
          }
        },
        v = function (t) {
          if (p) {
            var i = FamilyTree._getClientXY(t),
              r = t.target;
            FamilyTree.isMobile() && (r = document.elementFromPoint(i.x, i.y)),
              (i.x += b.x * d),
              (i.y += b.y * d);
            var l = FamilyTree._getOffsetXY(o.element, t),
              s = {
                left: o.width() - (l.x + o.config.padding) < 0,
                right: l.x - o.config.padding < 0,
                down: o.height() - (l.y + o.config.padding) < 0,
                up: l.y - o.config.padding < 0,
              };
            if (s.left || s.right || s.up || s.down) {
              h.classList &&
                (h.classList.remove("bft-cursor-grab"),
                h.classList.add("bft-cursor-move"),
                h.classList.remove("bft-cursor-nodrop"),
                h.classList.remove("bft-cursor-copy"));
              var v = y[4],
                x = y[5],
                _ = p.x,
                w = p.y,
                k = i.x,
                S = i.y;
              o.startMove(s, function (e) {
                (y[4] = v + e.x),
                  (y[5] = x + e.y),
                  (p.x = _ - e.xWithoutScale),
                  (p.y = w - e.yWithoutScale),
                  (i.x = k - e.xWithoutScale),
                  (i.y = S - e.yWithoutScale),
                  f.setAttribute("transform", "matrix(" + y.toString() + ")");
              });
            } else {
              for (
                o.stopMove(),
                  h.classList &&
                    (h.classList.add("bft-cursor-grab"),
                    h.classList.remove("bft-cursor-move"),
                    h.classList.remove("bft-cursor-nodrop"),
                    h.classList.remove("bft-cursor-copy")),
                  T(c, m),
                  c = null,
                  m = null;
                null != r && r != h;

              ) {
                if (r.hasAttribute && r.hasAttribute(FamilyTree.attr.node_id)) {
                  var C = r.getAttribute(FamilyTree.attr.node_id);
                  (c = C), (m = r);
                  break;
                }
                r = r.parentNode;
              }
              if (null != c) {
                m.classList.add("bft-drag-over");
                for (
                  var N = o.getNode(c),
                    I = FamilyTree.getStParentNodes(N),
                    A = 0;
                  A < I.length;
                  A++
                ) {
                  var M = o.getNodeElement(I[A].id);
                  M && (M.style.opacity = 0.1);
                }
                h.classList.remove("bft-cursor-grab"),
                  h.classList.remove("bft-cursor-move"),
                  h.classList.add("bft-cursor-copy"),
                  h.classList.remove("bft-cursor-nodrop");
              }
              var L = (i.x - p.x) / d,
                E = (i.y - p.y) / d;
              if (
                ((y[4] = u + L),
                (y[5] = g + E),
                !e._dragEventFired &&
                  (Math.abs(i.x - p.x) >
                    FamilyTree.FIRE_DRAG_NOT_CLICK_IF_MOVE ||
                    Math.abs(i.y - p.y) >
                      FamilyTree.FIRE_DRAG_NOT_CLICK_IF_MOVE))
              )
                !1 ===
                  FamilyTree.events.publish("drag", [
                    o.nodeCircleMenuUI,
                    {
                      from: C,
                      menuItem: n,
                      menuItemName: a,
                    },
                  ]) && F(),
                  (e._dragEventFired = !0);
              f.setAttribute("transform", "matrix(" + y.toString() + ")");
            }
          }
        },
        F = function (t) {
          if (
            (o.stopMove(),
            h.classList &&
              (h.classList.remove("bft-cursor-grab"),
              h.classList.remove("bft-cursor-move"),
              h.classList.remove("bft-cursor-nodrop"),
              h.classList.remove("bft-cursor-copy")),
            h.removeEventListener(i.move, v),
            h.removeEventListener(i.up, F),
            i.leave && h.removeEventListener(i.leave, F),
            s.id == c || null == c)
          )
            return (
              h.removeChild(f),
              (o._gragStartedId = null),
              void (
                e._dragEventFired &&
                FamilyTree.events.publish("drop", [
                  o.nodeCircleMenuUI,
                  {
                    from: s.id,
                    menuItemName: a,
                    menuItem: n,
                  },
                ])
              )
            );
          var r = o.getNode(c);
          FamilyTree.events.publish("drop", [
            o.nodeCircleMenuUI,
            {
              from: s.id,
              to: r.id,
              menuItem: n,
              menuItemName: a,
            },
          ]),
            T(c, m),
            h.removeChild(f),
            (o._gragStartedId = null);
        };
      h.addEventListener(i.move, v),
        h.addEventListener(i.up, F),
        i.leave && h.addEventListener(i.leave, F);
    }
  }),
  (FamilyTree.prototype._nodeMouseDownHandler = function (e, t, i) {
    if (this.config.enableDragDrop) {
      var r = FamilyTree._getClientXY(t),
        a = e.getAttribute(FamilyTree.attr.node_id),
        n = this.getNode(a);
      e._dragEventFired = !1;
      var o = null,
        l = null;
      (this._gragStartedId = a),
        (document.body.style.mozUserSelect =
          document.body.style.webkitUserSelect =
          document.body.style.userSelect =
            "none");
      var s = this,
        d = this.getSvg(),
        c = {
          x: r.x,
          y: r.y,
        },
        m = FamilyTree._getTransform(e),
        h = m[4],
        p = m[5],
        f = s.getScale(),
        y = e.cloneNode(!0);
      d.insertBefore(y, d.firstChild), (y.style.opacity = 0.7);
      var u = function (e, t) {
          if (null != e) {
            t.classList.remove("bft-drag-over");
            for (
              var i = s.getNode(o), r = FamilyTree.getStParentNodes(i), a = 0;
              a < r.length;
              a++
            ) {
              var n = s.getNodeElement(r[a].id);
              n && (n.style.opacity = 1);
            }
          }
        },
        g = function (t) {
          if (c) {
            var i = FamilyTree._getClientXY(t),
              r = t.target;
            FamilyTree.isMobile() && (r = document.elementFromPoint(i.x, i.y));
            var a = FamilyTree._getOffsetXY(s.element, t),
              g = {
                left: s.width() - (a.x + s.config.padding) < 0,
                right: a.x - s.config.padding < 0,
                down: s.height() - (a.y + s.config.padding) < 0,
                up: a.y - s.config.padding < 0,
              };
            if (g.left || g.right || g.up || g.down) {
              d.classList &&
                (d.classList.remove("bft-cursor-grab"),
                d.classList.add("bft-cursor-move"),
                d.classList.remove("bft-cursor-nodrop"),
                d.classList.remove("bft-cursor-copy"));
              var T = m[4],
                v = m[5],
                F = c.x,
                x = c.y,
                _ = i.x,
                w = i.y;
              s.startMove(g, function (e) {
                (m[4] = T + e.x),
                  (m[5] = v + e.y),
                  (c.x = F - e.xWithoutScale),
                  (c.y = x - e.yWithoutScale),
                  (i.x = _ - e.xWithoutScale),
                  (i.y = w - e.yWithoutScale),
                  y.setAttribute("transform", "matrix(" + m.toString() + ")");
              });
            } else {
              if (
                (s.stopMove(),
                d.classList &&
                  (d.classList.add("bft-cursor-grab"),
                  d.classList.remove("bft-cursor-move"),
                  d.classList.remove("bft-cursor-nodrop"),
                  d.classList.remove("bft-cursor-copy")),
                u(o, l),
                (o = null),
                (l = null),
                s.config.enableDragDrop)
              )
                for (; null != r && r != d; ) {
                  if (
                    r.hasAttribute &&
                    r.hasAttribute(FamilyTree.attr.node_id)
                  ) {
                    var k = r.getAttribute(FamilyTree.attr.node_id);
                    if (s._gragStartedId && k != s._gragStartedId) {
                      (o = k), (l = r);
                      break;
                    }
                  }
                  r = r.parentNode;
                }
              if (null != o) {
                l.classList.add("bft-drag-over");
                for (
                  var S = s.getNode(o),
                    C = FamilyTree.getStParentNodes(S),
                    N = 0;
                  N < C.length;
                  N++
                ) {
                  var I = s.getNodeElement(C[N].id);
                  I && (I.style.opacity = 0.1);
                }
                !s._canUpdateLink(n.id, o) && d.classList
                  ? (d.classList.remove("bft-cursor-grab"),
                    d.classList.remove("bft-cursor-move"),
                    d.classList.remove("bft-cursor-copy"),
                    d.classList.add("bft-cursor-nodrop"))
                  : d.classList &&
                    (d.classList.remove("bft-cursor-grab"),
                    d.classList.remove("bft-cursor-move"),
                    d.classList.add("bft-cursor-copy"),
                    d.classList.remove("bft-cursor-nodrop"));
              }
              var A = (i.x - c.x) / f,
                M = (i.y - c.y) / f;
              if (
                ((m[4] = h + A),
                (m[5] = p + M),
                !e._dragEventFired &&
                  (Math.abs(i.x - c.x) >
                    FamilyTree.FIRE_DRAG_NOT_CLICK_IF_MOVE ||
                    Math.abs(i.y - c.y) >
                      FamilyTree.FIRE_DRAG_NOT_CLICK_IF_MOVE))
              )
                !1 === FamilyTree.events.publish("drag", [s, k]) && b(),
                  (e._dragEventFired = !0);
              y.setAttribute("transform", "matrix(" + m.toString() + ")");
            }
          }
        },
        b = function (t) {
          if (
            (s.stopMove(),
            d.classList &&
              (d.classList.remove("bft-cursor-grab"),
              d.classList.remove("bft-cursor-move"),
              d.classList.remove("bft-cursor-nodrop"),
              d.classList.remove("bft-cursor-copy")),
            d.removeEventListener(i.move, g),
            d.removeEventListener(i.up, b),
            i.leave && d.removeEventListener(i.leave, b),
            n.id == o || null == o)
          )
            return (
              d.removeChild(y),
              (s._gragStartedId = null),
              void (
                e._dragEventFired &&
                FamilyTree.events.publish("drop", [s, n.id])
              )
            );
          var r = s.getNode(o);
          if (!1 === FamilyTree.events.publish("drop", [s, n.id, r.id]))
            return u(o, l), d.removeChild(y), void (s._gragStartedId = null);
          if (s._canUpdateLink(n.id, o)) {
            var a = s.get(n.id);
            (a.pid = o), (a.stpid = null), s.updateNode(a, null, !0);
          } else d.removeChild(y), u(o, l);
          s._gragStartedId = null;
        };
      d.addEventListener(i.move, g),
        d.addEventListener(i.up, b),
        i.leave && d.addEventListener(i.leave, b);
    }
  }),
  (FamilyTree.prototype._resizeHandler = function (e, t) {
    var i = this.getViewBox(),
      r = this.getSvg(),
      a = r.getAttribute("width"),
      n = r.getAttribute("height"),
      o = a / i[2],
      l = n / i[3],
      s = o > l ? l : o;
    r.setAttribute("width", this.width()),
      r.setAttribute("height", this.height()),
      (i[2] = this.width() / s),
      (i[3] = this.height() / s),
      this.setViewBox(i),
      this.xScrollUI.create(this.width()),
      this.yScrollUI.create(this.height()),
      this._draw(!1, FamilyTree.action.resize);
  }),
  (FamilyTree.prototype._nodeDbClickHandler = function (e, t) {
    if (!1 === FamilyTree.events.publish("dbclick", [this, this.get(e)]))
      return !1;
    this._commonClickHandler(e, t, this.config.nodeMouseDbClick);
  }),
  (FamilyTree.prototype._nodeClickHandler = function (e, t) {
    var i = this.getNodeElement(e);
    if (i && i._dragEventFired) i._dragEventFired = !1;
    else {
      if (
        !1 ===
        FamilyTree.events.publish("click", [
          this,
          {
            node: this.getNode(e),
            event: t,
          },
        ])
      )
        return !1;
      this._commonClickHandler(e, t, this.config.nodeMouseClick);
    }
  }),
  (FamilyTree.prototype._nodeCircleMenuItemClickHandler = function (e, t) {
    var i = e.parentNode.getAttribute(
        FamilyTree.attr.control_node_circle_menu_wrraper_id
      ),
      r = e.getAttribute(FamilyTree.attr.control_node_circle_menu_name),
      a = this.nodeCircleMenuUI._menu[r];
    FamilyTree.events.publish("click", [
      this.nodeCircleMenuUI,
      {
        nodeId: i,
        menuItemName: r,
        menuItem: a,
        event: t,
      },
    ]);
  }),
  (FamilyTree.prototype._nodeCircleMenuClickHandler = function (e) {
    this.searchUI.hide(),
      this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.hide();
    var t = this.getNode(e),
      i = null;
    if (Array.isArray(t.tags))
      for (var r = 0; r < t.tags.length; r++) {
        var a = t.tags[r];
        this.config.tags[a] &&
          this.config.tags[a].nodeCircleMenu &&
          (i = this.config.tags[a].nodeCircleMenu);
      }
    this.nodeCircleMenuUI.show(e, i);
  }),
  (FamilyTree.prototype._commonClickHandler = function (e, t, i) {
    var r;
    (this.searchUI.hide(),
    this.nodeMenuUI.hide(),
    this.nodeContextMenuUI.hide(),
    this.menuUI.hide(),
    this.nodeCircleMenuUI.hide(),
    i == FamilyTree.action.expandCollapse && this.toggleExpandCollapse(e, t),
    i == FamilyTree.action.edit) &&
      (r = this.getNode(e)) &&
      (this.editUI.show(r.id), this.ripple(r.id, t.clientX, t.clientY));
    i == FamilyTree.action.details &&
      (r = this.getNode(e)) &&
      (this.editUI.show(r.id, !0), this.ripple(r.id, t.clientX, t.clientY));
  }),
  (FamilyTree.prototype._menuHandlerMouseDownHandler = function (e, t) {
    t.stopPropagation(), t.preventDefault();
  }),
  (FamilyTree.prototype._nodeMenuClickHandler = function (e, t, i) {
    this.searchUI.hide(),
      this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.hide(),
      this.nodeCircleMenuUI.hide();
    var r = this.getNode(e),
      a = null;
    if (Array.isArray(r.tags))
      for (var n = 0; n < r.tags.length; n++) {
        var o = r.tags[n];
        this.config.tags[o] &&
          this.config.tags[o].nodeMenu &&
          (a = this.config.tags[o].nodeMenu);
      }
    this.nodeMenuUI.showStickIn(t, e, null, a);
  }),
  (FamilyTree.prototype._menuClickHandler = function (e, t) {
    t.stopPropagation(),
      t.preventDefault(),
      this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.show(e.offsetLeft, e.offsetTop);
  }),
  (FamilyTree.prototype._lonelyButtonHandler = function () {
    var e = {
      id: this.generateId(),
    };
    !1 !== this.addNode(e, null, !0) && this.center(e.id);
  }),
  (FamilyTree.prototype.toggleExpandCollapse = function (e, t) {
    var i = this.getNode(e),
      r = this.getCollapsedIds(i);
    if (r.length) {
      if (!1 === FamilyTree.events.publish("expcollclick", [this, !1, e, r]))
        return !1;
      this.expand(e, r, !1);
    } else {
      if (
        !1 ===
        FamilyTree.events.publish("expcollclick", [this, !0, e, i.childrenIds])
      )
        return !1;
      this.collapse(e, i.childrenIds, !1);
    }
    t && this.ripple(i.id, t.clientX, t.clientY);
  }),
  (FamilyTree.prototype._move = function (e, t, i) {
    (i[0] = t),
      (i[1] = e),
      this.setViewBox(i),
      this.xScrollUI.setPosition(),
      this.yScrollUI.setPosition();
  }),
  (FamilyTree.prototype.startMove = function (e, t) {
    if (e) {
      if (((this._movePosition = e), !this._moveInterval)) {
        var i = this,
          r = this.getViewBox().slice(0),
          a = this.getScale(),
          n = 0,
          o = 0;
        this._moveInterval = setInterval(function () {
          var e = {
            x: 0,
            y: 0,
            xWithoutScale: 0,
            yWithoutScale: 0,
          };
          i._movePosition.left &&
            (n++,
            (e.x = (n * FamilyTree.MOVE_STEP) / a),
            (e.xWithoutScale = n * FamilyTree.MOVE_STEP)),
            i._movePosition.right &&
              (n++,
              (e.x = (-n * FamilyTree.MOVE_STEP) / a),
              (e.xWithoutScale = -n * FamilyTree.MOVE_STEP)),
            i._movePosition.up &&
              (o++,
              (e.y = (-o * FamilyTree.MOVE_STEP) / a),
              (e.yWithoutScale = -o * FamilyTree.MOVE_STEP)),
            i._movePosition.down &&
              (o++,
              (e.y = (o * FamilyTree.MOVE_STEP) / a),
              (e.yWithoutScale = o * FamilyTree.MOVE_STEP)),
            i.setViewBox([r[0] + e.x, r[1] + e.y, r[2], r[3]]),
            i.xScrollUI.setPosition(),
            i.yScrollUI.setPosition(),
            t && t(e);
        }, FamilyTree.MOVE_INTERVAL);
      }
    } else console.error("movePosition parameter not defined");
  }),
  (FamilyTree.prototype.stopMove = function () {
    this._moveInterval &&
      (clearInterval(this._moveInterval),
      (this._moveInterval = null),
      (this._movePosition = null));
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.node = function (e, t, i, r) {
    (this.templateName = r),
      (this.id = e),
      (this.pid = t),
      (this.children = []),
      (this.childrenIds = []),
      (this.parent = null),
      (this.stpid = null),
      (this.stParent = null),
      (this.stChildren = []),
      (this.stChildrenIds = []),
      (this.tags = i),
      this.tags || (this.tags = []);
  }),
  (FamilyTree.prototype._mouseDownHandler = function (e, t, i) {
    var r = this;
    this.editUI.hide(),
      this.searchUI.hide(),
      this.nodeMenuUI.hide(),
      this.nodeContextMenuUI.hide(),
      this.menuUI.hide(),
      this.nodeCircleMenuUI.hide();
    var a = this.getViewBox(),
      n = this.getScale(),
      o = FamilyTree._getClientTouchesXY(t, 0),
      l = FamilyTree._getClientTouchesXY(t, 1),
      s = {
        diffX: 0,
        diffY: 0,
        x0: o.x,
        y0: o.y,
        type: "pan",
        viewBoxLeft: a[0],
        viewBoxTop: a[1],
      };
    t.touches &&
      t.touches.length > 1 &&
      ((s.type = "pinch"),
      (s.dist = Math.sqrt(
        (o.x - l.x) * (o.x - l.x) + (o.y - l.y) * (o.y - l.y)
      )));
    var d = this.getPointerElement();
    if ("pan" == s.type) {
      this._hideBeforeAnimation();
      var c = FamilyTree._getOffsetXY(this.element, t),
        m = c.x / n + a[0] - 16 / n,
        h = c.y / n + a[1] - 16 / n;
      (d.style.display = "inherit"),
        d.setAttribute("transform", "matrix(0,0,0,0," + m + "," + h + ")"),
        FamilyTree.anim(
          d,
          {
            transform: [0, 0, 0, 0, m, h],
            opacity: 0,
          },
          {
            transform: [1 / n, 0, 0, 1 / n, m, h],
            opacity: 1,
          },
          300,
          FamilyTree.anim.outBack
        );
    }
    var p = function (e) {
        var t = FamilyTree._getClientTouchesXY(e, 0);
        if (s && "pan" == s.type) {
          r._hideBeforeAnimation(),
            (s.diffX = t.x - s.x0),
            (s.diffY = t.y - s.y0);
          var i = -s.diffY / n + s.viewBoxTop,
            o = -s.diffX / n + s.viewBoxLeft;
          r._move(i, o, a);
        } else if (s && "pinch" == s.type) {
          var l = FamilyTree._getClientTouchesXY(e, 1),
            d = Math.sqrt(
              (t.x - l.x) * (t.x - l.x) + (t.y - l.y) * (t.y - l.y)
            ),
            c = 1 + (d - s.dist) / (s.dist / 100) / 100;
          s.dist = d;
          var m = FamilyTree._pinchMiddlePointInPercent(
            r.element,
            r.width(),
            r.height(),
            e
          );
          r.zoom(c, m);
        }
      },
      f = function () {
        "pan" == s.type && r.config.sticky
          ? setTimeout(function () {
              FamilyTree._moveToBoundaryArea(
                e,
                r.getViewBox(),
                r.response.boundary,
                function () {
                  r._draw(!0, FamilyTree.action.pan);
                }
              );
            }, 0)
          : "pan" != s.type ||
            r.config.sticky ||
            r._draw(!0, FamilyTree.action.pan),
          (s = null),
          (d.style.display = "none"),
          e.removeEventListener(i.move, p),
          e.removeEventListener(i.up, f),
          i.leave && e.removeEventListener(i.leave, f),
          i.touchstart && e.removeEventListener(i.touchstart, f);
      };
    e.addEventListener(i.move, p),
      e.addEventListener(i.up, f),
      i.leave && e.addEventListener(i.leave, f),
      i.touchstart && e.addEventListener(i.touchstart, f);
  }),
  (FamilyTree.searchUI = function () {}),
  (FamilyTree.searchUI.prototype.init = function (e) {
    this.obj = e;
    var t = this,
      i = document.createElement("div");
    i.classList.add("bft-search"),
      (i.style.right = this.obj.config.padding - 10 + "px"),
      (i.style.top = this.obj.config.padding - 10 + "px");
    var r = FamilyTree.elements.textbox(
      {},
      {
        label: FamilyTree.SEARCH_PLACEHOLDER,
      },
      "320px"
    );
    (i.innerHTML += r.html),
      (this.searchTableWrapper = document.createElement("div")),
      i.appendChild(this.searchTableWrapper);
    var a = e.getSvg().nextSibling;
    this.obj.element.insertBefore(i, a),
      FamilyTree.input.init(i),
      (this.input = document.getElementById(r.id)),
      this.input.addEventListener("keypress", function (e) {
        "Enter" == e.key && e.preventDefault();
      }),
      this.input.addEventListener("keyup", function (e) {
        "ArrowDown" == e.key
          ? (e.preventDefault(), n())
          : "ArrowUp" == e.key
          ? (e.preventDefault(), e.stopPropagation(), o())
          : "Enter" == e.key
          ? (e.preventDefault(), l())
          : "Escape" == e.key
          ? (e.preventDefault(), t.hide())
          : t._serverSearch(this.value);
      });
    var n = function () {
        var e = t.obj.element.querySelectorAll("[data-search-item-id]"),
          i = t.obj.element.querySelector('[data-selected="yes"]');
        null == i && e.length > 0
          ? e[0].setAttribute("data-selected", "yes")
          : e.length > 0 &&
            i.nextSibling &&
            i.nextSibling.setAttribute &&
            (i.removeAttribute("data-selected"),
            i.nextSibling.setAttribute("data-selected", "yes"));
      },
      o = function () {
        var e = t.obj.element.querySelectorAll("[data-search-item-id]"),
          i = t.obj.element.querySelector('[data-selected="yes"]');
        null == i && e.length > 0
          ? e[e.length - 1].setAttribute("data-selected", "yes")
          : e.length > 0 &&
            i.previousSibling &&
            i.previousSibling.setAttribute &&
            (i.removeAttribute("data-selected"),
            i.previousSibling.setAttribute("data-selected", "yes"));
      },
      l = function () {
        var e = t.obj.element.querySelector('[data-selected="yes"]');
        if (e) {
          var i = e.getAttribute("data-search-item-id");
          0 != FamilyTree.events.publish("searchclick", [t.obj, i]) &&
            t.obj.center(i);
        }
      };
  }),
  (FamilyTree.searchUI.prototype.hide = function () {
    this.searchTableWrapper && (this.searchTableWrapper.innerHTML = ""),
      this.input &&
        ((this.input.value = ""), this.input.focus(), this.input.blur());
  }),
  (FamilyTree.searchUI.prototype.find = function (e) {
    this.input &&
      ((this.input.value = e), this._serverSearch(e), this.input.focus());
  }),
  (FamilyTree.searchUI.prototype._serverSearch = function (e) {
    var t = this,
      i = FamilyTree._search.search(
        this.obj.config.nodes,
        e,
        this.obj.config.searchFields,
        this.obj.config.searchFields,
        this.obj.config.searchDisplayField,
        this.obj.config.searchFieldsWeight
      ),
      r = FamilyTree._getFistImgField(this.obj.config),
      a = `<table border="0" cellspacing="0" cellpadding="0">\n                    <tbody>\n                        ${(function () {
        for (
          var e = "", a = 0;
          a < i.length && !(a >= FamilyTree.SEARCH_RESULT_LIMIT);
          a++
        ) {
          var n = i[a],
            o = "";
          if (r) {
            var l = t.obj._get(n.id);
            "function" == typeof r
              ? (o = r(t.obj, t.obj.getNode(n.id), l))
              : l[r] && (o = l[r]);
          }
          var s = "",
            d = "";
          t.obj.config.searchDisplayField == n.__searchField
            ? (s = n.__searchMarks)
            : t.obj.config.searchDisplayField
            ? ((s = n[t.obj.config.searchDisplayField]),
              FamilyTree.isNEU(s) && (s = ""),
              (d = n.__searchMarks))
            : (s = n.__searchMarks),
            (e += FamilyTree.searchUI.createItem(o, n.id, s, d));
        }
        return e;
      })()}  \n                    </tbody>\n                </table>`;
    this.searchTableWrapper.innerHTML = a;
    for (
      var n = this.obj.element.querySelectorAll("[data-search-item-id]"), o = 0;
      o < n.length;
      o++
    )
      n[o].addEventListener("click", function () {
        if (
          !1 !==
          FamilyTree.events.publish("searchclick", [
            t.obj,
            this.getAttribute("data-search-item-id"),
          ])
        ) {
          t.obj.center(this.getAttribute("data-search-item-id"));
          var e = t.obj.element.querySelector('[data-selected="yes"]');
          e && e.removeAttribute("data-selected"),
            this.setAttribute("data-selected", "yes"),
            t.input.focus();
        }
      });
  }),
  (FamilyTree.searchUI.createItem = function (e, t, i, r) {
    return (
      i && (i = "<b>" + i + "</b>"),
      `<tr data-search-item-id="${t}">\n                <td class="bft-search-image-td">\n                    ${(e =
        e
          ? `<div class="bft-search-photo" style="background-image: url(${e})"></div>`
          : `<div class="bft-search-photo">${FamilyTree.icon.user(
              32,
              32,
              "#aeaeae"
            )}</div>`)}\n                </td>\n                <td class="bft-search-text-td">${i} <br/>${r}</td>\n            </tr>`
    );
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.manager = function (e, t) {
    (this.config = e),
      (this.layoutConfigs = t),
      (this.visibleNodeIds = []),
      (this.viewBox = null),
      (this.action = null),
      (this.actionParams = null),
      (this.nodes = {}),
      (this.oldNodes = {}),
      (this.maxX = null),
      (this.maxY = null),
      (this.minX = null),
      (this.minY = null),
      (this.bordersByRootIdAndLevel = null),
      (this.roots = null),
      (this.state = null),
      (this.vbIsInitializedFromState = !1),
      (this.rootList = []);
  }),
  (FamilyTree.manager.prototype.read = function (e, t, i, r, a, n, o, l) {
    var s = this;
    FamilyTree.state._get(this.config.state, t, i, function (d) {
      (s.state = d),
        (s.action = a),
        (s.actionParams = n),
        a != FamilyTree.action.init ||
        !s.state ||
        (n && n.method && "fit" == n.method)
          ? ((s.viewBox = r), (s.vbIsInitializedFromState = !1))
          : ((s.viewBox = s.state.vb), (s.vbIsInitializedFromState = !0));
      var c = s.maxX,
        m = s.maxY,
        h = s.minX,
        p = s.minY,
        f = s.bordersByRootIdAndLevel,
        y = s.roots,
        u = s.nodes;
      if (e) {
        var g = FamilyTree.manager._getResponse(
          t,
          i,
          s.visibleNodeIds,
          s.config,
          c,
          m,
          h,
          p,
          s.viewBox,
          y,
          s.action,
          s.actionParams,
          u,
          s.oldNodes,
          s.vbIsInitializedFromState
        );
        a != FamilyTree.action.exporting &&
          ((s.maxX = c),
          (s.maxY = m),
          (s.minX = h),
          (s.minY = p),
          (s.roots = y),
          (s.nodes = u),
          (s.visibleNodeIds = g.visibleNodeIds)),
          (g.bordersByRootIdAndLevel = f),
          (g.roots = y),
          (g.adjustify = {
            x: 0,
            y: 0,
          }),
          s.state && (g.adjustify = s.state.adjustify),
          o(g);
      } else
        (s.oldNodes = u || null),
          s._read(function (e) {
            (c = e.maxX),
              (m = e.maxY),
              (h = e.minX),
              (p = e.minY),
              (f = e.bordersByRootIdAndLevel),
              (y = e.roots),
              (u = e.nodes);
            var r = FamilyTree.manager._getResponse(
              t,
              i,
              s.visibleNodeIds,
              s.config,
              c,
              m,
              h,
              p,
              s.viewBox,
              y,
              s.action,
              s.actionParams,
              u,
              s.oldNodes,
              s.vbIsInitializedFromState
            );
            (r.notif = e.limit),
              (r.roots = y),
              (r.bordersByRootIdAndLevel = f),
              (r.adjustify = e.adjustify),
              a != FamilyTree.action.exporting &&
                ((s.maxX = c),
                (s.maxY = m),
                (s.minX = h),
                (s.minY = p),
                (s.roots = y),
                (s.nodes = u),
                (s.visibleNodeIds = r.visibleNodeIds),
                (s.bordersByRootIdAndLevel = f),
                (s.rootList = e.rootList)),
              o(r);
          }, l);
    });
  }),
  (FamilyTree.manager.prototype._read = function (e, t) {
    var i = this,
      r = FamilyTree.manager._createNodes(
        i.config,
        i.layoutConfigs,
        i.action,
        i.actionParams,
        i.oldNodes,
        i.state
      );
    t(r);
    var a = r.nodes,
      n = r.roots,
      o = FamilyTree.remote;
    null == o && (o = FamilyTree.local),
      o._setPositions(
        n,
        i.layoutConfigs,
        function (t) {
          var o = FamilyTree.manager._doNotChangePositionOfClickedNodeIfAny(
            n,
            a,
            i.action,
            i.actionParams,
            i.oldNodes,
            i.config.orientation
          );
          i.state &&
            i.action == FamilyTree.action.init &&
            (o = i.state.adjustify);
          for (
            var l = {
                minX: null,
                minY: null,
                maxX: null,
                maxY: null,
              },
              s = {},
              d = 0;
            d < n.length;
            d++
          )
            FamilyTree.manager._setMinMaxXYAdjustifyIterate(
              n[d],
              n[d],
              l,
              0,
              s,
              o,
              i.config.orientation
            );
          e({
            minX: l.minX,
            minY: l.minY,
            maxX: l.maxX,
            maxY: l.maxY,
            bordersByRootIdAndLevel: s,
            nodes: a,
            roots: n,
            rootList: r.rootList,
            limit: t,
            adjustify: o,
          });
        },
        a
      );
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.manager._initDinamicNode = function (e, t, i) {
    t && (e.lcn = t), i && (e.isAssistant = !0);
    var r = FamilyTree.t(e.templateName);
    (e.w = r && r.size ? r.size[0] : 0),
      (e.h = r && r.size ? r.size[1] : 0),
      (e.isSplit = "split" == e.templateName);
  }),
  (FamilyTree.manager._setCollpasedProperty = function (e, t, i, r, a, n, o) {
    null == e.collapsed && t.collapse && t.collapse.allChildren
      ? (e.collapsed = !0)
      : null == e.collapsed && (e.collapsed = !1),
      a == FamilyTree.action.expand &&
        -1 != i.ids.indexOf(e.id) &&
        (e.collapsed = !1),
      a == FamilyTree.action.collapse && (i.expandIds || i.collapseIds)
        ? i.expandIds && -1 != i.expandIds.indexOf(e.id)
          ? (e.collapsed = !1)
          : i.collapseIds &&
            -1 != i.collapseIds.indexOf(e.id) &&
            (e.collapsed = !0)
        : a == FamilyTree.action.collapse &&
          -1 != i.ids.indexOf(e.id) &&
          (e.collapsed = !0),
      a == FamilyTree.action.expand && "all" == i.ids && (e.collapsed = !1),
      a == FamilyTree.action.exporting &&
        i.expandChildren &&
        (e.collapsed = !1),
      a == FamilyTree.action.init && null != o
        ? (e.collapsed = !o.exp.has(e.id))
        : a == FamilyTree.action.init
        ? (e.collapsed =
            t.collapse && n >= t.collapse.level - 1 && -1 == r.indexOf(e.id))
        : (a != FamilyTree.action.centerNode &&
            a != FamilyTree.action.insert &&
            a != FamilyTree.action.expand &&
            a != FamilyTree.action.collapse) ||
          (r.has(e.id) && (e.collapsed = !1));
  }),
  (FamilyTree.manager._initNode = function (e, t, i, r, a, n, o, l, s, d, c) {
    var m = n[i || "base"];
    null == e.parent &&
      FamilyTree.manager._setCollpasedProperty(e, m, s, l, a, r - 1, c);
    for (var h = 0; h < e.childrenIds.length; h++) {
      var p = t[e.childrenIds[h]];
      if (
        (FamilyTree.manager._setCollpasedProperty(p, m, s, l, a, r, c),
        !p.collapsed)
      ) {
        if (((p.parent = e), null != p.ppid)) {
          var f = t[p.ppid];
          f && (p.parentPartner = f);
        }
        (-1 != p.tags.indexOf("left-partner") ||
          -1 != p.tags.indexOf("right-partner") ||
          -1 != p.tags.indexOf("partner") ||
          p.parentPartner) &&
          -1 == d.indexOf(e.id) &&
          d.push(e.id),
          e.children.push(p);
      }
    }
    if (
      (e.min ||
        a != FamilyTree.action.minimize ||
        ((s.all || s.id == e.id) && (e.min = !0)),
      !0 === e.min &&
        a == FamilyTree.action.maximize &&
        (s.all || s.id == e.id) &&
        (e.min = !1),
      a == FamilyTree.action.init && null != c && (e.min = c.min.has(e.id)),
      !e.min)
    )
      for (h = 0; h < e.stChildrenIds.length; h++) {
        ((p = t[e.stChildrenIds[h]]).stParent = e), e.stChildren.push(p);
      }
    var y = FamilyTree.t(e.templateName, e.min);
    (e.w = y && y.size ? y.size[0] : 0),
      (e.h = y && y.size ? y.size[1] : 0),
      (e.padding = y && y.padding ? y.padding : [0, 0, 0, 0]),
      null != r && (e.level = r),
      i && (e.lcn = i);
    var u = FamilyTree._getSubLevels(e.tags, o.tags);
    u > 0 && (e.subLevels = u),
      -1 != e.tags.indexOf("assistant") &&
        null != e.parent &&
        (e.isAssistant = !0),
      FamilyTree.events.publish("node-created", [e]);
  }),
  (FamilyTree.manager._iterate = function (
    e,
    t,
    i,
    r,
    a,
    n,
    o,
    l,
    s,
    d,
    c,
    m,
    h,
    p,
    f,
    y
  ) {
    if (
      (FamilyTree.manager._initNode(t, i, s, r, m, d, c, h, p, f, y),
      t.isAssistant && (n[t.pid] || (n[t.pid] = []), n[t.pid].push(t.id)),
      t.subLevels > 0 && o.push(t.id),
      FamilyTree.MIXED_LAYOUT_FOR_NODES_WITH_COLLAPSED_CHILDREN &&
        !t.isAssistant &&
        t.parent)
    ) {
      if (
        t.parent &&
        t.parent.children.length &&
        t.parent.children[t.parent.children.length - 1] == t
      ) {
        for (
          var u = [], g = 0, b = 0, T = 0;
          T < t.parent.children.length;
          T++
        ) {
          -1 == (v = t.parent.children[T]).tags.indexOf("partner") &&
          -1 == v.tags.indexOf("left-partner") &&
          -1 == v.tags.indexOf("right-partner") &&
          -1 == v.tags.indexOf("assistant") &&
          0 == v.children.length
            ? u.push(v.id)
            : -1 != v.tags.indexOf("assistant")
            ? g++
            : (-1 == v.tags.indexOf("partner") &&
                -1 == v.tags.indexOf("left-partner") &&
                -1 == v.tags.indexOf("right-partner")) ||
              b++;
        }
        ((FamilyTree.MIXED_LAYOUT_ALL_NODES &&
          u.length > 1 &&
          u.length == t.parent.children.length - g - b) ||
          (!FamilyTree.MIXED_LAYOUT_ALL_NODES && u.length > 1)) &&
          (l[t.pid] = u);
      }
    } else if (
      !t.isAssistant &&
      0 == t.childrenIds.length &&
      t.parent &&
      !l[t.pid]
    ) {
      for (u = [], g = 0, b = 0, T = 0; T < t.parent.children.length; T++) {
        var v;
        -1 == (v = t.parent.children[T]).tags.indexOf("partner") &&
        -1 == v.tags.indexOf("left-partner") &&
        -1 == v.tags.indexOf("right-partner") &&
        -1 == v.tags.indexOf("assistant") &&
        0 == v.childrenIds.length
          ? u.push(v.id)
          : -1 != v.tags.indexOf("assistant")
          ? g++
          : (-1 == v.tags.indexOf("partner") &&
              -1 == v.tags.indexOf("left-partner") &&
              -1 == v.tags.indexOf("right-partner")) ||
            b++;
      }
      ((FamilyTree.MIXED_LAYOUT_ALL_NODES &&
        u.length > 1 &&
        u.length == t.parent.childrenIds.length - g - b) ||
        (!FamilyTree.MIXED_LAYOUT_ALL_NODES && u.length > 1)) &&
        (l[t.pid] = u);
    }
    t.stChildren.length &&
      (e.stContainerNodes || (e.stContainerNodes = []),
      e.stContainerNodes.push(t));
    for (var F = 0; F < t.stChildren.length; F++) {
      var x = "";
      for (T = 0; T < t.tags.length; T++)
        if (d[t.tags[T]]) {
          x = t.tags[T];
          break;
        }
      a.push(t.stChildren[F].id),
        FamilyTree.manager._iterate(
          e,
          t.stChildren[F],
          i,
          0,
          a,
          n,
          o,
          l,
          x,
          d,
          c,
          m,
          h,
          p,
          f,
          y
        );
    }
    r++;
    for (F = 0; F < t.children.length; F++)
      FamilyTree.manager._iterate(
        e,
        t.children[F],
        i,
        r,
        a,
        n,
        o,
        l,
        s,
        d,
        c,
        m,
        h,
        p,
        f,
        y
      );
  }),
  (FamilyTree.manager.__createNodes = function (e, t, i, r, a, n, o) {
    for (var l = i.nodes, s = [], d = 0; d < l.length; d++) {
      var c,
        m = l[d];
      c = FamilyTree.STRING_TAGS
        ? m.tags
          ? m.tags.split(",")
          : []
        : Array.isArray(m.tags)
        ? m.tags.slice(0)
        : [];
      var h = FamilyTree._getTemplate(c, i.tags, i.template),
        p = new FamilyTree.node(m.id, m.pid, c, h);
      FamilyTree.isNEU(m.ppid) || (p.ppid = m.ppid),
        FamilyTree.isNEU(m.stpid) || (p.stpid = m.stpid),
        null != i.orderBy &&
          (p.order = FamilyTree.manager._getOrderFieldValue(m, i.orderBy)),
        (e[m.id] = p),
        s.push(m.id);
    }
    null != i.orderBy &&
      s.sort(function (t, r) {
        var a = e[t].order,
          n = e[r].order;
        return "number" == typeof a || "number" == typeof n
          ? (null == a && (a = -1),
            null == n && (n = -1),
            i.orderBy.desc ? n - a : a - n)
          : "string" == typeof a || "string" == typeof n
          ? (null == a && (a = ""),
            null == n && (n = ""),
            i.orderBy.desc ? n.localeCompare(a) : a.localeCompare(n))
          : void 0;
      });
    for (d = 0; d < s.length; d++) {
      var f = s[d],
        y = ((p = e[f]), n ? n[f] : null),
        u = e[p.stpid],
        g = e[p.pid];
      if ((u || (p.stpid = null), g || (p.pid = null), u)) {
        var b = n ? n[u.id] : null;
        b && (u.min = b.min), u.stChildrenIds.push(p.id);
      } else
        g
          ? (y && ((p.collapsed = y.collapsed), (p.min = y.min)),
            g.childrenIds.push(p.id))
          : (y && ((p.collapsed = y.collapsed), (p.min = y.min)),
            t.push(p),
            o.push(p.id));
      r == FamilyTree.action.init && (p.min = FamilyTree._getMin(p, i));
    }
  }),
  (FamilyTree.manager._createNodes = function (e, t, i, r, a, n) {
    var o = {},
      l = [],
      s = [];
    if (
      (FamilyTree.manager.__createNodes(o, l, e, i, r, a, s), null != e.roots)
    ) {
      l = [];
      for (var d = 0; d < e.roots.length; d++) {
        var c = o[e.roots[d]];
        if (c && i == FamilyTree.action.centerNode) {
          for (var m = c; null != m.pid || null != m.stpid; )
            m = null == m.pid && null != m.stpid ? o[m.stpid] : o[m.pid];
          for (var h = o[r.id]; null != h.pid || null != h.stpid; )
            h = null == h.pid && null != h.stpid ? o[h.stpid] : o[h.pid];
          m == h && (c = m);
        }
        if (c) {
          for (var p = !1, f = 0; f < l.length; f++)
            if (l[f].id == c.id) {
              p = !0;
              break;
            }
          if (!p) {
            if (!FamilyTree.isNEU(c.pid))
              (O = (b = o[c.pid]).childrenIds.indexOf(c.id)) > -1 &&
                b.childrenIds.splice(O, 1);
            l.push(c);
          }
        }
      }
      e.roots = [];
      for (d = 0; d < l.length; d++) e.roots.push(l[d].id);
    }
    i == FamilyTree.action.exporting &&
      null != r.id &&
      (u = o[r.id]) &&
      ((u.pid = null), (l = [u]));
    var y = [];
    if (i == FamilyTree.action.init && e.expand && e.expand.nodes && null == n)
      for (d = 0; d < e.expand.nodes.length; d++) {
        var u = o[e.expand.nodes[d]];
        for (
          !0 === e.expand.allChildren &&
          FamilyTree.manager._addExpandedNodeIdsIterate(u, o, y);
          u;

        )
          y.push(u.id),
            null == u.pid && null != u.stpid
              ? ((u = o[u.stpid]).min = !1)
              : (u = o[u.pid]);
      }
    else if (
      (i == FamilyTree.action.expand && r.ids && "all" != r.ids) ||
      (i == FamilyTree.action.collapse && r && r.expandIds)
    ) {
      var g;
      g = i == FamilyTree.action.expand ? r.ids : r.expandIds;
      for (d = 0; d < g.length; d++)
        for (var b = o[(u = o[g[d]]).pid]; b; )
          y.push(b.id),
            null == b.pid && null != b.stpid
              ? ((b = o[b.stpid]).min = !1)
              : (b = o[b.pid]);
    } else if (i == FamilyTree.action.centerNode) {
      for (var T = o[r.id]; T; ) {
        if (
          (y.push(T.id),
          r.options.parentState === FamilyTree.COLLAPSE_PARENT_NEIGHBORS && T)
        )
          for (d = 0; d < T.childrenIds.length; d++) {
            (U = o[T.childrenIds[d]]).collapsed = !0;
          }
        null == T.pid && null != T.stpid
          ? ((T = o[T.stpid]).min = !1)
          : (T = o[T.pid]);
      }
      T = o[r.id];
      if (r.options.childrenState === FamilyTree.COLLAPSE_SUB_CHILDRENS)
        for (d = 0; d < T.childrenIds.length; d++) {
          (F = o[T.childrenIds[d]]).collapsed = !1;
          for (var v = 0; v < F.childrenIds.length; v++) {
            o[F.childrenIds[v]].collapsed = !0;
          }
        }
      if (
        r.options.parentState ===
        FamilyTree.COLLAPSE_PARENT_SUB_CHILDREN_EXCEPT_CLICKED
      )
        if ((b = o[T.pid]))
          for (d = 0; d < b.childrenIds.length; d++) {
            var F;
            if ((F = o[b.childrenIds[d]]) != T) {
              F.collapsed = !1;
              for (v = 0; v < F.childrenIds.length; v++) {
                o[F.childrenIds[v]].collapsed = !0;
              }
            }
          }
    } else if (i == FamilyTree.action.insert)
      for (u = o[r.insertedNodeId]; u; )
        y.push(u.id),
          null == u.pid && null != u.stpid
            ? ((u = o[u.stpid]).min = !1)
            : (u = o[u.pid]);
    var x = [],
      _ = {},
      w = [],
      k = {},
      S = [];
    for (d = 0; d < l.length; d++)
      FamilyTree.manager._iterate(
        l[d],
        l[d],
        o,
        0,
        x,
        _,
        w,
        k,
        "",
        t,
        e,
        i,
        y,
        r,
        S,
        n
      );
    for (d = l.length - 1; d >= 0; d--) l[d].collapsed && l.splice(d, 1);
    for (d = 0; d < S.length; d++) {
      u = o[S[d]];
      var C = [],
        N = [],
        I = [],
        A = {},
        M = 0,
        L = 0,
        E = 0,
        P = [],
        B = [];
      for (v = 0; v < u.children.length; v++) {
        (U = u.children[v]).isAssistant
          ? C.push(U.id)
          : -1 != U.tags.indexOf("right-partner")
          ? ((U.isPartner = 1), (U.children = []), N.push(U.id))
          : -1 != U.tags.indexOf("left-partner")
          ? ((U.isPartner = 2), (U.children = []), I.push(U.id))
          : -1 == U.tags.indexOf("partner") || M % 2
          ? -1 != U.tags.indexOf("partner") && M % 2
            ? ((U.isPartner = 2), (U.children = []), I.push(U.id), M++)
            : U.parentPartner
            ? (A[U.parentPartner.id] || (A[U.parentPartner.id] = []),
              A[U.parentPartner.id].push(U.id))
            : C.push(U.id)
          : ((U.isPartner = 1), (U.children = []), N.push(U.id), M++);
      }
      u.children = [];
      for (v = 0; v < N.length; v++) {
        A[(U = o[N[v]]).id] ? u.children.push(U) : u.children.splice(0, 0, U);
      }
      for (v = 0; v < I.length; v++) {
        A[(U = o[I[v]]).id] ? u.children.push(U) : u.children.splice(0, 0, U);
      }
      for (v = I.length - 1; v >= 0; v--)
        if (A[I[v]])
          for (f = 0; f < A[I[v]].length; f++)
            u.children.push(o[A[I[v]][f]]),
              L++,
              -1 == B.indexOf(I[v]) && B.push(I[v]);
      for (v = 0; v < C.length; v++) {
        var U = o[C[v]];
        u.children.push(U);
      }
      for (v = 0; v < N.length; v++)
        if (A[N[v]])
          for (f = 0; f < A[N[v]].length; f++)
            u.children.push(o[A[N[v]][f]]),
              E++,
              -1 == P.indexOf(N[v]) && P.push(N[v]);
      (u.partnerSeparation =
        Math.max(B.length, P.length) * e.partnerChildrenSplitSeparation +
        e.minPartnerSeparation),
        C.length || !L || E
          ? C.length || L || !E
            ? C.length || 1 != L || 1 != E
              ? C.length || L || E
                ? !C.length || L || E
                  ? C.length && (L || E)
                    ? (u.hasPartners = 7)
                    : (u.hasPartners = 1)
                  : (u.hasPartners = 6)
                : (u.hasPartners = 5)
              : (u.hasPartners = 4)
            : (u.hasPartners = 3)
          : (u.hasPartners = 2);
    }
    for (d = 0; d < w.length; d++) {
      if (
        (Z = t[(u = o[w[d]]).lcn ? u.lcn : "base"]).layout ==
          FamilyTree.normal ||
        !k[u.pid]
      )
        for (v = 0; v < u.subLevels; v++) {
          var O,
            z = new FamilyTree.node(
              u.id + "_sub_level_index_" + v,
              u.pid,
              [],
              "subLevel"
            );
          if ((FamilyTree.manager._initDinamicNode(z, u.lcn), (b = u.parent)))
            (O = b.children.indexOf(u)) > -1 &&
              (b.children.splice(O, 1), b.children.splice(O, 0, z)),
              z.children.push(u),
              (z.parent = b),
              (u.parent = z),
              (o[z.id] = z);
        }
    }
    for (var H in _) {
      (b = o[H]).hasAssistants = !0;
      z = new FamilyTree.node(
        b.id + "_split_assitant_0",
        b.id,
        ["assistant"],
        "split"
      );
      FamilyTree.manager._initDinamicNode(z, b.lcn, !0), (o[z.id] = z);
      var D = [];
      for (v = b.children.length - 1; v >= 0; v--) {
        (U = b.children[v]).isAssistant
          ? ((U.parent = null), b.children.splice(v, 1), D.splice(0, 0, U.id))
          : U.isPartner ||
            (U.parent &&
              k[U.parent.id] &&
              z &&
              U.parent.id != z.id &&
              (Object.defineProperty(
                k,
                z.id,
                Object.getOwnPropertyDescriptor(k, U.parent.id)
              ),
              delete k[U.parent.id]),
            (U.parent = z),
            z.children.unshift(U),
            b.children.splice(v, 1));
      }
      if (D.length % 2) {
        var R = o[D[D.length - 1]],
          j = new FamilyTree.node(R.id + "_mirror", R.pid, [], "mirror");
        FamilyTree.manager._initDinamicNode(j, R.lcn, !0),
          (R._m = j.id),
          (j.isAssistant = !0),
          (j.w = R.w),
          (j.h = R.h),
          (o[j.id] = j),
          D.splice(D.length - 1, 0, j.id);
      }
      var $ = 1;
      for (v = D.length - 1; v >= 0; v--)
        if (v % 2 && v != D.length - 1) {
          var X = new FamilyTree.node(
            b.id + "_split_assitant_" + $,
            null,
            [],
            "split"
          );
          FamilyTree.manager._initDinamicNode(X, b.lcn, !0),
            (o[X.id] = X),
            D.splice(v, 0, X.id),
            $++;
        } else v % 2 && D.splice(v, 0, z.id);
      for (v = 0; v < D.length; v += 3) {
        var Y = null;
        Y = 0 == v ? b : o[D[v - 2]];
        var q = o[D[v]],
          V = o[D[v + 1]],
          W = o[D[v + 2]];
        (q.parent = Y),
          (V.parent = Y),
          (W.parent = Y),
          Y.children.push(q),
          Y.children.push(V),
          Y.children.push(W);
      }
    }
    var G = !1;
    for (var K in t) {
      if (
        (Z = t[K]).layout == FamilyTree.mixed ||
        Z.layout == FamilyTree.tree ||
        Z.layout == FamilyTree.treeRightOffset ||
        Z.layout == FamilyTree.treeLeftOffset
      ) {
        G = !0;
        break;
      }
    }
    if (G) {
      var J = {
        nodes: o,
        config: e,
        action: i,
        actionParams: r,
      };
      for (var H in k) {
        var Z;
        if (
          (Z = t[(b = o[H]).lcn ? b.lcn : "base"]).layout == FamilyTree.mixed ||
          Z.layout == FamilyTree.tree ||
          Z.layout == FamilyTree.treeRightOffset ||
          Z.layout == FamilyTree.treeLeftOffset
        )
          if (
            ((J.pnode = b),
            (J.layout = Z.layout),
            (J.childrenIds = k[H]),
            (J.lastChildrenPidIds = k),
            FamilyTree.events.publish("layout", [J]),
            J.layout == FamilyTree.mixed)
          ) {
            var Q = J.childrenIds;
            for (d = Q.length - 1; d >= 0; d--) {
              (b = (U = o[Q[d]]).parent), (U.layout = FamilyTree.mixed);
              for (v = b.children.length - 1; v >= 0; v--)
                if (U.id == b.children[v].id) {
                  b.children.splice(v, 1);
                  break;
                }
              if (d > 0) {
                var ee = o[Q[d - 1]];
                (U.parent = ee),
                  (U.layout = FamilyTree.mixed),
                  ee.children.push(U);
              } else b.children.push(U);
            }
          } else if (
            J.layout == FamilyTree.tree ||
            J.layout == FamilyTree.treeRightOffset ||
            J.layout == FamilyTree.treeLeftOffset
          ) {
            z = new FamilyTree.node(b.id + "_split_0", b.id, [], "split");
            FamilyTree.manager._initDinamicNode(z, b.lcn),
              (o[z.id] = z),
              (z.layout = FamilyTree.tree);
            var te = [];
            for (d = J.childrenIds.length - 1; d >= 0; d--) {
              for (U = o[J.childrenIds[d]], v = 0; v < b.children.length; v++)
                b.children[v].id == U.id && b.children.splice(v, 1);
              if (
                ((U.parent = null),
                (U.layout = FamilyTree.tree),
                J.layout == FamilyTree.treeRightOffset && te.splice(0, 0, U.id),
                J.layout == FamilyTree.treeLeftOffset ||
                  J.layout == FamilyTree.treeRightOffset)
              ) {
                var ie = new FamilyTree.node(
                  U.id + "_mirror",
                  null,
                  [],
                  "mirror"
                );
                FamilyTree.manager._initDinamicNode(ie, U.lcn),
                  (ie.layout = FamilyTree.tree),
                  (o[ie.id] = ie),
                  te.splice(0, 0, ie.id);
              }
              J.layout != FamilyTree.treeRightOffset && te.splice(0, 0, U.id);
            }
            for ($ = 1, v = te.length - 1; v >= 0; v--)
              if (v % 2 && v != te.length - 1) {
                X = new FamilyTree.node(
                  b.id + "_split_" + $,
                  null,
                  [],
                  "split"
                );
                FamilyTree.manager._initDinamicNode(X, b.lcn),
                  (X.layout = FamilyTree.tree),
                  (o[X.id] = X),
                  te.splice(v, 0, X.id),
                  $++;
              } else v % 2 && te.splice(v, 0, z.id);
            for (v = 0; v < te.length; v += 3) {
              Y = null;
              0 == v && (Y = b);
              (q = o[te[v]]), (V = o[te[v + 1]]), (W = o[te[v + 2]]);
              0 != v && (Y = o[te[v - 3]]),
                0 == v || V || (Y = o[te[v - 2]]),
                (q.parent = Y),
                Y.children.push(q),
                V &&
                  (0 != v && (Y = o[te[v - 2]]),
                  (V.parent = Y),
                  Y.children.push(V)),
                W &&
                  (0 != v && (Y = o[te[v - 1]]),
                  (W.parent = Y),
                  Y.children.push(W));
            }
          }
      }
    }
    return {
      nodes: o,
      roots: l,
      rootList: s,
    };
  }),
  (FamilyTree.manager._getOrderFieldValue = function (e, t) {
    var i = t;
    return t.field && (i = t.field), e[i];
  }),
  (FamilyTree.manager._getNodeWidth = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return e.w;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return e.h;
    }
    return 0;
  }),
  (FamilyTree.manager._isVisible = function (e, t, i, r) {
    if (null != e.x && null != e.y) {
      if (t.lazyLoading && r !== FamilyTree.action.exporting) {
        function a(e, t) {
          var i = e.x,
            r = e.y,
            a = e.w,
            n = e.h,
            o = t[0] - FamilyTree.LAZY_LOADING_FACTOR,
            l = t[2] + FamilyTree.LAZY_LOADING_FACTOR + t[0],
            s = t[1] - FamilyTree.LAZY_LOADING_FACTOR,
            d = t[3] + FamilyTree.LAZY_LOADING_FACTOR + t[1],
            c = i + a > o && l > i;
          return c && (c = r + n > s && d > r), c;
        }
        if (a(e, i)) return !0;
        for (var n = 0; n < e.children.length; n++)
          if (a(e.children[n], i)) return !0;
        return !1;
      }
      return !0;
    }
  }),
  (FamilyTree.manager.getAllFields = function (e) {
    var t = [FamilyTree.TAGS];
    for (var i in e.nodeBinding) t.push(e.nodeBinding[i]);
    for (i = 0; i < e.nodes.length; i++)
      for (var r in e.nodes[i])
        r !== FamilyTree.ID &&
          r !== FamilyTree.TAGS &&
          r !== FamilyTree.NODES &&
          r !== FamilyTree.PID &&
          r !== FamilyTree.STPID &&
          (e.nodeBinding[r] || t.has(r) || t.push(r));
    return t;
  }),
  (FamilyTree.manager._getMostDeepChild = function (e) {
    if (e) {
      var t = e;
      return (
        (function e(i) {
          i.sl > t.sl && (t = i);
          for (var r = 0; r < i.children.length; r++) e(i.children[r]);
        })(e),
        t
      );
    }
  }),
  (FamilyTree.manager._getResponse = function (
    e,
    t,
    i,
    r,
    a,
    n,
    o,
    l,
    s,
    d,
    c,
    m,
    h,
    p,
    f
  ) {
    var y = d[0],
      u = [],
      g = {
        top: null,
        left: null,
        bottom: null,
        right: null,
        minX: null,
        maxX: null,
        minY: null,
        maxY: null,
      },
      b = [[], [], []],
      T = a - o + 2 * r.padding,
      v = n - l + 2 * r.padding,
      F = FamilyTree.getScale(
        s,
        e,
        t,
        r.scaleInitial,
        r.scaleMax,
        r.scaleMin,
        T,
        v
      );
    if (
      ((g.top = l - r.padding),
      (g.left = o - r.padding),
      (g.bottom = n + r.padding - t / F),
      (g.right = a + r.padding - e / F),
      (g.maxX = a),
      (g.minX = o),
      (g.maxY = n),
      (g.minY = l),
      0 == d.length || (null == s && !f && r.align == FamilyTree.CENTER))
    ) {
      var x = Math.ceil(e / F),
        _ = Math.ceil(t / F),
        w = 0,
        k = 0;
      if (x - 2 * r.padding >= a - o)
        switch (((w = (a + o) / 2 - x / 2), r.orientation)) {
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            w = (o - a) / 2 - x / 2;
        }
      else
        switch (
          ((w = y.x - x / 2 + FamilyTree.manager._getNodeWidth(y, r) / 2),
          r.orientation)
        ) {
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            (w = -(x / 2 - (o - a) / 2)) < r.padding - x && (w = r.padding - x);
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.bottom_left:
          case FamilyTree.orientation.top_left:
          case FamilyTree.orientation.left_top:
            (w = -(x / 2 - (a - o) / 2)) > -r.padding && (w = -r.padding);
        }
      if (_ - 2 * r.padding >= n - l)
        switch (((k = (n + l) / 2 - _ / 2), r.orientation)) {
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            k = (l - n) / 2 - _ / 2;
        }
      else
        switch (
          ((k = -(_ / 2 - (n - l) / 2)) > -r.padding && (k = -r.padding),
          r.orientation)
        ) {
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            (k = -(_ / 2 - (l - n) / 2)) < r.padding - _ && (k = r.padding - _);
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.right:
            k = y.y - _ / 2 + FamilyTree.manager._getNodeWidth(y, r) / 2;
        }
      s = [w, k, x, _];
    } else if (null == s && !f && r.align == FamilyTree.ORIENTATION) {
      (x = Math.ceil(e / F)), (_ = Math.ceil(t / F)), (w = 0), (k = 0);
      switch (r.orientation) {
        case FamilyTree.orientation.top:
          (w = y.x - x / 2 + FamilyTree.manager._getNodeWidth(y, r) / 2),
            (k = -r.padding);
          break;
        case FamilyTree.orientation.bottom:
          (w = y.x - x / 2 + FamilyTree.manager._getNodeWidth(y, r) / 2),
            (k = r.padding - _);
          break;
        case FamilyTree.orientation.left:
          (w = -r.padding),
            (k = y.y - _ / 2 + FamilyTree.manager._getNodeWidth(y, r) / 2);
          break;
        case FamilyTree.orientation.right:
          (w = r.padding - x),
            (k = y.y - _ / 2 + FamilyTree.manager._getNodeWidth(y, r) / 2);
          break;
        case FamilyTree.orientation.top_left:
          (w = -r.padding), (k = -r.padding);
          break;
        case FamilyTree.orientation.right_top:
          (w = r.padding - x), (k = -r.padding);
          break;
        case FamilyTree.orientation.left_top:
          (w = -r.padding), (k = -r.padding);
          break;
        case FamilyTree.orientation.bottom_left:
          (w = -r.padding), (k = r.padding - _);
      }
      (s = [w, k, x, _]),
        r.sticky &&
          (s[0] < g.left &&
            s[0] < g.right &&
            (s[0] = g.left > g.right ? g.right : g.left),
          s[0] > g.right &&
            s[0] > g.left &&
            (s[0] = g.left > g.right ? g.left : g.right),
          s[1] < g.top &&
            s[1] < g.bottom &&
            (s[1] = g.top > g.bottom ? g.bottom : g.top),
          s[1] > g.bottom &&
            s[1] > g.top &&
            (s[1] = g.top > g.bottom ? g.top : g.bottom));
    }
    if (c == FamilyTree.action.centerNode || c == FamilyTree.action.maximize) {
      var S = h[m.id];
      1 == m.options.horizontal && (s[0] = S.x + S.w / 2 - s[2] / 2),
        1 == m.options.vertical && (s[1] = S.y + S.h / 2 - s[3] / 2),
        r.sticky &&
          (s[0] < g.left &&
            s[0] < g.right &&
            (s[0] = g.left > g.right ? g.right : g.left),
          s[0] > g.right &&
            s[0] > g.left &&
            (s[0] = g.left > g.right ? g.left : g.right),
          s[1] < g.top &&
            s[1] < g.bottom &&
            (s[1] = g.top > g.bottom ? g.bottom : g.top),
          s[1] > g.bottom &&
            s[1] > g.top &&
            (s[1] = g.top > g.bottom ? g.top : g.bottom));
    }
    if (
      c == FamilyTree.action.insert ||
      c == FamilyTree.action.expand ||
      c == FamilyTree.action.collapse ||
      c == FamilyTree.action.update ||
      c == FamilyTree.action.centerNode ||
      c == FamilyTree.action.maximize
    ) {
      var C = null;
      if (
        c == FamilyTree.action.insert &&
        m &&
        null != m.insertedNodeId &&
        null != m.insertedNodeId
      )
        C = h[m.insertedNodeId];
      else if (
        c == FamilyTree.action.update &&
        m &&
        null != m.visId &&
        null != m.visId
      )
        C = h[m.visId];
      else if (
        (c != FamilyTree.action.expand &&
          c != FamilyTree.action.collapse &&
          c != FamilyTree.action.maximize) ||
        !m ||
        null == m.id ||
        null == m.id
      ) {
        if (
          c == FamilyTree.action.centerNode ||
          c == FamilyTree.action.maximize
        ) {
          switch (r.orientation) {
            case FamilyTree.orientation.top:
            case FamilyTree.orientation.top_left:
            case FamilyTree.orientation.bottom:
            case FamilyTree.orientation.bottom_left:
              m.options.vertical || (C = h[m.id]);
              break;
            case FamilyTree.orientation.right:
            case FamilyTree.orientation.right_top:
            case FamilyTree.orientation.left:
            case FamilyTree.orientation.left_top:
              m.options.horizontal || (C = h[m.id]);
          }
          C && (C = FamilyTree.manager._getMostDeepChild(C, h));
        }
      } else (C = h[m.id]), (C = FamilyTree.manager._getMostDeepChild(C, h));
      if (!FamilyTree.FIXED_POSITION_ON_CLICK && C)
        switch (r.orientation) {
          case FamilyTree.orientation.top:
          case FamilyTree.orientation.top_left:
            var N = C.y + C.h - s[3] + r.padding;
            s[1] < N && (s[1] = N);
            break;
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            N = C.y - r.padding;
            s[1] > N && (s[1] = N);
            break;
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            N = C.x - r.padding;
            s[0] > N && (s[0] = N);
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.left_top:
            N = C.x + C.w - s[2] + r.padding;
            s[0] < N && (s[0] = N);
        }
    }
    for (var I = 0; I < d.length; I++)
      FamilyTree.manager._iterate2(d[I], h, r, s, c, m, u, p, i, b);
    return {
      animations: b,
      boundary: g,
      viewBox: s,
      visibleNodeIds: u,
      nodes: h,
      allFields: FamilyTree.manager.getAllFields(r),
    };
  }),
  (FamilyTree.manager._iterate2 = function (e, t, i, r, a, n, o, l, s, d) {
    if (FamilyTree.manager._isVisible(e, i, r, a)) {
      o.push(e.id);
      var c = null;
      if (
        (a == FamilyTree.action.expand ||
          a == FamilyTree.action.collapse ||
          a == FamilyTree.action.maximize) &&
        l &&
        l[e.id] &&
        "expandCollapseToLevel" == n.method
      ) {
        if (
          ((c = {
            x: (f = l[e.id]).x,
            y: f.y,
          }),
          f)
        ) {
          c = {
            x: f.x,
            y: f.y,
          };
          for (var m = e, h = null; null != m; )
            l[m.id] && l[m.id].collapsed && (h = m), (m = m.parent);
          h &&
            h.parent &&
            (c = {
              x: h.parent.x,
              y: h.parent.y,
            });
        }
        if ((y = t[n.id])) {
          for (m = e.parent; null != m; ) m = m.parent;
          m &&
            (c = {
              x: y.x + y.w / 2 - e.w / 2,
              y: y.y + y.h / 2 - e.h / 2,
            });
        }
      } else if (
        (a == FamilyTree.action.expand || a == FamilyTree.action.collapse) &&
        l &&
        l[e.id]
      ) {
        if (
          ((c = {
            x: (f = l[e.id]).x,
            y: f.y,
          }),
          "all" == n.ids && f)
        ) {
          c = {
            x: f.x,
            y: f.y,
          };
          for (m = e, h = null; null != m; )
            l[m.id] && l[m.id].collapsed && (h = m), (m = m.parent);
          h &&
            h.parent &&
            (c = {
              x: h.parent.x,
              y: h.parent.y,
            });
        }
        if ((y = t[n.id])) {
          for (
            m = e.parent;
            null != m && -1 == n.ids.indexOf(e.id) && -1 == n.ids.indexOf(m.id);

          )
            m = m.parent;
          m &&
            (c = {
              x: y.x + y.w / 2 - e.w / 2,
              y: y.y + y.h / 2 - e.h / 2,
            });
        }
      } else if (a == FamilyTree.action.centerNode && l && l[e.id]) {
        if (
          (null != (f = l[e.id]).x &&
            null != f.y &&
            (c = {
              x: f.x,
              y: f.y,
            }),
          (p = t[n.id]) && p == e)
        )
          (m = e.parent) &&
            m.id == n.id &&
            (c = {
              x: p.x + p.w / 2 - e.w / 2,
              y: p.y + p.h / 2 - e.h / 2,
            });
      } else if (a == FamilyTree.action.maximize && l && l[e.id]) {
        var p;
        if (
          (null != (f = l[e.id]).x &&
            null != f.y &&
            (c = {
              x: f.x,
              y: f.y,
            }),
          (p = t[n.id]) && p == e)
        )
          (m = e.parent) &&
            m.id == n.id &&
            (c = {
              x: p.x + p.w / 2 - e.w / 2,
              y: p.y + p.h / 2 - e.h / 2,
            });
      } else if (a == FamilyTree.action.minimize && l && l[e.id]) {
        c = {
          x: (f = l[e.id]).x,
          y: f.y,
        };
      } else if (
        a == FamilyTree.action.insert &&
        n &&
        n.insertedNodeId == e.id &&
        e.parent
      )
        c = {
          x: e.parent.x,
          y: e.parent.y,
        };
      else if (
        (a != FamilyTree.action.update && a != FamilyTree.action.insert) ||
        !l
      )
        a !== FamilyTree.action.exporting &&
          a !== FamilyTree.action.init &&
          -1 == s.indexOf(e.id) &&
          (d[0].push(e.id),
          d[1].push({
            opacity: 0,
          }),
          d[2].push({
            opacity: 1,
          }));
      else {
        var f, y;
        if (
          (!(f = l[e.id]) ||
            (FamilyTree.isNEU(f.x) && FamilyTree.isNEU(f.y))) &&
          n
        ) {
          if ((y = t[n.id])) {
            for (m = y; m && m.id == e.id; ) m = m.parent;
            m &&
              (c = {
                x: y.x,
                y: y.y,
              });
          }
        } else
          f &&
            (c = {
              x: f.x,
              y: f.y,
            });
      }
      null != c &&
        null != c.x &&
        null != c.y &&
        ((c.x == e.x && c.y == e.y) ||
          (d[0].push(e.id),
          d[1].push({
            transform: [1, 0, 0, 1, c.x, c.y],
          }),
          d[2].push({
            transform: [1, 0, 0, 1, e.x, e.y],
          })));
    }
    for (var u = 0; u < e.stChildren.length; u++)
      FamilyTree.manager._iterate2(e.stChildren[u], t, i, r, a, n, o, l, s, d);
    for (u = 0; u < e.children.length; u++)
      FamilyTree.manager._iterate2(e.children[u], t, i, r, a, n, o, l, s, d);
  }),
  (FamilyTree.manager._addExpandedNodeIdsIterate = function (e, t, i) {
    for (var r = 0; r < e.childrenIds.length; r++)
      i.push(e.childrenIds[r]),
        FamilyTree.manager._addExpandedNodeIdsIterate(
          t[e.childrenIds[r]],
          t,
          i
        );
  }),
  (FamilyTree.manager._setMinMaxXYAdjustifyIterate = function (
    e,
    t,
    i,
    r,
    a,
    n,
    o
  ) {
    (e.x += n.x), (e.y += n.y), FamilyTree._setMinMaxXY(e, i);
    for (var l = 0; l < e.stChildren.length; l++)
      FamilyTree.manager._setMinMaxXYAdjustifyIterate(
        e.stChildren[l],
        e.stChildren[l],
        i,
        0,
        a,
        n,
        o
      );
    e.isPartner ? (e.sl = r - 1) : (e.sl = r),
      null == a[t.id] && (a[t.id] = {}),
      null == a[t.id][e.sl] &&
        (a[t.id][e.sl] = {
          minX: null,
          minY: null,
          maxX: null,
          maxY: null,
        }),
      e.layout || FamilyTree._setMinMaxXY(e, a[t.id][e.sl]),
      r++;
    for (l = 0; l < e.children.length; l++)
      FamilyTree.manager._setMinMaxXYAdjustifyIterate(
        e.children[l],
        t,
        i,
        r,
        a,
        n,
        o
      );
  }),
  (FamilyTree.manager._doNotChangePositionOfClickedNodeIfAny = function (
    e,
    t,
    i,
    r,
    a,
    n
  ) {
    if (
      i != FamilyTree.action.expand &&
      i != FamilyTree.action.collapse &&
      i != FamilyTree.action.minimize &&
      i != FamilyTree.action.maximize &&
      i != FamilyTree.action.centerNode &&
      i != FamilyTree.action.update &&
      i != FamilyTree.action.insert
    )
      return {
        x: 0,
        y: 0,
      };
    if (i == FamilyTree.action.update && (!r || null == r.id)) {
      if (!e || !e.length)
        return {
          x: 0,
          y: 0,
        };
      r = {
        id: e[0].id,
      };
    }
    if (null == r.id)
      return {
        x: 0,
        y: 0,
      };
    var o = r.id;
    ((i == FamilyTree.action.minimize && t[o].parent) ||
      (i == FamilyTree.action.maximize && t[o].parent)) &&
      (o = t[o].pid);
    var l = t[o],
      s = a[o];
    return s
      ? {
          x: (s.x ? s.x : 0) - l.x,
          y: (s.y ? s.y : 0) - l.y,
        }
      : {
          x: 0,
          y: 0,
        };
  }),
  (FamilyTree.manager.__createNodes = function (e, t, i, r, a, n, o) {
    for (
      var l = i.nodes, s = [], d = [], c = {}, m = {}, h = 0;
      h < l.length;
      h++
    ) {
      var p,
        f = l[h];
      (p = FamilyTree.STRING_TAGS
        ? f.tags
          ? f.tags.split(",")
          : []
        : Array.isArray(f.tags)
        ? f.tags.slice(0)
        : []),
        f.gender && p.push(f.gender);
      var y = FamilyTree._getTemplate(p, i.tags, i.template);
      f.templateName && (y = f.templateName);
      var u = new FamilyTree.node(f.id, f.pid, p, y);
      (u.ftChildrenIds = []),
        (u.rids = []),
        FamilyTree.isNEU(f.ppid) || (u.ppid = f.ppid),
        FamilyTree.isNEU(f.stpid) || (u.stpid = f.stpid),
        FamilyTree.isNEU(f.mid) || (u.mid = f.mid),
        FamilyTree.isNEU(f.fid) || (u.fid = f.fid),
        FamilyTree.isNEU(f.gender) || (u.gender = f.gender),
        Array.isArray(f.pids) ? (u.pids = f.pids) : (u.pids = []),
        null != i.orderBy &&
          (u.order = FamilyTree.manager._getOrderFieldValue(f, i.orderBy)),
        (e[f.id] = u),
        s.push(f.id),
        FamilyTree.isNEU(u.stpid)
          ? (FamilyTree.isNEU(u.mid) ||
              (c[u.mid] || (c[u.mid] = []), c[u.mid].push(u.id)),
            FamilyTree.isNEU(u.fid) ||
              (c[u.fid] || (c[u.fid] = []), c[u.fid].push(u.id)),
            FamilyTree.isNEU(u.mid) &&
              FamilyTree.isNEU(u.fid) &&
              FamilyTree.isNEU(u.stpid) &&
              (d.has(u.id) || d.push(u.id)))
          : (m[u.stpid] || (m[u.stpid] = []), m[u.stpid].push(u.id));
    }
    null != i.orderBy &&
      s.sort(function (t, r) {
        var a = e[t].order,
          n = e[r].order;
        return "number" == typeof a || "number" == typeof n
          ? (null == a && (a = -1),
            null == n && (n = -1),
            i.orderBy.desc ? n - a : a - n)
          : "string" == typeof a || "string" == typeof n
          ? (null == a && (a = ""),
            null == n && (n = ""),
            i.orderBy.desc ? n.localeCompare(a) : a.localeCompare(n))
          : void 0;
      });
    for (h = 0; h < d.length; h++) {
      var g = e[d[h]];
      if (g) {
        var b = [];
        FamilyTree.manager._iterateSetRootIds(g.id, g.id, m, c, e, b),
          o.push(b);
      }
    }
    for (h = 0; h < o.length; h++)
      for (var T = 0; T < o.length; T++)
        if (T != h) {
          for (var v = o[h], F = o[T], x = !1, _ = 0; _ < v.length; _++)
            if (F.has(v[_])) {
              x = !0;
              break;
            }
          x && ((o[h] = v.concat(F).unique()), (o[T] = []));
        }
    for (h = o.length - 1; h >= 0; h--) o[h].length || o.splice(h, 1);
    if (!i.roots || !i.roots.length) {
      i.roots = [];
      for (h = o.length - 1; h >= 0; h--) i.roots.push(o[h][0]);
    }
    for (h = 0; h < i.roots.length; h++)
      FamilyTree.manager._iterateFT(i.roots[h], m, c, e, n, t, r, a, i);
  }),
  (FamilyTree.manager._iterateSetRootIds = function (e, t, i, r, a, n) {
    var o = a[e];
    if (o) {
      o.rids.has(t) || o.rids.push(t);
      for (var l = 0; l < o.rids.length; l++)
        n.has(o.rids[l]) || n.push(o.rids[l]);
      for (l = 0; l < o.pids.length; l++) {
        var s = a[o.pids[l]];
        if (s)
          for (var d = 0; d < s.rids.length; d++)
            n.has(s.rids[d]) || n.push(s.rids[d]);
      }
      if (i[o.id])
        for (l = 0; l < i[o.id].length; l++)
          FamilyTree.manager._iterateSetRootIds(i[o.id][l], t, i, r, a, n);
      if (r[o.id])
        for (l = 0; l < r[o.id].length; l++)
          FamilyTree.manager._iterateSetRootIds(r[o.id][l], t, i, r, a, n);
    }
  }),
  (FamilyTree.manager._iterateFT = function (e, t, i, r, a, n, o, l, s) {
    var d,
      c = r[e],
      m = a ? a[e] : null,
      h = r[c.stpid],
      p = r[c.mid],
      f = r[c.fid];
    if (
      (h || (c.stpid = null),
      p
        ? f &&
          (p.tags.has("partner") ||
            p.tags.has("left-partner") ||
            p.tags.has("right-partner"))
          ? ((c.pid = f.id), (d = f), (c.ppid = p.id))
          : ((c.pid = p.id), (d = p), f && (c.ppid = f.id))
        : f
        ? p &&
          (f.tags.has("partner") ||
            f.tags.has("left-partner") ||
            f.tags.has("right-partner"))
          ? ((c.pid = p.id), (d = p), (c.ppid = f.id))
          : ((c.pid = f.id), (d = f), p && (c.ppid = p.id))
        : c.pid,
      h)
    ) {
      var y = a ? a[h.id] : null;
      y && (h.min = y.min), h.stChildrenIds.push(c.id);
    } else
      p || f
        ? (m && ((c.collapsed = m.collapsed), (c.min = m.min)),
          d && !d.childrenIds.has(c.id) && d.childrenIds.push(c.id),
          p && !p.ftChildrenIds.has(c.id) && p.ftChildrenIds.push(c.id),
          f && !f.ftChildrenIds.has(c.id) && f.ftChildrenIds.push(c.id))
        : (m && ((c.collapsed = m.collapsed), (c.min = m.min)), n.push(c));
    o == FamilyTree.action.init && (c.min = FamilyTree._getMin(c, s));
    for (var u = 0; u < c.pids.length; u++) {
      var g = r[c.pids[u]];
      if (g) {
        g.pid = c.id;
        var b = a ? a[g.id] : null;
        b && ((g.collapsed = b.collapsed), (g.min = b.min)),
          o == FamilyTree.action.init && (g.min = FamilyTree._getMin(g, s)),
          l && m && b && l.id == c.id
            ? b.hasPartners && 1 == m.isPartner
              ? g.tags.push("left-partner")
              : (b.hasPartners && 2 == m.isPartner) || 1 == m.isPartner
              ? g.tags.push("right-partner")
              : 2 == m.isPartner
              ? g.tags.push("left-partner")
              : g.tags.push("partner")
            : b && 2 == b.isPartner
            ? g.tags.push("left-partner")
            : b && 1 == b.isPartner
            ? g.tags.push("right-partner")
            : g.tags.push("partner"),
          c.childrenIds.push(g.id),
          (g.ftChildrenIds = c.ftChildrenIds);
      }
    }
    if (t[e])
      for (var T = 0; T < t[e].length; T++)
        FamilyTree.manager._iterateFT(t[e][T], t, i, r, a, n, o, l, s);
    if (i[e])
      for (T = 0; T < i[e].length; T++)
        FamilyTree.manager._iterateFT(i[e][T], t, i, r, a, n, o, l, s);
  }),
  (FamilyTree.manager.getAllFields = function (e) {
    var t = [FamilyTree.TAGS];
    for (var i in e.nodeBinding) t.push(e.nodeBinding[i]);
    for (i = 0; i < e.nodes.length; i++)
      for (var r in e.nodes[i])
        r !== FamilyTree.ID &&
          r !== FamilyTree.TAGS &&
          r !== FamilyTree.NODES &&
          r !== FamilyTree.PID &&
          r !== FamilyTree.STPID &&
          "mid" !== r &&
          "fid" !== r &&
          "pids" !== r &&
          (e.nodeBinding[r] || t.has(r) || t.push(r));
    return t;
  }),
  (FamilyTree.templates = {}),
  (FamilyTree.templates.base = {
    // defs: `<g transform="matrix(1,0,0,1,0,0)" id="dot"><circle class="bft-fill" cx="0" cy="0" r="5" stroke="#aeaeae" stroke-width="1"></circle></g>\n            <g id="base_node_menu" style="cursor:pointer;"><rect x="0" y="0" fill="transparent" width="22" height="22"></rect><circle cx="4" cy="11" r="2" fill="#ffffff"></circle><circle cx="11" cy="11" r="2" fill="#ffffff"></circle><circle cx="18" cy="11" r="2" fill="#ffffff"></circle></g>\n            <g style="cursor: pointer;" id="base_tree_menu">\n                <rect x="0" y="0" width="25" height="25" fill="transparent"></rect>\n                ${FamilyTree.icon.addUser(25,25,"#fff",0,0)}\n            </g>\n            <g style="cursor: pointer;" id="base_tree_menu_close">\n                <circle cx="12.5" cy="12.5" r="12" fill="#F57C00"></circle>\n                ${FamilyTree.icon.close(25,25,"#fff",0,0)}\n            </g>            \n            <g id="base_up">\n                <circle cx="12" cy="12" r="12" fill="#fff" stroke="#aeaeae" stroke-width="1"></circle>\n                ${FamilyTree.icon.ft(15,15,"#aeaeae",5,5)}\n            </g>\n            <clipPath id="base_img_0"><rect id="base_img_0_stroke" stroke-width="3" stroke="#fff" x="170" y="-5" rx="25" ry="25" width="70" height="70"></rect></clipPath>`,
    size: [155, 63],
    linkAdjuster: {
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
    },
    ripple: {
      radius: 0,
      color: "#e6e6e6",
      rect: null,
    },
    expandCollapseSize: 0,
    svg: '<svg class="{randId} {template} bft-{mode}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  style="display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}</svg>',
    link: '<path stroke-linejoin="round" stroke="#943f7f" stroke-width="1px" fill="none" d="{rounded}" />',
    assistanseLink:
      '<path stroke-linejoin="round" stroke="#943f7f" stroke-width="2px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} {xd},{yd} L{xe},{ye}"/>',
    pointer:
      '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)"><radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" /><stop stop-color="#C1C1C1" offset="1" /></radialGradient><circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle></g>',
    node: '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" stroke="#c99eeb" fill="#e6e2fc" rx="7" ry="7"></rect>',
    menuButton:
      '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" ' +
      FamilyTree.attr.control_export_menu +
      '=""><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"><hr style="background-color: #7A7A7A; height: 3px; border: none;"></div>',
    padding: [50, 20, 35, 20],
    defs: `<rect height="20" width="20"  fill=""></rect><image id="base_up" href="expand.svg" x="-5" y="30" height="15" width="25" />`,
    // nodeMenuButton: `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="220" y="95" xlink:href="#base_node_menu"/>`,
    // nodeTreeMenuButton: '<use data-ctrl-n-t-menu-id="{id}" class="svg-btn" x="67" y="61" xlink:href="#base_tree_menu"/>',
    // nodeTreeMenuCloseButton: '<use data-ctrl-n-t-menu-c=""  x="67" y="61" xlink:href="#base_tree_menu_close"/>',
    up: '<use x="125" y="10" xlink:href="#base_up"/>',
    img_0:
      '<use xlink:href="#base_img_0_stroke" /><image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}"  x="170" y="-5"  width="70" height="70"></image>',
    link_field_0:
      '<text text-anchor="middle" fill="#aeaeae" ' +
      FamilyTree.attr.width +
      '="290" x="0" y="0" style="font-size:10px;">{val}</text>',
  }),
  (FamilyTree.templates.tommy = Object.assign({}, FamilyTree.templates.base)),
  (FamilyTree.templates.tommy.defs =
    "<style>                          \n                                        .{randId} .bft-edit-form-header, .{randId} .bft-img-button{\n                                            background-color: #aeaeae;\n                                        }\n                                        .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{\n                                            background-color: #039BE5;\n                                        }        \n                                        .{randId}.male div.bft-img-button:hover{\n                                            background-color: #F57C00;\n                                        }\n                                        .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{\n                                            background-color: #F57C00;\n                                        }        \n                                        .{randId}.female div.bft-img-button:hover{\n                                            background-color: #039BE5;\n                                        }\n                                    </style>"),
  (FamilyTree.templates.tommy.field_0 =
    "<text " +
    FamilyTree.attr.width +
    '="230" style="font-size: 18px;font-weight:bold;" fill="#ffffff" x="10" y="90" text-anchor="start">{val}</text>'),
  (FamilyTree.templates.tommy.field_1 =
    "<text " +
    FamilyTree.attr.width +
    '="150" style="font-size: 14px;" fill="#ffffff" x="10" y="65" text-anchor="start">{val}</text>'),
  (FamilyTree.templates.tommy.node =
    '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="#aeaeae" stroke="#aeaeae" rx="7" ry="7"></rect>'),
  (FamilyTree.templates.tommy_male = Object.assign(
    {},
    FamilyTree.templates.tommy
  )),
  (FamilyTree.templates.tommy_male.node =
    '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="#039BE5" stroke="#aeaeae" rx="7" ry="7"></rect>'),
  (FamilyTree.templates.tommy_female = Object.assign(
    {},
    FamilyTree.templates.tommy
  )),
  (FamilyTree.templates.tommy_female.node =
    '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill="#F57C00" stroke="#aeaeae" rx="7" ry="7"></rect>'),
  (FamilyTree.templates.hugo = Object.assign({}, FamilyTree.templates.base)),
  (FamilyTree.templates.hugo.defs = `<clipPath id="hugo_img_0"><rect id="hugo_img_0_stroke" stroke-width="0" fill="#E7AE58" stroke="#E7AE58" x="10" y="6" rx="50" ry="50" width="50" height="50"></rect></clipPath>\n                                    <linearGradient id="hugo_grad_female" x1="0%" y1="0%" x2="100%" y2="0%">\n                                        <stop offset="0%" style="stop-color:#FF8024;stop-opacity:1" />\n                                        <stop offset="100%" style="stop-color:#FF46A3;stop-opacity:1" />\n                                    </linearGradient>\n                                    <linearGradient id="hugo_grad_male" x1="0%" y1="0%" x2="100%" y2="0%">\n                                        <stop offset="0%" style="stop-color:#00D3A5;stop-opacity:1" />\n                                        <stop offset="100%" style="stop-color:#00A7D4;stop-opacity:1" />\n                                    </linearGradient>\n                                    <linearGradient id="hugo_grad" x1="0%" y1="0%" x2="100%" y2="0%">\n                                        <stop offset="0%" style="stop-color:#D0D0D0;stop-opacity:1" />\n                                        <stop offset="100%" style="stop-color:#909090;stop-opacity:1" />\n                                    </linearGradient>\n                                    <g id="hugo_up">\n                                        <circle cx="12" cy="12" r="15" fill="transparent" ></circle>\n                                        ${FamilyTree.icon.ft(
    24,
    24,
    "#fff",
    0,
    0
  )}\n                                    </g>\n                                    <g id="hugo_node_menu" style="cursor:pointer;"><rect x="0" y="0" fill="transparent" width="22" height="22"></rect><circle cx="11" cy="4" r="2" fill="#ffffff"></circle><circle cx="11" cy="11" r="2" fill="#ffffff"></circle><circle cx="11" cy="18" r="2" fill="#ffffff"></circle></g>\n                                    <style>\n                                        .{randId} .bft-edit-form-header{\n                                            background: linear-gradient(90deg, #D0D0D0 0%, #909090 100%);\n                                        }\n                                        .{randId}.male .bft-edit-form-header{\n                                            background: linear-gradient(90deg, #00D3A5 0%, #00A7D4 100%);\n                                        }\n                                        .{randId}.female .bft-edit-form-header{\n                                            background: linear-gradient(90deg, #FF8024 0%, #FF46A3 100%);\n                                        }  \n                                        .{randId} .bft-img-button{\n                                            background-color: #909090;\n                                        }      \n                                        .{randId} .bft-img-button:hover{\n                                            background-color: #D0D0D0;\n                                        }\n                                        .{randId}.male .bft-img-button{\n                                            background-color: #00A7D4;\n                                        }      \n                                        .{randId}.male .bft-img-button:hover{\n                                            background-color: #00D3A5;\n                                        }\n                                        .{randId}.female .bft-img-button{\n                                            background-color: #FF46A3;\n                                        }      \n                                        .{randId}.female .bft-img-button:hover{\n                                            background-color: #FF8024;\n                                        }\n                                        \n                                    </style>`),
  (FamilyTree.templates.hugo.img_0 =
    '<use xlink:href="#hugo_img_0_stroke" /><image preserveAspectRatio="xMidYMid slice" clip-path="url(#hugo_img_0)" xlink:href="{val}"  x="0" y="-5"  width="70" height="70"></image>'),
  (FamilyTree.templates.hugo.field_0 =
    "<text " +
    FamilyTree.attr.width +
    '="230" style="font-size: 18px;font-weight:bold;" fill="#ffffff" x="125" y="85" text-anchor="middle">{val}</text>'),
  (FamilyTree.templates.hugo.field_1 =
    "<text " +
    FamilyTree.attr.width +
    '="230" style="font-size: 14px;" fill="#ffffff" x="125" y="105" text-anchor="middle">{val}</text>'),
  (FamilyTree.templates.hugo.node =
    '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill=url(#hugo_grad) stroke="#aeaeae" rx="7" ry="7"></rect>'),
  (FamilyTree.templates.hugo_male = Object.assign(
    {},
    FamilyTree.templates.hugo
  )),
  (FamilyTree.templates.hugo_male.node =
    '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill=url(#hugo_grad_male) stroke="#aeaeae" rx="7" ry="7"></rect>'),
  (FamilyTree.templates.hugo_female = Object.assign(
    {},
    FamilyTree.templates.hugo
  )),
  (FamilyTree.templates.hugo_female.node =
    '<rect x="0" y="0" height="{h}" width="{w}" stroke-width="1" fill=url(#hugo_grad_female) stroke="#aeaeae" rx="7" ry="7"></rect>'),
  (FamilyTree.templates.hugo.up =
    '<use x="200" y="10" xlink:href="#hugo_up"/>'),
  (FamilyTree.templates.hugo.nodeMenuButton = `<use x="225" y="10" ${FamilyTree.attr.control_node_menu_id}="{id}" xlink:href="#hugo_node_menu"/>`),
  (FamilyTree.templates.mother = Object.assign({}, FamilyTree.templates.base)),
  (FamilyTree.templates.mother.up = ""),
  (FamilyTree.templates.mother.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;"  stroke-width="1" stroke="#F57C00" rx="5" ry="5"></rect><text style="font-size: 18px;" fill="#F57C00" x="240" y="30" text-anchor="end">Add mother</text>' +
    FamilyTree.icon.mother(70, 70, "#F57C00", 10, 40)),
  (FamilyTree.templates.mother.field_0 = ""),
  (FamilyTree.templates.mother.field_1 = ""),
  (FamilyTree.templates.father = Object.assign(
    {},
    FamilyTree.templates.mother
  )),
  (FamilyTree.templates.father.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#039BE5;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#039BE5" x="240" y="30" text-anchor="end">Add father</text>' +
    FamilyTree.icon.father(70, 70, "#039BE5", 10, 40)),
  (FamilyTree.templates.partner = Object.assign(
    {},
    FamilyTree.templates.mother
  )),
  (FamilyTree.templates.partner.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#aeaeae;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#aeaeae" x="240" y="30" text-anchor="end">Add partner</text>'),
  (FamilyTree.templates.son = Object.assign({}, FamilyTree.templates.mother)),
  (FamilyTree.templates.son.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#039BE5;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#039BE5" x="240" y="30" text-anchor="end">Add son</text>' +
    FamilyTree.icon.son(70, 70, "#039BE5", 10, 40)),
  (FamilyTree.templates.daughter = Object.assign(
    {},
    FamilyTree.templates.mother
  )),
  (FamilyTree.templates.daughter.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#F57C00;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#F57C00" x="240" y="30" text-anchor="end">Add daughter</text>' +
    FamilyTree.icon.daughter(70, 70, "#F57C00", 10, 40)),
  (FamilyTree.templates.husband = Object.assign(
    {},
    FamilyTree.templates.mother
  )),
  (FamilyTree.templates.husband.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#039BE5;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#039BE5" x="240" y="30" text-anchor="end">Add husband</text>' +
    FamilyTree.icon.husband(70, 70, "#039BE5", 10, 40)),
  (FamilyTree.templates.wife = Object.assign({}, FamilyTree.templates.mother)),
  (FamilyTree.templates.wife.node =
    '<rect x="0" y="0" height="{h}" width="{w}" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#F57C00;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#F57C00" x="240" y="30" text-anchor="end">Add wife</text>' +
    FamilyTree.icon.wife(70, 70, "#F57C00", 10, 40)),
  (FamilyTree.templates.pet = Object.assign({}, FamilyTree.templates.mother)),
  (FamilyTree.templates.pet.node =
    '<rect x="0" y="0" style="fill:transparent;height:{h}; width:{w};stroke-width:1;stroke:#F57C00;rx:5;ry:5;"></rect><text style="font-size: 18px;" fill="#F57C00" x="240" y="30" text-anchor="end">Add pet</text>' +
    FamilyTree.icon.teddy(70, 70, "#F57C00", 10, 40)),
  (FamilyTree.templates.cgroup = Object.assign({}, FamilyTree.templates.base)),
  (FamilyTree.templates.cgroup.defs = ""),
  (FamilyTree.templates.cgroup.size = [250, 120]),
  (FamilyTree.templates.cgroup.padding = [0, 0, 0, 0]),
  (FamilyTree.templates.cgroup.node = ""),
  (FamilyTree.templates.split = Object.assign({}, FamilyTree.templates.base)),
  (FamilyTree.templates.split.size = [10, 10]),
  (FamilyTree.templates.split.node =
    '<circle cx="5" cy="5" r="5" fill="none" stroke-width="1" stroke="#aeaeae"></circle>'),
  (FamilyTree.templates.mirror = {
    linkAdjuster: {},
    link: "",
    node: "",
    nodeMenuButton: "",
    size: [0, 0],
  }),
  (FamilyTree.ui = {
    _defsIds: {},
    defs: function (e) {
      var t = "";
      for (var i in FamilyTree.templates) {
        var r = FamilyTree.templates[i];
        r.defs &&
          ((FamilyTree.ui._defsIds[i] = FamilyTree.randomId()),
          (t += r.defs.replaceAll("{randId}", FamilyTree.ui._defsIds[i])));
      }
      return "<defs>" + t + e + "</defs>";
    },
    lonely: function (e) {
      return e.nodes && e.nodes.length
        ? ""
        : FamilyTree.IT_IS_LONELY_HERE.replace(
            "{link}",
            FamilyTree.RES.IT_IS_LONELY_HERE_LINK
          );
    },
    pointer: function (e, t, i) {
      return t === FamilyTree.action.exporting
        ? ""
        : FamilyTree.t(e.template, !1, i).pointer;
    },
    node: function (e, t, i, r, a, n, o, l, s, d) {
      var c = FamilyTree.t(e.templateName, e.min, s),
        m = c.node.replaceAll("{w}", e.w).replaceAll("{h}", e.h);
      c.defs &&
        (m = m.replaceAll("{randId}", FamilyTree.ui._defsIds[e.templateName])),
        null == o && (o = r.nodeBinding);
      var h = {
        node: e,
        data: t,
      };
      for (var p in o) {
        var f,
          y = o[p];
        if (
          (t && (f = t[y]),
          "function" == typeof y && (f = y(d, e, t)),
          (h.value = f),
          (h.element = c[p]),
          (h.name = y),
          !1 !== FamilyTree.events.publish("field", [d, h]))
        )
          if (null != h.value && null != h.value && null != h.element)
            FamilyTree._lblIsImg(r, p) ||
              "string" != typeof h.value ||
              (h.value = FamilyTree.wrapText(h.value, h.element)),
              (m += h.element
                .replace("{val}", function () {
                  return h.value;
                })
                .replaceAll("{ew}", e.w - (e.padding ? e.padding[1] : 0))
                .replaceAll("{cw}", e.w / 2)
                .replaceAll("{randId}", FamilyTree.randomId())
                .replaceAll("{randId2}", FamilyTree.randomId()));
      }
      var u = FamilyTree._getPosition(i, e, a, n),
        g = "node";
      Array.isArray(e.tags) && e.tags.length && (g += " " + e.tags.join(" ")),
        e.layout && (g += " tree-layout");
      var b = "";
      e.lcn && (b = 'lcn="' + e.lcn + '"');
      var T = FamilyTree.nodeOpenTag
          .replace("{lcn}", b)
          .replace("{id}", e.id)
          .replace("{class}", g)
          .replace("{sl}", e.sl)
          .replace("{level}", e.level)
          .replace("{x}", u.x)
          .replace("{y}", u.y),
        v = FamilyTree._getOpacity(i, e);
      return (m =
        (T = T.replace("{opacity}", v)) +
        (m += FamilyTree.ui.nodeBtns(r, e, l, c, d)) +
        FamilyTree.grCloseTag);
    },
    nodeBtns: function (e, t, i, r, a) {
      var n = "";
      return (
        null == e.nodeMenu ||
          t.isSplit ||
          i === FamilyTree.action.exporting ||
          (n += r.nodeMenuButton
            .replace("{id}", t.id)
            .replace("{cw}", t.w / 2)
            .replace("{ew}", t.w - (t.padding ? t.padding[1] : 0))),
        null == e.nodeCircleMenu ||
          t.isSplit ||
          i === FamilyTree.action.exporting ||
          FamilyTree.isNEU(r.nodeCircleMenuButton) ||
          (n +=
            '<g style="cursor:pointer;" transform="matrix(1,0,0,1,' +
            r.nodeCircleMenuButton.x +
            "," +
            r.nodeCircleMenuButton.y +
            ')" ' +
            FamilyTree.attr.control_node_circle_menu_id +
            '="' +
            t.id +
            '"><circle cx="0" cy="0" fill="' +
            r.nodeCircleMenuButton.color +
            '" r="' +
            r.nodeCircleMenuButton.radius +
            '" stroke-width="1" stroke="' +
            r.nodeCircleMenuButton.stroke +
            '"></circle><line x1="-' +
            r.nodeCircleMenuButton.radius / 2 +
            '" y1="-6" x2="' +
            r.nodeCircleMenuButton.radius / 2 +
            '" y2="-6" stroke-width="2" stroke="' +
            r.nodeCircleMenuButton.stroke +
            '"></line><line x1="-' +
            r.nodeCircleMenuButton.radius / 2 +
            '" y1="0" x2="' +
            r.nodeCircleMenuButton.radius / 2 +
            '" y2="0" stroke-width="2" stroke="' +
            r.nodeCircleMenuButton.stroke +
            '"></line><line x1="-' +
            r.nodeCircleMenuButton.radius / 2 +
            '" y1="6" x2="' +
            r.nodeCircleMenuButton.radius / 2 +
            '" y2="6" stroke-width="2" stroke="' +
            r.nodeCircleMenuButton.stroke +
            '"></line></g>'),
        n
      );
    },
    expandCollapseBtn: function (e, t, i, r, a) {
      var n = "";
      if (r !== FamilyTree.action.exporting && !t.isSplit) {
        var o = i[t.lcn ? t.lcn : "base"],
          l = 0,
          s = 0,
          d = FamilyTree.t(t.templateName, t.min, a);
        if (t.childrenIds.length > 0) {
          if (t.hasPartners) {
            for (var c = !1, m = 0; m < t.children.length; m++)
              t.children[m].parentPartner ||
                t.children[m].isPartner ||
                (c = !0);
            if (!c) return "";
          }
          switch (o.orientation) {
            case FamilyTree.orientation.top:
            case FamilyTree.orientation.top_left:
              (l = t.x + t.w / 2), (s = t.y + t.h);
              break;
            case FamilyTree.orientation.bottom:
            case FamilyTree.orientation.bottom_left:
              (l = t.x + t.w / 2), (s = t.y);
              break;
            case FamilyTree.orientation.right:
            case FamilyTree.orientation.right_top:
              (l = t.x), (s = t.y + t.h / 2);
              break;
            case FamilyTree.orientation.left:
            case FamilyTree.orientation.left_top:
              (l = t.x + t.w), (s = t.y + t.h / 2);
          }
          if (
            ((l -= d.expandCollapseSize / 2),
            (s -= d.expandCollapseSize / 2),
            e.getCollapsedIds(t).length
              ? ((n += FamilyTree.expcollOpenTag
                  .replace("{id}", t.id)
                  .replace("{x}", l)
                  .replace("{y}", s)),
                (n += d.plus),
                (n += FamilyTree.grCloseTag))
              : ((n += FamilyTree.expcollOpenTag
                  .replace("{id}", t.id)
                  .replace("{x}", l)
                  .replace("{y}", s)),
                (n += d.minus),
                (n += FamilyTree.grCloseTag)),
            n.indexOf("{collapsed-children-count}"))
          ) {
            var h = FamilyTree.collapsedChildrenCount(e, t);
            n = n.replace("{collapsed-children-count}", h);
          }
        }
        e._nodeHasHiddenParent(t) &&
          ((n += FamilyTree.upOpenTag
            .replace("{id}", t.id)
            .replace("{x}", t.x)
            .replace("{y}", t.y)),
          (n += d.up),
          (n += FamilyTree.grCloseTag));
      }
      var p = {
        html: n,
        node: t,
      };
      return FamilyTree.events.publish("renderbuttons", [e, p]), p.html;
    },
    link: function (e, t, i, r, a, n) {
      var o = e.lcn ? e.lcn : "base",
        l = t._layoutConfigs[o],
        s = FamilyTree.t(e.templateName, e.min, i),
        d = [],
        c = l.levelSeparation / 2;
      (e.layout != FamilyTree.mixed && e.layout != FamilyTree.tree) ||
        (c = l.mixedHierarchyNodesSeparation / 2);
      var m = 0,
        h = FamilyTree.getRootOf(e).id,
        p = r[h][e.sl],
        f = void 0;
      if (e.hasPartners) {
        f = {
          ids: [],
          indexes: {},
          ppnodes: {},
          lastLeft: null,
          firstRight: null,
          maxSidePartnersWithChildren: 0,
          rightIds: [],
          leftIds: [],
          partnerChildrenSplitSeparation:
            t.config.partnerChildrenSplitSeparation,
        };
        for (var y = 0; y < e.children.length; y++) {
          (u = e.children[y]).parentPartner
            ? ((f.ppnodes[u.id] = u.parentPartner),
              f.ids.push(u.id),
              1 == u.parentPartner.isPartner
                ? (-1 == f.rightIds.indexOf(u.parentPartner.id) &&
                    f.rightIds.push(u.parentPartner.id),
                  (f.indexes[u.id] = f.rightIds.indexOf(u.parentPartner.id)),
                  f.firstRight || (f.firstRight = u))
                : 2 == u.parentPartner.isPartner &&
                  (-1 == f.leftIds.indexOf(u.parentPartner.id) &&
                    f.leftIds.push(u.parentPartner.id),
                  (f.indexes[u.id] = f.leftIds.indexOf(u.parentPartner.id)),
                  (f.lastLeft = u)))
            : u.isPartner ||
              ((f.lastLeft = u), f.firstRight || (f.firstRight = u));
        }
        (f.maxSidePartnersWithChildren = Math.max(
          f.leftIds.length,
          f.rightIds.length
        )),
          (m =
            0 == f.maxSidePartnersWithChildren
              ? t.config.minPartnerSeparation / 2
              : t.config.minPartnerSeparation / 2 +
                f.partnerChildrenSplitSeparation *
                  f.maxSidePartnersWithChildren +
                f.partnerChildrenSplitSeparation / 2);
      }
      for (y = 0; y < e.children.length; y++) {
        var u = e.children[y],
          g = r[h][u.sl],
          b = {
            xa: 0,
            ya: 0,
            xb: 0,
            yb: 0,
            xc: 0,
            yc: 0,
            xd: 0,
            yd: 0,
            x: 0,
            y: 0,
            rotate: 0,
          },
          T = (s = FamilyTree.t(u.templateName, u.min, i)).link;
        if (f && -1 != f.ids.indexOf(u.id))
          switch (l.orientation) {
            case FamilyTree.orientation.top:
            case FamilyTree.orientation.top_left:
              b = FamilyTree.ui._linkPpTop(f, e, u, g, p, s);
              break;
            case FamilyTree.orientation.bottom:
            case FamilyTree.orientation.bottom_left:
              b = FamilyTree.ui._linkPpBottom(f, e, u, g, p, s);
              break;
            case FamilyTree.orientation.right:
            case FamilyTree.orientation.right_top:
              b = FamilyTree.ui._linkPpRight(f, e, u, g, p, s);
              break;
            case FamilyTree.orientation.left:
            case FamilyTree.orientation.left_top:
              b = FamilyTree.ui._linkPpLeft(f, e, u, g, p, s);
          }
        else if (
          (u.isAssistant || 2 == u.layout) &&
          u.rightNeighbor &&
          u.rightNeighbor.isSplit
        )
          switch (l.orientation) {
            case FamilyTree.orientation.top:
            case FamilyTree.orientation.top_left:
            case FamilyTree.orientation.bottom:
            case FamilyTree.orientation.bottom_left:
              b = FamilyTree.ui._linkRightToLeft(u.rightNeighbor, u, s, c);
              break;
            case FamilyTree.orientation.right:
            case FamilyTree.orientation.right_top:
            case FamilyTree.orientation.left:
            case FamilyTree.orientation.left_top:
              b = FamilyTree.ui._linkBottomToTop(u.rightNeighbor, u, s, c);
          }
        else if (
          (u.isAssistant || 2 == u.layout) &&
          u.leftNeighbor &&
          u.leftNeighbor.isSplit
        )
          switch (l.orientation) {
            case FamilyTree.orientation.top:
            case FamilyTree.orientation.top_left:
            case FamilyTree.orientation.bottom:
            case FamilyTree.orientation.bottom_left:
              b = FamilyTree.ui._linkLeftToRight(u.leftNeighbor, u, s, c);
              break;
            case FamilyTree.orientation.right:
            case FamilyTree.orientation.right_top:
            case FamilyTree.orientation.left:
            case FamilyTree.orientation.left_top:
              b = FamilyTree.ui._linkTopToBottom(u.leftNeighbor, u, s, c);
          }
        else
          switch (l.orientation) {
            case FamilyTree.orientation.top:
            case FamilyTree.orientation.top_left:
              if (1 == u.isPartner)
                b = FamilyTree.ui._linkLeftToRight(e, u, s, m);
              else if (2 == u.isPartner)
                b = FamilyTree.ui._linkRightToLeft(e, u, s, m);
              else {
                var v = 1 == u.layout ? void 0 : g.minY - (g.minY - p.maxY) / 2;
                b = FamilyTree.ui._linkTopToBottom(e, u, s, c, v);
              }
              break;
            case FamilyTree.orientation.bottom:
            case FamilyTree.orientation.bottom_left:
              if (1 == u.isPartner)
                b = FamilyTree.ui._linkLeftToRight(e, u, s, m);
              else if (2 == u.isPartner)
                b = FamilyTree.ui._linkRightToLeft(e, u, s, m);
              else {
                v = 1 == u.layout ? void 0 : g.maxY - (g.maxY - p.minY) / 2;
                b = FamilyTree.ui._linkBottomToTop(e, u, s, c, v);
              }
              break;
            case FamilyTree.orientation.right:
            case FamilyTree.orientation.right_top:
              if (1 == u.isPartner)
                b = FamilyTree.ui._linkTopToBottom(e, u, s, m);
              else if (2 == u.isPartner)
                b = FamilyTree.ui._linkBottomToTop(e, u, s, m);
              else {
                v = 1 == u.layout ? void 0 : g.maxX - (g.maxX - p.minX) / 2;
                b = FamilyTree.ui._linkRightToLeft(e, u, s, c, v);
              }
              break;
            case FamilyTree.orientation.left:
            case FamilyTree.orientation.left_top:
              if (1 == u.isPartner)
                b = FamilyTree.ui._linkTopToBottom(e, u, s, m);
              else if (2 == u.isPartner)
                b = FamilyTree.ui._linkBottomToTop(e, u, s, m);
              else {
                v = 1 == u.layout ? void 0 : g.minX - (g.minX - p.maxX) / 2;
                b = FamilyTree.ui._linkLeftToRight(e, u, s, c, v);
              }
          }
        if (-1 != T.indexOf("{rounded}"))
          if (
            (b.xa == b.xb && b.xa == b.xc && b.xa == b.xd) ||
            (b.ya == b.yb && b.ya == b.yc && b.ya == b.yd)
          )
            T = T.replace(
              "{rounded}",
              "M" + b.xa + "," + b.ya + " L" + b.xd + "," + b.yd
            );
          else {
            var F = FamilyTree.ui._roundedEdge(
                b.xa,
                b.ya,
                b.xb,
                b.yb,
                b.xc,
                b.yc
              ),
              x = FamilyTree.ui._roundedEdge(
                b.xb,
                b.yb,
                b.xc,
                b.yc,
                b.xd,
                b.yd
              );
            T = T.replace(
              "{rounded}",
              "M" +
                F.x1 +
                "," +
                F.y1 +
                " " +
                F.x2 +
                "," +
                F.y2 +
                " Q" +
                F.qx1 +
                "," +
                F.qy1 +
                " " +
                F.qx2 +
                "," +
                F.qy2 +
                " L" +
                x.x2 +
                "," +
                x.y2 +
                " Q" +
                x.qx1 +
                "," +
                x.qy1 +
                " " +
                x.qx2 +
                "," +
                x.qy2 +
                " L" +
                x.x3 +
                "," +
                x.y3
            );
          }
        else
          T =
            -1 != T.indexOf("{edge}")
              ? T.replace(
                  "{edge}",
                  "M" +
                    b.xa +
                    "," +
                    b.ya +
                    " " +
                    b.xb +
                    "," +
                    b.yb +
                    " " +
                    b.xc +
                    "," +
                    b.yc +
                    " L" +
                    b.xd +
                    "," +
                    b.yd
                )
              : -1 != T.indexOf("{curve}")
              ? T.replace(
                  "{curve}",
                  "M" +
                    b.xa +
                    "," +
                    b.ya +
                    " C" +
                    b.xb +
                    "," +
                    b.yb +
                    " " +
                    b.xc +
                    "," +
                    b.yc +
                    " " +
                    b.xd +
                    "," +
                    b.yd
                )
              : T.replaceAll("{xa}", b.xa)
                  .replaceAll("{ya}", b.ya)
                  .replaceAll("{xb}", b.xb)
                  .replaceAll("{yb}", b.yb)
                  .replaceAll("{xc}", b.xc)
                  .replaceAll("{yc}", b.yc)
                  .replaceAll("{xd}", b.xd)
                  .replaceAll("{yd}", b.yd);
        d.push(
          FamilyTree.linkOpenTag
            .replace("{id}", e.id)
            .replace("{class}", "link " + u.tags.join(" "))
            .replace("{child-id}", u.id)
        );
        var _ = {
          node: e,
          cnode: u,
          p: b,
          html: T,
          action: n,
        };
        FamilyTree.events.publish("render-link", [t, _]), d.push(_.html);
        var w = "";
        for (var k in t.config.linkBinding) {
          var S = t.config.linkBinding[k],
            C = t._get(u.id);
          if (C) {
            var N = C[S];
            (_.value = N),
              (_.element = s[k]),
              (_.name = S),
              !1 !== FamilyTree.events.publish("label", [t, _]) &&
                (FamilyTree.isNEU(_.value) ||
                  FamilyTree.isNEU(_.element) ||
                  (w += _.element.replace("{val}", _.value)));
          }
        }
        "" != w &&
          ((w =
            FamilyTree.linkFieldsOpenTag
              .replace("{x}", b.x)
              .replace("{y}", b.y)
              .replace("{rotate}", 0) +
            w +
            FamilyTree.grCloseTag),
          d.push(w)),
          d.push(FamilyTree.grCloseTag);
      }
      return d.join("");
    },
    svg: function (e, t, i, r, a, n) {
      return FamilyTree.t(r.template, !1, n)
        .svg.replace("{w}", e)
        .replace("{h}", t)
        .replace("{viewBox}", i)
        .replace("{randId}", FamilyTree.ui._defsIds[r.template])
        .replace("{mode}", r.mode)
        .replace("{template}", r.template)
        .replace("{content}", function () {
          return a;
        });
    },
    menuButton: function (e) {
      return null == e.menu
        ? ""
        : FamilyTree.t(e.template, !1).menuButton.replaceAll("{p}", e.padding);
    },
    _roundedEdge: function (e, t, i, r, a, n) {
      var o = FamilyTree.LINK_ROUNDED_CORNERS;
      Math.abs(e - a) < o && (o = 0), Math.abs(t - n) < o && (o = 0);
      var l,
        s,
        d,
        c = 0;
      return (
        (e == i && e == a) || (t == r && t == n)
          ? ((l = d = i), (s = c = r))
          : (e != a &&
              i == a &&
              ((l = d = i),
              (s = r),
              t < n ? (c = r + o) : t > n && (c = r - o)),
            e < a && i == a ? (i -= o) : e > a && i == a && (i += o),
            t != n &&
              r == n &&
              ((l = i),
              (s = c = r),
              e < a ? (d = i + o) : e > a && (d = i - o)),
            t < n && r == n ? (r -= o) : t > n && r == n && (r += o)),
        {
          x1: e,
          y1: t,
          x2: i,
          y2: r,
          x3: a,
          y3: n,
          qx1: l,
          qy1: s,
          qx2: d,
          qy2: c,
        }
      );
    },
    _linkTopToBottom: function (e, t, i, r, a) {
      var n,
        o,
        l,
        s,
        d,
        c = 0;
      return (
        (n = e.x + e.w / 2 + i.linkAdjuster.toX),
        (o = e.y + e.h + i.linkAdjuster.toY),
        (s = l = t.x + t.w / 2 + i.linkAdjuster.fromX),
        (d = t.y + i.linkAdjuster.fromY),
        {
          xa: n,
          ya: o,
          xb: n,
          yb: (c =
            e.rightNeighbor &&
            e.rightNeighbor.isAssistant &&
            "split" == t.templateName
              ? e.rightNeighbor.y + e.rightNeighbor.h + r
              : "split" != e.templateName || (!t.isAssistant && 2 != t.layout)
              ? "split" == t.templateName
                ? o + r
                : null != a
                ? a
                : d - r
              : d),
          xc: l,
          yc: c,
          xd: s,
          yd: d,
          x: l,
          y: c + 16,
          rotate: 0,
        }
      );
    },
    _linkBottomToTop: function (e, t, i, r, a) {
      var n,
        o,
        l,
        s,
        d,
        c = 0;
      return (
        (n = e.x + e.w / 2 + i.linkAdjuster.toX),
        (o = e.y + i.linkAdjuster.toY),
        (s = l = t.x + t.w / 2 + i.linkAdjuster.fromX),
        (d = t.y + t.h + i.linkAdjuster.fromY),
        {
          xa: n,
          ya: o,
          xb: n,
          yb: (c =
            e.rightNeighbor &&
            e.rightNeighbor.isAssistant &&
            "split" == t.templateName
              ? e.rightNeighbor.y - r
              : "split" != e.templateName || (!t.isAssistant && 2 != t.layout)
              ? "split" == t.templateName
                ? o - r
                : null != a
                ? a
                : d + r
              : d),
          xc: l,
          yc: c,
          xd: s,
          yd: d,
          x: l,
          y: c - 14,
          rotate: 0,
        }
      );
    },
    _linkRightToLeft: function (e, t, i, r, a) {
      var n,
        o,
        l,
        s,
        d,
        c,
        m = 0;
      return (
        (n = e.x + i.linkAdjuster.toX),
        (o = e.y + e.h / 2 + i.linkAdjuster.toY),
        (d = t.x + t.w + i.linkAdjuster.fromX),
        (c = s = t.y + t.h / 2 + i.linkAdjuster.fromY),
        (l = o),
        90,
        {
          xa: n,
          ya: o,
          xb: (m =
            e.rightNeighbor &&
            e.rightNeighbor.isAssistant &&
            "split" == t.templateName
              ? e.rightNeighbor.x - r
              : "split" != e.templateName || (!t.isAssistant && 2 != t.layout)
              ? "split" == t.templateName
                ? n - r
                : null != a
                ? a
                : d + r
              : d),
          yb: l,
          xc: m,
          yc: s,
          xd: d,
          yd: c,
          x: m - 16,
          y: s,
          rotate: 90,
        }
      );
    },
    _linkLeftToRight: function (e, t, i, r, a) {
      var n,
        o,
        l,
        s,
        d,
        c,
        m = 0;
      return (
        (n = e.x + e.w + i.linkAdjuster.toX),
        (o = e.y + e.h / 2 + i.linkAdjuster.toY),
        (d = t.x + i.linkAdjuster.fromX),
        (c = s = t.y + t.h / 2 + i.linkAdjuster.fromY),
        (l = o),
        270,
        {
          xa: n,
          ya: o,
          xb: (m =
            e.rightNeighbor &&
            e.rightNeighbor.isAssistant &&
            "split" == t.templateName
              ? e.rightNeighbor.x + e.rightNeighbor.w + r
              : "split" != e.templateName || (!t.isAssistant && 2 != t.layout)
              ? "split" == t.templateName
                ? n + r
                : null != a
                ? a
                : d - r
              : d),
          yb: l,
          xc: m,
          yc: s,
          xd: d,
          yd: c,
          x: m + 14,
          y: s,
          rotate: 270,
        }
      );
    },
    _linkPpTop: function (e, t, i, r, a, n) {
      var o = e.ppnodes[i.id],
        l = o.y + o.h / 2,
        s = r.minY - (r.minY - a.maxY) / 2,
        d = (r.minY - a.maxY) / e.maxSidePartnersWithChildren / 4,
        c = FamilyTree.ui.__linkPpBottomTop(e, t, i, s, d, o),
        m = c.x;
      return (
        (s = c.mid),
        FamilyTree.ui._linkTopToBottom(
          {
            x: m,
            y: l,
            w: 0,
            h: 0,
          },
          i,
          n,
          0,
          s
        )
      );
    },
    _linkPpBottom: function (e, t, i, r, a, n) {
      var o = e.ppnodes[i.id],
        l = o.y + o.h / 2,
        s = r.maxY - (r.maxY - a.minY) / 2,
        d = (r.maxY - a.minY) / e.maxSidePartnersWithChildren / 4,
        c = FamilyTree.ui.__linkPpBottomTop(e, t, i, s, d, o),
        m = c.x;
      return (
        (s = c.mid),
        FamilyTree.ui._linkBottomToTop(
          {
            x: m,
            y: l,
            w: 0,
            h: 0,
          },
          i,
          n,
          0,
          s
        )
      );
    },
    _linkPpLeft: function (e, t, i, r, a, n) {
      var o = e.ppnodes[i.id],
        l = r.minX - (r.minX - a.maxX) / 2,
        s = (r.minX - a.maxX) / e.maxSidePartnersWithChildren / 4,
        d = o.x + o.w / 2,
        c = FamilyTree.ui.__linkPpLeftRight(e, t, i, l, s, o),
        m = c.y;
      return (
        (l = c.mid),
        FamilyTree.ui._linkLeftToRight(
          {
            x: d,
            y: m,
            w: 0,
            h: 0,
          },
          i,
          n,
          0,
          l
        )
      );
    },
    _linkPpRight: function (e, t, i, r, a, n) {
      var o = e.ppnodes[i.id],
        l = r.maxX - (r.maxX - a.minX) / 2,
        s = (r.maxX - a.minX) / e.maxSidePartnersWithChildren / 4,
        d = o.x + o.w / 2,
        c = FamilyTree.ui.__linkPpLeftRight(e, t, i, l, s, o),
        m = c.y;
      return (
        (l = c.mid),
        FamilyTree.ui._linkRightToLeft(
          {
            x: d,
            y: m,
            w: 0,
            h: 0,
          },
          i,
          n,
          0,
          l
        )
      );
    },
    __linkPpBottomTop: function (e, t, i, r, a, n) {
      var o = 0;
      return (
        1 == n.isPartner
          ? ((o =
              n.x -
              t.partnerSeparation / 2 +
              e.indexes[i.id] * e.partnerChildrenSplitSeparation -
              ((e.rightIds.length - 1) * e.partnerChildrenSplitSeparation) / 2),
            e.lastLeft && o < e.lastLeft.x + e.lastLeft.w / 2
              ? o < i.x + i.w / 2
                ? (r -= (e.indexes[i.id] + 1) * a)
                : (r -= (e.rightIds.length - e.indexes[i.id]) * a)
              : o < i.x + i.w / 2
              ? (r += (e.rightIds.length - e.indexes[i.id]) * a)
              : (r += (e.indexes[i.id] + 1) * a))
          : 2 == n.isPartner &&
            ((o =
              n.x +
              n.w +
              t.partnerSeparation / 2 +
              e.indexes[i.id] * e.partnerChildrenSplitSeparation -
              ((e.leftIds.length - 1) * e.partnerChildrenSplitSeparation) / 2),
            e.firstRight && o > e.firstRight.x + e.firstRight.w / 2
              ? o < i.x + i.w / 2
                ? (r -= (e.indexes[i.id] + 1) * a)
                : (r -= (e.leftIds.length - e.indexes[i.id]) * a)
              : o < i.x + i.w / 2
              ? (r += (e.leftIds.length - e.indexes[i.id]) * a)
              : (r += (e.indexes[i.id] + 1) * a)),
        {
          x: o,
          mid: r,
        }
      );
    },
    __linkPpLeftRight: function (e, t, i, r, a, n) {
      var o = 0;
      return (
        1 == n.isPartner
          ? ((o =
              n.y -
              t.partnerSeparation / 2 +
              e.indexes[i.id] * e.partnerChildrenSplitSeparation -
              ((e.rightIds.length - 1) * e.partnerChildrenSplitSeparation) / 2),
            e.lastLeft && o < e.lastLeft.y + e.lastLeft.h / 2
              ? o < i.y + i.h / 2
                ? (r -= (e.indexes[i.id] + 1) * a)
                : (r -= (e.rightIds.length - e.indexes[i.id]) * a)
              : o < i.y + i.h / 2
              ? (r += (e.rightIds.length - e.indexes[i.id]) * a)
              : (r += (e.indexes[i.id] + 1) * a))
          : 2 == n.isPartner &&
            ((o =
              n.y +
              n.h +
              t.partnerSeparation / 2 +
              e.indexes[i.id] * e.partnerChildrenSplitSeparation -
              ((e.leftIds.length - 1) * e.partnerChildrenSplitSeparation) / 2),
            e.firstRight && o > e.firstRight.y + e.firstRight.h / 2
              ? o < i.y + i.h / 2
                ? (r -= (e.indexes[i.id] + 1) * a)
                : (r -= (e.leftIds.length - e.indexes[i.id]) * a)
              : o < i.y + i.h / 2
              ? (r += (e.leftIds.length - e.indexes[i.id]) * a)
              : (r += (e.indexes[i.id] + 1) * a)),
        {
          y: o,
          mid: r,
        }
      );
    },
  }),
  (FamilyTree.ui._base_nodeBtns = FamilyTree.ui.nodeBtns),
  (FamilyTree.ui.nodeBtns = function (e, t, i, r, a) {
    var n = "";
    if (a._tree_menu_temp)
      !t.isSplit &&
        i !== FamilyTree.action.exporting &&
        r.nodeTreeMenuCloseButton &&
        a._tree_menu_temp.id == t.id &&
        (n += r.nodeTreeMenuCloseButton);
    else {
      n = FamilyTree.ui._base_nodeBtns(e, t, i, r, a);
      null != e.nodeTreeMenu &&
        !t.isSplit &&
        i !== FamilyTree.action.exporting &&
        r.nodeTreeMenuButton &&
        (n += r.nodeTreeMenuButton.replace("{id}", t.id));
    }
    return n;
  }),
  (FamilyTree.ui._base_expandCollapseBtn = FamilyTree.ui.expandCollapseBtn),
  (FamilyTree.ui.expandCollapseBtn = function (e, t, i, r, a) {
    return e._tree_menu_temp
      ? ""
      : FamilyTree.ui._base_expandCollapseBtn(e, t, i, r, a);
  }),
  (FamilyTree.xScrollUI = function (e, t, i, r, a) {
    (this.element = e),
      (this.requestParams = i),
      (this.config = t),
      (this.onSetViewBoxCallback = r),
      (this.onDrawCallback = a),
      (this.pos = 0);
  }),
  (FamilyTree.xScrollUI.prototype.addListener = function (e) {
    var t = this;
    if (
      (this.config.mouseScrool == FamilyTree.action.xScroll ||
        this.config.mouseScrool == FamilyTree.action.scroll) &&
      this.bar
    ) {
      var i = FamilyTree._getScrollSensitivity();
      !(function (e, i, r) {
        var a = !1;

        function n() {
          a = !0;
          var e = (t.pos - t.bar.scrollLeft) / r;
          if (e > 0) e++;
          else {
            if (0 == e) return void (a = !1);
            e--;
          }
          Math.ceil(t.bar.scrollLeft) == Math.ceil(t.pos)
            ? (a = !1)
            : ((t.bar.scrollLeft += e), o(n));
        }
        e.addEventListener(
          "wheel",
          function (e) {
            var r = 0;
            if (t.config.mouseScrool == FamilyTree.action.xScroll)
              (r = e.deltaX || e.wheelDeltaX) ||
                (r = e.deltaY || e.wheelDeltaY);
            else if (
              t.config.mouseScrool == FamilyTree.action.scroll &&
              !(r = e.shiftKey
                ? e.deltaY || e.wheelDeltaY
                : e.deltaX || e.wheelDeltaX)
            )
              return;
            (r = -r), (r = Math.max(-1, Math.min(1, r))), (t.pos += -r * i);
            var o =
              parseFloat(t.innerBar.clientWidth) -
              parseFloat(t.bar.clientWidth);
            t.pos < 0 && (t.pos = 0);
            t.pos > o && (t.pos = o);
            a || n();
          },
          {
            passive: !0,
          }
        );
        var o =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (e) {
            setTimeout(e, 20);
          };
      })(e, i.speed, i.smooth);
    }
  }),
  (FamilyTree.xScrollUI.prototype.create = function (e) {
    if (
      this.config.showXScroll === FamilyTree.scroll.visible ||
      this.config.mouseScrool === FamilyTree.action.scroll ||
      this.config.mouseScrool === FamilyTree.action.xScroll
    ) {
      var t = this;
      this.bar && this.bar.parentNode.removeChild(this.bar),
        (this.bar = document.createElement("div")),
        this.config.showXScroll !== FamilyTree.scroll.visible &&
          (this.bar.style.visibility = "hidden"),
        (this.innerBar = document.createElement("div"));
      this.requestParams();
      (this.innerBar.innerHTML = "&nbsp"),
        Object.assign(this.bar.style, {
          position: "absolute",
          left: 0,
          bottom: 0,
          width: e + "px",
          "overflow-x": "scroll",
          height: "20px",
        }),
        this.element.appendChild(this.bar),
        this.bar.appendChild(this.innerBar),
        this.bar.addEventListener("scroll", function () {
          if (this.ignore) this.ignore = !1;
          else {
            var e = t.requestParams(),
              i =
                (parseFloat(t.innerBar.clientWidth) -
                  parseFloat(t.bar.clientWidth)) /
                100,
              r = this.scrollLeft / i,
              a = (e.boundary.right - e.boundary.left) / 100;
            (e.viewBox[0] = r * a + e.boundary.left),
              t.onSetViewBoxCallback(e.viewBox),
              clearTimeout(this._timeout),
              (this._timeout = setTimeout(function () {
                t.onDrawCallback();
              }, 500));
          }
        });
    }
  }),
  (FamilyTree.xScrollUI.prototype.setPosition = function () {
    if (this.bar) {
      var e = this.requestParams(),
        t = Math.abs(e.boundary.maxX - e.boundary.minX) * e.scale;
      switch (this.config.orientation) {
        case FamilyTree.orientation.bottom:
        case FamilyTree.orientation.bottom_left:
          innerHeight = Math.abs(e.boundary.minY * e.scale);
          break;
        case FamilyTree.orientation.right:
        case FamilyTree.orientation.right_top:
          t = Math.abs(e.boundary.minX * e.scale);
      }
      this.innerBar.style.width = t + "px";
      var i = (e.boundary.right - e.boundary.left) / 100,
        r = (e.viewBox[0] - e.boundary.left) / i;
      r < 0 ? (r = 0) : r > 100 && (r = 100);
      var a =
          (parseFloat(this.innerBar.clientWidth) -
            parseFloat(this.bar.clientWidth)) /
          100,
        n = r * a;
      (this.bar.ignore = !0),
        (this.bar.scrollLeft = n),
        (this.pos = this.bar.scrollLeft),
        (this.bar.style.visibility = a <= 0 ? "hidden" : "");
    }
  }),
  (FamilyTree.yScrollUI = function (e, t, i, r, a) {
    (this.element = e),
      (this.requestParams = i),
      (this.config = t),
      (this.onSetViewBoxCallback = r),
      (this.onDrawCallback = a),
      (this.pos = 0);
  }),
  (FamilyTree.yScrollUI.prototype.addListener = function (e) {
    var t = this;
    if (
      this.config.mouseScrool == FamilyTree.action.yScroll ||
      this.config.mouseScrool == FamilyTree.action.scroll
    ) {
      var i = FamilyTree._getScrollSensitivity();
      !(function (e, i, r) {
        var a = !1;

        function n() {
          a = !0;
          var e = (t.pos - t.bar.scrollTop) / r;
          if (e > 0) e++;
          else {
            if (0 == e) return void (a = !1);
            e--;
          }
          Math.ceil(t.bar.scrollTop) == Math.ceil(t.pos)
            ? (a = !1)
            : ((t.bar.scrollTop += e), o(n));
        }
        e.addEventListener(
          "wheel",
          function (e) {
            var r = 0;
            if (t.config.mouseScrool == FamilyTree.action.yScroll)
              (r = e.deltaY || e.wheelDeltaY) ||
                (r = e.deltaX || e.wheelDeltaX);
            else if (
              t.config.mouseScrool == FamilyTree.action.scroll &&
              !(r = e.shiftKey
                ? e.deltaX || e.wheelDeltaX
                : e.deltaY || e.wheelDeltaY)
            )
              return;
            (r = -r), (r = Math.max(-1, Math.min(1, r))), (t.pos += -r * i);
            var o =
              parseFloat(t.innerBar.clientHeight) -
              parseFloat(t.bar.clientHeight);
            t.pos < 0 && (t.pos = 0);
            t.pos > o && (t.pos = o);
            a || n();
          },
          {
            passive: !0,
          }
        );
        var o =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (e) {
            setTimeout(e, 20);
          };
      })(e, i.speed, i.smooth);
    }
  }),
  (FamilyTree.yScrollUI.prototype.create = function (e) {
    if (
      this.config.showYScroll === FamilyTree.scroll.visible ||
      this.config.mouseScrool === FamilyTree.action.scroll ||
      this.config.mouseScrool === FamilyTree.action.yScroll
    ) {
      var t = this;
      this.bar && this.bar.parentNode.removeChild(this.bar),
        (this.bar = document.createElement("div")),
        this.config.showYScroll !== FamilyTree.scroll.visible &&
          (this.bar.style.visibility = "hidden"),
        (this.innerBar = document.createElement("div")),
        (this.innerBar.innerHTML = "&nbsp"),
        Object.assign(this.bar.style, {
          position: "absolute",
          right: 0,
          bottom: 0,
          height: e + "px",
          "overflow-y": "scroll",
          width: "20px",
        }),
        this.element.appendChild(this.bar),
        this.bar.appendChild(this.innerBar),
        this.bar.addEventListener("scroll", function () {
          if (this.ignore) this.ignore = !1;
          else {
            var e = t.requestParams(),
              i =
                (parseFloat(t.innerBar.clientHeight) -
                  parseFloat(t.bar.clientHeight)) /
                100,
              r = this.scrollTop / i,
              a = (e.boundary.bottom - e.boundary.top) / 100;
            (e.viewBox[1] = r * a + e.boundary.top),
              t.onSetViewBoxCallback(e.viewBox),
              clearTimeout(this._timeout),
              (this._timeout = setTimeout(function () {
                t.onDrawCallback();
              }, 500));
          }
        });
    }
  }),
  (FamilyTree.yScrollUI.prototype.setPosition = function () {
    if (this.bar) {
      var e = this.requestParams(),
        t = e.boundary.maxY * e.scale;
      switch (this.config.orientation) {
        case FamilyTree.orientation.bottom:
        case FamilyTree.orientation.bottom_left:
          t = Math.abs(e.boundary.minY * e.scale);
          break;
        case FamilyTree.orientation.right:
        case FamilyTree.orientation.right_top:
          innerWidth = Math.abs(e.boundary.minX * e.scale);
      }
      this.innerBar.style.height = t + "px";
      var i = (e.boundary.bottom - e.boundary.top) / 100,
        r = (e.viewBox[1] - e.boundary.top) / Math.abs(i);
      r < 0 ? (r = 0) : r > 100 && (r = 100);
      var a =
          (parseFloat(this.innerBar.clientHeight) -
            parseFloat(this.bar.clientHeight)) /
          100,
        n = r * a;
      (this.bar.ignore = !0),
        (this.bar.scrollTop = n),
        (this.pos = this.bar.scrollTop),
        (this.bar.style.visibility = a <= 0 ? "hidden" : "");
    }
  }),
  (FamilyTree.prototype.zoom = function (e, t, i, r) {
    var a = this.getViewBox().slice(0),
      n = a,
      o = a[2],
      l = a[3];
    !0 === e
      ? ((a[2] = a[2] / FamilyTree.SCALE_FACTOR),
        (a[3] = a[3] / FamilyTree.SCALE_FACTOR))
      : !1 === e
      ? ((a[2] = a[2] * FamilyTree.SCALE_FACTOR),
        (a[3] = a[3] * FamilyTree.SCALE_FACTOR))
      : ((a[2] = a[2] / e), (a[3] = a[3] / e)),
      t || (t = [50, 50]),
      (a[0] = n[0] - (a[2] - o) / (100 / t[0])),
      (a[1] = n[1] - (a[3] - l) / (100 / t[1]));
    var s = this.getScale(a);
    if (
      ((a[2] = this.width() / s),
      (a[3] = this.height() / s),
      (!0 === e && s < this.config.scaleMax) ||
        (!1 === e && s > this.config.scaleMin) ||
        (0 != e &&
          1 != e &&
          s < this.config.scaleMax &&
          s > this.config.scaleMin))
    ) {
      this._hideBeforeAnimation();
      var d = this;
      i
        ? (clearTimeout(d._timeout),
          FamilyTree.anim(
            this.getSvg(),
            {
              viewbox: this.getViewBox(),
            },
            {
              viewbox: a,
            },
            this.config.anim.duration,
            this.config.anim.func,
            function () {
              clearTimeout(d._timeout),
                (d._timeout = setTimeout(function () {
                  d._draw(!0, FamilyTree.action.zoom, null, r);
                }, 500));
            }
          ))
        : (this.setViewBox(a),
          clearTimeout(d._timeout),
          (d._timeout = setTimeout(function () {
            d._draw(!0, FamilyTree.action.zoom, null, r);
          }, 500)));
    }
  }),
  (FamilyTree.loading = {}),
  (FamilyTree.loading.show = function (e) {
    var t = document.createElement("div");
    (t.id = "bft-loading"),
      (t.innerHTML =
        '<style>@-webkit-keyframes dot-keyframes {0% { opacity: .4; -webkit-transform: scale(1, 1);transform: scale(1, 1);}50% {opacity: 1;-webkit-transform: scale(1.2, 1.2);transform: scale(1.2, 1.2);}100% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}}@keyframes dot-keyframes {0% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}50% {opacity: 1;-webkit-transform: scale(1.2, 1.2);transform: scale(1.2, 1.2);}100% {opacity: .4;-webkit-transform: scale(1, 1);transform: scale(1, 1);}}.bft-loading-dots div {margin: 10px;}      .bft-dot-1 {background-color: #039BE5;}.bft-dot-2 {background-color: #F57C00;}.bft-dot-3 {background-color: #FFCA28;}      .bft-loading-dots {text-align: center;width: 100%; position: absolute; top: 0;}.bft-loading-dots--dot {-webkit-animation: dot-keyframes 1.5s infinite ease-in-out;animation: dot-keyframes 1.5s infinite ease-in-out;        border-radius: 10px;display: inline-block;height: 10px;width: 10px;}.bft-loading-dots--dot:nth-child(2) {-webkit-animation-delay: .5s;animation-delay: .5s;}.bft-loading-dots--dot:nth-child(3) {-webkit-animation-delay: 1s;animation-delay: 1s;}</style><div class="bft-loading-dots"><div class="bft-loading-dots--dot bft-dot-1"></div><div class="bft-loading-dots--dot bft-dot-2"></div><div class="bft-loading-dots--dot bft-dot-3"></div></div>'),
      e.element.appendChild(t);
  }),
  (FamilyTree.loading.hide = function (e) {
    var t = e.element.querySelector("#bft-loading");
    t && t.parentNode.removeChild(t);
  }),
  (FamilyTree.pdfPrevUI = {}),
  FamilyTree.loc || (FamilyTree.loc = {}),
  (FamilyTree.loc.ppdfCmdTitle = "PDF Preview"),
  (FamilyTree.loc.ppdfSave = "Save"),
  (FamilyTree.loc.ppdfCancel = "Cancel"),
  (FamilyTree.loc.ppdfFormat = "Format"),
  (FamilyTree.loc.ppdfFitToDrwaing = "Fit"),
  (FamilyTree.loc.ppdfA4 = "A4"),
  (FamilyTree.loc.ppdfA3 = "A3"),
  (FamilyTree.loc.ppdfA2 = "A2"),
  (FamilyTree.loc.ppdfA1 = "A1"),
  (FamilyTree.loc.ppdfLetter = "Letter"),
  (FamilyTree.loc.ppdfLegal = "Legal"),
  (FamilyTree.loc.ppdfLayout = "Layout"),
  (FamilyTree.loc.ppdfPortrait = "Portrait"),
  (FamilyTree.loc.ppdfLandscape = "Landscape"),
  (FamilyTree.loc.ppdfFittopagewidth = "Fit to page width"),
  (FamilyTree.loc.ppdfMargin = "Margin"),
  (FamilyTree.loc.ppdfHeader = "Header"),
  (FamilyTree.loc.ppdfFooter = "Footer"),
  (FamilyTree.loc.ppdfScale = "Scale"),
  (FamilyTree.pdfPrevUI.show = function (e, t) {
    t = e._defaultExportOptions(t, "pdf");
    var i = document.createElement("div");
    i.classList.add(e.config.mode),
      (i.id = "bft-ppdf-btns"),
      Object.assign(i.style, {
        position: "absolute",
        top: 0,
        left: 0,
        "background-color": "#fff",
        "z-index": 5,
        margin: "0 0 0 -265px",
        "box-shadow":
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        width: "265px",
        height: "100%",
        "font-family": "Roboto,Figtree",
        color: "#757575",
        "text-align": "right",
        padding: "10px",
      }),
      e.element.appendChild(i),
      (i.innerHTML =
        "<h1>" +
        FamilyTree.loc.ppdfCmdTitle +
        '</h1><div><button type="button" id="bft-prev-save" style="font-size: 14px; width: 90px;">' +
        FamilyTree.loc.ppdfSave +
        '</button>&nbsp;<button type="button" id="bft-prev-cancel" style="width: 90px;font-size: 14px;">' +
        FamilyTree.loc.ppdfCancel +
        '</button></div><div style="margin-top:30px; height:10px;border-bottom:1px solid #eeeeee;"></div><div style="padding-top:30px;"><label for="bft-size">' +
        FamilyTree.loc.ppdfFormat +
        ': </label><select id="bft-ppdf-size" style="color: #757575; width: 150px; font-size: 14px;" id="bft-size"><option value="fit">' +
        FamilyTree.loc.ppdfFitToDrwaing +
        '</option><option value="A4">' +
        FamilyTree.loc.ppdfA4 +
        '</option><option value="A3">' +
        FamilyTree.loc.ppdfA3 +
        '</option><option value="A2">' +
        FamilyTree.loc.ppdfA2 +
        '</option><option value="A1">' +
        FamilyTree.loc.ppdfA1 +
        '</option><option value="Letter">' +
        FamilyTree.loc.ppdfLetter +
        '</option><option value="Legal">' +
        FamilyTree.loc.ppdfLegal +
        '</option></select></div><div style="padding-top:10px;"><label for="bft-ppdf-layout">' +
        FamilyTree.loc.ppdfLayout +
        ': </label><select id="bft-ppdf-layout" style="color: #757575; width: 150px;font-size: 14px;" ><option value="false">' +
        FamilyTree.loc.ppdfPortrait +
        '</option><option value="true">' +
        FamilyTree.loc.ppdfLandscape +
        '</option></select></div><div style="padding-top:10px;"><label for="bft-scale">' +
        FamilyTree.loc.ppdfScale +
        ': </label><select id="bft-ppdf-scale" style="color: #757575; width: 150px;font-size: 14px;" id="bft-scale"><option value="fit">' +
        FamilyTree.loc.ppdfFittopagewidth +
        '</option><option value="10">10%</option><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option><option value="50">50%</option><option value="60">60%</option><option value="70">70%</option><option value="80">80%</option><option value="90">90%</option><option value="100">100%</option><option value="110">110%</option><option value="120">120%</option><option value="130">130%</option><option value="140">140%</option><option value="150">150%</option><option value="160">160%</option><option value="170">170%</option><option value="180">180%</option><option value="190">190%</option><option value="200">200%</option></select></div><div style="margin-top:10px;margin-bottom:10px; height:10px;border-bottom:1px solid #eeeeee;"></div><div style="padding-top:10px;"><label for="bft-ppdf-header">' +
        FamilyTree.loc.ppdfHeader +
        ': </label><input id="bft-ppdf-header" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div><div style="padding-top:10px;"><label for="bft-ppdf-footer">' +
        FamilyTree.loc.ppdfFooter +
        ': </label><input id="bft-ppdf-footer" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div><div style="padding-top:10px;"><label for="bft-ppdf-margin">' +
        FamilyTree.loc.ppdfMargin +
        ': </label><input id="bft-ppdf-margin" type="text" style="color: #757575; width: 100px;font-size: 14px;" ></div>');
    var r = document.createElement("div");
    (r.id = "bft-ppdf-wrapper"),
      Object.assign(r.style, {
        "overflow-y": "scroll",
        "z-index": 11,
        position: "absolute",
        top: 0,
        left: "285px",
        "background-color": "#eee",
        width: e.width() - 270 + "px",
        height: "100%",
      }),
      e.element.appendChild(r),
      (r.innerHTML =
        '<div id="bft-ppdf-content" style="width: 100%;margin-top:10px;margin-bottom:10px;opacity:0;"></div>');
    var a,
      n,
      o,
      l = e.element.querySelector("#bft-ppdf-size"),
      s = e.element.querySelector("#bft-ppdf-layout"),
      d = e.element.querySelector("#bft-ppdf-scale"),
      c = e.element.querySelector("#bft-ppdf-margin"),
      m = e.element.querySelector("#bft-ppdf-header"),
      h = e.element.querySelector("#bft-ppdf-footer");
    (l.value = t.format),
      (s.value = t.landscape),
      (d.value = t.scale),
      (c.value = t.margin),
      (m.value = t.header),
      (h.value = t.footer),
      FamilyTree.anim(
        e.element.querySelector("#bft-ppdf-btns"),
        {
          margin: [0, 0, 0, -250],
        },
        {
          margin: [0, 0, 0, 0],
        },
        300,
        FamilyTree.anim.outSin,
        function () {
          e.exportPDF(t, FamilyTree.pdfPrevUI._handler);
        }
      ),
      e.element
        .querySelector("#bft-prev-cancel")
        .addEventListener("click", function () {
          FamilyTree.pdfPrevUI.hide(e);
        }),
      e.element
        .querySelector("#bft-prev-save")
        .addEventListener("click", function () {
          e.exportPDF(t), FamilyTree.pdfPrevUI.hide(e);
        }),
      FamilyTree.pdfPrevUI._showHide(l, s, d),
      l.addEventListener("change", function () {
        FamilyTree.anim(
          e.element.querySelector("#bft-ppdf-content"),
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
          300,
          FamilyTree.anim.inSin,
          function () {
            (e.element.querySelector("#bft-ppdf-content").innerHTML = ""),
              (t.format = l.value),
              e.exportPDF(t, FamilyTree.pdfPrevUI._handler),
              FamilyTree.pdfPrevUI._showHide(l, s, d);
          }
        );
      }),
      s.addEventListener("change", function () {
        FamilyTree.anim(
          e.element.querySelector("#bft-ppdf-content"),
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
          300,
          FamilyTree.anim.inSin,
          function () {
            (e.element.querySelector("#bft-ppdf-content").innerHTML = ""),
              (t.landscape = "true" == s.value),
              e.exportPDF(t, FamilyTree.pdfPrevUI._handler),
              FamilyTree.pdfPrevUI._showHide(l, s, d);
          }
        );
      }),
      d.addEventListener("change", function () {
        FamilyTree.anim(
          e.element.querySelector("#bft-ppdf-content"),
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
          300,
          FamilyTree.anim.inSin,
          function () {
            (e.element.querySelector("#bft-ppdf-content").innerHTML = ""),
              (t.scale = d.value),
              e.exportPDF(t, FamilyTree.pdfPrevUI._handler),
              FamilyTree.pdfPrevUI._showHide(l, s, d);
          }
        );
      }),
      c.addEventListener("keyup", function () {
        clearTimeout(a),
          (a = setTimeout(function () {
            FamilyTree.anim(
              e.element.querySelector("#bft-ppdf-content"),
              {
                opacity: 1,
              },
              {
                opacity: 0,
              },
              300,
              FamilyTree.anim.inSin,
              function () {
                e.element.querySelector("#bft-ppdf-content").innerHTML = "";
                var i = c.value.split(",");
                if (4 == i.length) {
                  for (var r = 0; r < i.length; r++) i[r] = parseInt(i[r]);
                  (t.margin = i), e.exportPDF(t, FamilyTree.pdfPrevUI._handler);
                }
              }
            );
          }, 1e3));
      }),
      m.addEventListener("keyup", function () {
        clearTimeout(n),
          (n = setTimeout(function () {
            FamilyTree.anim(
              e.element.querySelector("#bft-ppdf-content"),
              {
                opacity: 1,
              },
              {
                opacity: 0,
              },
              300,
              FamilyTree.anim.inSin,
              function () {
                (e.element.querySelector("#bft-ppdf-content").innerHTML = ""),
                  (t.header = m.value),
                  e.exportPDF(t, FamilyTree.pdfPrevUI._handler);
              }
            );
          }, 1e3));
      }),
      h.addEventListener("keyup", function () {
        clearTimeout(o),
          (o = setTimeout(function () {
            FamilyTree.anim(
              e.element.querySelector("#bft-ppdf-content"),
              {
                opacity: 1,
              },
              {
                opacity: 0,
              },
              300,
              FamilyTree.anim.inSin,
              function () {
                (e.element.querySelector("#bft-ppdf-content").innerHTML = ""),
                  (t.footer = h.value),
                  e.exportPDF(t, FamilyTree.pdfPrevUI._handler);
              }
            );
          }, 1e3));
      });
  }),
  (FamilyTree.pdfPrevUI._showHide = function (e, t, i) {
    "A4" == e.value ||
    "A3" == e.value ||
    "A2" == e.value ||
    "A1" == e.value ||
    "Letter" == e.value ||
    "Legal" == e.value
      ? ((t.parentNode.style.display = "block"),
        (i.parentNode.style.display = "block"))
      : ((t.parentNode.style.display = "none"),
        (i.parentNode.style.display = "none"));
  }),
  (FamilyTree.pdfPrevUI._handler = function (e, t, i) {
    var r = t.options,
      a = t.pages,
      n = r.margin[0],
      o = r.margin[2],
      l = document.createElement("div");
    l.classList.add(e.config.mode),
      (l.innerHTML = i.outerHTML),
      FamilyTree._browser().msie &&
        (l.innerHTML = new XMLSerializer().serializeToString(i));
    for (
      var s = l.querySelector("svg"),
        d = e.element.querySelector("#bft-ppdf-content"),
        c = 0;
      c < a.length;
      c++
    ) {
      var m = document.createElement("iframe");
      Object.assign(m.style, {
        display: "block",
        margin: "10px auto",
        border: "1px solid #eeeeee",
        "box-shadow":
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }),
        d.appendChild(m),
        s && s.style.backgroundColor
          ? (m.style.backgroundColor = s.style.backgroundColor)
          : (m.style.backgroundColor = "#fff");
      var h = m.contentWindow.document;
      h.open(),
        (m.style.width = a[c].size.w + "px"),
        (m.style.height = a[c].size.h + "px"),
        (m.style.margin = "10 auto"),
        a[c].backgroundColor &&
          (m.style.backgroundColor = a[c].backgroundColor);
      var p = r.header;
      a[c].header && (p = a[c].header),
        p &&
          (p = p
            .replace("{current-page}", c + 1)
            .replace("{total-pages}", a.length));
      var f = r.footer;
      a[c].footer && (f = a[c].footer),
        f &&
          (f = f
            .replace("{current-page}", c + 1)
            .replace("{total-pages}", a.length)),
        a[c].html
          ? h.write(
              FamilyTree._exportHtml(
                a[c].html,
                t.styles,
                r,
                a[c].innerSize.w,
                a[c].innerSize.h,
                p,
                f,
                e.config.mode
              )
            )
          : (s.setAttribute("viewBox", a[c].vb),
            h.write(
              FamilyTree._exportHtml(
                l.innerHTML,
                t.styles,
                r,
                a[c].innerSize.w,
                a[c].innerSize.h,
                p,
                f,
                e.config.mode
              )
            ));
      var y = h.getElementById("bft-header"),
        u = h.getElementById("bft-footer");
      if (y) {
        var g = n - y.offsetHeight - 7;
        y.style.top = g + "px";
      }
      if (u) {
        var b = o - u.offsetHeight - 7;
        u.style.bottom = b + "px";
      }
      h.close();
    }
    var T = e.element.querySelector("#bft-ppdf-content");
    FamilyTree.anim(
      T,
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
      300,
      FamilyTree.anim.outSin
    );
  }),
  (FamilyTree.pdfPrevUI._getViewBox = function (e) {
    var t = null;
    return e
      ? ((t = (t = "[" + (t = e.getAttribute("viewBox")) + "]").replace(
          /\ /g,
          ","
        )),
        (t = JSON.parse(t)))
      : null;
  }),
  (FamilyTree._exportHtml = function (e, t, i, r, a, n, o, l) {
    for (var s = "", d = 0; d < i.margin.length; d++) s += i.margin[d] + "px ";
    var c =
      '<!DOCTYPE html><html style="margin:0;padding:0;"><head></head>' +
      t +
      '<body class="' +
      l +
      '" style="margin:0; padding:0;"><div style="margin: ' +
      s +
      ";overflow:hidden;width:" +
      r +
      "px;height:" +
      a +
      'px">';
    return (
      n &&
        (c +=
          '<div id="bft-header" style="width:' +
          r +
          "px;color:#757575;position:absolute;left:" +
          i.margin[3] +
          'px;top:0;">' +
          n +
          "</div>"),
      (c += e),
      o &&
        (c +=
          '<div id="bft-footer" style="width:' +
          r +
          "px;color:#757575;position:absolute;left:" +
          i.margin[3] +
          'px;bottom:0;">' +
          o +
          "</div>"),
      (c += "</div>"),
      (c += "</body></html>")
    );
  }),
  (FamilyTree.pdfPrevUI.hide = function (e) {
    var t = e.element.querySelector("#bft-ppdf-wrapper");
    t &&
      FamilyTree.anim(
        t,
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
        300,
        FamilyTree.anim.inSin,
        function () {
          t.parentNode.removeChild(t);
          var i = e.element.querySelector("#bft-ppdf-btns");
          FamilyTree.anim(
            i,
            {
              margin: [0, 0, 0, 0],
            },
            {
              margin: [0, 0, 0, -280],
            },
            300,
            FamilyTree.anim.inSin,
            function () {
              i.parentNode.removeChild(i);
            }
          );
        }
      );
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  FamilyTree.events.on("renderdefs", function (e, t) {
    for (var i = 0; i < e.config.clinks.length; i++) {
      var r = e.config.clinks[i].template;
      r || (r = "orange");
      var a = FamilyTree.clinkTemplates[r];
      t.defs += a.defs;
    }
  }),
  FamilyTree.events.on("render", function (e, t) {
    e._clink(e, t);
  }),
  (FamilyTree.prototype._clink = function (e, t) {
    for (var i, r, a, n, o, l = "", s = 0; s < this.config.clinks.length; s++) {
      var d = this.config.clinks[s],
        c = e.getNode(d.from),
        m = e.getNode(d.to);
      if (
        c &&
        -1 != t.res.visibleNodeIds.indexOf(c.id) &&
        m &&
        -1 != t.res.visibleNodeIds.indexOf(m.id)
      ) {
        var h = c.x,
          p = c.y,
          f = m.x,
          y = m.y,
          u = {},
          g = {},
          b = h + c.w / 2,
          T = f + m.w / 2,
          v = p + c.h / 2,
          F = y + m.h / 2,
          x = 1;
        switch (this.config.orientation) {
          case FamilyTree.orientation.top:
          case FamilyTree.orientation.top_left:
            b <= T
              ? ((x = 1), (u.x = b + c.w / 10), (g.x = T - m.w / 10))
              : ((x = -1), (u.x = b - c.w / 10), (g.x = T + m.w / 10)),
              p == y
                ? ((x = 1), (u.y = p), (g.y = y))
                : p > y
                ? ((u.y = p), (g.y = y + m.h))
                : ((u.y = p + c.h), (g.y = y));
            break;
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            b <= T
              ? ((x = -1), (u.x = b + c.w / 10), (g.x = T + m.w / 10))
              : ((x = 1), (u.x = b - c.w / 10), (g.x = T + m.w / 10)),
              p == y
                ? ((x = -1), (u.y = p + c.h), (g.y = y + m.h))
                : p > y
                ? ((u.y = p), (g.y = y + m.h))
                : ((u.y = p + c.h), (g.y = y));
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.left_top:
            v <= F
              ? ((x = -1), (u.y = v + c.h / 5), (g.y = F + m.h / 5))
              : ((x = 1), (u.y = v - c.h / 5), (g.y = F + m.h / 5)),
              h == f
                ? ((x = -1), (u.x = h), (g.x = f))
                : h > f
                ? ((u.x = h), (g.x = f + m.w))
                : ((u.x = h + c.w), (g.x = f));
            break;
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            v <= F
              ? ((x = 1), (u.y = v + c.h / 5), (g.y = F + m.h / 5))
              : ((x = -1), (u.y = v - c.h / 5), (g.y = F + m.h / 5)),
              h == f
                ? ((x = 1), (u.x = h + c.w), (g.x = f + m.w))
                : h > f
                ? ((u.x = h), (g.x = f + m.w))
                : ((u.x = h + c.w), (g.x = f));
        }
        var _ = N(u, g, x),
          w = d.template;
        w || (w = "orange");
        var k = FamilyTree.clinkTemplates[w],
          S =
            ((i = u),
            (a = _),
            (n = void 0),
            (o = void 0),
            (n = ((r = g).x - i.x) / 2 + i.x),
            (o = (r.y - i.y) / 2 + i.y),
            {
              x: (n - a.x) / 2 + a.x,
              y: (o - a.y) / 2 + a.y,
            });
        d.label &&
          (l += k.label
            .replace("{x}", S.x)
            .replace("{y}", S.y)
            .replace("{val}", d.label));
        var C =
          "M" +
          u.x +
          "," +
          u.y +
          "C" +
          u.x +
          "," +
          u.y +
          " " +
          _.x +
          "," +
          _.y +
          " " +
          g.x +
          "," +
          g.y;
        (l +=
          (
            "<g " +
            FamilyTree.attr.c_link_from +
            '="{from}" ' +
            FamilyTree.attr.c_link_to +
            '="{to}">'
          )
            .replace("{from}", c.id)
            .replace("{to}", m.id) +
          k.link.replaceAll("{d}", C) +
          '<path stroke="transparent" stroke-width="15" fill="none" d="' +
          C +
          '" />'),
          (l += FamilyTree.grCloseTag);
      }

      function N(e, t, i) {
        null == i && (i = 1);
        var r = t.x - e.x,
          a = t.y - e.y,
          n = Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) / 3;
        return (
          (n = (n / (Math.sqrt(r * r + a * a) * i)) * FamilyTree.CLINK_CURVE),
          {
            x: e.x + r / 2 - a * n,
            y: e.y + a / 2 + r * n,
          }
        );
      }
    }
    t.content += l;
  }),
  (FamilyTree.prototype.addClink = function (e, t, i, r) {
    return (
      this.removeClink(e, t),
      this.config.clinks.push({
        from: e,
        to: t,
        label: i,
        template: r,
      }),
      this
    );
  }),
  (FamilyTree.prototype.removeClink = function (e, t) {
    for (var i = this.config.clinks.length - 1; i >= 0; i--) {
      var r = this.config.clinks[i];
      r.from == e && r.to == t && this.config.clinks.splice(i, 1);
    }
    return this;
  }),
  (FamilyTree.clinkTemplates = {}),
  (FamilyTree.clinkTemplates.orange = {
    defs: '<marker id="arrowOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#F57C00" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#F57C00" /></marker>',
    link: '<path marker-start="url(#dotOrange)" marker-end="url(#arrowOrange)" stroke="#F57C00" stroke-width="2" fill="none" d="{d}" />',
    label:
      '<text fill="#F57C00" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
  }),
  (FamilyTree.clinkTemplates.blue = {
    defs: '<marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#039BE5" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>',
    link: '<path marker-start="url(#dotBlue)" marker-end="url(#arrowBlue)" stroke="#039BE5" stroke-width="2" fill="none" d="{d}" />',
    label:
      '<text fill="#039BE5"  text-anchor="middle" x="{x}" y="{y}">{val}</text>',
  }),
  (FamilyTree.clinkTemplates.yellow = {
    defs: '<marker id="arrowYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#FFCA28" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#FFCA28" /></marker>',
    link: '<path marker-start="url(#dotYellow)" marker-end="url(#arrowYellow)" stroke="#FFCA28" stroke-width="2" fill="none" d="{d}" />',
    label:
      '<text fill="#FFCA28"  text-anchor="middle" x="{x}" y="{y}">{val}</text>',
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  FamilyTree.events.on("renderdefs", function (e, t) {
    for (var i = 0; i < e.config.slinks.length; i++) {
      var r = e.config.slinks[i].template;
      r || (r = "orange");
      var a = FamilyTree.slinkTemplates[r];
      t.defs += a.defs;
    }
  }),
  FamilyTree.events.on("render", function (e, t) {
    e._slinks(e, t);
  }),
  (FamilyTree.prototype._slinks = function (e, t) {
    var i = "",
      r = this.getScale(),
      a = t.res.boundary;

    function n(t, n, o) {
      var s = [],
        d = null,
        c = "left",
        m = t.lcn ? t.lcn : "base",
        h = e._layoutConfigs[m];
      switch (h.orientation) {
        case FamilyTree.orientation.top:
        case FamilyTree.orientation.top_left:
        case FamilyTree.orientation.bottom:
        case FamilyTree.orientation.bottom_left:
          n.x > t.x && (c = "right");
          break;
        case FamilyTree.orientation.left:
        case FamilyTree.orientation.left_top:
        case FamilyTree.orientation.right:
        case FamilyTree.orientation.right_top:
          (c = "top"), n.y > t.y && (c = "bottom");
      }
      var p = FamilyTree.t(t.templateName, t.min, r),
        f = h.levelSeparation;
      ((t.parent && t.parent.layout == FamilyTree.mixed) ||
        (t.parent && t.parent.layout == FamilyTree.tree)) &&
        (f = h.mixedHierarchyNodesSeparation);
      var y = {
        p: t.x + t.w / 2 + p.expandCollapseSize,
        q: t.y,
        r: t.x + t.w / 2 + p.expandCollapseSize,
        s: a.minY + f,
      };
      if (t.level == n.level)
        switch (((d = n), h.orientation)) {
          case FamilyTree.orientation.top:
          case FamilyTree.orientation.top_left:
            s.push([y.p, y.q]),
              s.push([y.p, y.q - f / 3]),
              (p = FamilyTree.t(d.templateName, d.min, r)),
              s.push([
                d.x + d.w / 2 + p.expandCollapseSize,
                s[s.length - 1][1],
              ]),
              s.push([s[s.length - 1][0], d.y]);
            break;
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            (y.q = t.y + t.h),
              (y.s = a.maxY - f),
              s.push([y.p, y.q]),
              s.push([y.r, t.y + t.h + f / 3]),
              (p = FamilyTree.t(d.templateName, d.min, r)),
              s.push([
                d.x + d.w / 2 + p.expandCollapseSize,
                s[s.length - 1][1],
              ]),
              s.push([s[s.length - 1][0], d.y + d.h]);
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.left_top:
            (y.p = t.x),
              (y.q = t.y + t.h / 2 + p.expandCollapseSize),
              (y.r = a.minX - f),
              (y.s = t.y + t.h / 2 + p.expandCollapseSize),
              s.push([y.p, y.q]),
              s.push([t.x - f / 3, y.q]),
              (p = FamilyTree.t(d.templateName, d.min, r)),
              s.push([
                s[s.length - 1][0],
                d.y + d.h / 2 + p.expandCollapseSize,
              ]),
              s.push([d.x, s[s.length - 1][1]]);
            break;
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            (y.p = t.x + t.w),
              (y.q = t.y + t.h / 2 + p.expandCollapseSize),
              (y.r = a.maxX + f),
              (y.s = t.y + t.h / 2 + p.expandCollapseSize),
              s.push([y.p, y.q]),
              s.push([t.x + t.w + f / 3, y.q]),
              (p = FamilyTree.t(d.templateName, d.min, r)),
              s.push([
                s[s.length - 1][0],
                d.y + d.h / 2 + p.expandCollapseSize,
              ]),
              s.push([d.x + d.w, s[s.length - 1][1]]);
        }
      else {
        switch (h.orientation) {
          case FamilyTree.orientation.top:
          case FamilyTree.orientation.top_left:
            s.push([y.p, y.q]), s.push([y.r, t.y - f / 3]);
            break;
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            (y.q = t.y + t.h),
              (y.s = a.maxY - f),
              s.push([y.p, y.q]),
              s.push([y.r, t.y + t.h + f / 3]);
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.left_top:
            (y.p = t.x),
              (y.q = t.y + t.h / 2 + p.expandCollapseSize),
              (y.r = a.minX - f),
              (y.s = t.y + t.h / 2 + p.expandCollapseSize),
              s.push([y.p, y.q]),
              s.push([t.x - f / 3, y.q]);
            break;
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            (y.p = t.x + t.w),
              (y.q = t.y + t.h / 2 + p.expandCollapseSize),
              (y.r = a.maxX + f),
              (y.s = t.y + t.h / 2 + p.expandCollapseSize),
              s.push([y.p, y.q]),
              s.push([t.x + t.w + f / 3, y.q]);
        }
        for (var u = t; null == d; ) {
          var g = !1,
            b = u.parent,
            T = b.leftNeighbor,
            v = b.rightNeighbor;
          if (
            (b.id == n.id
              ? (d = b)
              : FamilyTree._intersects(b, y, e.config) &&
                ((y = FamilyTree._addPoint(b, s, e.config, y, c)), (g = !0)),
            b.id != n.id)
          ) {
            for (; T; ) {
              if (T.id == n.id) {
                d = T;
                break;
              }
              FamilyTree._intersects(T, y, e.config) &&
                ((y = FamilyTree._addPoint(T, s, e.config, y, c)), (g = !0)),
                (T = T.leftNeighbor);
            }
            for (; v; ) {
              if (v.id == n.id) {
                d = v;
                break;
              }
              FamilyTree._intersects(v, y, e.config) &&
                ((y = FamilyTree._addPoint(v, s, e.config, y, c)), (g = !0)),
                (v = v.rightNeighbor);
            }
          }
          if (!g) {
            var F = s[s.length - 1][0],
              x = 0;
            if (b.parent)
              switch (
                ((f = h.levelSeparation),
                (b.parent.layout != FamilyTree.mixed &&
                  b.parent.layout != FamilyTree.tree) ||
                  (f = h.mixedHierarchyNodesSeparation),
                h.orientation)
              ) {
                case FamilyTree.orientation.top:
                case FamilyTree.orientation.top_left:
                  x = b.parent.y + b.parent.h + f * (2 / 3);
                  break;
                case FamilyTree.orientation.bottom:
                case FamilyTree.orientation.bottom_left:
                  x = b.parent.y - f * (2 / 3);
                  break;
                case FamilyTree.orientation.left:
                case FamilyTree.orientation.left_top:
                  (F = b.parent.x + b.parent.w + f * (2 / 3)),
                    (x = s[s.length - 1][1]);
                  break;
                case FamilyTree.orientation.right:
                case FamilyTree.orientation.right_top:
                  (F = b.parent.x - f * (2 / 3)), (x = s[s.length - 1][1]);
              }
            s.push([F, x]);
          }
          u = b;
        }
        switch (
          ((p = FamilyTree.t(d.templateName, d.min, r)),
          s.splice(s.length - 1, 1),
          h.orientation)
        ) {
          case FamilyTree.orientation.top:
          case FamilyTree.orientation.top_left:
            s.push([d.x + d.w / 2 + p.expandCollapseSize, s[s.length - 1][1]]),
              s.push([s[s.length - 1][0], d.y + d.h]);
            break;
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            s.push([d.x + d.w / 2 + p.expandCollapseSize, s[s.length - 1][1]]),
              s.push([s[s.length - 1][0], d.y]);
            break;
          case FamilyTree.orientation.left:
          case FamilyTree.orientation.left_top:
            s.push([s[s.length - 1][0], d.y + d.h / 2 + p.expandCollapseSize]),
              s.push([d.x + d.w, s[s.length - 1][1]]);
            break;
          case FamilyTree.orientation.right:
          case FamilyTree.orientation.right_top:
            s.push([s[s.length - 1][0], d.y + d.h / 2 + p.expandCollapseSize]),
              s.push([d.x, s[s.length - 1][1]]);
        }
      }
      var _ = l.template;
      _ || (_ = "orange");
      var w,
        k,
        S = null;
      switch ((p = FamilyTree.slinkTemplates[_]).labelPosition) {
        case "start":
          S = {
            x: s[1][0],
            y: s[1][1],
          };
          break;
        case "middle":
          var C = Math.ceil(s.length / 2);
          (w = s[C]),
            (k = s[C - 1]),
            (S = {
              x: (w[0] + k[0]) / 2,
              y: (w[1] + k[1]) / 2,
            });
          break;
        case "end":
          S = {
            x: s[s.length - 2][0],
            y: s[s.length - 2][1],
          };
      }
      o && (s = s.reverse()), (s[0] = "M" + s[0].join(","));
      for (var N = 1; N < s.length; N++) s[N] = "L" + s[N].join(",");
      var I = s.join(" ");
      if (l.label) {
        var A = p.label
            .replace("{x}", S.x)
            .replace("{y}", S.y)
            .replace("{val}", l.label),
          M = FamilyTree._getLabelSize(A),
          L = -M.height / 2;
        switch (h.orientation) {
          case FamilyTree.orientation.bottom:
          case FamilyTree.orientation.bottom_left:
            L = M.height;
        }
        i += p.label
          .replace("{x}", S.x)
          .replace("{y}", S.y + L)
          .replace("{val}", l.label);
      }
      (i +=
        (
          "<g " +
          FamilyTree.attr.s_link_from +
          '="{from}" ' +
          FamilyTree.attr.s_link_to +
          '="{to}">'
        )
          .replace("{from}", t.id)
          .replace("{to}", n.id) +
        p.link.replaceAll("{d}", I) +
        '<path stroke="transparent" stroke-width="15" fill="none" d="' +
        I +
        '" />'),
        (i += FamilyTree.grCloseTag);
    }
    for (var o = 0; o < this.config.slinks.length; o++) {
      var l = this.config.slinks[o],
        s = e.getNode(l.from),
        d = e.getNode(l.to);
      s &&
        d &&
        -1 != t.res.visibleNodeIds.indexOf(d.id) &&
        -1 != t.res.visibleNodeIds.indexOf(s.id) &&
        (s.level >= d.level ? n(s, d, !1) : n(d, s, !0));
    }
    t.content += i;
  }),
  (FamilyTree.prototype.addSlink = function (e, t, i, r) {
    return (
      this.removeClink(e, t),
      this.config.slinks.push({
        from: e,
        to: t,
        label: i,
        template: r,
      }),
      this
    );
  }),
  (FamilyTree.prototype.removeSlink = function (e, t) {
    for (var i = this.config.slinks.length - 1; i >= 0; i--) {
      var r = this.config.slinks[i];
      r.from == e && r.to == t && this.config.slinks.splice(i, 1);
    }
    return this;
  }),
  (FamilyTree.slinkTemplates = {}),
  (FamilyTree.slinkTemplates.orange = {
    defs: '<marker id="arrowSlinkOrange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#F57C00" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkOrange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#F57C00" /></marker>',
    link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkOrange)" marker-end="url(#arrowSlinkOrange)" stroke-linejoin="round" stroke="#F57C00" stroke-width="2" fill="none" d="{d}" />',
    label:
      '<text dominant-baseline="middle" fill="#F57C00" alignment-baseline="middle" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
    labelPosition: "middle",
  }),
  (FamilyTree.slinkTemplates.blue = {
    defs: '<marker id="arrowSlinkBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#039BE5" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>',
    link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkBlue)" marker-end="url(#arrowSlinkBlue)" stroke-linejoin="round" stroke="#039BE5" stroke-width="2" fill="none" d="{d}" />',
    label:
      '<text fill="#039BE5" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
    labelPosition: "middle",
  }),
  (FamilyTree.slinkTemplates.yellow = {
    defs: '<marker id="arrowSlinkYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path fill="#FFCA28" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotSlinkYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#FFCA28" /></marker>',
    link: '<path stroke-dasharray="4, 2" marker-start="url(#dotSlinkYellow)" marker-end="url(#arrowSlinkYellow)" stroke-linejoin="round" stroke="#FFCA28" stroke-width="2" fill="none" d="{d}" />',
    label:
      '<text  fill="#FFCA28" text-anchor="middle" x="{x}" y="{y}">{val}</text>',
    labelPosition: "middle",
  }),
  FamilyTree.events.on("redraw", function (e, t) {
    if (e.config.miniMap) {
      var i = FamilyTree.miniMap._getCanvas(e),
        r = i.getContext("2d");
      (i.width = i.width), (i.height = i.height);
      var a = e.response.boundary.maxX - e.response.boundary.minX,
        n = e.response.boundary.maxY - e.response.boundary.minY,
        o = Math.min(i.width / a, i.height / n),
        l = (i.width - a * o) / 2,
        s = (i.height - n * o) / 2;
      r.clearRect(0, 0, i.width, i.height),
        r.translate(
          -e.response.boundary.minX * o + l,
          -e.response.boundary.minY * o + s
        ),
        r.scale(o, o);
      var d = 0,
        c = [];
      !(function e(t, i) {
        if (Array.isArray(i)) for (var a = 0; a < i.length; a++) e(t, i[a]);
        else {
          (r.fillStyle = FamilyTree.miniMap.colors[3]),
            r.beginPath(),
            (r.lineWidth = "0.5"),
            r.fillRect(i.x, i.y, i.w, i.h),
            r.strokeRect(i.x, i.y, i.w, i.h);
          for (a = 0; a < i.stChildrenIds.length; a++)
            d++,
              c.includes(i.id) ||
                (1 == d
                  ? (r.fillStyle = FamilyTree.miniMap.colors[0])
                  : 2 == d
                  ? (r.fillStyle = FamilyTree.miniMap.colors[1])
                  : 3 == d && (r.fillStyle = FamilyTree.miniMap.colors[2]),
                r.beginPath(),
                r.fillRect(i.x, i.y, i.w, i.h),
                r.strokeRect(i.x, i.y, i.w, i.h),
                c.push(i.id)),
              e(t, t.getNode(i.stChildrenIds[a])),
              d--;
          for (a = 0; a < i.childrenIds.length; a++)
            e(t, t.getNode(i.childrenIds[a]));
        }
      })(e, e.roots);
      var m = e.getViewBox()[0],
        h = e.getViewBox()[1],
        p = e.getViewBox()[2],
        f = e.getViewBox()[3];
      (r.lineWidth = 0.5 / o),
        (r.strokeStyle = "#f57c00"),
        r.strokeRect(m, h, p, f),
        (r.globalAlpha = 0.4),
        (r.fillStyle = FamilyTree.miniMap.selectorBackgroundColor),
        r.fillRect(m, h, p, f);
    }
  }),
  (FamilyTree.miniMap = {}),
  (FamilyTree.miniMap._getCanvas = function (e) {
    if (
      !(t = e.element.querySelector("[" + FamilyTree.attr.id + '="mini-map"]'))
    ) {
      var t;
      ((t = document.createElement("canvas")).width = 250),
        (t.height = 140),
        t.setAttribute(FamilyTree.attr.id, "mini-map"),
        (t.style.display = "inline-block"),
        (t.style.backgroundColor = FamilyTree.miniMap.backgroundColor);
      var i = document.createElement("div");
      i.classList.add("mini-map"),
        (i.style.position = "absolute"),
        (i.style.bottom = "10px"),
        (i.style.left = "10px"),
        (i.style.border = "1px solid #aeaeae"),
        (i.style.padding = "5px"),
        (i.style.margin = e.config.padding + "px"),
        (i.style.backgroundColor = FamilyTree.miniMap.backgroundColor),
        i.appendChild(t),
        e.element.appendChild(i);
    }
    return t;
  }),
  (FamilyTree.miniMap.colors = ["#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575"]),
  (FamilyTree.miniMap.selectorBackgroundColor = "white"),
  (FamilyTree.miniMap.backgroundColor = "white"),
  (FamilyTree._search = {}),
  (FamilyTree._search.search = function (e, t, i, r, a, n) {
    var o = [],
      l = t.toLowerCase().split(" ");
    l = l.filter(function (e, t, i) {
      return i.indexOf(e) === t;
    });
    for (var s = {}, d = 0; d < e.length; d++)
      for (var c = e[d], m = 0; m < i.length; m++) {
        var h = i[m];
        if (!FamilyTree.isNEU(c[h])) {
          var p = c[h];
          if (
            null != (t = FamilyTree._search.searchAndComputeScore(l, p, h, n))
          ) {
            var f = c.id;
            if (s[f]) {
              if (s[f] && s[f] < t.__score) {
                s[f] = t.__score;
                for (var y = o.length - 1; y >= 0; y--)
                  o[y].id == f && o.splice(y, 1);
                FamilyTree._search.addNodeToResult(o, r, c, t, h, a);
              }
            } else
              (s[f] = t.__score),
                FamilyTree._search.addNodeToResult(o, r, c, t, h, a);
          }
        }
      }
    return (
      o.sort(function (e, t) {
        return e.__score < t.__score ? 1 : e.__score > t.__score ? -1 : 0;
      }),
      o
    );
  }),
  (FamilyTree._search.addNodeToResult = function (e, t, i, r, a, n) {
    var o = {};
    (o.id = i.id), FamilyTree.isNEU(i[n]) || (o[n] = i[n]);
    for (var l = 0; l < t.length; l++) {
      var s = t[l];
      FamilyTree.isNEU(i[s]) || (FamilyTree.isNEU(o[s]) && (o[s] = i[s]));
    }
    null != r &&
      (FamilyTree.isNEU(o.__score) && (o.__score = r.__score),
      FamilyTree.isNEU(o.__searchField) && (o.__searchField = a),
      FamilyTree.isNEU(o.__searchMarks) && (o.__searchMarks = r.__searchMarks)),
      e.push(o);
  }),
  (FamilyTree._search.searchAndComputeScore = function (e, t, i, r) {
    if (FamilyTree.isNEU(t)) return null;
    if (FamilyTree.isNEU(e)) return null;
    if (!e.length) return null;
    "string" != typeof t && (t = t.toString());
    var a = t.toLowerCase(),
      n = FamilyTree._search.searchIndexesOf(a, e);
    if (!n.length) return null;
    var o = a.length / 100,
      l = 0,
      s = 0,
      d = l > 0 ? 100 : 0;
    if (n.length) {
      s = n[0].start;
      for (var c = 0; c < n.length; c++)
        if (
          ((l += n[c].length),
          n[c].start < s && (s = n[c].start),
          c >= 1 && n[c - 1].start > n[c].start)
        ) {
          d = 0;
          break;
        }
    }
    var m = 0;
    0 != l && (m = l / o);
    var h = l > 0 ? 100 : 0;
    0 != s && (h = 100 - s / o);
    var p = 0;
    r && r[i] && (p = r[i]),
      m > 0 && (m = (m / 100) * 20),
      h > 0 && (h = (h / 100) * 20),
      d > 0 && (d = (d / 100) * 20),
      p > 0 && (p = (p / 100) * 40);
    var f = parseInt(m + h + d + p);
    f > 100 && (f = 100),
      n.sort(function (e, t) {
        return e.start < t.start ? -1 : e.start > t.start ? 1 : 0;
      });
    var y = t;
    for (c = n.length - 1; c >= 0; c--)
      y = (y = y.insert(n[c].start + n[c].length, "</mark>")).insert(
        n[c].start,
        "<mark>"
      );
    return {
      __searchMarks: y,
      __score: f,
    };
  }),
  (FamilyTree._search.searchIndexesOf = function (e, t) {
    var i = [];
    if (!FamilyTree.isNEU(e))
      for (var r = 0; r < t.length; r++) {
        var a = t[r];
        if (!FamilyTree.isNEU(a))
          for (var n = 0; (n = e.indexOf(a, n)) > -1; )
            i.push({
              length: a.length,
              start: n,
            }),
              (n += a.length);
      }
    return (
      i.sort(function (e, t) {
        return e.length < t.length
          ? 1
          : e.length > t.length || e.start < t.start
          ? -1
          : e.start > t.start
          ? 1
          : 0;
      }),
      (i = i.filter(function (e) {
        for (var t = !1, r = 0; r < i.length; r++) {
          var a = i[r].start,
            n = i[r].start + i[r].length - 1,
            o = e.start,
            l = e.start + e.length - 1;
          if (a == o && n == l) {
            t = !1;
            break;
          }
          if (a >= o && n <= l) {
            t = !0;
            break;
          }
          if (a <= o && n >= l) {
            t = !0;
            break;
          }
        }
        return !t;
      }))
    );
  }),
  FamilyTree.events.on("redraw", function (e, t) {
    if (e.config.state) {
      var i = [],
        r = [];
      !(function e(t) {
        if (Array.isArray(t)) for (var a = 0; a < t.length; a++) e(t[a]);
        else {
          ("string" != typeof t.id ||
            ("string" == typeof t.id &&
              -1 == t.id.indexOf("split") &&
              -1 == t.id.indexOf("mirror"))) &&
            (i.push(t.id), 1 == t.min && r.push(t.id));
          for (a = 0; a < t.stChildren.length; a++) e(t.stChildren[a]);
          for (a = 0; a < t.children.length; a++) e(t.children[a]);
        }
      })(e.roots),
        FamilyTree.state._put(
          e.width(),
          e.height(),
          e.response.viewBox,
          i,
          r,
          e.response.adjustify,
          e.config.state
        );
    }
  }),
  (FamilyTree.state = {}),
  (FamilyTree.state._buildStateNames = function (e) {
    return {
      paramScale: e + "-scale",
      paramX: e + "-x",
      paramY: e + "-y",
      paramExp: e + "-exp",
      paramMin: e + "-min",
      paramAdjustify: e + "-adjustify",
    };
  }),
  (FamilyTree.state._put = function (e, t, i, r, a, n, o) {
    if (o) {
      var l = FamilyTree.state._buildStateNames(o.name),
        s = {
          scale: Math.min(e / i[2], t / i[3]),
          x: i[0],
          y: i[1],
          exp: r,
          min: a,
          adjustify: n,
        };
      if (o.writeToUrlParams) {
        var d = new URLSearchParams(window.location.search);
        d.has(l.paramScale)
          ? d.set(l.paramScale, s.scale)
          : d.append(l.paramScale, s.scale),
          d.has(l.paramX) ? d.set(l.paramX, s.x) : d.append(l.paramX, s.x),
          d.has(l.paramY) ? d.set(l.paramY, s.y) : d.append(l.paramY, s.y),
          d.has(l.paramExp)
            ? d.set(l.paramExp, s.exp.join("*"))
            : d.append(l.paramExp, s.exp.join("*")),
          d.has(l.paramMin)
            ? d.set(l.paramMin, s.min.join("*"))
            : d.append(l.paramMin, s.min.join("*")),
          d.has(l.paramAdjustify)
            ? d.set(l.paramAdjustify, s.adjustify.x + "*" + s.adjustify.y)
            : d.append(l.paramAdjustify, s.adjustify.x + "*" + s.adjustify.y),
          window.history.replaceState(null, null, "?" + d);
      }
      o.writeToIndexedDB &&
        ((s.id = o.name),
        FamilyTree.idb.put(s, function (e) {
          0 == e && console.error("Cannot write row - " + o.name);
        })),
        o.writeToLocalStorage &&
          FamilyTree.localStorage.setItem(o.name, JSON.stringify(s));
    }
  }),
  (FamilyTree.state._get = function (e, t, i, r) {
    if (e) {
      var a = FamilyTree.state._buildStateNames(e.name);
      if (e.readFromUrlParams) {
        var n = new URLSearchParams(window.location.search);
        if (
          n.has(a.paramScale) &&
          n.has(a.paramX) &&
          n.has(a.paramY) &&
          n.has(a.paramExp) &&
          n.has(a.paramMin) &&
          n.has(a.paramAdjustify)
        ) {
          var o = {},
            l = parseFloat(n.get(a.paramScale)),
            s = parseFloat(n.get(a.paramX)),
            d = parseFloat(n.get(a.paramY));
          ((m = [])[0] = s),
            (m[1] = d),
            (m[2] = t / l),
            (m[3] = i / l),
            (o.vb = m),
            (o.scale = l),
            (o.x = s),
            (o.y = d),
            (o.exp = n.get(a.paramExp).split("*")),
            (o.min = n.get(a.paramMin).split("*"));
          var c = n.get(a.paramAdjustify).split("*");
          return (
            (o.adjustify = {
              x: parseFloat(c[0]),
              y: parseFloat(c[1]),
            }),
            void r(o)
          );
        }
        if (!e.readFromIndexedDB && !e.readFromLocalStorage)
          return void r(null);
      }
      if (e.readFromLocalStorage) {
        var m;
        if (null != (o = FamilyTree.localStorage.getItem(e.name)))
          return (
            (o = JSON.parse(o)),
            ((m = [])[0] = o.x),
            (m[1] = o.y),
            (m[2] = t / o.scale),
            (m[3] = i / o.scale),
            (o.vb = m),
            void r(o)
          );
        if (!e.readFromIndexedDB) return void r(null);
      }
      e.readFromIndexedDB &&
        FamilyTree.idb.read(e.name, function (a, n) {
          if (0 == a) console.error("Cannot read from - " + e.name), r(null);
          else if (null == a) r(null);
          else {
            var o = [];
            (o[0] = n.x),
              (o[1] = n.y),
              (o[2] = t / n.scale),
              (o[3] = i / n.scale),
              (n.vb = o),
              r(n);
          }
        });
    } else r(null);
  }),
  (FamilyTree.state.clear = function (e) {
    if (!e) return !1;
    var t = FamilyTree.state._buildStateNames(e),
      i = new URLSearchParams(window.location.search);
    i.has(t.paramScale) && i.delete(t.paramScale),
      i.has(t.paramX) && i.delete(t.paramX),
      i.has(t.paramY) && i.delete(t.paramY),
      i.has(t.paramExp) && i.delete(t.paramExp),
      i.has(t.paramMin) && i.delete(t.paramMin),
      i.has(t.paramAdjustify) && i.delete(t.paramAdjustify),
      window.history.replaceState(null, null, "?" + i),
      FamilyTree.idb.delete(e, function (t) {
        0 == t && console.error("Cannot delete row - " + e);
      });
  }),
  (FamilyTree._magnify = {}),
  (FamilyTree.prototype.magnify = function (e, t, i, r, a) {
    r || (r = this.config.anim);
    var n = this.getNode(e),
      o = this.getNodeElement(e);
    if (n || o) {
      var l = FamilyTree._magnify[e];
      if (
        (l &&
          (null != l.timer && clearInterval(l.timer),
          null != l.timerBack && clearInterval(l.timerBack),
          o.setAttribute(
            "transform",
            "matrix(" + l.transformStart.toString() + ")"
          ),
          FamilyTree._magnify[e]),
        i)
      )
        (o = o.cloneNode(!0)), this.getSvg().appendChild(o);
      var s = FamilyTree._getTransform(o),
        d = JSON.parse(JSON.stringify(s));
      (d[0] = t), (d[3] = t);
      var c = n.w + n.w * (t - 1),
        m = n.h + n.h * (t - 1);
      (d[4] += (n.w - c) / 2), (d[5] += (n.h - m) / 2);
      var h = FamilyTree.anim(
        o,
        {
          transform: s,
        },
        {
          transform: d,
        },
        r.duration,
        r.func
      );
      (FamilyTree._magnify[e] = {
        timer: h,
        transformStart: s,
        nodeElement: o,
        front: i,
      }),
        a && a(o);
    }
  }),
  (FamilyTree.prototype.magnifyBack = function (e, t, i) {
    t || (t = this.config.anim);
    var r = FamilyTree._magnify[e];
    if (r) {
      null != r.timer && clearInterval(r.timer),
        null != r.timerBack && clearInterval(r.timerBack);
      var a = FamilyTree._getTransform(r.nodeElement);
      r.timerBack = FamilyTree.anim(
        r.nodeElement,
        {
          transform: a,
        },
        {
          transform: r.transformStart,
        },
        t.duration,
        t.func,
        function (e) {
          var t = e[0].getAttribute(FamilyTree.attr.node_id);
          FamilyTree._magnify[t] &&
            FamilyTree._magnify[t].front &&
            (e[0].parentNode.removeChild(e[0]),
            (FamilyTree._magnify[t] = null)),
            i && i(e[0]);
        }
      );
    }
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  FamilyTree.events.on("init", function (e, t) {
    e.config.enableKeyNavigation &&
      (e._addEvent(window, "keydown", e._windowKeyDownHandler),
      FamilyTree.isNEU(e._keyNavigationActiveNodeId) &&
        e.roots &&
        e.roots.length &&
        ((e._keyNavigationActiveNodeId = e.roots[0].id),
        e.center(e._keyNavigationActiveNodeId)));
  }),
  (FamilyTree.prototype._windowKeyDownHandler = function (e, t) {
    for (var i = t.target, r = null; i && i != this.element; ) {
      if (i.hasAttribute && i.hasAttribute(FamilyTree.attr.node_id)) {
        r = i.getAttribute(FamilyTree.attr.node_id);
        break;
      }
      i = i.parentNode;
    }
    if (i) {
      var a = r ? this.getNode(r) : null,
        n = {
          node: a,
          data: r ? this.get(r) : null,
          event: t,
        };
      if (!1 !== FamilyTree.events.publish("key-down", [this, n]) && a)
        if ("KeyF" == t.code) this.searchUI.find("");
        else if (
          "ArrowRight" == t.code ||
          (a.isAssistant && "ArrowDown" == t.code) ||
          (a.isPartner && "ArrowDown" == t.code)
        ) {
          if ((s = this.getNode(a.pid))) {
            var o = s.childrenIds.indexOf(a.id);
            if (++o < s.childrenIds.length) {
              var l = s.childrenIds[o];
              (this._keyNavigationActiveNodeId = l), this.center(l);
            }
          }
        } else if ("ArrowLeft" == t.code) {
          if ((s = this.getNode(a.pid))) {
            o = s.childrenIds.indexOf(a.id);
            if (--o >= 0) {
              l = s.childrenIds[o];
              (this._keyNavigationActiveNodeId = l), this.center(l);
            }
          }
        } else if ("ArrowUp" == t.code) {
          var s;
          if ((s = this.getNode(a.pid))) {
            l = s.id;
            if (
              a.isAssistant ||
              s.hasAssistants ||
              a.isPartner ||
              s.hasPartners
            ) {
              o = s.childrenIds.indexOf(a.id);
              --o >= 0 && (l = s.childrenIds[o]);
            }
            (this._keyNavigationActiveNodeId = l), this.center(l);
          }
        } else if ("ArrowDown" == t.code)
          a.childrenIds.length &&
            ((this._keyNavigationActiveNodeId = a.childrenIds[0]),
            this.center(a.childrenIds[0]));
        else if ("Space" == t.code) {
          var d = i.getAttribute(FamilyTree.attr.node_id);
          return void this.toggleExpandCollapse(d, t);
        }
    }
  }),
  FamilyTree.events.on("redraw", function (e, t) {
    e.config.enableKeyNavigation && FamilyTree._keyNavigation(e);
  }),
  FamilyTree.events.on("click", function (e, t) {
    e.config &&
      e.config.enableKeyNavigation &&
      ((e._keyNavigationActiveNodeId = t.node.id), e.center(t.node.id));
  }),
  (FamilyTree._keyNavigation = function (e) {
    var t = e.element.querySelector(":focus");
    if (
      t &&
      t.parentElement &&
      t.parentElement.hasAttribute(FamilyTree.attr.node_id)
    ) {
      var i = t.parentElement;
      (a = (r = t).querySelector("title")) && a.parentNode.removeChild(a),
        r.removeAttribute("tabindex");
    }
    if (
      !FamilyTree.isNEU(e._keyNavigationActiveNodeId) &&
      (i = e.getNodeElement(e._keyNavigationActiveNodeId)) &&
      i.children.length
    ) {
      var r;
      (r = i.children[0]).setAttribute("tabindex", 2);
      var a,
        n = {
          text: "",
          id: e._keyNavigationActiveNodeId,
        };
      if (
        (FamilyTree.events.publish("screen-reader-text", [e, n]),
        !FamilyTree.isNEU(n.text))
      )
        ((a = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "title"
        )).innerHTML = n.text),
          r.appendChild(a);
      e.searchUI.hide(), r.focus();
    }
  }),
  (FamilyTree.elements = {}),
  (FamilyTree.elements.textbox = function (e, t, i, r) {
    var a = FamilyTree.elements._vidrf(e, t, r);
    if (a.doNotRender)
      return {
        html: "",
      };
    var n = "";
    return (
      t.btn &&
        (n = `<a href="#" bft-input-btn="" class="bft-link bft-link-bft-button">${t.btn}</a>`),
      {
        html: `<div class="bft-form-field" style="min-width: ${i};">\n                    <div class="bft-input" data-bft-input="" ${a.disabledAttribute} ${a.vlidators}>\n                        <label for="${a.id}">${a.label}</label>\n                        <input ${a.readOnlyAttribute} data-binding="${a.binding}" maxlength="256" id="${a.id}" name="${a.id}" type="text" value="${a.value}" autocomplete="off">\n                        ${n}\n                    </div>\n                </div>`,
        id: a.id,
        value: a.value,
      }
    );
  }),
  (FamilyTree.elements.checkbox = function (e, t, i, r) {
    var a = FamilyTree.elements._vidrf(e, t, r);
    if (a.doNotRender)
      return {
        html: "",
      };
    var n = a.value ? "checked" : "",
      o = r ? 'onclick="return false;"' : "";
    return {
      html: `<div class="bft-form-field"  style="min-width: ${i};" >\n                        <label class="bft-checkbox" data-bft-input="" ${a.disabledAttribute}>\n                            <input ${n} ${o} data-binding="${a.binding}" type="checkbox"><span class="bft-checkbox-checkmark" type="checkbox"></span>${a.label}\n                        </label>\n                    </div>`,
      id: a.id,
      value: n,
    };
  }),
  (FamilyTree.elements.select = function (e, t, i, r) {
    if (r) return FamilyTree.elements.textbox(e, t, i, r);
    var a = FamilyTree.elements._vidrf(e, t, r);
    return a.doNotRender
      ? {
          html: "",
        }
      : {
          html: `<div class="bft-form-field" style="min-width: ${i};">\n                    <div class="bft-input" data-bft-input="" ${
            a.disabledAttribute
          } ${a.vlidators}>\n                        <label for="${a.id}">${
            a.label
          }</label>\n                        <select data-binding="${
            a.binding
          }" ${a.readOnlyAttribute} id="${a.id}" name="${
            a.id
          }">\n                            ${(function () {
            for (var e = "", t = 0; t < a.options.length; t++) {
              var i = a.options[t];
              e += `<option ${i.value == a.value ? "selected" : ""} value="${
                i.value
              }">${i.text}</option>`;
            }
            return e;
          })()}                           \n                        </select>\n                    </div>\n                </div>`,
          id: a.id,
          value: a.value,
        };
  }),
  (FamilyTree.elements.date = function (e, t, i, r) {
    var a = FamilyTree.elements._vidrf(e, t, r);
    return a.doNotRender
      ? {
          html: "",
        }
      : {
          html: `<div class="bft-form-field" style="min-width: ${i};">\n                    <div class="bft-input" data-bft-input="" ${a.disabledAttribute} ${a.vlidators}>\n                        <label for="${a.id}" class="hasval">${a.label}</label>\n                        <input data-binding="${a.binding}" ${a.readOnlyAttribute} maxlength="256" id="${a.id}" name="${a.id}" type="date" value="${a.value}" autocomplete="off">\n                    </div>\n                </div>`,
          id: a.id,
          value: a.value,
        };
  }),
  (FamilyTree.elements._vidrf = function (e, t, i) {
    var r = {};
    if (
      (t.binding || (t.binding = ""),
      t.label || (t.label = ""),
      "select" != t.type || Array.isArray(t.options)
        ? (r.options = t.options)
        : (r.options = []),
      (r.value = e && !FamilyTree.isNEU(e[t.binding]) ? e[t.binding] : ""),
      i && r.options)
    )
      for (var a = 0; a < r.options.length; a++)
        if (r.options[a].value == r.value) {
          r.value = r.options[a].text;
          break;
        }
    if (
      ((r.id = FamilyTree.elements.generateId()),
      (r.disabledAttribute = i ? "data-bft-input-disabled" : ""),
      (r.readOnlyAttribute = i ? "readonly" : ""),
      (r.id = r.id),
      i && FamilyTree.isNEU(r.value) && (r.doNotRender = !0),
      i && "photo" == t.binding && ((r.id = null), (r.doNotRender = !0)),
      (r.binding = t.binding),
      (r.label = t.label),
      (r.vlidators = ""),
      t.vlidators)
    )
      for (var n in t.vlidators)
        r.vlidators += `data-v-${n}="${t.vlidators[n]}" `;
    return r;
  }),
  (FamilyTree.elements.ids = []),
  (FamilyTree.elements.generateId = function () {
    for (;;) {
      var e =
        "_" +
        ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(
          -4
        );
      if (!FamilyTree.elements.ids.has(e))
        return FamilyTree.elements.ids.push(e), e;
    }
  }),
  (FamilyTree.input = {}),
  (FamilyTree.input._timeout = null),
  (FamilyTree.input.initWithTimeout = function () {
    FamilyTree.input._timeout &&
      (clearTimeout(FamilyTree.input._timeout),
      (FamilyTree.input._timeout = null)),
      (FamilyTree.input._timeout = setTimeout(FamilyTree.input.init, 200));
  }),
  (FamilyTree.input.init = function (e) {
    var t;
    t = e
      ? e.querySelectorAll("[data-bft-input]")
      : document.querySelectorAll("[data-bft-input]");
    for (var i = 0; i < t.length; i++) {
      var r = t[i],
        a = null;
      r.type && "hidden" == r.type.toLowerCase() && (a = r),
        a || (a = r.querySelector("input")),
        a || (a = r.querySelector("select"));
      var n = r.querySelector("label");
      n &&
        (a.value ||
          ("select-one" == a.type &&
            a.selectedOptions &&
            a.selectedOptions.length &&
            "" == a.selectedOptions[0].value &&
            a.selectedOptions[0].innerHTML)) &&
        n.classList.add("hasval"),
        "checkbox" != a.type.toLowerCase() &&
          a.addEventListener("focus", function () {
            this.classList.remove("bft-validation-error");
            var e = this.parentNode.querySelector("label");
            e.classList.add("focused");
            var t = e.querySelector(".bft-validation-error-message");
            t && t.parentNode.removeChild(t);
          }),
        "checkbox" != a.type.toLowerCase() &&
          a.addEventListener("blur", function () {
            var e = this.parentNode.querySelector("label");
            e.classList.remove("focused"),
              this.value || "date" == this.type
                ? e.classList.add("hasval")
                : e.classList.remove("hasval");
          });
    }
  }),
  (FamilyTree.input.validate = function (e) {
    var t = null;
    e.type && "hidden" == e.type.toLowerCase() && (t = e),
      t || (t = e.querySelector("input")),
      t || (t = e.querySelector("select"));
    var i = e.querySelector("label");
    if ((t.classList.remove("bft-validation-error"), i)) {
      var r = i.querySelector(".bft-validation-error-message");
      r && r.parentNode.removeChild(r);
    }
    t.value && (t.value = t.value.trim());
    var a = e.getAttribute("data-v-required"),
      n = e.getAttribute("data-v-password"),
      o = e.getAttribute("data-v-email"),
      l = e.getAttribute("data-v-emails");
    return a && "" == t.value
      ? ((i.innerHTML +=
          '<span class="bft-validation-error-message">&nbsp;' + a + "</span>"),
        t.classList.add("bft-validation-error"),
        !1)
      : n && !FamilyTree.input.validatePassword(t.value)
      ? ((i.innerHTML +=
          '<span class="bft-validation-error-message">&nbsp;' + n + "</span>"),
        t.classList.add("bft-validation-error"),
        !1)
      : o && !FamilyTree.input.isValidEmail(t.value)
      ? ((i.innerHTML +=
          '<span class="bft-validation-error-message">&nbsp;' + o + "</span>"),
        t.classList.add("bft-validation-error"),
        !1)
      : !(l && !FamilyTree.input.isValidEmails(t.value)) ||
        ((i.innerHTML +=
          '<span class="bft-validation-error-message">&nbsp;' + l + "</span>"),
        t.classList.add("bft-validation-error"),
        !1);
  }),
  (FamilyTree.input.validateAndGetData = function (e) {
    for (
      var t = e.querySelectorAll("[data-bft-input]"), i = !0, r = 0;
      r < t.length;
      r++
    ) {
      var a = t[r];
      FamilyTree.input.validate(a) || (i = !1);
    }
    if (!i) return !1;
    var n = e.querySelectorAll("[data-binding]"),
      o = {};
    for (r = 0; r < n.length; r++) {
      var l = n[r],
        s = l.getAttribute("data-binding");
      "checkbox" == l.type.toLowerCase()
        ? (o[s] = l.checked)
        : (o[s] = l.value);
    }
    return o;
  }),
  (FamilyTree.input.validatePassword = function (e) {
    return (
      e && (e = e.trim()),
      !(e.length < 5) && !(e.length > 18) && -1 == e.indexOf(" ")
    );
  }),
  (FamilyTree.input.isValidEmails = function (e) {
    if (e)
      for (var t = e.split(","), i = 0; i < t.length; i++) {
        var r = t[i].trim();
        if (!FamilyTree.input.isValidEmail(r)) return !1;
      }
    return !0;
  }),
  (FamilyTree.input.isValidEmail = function (e) {
    e && (e = e.trim());
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(e).toLowerCase()
    );
  }),
  (FamilyTree.prototype.hideTreeMenu = function (e, t) {
    if (this._tree_menu_temp) {
      var i = this._tree_menu_temp;
      if (
        ((this.manager.oldNodes = this.nodes),
        (this.nodes = i.nodes),
        (this.manager.maxX = i.maxX),
        (this.manager.maxY = i.maxY),
        (this.manager.minX = i.minX),
        (this.manager.minY = i.minY),
        (this.manager.roots = i.roots),
        (this.manager.nodes = i.nodes),
        (this.manager.rootList = i.rootList),
        (this.manager.visibleNodeIds = i.visibleNodeIds),
        (this.manager.bordersByRootIdAndLevel = i.bordersByRootIdAndLevel),
        (this.config.roots = i.config.roots),
        (this.config.nodes = i.config.nodes),
        (this._tree_menu_temp = null),
        e)
      ) {
        var r = {
          id: i.id,
          animFromClickedNode: !1,
        };
        this._draw(!0, FamilyTree.action.update, r, function () {
          t && t();
        });
      }
    }
  }),
  (FamilyTree.prototype.showTreeMenu = function (e) {
    null == e && console.error("Call addNode without id");
    var t = this.getNode(e);
    t || console.error("Cannot get node id: " + e);
    var i = this.getNode(t.fid),
      r = this.getNode(t.mid),
      a = null,
      n = null,
      o = [],
      l = [];
    i && (a = this.get(i.id)), r && (n = this.get(r.id));
    for (var s = 0; s < t.pids.length; s++) {
      var d = this.get(t.pids[s]);
      d && o.push(d);
    }
    for (s = 0; s < t.ftChildrenIds.length; s++)
      l.push(this.get(t.ftChildrenIds[s]));
    var c = this.get(e);
    if (
      ((this._tree_menu_temp = {
        maxX: this.manager.maxX,
        maxY: this.manager.maxY,
        minX: this.manager.minX,
        minY: this.manager.minY,
        roots: this.manager.roots,
        nodes: this.manager.nodes,
        rootList: this.manager.rootList,
        visibleNodeIds: this.manager.visibleNodeIds,
        bordersByRootIdAndLevel: this.manager.bordersByRootIdAndLevel,
        id: e,
        config: {
          roots: this.config.roots,
          nodes: this.config.nodes,
        },
      }),
      (this.config.nodes = []),
      n)
    )
      this.add(n);
    else {
      var m = {
        id: "_ft_mother",
        templateName: "mother",
        _ft_method: "addParentNode",
        _ft_childId: e,
        _ft_type: "mid",
        _ft_data: {
          gender: "female",
        },
      };
      (c.mid = m.id),
        a
          ? ((a.pids = [m.id]), (m.pids = [a.id]), (m._ft_data.pids = [a.id]))
          : (m.pids = ["_ft_father"]),
        this.add(m);
    }
    if (a) this.add(a);
    else {
      var h = {
        id: "_ft_father",
        templateName: "father",
        _ft_method: "addParentNode",
        _ft_childId: e,
        _ft_type: "fid",
        _ft_data: {
          gender: "male",
        },
      };
      (c.fid = h.id),
        n
          ? ((n.pids = [h.id]), (h.pids = [n.id]), (h._ft_data.pids = [n.id]))
          : (h.pids = ["_ft_mother"]),
        this.add(h);
    }
    for (s = 0; s < o.length; s++) this.add(o[s]);
    c.pids || (c.pids = []);
    var p = {
      id: "_ft_partner",
      pids: [e],
      templateName: "partner",
      _ft_method: "addPartnerNode",
      _ft_data: {
        pids: [e],
      },
    };
    if (
      ("male" == c.gender
        ? ((p.templateName = "wife"), (p._ft_data.gender = "female"))
        : "female" == c.gender &&
          ((p.templateName = "husband"), (p._ft_data.gender = "male")),
      c.pids.push(p.id),
      this.add(p),
      c.pids)
    )
      for (s = 0; s < c.pids.length; s++) {
        if (
          (this.add({
            id: "_ft_child_group_" + s,
            mid: e,
            fid: c.pids[s],
            tags: ["children-group"],
          }),
          "_ft_partner" == c.pids[s])
        ) {
          var f = {
              id: "_ft_son_" + s,
              stpid: "_ft_child_group_" + s,
              templateName: "son",
              _ft_method: "addChildAndPartnerNodes",
              _ft_childData: {
                mid: t.id,
                fid: p.id,
                gender: "male",
              },
              _ft_parentData: {
                pids: [e],
              },
              _ft_id: e,
            },
            y = {
              id: "_ft_daughter_" + s,
              stpid: "_ft_child_group_" + s,
              templateName: "daughter",
              _ft_method: "addChildAndPartnerNodes",
              _ft_childData: {
                mid: t.id,
                fid: p.id,
                gender: "female",
              },
              _ft_parentData: {
                pids: [e],
              },
              _ft_id: e,
            };
          "male" == c.gender && "female" == p._ft_data.gender
            ? ((f._ft_childData.mid = p.id),
              (f._ft_childData.fid = c.id),
              (f._ft_parentData.gender = p._ft_data.gender),
              (y._ft_childData.mid = p.id),
              (y._ft_childData.fid = c.id),
              (y._ft_parentData.gender = p._ft_data.gender))
            : "female" == c.gender &&
              "male" == p._ft_data.gender &&
              ((f._ft_childData.mid = c.id),
              (f._ft_childData.fid = p.id),
              (f._ft_parentData.gender = p._ft_data.gender),
              (y._ft_childData.mid = c.id),
              (y._ft_childData.fid = p.id),
              (y._ft_parentData.gender = p._ft_data.gender)),
            this.add(f),
            this.add(y);
        } else
          this.add({
            id: "_ft_son_" + s,
            stpid: "_ft_child_group_" + s,
            templateName: "son",
            _ft_method: "addChildNode",
            _ft_data: {
              mid: e,
              fid: c.pids[s],
              gender: "male",
            },
          }),
            this.add({
              id: "_ft_daughter_" + s,
              stpid: "_ft_child_group_" + s,
              templateName: "daughter",
              _ft_method: "addChildNode",
              _ft_data: {
                mid: e,
                fid: c.pids[s],
                gender: "female",
              },
            });
        for (var u = 0; u < l.length; u++)
          (l[u].mid != c.pids[s] && l[u].fid != c.pids[s]) ||
            ((l[u].mid = void 0),
            (l[u].fid = void 0),
            (l[u].stpid = "_ft_child_group_" + s),
            this.add(l[u]));
      }
    this.add(c);
    var g = this;
    FamilyTree.isNEU(c.mid)
      ? FamilyTree.isNEU(c.fid) || (this.config.roots = [c.fid])
      : (this.config.roots = [c.mid]);
    var b = {
      id: e,
      treeMenuMode: !0,
    };
    this._draw(!1, FamilyTree.action.update, b, function () {
      FamilyTree._moveToBoundaryArea(
        g.getSvg(),
        g.getViewBox(),
        g.response.boundary
      );
    });
  }),
  (FamilyTree.ui.css = function () {
    return '<style data-baoc-styles>.bft-button{background-color:#039be5;cursor:pointer;width:calc(100%);height:50px;color:#fff;padding-top:5px;padding-left:7px;padding-right:7px;text-align:center;text-transform:uppercase;border:1px solid #3fc0ff;display:inline-block;border-radius:5px}.bft-button.orange{background-color:#f57c00;border:1px solid #ffa03e}.bft-button.yellow{background-color:#ffca28;border:1px solid #ffdf7c}.bft-button.lower{text-transform:unset}.bft-button.transparent{background-color:transparent}.bft-button:hover{background-color:#35afea}.bft-button.orange:hover{background-color:#f79632}.bft-button.yellow:hover{background-color:#ffd452}.bft-button:active{transform:matrix(.98,0,0,.98,0,0)}.bft-button-icon{text-align:initial;cursor:pointer;margin-bottom:15px;color:#039be5}.bft-dark .bft-button-icon:hover{background-color:#2d2d2d}.bft-light .bft-button-icon:hover{background-color:#ececec}.bft-button-icon>img{height:24px;width:24px;vertical-align:middle;padding:7px}.bft-button:focus{outline:0}.bft-button-icon>img{filter:invert(46%) sepia(66%) saturate(2530%) hue-rotate(171deg) brightness(95%) contrast(98%)}.bft-light .bft-button.transparent{color:#039be5}.bft-light .bft-button.transparent:hover{color:#fff}.bft-button-loading{background-color:transparent;cursor:pointer;width:calc(100% - 2px);height:50px;color:#fff;text-align:center;text-transform:uppercase;border:1px solid #027cb7;display:inline-block;display:flex;justify-content:center;align-items:center;display:none}.bft-button-loading .bft-loading-dots div{margin:0 10px}.bft-link-bft-button{position:absolute;right:10px;top:-1px}[data-bft-input-disabled] .bft-link-bft-button{display:none}[dir=rtl] .bft-link-bft-button{left:10px;right:unset}.bft-img-button{width:48px;height:48px;cursor:pointer;border-radius:50%;background-color:#039be5;background-repeat:no-repeat;background-size:24px 24px;background-position:center center;margin:3px;display:inline-block}.bft-img-button:hover{background-color:#f57c00}.bft-checkbox{display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.bft-checkbox input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.bft-checkbox-checkmark{position:absolute;top:0;left:0;height:25px;width:25px;border-radius:5px}.bft-dark [data-bft-input-disabled] .bft-checkbox-checkmark,.bft-dark [data-bft-input-disabled].bft-checkbox input:checked~.bft-checkbox-checkmark,.bft-light [data-bft-input-disabled] .bft-checkbox-checkmark,.bft-light [data-bft-input-disabled].bft-checkbox input:checked~.bft-checkbox-checkmark{background-color:#aeaeae!important}[data-bft-input-disabled].bft-checkbox{cursor:default}[dir=rtl] .bft-checkbox-checkmark{right:0}[dir=rtl] .bft-checkbox{padding-left:unset;padding-right:35px}.bft-dark .bft-checkbox-checkmark{background-color:#333;border:1px solid #5b5b5b}.bft-light .bft-checkbox-checkmark{background-color:#fff;border:1px solid #c7c7c7}.bft-dark .bft-checkbox:hover input~.bft-checkbox-checkmark{background-color:#3c3c3c}.bft-light .bft-checkbox:hover input~.bft-checkbox-checkmark{background-color:#f8f9f9}.bft-dark .bft-checkbox input:checked~.bft-checkbox-checkmark{background-color:#039be5}.bft-light .bft-checkbox input:checked~.bft-checkbox-checkmark{background-color:#039be5}.bft-checkbox-checkmark:after{content:"";position:absolute;display:none}.bft-checkbox input:checked~.bft-checkbox-checkmark:after{display:block}.bft-checkbox .bft-checkbox-checkmark:after{left:9px;top:5px;width:5px;height:10px;border:solid #fff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.bft-form-perspective{transform-style:preserve-3d;perspective:500px;position:absolute;top:32px}.bft-form{box-shadow:rgba(0,0,0,.2) 0 6px 6px 0,rgba(0,0,0,.19) 0 13px 20px 0;padding:14px;transform-origin:top center;user-select:none;display:none;position:relative;max-height:calc(100vh - 100px);overflow-y:auto;border-bottom-left-radius:5px;border-bottom-right-radius:5px}.bft-form-bottom{border-bottom-left-radius:unset;border-bottom-right-radius:unset;border-top-left-radius:5px;border-top-right-radius:5px}.bft-form .separator{margin:0 10px}@media screen and (max-width:1000px){.bft-form-perspective{min-width:100%;max-height:calc(100% - 32px);left:unset!important;right:unset!important;transform:none!important}.bft-form .set{max-height:calc(100vh - 74px)}.bft-form-fieldset{max-width:unset!important}}.bft-light .bft-form .separator{border-bottom:1px solid #c7c7c7}.bft-dark .bft-form .separator{border-bottom:1px solid #5b5b5b}.bft-light .bft-form{background-color:#fff}.bft-dark .bft-form{background-color:#252526}.bft-item{padding:6px 12px 6px 12px;display:flex;flex-direction:row}.bft-light .bft-form .bft-item.selected,.bft-light .bft-form .bft-item:hover{background-color:#0074e8;color:#fff}.bft-dark .bft-form .bft-item.selected,.bft-dark .bft-form .bft-item:hover{background-color:#094771;color:#fff}.bft-item.selected img,.bft-item:hover img{filter:invert(100%)}.bft-item.selected img{visibility:visible!important}.bft-form-fieldset{display:flex;flex-wrap:wrap;margin:0!important}.bft-form-field{flex:1 0 21%;margin:3px;min-width:200px}.bft-form-field-100{flex:1 0 96%;margin:3px;min-width:200px}.bft-input{position:relative}.bft-input>input,.bft-input>select{height:50px;padding:18px 10px 2px 9px;width:100%;box-sizing:border-box;border-style:solid;border-width:1px}.bft-input select{height:50px;padding:20px 5px 4px 5px}[data-bft-input-disabled].bft-input>input,[data-bft-input-disabled].bft-input>select{border-color:transparent!important}.bft-light [data-bft-input-disabled]>input,.bft-light [data-bft-input-disabled]>select{background-color:#fff!important}.bft-dark [data-bft-input-disabled]>input,.bft-dark [data-bft-input-disabled]>select{background-color:#252526!important}[data-bft-input-disabled]>select{appearance:none;padding-left:8px}.bft-input>label{display:inline-block;position:absolute;padding-left:10px;padding-right:10px;color:#acacac;cursor:text;-webkit-transition:all .1s ease-out;-moz-transition:all .1s ease-out;-ms-transition:all .1s ease-out;-o-transition:all .1s ease-out;transition:all .1 ease-out;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:initial;text-align:initial;white-space:nowrap}.bft-input>label{top:12px;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 14px)}.bft-input>label.focused,.bft-input>label.hasval{top:-1px}.bft-input>input,.bft-input>select{outline:0;border-radius:5px}.bft-dark .bft-input>label.focused,.bft-light .bft-input>label.focused{color:#039be5}.bft-dark .bft-input>input,.bft-dark .bft-input>select{color:#ccc;background-color:#333;border-color:#5b5b5b}.bft-light .bft-input>input,.bft-light .bft-input>select{color:#757575;background-color:#fff;border-color:#c7c7c7}.bft-light .bft-input>input:focus,.bft-light .bft-input>select:focus{border-color:#039be5;background-color:#f8f9f9}.bft-dark .bft-input>input:focus,.bft-dark .bft-input>select:focus{border-color:#039be5;background-color:#3c3c3c}.bft-dark .bft-input>input.bft-validation-error,.bft-dark .bft-input>select.bft-validation-error,.bft-light .bft-input>input.bft-validation-error,.bft-light .bft-input>select.bft-validation-error{border-color:#ca2a2a}.bft-dark .bft-validation-error-message,.bft-light .bft-validation-error-message{color:#ca2a2a}.bft-link{color:#039be5;cursor:pointer;text-decoration:underline}.bft-link:hover{color:#f57c00}.bft-dark ::-webkit-scrollbar,.bft-light ::-webkit-scrollbar{width:15px}.bft-dark ::-webkit-scrollbar-track{background:#1e1e1e;border-left:1px solid #333}.bft-dark ::-webkit-scrollbar-thumb{background:#424242}.bft-dark ::-webkit-scrollbar-thumb:hover{background:#4f4f4f}.bft-dark ::-webkit-scrollbar-thumb:active{background:#5e5e5e}.bft-light ::-webkit-scrollbar-track{background:#fff;border-left:1px solid #ddd}.bft-light ::-webkit-scrollbar-thumb{background:#c1c1c1}.bft-light ::-webkit-scrollbar-thumb:hover{background:#929292}.bft-light ::-webkit-scrollbar-thumb:active{background:#666}.bft-edit-form{position:fixed;top:0;right:0;height:100%;width:100%;box-shadow:rgba(0,0,0,.2) 0 6px 6px 0,rgba(0,0,0,.19) 0 13px 20px 0;display:flex;flex-direction:column;height:100%;width:400px}@media screen and (max-width:1000px){.bft-edit-form{width:100%}}.bft-dark .bft-edit-form{background-color:#252526}.bft-light .bft-edit-form{background-color:#fff}.bft-edit-form-header{height:200px;text-align:center;border-radius:10px}.export-service .bft-edit-form-header{border-radius:unset}.bft-edit-form-title{color:#fff;margin:0;padding:14px 17px 7px 17px}.bft-edit-form-avatar{border-radius:50%;width:150px;height:150px;position:absolute;top:75px;border:5px solid #fff;left:50%;transform:translateX(-50%);background-color:#cacaca;box-shadow:rgba(0,0,0,.2) 0 6px 6px 0,rgba(0,0,0,.19) 0 13px 20px 0}.bft-edit-form-close{position:absolute;right:14px;top:14px;width:34px;height:34px;cursor:pointer}.bft-edit-form-fields{flex-grow:1;overflow-y:auto;overflow-x:hidden}.bft-edit-form-fields-inner{margin:0 7px 20px 7px}.bft-chart-menu{opacity:0;display:inline-block;position:absolute;text-align:left;user-select:none;min-width:270px;box-shadow:rgba(0,0,0,.2) 0 4px 8px 0,rgba(0,0,0,.19) 0 6px 20px 0;font:13px/28px Figtree,"Segoe UI",Arial,sans-serif;border-radius:10px}.bft-chart-menu>div:hover img{filter:invert(100%)}.bft-chart-menu [data-item]{text-align:start;padding:7px 10px}.bft-dark .bft-chart-menu [data-item]{background-color:#252526;color:#acacac;border-bottom:1px solid #333}.bft-dark .bft-chart-menu [data-item]:hover{background-color:#094771!important;color:#fff!important}.bft-dark .bft-chart-menu [data-item]:hover svg{filter:brightness(0) invert(1)}.bft-light .bft-chart-menu [data-item]{background-color:#fff;color:#333;border-bottom:1px solid #c7c7c7}.bft-light .bft-chart-menu [data-item]:hover{background-color:#0074e8!important;color:#fff!important}.bft-light .bft-chart-menu [data-item]:hover svg{filter:brightness(0) invert(1)}.bft-chart-menu [data-item] svg{vertical-align:middle}.bft-chart-menu [data-item]:first-child{border-top-left-radius:7px;border-top-right-radius:7px}.bft-chart-menu [data-item]:last-child{border-bottom-width:0;border-bottom-style:none;border-bottom-left-radius:7px;border-bottom-right-radius:7px}.bft-search{position:absolute}@media screen and (max-width:1000px){.bft-search{width:calc(100% - 30px)}}.bft-search .bft-input{margin-bottom:0}.bft-search-input{color:#7a7a7a;width:100%;border:none;outline:0;padding-top:10px;padding-right:47px}.bft-search label{padding-right:47px}.bft-search-image-td{width:43px}.bft-search-text-td{padding-inline-end:7px;line-height:15px;text-align:start}.bft-search table{box-shadow:rgba(0,0,0,.2) 0 4px 8px 0,rgba(0,0,0,.19) 0 6px 20px 0;margin:0 3.5px 0 3.5px;width:calc(100% - 7px);border-radius:7px}.bft-search table tr:first-child td:first-child{border-top-left-radius:7px}.bft-search table tr:first-child td:last-child{border-top-right-radius:7px}[dir=rtl] .bft-search table tr:first-child td:first-child{border-top-left-radius:unset;border-top-right-radius:7px}[dir=rtl] .bft-search table tr:first-child td:last-child{border-top-right-radius:unset;border-top-left-radius:7px}.bft-search table tr:last-child td:first-child{border-bottom-left-radius:7px}.bft-search table tr:last-child td:last-child{border-bottom-right-radius:7px}[dir=rtl] .bft-search table tr:last-child td:first-child{border-bottom-left-radius:unset;border-bottom-right-radius:7px}[dir=rtl] .bft-search table tr:last-child td:last-child{border-bottom-right-radius:unset;border-bottom-left-radius:7px}.bft-dark .bft-search table{background-color:#252526;color:#acacac}.bft-search [data-search-item-id]{cursor:pointer}.bft-search-photo{margin:7px 7px 0 7px;width:32px;height:32px;background-size:cover;background-position:top center;border-radius:50%;display:inline-block;border:1px solid #8c8c8c}.bft-dark .bft-search [data-search-item-id] td{border-top:1px solid #333}.bft-dark .bft-search [data-search-item-id]:hover,.bft-dark .bft-search [data-selected=yes]{background-color:#094771;color:#fff}.bft-light .bft-search table{background-color:#fff;color:#333}.bft-light .bft-search [data-search-item-id] td{border-top:1px solid #c7c7c7}.bft-light .bft-search [data-search-item-id]:hover,.bft-light .bft-search [data-selected=yes]{background-color:#0074e8;color:#fff}.bft-search [data-search-item-id]:first-child td{border-top:unset}.bft-ripple-container{position:absolute;top:0;right:0;bottom:0;left:0}.bft-drag-over rect{opacity:.5}.bft-ripple-container span{transform:scale(0);border-radius:100%;position:absolute;opacity:.75;background-color:#fff;animation:bft-ripple 1s}@-moz-keyframes bft-ripple{to{opacity:0;transform:scale(2)}}@-webkit-keyframes bft-ripple{to{opacity:0;transform:scale(2)}}@-o-keyframes bft-ripple{to{opacity:0;transform:scale(2)}}@keyframes bft-ripple{to{opacity:0;transform:scale(2)}}.bft-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.bft-slider:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}.bft-slider.round{border-radius:24px}.bft-slider.round:before{border-radius:50%}svg text:hover{cursor:default}svg.bft-cursor-grab,svg.bft-cursor-grab text:hover{cursor:grab}svg.bft-cursor-nodrop,svg.bft-cursor-nodrop text:hover{cursor:no-drop}svg.bft-cursor-copy,svg.bft-cursor-copy text:hover{cursor:copy}svg.bft-cursor-move,svg.bft-cursor-move text:hover{cursor:move}#bft-close-btn:focus,#bft-close-btn:hover{color:#000;text-decoration:none;cursor:pointer}#bft-id-select:focus{outline:.5px solid #aeaeae}#bft-sampleDialog #title:hover{cursor:default;background:gray}.bft-light{background-color:#fff;font:13px/28px Figtree,"Segoe UI",Arial,sans-serif}.bft-dark{background-color:#1e1e1e;font:13px/28px Figtree,"Segoe UI",Arial,sans-serif}.bft-light .bft-fill{fill:#fff}.bft-dark .bft-fill{fill:#1e1e1e}.bft-dark input,.bft-dark select,.bft-light input,.bft-light select{font:16px Figtree,"Segoe UI",Arial,sans-serif}.bft-dark h1,.bft-light h1{font-size:30px;line-height:1}.bft-edit-form{position:absolute;border-radius:10px}.export-service .bft-edit-form{border-radius:unset}.bft-dark .bft-edit-form{color:#acacac}.bft-light .bft-edit-form{color:#333}.bft-dark ::-webkit-calendar-picker-indicator{filter:invert(70%)}.bft-light ::-webkit-calendar-picker-indicator{filter:invert(50%)}.bft-edit-form-instruments{margin:42px 10px 0 10px;text-align:center;min-height:70px}.bft-img-button svg{position:relative;top:12px}.bft-light .bft-toolbar-container svg circle,.bft-light .bft-toolbar-container svg line,.bft-light .bft-toolbar-container svg path{stroke:#8c8c8c!important}.bft-dark .bft-toolbar-container svg circle,.bft-dark .bft-toolbar-container svg line,.bft-dark .bft-toolbar-container svg path{stroke:#8c8c8c!important}.bft-dark .bft-toolbar-container svg rect{fill:#252526!important}.bft-dark .bft-toolbar-container [data-tlbr=minus] svg{border-left:1px solid #5b5b5b!important;border-right:1px solid #5b5b5b!important;border-bottom:1px solid #5b5b5b!important}.bft-dark .bft-toolbar-container [data-tlbr=plus] svg{border-left:1px solid #5b5b5b!important;border-right:1px solid #5b5b5b!important;border-top:1px solid #5b5b5b!important}.bft-dark .bft-toolbar-container [data-tlbr]>svg{border:1px solid #5b5b5b!important;background-color:#252526!important}</style>';
  }),
  FamilyTree.events.on("render", function (e, t) {
    if ((e.recentRoots || (e.recentRoots = []), e.config.roots))
      for (var i = 0; i < e.config.roots.length; i++) {
        var r = e.recentRoots.indexOf(e.config.roots[i]);
        -1 != r && e.recentRoots.splice(r, 1),
          e.recentRoots.unshift(e.config.roots[i]);
      }
  }),
  FamilyTree.events.on("render-link", function (e, t) {
    null != t.cnode.ppid &&
      t.cnode.layout != FamilyTree.mixed &&
      (t.html +=
        '<use xlink:href="#dot" x="' + t.p.xa + '" y="' + t.p.ya + '"/>');
  }),
  FamilyTree.events.on("click", function (e, t) {
    var i = e._get(t.node.id);
    if (i._ft_method)
      return (
        "addParentNode" == i._ft_method
          ? e[i._ft_method](i._ft_childId, i._ft_type, i._ft_data, null, !0)
          : "addChildAndPartnerNodes" == i._ft_method
          ? e[i._ft_method](
              i._ft_id,
              i._ft_childData,
              i._ft_parentData,
              null,
              !0
            )
          : e[i._ft_method](i._ft_data, null, !0),
        !1
      );
    for (var r = t.event.target; r; ) {
      if (
        r.getAttribute &&
        (r.hasAttribute("data-ctrl-n-t-menu-id") ||
          r.hasAttribute("data-ctrl-n-t-menu-c"))
      ) {
        var a = r.getAttribute("data-ctrl-n-t-menu-id");
        return (
          FamilyTree.isNEU(a) ? e.hideTreeMenu(!0) : e.showTreeMenu(a),
          t.event.stopPropagation(),
          t.event.preventDefault(),
          !1
        );
      }
      r = r.parentNode;
    }
  }),
  void 0 === FamilyTree && (FamilyTree = {}),
  (FamilyTree.local = {}),
  (FamilyTree.local._setPositions = function (e, t, i) {
    for (var r = {}, a = 0; a < e.length; a++) {
      if ((s = e[a]).stContainerNodes)
        for (var n = s.stContainerNodes.length - 1; n >= 0; n--) {
          var o = s.stContainerNodes[n],
            l = FamilyTree.local._walk(o.stChildren, t);
          (o.w = l.maxX - l.minX + o.padding[3] + o.padding[1]),
            (o.h = l.maxY - l.minY + o.padding[0] + o.padding[2]),
            o._m && ((o._m.w = o.w), (o._m.h = o.h)),
            (r[o.id] = l);
        }
    }
    FamilyTree.local._walk(e, t);
    for (a = 0; a < e.length; a++) {
      var s;
      if ((s = e[a]).stContainerNodes)
        for (n = 0; n < s.stContainerNodes.length; n++)
          for (
            var d = (o = s.stContainerNodes[n]).x, c = o.y, m = 0;
            m < o.stChildren.length;
            m++
          ) {
            var h = o.stChildren[m];
            FamilyTree.local._lastWalk(h, d, c, r[o.id], o.padding);
          }
    }
    i();
  }),
  (FamilyTree.local._walk = function (e, t) {
    for (
      var i = {
          minX: null,
          minY: null,
          maxX: null,
          maxY: null,
        },
        r = [],
        a = [],
        n = [],
        o = 0;
      o < e.length;
      o++
    ) {
      var l = t[e[o].lcn ? e[o].lcn : "base"];
      0 == o - (s = parseInt(o / l.columns)) * l.columns && (n = []),
        FamilyTree.local._firstWalk(e[o], 0, r, n, l);
    }
    for (o = 0; o < e.length; o++) {
      (l = t[e[o].lcn ? e[o].lcn : "base"]),
        (s = parseInt(o / l.columns)),
        l.columns;
      var s,
        d = 0;
      switch (
        (s > 0 && (d = a[s - 1] + l.siblingSeparation),
        FamilyTree.local._secondWalk(e[o], 0, 0, d, r, i, l),
        (a[s] = i.maxY - i.minY),
        l.orientation)
      ) {
        case FamilyTree.orientation.right:
        case FamilyTree.orientation.right_top:
        case FamilyTree.orientation.left:
        case FamilyTree.orientation.left_top:
          a[s] = i.maxX - i.minX;
      }
    }
    return i;
  }),
  (FamilyTree.local._firstWalk = function (e, t, i, r, a) {
    if (!e.isPartner) {
      var n = null;
      if (
        ((e.x = 0),
        (e.y = 0),
        (e._prelim = 0),
        (e._modifier = 0),
        (e.leftNeighbor = null),
        (e.rightNeighbor = null),
        FamilyTree.local._setLevelMaxNodeHeight(e, t, i, a),
        FamilyTree.local._setNeighbors(e, t, r),
        FamilyTree.local._hasChildren(e) && t != FamilyTree.MAX_DEPTH)
      ) {
        for (var o = e.children.length, l = 0; l < o; l++)
          FamilyTree.local._firstWalk(e.children[l], t + 1, i, r, a);
        var s = FamilyTree.local._fChild(e),
          d = e.children[e.children.length - 1],
          c =
            s._prelim +
            (d._prelim - s._prelim) / 2 +
            FamilyTree.local._leftMidPoint(d, a);
        if (
          (s.isAssistant &&
            d.isAssistant &&
            (c =
              s._prelim +
              (d._prelim - s._prelim) / 2 +
              FamilyTree.local._leftMidPoint(s, a)),
          (c -= FamilyTree.local._mid(e, a)),
          null != (n = FamilyTree.local._getLeftSibling(e)))
        ) {
          m = a.siblingSeparation;
          if (e.isAssistant && e.isSplit) m = a.assistantSeparation;
          else if (2 == n.layout) m = a.mixedHierarchyNodesSeparation;
          else if (
            n.parent &&
            4 == n.parent.hasPartners &&
            a.orientation <= 3
          ) {
            (h = FamilyTree.local._size(n.parent, a)),
              (p = FamilyTree.local._rightMidPoint(n, a));
            (m = n.parent.partnerSeparation + h / 2 - p) <
              a.siblingSeparation && (m = a.siblingSeparation);
          }
          (e._prelim =
            n._prelim + FamilyTree.local._nodeWithPartnersSize(n, a) + m),
            (e._modifier = e._prelim - c),
            FamilyTree.local._apportion(e, t, i, a);
        } else a.orientation <= 3 ? (e._prelim = c) : (e._prelim = 0);
      } else if (null != (n = FamilyTree.local._getLeftSibling(e))) {
        var m = a.siblingSeparation;
        if (e.isAssistant) m = a.assistantSeparation;
        else if (2 == n.layout) m = a.mixedHierarchyNodesSeparation;
        else if (n.parent && 4 == n.parent.hasPartners && a.orientation <= 3) {
          var h = FamilyTree.local._size(n.parent, a),
            p = FamilyTree.local._rightMidPoint(n, a);
          (m = n.parent.partnerSeparation + h / 2 - p) < a.siblingSeparation &&
            (m = a.siblingSeparation);
        }
        e._prelim =
          n._prelim + FamilyTree.local._nodeWithPartnersSize(n, a) + m;
      } else e._prelim = 0;
    }
  }),
  (FamilyTree.local._secondWalk = function (e, t, i, r, a, n, o) {
    if (t <= FamilyTree.MAX_DEPTH && !e.isPartner) {
      var l,
        s = e._prelim + i,
        d = r,
        c = 0;
      switch (
        ((c = a[t]),
        (l = FamilyTree.local._getNodeHeight(e, o)),
        e.layout && !e.isSplit
          ? (c = l)
          : e.layout &&
            e.isSplit &&
            (e.leftNeighbor &&
            e.leftNeighbor.layout &&
            -1 == e.leftNeighbor.id.toString().indexOf("mirror")
              ? (c = FamilyTree.local._getNodeHeight(e.leftNeighbor, o))
              : e.rightNeighbor &&
                e.rightNeighbor.layout &&
                -1 == e.rightNeighbor.id.toString().indexOf("mirror") &&
                (c = FamilyTree.local._getNodeHeight(e.rightNeighbor, o))),
        (e.x = s),
        (e.y = d),
        e.hasPartners && FamilyTree.local.nodeHasPartnersPosition(e, o, c),
        (e.isSplit || e.isAssistant || 2 == e.layout) &&
          (e.y = d + c / 2 - l / 2),
        o.orientation)
      ) {
        case FamilyTree.orientation.right:
        case FamilyTree.orientation.right_top:
        case FamilyTree.orientation.left:
        case FamilyTree.orientation.left_top:
          var m = e.x;
          (e.x = e.y), (e.y = m);
      }
      switch (o.orientation) {
        case FamilyTree.orientation.bottom:
        case FamilyTree.orientation.bottom_left:
          e.y = -e.y - l;
          break;
        case FamilyTree.orientation.right:
        case FamilyTree.orientation.right_top:
          e.x = -e.x - l;
      }
      if ((FamilyTree._setMinMaxXY(e, n), 0 != e.children)) {
        var h = o.levelSeparation;
        e.layout && (h = o.mixedHierarchyNodesSeparation);
        var p = 0;
        if (
          (FamilyTree.local._secondWalk(
            e.children[p],
            t + 1,
            i + e._modifier,
            r + c + h,
            a,
            n,
            o
          ),
          e.children[p].isPartner)
        ) {
          for (; e.children.length - 1 > p && e.children[p].isPartner; ) p++;
          FamilyTree.local._secondWalk(
            e.children[p],
            t + 1,
            i + e._modifier,
            r + c + h,
            a,
            n,
            o
          );
        }
      }
      var f = FamilyTree.local._getRightSibling(e);
      null != f && FamilyTree.local._secondWalk(f, t, i, r, a, n, o);
    } else FamilyTree.local.nodeIsPartnerPosition(e, o, a, t);
  }),
  (FamilyTree.local._lastWalk = function (e, t, i, r, a) {
    (e.x += t + a[3] - r.minX), (e.y += i + a[0] - r.minY);
    for (var n = e.children.length, o = 0; o < n; o++) {
      var l = e.children[o];
      FamilyTree.local._lastWalk(l, t, i, r, a);
    }
  }),
  (FamilyTree.local._apportion = function (e, t, i, r) {
    if (!e.isPartner)
      for (
        var a = FamilyTree.local._fChild(e),
          n = a.leftNeighbor,
          o = 1,
          l = FamilyTree.MAX_DEPTH - t;
        null != a && null != n && o <= l;

      ) {
        for (var s = 0, d = 0, c = a, m = n, h = 0; h < o; h++)
          (c = c.parent),
            (m = m.parent),
            (s += c._modifier),
            (d += m._modifier);
        var p = r.subtreeSeparation;
        e.leftNeighbor && 2 == e.leftNeighbor.layout && (p = 0);
        var f =
          n._prelim +
          d +
          FamilyTree.local._nodeWithPartnersSize(n, r) +
          p -
          (a._prelim + s);
        if (f > 0) {
          for (
            var y = e, u = 0;
            null != y && y != m;
            y = FamilyTree.local._getLeftSibling(y)
          )
            u++;
          if (null != y)
            for (
              var g = e, b = f / u;
              g != m;
              g = FamilyTree.local._getLeftSibling(g)
            ) {
              var T = !0;
              if (g.layout) {
                var v = i[t],
                  F = {
                    config: r,
                    node: e,
                    size: -r.mixedHierarchyNodesSeparation,
                  };
                if (-1 != F.node.id.toString().indexOf("mirror"))
                  for (
                    var x = F.node.id.toString().replace("_mirror", ""), _ = 0;
                    _ < F.node.parent.children.length;
                    _++
                  )
                    if (F.node.parent.children[_].id == x) {
                      F.node = F.node.parent.children[_];
                      break;
                    }
                FamilyTree.local._mixedTreeHeight(F), (T = v < F.size);
              }
              T && ((g._prelim += f), (g._modifier += f), (f -= b));
            }
        }
        o++,
          null !=
            (a = FamilyTree.local._hasChildren(a)
              ? FamilyTree.local._fChild(a)
              : FamilyTree.local._getLeftmost(e, 0, o)) && (n = a.leftNeighbor);
      }
  }),
  (FamilyTree.local._mixedTreeHeight = function (e) {
    e.size +=
      FamilyTree.local._getNodeHeight(e.node, e.config) +
      e.config.mixedHierarchyNodesSeparation;
    for (var t = 0; t < e.node.children.length; t++)
      (e.node = e.node.children[t]), FamilyTree.local._mixedTreeHeight(e);
  }),
  (FamilyTree.local._setLevelMaxNodeHeight = function (e, t, i, r) {
    null == i[t] && (i[t] = 0);
    var a = FamilyTree.local._getNodeHeight(e, r);
    i[t] < a && (i[t] = a);
  }),
  (FamilyTree.local._setNeighbors = function (e, t, i) {
    (i[t] && i[t].id === e.id) ||
      ((e.leftNeighbor = i[t]),
      null != e.leftNeighbor && (e.leftNeighbor.rightNeighbor = e),
      e.isPartner || (i[t] = e));
  }),
  (FamilyTree.local._nodeWithPartnersSize = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return (
          FamilyTree.local._getPartnerRightPanelWidth(e, t) +
          e.w +
          FamilyTree.local._getPartnerLeftPanelWidth(e, t)
        );
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return (
          FamilyTree.local._getPartnerRightPanelHeight(e, t) +
          e.h +
          FamilyTree.local._getPartnerLeftPanelHeight(e, t)
        );
    }
    return 0;
  }),
  (FamilyTree.local._size = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return e.w;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return e.h;
    }
    return 0;
  }),
  (FamilyTree.local._leftMidPoint = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return FamilyTree.local._getPartnerLeftPanelWidth(e, t) + e.w / 2;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return FamilyTree.local._getPartnerLeftPanelHeight(e, t) + e.h / 2;
    }
    return 0;
  }),
  (FamilyTree.local._rightMidPoint = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return FamilyTree.local._getPartnerRightPanelWidth(e, t) + e.w / 2;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return FamilyTree.local._getPartnerRightPanelHeight(e, t) + e.h / 2;
    }
    return 0;
  }),
  (FamilyTree.local._mid = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        switch (e.hasPartners) {
          case 2:
            return (
              FamilyTree.local._getPartnerLeftPanelWidth(e, t) -
              e.partnerSeparation / 2
            );
          case 3:
            return (
              FamilyTree.local._getPartnerLeftPanelWidth(e, t) +
              e.w +
              e.partnerSeparation / 2
            );
          case 4:
            if (t.orientation <= 3) {
              var i = FamilyTree.local._rightMidPoint(
                  FamilyTree.local._fChild(e),
                  t
                ),
                r = FamilyTree.local._leftMidPoint(
                  e.children[e.children.length - 1],
                  t
                );
              return (
                FamilyTree.local._getPartnerLeftPanelWidth(e, t) +
                e.w / 2 +
                (r - i) / 2
              );
            }
            return FamilyTree.local._getPartnerLeftPanelWidth(e, t) + e.w / 2;
          default:
            return FamilyTree.local._getPartnerLeftPanelWidth(e, t) + e.w / 2;
        }
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        switch (e.hasPartners) {
          case 2:
            return (
              FamilyTree.local._getPartnerLeftPanelHeight(e, t) -
              e.partnerSeparation / 2
            );
          case 3:
            return (
              FamilyTree.local._getPartnerLeftPanelHeight(e, t) +
              e.h +
              e.partnerSeparation / 2
            );
          case 4:
            if (t.orientation <= 3) {
              (i = FamilyTree.local._rightMidPoint(
                FamilyTree.local._fChild(e),
                t
              )),
                (r = FamilyTree.local._leftMidPoint(
                  e.children[e.children.length - 1],
                  t
                ));
              return (
                FamilyTree.local._getPartnerLeftPanelHeight(e, t) +
                e.h / 2 +
                (r - i) / 2
              );
            }
            return FamilyTree.local._getPartnerLeftPanelHeight(e, t) + e.h / 2;
          default:
            return FamilyTree.local._getPartnerLeftPanelHeight(e, t) + e.h / 2;
        }
    }
    return 0;
  }),
  (FamilyTree.local._getNodeHeight = function (e, t) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        return Math.max(
          FamilyTree.local._getPartnerRightPanelHeight(e, t),
          e.h,
          FamilyTree.local._getPartnerLeftPanelHeight(e, t)
        );
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        return Math.max(
          FamilyTree.local._getPartnerRightPanelWidth(e, t),
          e.w,
          FamilyTree.local._getPartnerLeftPanelWidth(e, t)
        );
    }
    return 0;
  }),
  (FamilyTree.local._getLeftSibling = function (e) {
    return null != e.leftNeighbor && e.leftNeighbor.parent == e.parent
      ? e.leftNeighbor
      : null;
  }),
  (FamilyTree.local._getRightSibling = function (e) {
    return null != e.rightNeighbor && e.rightNeighbor.parent == e.parent
      ? e.rightNeighbor
      : null;
  }),
  (FamilyTree.local._getLeftmost = function (e, t, i) {
    if (t >= i) return e;
    if (!FamilyTree.local._hasChildren(e)) return null;
    for (var r = e.children.length, a = 0; a < r; a++) {
      var n = e.children[a];
      if (!n.isPartner) {
        var o = FamilyTree.local._getLeftmost(n, t + 1, i);
        if (null != o) return o;
      }
    }
    return null;
  }),
  (FamilyTree.local.nodeHasPartnersPosition = function (e, t, i) {
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        var r = FamilyTree.local._getPartnerLeftPanelWidth(e, t);
        (e.x += r),
          e.h < i &&
            (t.orientation == FamilyTree.orientation.bottom ||
            t.orientation == FamilyTree.orientation.bottom_left
              ? (e.y -= (i - e.h) / 2)
              : (e.y += (i - e.h) / 2));
        break;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        var a = FamilyTree.local._getPartnerLeftPanelHeight(e, t);
        (e.x += a),
          e.w < i &&
            (t.orientation == FamilyTree.orientation.right ||
            t.orientation == FamilyTree.orientation.right_top
              ? (e.y -= (i - e.w) / 2)
              : (e.y += (i - e.w) / 2));
    }
  }),
  (FamilyTree.local.nodeIsPartnerPosition = function (e, t, i, r) {
    var a = 0,
      n = 0,
      o = 0,
      l = 0,
      s = 0,
      d = 0,
      c = 0,
      m = 0,
      h = !0,
      p = !0;
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        (a = FamilyTree.local._getPartnerLeftPanelHeight(e.parent, t)),
          (n = FamilyTree.local._getPartnerRightPanelHeight(e.parent, t));
        for (var f = 0; f < e.parent.children.length; f++) {
          1 == (y = e.parent.children[f]).isPartner
            ? ((o = e.parent.x + e.parent.w + e.parent.partnerSeparation),
              h
                ? ((l =
                    e.parent.y -
                    (i[r - 1] - e.parent.h) / 2 +
                    (i[r - 1] - n) / 2),
                  (m = y.h),
                  (h = !1))
                : ((l += m + t.partnerNodeSeparation), (m = y.h)),
              (y.x = o),
              (y.y = l))
            : 2 == y.isPartner &&
              ((s = e.parent.x - y.w - e.parent.partnerSeparation),
              p
                ? ((d =
                    e.parent.y -
                    (i[r - 1] - e.parent.h) / 2 +
                    (i[r - 1] - a) / 2),
                  (c = y.h),
                  (p = !1))
                : ((d += c + t.partnerNodeSeparation), (c = y.h)),
              (y.x = s),
              (y.y = d));
        }
        break;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        (a = FamilyTree.local._getPartnerLeftPanelWidth(e.parent, t)),
          (n = FamilyTree.local._getPartnerRightPanelWidth(e.parent, t));
        for (f = 0; f < e.parent.children.length; f++) {
          var y;
          (y = e.parent.children[f]) &&
            (1 == y.isPartner
              ? ((l = e.parent.y + e.parent.h + e.parent.partnerSeparation),
                h
                  ? ((o =
                      e.parent.x -
                      (i[r - 1] - e.parent.w) / 2 +
                      (i[r - 1] - n) / 2),
                    (m = y.w),
                    (h = !1))
                  : ((o += m + t.partnerNodeSeparation), (m = y.w)),
                (y.x = o),
                (y.y = l))
              : 2 == y.isPartner &&
                ((d = e.parent.y - y.h - e.parent.partnerSeparation),
                p
                  ? ((s =
                      e.parent.x -
                      (i[r - 1] - e.parent.w) / 2 +
                      (i[r - 1] - a) / 2),
                    (c = y.w),
                    (p = !1))
                  : ((s += c + t.partnerNodeSeparation), (c = y.w)),
                (y.x = s),
                (y.y = d)));
        }
    }
  }),
  (FamilyTree.local._getPartnerRightPanelWidth = function (e, t) {
    if (!e.hasPartners) return 0;
    var i = 0;
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        for (var r = 0; r < e.children.length; r++) {
          1 == (a = e.children[r]).isPartner && a.w > i && (i = a.w);
        }
        return i && (i += e.partnerSeparation), i;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        for (r = 0; r < e.children.length; r++) {
          var a;
          1 == (a = e.children[r]).isPartner &&
            (i += a.w + t.partnerNodeSeparation);
        }
        return i && (i -= t.partnerNodeSeparation), i;
    }
  }),
  (FamilyTree.local._getPartnerLeftPanelWidth = function (e, t) {
    if (!e.hasPartners) return 0;
    var i = 0;
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        for (var r = 0; r < e.children.length; r++) {
          2 == (a = e.children[r]).isPartner && a.w > i && (i = a.w);
        }
        return i && (i += e.partnerSeparation), i;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        for (r = 0; r < e.children.length; r++) {
          var a;
          2 == (a = e.children[r]).isPartner &&
            (i += a.w + t.partnerNodeSeparation);
        }
        return i && (i -= t.partnerNodeSeparation), i;
    }
  }),
  (FamilyTree.local._getPartnerRightPanelHeight = function (e, t) {
    if (!e.hasPartners) return 0;
    var i = 0;
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        for (var r = 0; r < e.children.length; r++) {
          1 == (a = e.children[r]).isPartner &&
            (i += a.h + t.partnerNodeSeparation);
        }
        return i && (i -= t.partnerNodeSeparation), i;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        for (r = 0; r < e.children.length; r++) {
          var a;
          1 == (a = e.children[r]).isPartner && a.h > i && (i = a.h);
        }
        return i && (i += e.partnerSeparation), i;
    }
  }),
  (FamilyTree.local._getPartnerLeftPanelHeight = function (e, t) {
    if (!e.hasPartners) return 0;
    var i = 0;
    switch (t.orientation) {
      case FamilyTree.orientation.top:
      case FamilyTree.orientation.top_left:
      case FamilyTree.orientation.bottom:
      case FamilyTree.orientation.bottom_left:
        for (var r = 0; r < e.children.length; r++) {
          2 == (a = e.children[r]).isPartner &&
            (i += a.h + t.partnerNodeSeparation);
        }
        return i && (i -= t.partnerNodeSeparation), i;
      case FamilyTree.orientation.right:
      case FamilyTree.orientation.right_top:
      case FamilyTree.orientation.left:
      case FamilyTree.orientation.left_top:
        for (r = 0; r < e.children.length; r++) {
          var a;
          2 == (a = e.children[r]).isPartner && a.h > i && (i = a.h);
        }
        return i && (i += e.partnerSeparation), i;
    }
  }),
  (FamilyTree.local._fChild = function (e) {
    for (var t = 0; t < e.children.length && e.children[t].isPartner; ) t++;
    return e.children[t];
  }),
  (FamilyTree.local._hasChildren = function (e) {
    for (var t = 0; t < e.children.length; t++)
      if (!e.children[t].isPartner) return !0;
    return !1;
  });
export default FamilyTree;
