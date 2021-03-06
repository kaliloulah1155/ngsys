(function() {
  d3.geo.project = function(object, projection) {
    var stream = projection.stream;
    if (!stream) throw new Error("not yet supported");
    return (object && d3_geo_projectObjectType.hasOwnProperty(object.type) ? d3_geo_projectObjectType[object.type] : d3_geo_projectGeometry)(object, stream);
  };
  function d3_geo_projectFeature(object, stream) {
    return {
      type: "Feature",
      id: object.id,
      properties: object.properties,
      geometry: d3_geo_projectGeometry(object.geometry, stream)
    };
  }
  function d3_geo_projectGeometry(geometry, stream) {
    if (!geometry) return null;
    if (geometry.type === "GeometryCollection") return {
      type: "GeometryCollection",
      geometries: object.geometries.map(function(geometry) {
        return d3_geo_projectGeometry(geometry, stream);
      })
    };
    if (!d3_geo_projectGeometryType.hasOwnProperty(geometry.type)) return null;
    var sink = d3_geo_projectGeometryType[geometry.type];
    d3.geo.stream(geometry, stream(sink));
    return sink.result();
  }
  var d3_geo_projectObjectType = {
    Feature: d3_geo_projectFeature,
    FeatureCollection: function(object, stream) {
      return {
        type: "FeatureCollection",
        features: object.features.map(function(feature) {
          return d3_geo_projectFeature(feature, stream);
        })
      };
    }
  };
  var d3_geo_projectPoints = [], d3_geo_projectLines = [];
  var d3_geo_projectPoint = {
    point: function(x, y) {
      d3_geo_projectPoints.push([ x, y ]);
    },
    result: function() {
      var result = !d3_geo_projectPoints.length ? null : d3_geo_projectPoints.length < 2 ? {
        type: "Point",
        coordinates: d3_geo_projectPoints[0]
      } : {
        type: "MultiPoint",
        coordinates: d3_geo_projectPoints
      };
      d3_geo_projectPoints = [];
      return result;
    }
  };
  var d3_geo_projectLine = {
    lineStart: d3_geo_projectNoop,
    point: function(x, y) {
      d3_geo_projectPoints.push([ x, y ]);
    },
    lineEnd: function() {
      if (d3_geo_projectPoints.length) d3_geo_projectLines.push(d3_geo_projectPoints), 
      d3_geo_projectPoints = [];
    },
    result: function() {
      var result = !d3_geo_projectLines.length ? null : d3_geo_projectLines.length < 2 ? {
        type: "LineString",
        coordinates: d3_geo_projectLines[0]
      } : {
        type: "MultiLineString",
        coordinates: d3_geo_projectLines
      };
      d3_geo_projectLines = [];
      return result;
    }
  };
  var d3_geo_projectPolygon = {
    polygonStart: d3_geo_projectNoop,
    lineStart: d3_geo_projectNoop,
    point: function(x, y) {
      d3_geo_projectPoints.push([ x, y ]);
    },
    lineEnd: function() {
      var n = d3_geo_projectPoints.length;
      if (n) {
        do d3_geo_projectPoints.push(d3_geo_projectPoints[0].slice()); while (++n < 4);
        d3_geo_projectLines.push(d3_geo_projectPoints), d3_geo_projectPoints = [];
      }
    },
    polygonEnd: d3_geo_projectNoop,
    result: function() {
      if (!d3_geo_projectLines.length) return null;
      var polygons = [], holes = [];
      d3_geo_projectLines.forEach(function(ring) {
        if (d3_geo_projectClockwise(ring)) polygons.push([ ring ]); else holes.push(ring);
      });
      holes.forEach(function(hole) {
        var point = hole[0];
        polygons.some(function(polygon) {
          if (d3_geo_projectContains(polygon[0], point)) {
            polygon.push(hole);
            return true;
          }
        }) || polygons.push([ hole ]);
      });
      d3_geo_projectLines = [];
      return !polygons.length ? null : polygons.length > 1 ? {
        type: "MultiPolygon",
        coordinates: polygons
      } : {
        type: "Polygon",
        coordinates: polygons[0]
      };
    }
  };
  var d3_geo_projectGeometryType = {
    Point: d3_geo_projectPoint,
    MultiPoint: d3_geo_projectPoint,
    LineString: d3_geo_projectLine,
    MultiLineString: d3_geo_projectLine,
    Polygon: d3_geo_projectPolygon,
    MultiPolygon: d3_geo_projectPolygon,
    Sphere: d3_geo_projectPolygon
  };
  function d3_geo_projectNoop() {}
  function d3_geo_projectClockwise(ring) {
    if ((n = ring.length) < 4) return false;
    var i = 0, n, area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];
    while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];
    return area <= 0;
  }
  function d3_geo_projectContains(ring, point) {
    var x = point[0], y = point[1], contains = false;
    for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
      var pi = ring[i], xi = pi[0], yi = pi[1], pj = ring[j], xj = pj[0], yj = pj[1];
      if (yi > y ^ yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) contains = !contains;
    }
    return contains;
  }
  var ?? = 1e-6, ??2 = ?? * ??, ?? = Math.PI, half?? = ?? / 2, sqrt?? = Math.sqrt(??), radians = ?? / 180, degrees = 180 / ??;
  function sinci(x) {
    return x ? x / Math.sin(x) : 1;
  }
  function sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function asin(x) {
    return x > 1 ? half?? : x < -1 ? -half?? : Math.asin(x);
  }
  function acos(x) {
    return x > 1 ? 0 : x < -1 ? ?? : Math.acos(x);
  }
  function asqrt(x) {
    return x > 0 ? Math.sqrt(x) : 0;
  }
  var projection = d3.geo.projection, projectionMutator = d3.geo.projectionMutator;
  d3.geo.interrupt = function(project) {
    var lobes = [ [ [ [ -??, 0 ], [ 0, half?? ], [ ??, 0 ] ] ], [ [ [ -??, 0 ], [ 0, -half?? ], [ ??, 0 ] ] ] ];
    var bounds;
    function forward(??, ??) {
      var sign = ?? < 0 ? -1 : +1, hemilobes = lobes[+(?? < 0)];
      for (var i = 0, n = hemilobes.length - 1; i < n && ?? > hemilobes[i][2][0]; ++i) ;
      var coordinates = project(?? - hemilobes[i][1][0], ??);
      coordinates[0] += project(hemilobes[i][1][0], sign * ?? > sign * hemilobes[i][0][1] ? hemilobes[i][0][1] : ??)[0];
      return coordinates;
    }
    function reset() {
      bounds = lobes.map(function(hemilobes) {
        return hemilobes.map(function(lobe) {
          var x0 = project(lobe[0][0], lobe[0][1])[0], x1 = project(lobe[2][0], lobe[2][1])[0], y0 = project(lobe[1][0], lobe[0][1])[1], y1 = project(lobe[1][0], lobe[1][1])[1], t;
          if (y0 > y1) t = y0, y0 = y1, y1 = t;
          return [ [ x0, y0 ], [ x1, y1 ] ];
        });
      });
    }
    if (project.invert) forward.invert = function(x, y) {
      var hemibounds = bounds[+(y < 0)], hemilobes = lobes[+(y < 0)];
      for (var i = 0, n = hemibounds.length; i < n; ++i) {
        var b = hemibounds[i];
        if (b[0][0] <= x && x < b[1][0] && b[0][1] <= y && y < b[1][1]) {
          var coordinates = project.invert(x - project(hemilobes[i][1][0], 0)[0], y);
          coordinates[0] += hemilobes[i][1][0];
          return pointEqual(forward(coordinates[0], coordinates[1]), [ x, y ]) ? coordinates : null;
        }
      }
    };
    var projection = d3.geo.projection(forward), stream_ = projection.stream;
    projection.stream = function(stream) {
      var rotate = projection.rotate(), rotateStream = stream_(stream), sphereStream = (projection.rotate([ 0, 0 ]), 
      stream_(stream));
      projection.rotate(rotate);
      rotateStream.sphere = function() {
        d3.geo.stream(sphere(), sphereStream);
      };
      return rotateStream;
    };
    projection.lobes = function(_) {
      if (!arguments.length) return lobes.map(function(lobes) {
        return lobes.map(function(lobe) {
          return [ [ lobe[0][0] * 180 / ??, lobe[0][1] * 180 / ?? ], [ lobe[1][0] * 180 / ??, lobe[1][1] * 180 / ?? ], [ lobe[2][0] * 180 / ??, lobe[2][1] * 180 / ?? ] ];
        });
      });
      lobes = _.map(function(lobes) {
        return lobes.map(function(lobe) {
          return [ [ lobe[0][0] * ?? / 180, lobe[0][1] * ?? / 180 ], [ lobe[1][0] * ?? / 180, lobe[1][1] * ?? / 180 ], [ lobe[2][0] * ?? / 180, lobe[2][1] * ?? / 180 ] ];
        });
      });
      reset();
      return projection;
    };
    function sphere() {
      var ?? = 1e-6, coordinates = [];
      for (var i = 0, n = lobes[0].length; i < n; ++i) {
        var lobe = lobes[0][i], ??0 = lobe[0][0] * 180 / ??, ??0 = lobe[0][1] * 180 / ??, ??1 = lobe[1][1] * 180 / ??, ??2 = lobe[2][0] * 180 / ??, ??2 = lobe[2][1] * 180 / ??;
        coordinates.push(resample([ [ ??0 + ??, ??0 + ?? ], [ ??0 + ??, ??1 - ?? ], [ ??2 - ??, ??1 - ?? ], [ ??2 - ??, ??2 + ?? ] ], 30));
      }
      for (var i = lobes[1].length - 1; i >= 0; --i) {
        var lobe = lobes[1][i], ??0 = lobe[0][0] * 180 / ??, ??0 = lobe[0][1] * 180 / ??, ??1 = lobe[1][1] * 180 / ??, ??2 = lobe[2][0] * 180 / ??, ??2 = lobe[2][1] * 180 / ??;
        coordinates.push(resample([ [ ??2 - ??, ??2 - ?? ], [ ??2 - ??, ??1 + ?? ], [ ??0 + ??, ??1 + ?? ], [ ??0 + ??, ??0 - ?? ] ], 30));
      }
      return {
        type: "Polygon",
        coordinates: [ d3.merge(coordinates) ]
      };
    }
    function resample(coordinates, m) {
      var i = -1, n = coordinates.length, p0 = coordinates[0], p1, dx, dy, resampled = [];
      while (++i < n) {
        p1 = coordinates[i];
        dx = (p1[0] - p0[0]) / m;
        dy = (p1[1] - p0[1]) / m;
        for (var j = 0; j < m; ++j) resampled.push([ p0[0] + j * dx, p0[1] + j * dy ]);
        p0 = p1;
      }
      resampled.push(p1);
      return resampled;
    }
    function pointEqual(a, b) {
      return Math.abs(a[0] - b[0]) < ?? && Math.abs(a[1] - b[1]) < ??;
    }
    return projection;
  };
  function airy(??) {
    var tan??_2 = Math.tan(.5 * ??), B = 2 * Math.log(Math.cos(.5 * ??)) / (tan??_2 * tan??_2);
    function forward(??, ??) {
      var cos?? = Math.cos(??), cos?? = Math.cos(??), sin?? = Math.sin(??), cosz = cos?? * cos??, K = -((1 - cosz ? Math.log(.5 * (1 + cosz)) / (1 - cosz) : -.5) + B / (1 + cosz));
      return [ K * cos?? * Math.sin(??), K * sin?? ];
    }
    forward.invert = function(x, y) {
      var ?? = Math.sqrt(x * x + y * y), z = ?? * -.5, i = 50, ??;
      if (!??) return [ 0, 0 ];
      do {
        var z_2 = .5 * z, cosz_2 = Math.cos(z_2), sinz_2 = Math.sin(z_2), tanz_2 = Math.tan(z_2), lnsecz_2 = Math.log(1 / cosz_2);
        z -= ?? = (2 / tanz_2 * lnsecz_2 - B * tanz_2 - ??) / (-lnsecz_2 / (sinz_2 * sinz_2) + 1 - B / (2 * cosz_2 * cosz_2));
      } while (Math.abs(??) > ?? && --i > 0);
      var sinz = Math.sin(z);
      return [ Math.atan2(x * sinz, ?? * Math.cos(z)), asin(y * sinz / ??) ];
    };
    return forward;
  }
  function airyProjection() {
    var ?? = half??, m = projectionMutator(airy), p = m(??);
    p.radius = function(_) {
      if (!arguments.length) return ?? / ?? * 180;
      return m(?? = _ * ?? / 180);
    };
    return p;
  }
  (d3.geo.airy = airyProjection).raw = airy;
  function aitoff(??, ??) {
    var cos?? = Math.cos(??), sinci?? = sinci(acos(cos?? * Math.cos(?? /= 2)));
    return [ 2 * cos?? * Math.sin(??) * sinci??, Math.sin(??) * sinci?? ];
  }
  aitoff.invert = function(x, y) {
    if (x * x + 4 * y * y > ?? * ?? + ??) return;
    var ?? = x, ?? = y, i = 25;
    do {
      var sin?? = Math.sin(??), sin??_2 = Math.sin(?? / 2), cos??_2 = Math.cos(?? / 2), sin?? = Math.sin(??), cos?? = Math.cos(??), sin_2?? = Math.sin(2 * ??), sin2?? = sin?? * sin??, cos2?? = cos?? * cos??, sin2??_2 = sin??_2 * sin??_2, C = 1 - cos2?? * cos??_2 * cos??_2, E = C ? acos(cos?? * cos??_2) * Math.sqrt(F = 1 / C) : F = 0, F, fx = 2 * E * cos?? * sin??_2 - x, fy = E * sin?? - y, ??x???? = F * (cos2?? * sin2??_2 + E * cos?? * cos??_2 * sin2??), ??x???? = F * (.5 * sin?? * sin_2?? - E * 2 * sin?? * sin??_2), ??y???? = F * .25 * (sin_2?? * sin??_2 - E * sin?? * cos2?? * sin??), ??y???? = F * (sin2?? * cos??_2 + E * sin2??_2 * cos??), denominator = ??x???? * ??y???? - ??y???? * ??x????;
      if (!denominator) break;
      var ???? = (fy * ??x???? - fx * ??y????) / denominator, ???? = (fx * ??y???? - fy * ??x????) / denominator;
      ?? -= ????, ?? -= ????;
    } while ((Math.abs(????) > ?? || Math.abs(????) > ??) && --i > 0);
    return [ ??, ?? ];
  };
  (d3.geo.aitoff = function() {
    return projection(aitoff);
  }).raw = aitoff;
  function armadillo(??0) {
    var sin??0 = Math.sin(??0), cos??0 = Math.cos(??0), s??0 = ??0 > 0 ? 1 : -1, tan??0 = Math.tan(s??0 * ??0), k = (1 + sin??0 - cos??0) / 2;
    function forward(??, ??) {
      var cos?? = Math.cos(??), cos?? = Math.cos(?? /= 2);
      return [ (1 + cos??) * Math.sin(??), (s??0 * ?? > -Math.atan2(cos??, tan??0) - .001 ? 0 : -s??0 * 10) + k + Math.sin(??) * cos??0 - (1 + cos??) * sin??0 * cos?? ];
    }
    forward.invert = function(x, y) {
      var ?? = 0, ?? = 0, i = 50;
      do {
        var cos?? = Math.cos(??), sin?? = Math.sin(??), cos?? = Math.cos(??), sin?? = Math.sin(??), A = 1 + cos??, fx = A * sin?? - x, fy = k + sin?? * cos??0 - A * sin??0 * cos?? - y, ??x???? = .5 * A * cos??, ??x???? = -sin?? * sin??, ??y???? = .5 * sin??0 * A * sin??, ??y???? = cos??0 * cos?? + sin??0 * cos?? * sin??, denominator = ??x???? * ??y???? - ??y???? * ??x????, ???? = .5 * (fy * ??x???? - fx * ??y????) / denominator, ???? = (fx * ??y???? - fy * ??x????) / denominator;
        ?? -= ????, ?? -= ????;
      } while ((Math.abs(????) > ?? || Math.abs(????) > ??) && --i > 0);
      return s??0 * ?? > -Math.atan2(Math.cos(??), tan??0) - .001 ? [ ?? * 2, ?? ] : null;
    };
    return forward;
  }
  function armadilloProjection() {
    var ??0 = ?? / 9, s??0 = ??0 > 0 ? 1 : -1, tan??0 = Math.tan(s??0 * ??0), m = projectionMutator(armadillo), p = m(??0), stream_ = p.stream;
    p.parallel = function(_) {
      if (!arguments.length) return ??0 / ?? * 180;
      tan??0 = Math.tan((s??0 = (??0 = _ * ?? / 180) > 0 ? 1 : -1) * ??0);
      return m(??0);
    };
    p.stream = function(stream) {
      var rotate = p.rotate(), rotateStream = stream_(stream), sphereStream = (p.rotate([ 0, 0 ]), 
      stream_(stream));
      p.rotate(rotate);
      rotateStream.sphere = function() {
        sphereStream.polygonStart(), sphereStream.lineStart();
        for (var ?? = s??0 * -180; s??0 * ?? < 180; ?? += s??0 * 90) sphereStream.point(??, s??0 * 90);
        while (s??0 * (?? -= ??0) >= -180) {
          sphereStream.point(??, s??0 * -Math.atan2(Math.cos(?? * radians / 2), tan??0) * degrees);
        }
        sphereStream.lineEnd(), sphereStream.polygonEnd();
      };
      return rotateStream;
    };
    return p;
  }
  (d3.geo.armadillo = armadilloProjection).raw = armadillo;
  function tanh(x) {
    x = Math.exp(2 * x);
    return (x - 1) / (x + 1);
  }
  function sinh(x) {
    return .5 * (Math.exp(x) - Math.exp(-x));
  }
  function cosh(x) {
    return .5 * (Math.exp(x) + Math.exp(-x));
  }
  function arsinh(x) {
    return Math.log(x + asqrt(x * x + 1));
  }
  function arcosh(x) {
    return Math.log(x + asqrt(x * x - 1));
  }
  function august(??, ??) {
    var tan?? = Math.tan(?? / 2), k = asqrt(1 - tan?? * tan??), c = 1 + k * Math.cos(?? /= 2), x = Math.sin(??) * k / c, y = tan?? / c, x2 = x * x, y2 = y * y;
    return [ 4 / 3 * x * (3 + x2 - 3 * y2), 4 / 3 * y * (3 + 3 * x2 - y2) ];
  }
  august.invert = function(x, y) {
    x *= 3 / 8, y *= 3 / 8;
    if (!x && Math.abs(y) > 1) return null;
    var x2 = x * x, y2 = y * y, s = 1 + x2 + y2, sin3?? = Math.sqrt(.5 * (s - Math.sqrt(s * s - 4 * y * y))), ?? = asin(sin3??) / 3, ?? = sin3?? ? arcosh(Math.abs(y / sin3??)) / 3 : arsinh(Math.abs(x)) / 3, cos?? = Math.cos(??), cosh?? = cosh(??), d = cosh?? * cosh?? - cos?? * cos??;
    return [ sgn(x) * 2 * Math.atan2(sinh(??) * cos??, .25 - d), sgn(y) * 2 * Math.atan2(cosh?? * Math.sin(??), .25 + d) ];
  };
  (d3.geo.august = function() {
    return projection(august);
  }).raw = august;
  var baker?? = Math.log(1 + Math.SQRT2);
  function baker(??, ??) {
    var ??0 = Math.abs(??);
    return ??0 < ?? / 4 ? [ ??, Math.log(Math.tan(?? / 4 + ?? / 2)) ] : [ ?? * Math.cos(??0) * (2 * Math.SQRT2 - 1 / Math.sin(??0)), sgn(??) * (2 * Math.SQRT2 * (??0 - ?? / 4) - Math.log(Math.tan(??0 / 2))) ];
  }
  baker.invert = function(x, y) {
    if ((y0 = Math.abs(y)) < baker??) return [ x, 2 * Math.atan(Math.exp(y)) - half?? ];
    var sqrt8 = Math.sqrt(8), ?? = ?? / 4, i = 25, ??, y0;
    do {
      var cos??_2 = Math.cos(?? / 2), tan??_2 = Math.tan(?? / 2);
      ?? -= ?? = (sqrt8 * (?? - ?? / 4) - Math.log(tan??_2) - y0) / (sqrt8 - .5 * cos??_2 * cos??_2 / tan??_2);
    } while (Math.abs(??) > ??2 && --i > 0);
    return [ x / (Math.cos(??) * (sqrt8 - 1 / Math.sin(??))), sgn(y) * ?? ];
  };
  (d3.geo.baker = function() {
    return projection(baker);
  }).raw = baker;
  var berghausAzimuthalEquidistant = d3.geo.azimuthalEquidistant.raw;
  function berghaus(n) {
    var k = 2 * ?? / n;
    function forward(??, ??) {
      var p = berghausAzimuthalEquidistant(??, ??);
      if (Math.abs(??) > half??) {
        var ?? = Math.atan2(p[1], p[0]), r = Math.sqrt(p[0] * p[0] + p[1] * p[1]), ??0 = k * Math.round((?? - half??) / k) + half??, ?? = Math.atan2(Math.sin(?? -= ??0), 2 - Math.cos(??));
        ?? = ??0 + asin(?? / r * Math.sin(??)) - ??;
        p[0] = r * Math.cos(??);
        p[1] = r * Math.sin(??);
      }
      return p;
    }
    forward.invert = function(x, y) {
      var r = Math.sqrt(x * x + y * y);
      if (r > half??) {
        var ?? = Math.atan2(y, x), ??0 = k * Math.round((?? - half??) / k) + half??, s = ?? > ??0 ? -1 : 1, A = r * Math.cos(??0 - ??), cot?? = 1 / Math.tan(s * Math.acos((A - ??) / Math.sqrt(?? * (?? - 2 * A) + r * r)));
        ?? = ??0 + 2 * Math.atan((cot?? + s * Math.sqrt(cot?? * cot?? - 3)) / 3);
        x = r * Math.cos(??), y = r * Math.sin(??);
      }
      return berghausAzimuthalEquidistant.invert(x, y);
    };
    return forward;
  }
  function berghausProjection() {
    var n = 5, m = projectionMutator(berghaus), p = m(n), stream_ = p.stream, ?? = .01, cr = -Math.cos(?? * radians), sr = Math.sin(?? * radians);
    p.lobes = function(_) {
      if (!arguments.length) return n;
      return m(n = +_);
    };
    p.stream = function(stream) {
      var rotate = p.rotate(), rotateStream = stream_(stream), sphereStream = (p.rotate([ 0, 0 ]), 
      stream_(stream));
      p.rotate(rotate);
      rotateStream.sphere = function() {
        sphereStream.polygonStart(), sphereStream.lineStart();
        for (var i = 0, ?? = 360 / n, ??0 = 2 * ?? / n, ?? = 90 - 180 / n, ??0 = half??; i < n; ++i, 
        ?? -= ??, ??0 -= ??0) {
          sphereStream.point(Math.atan2(sr * Math.cos(??0), cr) * degrees, asin(sr * Math.sin(??0)) * degrees);
          if (?? < -90) {
            sphereStream.point(-90, -180 - ?? - ??);
            sphereStream.point(-90, -180 - ?? + ??);
          } else {
            sphereStream.point(90, ?? + ??);
            sphereStream.point(90, ?? - ??);
          }
        }
        sphereStream.lineEnd(), sphereStream.polygonEnd();
      };
      return rotateStream;
    };
    return p;
  }
  (d3.geo.berghaus = berghausProjection).raw = berghaus;
  function mollweideBromley??(Cp) {
    return function(??) {
      var Cpsin?? = Cp * Math.sin(??), i = 30, ??;
      do ?? -= ?? = (?? + Math.sin(??) - Cpsin??) / (1 + Math.cos(??)); while (Math.abs(??) > ?? && --i > 0);
      return ?? / 2;
    };
  }
  function mollweideBromley(Cx, Cy, Cp) {
    var ?? = mollweideBromley??(Cp);
    function forward(??, ??) {
      return [ Cx * ?? * Math.cos(?? = ??(??)), Cy * Math.sin(??) ];
    }
    forward.invert = function(x, y) {
      var ?? = asin(y / Cy);
      return [ x / (Cx * Math.cos(??)), asin((2 * ?? + Math.sin(2 * ??)) / Cp) ];
    };
    return forward;
  }
  var mollweide?? = mollweideBromley??(??), mollweide = mollweideBromley(Math.SQRT2 / half??, Math.SQRT2, ??);
  (d3.geo.mollweide = function() {
    return projection(mollweide);
  }).raw = mollweide;
  function boggs(??, ??) {
    var k = 2.00276, ?? = mollweide??(??);
    return [ k * ?? / (1 / Math.cos(??) + 1.11072 / Math.cos(??)), (?? + Math.SQRT2 * Math.sin(??)) / k ];
  }
  boggs.invert = function(x, y) {
    var k = 2.00276, ky = k * y, ?? = y < 0 ? -?? / 4 : ?? / 4, i = 25, ??, ??;
    do {
      ?? = ky - Math.SQRT2 * Math.sin(??);
      ?? -= ?? = (Math.sin(2 * ??) + 2 * ?? - ?? * Math.sin(??)) / (2 * Math.cos(2 * ??) + 2 + ?? * Math.cos(??) * Math.SQRT2 * Math.cos(??));
    } while (Math.abs(??) > ?? && --i > 0);
    ?? = ky - Math.SQRT2 * Math.sin(??);
    return [ x * (1 / Math.cos(??) + 1.11072 / Math.cos(??)) / k, ?? ];
  };
  (d3.geo.boggs = function() {
    return projection(boggs);
  }).raw = boggs;
  function parallel1Projection(projectAt) {
    var ??0 = 0, m = projectionMutator(projectAt), p = m(??0);
    p.parallel = function(_) {
      if (!arguments.length) return ??0 / ?? * 180;
      return m(??0 = _ * ?? / 180);
    };
    return p;
  }
  function sinusoidal(??, ??) {
    return [ ?? * Math.cos(??), ?? ];
  }
  sinusoidal.invert = function(x, y) {
    return [ x / Math.cos(y), y ];
  };
  (d3.geo.sinusoidal = function() {
    return projection(sinusoidal);
  }).raw = sinusoidal;
  function bonne(??0) {
    if (!??0) return sinusoidal;
    var cot??0 = 1 / Math.tan(??0);
    function forward(??, ??) {
      var ?? = cot??0 + ??0 - ??, E = ?? ? ?? * Math.cos(??) / ?? : ??;
      return [ ?? * Math.sin(E), cot??0 - ?? * Math.cos(E) ];
    }
    forward.invert = function(x, y) {
      var ?? = Math.sqrt(x * x + (y = cot??0 - y) * y), ?? = cot??0 + ??0 - ??;
      return [ ?? / Math.cos(??) * Math.atan2(x, y), ?? ];
    };
    return forward;
  }
  (d3.geo.bonne = function() {
    return parallel1Projection(bonne).parallel(45);
  }).raw = bonne;
  function bottomleyRaw(??) {
    var sin?? = Math.sin(??);
    function forward(??, ??) {
      var ?? = half?? - ??, ?? = ?? ? ?? * sin?? * Math.sin(??) / ?? : ??;
      return [ ?? * Math.sin(??) / sin??, half?? - ?? * Math.cos(??) ];
    }
    forward.invert = function(x, y) {
      var x1 = x * sin??, y1 = half?? - y, ?? = Math.sqrt(x1 * x1 + y1 * y1), ?? = Math.atan2(x1, y1);
      return [ (?? ? ?? / Math.sin(??) : 1) * ?? / sin??, half?? - ?? ];
    };
    return forward;
  }
  (d3.geo.bottomley = function() {
    var ?? = ?? / 6, mutate = d3.geo.projectionMutator(bottomleyRaw), projection = mutate(??);
    projection.variant = function(_) {
      return arguments.length ? mutate(?? = +_) : ??;
    };
    return projection;
  }).raw = bottomleyRaw;
  var bromley = mollweideBromley(1, 4 / ??, ??);
  (d3.geo.bromley = function() {
    return projection(bromley);
  }).raw = bromley;
  function chamberlin(points) {
    points = points.map(function(p) {
      return [ p[0], p[1], Math.sin(p[1]), Math.cos(p[1]) ];
    });
    for (var a = points[2], b, i = 0; i < 3; ++i, a = b) {
      b = points[i];
      a.v = chamberlinDistanceAzimuth(b[1] - a[1], a[3], a[2], b[3], b[2], b[0] - a[0]);
      a.point = [ 0, 0 ];
    }
    var ??0 = chamberlinAngle(points[0].v[0], points[2].v[0], points[1].v[0]), ??1 = chamberlinAngle(points[0].v[0], points[1].v[0], points[2].v[0]), ??2 = ?? - ??0;
    points[2].point[1] = 0;
    points[0].point[0] = -(points[1].point[0] = .5 * points[0].v[0]);
    var mean = [ points[2].point[0] = points[0].point[0] + points[2].v[0] * Math.cos(??0), 2 * (points[0].point[1] = points[1].point[1] = points[2].v[0] * Math.sin(??0)) ];
    function forward(??, ??) {
      var sin?? = Math.sin(??), cos?? = Math.cos(??), v = new Array(3);
      for (var i = 0; i < 3; ++i) {
        var p = points[i];
        v[i] = chamberlinDistanceAzimuth(?? - p[1], p[3], p[2], cos??, sin??, ?? - p[0]);
        if (!v[i][0]) return p.point;
        v[i][1] = chamberlinLongitude(v[i][1] - p.v[1]);
      }
      var point = mean.slice();
      for (var i = 0; i < 3; ++i) {
        var j = i == 2 ? 0 : i + 1;
        var a = chamberlinAngle(points[i].v[0], v[i][0], v[j][0]);
        if (v[i][1] < 0) a = -a;
        if (!i) {
          point[0] += v[i][0] * Math.cos(a);
          point[1] -= v[i][0] * Math.sin(a);
        } else if (i == 1) {
          a = ??1 - a;
          point[0] -= v[i][0] * Math.cos(a);
          point[1] -= v[i][0] * Math.sin(a);
        } else {
          a = ??2 - a;
          point[0] += v[i][0] * Math.cos(a);
          point[1] += v[i][0] * Math.sin(a);
        }
      }
      point[0] /= 3, point[1] /= 3;
      return point;
    }
    return forward;
  }
  function chamberlinProjection() {
    var points = [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ], m = projectionMutator(chamberlin), p = m(points), rotate = p.rotate;
    delete p.rotate;
    p.points = function(_) {
      if (!arguments.length) return points;
      points = _;
      var origin = d3.geo.centroid({
        type: "MultiPoint",
        coordinates: points
      }), r = [ -origin[0], -origin[1] ];
      rotate.call(p, r);
      return m(points.map(d3.geo.rotation(r)).map(chamberlinRadians));
    };
    return p.points([ [ -150, 55 ], [ -35, 55 ], [ -92.5, 10 ] ]);
  }
  function chamberlinDistanceAzimuth(d??, c1, s1, c2, s2, d??) {
    var cosd?? = Math.cos(d??), r;
    if (Math.abs(d??) > 1 || Math.abs(d??) > 1) {
      r = acos(s1 * s2 + c1 * c2 * cosd??);
    } else {
      var sind?? = Math.sin(.5 * d??), sind?? = Math.sin(.5 * d??);
      r = 2 * asin(Math.sqrt(sind?? * sind?? + c1 * c2 * sind?? * sind??));
    }
    if (Math.abs(r) > ??) {
      return [ r, Math.atan2(c2 * Math.sin(d??), c1 * s2 - s1 * c2 * cosd??) ];
    }
    return [ 0, 0 ];
  }
  function chamberlinAngle(b, c, a) {
    return acos(.5 * (b * b + c * c - a * a) / (b * c));
  }
  function chamberlinLongitude(??) {
    return ?? - 2 * ?? * Math.floor((?? + ??) / (2 * ??));
  }
  function chamberlinRadians(point) {
    return [ point[0] * radians, point[1] * radians ];
  }
  (d3.geo.chamberlin = chamberlinProjection).raw = chamberlin;
  function collignon(??, ??) {
    var ?? = asqrt(1 - Math.sin(??));
    return [ 2 / sqrt?? * ?? * ??, sqrt?? * (1 - ??) ];
  }
  collignon.invert = function(x, y) {
    var ?? = (?? = y / sqrt?? - 1) * ??;
    return [ ?? > 0 ? x * Math.sqrt(?? / ??) / 2 : 0, asin(1 - ??) ];
  };
  (d3.geo.collignon = function() {
    return projection(collignon);
  }).raw = collignon;
  function craig(??0) {
    var tan??0 = Math.tan(??0);
    function forward(??, ??) {
      return [ ??, (?? ? ?? / Math.sin(??) : 1) * (Math.sin(??) * Math.cos(??) - tan??0 * Math.cos(??)) ];
    }
    forward.invert = tan??0 ? function(x, y) {
      if (x) y *= Math.sin(x) / x;
      var cos?? = Math.cos(x);
      return [ x, 2 * Math.atan2(Math.sqrt(cos?? * cos?? + tan??0 * tan??0 - y * y) - cos??, tan??0 - y) ];
    } : function(x, y) {
      return [ x, asin(x ? y * Math.tan(x) / x : y) ];
    };
    return forward;
  }
  (d3.geo.craig = function() {
    return parallel1Projection(craig);
  }).raw = craig;
  function craster(??, ??) {
    var sqrt3 = Math.sqrt(3);
    return [ sqrt3 * ?? * (2 * Math.cos(2 * ?? / 3) - 1) / sqrt??, sqrt3 * sqrt?? * Math.sin(?? / 3) ];
  }
  craster.invert = function(x, y) {
    var sqrt3 = Math.sqrt(3), ?? = 3 * asin(y / (sqrt3 * sqrt??));
    return [ sqrt?? * x / (sqrt3 * (2 * Math.cos(2 * ?? / 3) - 1)), ?? ];
  };
  (d3.geo.craster = function() {
    return projection(craster);
  }).raw = craster;
  function cylindricalEqualArea(??0) {
    var cos??0 = Math.cos(??0);
    function forward(??, ??) {
      return [ ?? * cos??0, Math.sin(??) / cos??0 ];
    }
    forward.invert = function(x, y) {
      return [ x / cos??0, asin(y * cos??0) ];
    };
    return forward;
  }
  (d3.geo.cylindricalEqualArea = function() {
    return parallel1Projection(cylindricalEqualArea);
  }).raw = cylindricalEqualArea;
  function cylindricalStereographic(??0) {
    var cos??0 = Math.cos(??0);
    function forward(??, ??) {
      return [ ?? * cos??0, (1 + cos??0) * Math.tan(?? * .5) ];
    }
    forward.invert = function(x, y) {
      return [ x / cos??0, Math.atan(y / (1 + cos??0)) * 2 ];
    };
    return forward;
  }
  (d3.geo.cylindricalStereographic = function() {
    return parallel1Projection(cylindricalStereographic);
  }).raw = cylindricalStereographic;
  function eckert1(??, ??) {
    var ?? = Math.sqrt(8 / (3 * ??));
    return [ ?? * ?? * (1 - Math.abs(??) / ??), ?? * ?? ];
  }
  eckert1.invert = function(x, y) {
    var ?? = Math.sqrt(8 / (3 * ??)), ?? = y / ??;
    return [ x / (?? * (1 - Math.abs(??) / ??)), ?? ];
  };
  (d3.geo.eckert1 = function() {
    return projection(eckert1);
  }).raw = eckert1;
  function eckert2(??, ??) {
    var ?? = Math.sqrt(4 - 3 * Math.sin(Math.abs(??)));
    return [ 2 / Math.sqrt(6 * ??) * ?? * ??, sgn(??) * Math.sqrt(2 * ?? / 3) * (2 - ??) ];
  }
  eckert2.invert = function(x, y) {
    var ?? = 2 - Math.abs(y) / Math.sqrt(2 * ?? / 3);
    return [ x * Math.sqrt(6 * ??) / (2 * ??), sgn(y) * asin((4 - ?? * ??) / 3) ];
  };
  (d3.geo.eckert2 = function() {
    return projection(eckert2);
  }).raw = eckert2;
  function eckert3(??, ??) {
    var k = Math.sqrt(?? * (4 + ??));
    return [ 2 / k * ?? * (1 + Math.sqrt(1 - 4 * ?? * ?? / (?? * ??))), 4 / k * ?? ];
  }
  eckert3.invert = function(x, y) {
    var k = Math.sqrt(?? * (4 + ??)) / 2;
    return [ x * k / (1 + asqrt(1 - y * y * (4 + ??) / (4 * ??))), y * k / 2 ];
  };
  (d3.geo.eckert3 = function() {
    return projection(eckert3);
  }).raw = eckert3;
  function eckert4(??, ??) {
    var k = (2 + half??) * Math.sin(??);
    ?? /= 2;
    for (var i = 0, ?? = Infinity; i < 10 && Math.abs(??) > ??; i++) {
      var cos?? = Math.cos(??);
      ?? -= ?? = (?? + Math.sin(??) * (cos?? + 2) - k) / (2 * cos?? * (1 + cos??));
    }
    return [ 2 / Math.sqrt(?? * (4 + ??)) * ?? * (1 + Math.cos(??)), 2 * Math.sqrt(?? / (4 + ??)) * Math.sin(??) ];
  }
  eckert4.invert = function(x, y) {
    var A = .5 * y * Math.sqrt((4 + ??) / ??), k = asin(A), c = Math.cos(k);
    return [ x / (2 / Math.sqrt(?? * (4 + ??)) * (1 + c)), asin((k + A * (c + 2)) / (2 + half??)) ];
  };
  (d3.geo.eckert4 = function() {
    return projection(eckert4);
  }).raw = eckert4;
  function eckert5(??, ??) {
    return [ ?? * (1 + Math.cos(??)) / Math.sqrt(2 + ??), 2 * ?? / Math.sqrt(2 + ??) ];
  }
  eckert5.invert = function(x, y) {
    var k = Math.sqrt(2 + ??), ?? = y * k / 2;
    return [ k * x / (1 + Math.cos(??)), ?? ];
  };
  (d3.geo.eckert5 = function() {
    return projection(eckert5);
  }).raw = eckert5;
  function eckert6(??, ??) {
    var k = (1 + half??) * Math.sin(??);
    for (var i = 0, ?? = Infinity; i < 10 && Math.abs(??) > ??; i++) {
      ?? -= ?? = (?? + Math.sin(??) - k) / (1 + Math.cos(??));
    }
    k = Math.sqrt(2 + ??);
    return [ ?? * (1 + Math.cos(??)) / k, 2 * ?? / k ];
  }
  eckert6.invert = function(x, y) {
    var j = 1 + half??, k = Math.sqrt(j / 2);
    return [ x * 2 * k / (1 + Math.cos(y *= k)), asin((y + Math.sin(y)) / j) ];
  };
  (d3.geo.eckert6 = function() {
    return projection(eckert6);
  }).raw = eckert6;
  function eisenlohr(??, ??) {
    var s0 = Math.sin(?? /= 2), c0 = Math.cos(??), k = Math.sqrt(Math.cos(??)), c1 = Math.cos(?? /= 2), t = Math.sin(??) / (c1 + Math.SQRT2 * c0 * k), c = Math.sqrt(2 / (1 + t * t)), v = Math.sqrt((Math.SQRT2 * c1 + (c0 + s0) * k) / (Math.SQRT2 * c1 + (c0 - s0) * k));
    return [ eisenlohrK * (c * (v - 1 / v) - 2 * Math.log(v)), eisenlohrK * (c * t * (v + 1 / v) - 2 * Math.atan(t)) ];
  }
  eisenlohr.invert = function(x, y) {
    var p = d3.geo.august.raw.invert(x / 1.2, y * 1.065);
    if (!p) return null;
    var ?? = p[0], ?? = p[1], i = 20;
    x /= eisenlohrK, y /= eisenlohrK;
    do {
      var _0 = ?? / 2, _1 = ?? / 2, s0 = Math.sin(_0), c0 = Math.cos(_0), s1 = Math.sin(_1), c1 = Math.cos(_1), cos1 = Math.cos(??), k = Math.sqrt(cos1), t = s1 / (c1 + Math.SQRT2 * c0 * k), t2 = t * t, c = Math.sqrt(2 / (1 + t2)), v0 = Math.SQRT2 * c1 + (c0 + s0) * k, v1 = Math.SQRT2 * c1 + (c0 - s0) * k, v2 = v0 / v1, v = Math.sqrt(v2), vm1v = v - 1 / v, vp1v = v + 1 / v, fx = c * vm1v - 2 * Math.log(v) - x, fy = c * t * vp1v - 2 * Math.atan(t) - y, ??t???? = s1 && Math.SQRT1_2 * k * s0 * t2 / s1, ??t???? = (Math.SQRT2 * c0 * c1 + k) / (2 * (c1 + Math.SQRT2 * c0 * k) * (c1 + Math.SQRT2 * c0 * k) * k), ??c??t = -.5 * t * c * c * c, ??c???? = ??c??t * ??t????, ??c???? = ??c??t * ??t????, A = (A = 2 * c1 + Math.SQRT2 * k * (c0 - s0)) * A * v, ??v???? = (Math.SQRT2 * c0 * c1 * k + cos1) / A, ??v???? = -(Math.SQRT2 * s0 * s1) / (k * A), ??x???? = vm1v * ??c???? - 2 * ??v???? / v + c * (??v???? + ??v???? / v2), ??x???? = vm1v * ??c???? - 2 * ??v???? / v + c * (??v???? + ??v???? / v2), ??y???? = t * vp1v * ??c???? - 2 * ??t???? / (1 + t2) + c * vp1v * ??t???? + c * t * (??v???? - ??v???? / v2), ??y???? = t * vp1v * ??c???? - 2 * ??t???? / (1 + t2) + c * vp1v * ??t???? + c * t * (??v???? - ??v???? / v2), denominator = ??x???? * ??y???? - ??y???? * ??x????;
      if (!denominator) break;
      var ???? = (fy * ??x???? - fx * ??y????) / denominator, ???? = (fx * ??y???? - fy * ??x????) / denominator;
      ?? -= ????;
      ?? = Math.max(-half??, Math.min(half??, ?? - ????));
    } while ((Math.abs(????) > ?? || Math.abs(????) > ??) && --i > 0);
    return Math.abs(Math.abs(??) - half??) < ?? ? [ 0, ?? ] : i && [ ??, ?? ];
  };
  var eisenlohrK = 3 + 2 * Math.SQRT2;
  (d3.geo.eisenlohr = function() {
    return projection(eisenlohr);
  }).raw = eisenlohr;
  function fahey(??, ??) {
    var t = Math.tan(?? / 2);
    return [ ?? * faheyK * asqrt(1 - t * t), (1 + faheyK) * t ];
  }
  fahey.invert = function(x, y) {
    var t = y / (1 + faheyK);
    return [ x ? x / (faheyK * asqrt(1 - t * t)) : 0, 2 * Math.atan(t) ];
  };
  var faheyK = Math.cos(35 * radians);
  (d3.geo.fahey = function() {
    return projection(fahey);
  }).raw = fahey;
  function foucaut(??, ??) {
    var k = ?? / 2, cosk = Math.cos(k);
    return [ 2 * ?? / sqrt?? * Math.cos(??) * cosk * cosk, sqrt?? * Math.tan(k) ];
  }
  foucaut.invert = function(x, y) {
    var k = Math.atan(y / sqrt??), cosk = Math.cos(k), ?? = 2 * k;
    return [ x * sqrt?? * .5 / (Math.cos(??) * cosk * cosk), ?? ];
  };
  (d3.geo.foucaut = function() {
    return projection(foucaut);
  }).raw = foucaut;
  d3.geo.gilbert = function(projection) {
    var e = d3.geo.equirectangular().scale(degrees).translate([ 0, 0 ]);
    function gilbert(coordinates) {
      return projection([ coordinates[0] * .5, asin(Math.tan(coordinates[1] * .5 * radians)) * degrees ]);
    }
    if (projection.invert) gilbert.invert = function(coordinates) {
      coordinates = projection.invert(coordinates);
      coordinates[0] *= 2;
      coordinates[1] = 2 * Math.atan(Math.sin(coordinates[1] * radians)) * degrees;
      return coordinates;
    };
    gilbert.stream = function(stream) {
      stream = projection.stream(stream);
      var s = e.stream({
        point: function(??, ??) {
          stream.point(?? * .5, asin(Math.tan(-?? * .5 * radians)) * degrees);
        },
        lineStart: function() {
          stream.lineStart();
        },
        lineEnd: function() {
          stream.lineEnd();
        },
        polygonStart: function() {
          stream.polygonStart();
        },
        polygonEnd: function() {
          stream.polygonEnd();
        }
      });
      s.sphere = function() {
        stream.sphere();
      };
      s.valid = false;
      return s;
    };
    return gilbert;
  };
  var gingeryAzimuthalEquidistant = d3.geo.azimuthalEquidistant.raw;
  function gingery(??, n) {
    var k = 2 * ?? / n, ??2 = ?? * ??;
    function forward(??, ??) {
      var p = gingeryAzimuthalEquidistant(??, ??), x = p[0], y = p[1], r2 = x * x + y * y;
      if (r2 > ??2) {
        var r = Math.sqrt(r2), ?? = Math.atan2(y, x), ??0 = k * Math.round(?? / k), ?? = ?? - ??0, ??cos?? = ?? * Math.cos(??), k_ = (?? * Math.sin(??) - ?? * Math.sin(??cos??)) / (half?? - ??cos??), s_ = arcLength_(??, k_), e = (?? - ??) / gingeryIntegrate(s_, ??cos??, ??);
        x = r;
        var i = 50, ??;
        do {
          x -= ?? = (?? + gingeryIntegrate(s_, ??cos??, x) * e - r) / (s_(x) * e);
        } while (Math.abs(??) > ?? && --i > 0);
        y = ?? * Math.sin(x);
        if (x < half??) y -= k_ * (x - half??);
        var s = Math.sin(??0), c = Math.cos(??0);
        p[0] = x * c - y * s;
        p[1] = x * s + y * c;
      }
      return p;
    }
    forward.invert = function(x, y) {
      var r2 = x * x + y * y;
      if (r2 > ??2) {
        var r = Math.sqrt(r2), ?? = Math.atan2(y, x), ??0 = k * Math.round(?? / k), d?? = ?? - ??0, x = r * Math.cos(d??);
        y = r * Math.sin(d??);
        var x_half?? = x - half??, sinx = Math.sin(x), ?? = y / sinx, ?? = x < half?? ? Infinity : 0, i = 10;
        while (true) {
          var ??sin?? = ?? * Math.sin(??), ??cos?? = ?? * Math.cos(??), sin??cos?? = Math.sin(??cos??), half??_??cos?? = half?? - ??cos??, k_ = (??sin?? - ?? * sin??cos??) / half??_??cos??, s_ = arcLength_(??, k_);
          if (Math.abs(??) < ??2 || !--i) break;
          ?? -= ?? = (?? * sinx - k_ * x_half?? - y) / (sinx - x_half?? * 2 * (half??_??cos?? * (??cos?? + ?? * ??sin?? * Math.cos(??cos??) - sin??cos??) - ??sin?? * (??sin?? - ?? * sin??cos??)) / (half??_??cos?? * half??_??cos??));
        }
        r = ?? + gingeryIntegrate(s_, ??cos??, x) * (?? - ??) / gingeryIntegrate(s_, ??cos??, ??);
        ?? = ??0 + ??;
        x = r * Math.cos(??);
        y = r * Math.sin(??);
      }
      return gingeryAzimuthalEquidistant.invert(x, y);
    };
    return forward;
  }
  function arcLength_(??, k) {
    return function(x) {
      var y_ = ?? * Math.cos(x);
      if (x < half??) y_ -= k;
      return Math.sqrt(1 + y_ * y_);
    };
  }
  function gingeryProjection() {
    var n = 6, ?? = 30 * radians, c?? = Math.cos(??), s?? = Math.sin(??), m = projectionMutator(gingery), p = m(??, n), stream_ = p.stream, ?? = .01, cr = -Math.cos(?? * radians), sr = Math.sin(?? * radians);
    p.radius = function(_) {
      if (!arguments.length) return ?? * degrees;
      c?? = Math.cos(?? = _ * radians);
      s?? = Math.sin(??);
      return m(??, n);
    };
    p.lobes = function(_) {
      if (!arguments.length) return n;
      return m(??, n = +_);
    };
    p.stream = function(stream) {
      var rotate = p.rotate(), rotateStream = stream_(stream), sphereStream = (p.rotate([ 0, 0 ]), 
      stream_(stream));
      p.rotate(rotate);
      rotateStream.sphere = function() {
        sphereStream.polygonStart(), sphereStream.lineStart();
        for (var i = 0, ?? = 2 * ?? / n, ?? = 0; i < n; ++i, ?? -= ??) {
          sphereStream.point(Math.atan2(sr * Math.cos(??), cr) * degrees, Math.asin(sr * Math.sin(??)) * degrees);
          sphereStream.point(Math.atan2(s?? * Math.cos(?? - ?? / 2), c??) * degrees, Math.asin(s?? * Math.sin(?? - ?? / 2)) * degrees);
        }
        sphereStream.lineEnd(), sphereStream.polygonEnd();
      };
      return rotateStream;
    };
    return p;
  }
  function gingeryIntegrate(f, a, b) {
    var n = 50, h = (b - a) / n, s = f(a) + f(b);
    for (var i = 1, x = a; i < n; ++i) s += 2 * f(x += h);
    return s * .5 * h;
  }
  (d3.geo.gingery = gingeryProjection).raw = gingery;
  function ginzburgPolyconic(a, b, c, d, e, f, g, h) {
    if (arguments.length < 8) h = 0;
    function forward(??, ??) {
      if (!??) return [ a * ?? / ??, 0 ];
      var ??2 = ?? * ??, xB = a + ??2 * (b + ??2 * (c + ??2 * d)), yB = ?? * (e - 1 + ??2 * (f - h + ??2 * g)), m = (xB * xB + yB * yB) / (2 * yB), ?? = ?? * Math.asin(xB / m) / ??;
      return [ m * Math.sin(??), ?? * (1 + ??2 * h) + m * (1 - Math.cos(??)) ];
    }
    forward.invert = function(x, y) {
      var ?? = ?? * x / a, ?? = y, ????, ????, i = 50;
      do {
        var ??2 = ?? * ??, xB = a + ??2 * (b + ??2 * (c + ??2 * d)), yB = ?? * (e - 1 + ??2 * (f - h + ??2 * g)), p = xB * xB + yB * yB, q = 2 * yB, m = p / q, m2 = m * m, d??d?? = Math.asin(xB / m) / ??, ?? = ?? * d??d??;
        xB2 = xB * xB, dxBd?? = (2 * b + ??2 * (4 * c + ??2 * 6 * d)) * ??, dyBd?? = e + ??2 * (3 * f + ??2 * 5 * g), 
        dpd?? = 2 * (xB * dxBd?? + yB * (dyBd?? - 1)), dqd?? = 2 * (dyBd?? - 1), dmd?? = (dpd?? * q - p * dqd??) / (q * q), 
        cos?? = Math.cos(??), sin?? = Math.sin(??), mcos?? = m * cos??, msin?? = m * sin??, d??d?? = ?? / ?? * (1 / asqrt(1 - xB2 / m2)) * (dxBd?? * m - xB * dmd??) / m2, 
        fx = msin?? - x, fy = ?? * (1 + ??2 * h) + m - mcos?? - y, ??x???? = dmd?? * sin?? + mcos?? * d??d??, 
        ??x???? = mcos?? * d??d??, ??y???? = 1 + dmd?? - (dmd?? * cos?? - msin?? * d??d??), ??y???? = msin?? * d??d??, 
        denominator = ??x???? * ??y???? - ??y???? * ??x????;
        if (!denominator) break;
        ?? -= ???? = (fy * ??x???? - fx * ??y????) / denominator;
        ?? -= ???? = (fx * ??y???? - fy * ??x????) / denominator;
      } while ((Math.abs(????) > ?? || Math.abs(????) > ??) && --i > 0);
      return [ ??, ?? ];
    };
    return forward;
  }
  var ginzburg4 = ginzburgPolyconic(2.8284, -1.6988, .75432, -.18071, 1.76003, -.38914, .042555);
  (d3.geo.ginzburg4 = function() {
    return projection(ginzburg4);
  }).raw = ginzburg4;
  var ginzburg5 = ginzburgPolyconic(2.583819, -.835827, .170354, -.038094, 1.543313, -.411435, .082742);
  (d3.geo.ginzburg5 = function() {
    return projection(ginzburg5);
  }).raw = ginzburg5;
  var ginzburg6 = ginzburgPolyconic(5 / 6 * ??, -.62636, -.0344, 0, 1.3493, -.05524, 0, .045);
  (d3.geo.ginzburg6 = function() {
    return projection(ginzburg6);
  }).raw = ginzburg6;
  function ginzburg8(??, ??) {
    var ??2 = ?? * ??, ??2 = ?? * ??;
    return [ ?? * (1 - .162388 * ??2) * (.87 - 952426e-9 * ??2 * ??2), ?? * (1 + ??2 / 12) ];
  }
  ginzburg8.invert = function(x, y) {
    var ?? = x, ?? = y, i = 50, ??;
    do {
      var ??2 = ?? * ??;
      ?? -= ?? = (?? * (1 + ??2 / 12) - y) / (1 + ??2 / 4);
    } while (Math.abs(??) > ?? && --i > 0);
    i = 50;
    x /= 1 - .162388 * ??2;
    do {
      var ??4 = (??4 = ?? * ??) * ??4;
      ?? -= ?? = (?? * (.87 - 952426e-9 * ??4) - x) / (.87 - .00476213 * ??4);
    } while (Math.abs(??) > ?? && --i > 0);
    return [ ??, ?? ];
  };
  (d3.geo.ginzburg8 = function() {
    return projection(ginzburg8);
  }).raw = ginzburg8;
  var ginzburg9 = ginzburgPolyconic(2.6516, -.76534, .19123, -.047094, 1.36289, -.13965, .031762);
  (d3.geo.ginzburg9 = function() {
    return projection(ginzburg9);
  }).raw = ginzburg9;
  function quincuncialProjection(projectHemisphere) {
    var dx = projectHemisphere(half??, 0)[0] - projectHemisphere(-half??, 0)[0];
    function projection() {
      var quincuncial = false, m = projectionMutator(projectAt), p = m(quincuncial);
      p.quincuncial = function(_) {
        if (!arguments.length) return quincuncial;
        return m(quincuncial = !!_);
      };
      return p;
    }
    function projectAt(quincuncial) {
      var forward = quincuncial ? function(??, ??) {
        var t = Math.abs(??) < half??, p = projectHemisphere(t ? ?? : ?? > 0 ? ?? - ?? : ?? + ??, ??);
        var x = (p[0] - p[1]) * Math.SQRT1_2, y = (p[0] + p[1]) * Math.SQRT1_2;
        if (t) return [ x, y ];
        var d = dx * Math.SQRT1_2, s = x > 0 ^ y > 0 ? -1 : 1;
        return [ s * x - sgn(y) * d, s * y - sgn(x) * d ];
      } : function(??, ??) {
        var s = ?? > 0 ? -.5 : .5, point = projectHemisphere(?? + s * ??, ??);
        point[0] -= s * dx;
        return point;
      };
      if (projectHemisphere.invert) forward.invert = quincuncial ? function(x0, y0) {
        var x = (x0 + y0) * Math.SQRT1_2, y = (y0 - x0) * Math.SQRT1_2, t = Math.abs(x) < .5 * dx && Math.abs(y) < .5 * dx;
        if (!t) {
          var d = dx * Math.SQRT1_2, s = x > 0 ^ y > 0 ? -1 : 1, x1 = -s * (x0 + (y > 0 ? 1 : -1) * d), y1 = -s * (y0 + (x > 0 ? 1 : -1) * d);
          x = (-x1 - y1) * Math.SQRT1_2;
          y = (x1 - y1) * Math.SQRT1_2;
        }
        var p = projectHemisphere.invert(x, y);
        if (!t) p[0] += x > 0 ? ?? : -??;
        return p;
      } : function(x, y) {
        var s = x > 0 ? -.5 : .5, location = projectHemisphere.invert(x + s * dx, y), ?? = location[0] - s * ??;
        if (?? < -??) ?? += 2 * ??; else if (?? > ??) ?? -= 2 * ??;
        location[0] = ??;
        return location;
      };
      return forward;
    }
    projection.raw = projectAt;
    return projection;
  }
  function gringorten(??, ??) {
    var s?? = sgn(??), s?? = sgn(??), cos?? = Math.cos(??), x = Math.cos(??) * cos??, y = Math.sin(??) * cos??, z = Math.sin(s?? * ??);
    ?? = Math.abs(Math.atan2(y, z));
    ?? = asin(x);
    if (Math.abs(?? - half??) > ??) ?? %= half??;
    var point = gringortenHexadecant(?? > ?? / 4 ? half?? - ?? : ??, ??);
    if (?? > ?? / 4) z = point[0], point[0] = -point[1], point[1] = -z;
    return point[0] *= s??, point[1] *= -s??, point;
  }
  gringorten.invert = function(x, y) {
    var sx = sgn(x), sy = sgn(y), x0 = -sx * x, y0 = -sy * y, t = y0 / x0 < 1, p = gringortenHexadecantInvert(t ? y0 : x0, t ? x0 : y0), ?? = p[0], ?? = p[1];
    if (t) ?? = -half?? - ??;
    var cos?? = Math.cos(??), x = Math.cos(??) * cos??, y = Math.sin(??) * cos??, z = Math.sin(??);
    return [ sx * (Math.atan2(y, -z) + ??), sy * asin(x) ];
  };
  function gringortenHexadecant(??, ??) {
    if (?? === half??) return [ 0, 0 ];
    var sin?? = Math.sin(??), r = sin?? * sin??, r2 = r * r, j = 1 + r2, k = 1 + 3 * r2, q = 1 - r2, z = asin(1 / Math.sqrt(j)), v = q + r * j * z, p2 = (1 - sin??) / v, p = Math.sqrt(p2), a2 = p2 * j, a = Math.sqrt(a2), h = p * q;
    if (?? === 0) return [ 0, -(h + r * a) ];
    var cos?? = Math.cos(??), sec?? = 1 / cos??, drd?? = 2 * sin?? * cos??, dvd?? = (-3 * r + z * k) * drd??, dp2d?? = (-v * cos?? - (1 - sin??) * dvd??) / (v * v), dpd?? = .5 * dp2d?? / p, dhd?? = q * dpd?? - 2 * r * p * drd??, dra2d?? = r * j * dp2d?? + p2 * k * drd??, ?? = -sec?? * drd??, ?? = -sec?? * dra2d??, ?? = -2 * sec?? * dhd??, ?? = 4 * ?? / ??;
    if (?? > .222 * ?? || ?? < ?? / 4 && ?? > .175 * ??) {
      var x = (h + r * asqrt(a2 * (1 + r2) - h * h)) / (1 + r2);
      if (?? > ?? / 4) return [ x, x ];
      var x1 = x, x0 = .5 * x, i = 50;
      x = .5 * (x0 + x1);
      do {
        var g = Math.sqrt(a2 - x * x), f = x * (?? + ?? * g) + ?? * asin(x / a) - ??;
        if (!f) break;
        if (f < 0) x0 = x; else x1 = x;
        x = .5 * (x0 + x1);
      } while (Math.abs(x1 - x0) > ?? && --i > 0);
    } else {
      var x = ??, i = 25, ??;
      do {
        var x2 = x * x, g = asqrt(a2 - x2), ????g = ?? + ?? * g, f = x * ????g + ?? * asin(x / a) - ??, df = ????g + (?? - ?? * x2) / g;
        x -= ?? = g ? f / df : 0;
      } while (Math.abs(??) > ?? && --i > 0);
    }
    return [ x, -h - r * asqrt(a2 - x * x) ];
  }
  function gringortenHexadecantInvert(x, y) {
    var x0 = 0, x1 = 1, r = .5, i = 50;
    while (true) {
      var r2 = r * r, sin?? = Math.sqrt(r), z = Math.asin(1 / Math.sqrt(1 + r2)), v = 1 - r2 + r * (1 + r2) * z, p2 = (1 - sin??) / v, p = Math.sqrt(p2), a2 = p2 * (1 + r2), h = p * (1 - r2), g2 = a2 - x * x, g = Math.sqrt(g2), y0 = y + h + r * g;
      if (Math.abs(x1 - x0) < ??2 || --i === 0 || y0 === 0) break;
      if (y0 > 0) x0 = r; else x1 = r;
      r = .5 * (x0 + x1);
    }
    if (!i) return null;
    var ?? = Math.asin(sin??), cos?? = Math.cos(??), sec?? = 1 / cos??, drd?? = 2 * sin?? * cos??, dvd?? = (-3 * r + z * (1 + 3 * r2)) * drd??, dp2d?? = (-v * cos?? - (1 - sin??) * dvd??) / (v * v), dpd?? = .5 * dp2d?? / p, dhd?? = (1 - r2) * dpd?? - 2 * r * p * drd??, ?? = -2 * sec?? * dhd??, ?? = -sec?? * drd??, ?? = -sec?? * (r * (1 + r2) * dp2d?? + p2 * (1 + 3 * r2) * drd??);
    return [ ?? / 4 * (x * (?? + ?? * g) + ?? * Math.asin(x / Math.sqrt(a2))), ?? ];
  }
  d3.geo.gringorten = quincuncialProjection(gringorten);
  function ellipticJi(u, v, m) {
    if (!u) {
      var b = ellipticJ(v, 1 - m);
      return [ [ 0, b[0] / b[1] ], [ 1 / b[1], 0 ], [ b[2] / b[1], 0 ] ];
    }
    var a = ellipticJ(u, m);
    if (!v) return [ [ a[0], 0 ], [ a[1], 0 ], [ a[2], 0 ] ];
    var b = ellipticJ(v, 1 - m), denominator = b[1] * b[1] + m * a[0] * a[0] * b[0] * b[0];
    return [ [ a[0] * b[2] / denominator, a[1] * a[2] * b[0] * b[1] / denominator ], [ a[1] * b[1] / denominator, -a[0] * a[2] * b[0] * b[2] / denominator ], [ a[2] * b[1] * b[2] / denominator, -m * a[0] * a[1] * b[0] / denominator ] ];
  }
  function ellipticJ(u, m) {
    var ai, b, ??, t, twon;
    if (m < ??) {
      t = Math.sin(u);
      b = Math.cos(u);
      ai = .25 * m * (u - t * b);
      return [ t - ai * b, b + ai * t, 1 - .5 * m * t * t, u - ai ];
    }
    if (m >= 1 - ??) {
      ai = .25 * (1 - m);
      b = cosh(u);
      t = tanh(u);
      ?? = 1 / b;
      twon = b * sinh(u);
      return [ t + ai * (twon - u) / (b * b), ?? - ai * t * ?? * (twon - u), ?? + ai * t * ?? * (twon + u), 2 * Math.atan(Math.exp(u)) - half?? + ai * (twon - u) / b ];
    }
    var a = [ 1, 0, 0, 0, 0, 0, 0, 0, 0 ], c = [ Math.sqrt(m), 0, 0, 0, 0, 0, 0, 0, 0 ], i = 0;
    b = Math.sqrt(1 - m);
    twon = 1;
    while (Math.abs(c[i] / a[i]) > ?? && i < 8) {
      ai = a[i++];
      c[i] = .5 * (ai - b);
      a[i] = .5 * (ai + b);
      b = asqrt(ai * b);
      twon *= 2;
    }
    ?? = twon * a[i] * u;
    do {
      t = c[i] * Math.sin(b = ??) / a[i];
      ?? = .5 * (asin(t) + ??);
    } while (--i);
    return [ Math.sin(??), t = Math.cos(??), t / Math.cos(?? - b), ?? ];
  }
  function ellipticFi(??, ??, m) {
    var r = Math.abs(??), i = Math.abs(??), sinh?? = sinh(i);
    if (r) {
      var csc?? = 1 / Math.sin(r), cot??2 = 1 / (Math.tan(r) * Math.tan(r)), b = -(cot??2 + m * sinh?? * sinh?? * csc?? * csc?? - 1 + m), c = (m - 1) * cot??2, cot??2 = .5 * (-b + Math.sqrt(b * b - 4 * c));
      return [ ellipticF(Math.atan(1 / Math.sqrt(cot??2)), m) * sgn(??), ellipticF(Math.atan(asqrt((cot??2 / cot??2 - 1) / m)), 1 - m) * sgn(??) ];
    }
    return [ 0, ellipticF(Math.atan(sinh??), 1 - m) * sgn(??) ];
  }
  function ellipticF(??, m) {
    if (!m) return ??;
    if (m === 1) return Math.log(Math.tan(?? / 2 + ?? / 4));
    var a = 1, b = Math.sqrt(1 - m), c = Math.sqrt(m);
    for (var i = 0; Math.abs(c) > ??; i++) {
      if (?? % ??) {
        var d?? = Math.atan(b * Math.tan(??) / a);
        if (d?? < 0) d?? += ??;
        ?? += d?? + ~~(?? / ??) * ??;
      } else ?? += ??;
      c = (a + b) / 2;
      b = Math.sqrt(a * b);
      c = ((a = c) - b) / 2;
    }
    return ?? / (Math.pow(2, i) * a);
  }
  function guyou(??, ??) {
    var k_ = (Math.SQRT2 - 1) / (Math.SQRT2 + 1), k = Math.sqrt(1 - k_ * k_), K = ellipticF(half??, k * k), f = -1;
    var ?? = Math.log(Math.tan(?? / 4 + Math.abs(??) / 2)), r = Math.exp(f * ??) / Math.sqrt(k_), at = guyouComplexAtan(r * Math.cos(f * ??), r * Math.sin(f * ??)), t = ellipticFi(at[0], at[1], k * k);
    return [ -t[1], (?? >= 0 ? 1 : -1) * (.5 * K - t[0]) ];
  }
  function guyouComplexAtan(x, y) {
    var x2 = x * x, y_1 = y + 1, t = 1 - x2 - y * y;
    return [ .5 * ((x >= 0 ? half?? : -half??) - Math.atan2(t, 2 * x)), -.25 * Math.log(t * t + 4 * x2) + .5 * Math.log(y_1 * y_1 + x2) ];
  }
  function guyouComplexDivide(a, b) {
    var denominator = b[0] * b[0] + b[1] * b[1];
    return [ (a[0] * b[0] + a[1] * b[1]) / denominator, (a[1] * b[0] - a[0] * b[1]) / denominator ];
  }
  guyou.invert = function(x, y) {
    var k_ = (Math.SQRT2 - 1) / (Math.SQRT2 + 1), k = Math.sqrt(1 - k_ * k_), K = ellipticF(half??, k * k), f = -1;
    var j = ellipticJi(.5 * K - y, -x, k * k), tn = guyouComplexDivide(j[0], j[1]), ?? = Math.atan2(tn[1], tn[0]) / f;
    return [ ??, 2 * Math.atan(Math.exp(.5 / f * Math.log(k_ * tn[0] * tn[0] + k_ * tn[1] * tn[1]))) - half?? ];
  };
  d3.geo.guyou = quincuncialProjection(guyou);
  function hammerRetroazimuthal(??0) {
    var sin??0 = Math.sin(??0), cos??0 = Math.cos(??0), rotate = hammerRetroazimuthalRotation(??0);
    rotate.invert = hammerRetroazimuthalRotation(-??0);
    function forward(??, ??) {
      var p = rotate(??, ??);
      ?? = p[0], ?? = p[1];
      var sin?? = Math.sin(??), cos?? = Math.cos(??), cos?? = Math.cos(??), z = acos(sin??0 * sin?? + cos??0 * cos?? * cos??), sinz = Math.sin(z), K = Math.abs(sinz) > ?? ? z / sinz : 1;
      return [ K * cos??0 * Math.sin(??), (Math.abs(??) > half?? ? K : -K) * (sin??0 * cos?? - cos??0 * sin?? * cos??) ];
    }
    forward.invert = function(x, y) {
      var ?? = Math.sqrt(x * x + y * y), sinz = -Math.sin(??), cosz = Math.cos(??), a = ?? * cosz, b = -y * sinz, c = ?? * sin??0, d = asqrt(a * a + b * b - c * c), ?? = Math.atan2(a * c + b * d, b * c - a * d), ?? = (?? > half?? ? -1 : 1) * Math.atan2(x * sinz, ?? * Math.cos(??) * cosz + y * Math.sin(??) * sinz);
      return rotate.invert(??, ??);
    };
    return forward;
  }
  function hammerRetroazimuthalRotation(??0) {
    var sin??0 = Math.sin(??0), cos??0 = Math.cos(??0);
    return function(??, ??) {
      var cos?? = Math.cos(??), x = Math.cos(??) * cos??, y = Math.sin(??) * cos??, z = Math.sin(??);
      return [ Math.atan2(y, x * cos??0 - z * sin??0), asin(z * cos??0 + x * sin??0) ];
    };
  }
  function hammerRetroazimuthalProjection() {
    var ??0 = 0, m = projectionMutator(hammerRetroazimuthal), p = m(??0), rotate_ = p.rotate, stream_ = p.stream, circle = d3.geo.circle();
    p.parallel = function(_) {
      if (!arguments.length) return ??0 / ?? * 180;
      var r = p.rotate();
      return m(??0 = _ * ?? / 180).rotate(r);
    };
    p.rotate = function(_) {
      if (!arguments.length) return _ = rotate_.call(p), _[1] += ??0 / ?? * 180, _;
      rotate_.call(p, [ _[0], _[1] - ??0 / ?? * 180 ]);
      circle.origin([ -_[0], -_[1] ]);
      return p;
    };
    p.stream = function(stream) {
      stream = stream_(stream);
      stream.sphere = function() {
        stream.polygonStart();
        var ?? = .01, ring = circle.angle(90 - ??)().coordinates[0], n = ring.length - 1, i = -1, p;
        stream.lineStart();
        while (++i < n) stream.point((p = ring[i])[0], p[1]);
        stream.lineEnd();
        ring = circle.angle(90 + ??)().coordinates[0];
        n = ring.length - 1;
        stream.lineStart();
        while (--i >= 0) stream.point((p = ring[i])[0], p[1]);
        stream.lineEnd();
        stream.polygonEnd();
      };
      return stream;
    };
    return p;
  }
  (d3.geo.hammerRetroazimuthal = hammerRetroazimuthalProjection).raw = hammerRetroazimuthal;
  var hammerAzimuthalEqualArea = d3.geo.azimuthalEqualArea.raw;
  function hammer(A, B) {
    if (arguments.length < 2) B = A;
    if (B === 1) return hammerAzimuthalEqualArea;
    if (B === Infinity) return hammerQuarticAuthalic;
    function forward(??, ??) {
      var coordinates = hammerAzimuthalEqualArea(?? / B, ??);
      coordinates[0] *= A;
      return coordinates;
    }
    forward.invert = function(x, y) {
      var coordinates = hammerAzimuthalEqualArea.invert(x / A, y);
      coordinates[0] *= B;
      return coordinates;
    };
    return forward;
  }
  function hammerProjection() {
    var B = 2, m = projectionMutator(hammer), p = m(B);
    p.coefficient = function(_) {
      if (!arguments.length) return B;
      return m(B = +_);
    };
    return p;
  }
  function hammerQuarticAuthalic(??, ??) {
    return [ ?? * Math.cos(??) / Math.cos(?? /= 2), 2 * Math.sin(??) ];
  }
  hammerQuarticAuthalic.invert = function(x, y) {
    var ?? = 2 * asin(y / 2);
    return [ x * Math.cos(?? / 2) / Math.cos(??), ?? ];
  };
  (d3.geo.hammer = hammerProjection).raw = hammer;
  function hatano(??, ??) {
    var c = Math.sin(??) * (?? < 0 ? 2.43763 : 2.67595);
    for (var i = 0, ??; i < 20; i++) {
      ?? -= ?? = (?? + Math.sin(??) - c) / (1 + Math.cos(??));
      if (Math.abs(??) < ??) break;
    }
    return [ .85 * ?? * Math.cos(?? *= .5), Math.sin(??) * (?? < 0 ? 1.93052 : 1.75859) ];
  }
  hatano.invert = function(x, y) {
    var ?? = Math.abs(?? = y * (y < 0 ? .5179951515653813 : .5686373742600607)) > 1 - ?? ? ?? > 0 ? half?? : -half?? : asin(??);
    return [ 1.1764705882352942 * x / Math.cos(??), Math.abs(?? = ((?? += ??) + Math.sin(??)) * (y < 0 ? .4102345310814193 : .3736990601468637)) > 1 - ?? ? ?? > 0 ? half?? : -half?? : asin(??) ];
  };
  (d3.geo.hatano = function() {
    return projection(hatano);
  }).raw = hatano;
  var healpixParallel = 41 + 48 / 36 + 37 / 3600;
  function healpix(h) {
    var lambert = d3.geo.cylindricalEqualArea.raw(0), ??0 = healpixParallel * ?? / 180, dx0 = 2 * ??, dx1 = d3.geo.collignon.raw(??, ??0)[0] - d3.geo.collignon.raw(-??, ??0)[0], y0 = lambert(0, ??0)[1], y1 = d3.geo.collignon.raw(0, ??0)[1], dy1 = d3.geo.collignon.raw(0, half??)[1] - y1, k = 2 * ?? / h;
    function forward(??, ??) {
      var point, ??2 = Math.abs(??);
      if (??2 > ??0) {
        var i = Math.min(h - 1, Math.max(0, Math.floor((?? + ??) / k)));
        ?? += ?? * (h - 1) / h - i * k;
        point = d3.geo.collignon.raw(??, ??2);
        point[0] = point[0] * dx0 / dx1 - dx0 * (h - 1) / (2 * h) + i * dx0 / h;
        point[1] = y0 + (point[1] - y1) * 4 * dy1 / dx0;
        if (?? < 0) point[1] = -point[1];
      } else {
        point = lambert(??, ??);
      }
      point[0] /= 2;
      return point;
    }
    forward.invert = function(x, y) {
      x *= 2;
      var y2 = Math.abs(y);
      if (y2 > y0) {
        var i = Math.min(h - 1, Math.max(0, Math.floor((x + ??) / k)));
        x = (x + ?? * (h - 1) / h - i * k) * dx1 / dx0;
        var point = d3.geo.collignon.raw.invert(x, .25 * (y2 - y0) * dx0 / dy1 + y1);
        point[0] -= ?? * (h - 1) / h - i * k;
        if (y < 0) point[1] = -point[1];
        return point;
      }
      return lambert.invert(x, y);
    };
    return forward;
  }
  function healpixProjection() {
    var n = 2, m = projectionMutator(healpix), p = m(n), stream_ = p.stream;
    p.lobes = function(_) {
      if (!arguments.length) return n;
      return m(n = +_);
    };
    p.stream = function(stream) {
      var rotate = p.rotate(), rotateStream = stream_(stream), sphereStream = (p.rotate([ 0, 0 ]), 
      stream_(stream));
      p.rotate(rotate);
      rotateStream.sphere = function() {
        d3.geo.stream(sphere(), sphereStream);
      };
      return rotateStream;
    };
    function sphere() {
      var step = 180 / n;
      return {
        type: "Polygon",
        coordinates: [ d3.range(-180, 180 + step / 2, step).map(function(x, i) {
          return [ x, i & 1 ? 90 - 1e-6 : healpixParallel ];
        }).concat(d3.range(180, -180 - step / 2, -step).map(function(x, i) {
          return [ x, i & 1 ? -90 + 1e-6 : -healpixParallel ];
        })) ]
      };
    }
    return p;
  }
  (d3.geo.healpix = healpixProjection).raw = healpix;
  function hill(K) {
    var L = 1 + K, sin?? = Math.sin(1 / L), ?? = asin(sin??), A = 2 * Math.sqrt(?? / (B = ?? + 4 * ?? * L)), B, ??0 = .5 * A * (L + Math.sqrt(K * (2 + K))), K2 = K * K, L2 = L * L;
    function forward(??, ??) {
      var t = 1 - Math.sin(??), ??, ??;
      if (t && t < 2) {
        var ?? = half?? - ??, i = 25, ??;
        do {
          var sin?? = Math.sin(??), cos?? = Math.cos(??), ??_??1 = ?? + Math.atan2(sin??, L - cos??), C = 1 + L2 - 2 * L * cos??;
          ?? -= ?? = (?? - K2 * ?? - L * sin?? + C * ??_??1 - .5 * t * B) / (2 * L * sin?? * ??_??1);
        } while (Math.abs(??) > ??2 && --i > 0);
        ?? = A * Math.sqrt(C);
        ?? = ?? * ??_??1 / ??;
      } else {
        ?? = A * (K + t);
        ?? = ?? * ?? / ??;
      }
      return [ ?? * Math.sin(??), ??0 - ?? * Math.cos(??) ];
    }
    forward.invert = function(x, y) {
      var ??2 = x * x + (y -= ??0) * y, cos?? = (1 + L2 - ??2 / (A * A)) / (2 * L), ?? = acos(cos??), sin?? = Math.sin(??), ??_??1 = ?? + Math.atan2(sin??, L - cos??);
      return [ asin(x / Math.sqrt(??2)) * ?? / ??_??1, asin(1 - 2 * (?? - K2 * ?? - L * sin?? + (1 + L2 - 2 * L * cos??) * ??_??1) / B) ];
    };
    return forward;
  }
  function hillProjection() {
    var K = 1, m = projectionMutator(hill), p = m(K);
    p.ratio = function(_) {
      if (!arguments.length) return K;
      return m(K = +_);
    };
    return p;
  }
  (d3.geo.hill = hillProjection).raw = hill;
  var sinuMollweide?? = .7109889596207567, sinuMollweideY = .0528035274542;
  function sinuMollweide(??, ??) {
    return ?? > -sinuMollweide?? ? (?? = mollweide(??, ??), ??[1] += sinuMollweideY, ??) : sinusoidal(??, ??);
  }
  sinuMollweide.invert = function(x, y) {
    return y > -sinuMollweide?? ? mollweide.invert(x, y - sinuMollweideY) : sinusoidal.invert(x, y);
  };
  (d3.geo.sinuMollweide = function() {
    return projection(sinuMollweide).rotate([ -20, -55 ]);
  }).raw = sinuMollweide;
  function homolosine(??, ??) {
    return Math.abs(??) > sinuMollweide?? ? (?? = mollweide(??, ??), ??[1] -= ?? > 0 ? sinuMollweideY : -sinuMollweideY, 
    ??) : sinusoidal(??, ??);
  }
  homolosine.invert = function(x, y) {
    return Math.abs(y) > sinuMollweide?? ? mollweide.invert(x, y + (y > 0 ? sinuMollweideY : -sinuMollweideY)) : sinusoidal.invert(x, y);
  };
  (d3.geo.homolosine = function() {
    return projection(homolosine);
  }).raw = homolosine;
  function kavrayskiy7(??, ??) {
    return [ 3 * ?? / (2 * ??) * Math.sqrt(?? * ?? / 3 - ?? * ??), ?? ];
  }
  kavrayskiy7.invert = function(x, y) {
    return [ 2 / 3 * ?? * x / Math.sqrt(?? * ?? / 3 - y * y), y ];
  };
  (d3.geo.kavrayskiy7 = function() {
    return projection(kavrayskiy7);
  }).raw = kavrayskiy7;
  function lagrange(n) {
    function forward(??, ??) {
      if (Math.abs(Math.abs(??) - half??) < ??) return [ 0, ?? < 0 ? -2 : 2 ];
      var sin?? = Math.sin(??), v = Math.pow((1 + sin??) / (1 - sin??), n / 2), c = .5 * (v + 1 / v) + Math.cos(?? *= n);
      return [ 2 * Math.sin(??) / c, (v - 1 / v) / c ];
    }
    forward.invert = function(x, y) {
      var y0 = Math.abs(y);
      if (Math.abs(y0 - 2) < ??) return x ? null : [ 0, sgn(y) * half?? ];
      if (y0 > 2) return null;
      x /= 2, y /= 2;
      var x2 = x * x, y2 = y * y, t = 2 * y / (1 + x2 + y2);
      t = Math.pow((1 + t) / (1 - t), 1 / n);
      return [ Math.atan2(2 * x, 1 - x2 - y2) / n, asin((t - 1) / (t + 1)) ];
    };
    return forward;
  }
  function lagrangeProjection() {
    var n = .5, m = projectionMutator(lagrange), p = m(n);
    p.spacing = function(_) {
      if (!arguments.length) return n;
      return m(n = +_);
    };
    return p;
  }
  (d3.geo.lagrange = lagrangeProjection).raw = lagrange;
  function larrivee(??, ??) {
    return [ ?? * (1 + Math.sqrt(Math.cos(??))) / 2, ?? / (Math.cos(?? / 2) * Math.cos(?? / 6)) ];
  }
  larrivee.invert = function(x, y) {
    var x0 = Math.abs(x), y0 = Math.abs(y), ??_sqrt2 = ?? / Math.SQRT2, ?? = ??, ?? = half??;
    if (y0 < ??_sqrt2) ?? *= y0 / ??_sqrt2; else ?? += 6 * acos(??_sqrt2 / y0);
    for (var i = 0; i < 25; i++) {
      var sin?? = Math.sin(??), sqrtcos?? = asqrt(Math.cos(??)), sin??_2 = Math.sin(?? / 2), cos??_2 = Math.cos(?? / 2), sin??_6 = Math.sin(?? / 6), cos??_6 = Math.cos(?? / 6), f0 = .5 * ?? * (1 + sqrtcos??) - x0, f1 = ?? / (cos??_2 * cos??_6) - y0, df0d?? = sqrtcos?? ? -.25 * ?? * sin?? / sqrtcos?? : 0, df0d?? = .5 * (1 + sqrtcos??), df1d?? = (1 + .5 * ?? * sin??_2 / cos??_2) / (cos??_2 * cos??_6), df1d?? = ?? / cos??_2 * (sin??_6 / 6) / (cos??_6 * cos??_6), denom = df0d?? * df1d?? - df1d?? * df0d??, d?? = (f0 * df1d?? - f1 * df0d??) / denom, d?? = (f1 * df0d?? - f0 * df1d??) / denom;
      ?? -= d??;
      ?? -= d??;
      if (Math.abs(d??) < ?? && Math.abs(d??) < ??) break;
    }
    return [ x < 0 ? -?? : ??, y < 0 ? -?? : ?? ];
  };
  (d3.geo.larrivee = function() {
    return projection(larrivee);
  }).raw = larrivee;
  function laskowski(??, ??) {
    var ??2 = ?? * ??, ??2 = ?? * ??;
    return [ ?? * (.975534 + ??2 * (-.119161 + ??2 * -.0143059 + ??2 * -.0547009)), ?? * (1.00384 + ??2 * (.0802894 + ??2 * -.02855 + ??2 * 199025e-9) + ??2 * (.0998909 + ??2 * -.0491032)) ];
  }
  laskowski.invert = function(x, y) {
    var ?? = sgn(x) * ??, ?? = y / 2, i = 50;
    do {
      var ??2 = ?? * ??, ??2 = ?? * ??, ???? = ?? * ??, fx = ?? * (.975534 + ??2 * (-.119161 + ??2 * -.0143059 + ??2 * -.0547009)) - x, fy = ?? * (1.00384 + ??2 * (.0802894 + ??2 * -.02855 + ??2 * 199025e-9) + ??2 * (.0998909 + ??2 * -.0491032)) - y, ??x???? = .975534 - ??2 * (.119161 + 3 * ??2 * .0143059 + ??2 * .0547009), ??x???? = -???? * (2 * .119161 + 4 * .0547009 * ??2 + 2 * .0143059 * ??2), ??y???? = ???? * (2 * .0802894 + 4 * 199025e-9 * ??2 + 2 * -.02855 * ??2), ??y???? = 1.00384 + ??2 * (.0802894 + 199025e-9 * ??2) + ??2 * (3 * (.0998909 - .02855 * ??2) - 5 * .0491032 * ??2), denominator = ??x???? * ??y???? - ??y???? * ??x????, ???? = (fy * ??x???? - fx * ??y????) / denominator, ???? = (fx * ??y???? - fy * ??x????) / denominator;
      ?? -= ????, ?? -= ????;
    } while ((Math.abs(????) > ?? || Math.abs(????) > ??) && --i > 0);
    return i && [ ??, ?? ];
  };
  (d3.geo.laskowski = function() {
    return projection(laskowski);
  }).raw = laskowski;
  function littrow(??, ??) {
    return [ Math.sin(??) / Math.cos(??), Math.tan(??) * Math.cos(??) ];
  }
  littrow.invert = function(x, y) {
    var x2 = x * x, y2 = y * y, y2_1 = y2 + 1, cos?? = x ? Math.SQRT1_2 * Math.sqrt((y2_1 - Math.sqrt(x2 * x2 + 2 * x2 * (y2 - 1) + y2_1 * y2_1)) / x2 + 1) : 1 / Math.sqrt(y2_1);
    return [ asin(x * cos??), sgn(y) * acos(cos??) ];
  };
  (d3.geo.littrow = function() {
    return projection(littrow);
  }).raw = littrow;
  function loximuthal(??0) {
    var cos??0 = Math.cos(??0), tan??0 = Math.tan(?? / 4 + ??0 / 2);
    function forward(??, ??) {
      var y = ?? - ??0, x = Math.abs(y) < ?? ? ?? * cos??0 : Math.abs(x = ?? / 4 + ?? / 2) < ?? || Math.abs(Math.abs(x) - half??) < ?? ? 0 : ?? * y / Math.log(Math.tan(x) / tan??0);
      return [ x, y ];
    }
    forward.invert = function(x, y) {
      var ??, ?? = y + ??0;
      return [ Math.abs(y) < ?? ? x / cos??0 : Math.abs(?? = ?? / 4 + ?? / 2) < ?? || Math.abs(Math.abs(??) - half??) < ?? ? 0 : x * Math.log(Math.tan(??) / tan??0) / y, ?? ];
    };
    return forward;
  }
  (d3.geo.loximuthal = function() {
    return parallel1Projection(loximuthal).parallel(40);
  }).raw = loximuthal;
  function miller(??, ??) {
    return [ ??, 1.25 * Math.log(Math.tan(?? / 4 + .4 * ??)) ];
  }
  miller.invert = function(x, y) {
    return [ x, 2.5 * Math.atan(Math.exp(.8 * y)) - .625 * ?? ];
  };
  (d3.geo.miller = function() {
    return projection(miller);
  }).raw = miller;
  function modifiedStereographic(C) {
    var m = C.length - 1;
    function forward(??, ??) {
      var cos?? = Math.cos(??), k = 2 / (1 + cos?? * Math.cos(??)), zr = k * cos?? * Math.sin(??), zi = k * Math.sin(??), i = m, w = C[i], ar = w[0], ai = w[1], t;
      while (--i >= 0) {
        w = C[i];
        ar = w[0] + zr * (t = ar) - zi * ai;
        ai = w[1] + zr * ai + zi * t;
      }
      ar = zr * (t = ar) - zi * ai;
      ai = zr * ai + zi * t;
      return [ ar, ai ];
    }
    forward.invert = function(x, y) {
      var i = 20, zr = x, zi = y;
      do {
        var j = m, w = C[j], ar = w[0], ai = w[1], br = 0, bi = 0, t;
        while (--j >= 0) {
          w = C[j];
          br = ar + zr * (t = br) - zi * bi;
          bi = ai + zr * bi + zi * t;
          ar = w[0] + zr * (t = ar) - zi * ai;
          ai = w[1] + zr * ai + zi * t;
        }
        br = ar + zr * (t = br) - zi * bi;
        bi = ai + zr * bi + zi * t;
        ar = zr * (t = ar) - zi * ai - x;
        ai = zr * ai + zi * t - y;
        var denominator = br * br + bi * bi, ??r, ??i;
        zr -= ??r = (ar * br + ai * bi) / denominator;
        zi -= ??i = (ai * br - ar * bi) / denominator;
      } while (Math.abs(??r) + Math.abs(??i) > ?? * ?? && --i > 0);
      if (i) {
        var ?? = Math.sqrt(zr * zr + zi * zi), c = 2 * Math.atan(?? * .5), sinc = Math.sin(c);
        return [ Math.atan2(zr * sinc, ?? * Math.cos(c)), ?? ? asin(zi * sinc / ??) : 0 ];
      }
    };
    return forward;
  }
  var modifiedStereographicCoefficients = {
    alaska: [ [ .9972523, 0 ], [ .0052513, -.0041175 ], [ .0074606, .0048125 ], [ -.0153783, -.1968253 ], [ .0636871, -.1408027 ], [ .3660976, -.2937382 ] ],
    gs48: [ [ .98879, 0 ], [ 0, 0 ], [ -.050909, 0 ], [ 0, 0 ], [ .075528, 0 ] ],
    gs50: [ [ .984299, 0 ], [ .0211642, .0037608 ], [ -.1036018, -.0575102 ], [ -.0329095, -.0320119 ], [ .0499471, .1223335 ], [ .026046, .0899805 ], [ 7388e-7, -.1435792 ], [ .0075848, -.1334108 ], [ -.0216473, .0776645 ], [ -.0225161, .0853673 ] ],
    miller: [ [ .9245, 0 ], [ 0, 0 ], [ .01943, 0 ] ],
    lee: [ [ .721316, 0 ], [ 0, 0 ], [ -.00881625, -.00617325 ] ]
  };
  function modifiedStereographicProjection() {
    var coefficients = modifiedStereographicCoefficients.miller, m = projectionMutator(modifiedStereographic), p = m(coefficients);
    p.coefficients = function(_) {
      if (!arguments.length) return coefficients;
      return m(coefficients = typeof _ === "string" ? modifiedStereographicCoefficients[_] : _);
    };
    return p;
  }
  (d3.geo.modifiedStereographic = modifiedStereographicProjection).raw = modifiedStereographic;
  function mtFlatPolarParabolic(??, ??) {
    var sqrt6 = Math.sqrt(6), sqrt7 = Math.sqrt(7), ?? = Math.asin(7 * Math.sin(??) / (3 * sqrt6));
    return [ sqrt6 * ?? * (2 * Math.cos(2 * ?? / 3) - 1) / sqrt7, 9 * Math.sin(?? / 3) / sqrt7 ];
  }
  mtFlatPolarParabolic.invert = function(x, y) {
    var sqrt6 = Math.sqrt(6), sqrt7 = Math.sqrt(7), ?? = 3 * asin(y * sqrt7 / 9);
    return [ x * sqrt7 / (sqrt6 * (2 * Math.cos(2 * ?? / 3) - 1)), asin(Math.sin(??) * 3 * sqrt6 / 7) ];
  };
  (d3.geo.mtFlatPolarParabolic = function() {
    return projection(mtFlatPolarParabolic);
  }).raw = mtFlatPolarParabolic;
  function mtFlatPolarQuartic(??, ??) {
    var k = (1 + Math.SQRT1_2) * Math.sin(??), ?? = ??;
    for (var i = 0, ??; i < 25; i++) {
      ?? -= ?? = (Math.sin(?? / 2) + Math.sin(??) - k) / (.5 * Math.cos(?? / 2) + Math.cos(??));
      if (Math.abs(??) < ??) break;
    }
    return [ ?? * (1 + 2 * Math.cos(??) / Math.cos(?? / 2)) / (3 * Math.SQRT2), 2 * Math.sqrt(3) * Math.sin(?? / 2) / Math.sqrt(2 + Math.SQRT2) ];
  }
  mtFlatPolarQuartic.invert = function(x, y) {
    var sin??_2 = y * Math.sqrt(2 + Math.SQRT2) / (2 * Math.sqrt(3)), ?? = 2 * asin(sin??_2);
    return [ 3 * Math.SQRT2 * x / (1 + 2 * Math.cos(??) / Math.cos(?? / 2)), asin((sin??_2 + Math.sin(??)) / (1 + Math.SQRT1_2)) ];
  };
  (d3.geo.mtFlatPolarQuartic = function() {
    return projection(mtFlatPolarQuartic);
  }).raw = mtFlatPolarQuartic;
  function mtFlatPolarSinusoidal(??, ??) {
    var A = Math.sqrt(6 / (4 + ??)), k = (1 + ?? / 4) * Math.sin(??), ?? = ?? / 2;
    for (var i = 0, ??; i < 25; i++) {
      ?? -= ?? = (?? / 2 + Math.sin(??) - k) / (.5 + Math.cos(??));
      if (Math.abs(??) < ??) break;
    }
    return [ A * (.5 + Math.cos(??)) * ?? / 1.5, A * ?? ];
  }
  mtFlatPolarSinusoidal.invert = function(x, y) {
    var A = Math.sqrt(6 / (4 + ??)), ?? = y / A;
    if (Math.abs(Math.abs(??) - half??) < ??) ?? = ?? < 0 ? -half?? : half??;
    return [ 1.5 * x / (A * (.5 + Math.cos(??))), asin((?? / 2 + Math.sin(??)) / (1 + ?? / 4)) ];
  };
  (d3.geo.mtFlatPolarSinusoidal = function() {
    return projection(mtFlatPolarSinusoidal);
  }).raw = mtFlatPolarSinusoidal;
  function naturalEarth(??, ??) {
    var ??2 = ?? * ??, ??4 = ??2 * ??2;
    return [ ?? * (.8707 - .131979 * ??2 + ??4 * (-.013791 + ??4 * (.003971 * ??2 - .001529 * ??4))), ?? * (1.007226 + ??2 * (.015085 + ??4 * (-.044475 + .028874 * ??2 - .005916 * ??4))) ];
  }
  naturalEarth.invert = function(x, y) {
    var ?? = y, i = 25, ??;
    do {
      var ??2 = ?? * ??, ??4 = ??2 * ??2;
      ?? -= ?? = (?? * (1.007226 + ??2 * (.015085 + ??4 * (-.044475 + .028874 * ??2 - .005916 * ??4))) - y) / (1.007226 + ??2 * (.015085 * 3 + ??4 * (-.044475 * 7 + .028874 * 9 * ??2 - .005916 * 11 * ??4)));
    } while (Math.abs(??) > ?? && --i > 0);
    return [ x / (.8707 + (??2 = ?? * ??) * (-.131979 + ??2 * (-.013791 + ??2 * ??2 * ??2 * (.003971 - .001529 * ??2)))), ?? ];
  };
  (d3.geo.naturalEarth = function() {
    return projection(naturalEarth);
  }).raw = naturalEarth;
  function nellHammer(??, ??) {
    return [ ?? * (1 + Math.cos(??)) / 2, 2 * (?? - Math.tan(?? / 2)) ];
  }
  nellHammer.invert = function(x, y) {
    var p = y / 2;
    for (var i = 0, ?? = Infinity; i < 10 && Math.abs(??) > ??; i++) {
      var c = Math.cos(y / 2);
      y -= ?? = (y - Math.tan(y / 2) - p) / (1 - .5 / (c * c));
    }
    return [ 2 * x / (1 + Math.cos(y)), y ];
  };
  (d3.geo.nellHammer = function() {
    return projection(nellHammer);
  }).raw = nellHammer;
  var pattersonK1 = 1.0148, pattersonK2 = .23185, pattersonK3 = -.14499, pattersonK4 = .02406, pattersonC1 = pattersonK1, pattersonC2 = 5 * pattersonK2, pattersonC3 = 7 * pattersonK3, pattersonC4 = 9 * pattersonK4, pattersonYmax = 1.790857183;
  function patterson(??, ??) {
    var ??2 = ?? * ??;
    return [ ??, ?? * (pattersonK1 + ??2 * ??2 * (pattersonK2 + ??2 * (pattersonK3 + pattersonK4 * ??2))) ];
  }
  patterson.invert = function(x, y) {
    if (y > pattersonYmax) y = pattersonYmax; else if (y < -pattersonYmax) y = -pattersonYmax;
    var yc = y, ??;
    do {
      var y2 = yc * yc;
      yc -= ?? = (yc * (pattersonK1 + y2 * y2 * (pattersonK2 + y2 * (pattersonK3 + pattersonK4 * y2))) - y) / (pattersonC1 + y2 * y2 * (pattersonC2 + y2 * (pattersonC3 + pattersonC4 * y2)));
    } while (Math.abs(??) > ??);
    return [ x, yc ];
  };
  (d3.geo.patterson = function() {
    return projection(patterson);
  }).raw = patterson;
  var peirceQuincuncialProjection = quincuncialProjection(guyou);
  (d3.geo.peirceQuincuncial = function() {
    return peirceQuincuncialProjection().quincuncial(true).rotate([ -90, -90, 45 ]).clipAngle(180 - 1e-6);
  }).raw = peirceQuincuncialProjection.raw;
  function polyconic(??, ??) {
    if (Math.abs(??) < ??) return [ ??, 0 ];
    var tan?? = Math.tan(??), k = ?? * Math.sin(??);
    return [ Math.sin(k) / tan??, ?? + (1 - Math.cos(k)) / tan?? ];
  }
  polyconic.invert = function(x, y) {
    if (Math.abs(y) < ??) return [ x, 0 ];
    var k = x * x + y * y, ?? = y * .5, i = 10, ??;
    do {
      var tan?? = Math.tan(??), sec?? = 1 / Math.cos(??), j = k - 2 * y * ?? + ?? * ??;
      ?? -= ?? = (tan?? * j + 2 * (?? - y)) / (2 + j * sec?? * sec?? + 2 * (?? - y) * tan??);
    } while (Math.abs(??) > ?? && --i > 0);
    tan?? = Math.tan(??);
    return [ (Math.abs(y) < Math.abs(?? + 1 / tan??) ? asin(x * tan??) : sgn(x) * (acos(Math.abs(x * tan??)) + half??)) / Math.sin(??), ?? ];
  };
  (d3.geo.polyconic = function() {
    return projection(polyconic);
  }).raw = polyconic;
  function rectangularPolyconic(??0) {
    var sin??0 = Math.sin(??0);
    function forward(??, ??) {
      var A = sin??0 ? Math.tan(?? * sin??0 / 2) / sin??0 : ?? / 2;
      if (!??) return [ 2 * A, -??0 ];
      var E = 2 * Math.atan(A * Math.sin(??)), cot?? = 1 / Math.tan(??);
      return [ Math.sin(E) * cot??, ?? + (1 - Math.cos(E)) * cot?? - ??0 ];
    }
    forward.invert = function(x, y) {
      if (Math.abs(y += ??0) < ??) return [ sin??0 ? 2 * Math.atan(sin??0 * x / 2) / sin??0 : x, 0 ];
      var k = x * x + y * y, ?? = 0, i = 10, ??;
      do {
        var tan?? = Math.tan(??), sec?? = 1 / Math.cos(??), j = k - 2 * y * ?? + ?? * ??;
        ?? -= ?? = (tan?? * j + 2 * (?? - y)) / (2 + j * sec?? * sec?? + 2 * (?? - y) * tan??);
      } while (Math.abs(??) > ?? && --i > 0);
      var E = x * (tan?? = Math.tan(??)), A = Math.tan(Math.abs(y) < Math.abs(?? + 1 / tan??) ? asin(E) * .5 : acos(E) * .5 + ?? / 4) / Math.sin(??);
      return [ sin??0 ? 2 * Math.atan(sin??0 * A) / sin??0 : 2 * A, ?? ];
    };
    return forward;
  }
  (d3.geo.rectangularPolyconic = function() {
    return parallel1Projection(rectangularPolyconic);
  }).raw = rectangularPolyconic;
  var robinsonConstants = [ [ .9986, -.062 ], [ 1, 0 ], [ .9986, .062 ], [ .9954, .124 ], [ .99, .186 ], [ .9822, .248 ], [ .973, .31 ], [ .96, .372 ], [ .9427, .434 ], [ .9216, .4958 ], [ .8962, .5571 ], [ .8679, .6176 ], [ .835, .6769 ], [ .7986, .7346 ], [ .7597, .7903 ], [ .7186, .8435 ], [ .6732, .8936 ], [ .6213, .9394 ], [ .5722, .9761 ], [ .5322, 1 ] ];
  robinsonConstants.forEach(function(d) {
    d[1] *= 1.0144;
  });
  function robinson(??, ??) {
    var i = Math.min(18, Math.abs(??) * 36 / ??), i0 = Math.floor(i), di = i - i0, ax = (k = robinsonConstants[i0])[0], ay = k[1], bx = (k = robinsonConstants[++i0])[0], by = k[1], cx = (k = robinsonConstants[Math.min(19, ++i0)])[0], cy = k[1], k;
    return [ ?? * (bx + di * (cx - ax) / 2 + di * di * (cx - 2 * bx + ax) / 2), (?? > 0 ? half?? : -half??) * (by + di * (cy - ay) / 2 + di * di * (cy - 2 * by + ay) / 2) ];
  }
  robinson.invert = function(x, y) {
    var yy = y / half??, ?? = yy * 90, i = Math.min(18, Math.abs(?? / 5)), i0 = Math.max(0, Math.floor(i));
    do {
      var ay = robinsonConstants[i0][1], by = robinsonConstants[i0 + 1][1], cy = robinsonConstants[Math.min(19, i0 + 2)][1], u = cy - ay, v = cy - 2 * by + ay, t = 2 * (Math.abs(yy) - by) / u, c = v / u, di = t * (1 - c * t * (1 - 2 * c * t));
      if (di >= 0 || i0 === 1) {
        ?? = (y >= 0 ? 5 : -5) * (di + i);
        var j = 50, ??;
        do {
          i = Math.min(18, Math.abs(??) / 5);
          i0 = Math.floor(i);
          di = i - i0;
          ay = robinsonConstants[i0][1];
          by = robinsonConstants[i0 + 1][1];
          cy = robinsonConstants[Math.min(19, i0 + 2)][1];
          ?? -= (?? = (y >= 0 ? half?? : -half??) * (by + di * (cy - ay) / 2 + di * di * (cy - 2 * by + ay) / 2) - y) * degrees;
        } while (Math.abs(??) > ??2 && --j > 0);
        break;
      }
    } while (--i0 >= 0);
    var ax = robinsonConstants[i0][0], bx = robinsonConstants[i0 + 1][0], cx = robinsonConstants[Math.min(19, i0 + 2)][0];
    return [ x / (bx + di * (cx - ax) / 2 + di * di * (cx - 2 * bx + ax) / 2), ?? * radians ];
  };
  (d3.geo.robinson = function() {
    return projection(robinson);
  }).raw = robinson;
  function satelliteVertical(P) {
    function forward(??, ??) {
      var cos?? = Math.cos(??), k = (P - 1) / (P - cos?? * Math.cos(??));
      return [ k * cos?? * Math.sin(??), k * Math.sin(??) ];
    }
    forward.invert = function(x, y) {
      var ??2 = x * x + y * y, ?? = Math.sqrt(??2), sinc = (P - Math.sqrt(1 - ??2 * (P + 1) / (P - 1))) / ((P - 1) / ?? + ?? / (P - 1));
      return [ Math.atan2(x * sinc, ?? * Math.sqrt(1 - sinc * sinc)), ?? ? asin(y * sinc / ??) : 0 ];
    };
    return forward;
  }
  function satellite(P, ??) {
    var vertical = satelliteVertical(P);
    if (!??) return vertical;
    var cos?? = Math.cos(??), sin?? = Math.sin(??);
    function forward(??, ??) {
      var coordinates = vertical(??, ??), y = coordinates[1], A = y * sin?? / (P - 1) + cos??;
      return [ coordinates[0] * cos?? / A, y / A ];
    }
    forward.invert = function(x, y) {
      var k = (P - 1) / (P - 1 - y * sin??);
      return vertical.invert(k * x, k * y * cos??);
    };
    return forward;
  }
  function satelliteProjection() {
    var P = 1.4, ?? = 0, m = projectionMutator(satellite), p = m(P, ??);
    p.distance = function(_) {
      if (!arguments.length) return P;
      return m(P = +_, ??);
    };
    p.tilt = function(_) {
      if (!arguments.length) return ?? * 180 / ??;
      return m(P, ?? = _ * ?? / 180);
    };
    return p;
  }
  (d3.geo.satellite = satelliteProjection).raw = satellite;
  function times(??, ??) {
    var t = Math.tan(?? / 2), s = Math.sin(?? / 4 * t);
    return [ ?? * (.74482 - .34588 * s * s), 1.70711 * t ];
  }
  times.invert = function(x, y) {
    var t = y / 1.70711, s = Math.sin(?? / 4 * t);
    return [ x / (.74482 - .34588 * s * s), 2 * Math.atan(t) ];
  };
  (d3.geo.times = function() {
    return projection(times);
  }).raw = times;
  function twoPointEquidistant(z0) {
    if (!z0) return d3.geo.azimuthalEquidistant.raw;
    var ??a = -z0 / 2, ??b = -??a, z02 = z0 * z0, tan??0 = Math.tan(??b), S = .5 / Math.sin(??b);
    function forward(??, ??) {
      var za = acos(Math.cos(??) * Math.cos(?? - ??a)), zb = acos(Math.cos(??) * Math.cos(?? - ??b)), ys = ?? < 0 ? -1 : 1;
      za *= za, zb *= zb;
      return [ (za - zb) / (2 * z0), ys * asqrt(4 * z02 * zb - (z02 - za + zb) * (z02 - za + zb)) / (2 * z0) ];
    }
    forward.invert = function(x, y) {
      var y2 = y * y, cosza = Math.cos(Math.sqrt(y2 + (t = x + ??a) * t)), coszb = Math.cos(Math.sqrt(y2 + (t = x + ??b) * t)), t, d;
      return [ Math.atan2(d = cosza - coszb, t = (cosza + coszb) * tan??0), (y < 0 ? -1 : 1) * acos(Math.sqrt(t * t + d * d) * S) ];
    };
    return forward;
  }
  function twoPointEquidistantProjection() {
    var points = [ [ 0, 0 ], [ 0, 0 ] ], m = projectionMutator(twoPointEquidistant), p = m(0), rotate = p.rotate;
    delete p.rotate;
    p.points = function(_) {
      if (!arguments.length) return points;
      points = _;
      var interpolate = d3.geo.interpolate(_[0], _[1]), origin = interpolate(.5), p = d3.geo.rotation([ -origin[0], -origin[1] ])(_[0]), b = interpolate.distance * .5, ?? = -asin(Math.sin(p[1] * radians) / Math.sin(b));
      if (p[0] > 0) ?? = ?? - ??;
      rotate.call(p, [ -origin[0], -origin[1], -?? * degrees ]);
      return m(b * 2);
    };
    return p;
  }
  (d3.geo.twoPointEquidistant = twoPointEquidistantProjection).raw = twoPointEquidistant;
  function twoPointAzimuthal(d) {
    var cosd = Math.cos(d);
    function forward(??, ??) {
      var coordinates = d3.geo.gnomonic.raw(??, ??);
      coordinates[0] *= cosd;
      return coordinates;
    }
    forward.invert = function(x, y) {
      return d3.geo.gnomonic.raw.invert(x / cosd, y);
    };
    return forward;
  }
  function twoPointAzimuthalProjection() {
    var points = [ [ 0, 0 ], [ 0, 0 ] ], m = projectionMutator(twoPointAzimuthal), p = m(0), rotate = p.rotate;
    delete p.rotate;
    p.points = function(_) {
      if (!arguments.length) return points;
      points = _;
      var interpolate = d3.geo.interpolate(_[0], _[1]), origin = interpolate(.5), p = d3.geo.rotation([ -origin[0], -origin[1] ])(_[0]), b = interpolate.distance * .5, ?? = -asin(Math.sin(p[1] * radians) / Math.sin(b));
      if (p[0] > 0) ?? = ?? - ??;
      rotate.call(p, [ -origin[0], -origin[1], -?? * degrees ]);
      return m(b);
    };
    return p;
  }
  (d3.geo.twoPointAzimuthal = twoPointAzimuthalProjection).raw = twoPointAzimuthal;
  function vanDerGrinten(??, ??) {
    if (Math.abs(??) < ??) return [ ??, 0 ];
    var sin?? = Math.abs(?? / half??), ?? = asin(sin??);
    if (Math.abs(??) < ?? || Math.abs(Math.abs(??) - half??) < ??) return [ 0, sgn(??) * ?? * Math.tan(?? / 2) ];
    var cos?? = Math.cos(??), A = Math.abs(?? / ?? - ?? / ??) / 2, A2 = A * A, G = cos?? / (sin?? + cos?? - 1), P = G * (2 / sin?? - 1), P2 = P * P, P2_A2 = P2 + A2, G_P2 = G - P2, Q = A2 + G;
    return [ sgn(??) * ?? * (A * G_P2 + Math.sqrt(A2 * G_P2 * G_P2 - P2_A2 * (G * G - P2))) / P2_A2, sgn(??) * ?? * (P * Q - A * Math.sqrt((A2 + 1) * P2_A2 - Q * Q)) / P2_A2 ];
  }
  vanDerGrinten.invert = function(x, y) {
    if (Math.abs(y) < ??) return [ x, 0 ];
    if (Math.abs(x) < ??) return [ 0, half?? * Math.sin(2 * Math.atan(y / ??)) ];
    var x2 = (x /= ??) * x, y2 = (y /= ??) * y, x2_y2 = x2 + y2, z = x2_y2 * x2_y2, c1 = -Math.abs(y) * (1 + x2_y2), c2 = c1 - 2 * y2 + x2, c3 = -2 * c1 + 1 + 2 * y2 + z, d = y2 / c3 + (2 * c2 * c2 * c2 / (c3 * c3 * c3) - 9 * c1 * c2 / (c3 * c3)) / 27, a1 = (c1 - c2 * c2 / (3 * c3)) / c3, m1 = 2 * Math.sqrt(-a1 / 3), ??1 = acos(3 * d / (a1 * m1)) / 3;
    return [ ?? * (x2_y2 - 1 + Math.sqrt(1 + 2 * (x2 - y2) + z)) / (2 * x), sgn(y) * ?? * (-m1 * Math.cos(??1 + ?? / 3) - c2 / (3 * c3)) ];
  };
  (d3.geo.vanDerGrinten = function() {
    return projection(vanDerGrinten);
  }).raw = vanDerGrinten;
  function vanDerGrinten2(??, ??) {
    if (Math.abs(??) < ??) return [ ??, 0 ];
    var sin?? = Math.abs(?? / half??), ?? = asin(sin??);
    if (Math.abs(??) < ?? || Math.abs(Math.abs(??) - half??) < ??) return [ 0, sgn(??) * ?? * Math.tan(?? / 2) ];
    var cos?? = Math.cos(??), A = Math.abs(?? / ?? - ?? / ??) / 2, A2 = A * A, x1 = cos?? * (Math.sqrt(1 + A2) - A * cos??) / (1 + A2 * sin?? * sin??);
    return [ sgn(??) * ?? * x1, sgn(??) * ?? * asqrt(1 - x1 * (2 * A + x1)) ];
  }
  vanDerGrinten2.invert = function(x, y) {
    if (!x) return [ 0, half?? * Math.sin(2 * Math.atan(y / ??)) ];
    var x1 = Math.abs(x / ??), A = (1 - x1 * x1 - (y /= ??) * y) / (2 * x1), A2 = A * A, B = Math.sqrt(A2 + 1);
    return [ sgn(x) * ?? * (B - A), sgn(y) * half?? * Math.sin(2 * Math.atan2(Math.sqrt((1 - 2 * A * x1) * (A + B) - x1), Math.sqrt(B + A + x1))) ];
  };
  (d3.geo.vanDerGrinten2 = function() {
    return projection(vanDerGrinten2);
  }).raw = vanDerGrinten2;
  function vanDerGrinten3(??, ??) {
    if (Math.abs(??) < ??) return [ ??, 0 ];
    var sin?? = ?? / half??, ?? = asin(sin??);
    if (Math.abs(??) < ?? || Math.abs(Math.abs(??) - half??) < ??) return [ 0, ?? * Math.tan(?? / 2) ];
    var A = (?? / ?? - ?? / ??) / 2, y1 = sin?? / (1 + Math.cos(??));
    return [ ?? * (sgn(??) * asqrt(A * A + 1 - y1 * y1) - A), ?? * y1 ];
  }
  vanDerGrinten3.invert = function(x, y) {
    if (!y) return [ x, 0 ];
    var y1 = y / ??, A = (?? * ?? * (1 - y1 * y1) - x * x) / (2 * ?? * x);
    return [ x ? ?? * (sgn(x) * Math.sqrt(A * A + 1) - A) : 0, half?? * Math.sin(2 * Math.atan(y1)) ];
  };
  (d3.geo.vanDerGrinten3 = function() {
    return projection(vanDerGrinten3);
  }).raw = vanDerGrinten3;
  function vanDerGrinten4(??, ??) {
    if (!??) return [ ??, 0 ];
    var ??0 = Math.abs(??);
    if (!?? || ??0 === half??) return [ 0, ?? ];
    var B = ??0 / half??, B2 = B * B, C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)), C2 = C * C, BC = B * C, B_C2 = B2 + C2 + 2 * BC, B_3C = B + 3 * C, ??0 = ?? / half??, ??1 = ??0 + 1 / ??0, D = sgn(Math.abs(??) - half??) * Math.sqrt(??1 * ??1 - 4), D2 = D * D, F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * (B_3C * B_3C + 4 * C2) + 12 * BC * C2 + 4 * C2 * C2), x1 = (D * (B_C2 + C2 - 1) + 2 * asqrt(F)) / (4 * B_C2 + D2);
    return [ sgn(??) * half?? * x1, sgn(??) * half?? * asqrt(1 + D * Math.abs(x1) - x1 * x1) ];
  }
  vanDerGrinten4.invert = function(x, y) {
    if (!x || !y) return [ x, y ];
    y /= ??;
    var x1 = sgn(x) * x / half??, D = (x1 * x1 - 1 + 4 * y * y) / Math.abs(x1), D2 = D * D, B = 2 * y, i = 50;
    do {
      var B2 = B * B, C = (8 * B - B2 * (B2 + 2) - 5) / (2 * B2 * (B - 1)), C_ = (3 * B - B2 * B - 10) / (2 * B2 * B), C2 = C * C, BC = B * C, B_C = B + C, B_C2 = B_C * B_C, B_3C = B + 3 * C, F = B_C2 * (B2 + C2 * D2 - 1) + (1 - B2) * (B2 * (B_3C * B_3C + 4 * C2) + C2 * (12 * BC + 4 * C2)), F_ = -2 * B_C * (4 * BC * C2 + (1 - 4 * B2 + 3 * B2 * B2) * (1 + C_) + C2 * (-6 + 14 * B2 - D2 + (-8 + 8 * B2 - 2 * D2) * C_) + BC * (-8 + 12 * B2 + (-10 + 10 * B2 - D2) * C_)), sqrtF = Math.sqrt(F), f = D * (B_C2 + C2 - 1) + 2 * sqrtF - x1 * (4 * B_C2 + D2), f_ = D * (2 * C * C_ + 2 * B_C * (1 + C_)) + F_ / sqrtF - 8 * B_C * (D * (-1 + C2 + B_C2) + 2 * sqrtF) * (1 + C_) / (D2 + 4 * B_C2);
      B -= ?? = f / f_;
    } while (?? > ?? && --i > 0);
    return [ sgn(x) * (Math.sqrt(D * D + 4) + D) * ?? / 4, half?? * B ];
  };
  (d3.geo.vanDerGrinten4 = function() {
    return projection(vanDerGrinten4);
  }).raw = vanDerGrinten4;
  var wagner4 = function() {
    var A = 4 * ?? + 3 * Math.sqrt(3), B = 2 * Math.sqrt(2 * ?? * Math.sqrt(3) / A);
    return mollweideBromley(B * Math.sqrt(3) / ??, B, A / 6);
  }();
  (d3.geo.wagner4 = function() {
    return projection(wagner4);
  }).raw = wagner4;
  function wagner6(??, ??) {
    return [ ?? * Math.sqrt(1 - 3 * ?? * ?? / (?? * ??)), ?? ];
  }
  wagner6.invert = function(x, y) {
    return [ x / Math.sqrt(1 - 3 * y * y / (?? * ??)), y ];
  };
  (d3.geo.wagner6 = function() {
    return projection(wagner6);
  }).raw = wagner6;
  function wagner7(??, ??) {
    var s = .90631 * Math.sin(??), c0 = Math.sqrt(1 - s * s), c1 = Math.sqrt(2 / (1 + c0 * Math.cos(?? /= 3)));
    return [ 2.66723 * c0 * c1 * Math.sin(??), 1.24104 * s * c1 ];
  }
  wagner7.invert = function(x, y) {
    var t1 = x / 2.66723, t2 = y / 1.24104, p = Math.sqrt(t1 * t1 + t2 * t2), c = 2 * asin(p / 2);
    return [ 3 * Math.atan2(x * Math.tan(c), 2.66723 * p), p && asin(y * Math.sin(c) / (1.24104 * .90631 * p)) ];
  };
  (d3.geo.wagner7 = function() {
    return projection(wagner7);
  }).raw = wagner7;
  function wiechel(??, ??) {
    var cos?? = Math.cos(??), sin?? = Math.cos(??) * cos??, sin1_?? = 1 - sin??, cos?? = Math.cos(?? = Math.atan2(Math.sin(??) * cos??, -Math.sin(??))), sin?? = Math.sin(??);
    cos?? = asqrt(1 - sin?? * sin??);
    return [ sin?? * cos?? - cos?? * sin1_??, -cos?? * cos?? - sin?? * sin1_?? ];
  }
  wiechel.invert = function(x, y) {
    var w = -.5 * (x * x + y * y), k = Math.sqrt(-w * (2 + w)), b = y * w + x * k, a = x * w - y * k, D = Math.sqrt(a * a + b * b);
    return [ Math.atan2(k * b, D * (1 + w)), D ? -asin(k * a / D) : 0 ];
  };
  (d3.geo.wiechel = function() {
    return projection(wiechel);
  }).raw = wiechel;
  function winkel3(??, ??) {
    var coordinates = aitoff(??, ??);
    return [ (coordinates[0] + ?? / half??) / 2, (coordinates[1] + ??) / 2 ];
  }
  winkel3.invert = function(x, y) {
    var ?? = x, ?? = y, i = 25;
    do {
      var cos?? = Math.cos(??), sin?? = Math.sin(??), sin_2?? = Math.sin(2 * ??), sin2?? = sin?? * sin??, cos2?? = cos?? * cos??, sin?? = Math.sin(??), cos??_2 = Math.cos(?? / 2), sin??_2 = Math.sin(?? / 2), sin2??_2 = sin??_2 * sin??_2, C = 1 - cos2?? * cos??_2 * cos??_2, E = C ? acos(cos?? * cos??_2) * Math.sqrt(F = 1 / C) : F = 0, F, fx = .5 * (2 * E * cos?? * sin??_2 + ?? / half??) - x, fy = .5 * (E * sin?? + ??) - y, ??x???? = .5 * F * (cos2?? * sin2??_2 + E * cos?? * cos??_2 * sin2??) + .5 / half??, ??x???? = F * (sin?? * sin_2?? / 4 - E * sin?? * sin??_2), ??y???? = .125 * F * (sin_2?? * sin??_2 - E * sin?? * cos2?? * sin??), ??y???? = .5 * F * (sin2?? * cos??_2 + E * sin2??_2 * cos??) + .5, denominator = ??x???? * ??y???? - ??y???? * ??x????, ???? = (fy * ??x???? - fx * ??y????) / denominator, ???? = (fx * ??y???? - fy * ??x????) / denominator;
      ?? -= ????, ?? -= ????;
    } while ((Math.abs(????) > ?? || Math.abs(????) > ??) && --i > 0);
    return [ ??, ?? ];
  };
  (d3.geo.winkel3 = function() {
    return projection(winkel3);
  }).raw = winkel3;
})();