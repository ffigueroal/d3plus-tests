function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
    @external BaseClass
    @see https://github.com/d3plus/d3plus-common#BaseClass
*/
import ckmeans from "./ckmeans";
import Legend from "./Legend";
import { extent, merge, min, quantile, range, deviation } from "d3-array";
import { scaleLinear, scaleThreshold } from "d3-scale";
import { select as _select } from "d3-selection";
import { transition } from "d3-transition";
import { Axis } from "d3plus-axis";
import { colorLighter } from "d3plus-color";
import { accessor, assign, BaseClass, constant, elem } from "d3plus-common";
import { formatAbbreviate } from "d3plus-format";
import { Rect } from "d3plus-shape";
import { TextBox, textWidth } from "d3plus-text";
/**
    @class ColorScale
    @extends external:BaseClass
    @desc Creates an SVG scale based on an array of data. If *data* is specified, immediately draws based on the specified array and returns the current class instance. If *data* is not specified on instantiation, it can be passed/updated after instantiation using the [data](#shape.data) method.
*/

var ColorScale =
  /*#__PURE__*/
  function (_BaseClass) {
    _inherits(ColorScale, _BaseClass);

    /**
        @memberof ColorScale
        @desc Invoked when creating a new class instance, and sets any default parameters.
        @private
    */
    function ColorScale() {
      var _this;

      _classCallCheck(this, ColorScale);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorScale).call(this));
      _this._axisClass = new Axis();
      _this._axisConfig = {
        gridSize: 0,
        shapeConfig: {
          labelConfig: {
            fontColor: "#222"
          }
        },
        titleConfig: {
          fontSize: 12
        }
      };
      _this._axisTest = new Axis();
      _this._align = "middle";
      _this._buckets = 5;
      _this._bucketAxis = false;
      _this._centered = false;
      _this._colorMax = "#0C8040";
      _this._colorMid = "#f7f7f7";
      _this._colorMin = "#b22200";
      _this._data = [];
      _this._duration = 600;
      _this._height = 200;
      _this._labelClass = new TextBox();
      _this._legendClass = new Legend();
      _this._legendConfig = {
        shapeConfig: {
          labelConfig: {
            fontColor: "#222"
          },
          stroke: "#444",
          strokeWidth: 1
        }
      };
      _this._midpoint = 0;
      _this._orient = "bottom";
      _this._outerBounds = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      };
      _this._outlierMode = false;
      _this._padding = 5;
      _this._rectClass = new Rect();
      _this._rectConfig = {
        stroke: "#444",
        strokeWidth: 1
      };
      _this._scale = "linear";
      _this._size = 10;
      _this._value = accessor("value");
      _this._width = 400;
      return _this;
    }
    /**
        @memberof ColorScale
        @desc Renders the current ColorScale to the page. If a *callback* is specified, it will be called once the ColorScale is done drawing.
        @param {Function} [*callback* = undefined]
        @chainable
    */


    _createClass(ColorScale, [{
      key: "render",
      value: function render(callback) {
        var _this2 = this;

        if (this._select === void 0) this.select(_select("body").append("svg").attr("width", "".concat(this._width, "px")).attr("height", "".concat(this._height, "px")).node());
        var horizontal = ["bottom", "top"].includes(this._orient);
        var height = horizontal ? "height" : "width",
          width = horizontal ? "width" : "height",
          x = horizontal ? "x" : "y",
          y = horizontal ? "y" : "x"; // Shape <g> Group

        this._group = elem("g.d3plus-ColorScale", {
          parent: this._select
        });

        var allValues = this._data.map(this._value).sort(function (a, b) {
          return a - b;
        });

        var domain = extent(allValues);
        var negative = domain[0] < this._midpoint;
        var positive = domain[1] > this._midpoint;
        var diverging = negative && positive;

        if (diverging && this._outlierMode) {
          var _deviation = deviation(allValues);
  
          if (this._outlierMode === "three-sigma") {
            allValues = allValues.filter(function (d) {
              return (d < 0 && d > -3 * _deviation) || (d >= 0 && d < 3 * _deviation);
            });
          } else if (this._outlierMode === "six-sigma") {
            allValues = allValues.filter(function (d) {
              return (d < 0 && d > -6 * _deviation) || (d >= 0 && d < 6 * _deviation);
            });
          } else {
            allValues = this._outlierMode(allValues);
          }
  
          domain = extent(allValues);
        }

        var centered = diverging && this._centered;
        var colors = this._color,
          labels,
          ticks;

        if (colors && !(colors instanceof Array)) {
          colors = range(0, this._buckets, 1).map(function (i) {
            return colorLighter(colors, (i + 1) / _this2._buckets);
          }).reverse();
        }

        if (this._scale === "jenks") {
          var data = allValues.filter(function (d) {
            return d !== null && typeof d === "number";
          });

          var buckets = min([colors ? colors.length : this._buckets, data.length]);

          var jenks = ckmeans(data, buckets);
          ticks = merge(jenks.map(function (c, i) {
            return i === jenks.length - 1 ? [c[0], c[c.length - 1]] : [c[0]];
          }));

          var tickSet = new Set(ticks);

          if (ticks.length !== tickSet.size) {
            labels = Array.from(tickSet);
          }

          if (!colors) {
            if (diverging) {
              colors = [this._colorMin, this._colorMid, this._colorMax];
              var negatives = ticks.slice(0, buckets).filter(function (d, i) {
                return d < _this2._midpoint && ticks[i + 1] <= _this2._midpoint;
              });
              var spanning = ticks.slice(0, buckets).filter(function (d, i) {
                return d <= _this2._midpoint && ticks[i + 1] > _this2._midpoint;
              });
              var positives = ticks.slice(0, buckets).filter(function (d, i) {
                return d > _this2._midpoint && ticks[i + 1] > _this2._midpoint;
              });
              var negativeColors = negatives.map(function (d, i) {
                return !i ? colors[0] : colorLighter(colors[0], i / negatives.length);
              });
              var spanningColors = spanning.map(function () {
                return colors[1];
              });
              var positiveColors = positives.map(function (d, i) {
                return i === positives.length - 1 ? colors[2] : colorLighter(colors[2], 1 - (i + 1) / positives.length);
              });
              colors = negativeColors.concat(spanningColors).concat(positiveColors);
            } else {
              colors = range(0, this._buckets, 1).map(function (i) {
                return colorLighter(_this2._colorMax, i / _this2._buckets);
              }).reverse();
            }
          }

          if (data.length <= buckets) {
            colors = colors.slice(buckets - data.length);
          }

          this._colorScale = scaleThreshold().domain(ticks).range(["black"].concat(colors).concat(colors[colors.length - 1]));
        } else {
          var _buckets;

          if (diverging && !colors) {
            var half = Math.floor(this._buckets / 2);

            var _negativeColors = range(0, half, 1).map(function (i) {
              return !i ? _this2._colorMin : colorLighter(_this2._colorMin, i / half);
            });

            var _spanningColors = (this._buckets % 2 ? [0] : []).map(function () {
              return _this2._colorMid;
            });

            var _positiveColors = range(0, half, 1).map(function (i) {
              return !i ? _this2._colorMax : colorLighter(_this2._colorMax, i / half);
            }).reverse();

            colors = _negativeColors.concat(_spanningColors).concat(_positiveColors);
            var step = (colors.length - 1) / 2;

            _buckets = range(domain[0], this._midpoint, -(domain[0] - this._midpoint) / step).concat(range(this._midpoint, domain[1], (domain[1] - this._midpoint) / step)).concat([domain[1]]);

          } else {
            if (!colors) {
              if (this._scale === "buckets" || this._scale === "quantile") {
                colors = range(0, this._buckets, 1).map(function (i) {
                  return colorLighter(negative ? _this2._colorMin : _this2._colorMax, i / _this2._buckets);
                });
                if (positive) colors = colors.reverse();
              } else {
                colors = negative ? [this._colorMin, colorLighter(this._colorMin, 0.8)] : [colorLighter(this._colorMax, 0.8), this._colorMax];
              }
            }

            if (this._scale === "quantile") {
              var _step = 1 / (colors.length - 1);

              _buckets = range(0, 1 + _step / 2, _step).map(function (d) {
                return quantile(allValues, d);
              });
            } else {
              var _step2 = (domain[1] - domain[0]) / (colors.length - 1);
              var _buckets = range(domain[0], domain[1] + _step2 / 2, _step2);

              if (centered) {
                const maxAbs = Math.max(Math.abs(domain[0], domain[1]));
                _step2 = (2 * maxAbs) / (colors.length - 1);
                _buckets = range(-maxAbs, maxAbs + _step2 / 2, _step2);
              }
            }
          }

          if (this._scale === "buckets" || this._scale === "quantile") {
            ticks = _buckets.concat([_buckets[_buckets.length - 1]]);
          } else if (this._scale === "log") {

            var negativeBuckets = _buckets.filter(function (d) {
              return d < 0;
            });

            if (negativeBuckets.length) {
              var minVal = negativeBuckets[0];
              var newNegativeBuckets = negativeBuckets.map(function (d) {
                return -Math.pow(Math.abs(minVal), d / minVal);
              });
              negativeBuckets.forEach(function (bucket, i) {
                _buckets[_buckets.indexOf(bucket)] = newNegativeBuckets[i];
              });
            }

            var positiveBuckets = _buckets.filter(function (d) {
              return d > 0;
            });

            if (positiveBuckets.length) {
              var maxVal = positiveBuckets[positiveBuckets.length - 1];
              var newPositiveBuckets = positiveBuckets.map(function (d) {
                return Math.pow(maxVal, d / maxVal);
              });
              positiveBuckets.forEach(function (bucket, i) {
                _buckets[_buckets.indexOf(bucket)] = newPositiveBuckets[i];
              });
            }

            if (_buckets.includes(0)) _buckets[_buckets.indexOf(0)] = 1;
          }

          this._colorScale = scaleLinear().domain(_buckets).range(colors);
        }

        var gradient = this._bucketAxis || !["buckets", "jenks", "quantile"].includes(this._scale);
        var t = transition().duration(this._duration);
        var groupParams = {
          enter: {
            opacity: 0
          },
          exit: {
            opacity: 0
          },
          parent: this._group,
          transition: t,
          update: {
            opacity: 1
          }
        };
        var labelGroup = elem("g.d3plus-ColorScale-labels", Object.assign({
          condition: gradient
        }, groupParams));
        var rectGroup = elem("g.d3plus-ColorScale-Rect", Object.assign({
          condition: gradient
        }, groupParams));
        var legendGroup = elem("g.d3plus-ColorScale-legend", Object.assign({
          condition: !gradient
        }, groupParams));

        if (gradient) {
          var _assign;

          var offsets = {
            x: 0,
            y: 0
          };
          var axisConfig = assign({
            domain: horizontal ? domain : domain.reverse(),
            duration: this._duration,
            height: this._height,
            labels: labels || ticks,
            orient: this._orient,
            padding: this._padding,
            scale: this._scale === "log" ? "log" : "linear",
            ticks: ticks,
            width: this._width
          }, this._axisConfig);
          var labelConfig = assign({
            height: this["_".concat(height)] / 2,
            width: this["_".concat(width)] / 2
          }, this._labelConfig || this._axisConfig.titleConfig);

          this._labelClass.config(labelConfig);

          var labelData = [];

          if (horizontal && this._labelMin) {
            var labelCSS = {
              "font-family": this._labelClass.fontFamily()(this._labelMin),
              "font-size": this._labelClass.fontSize()(this._labelMin),
              "font-weight": this._labelClass.fontWeight()(this._labelMin)
            };
            if (labelCSS["font-family"] instanceof Array) labelCSS["font-family"] = labelCSS["font-family"][0];
            var labelMinWidth = textWidth(this._labelMin, labelCSS);

            if (labelMinWidth && labelMinWidth < this["_".concat(width)] / 2) {
              labelData.push(this._labelMin);
              labelMinWidth += this._padding;
              if (horizontal) offsets.x += labelMinWidth;
              axisConfig[width] -= labelMinWidth;
            }
          }

          if (horizontal && this._labelMax) {
            var _labelCSS = {
              "font-family": this._labelClass.fontFamily()(this._labelMax),
              "font-size": this._labelClass.fontSize()(this._labelMax),
              "font-weight": this._labelClass.fontWeight()(this._labelMax)
            };
            if (_labelCSS["font-family"] instanceof Array) _labelCSS["font-family"] = _labelCSS["font-family"][0];
            var labelMaxWidth = textWidth(this._labelMax, _labelCSS);

            if (labelMaxWidth && labelMaxWidth < this["_".concat(width)] / 2) {
              labelData.push(this._labelMax);
              labelMaxWidth += this._padding;
              if (!horizontal) offsets.y += labelMaxWidth;
              axisConfig[width] -= labelMaxWidth;
            }
          }

          this._axisTest.select(elem("g.d3plus-ColorScale-axisTest", {
            enter: {
              opacity: 0
            },
            parent: this._group
          }).node()).config(axisConfig).duration(0).render();

          var axisBounds = this._axisTest.outerBounds();

          this._outerBounds[width] = this["_".concat(width)] - this._padding * 2;
          this._outerBounds[height] = axisBounds[height] + this._size;
          this._outerBounds[x] = this._padding;
          this._outerBounds[y] = this._padding;
          if (this._align === "middle") this._outerBounds[y] = (this["_".concat(height)] - this._outerBounds[height]) / 2; else if (this._align === "end") this._outerBounds[y] = this["_".concat(height)] - this._padding - this._outerBounds[height];

          var axisGroupOffset = this._outerBounds[y] + (["bottom", "right"].includes(this._orient) ? this._size : 0) - (axisConfig.padding || this._axisClass.padding());

          var transform = "translate(".concat(offsets.x + (horizontal ? 0 : axisGroupOffset), ", ").concat(offsets.y + (horizontal ? axisGroupOffset : 0), ")");

          this._axisClass.select(elem("g.d3plus-ColorScale-axis", assign(groupParams, {
            condition: true,
            enter: {
              transform: transform
            },
            update: {
              transform: transform
            }
          })).node()).config(axisConfig).align("start").render();

          var axisScale = this._axisTest._getPosition.bind(this._axisTest);

          var scaleRange = this._axisTest._getRange();

          var defs = this._group.selectAll("defs").data([0]);

          var defsEnter = defs.enter().append("defs");
          defsEnter.append("linearGradient").attr("id", "gradient-".concat(this._uuid));
          defs = defsEnter.merge(defs);
          defs.select("linearGradient").attr("".concat(x, "1"), horizontal ? "0%" : "100%").attr("".concat(x, "2"), horizontal ? "100%" : "0%").attr("".concat(y, "1"), "0%").attr("".concat(y, "2"), "0%");
          var stops = defs.select("linearGradient").selectAll("stop").data(horizontal ? colors : colors);

          var scaleDomain = this._colorScale.domain();
          
          var offsetScale = scaleLinear().domain(scaleRange).range(horizontal ? [0, 100] : [100, 0]);
          stops.enter().append("stop").merge(stops).attr("offset", function (d, i) {
            return "".concat(offsetScale(axisScale(scaleDomain[i])), "%");
          }).attr("stop-color", String);
          /** determines the width of buckets */

          var bucketWidth = function bucketWidth(d, i) {
            var w = Math.abs(axisScale(ticks[i + 1]) - axisScale(d));
            return w || 2;
          };

          var rectConfig = assign((_assign = {
            duration: this._duration,
            fill: ticks ? function (d) {
              return _this2._colorScale(d);
            } : "url(#gradient-".concat(this._uuid, ")")
          }, _defineProperty(_assign, x, ticks ? function (d, i) {
            return axisScale(d) + bucketWidth(d, i) / 2 - (["left", "right"].includes(_this2._orient) ? bucketWidth(d, i) : 0);
          } : scaleRange[0] + (scaleRange[1] - scaleRange[0]) / 2 + offsets[x]), _defineProperty(_assign, y, this._outerBounds[y] + (["top", "left"].includes(this._orient) ? axisBounds[height] : 0) + this._size / 2 + offsets[y]), _defineProperty(_assign, width, ticks ? bucketWidth : scaleRange[1] - scaleRange[0]), _defineProperty(_assign, height, this._size), _assign), this._rectConfig);

          this._rectClass.data(ticks ? ticks.slice(0, ticks.length - 1) : [0]).id(function (d, i) {
            return i;
          }).select(rectGroup.node()).config(rectConfig).render();

          labelConfig.height = this._outerBounds[height];
          labelConfig.width = this._outerBounds[width];

          this._labelClass.config(labelConfig).data(labelData).select(labelGroup.node()).x(function (d) {
            return d === _this2._labelMax ? rectConfig.x + rectConfig.width / 2 + _this2._padding : _this2._outerBounds.x;
          }).y(function (d) {
            return rectConfig.y - _this2._labelClass.fontSize()(d) / 2;
          }).text(function (d) {
            return d;
          }).rotate(horizontal ? 0 : this._orient === "right" ? 90 : -90).render();
        } else {
          elem("g.d3plus-ColorScale-axis", Object.assign({
            condition: gradient
          }, groupParams));
          var format = this._axisConfig.tickFormat ? this._axisConfig.tickFormat : formatAbbreviate;
          var legendData = ticks.reduce(function (arr, tick, i) {
            if (i !== ticks.length - 1) {
              var next = ticks[i + 1];
              arr.push({
                color: colors[i],
                id: tick === next ? "".concat(format(tick), "+") : "".concat(format(tick), " - ").concat(format(next))
                //id: tick === next && i !== 0 ? "".concat("≥ ", format(tick)) : i === 0 ? "".concat("≤ ", format(tick)) : "".concat(format(tick), " - ").concat(format(next))
              });
            }

            return arr;
          }, []);

          var legendConfig = assign({
            align: horizontal ? "center" : {
              start: "left",
              middle: "center",
              end: "right"
            }[this._align],
            direction: horizontal ? "row" : "column",
            duration: this._duration,
            height: this._height,
            padding: this._padding,
            shapeConfig: assign({
              duration: this._duration
            }, this._axisConfig.shapeConfig || {}),
            title: this._axisConfig.title,
            titleConfig: this._axisConfig.titleConfig || {},
            width: this._width,
            verticalAlign: horizontal ? {
              start: "top",
              middle: "middle",
              end: "bottom"
            }[this._align] : "middle"
          }, this._legendConfig);

          this._legendClass.data(legendData).select(legendGroup.node()).config(legendConfig).render();

          this._outerBounds = this._legendClass.outerBounds();
        }

        if (callback) setTimeout(callback, this._duration + 100);
        return this;
      }
      /**
          @memberof ColorScale
          @desc The [ColorScale](http://d3plus.org/docs/#ColorScale) is constructed by combining an [Axis](http://d3plus.org/docs/#Axis) for the ticks/labels and a [Rect](http://d3plus.org/docs/#Rect) for the actual color box (or multiple boxes, as in a jenks scale). Because of this, there are separate configs for the [Axis](http://d3plus.org/docs/#Axis) class used to display the text ([axisConfig](http://d3plus.org/docs/#ColorScale.axisConfig)) and the [Rect](http://d3plus.org/docs/#Rect) class used to draw the color breaks ([rectConfig](http://d3plus.org/docs/#ColorScale.rectConfig)). This method acts as a pass-through to the config method of the [Axis](http://d3plus.org/docs/#Axis). An example usage of this method can be seen [here](http://d3plus.org/examples/d3plus-legend/colorScale-dark/).
          @param {Object} [*value*]
          @chainable
      */

    }, {
      key: "axisConfig",
      value: function axisConfig(_) {
        return arguments.length ? (this._axisConfig = assign(this._axisConfig, _), this) : this._axisConfig;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the horizontal alignment to the specified value and returns the current class instance. If *value* is not specified, returns the current horizontal alignment.
          @param {String} [*value* = "center"] Supports `"left"` and `"center"` and `"right"`.
          @chainable
      */

    }, {
      key: "align",
      value: function align(_) {
        return arguments.length ? (this._align = _, this) : this._align;
      }
      /**
          @memberof ColorScale
          @desc The number of discrete buckets to create in a bucketed color scale. Will be overridden by any custom Array of colors passed to the `color` method.
          @param {Number} [*value* = 5]
          @chainable
      */

    }, {
      key: "buckets",
      value: function buckets(_) {
        return arguments.length ? (this._buckets = _, this) : this._buckets;
      }
      /**
          @memberof ColorScale
          @desc Determines whether or not to use an Axis to display bucket scales (both "buckets" and "jenks"). When set to `false`, bucketed scales will use the `Legend` class to display squares for each range of data. When set to `true`, bucketed scales will be displayed on an `Axis`, similar to "linear" scales.
          @param {Boolean} [*value* = false]
          @chainable
      */

    }, {
      key: "bucketAxis",
      value: function bucketAxis(_) {
        return arguments.length ? (this._bucketAxis = _, this) : this._bucketAxis;
      }
      /**
          @memberof ColorScale
          @desc Determines whether or not to display a centered Axis in ColorScale.
          @param {Boolean} [*value* = false]
          @chainable
      */
    }, {
      key: "centered",
      value: function centered(_) {
        return arguments.length ? (this._centered = _, this) : this._centered;
      }
      /**
          @memberof ColorScale
          @desc Overrides the default internal logic of `colorMin`, `colorMid`, and `colorMax` to only use just this specified color. If a single color is given as a String, then the scale is interpolated by lightening that color. Otherwise, the function expects an Array of color values to be used in order for the scale.
          @param {String|Array} [*value*]
          @chainable
      */
    },

    {
      key: "color",
      value: function color(_) {
        return arguments.length ? (this._color = _, this) : this._color;
      }
      /**
          @memberof ColorScale
          @desc Defines the color to be used for numbers greater than the value of the `midpoint` on the scale (defaults to `0`). Colors in between this value and the value of `colorMid` will be interpolated, unless a custom Array of colors has been specified using the `color` method.
          @param {String} [*value* = "#0C8040"]
          @chainable
      */

    }, {
      key: "colorMax",
      value: function colorMax(_) {
        return arguments.length ? (this._colorMax = _, this) : this._colorMax;
      }
      /**
          @memberof ColorScale
          @desc Defines the color to be used for the midpoint of a diverging scale, based on the current value of the `midpoint` method (defaults to `0`). Colors in between this value and the values of `colorMin` and `colorMax` will be interpolated, unless a custom Array of colors has been specified using the `color` method.
          @param {String} [*value* = "#f7f7f7"]
          @chainable
      */

    }, {
      key: "colorMid",
      value: function colorMid(_) {
        return arguments.length ? (this._colorMid = _, this) : this._colorMid;
      }
      /**
          @memberof ColorScale
          @desc Defines the color to be used for numbers less than the value of the `midpoint` on the scale (defaults to `0`). Colors in between this value and the value of `colorMid` will be interpolated, unless a custom Array of colors has been specified using the `color` method.
          @param {String} [*value* = "#b22200"]
          @chainable
      */

    }, {
      key: "colorMin",
      value: function colorMin(_) {
        return arguments.length ? (this._colorMin = _, this) : this._colorMin;
      }
      /**
          @memberof ColorScale
          @desc If *data* is specified, sets the data array to the specified array and returns the current class instance. If *data* is not specified, returns the current data array. A shape key will be drawn for each object in the array.
          @param {Array} [*data* = []]
          @chainable
      */

    }, {
      key: "data",
      value: function data(_) {
        return arguments.length ? (this._data = _, this) : this._data;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the transition duration of the ColorScale and returns the current class instance. If *value* is not specified, returns the current duration.
          @param {Number} [*value* = 600]
          @chainable
      */

    }, {
      key: "duration",
      value: function duration(_) {
        return arguments.length ? (this._duration = _, this) : this._duration;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the overall height of the ColorScale and returns the current class instance. If *value* is not specified, returns the current height value.
          @param {Number} [*value* = 100]
          @chainable
      */

    }, {
      key: "height",
      value: function height(_) {
        return arguments.length ? (this._height = _, this) : this._height;
      }
      /**
          @memberof ColorScale
          @desc A pass-through for the [TextBox](http://d3plus.org/docs/#TextBox) class used to style the labelMin and labelMax text.
          @param {Object} [*value*]
          @chainable
      */

    }, {
      key: "labelConfig",
      value: function labelConfig(_) {
        return arguments.length ? (this._labelConfig = _, this) : this._labelConfig;
      }
      /**
          @memberof ColorScale
          @desc Defines a text label to be displayed off of the end of the minimum point in the scale (currently only available in horizontal orientation).
          @param {String} [*value*]
          @chainable
      */

    }, {
      key: "labelMin",
      value: function labelMin(_) {
        return arguments.length ? (this._labelMin = _, this) : this._labelMin;
      }
      /**
          @memberof ColorScale
          @desc Defines a text label to be displayed off of the end of the maximum point in the scale (currently only available in horizontal orientation).
          @param {String} [*value*]
          @chainable
      */

    }, {
      key: "labelMax",
      value: function labelMax(_) {
        return arguments.length ? (this._labelMax = _, this) : this._labelMax;
      }
      /**
          @memberof ColorScale
          @desc The [ColorScale](http://d3plus.org/docs/#ColorScale) is constructed by combining an [Axis](http://d3plus.org/docs/#Axis) for the ticks/labels and a [Rect](http://d3plus.org/docs/#Rect) for the actual color box (or multiple boxes, as in a jenks scale). Because of this, there are separate configs for the [Axis](http://d3plus.org/docs/#Axis) class used to display the text ([axisConfig](http://d3plus.org/docs/#ColorScale.axisConfig)) and the [Rect](http://d3plus.org/docs/#Rect) class used to draw the color breaks ([rectConfig](http://d3plus.org/docs/#ColorScale.rectConfig)). This method acts as a pass-through to the config method of the [Axis](http://d3plus.org/docs/#Axis). An example usage of this method can be seen [here](http://d3plus.org/examples/d3plus-legend/colorScale-dark/).
          @param {Object} [*value*]
          @chainable
      */

    }, {
      key: "legendConfig",
      value: function legendConfig(_) {
        return arguments.length ? (this._legendConfig = assign(this._legendConfig, _), this) : this._legendConfig;
      }
      /**
          @memberof ColorScale
          @desc The number value to be used as the anchor for `colorMid`, and defines the center point of the diverging color scale.
          @param {Number} [*value* = 0]
          @chainable
      */

    }, {
      key: "midpoint",
      value: function midpoint(_) {
        return arguments.length ? (this._midpoint = _, this) : this._midpoint;
      }
      /**
          @memberof ColorScale
          @desc Sets the flow of the items inside the ColorScale. If no value is passed, the current flow will be returned.
          @param {String} [*value* = "bottom"]
          @chainable
      */

    }, {
      key: "orient",
      value: function orient(_) {
        return arguments.length ? (this._orient = _, this) : this._orient;
      }
      /**
          @memberof ColorScale
          @desc If called after the elements have been drawn to DOM, will returns the outer bounds of the ColorScale content.
          @example
      {"width": 180, "height": 24, "x": 10, "y": 20}
      */

    }, {
      key: "outerBounds",
      value: function outerBounds() {
        return this._outerBounds;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the outlier calculation method to the specified function or value and returns current class instance. If *value* is not specified, returns the current padding value.
          @param {Function|String} [*value*]
          @chainable
      */
    }, {
      key: "outlierMode",
      value: function outlierMode(_) {
        return arguments.length ? (this._outlierMode = typeof _ === "function" ? _ : _, this) : this._outlierMode;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the padding between each key to the specified number and returns the current class instance. If *value* is not specified, returns the current padding value.
          @param {Number} [*value* = 10]
          @chainable
      */
    }, {
      key: "padding",
      value: function padding(_) {
        return arguments.length ? (this._padding = _, this) : this._padding;
      }
      /**
          @memberof ColorScale
          @desc The [ColorScale](http://d3plus.org/docs/#ColorScale) is constructed by combining an [Axis](http://d3plus.org/docs/#Axis) for the ticks/labels and a [Rect](http://d3plus.org/docs/#Rect) for the actual color box (or multiple boxes, as in a jenks scale). Because of this, there are separate configs for the [Axis](http://d3plus.org/docs/#Axis) class used to display the text ([axisConfig](http://d3plus.org/docs/#ColorScale.axisConfig)) and the [Rect](http://d3plus.org/docs/#Rect) class used to draw the color breaks ([rectConfig](http://d3plus.org/docs/#ColorScale.rectConfig)). This method acts as a pass-through to the config method of the [Rect](http://d3plus.org/docs/#Rect). An example usage of this method can be seen [here](http://d3plus.org/examples/d3plus-legend/colorScale-dark/).
          @param {Object} [*value*]
          @chainable
      */

    }, {
      key: "rectConfig",
      value: function rectConfig(_) {
        return arguments.length ? (this._rectConfig = assign(this._rectConfig, _), this) : this._rectConfig;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the scale of the ColorScale and returns the current class instance. If *value* is not specified, returns the current scale value.
          @param {String} [*value* = "linear"] Can either be "linear", "jenks", or "buckets".
          @chainable
      */

    }, {
      key: "scale",
      value: function scale(_) {
        return arguments.length ? (this._scale = _, this) : this._scale;
      }
      /**
          @memberof ColorScale
          @desc If *selector* is specified, sets the SVG container element to the specified d3 selector or DOM element and returns the current class instance. If *selector* is not specified, returns the current SVG container element.
          @param {String|HTMLElement} [*selector* = d3.select("body").append("svg")]
          @chainable
      */

    }, {
      key: "select",
      value: function select(_) {
        return arguments.length ? (this._select = _select(_), this) : this._select;
      }
      /**
          @memberof ColorScale
          @desc The height of horizontal color scales, and width when positioned vertical.
          @param {Number} [*value* = 10]
          @chainable
      */

    }, {
      key: "size",
      value: function size(_) {
        return arguments.length ? (this._size = _, this) : this._size;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the value accessor to the specified function or string and returns the current class instance. If *value* is not specified, returns the current value accessor.
          @param {Function|String} [*value*]
          @chainable
          @example
      function value(d) {
      return d.value;
      }
      */

    }, {
      key: "value",
      value: function value(_) {
        return arguments.length ? (this._value = typeof _ === "function" ? _ : constant(_), this) : this._value;
      }
      /**
          @memberof ColorScale
          @desc If *value* is specified, sets the overall width of the ColorScale and returns the current class instance. If *value* is not specified, returns the current width value.
          @param {Number} [*value* = 400]
          @chainable
      */

    }, {
      key: "width",
      value: function width(_) {
        return arguments.length ? (this._width = _, this) : this._width;
      }
    }]);

    return ColorScale;
  }(BaseClass);

export { ColorScale as default };
