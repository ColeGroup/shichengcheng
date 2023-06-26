/*!
 * maptalks.three v0.29.0
 * LICENSE : MIT
 * (c) 2016-2022 maptalks.org
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('three')) :
    typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'three'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.maptalks = global.maptalks || {}, global.maptalks, global.THREE));
})(this, (function (exports, maptalks, THREE) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    var maptalks__namespace = /*#__PURE__*/_interopNamespace(maptalks);
    var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

    /**
     * three api adapt
     */
    const REVISION = parseInt(THREE__namespace.REVISION.replace('dev', ''));
    //Three does not print version information now. Output the version of three to find compatibility problems
    console.log(`maptalks.three log: current three.js version is %c${REVISION}`, 'color:red;font-size: 16px;font-weight: bold;');
    /**
     *
     * @param {THREE.BufferGeometry} bufferGeomertry
     * @param {String} key
     * @param {*} value
     */
    function addAttribute(bufferGeomertry, key, value) {
        if (REVISION > 109) {
            bufferGeomertry.setAttribute(key, value);
        }
        else {
            bufferGeomertry.addAttribute(key, value);
        }
        return bufferGeomertry;
    }
    function setRaycasterLinePrecision(raycaster, linePrecision) {
        if (REVISION > 113) {
            raycaster.params.Line.threshold = linePrecision;
        }
        else {
            raycaster.linePrecision = linePrecision;
        }
    }
    function getVertexColors() {
        if (THREE__namespace.VertexColors) {
            return THREE__namespace.VertexColors;
        }
        return true;
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineSegmentsGeometry extends THREE__namespace.InstancedBufferGeometry {
        constructor() {
            super();
            this.isLineSegmentsGeometry = true;
            this.type = 'LineSegmentsGeometry';
            var positions = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0];
            var uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];
            var index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
            this.setIndex(index);
            addAttribute(this, 'position', new THREE__namespace.Float32BufferAttribute(positions, 3));
            addAttribute(this, 'uv', new THREE__namespace.Float32BufferAttribute(uvs, 2));
        }
        // THREE.InstancedBufferGeometry.call(this);
        // var plane = new THREE.BufferGeometry();
        // this.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // this.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        applyMatrix(matrix) {
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined) {
                matrix.applyToBufferAttribute(start);
                matrix.applyToBufferAttribute(end);
                start.data.needsUpdate = true;
            }
            if (this.boundingBox !== null) {
                this.computeBoundingBox();
            }
            if (this.boundingSphere !== null) {
                this.computeBoundingSphere();
            }
            return this;
        }
        setPositions(array) {
            var lineSegments;
            if (array instanceof Float32Array) {
                lineSegments = array;
            }
            else if (Array.isArray(array)) {
                lineSegments = new Float32Array(array);
            }
            var instanceBuffer = new THREE__namespace.InstancedInterleavedBuffer(lineSegments, 6, 1); // xyz, xyz
            addAttribute(this, 'instanceStart', new THREE__namespace.InterleavedBufferAttribute(instanceBuffer, 3, 0));
            addAttribute(this, 'instanceEnd', new THREE__namespace.InterleavedBufferAttribute(instanceBuffer, 3, 3));
            // this.addAttribute('instanceStart', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 0)); // xyz
            // this.addAttribute('instanceEnd', new THREE.InterleavedBufferAttribute(instanceBuffer, 3, 3)); // xyz
            //
            this.computeBoundingBox();
            this.computeBoundingSphere();
            return this;
        }
        setColors(array) {
            var colors;
            if (array instanceof Float32Array) {
                colors = array;
            }
            else if (Array.isArray(array)) {
                colors = new Float32Array(array);
            }
            var instanceColorBuffer = new THREE__namespace.InstancedInterleavedBuffer(colors, 6, 1); // rgb, rgb
            addAttribute(this, 'instanceColorStart', new THREE__namespace.InterleavedBufferAttribute(instanceColorBuffer, 3, 0));
            addAttribute(this, 'instanceColorEnd', new THREE__namespace.InterleavedBufferAttribute(instanceColorBuffer, 3, 3));
            // this.addAttribute('instanceColorStart', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 0)); // rgb
            // this.addAttribute('instanceColorEnd', new THREE.InterleavedBufferAttribute(instanceColorBuffer, 3, 3)); // rgb
            return this;
        }
        fromWireframeGeometry(geometry) {
            this.setPositions(geometry.attributes.position.array);
            return this;
        }
        fromEdgesGeometry(geometry) {
            this.setPositions(geometry.attributes.position.array);
            return this;
        }
        fromMesh(mesh) {
            this.fromWireframeGeometry(new THREE__namespace.WireframeGeometry(mesh.geometry));
            // set colors, maybe
            return this;
        }
        fromLineSegements(lineSegments) {
            var geometry = lineSegments.geometry;
            if (geometry.isGeometry) {
                this.setPositions(geometry.vertices);
            }
            else if (geometry.isBufferGeometry) {
                this.setPositions(geometry.position.array); // assumes non-indexed
            }
            // set colors, maybe
            return this;
        }
        computeBoundingBox() {
            var box = new THREE__namespace.Box3();
            if (this.boundingBox === null) {
                this.boundingBox = new THREE__namespace.Box3();
            }
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined && end !== undefined) {
                this.boundingBox.setFromBufferAttribute(start);
                box.setFromBufferAttribute(end);
                this.boundingBox.union(box);
            }
        }
        computeBoundingSphere() {
            var vector = new THREE__namespace.Vector3();
            if (this.boundingSphere === null) {
                this.boundingSphere = new THREE__namespace.Sphere();
            }
            if (this.boundingBox === null) {
                this.computeBoundingBox();
            }
            var start = this.attributes.instanceStart;
            var end = this.attributes.instanceEnd;
            if (start !== undefined && end !== undefined) {
                var center = this.boundingSphere.center;
                this.boundingBox.getCenter(center);
                var maxRadiusSq = 0;
                for (var i = 0, il = start.count; i < il; i++) {
                    vector.fromBufferAttribute(start, i);
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                    vector.fromBufferAttribute(end, i);
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                }
                this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
                if (isNaN(this.boundingSphere.radius)) {
                    console.error('THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.', this);
                }
            }
        }
        toJSON() {
            // todo
        }
        // clone: function () {
        //     // todo
        // },
        // eslint-disable-next-line no-unused-vars
        copy(source) {
            // todo
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     * parameters = {
     *  color: <hex>,
     *  linewidth: <float>,
     *  dashed: <boolean>,
     *  dashScale: <float>,
     *  dashSize: <float>,
     *  gapSize: <float>,
     *  resolution: <Vector2>, // to be set by renderer
     * }
     */
    const UniformsLib = {}, ShaderLib = {};
    UniformsLib.line = {
        linewidth: { value: 1 },
        resolution: { value: new THREE__namespace.Vector2(1, 1) },
        dashScale: { value: 1 },
        dashSize: { value: 1 },
        gapSize: { value: 1 } // todo FIX - maybe change to totalSize
    };
    ShaderLib['line'] = {
        uniforms: THREE__namespace.UniformsUtils.merge([
            THREE__namespace.UniformsLib.common,
            THREE__namespace.UniformsLib.fog,
            UniformsLib.line
        ]),
        vertexShader: `
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		varying vec2 vUv;

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			vUv = uv;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec2 ndcStart = clipStart.xy / clipStart.w;
			vec2 ndcEnd = clipEnd.xy / clipEnd.w;

			// direction
			vec2 dir = ndcEnd - ndcStart;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			// perpendicular to dir
			vec2 offset = vec2( dir.y, - dir.x );

			// undo aspect ratio adjustment
			dir.x /= aspect;
			offset.x /= aspect;

			// sign flip
			if ( position.x < 0.0 ) offset *= - 1.0;

			// endcaps
			if ( position.y < 0.0 ) {

				offset += - dir;

			} else if ( position.y > 1.0 ) {

				offset += dir;

			}

			// adjust for linewidth
			offset *= linewidth;

			// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
			offset /= resolution.y;

			// select end
			vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

			// back to clip space
			offset *= clip.w;

			clip.xy += offset;

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,
        fragmentShader: `
		uniform vec3 diffuse;
		uniform float opacity;

		#ifdef USE_DASH

			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		varying vec2 vUv;

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			if ( abs( vUv.y ) > 1.0 ) {

				float a = vUv.x;
				float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
				float len2 = a * a + b * b;

				if ( len2 > 1.0 ) discard;

			}

			vec4 diffuseColor = vec4( diffuse, opacity );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, diffuseColor.a );

			#include <premultiplied_alpha_fragment>
			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>

		}
		`
    };
    class LineMaterial extends THREE__namespace.ShaderMaterial {
        constructor(parameters) {
            super({
                uniforms: THREE__namespace.UniformsUtils.clone(ShaderLib['line'].uniforms),
                vertexShader: ShaderLib['line'].vertexShader,
                fragmentShader: ShaderLib['line'].fragmentShader
            });
            this.dashed = true;
            this.isLineMaterial = true;
            this.type = 'LineMaterial';
            Object.defineProperties(this, {
                color: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.diffuse.value;
                    },
                    set: function (value) {
                        this.uniforms.diffuse.value = value;
                    }
                },
                linewidth: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.linewidth.value;
                    },
                    set: function (value) {
                        this.uniforms.linewidth.value = value;
                    }
                },
                dashScale: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.dashScale.value;
                    },
                    set: function (value) {
                        this.uniforms.dashScale.value = value;
                    }
                },
                dashSize: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.dashSize.value;
                    },
                    set: function (value) {
                        this.uniforms.dashSize.value = value;
                    }
                },
                gapSize: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.gapSize.value;
                    },
                    set: function (value) {
                        this.uniforms.gapSize.value = value;
                    }
                },
                resolution: {
                    enumerable: true,
                    get: function () {
                        return this.uniforms.resolution.value;
                    },
                    set: function (value) {
                        this.uniforms.resolution.value.copy(value);
                    }
                }
            });
            this.setValues(parameters);
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineSegments2 extends THREE__namespace.Mesh {
        constructor(geometry, material) {
            super(geometry, material);
            this.isLineSegments2 = true;
            this.type = 'LineSegments2';
            this.geometry = geometry !== undefined ? geometry : new LineSegmentsGeometry();
            this.material = material !== undefined ? material : new LineMaterial({ color: Math.random() * 0xffffff });
        }
        computeLineDistances() {
            var start = new THREE__namespace.Vector3();
            var end = new THREE__namespace.Vector3();
            var geometry = this.geometry;
            var instanceStart = geometry.attributes.instanceStart;
            var instanceEnd = geometry.attributes.instanceEnd;
            if (!instanceStart || !instanceEnd) {
                return this;
            }
            var lineDistances = new Float32Array(2 * instanceStart.data.count);
            for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {
                start.fromBufferAttribute(instanceStart, i);
                end.fromBufferAttribute(instanceEnd, i);
                lineDistances[j] = (j === 0) ? 0 : lineDistances[j - 1];
                lineDistances[j + 1] = lineDistances[j] + start.distanceTo(end);
            }
            var instanceDistanceBuffer = new THREE__namespace.InstancedInterleavedBuffer(lineDistances, 2, 1); // d0, d1
            addAttribute(geometry, 'instanceDistanceStart', new THREE__namespace.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
            addAttribute(geometry, 'instanceDistanceEnd', new THREE__namespace.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
            // geometry.addAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)); // d0
            // geometry.addAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)); // d1
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class LineGeometry extends LineSegmentsGeometry {
        constructor() {
            super();
            this.isLineGeometry = true;
            this.type = 'LineGeometry';
        }
        fromLine(line) {
            var geometry = line.geometry;
            if (geometry.isGeometry) {
                this.setPositions(geometry.vertices);
            }
            else if (geometry.isBufferGeometry) {
                this.setPositions(geometry.position.array); // assumes non-indexed
            }
            return this;
        }
    }

    /**
     * @author WestLangley / http://github.com/WestLangley
     *
     */
    class Line2 extends LineSegments2 {
        constructor(geometry, material) {
            super(geometry, material);
            this.isLine2 = true;
            this.type = 'Line2';
            this.geometry = geometry !== undefined ? geometry : new LineGeometry();
            this.material = material !== undefined ? material : new LineMaterial({ color: Math.random() * 0xffffff });
        }
        copy(source) {
            return this;
        }
    }

    const OPTIONS$k = {
        interactive: true,
        altitude: 0,
        minZoom: 0,
        maxZoom: 30,
        asynchronous: false,
        bloom: false
    };
    /**
     * a Class for Eventable
     */
    function Base() {
    }
    // class Base {
    //     constructor() {
    //     }
    // }
    /**
     * EVENTS=[
     *  'add',
     *  'remove',
        'mousemove',
        'click',
        'mousedown',
        'mouseup',
        'dblclick',
        'contextmenu',
        'touchstart',
        'touchmove',
        'touchend',
        'mouseover',
        'mouseout',
        'idchange',
        'propertieschange',
        'show',
        'hide',
        'symbolchange'
         empty
    ];
     * This is the base class for all 3D objects
     *
     *
     * Its function and maptalks.geometry are as similar as possible
     *
     * maptalks.Eventable(Base) return a Class  https://github.com/maptalks/maptalks.js/blob/master/src/core/Eventable.js
     *
     */
    class BaseObject extends maptalks__namespace.Eventable(Base) {
        constructor(id) {
            super();
            this.isAdd = false;
            this._mouseover = false;
            this._visible = true;
            this._zoomVisible = true;
            this.picked = false;
            this.isBaseObject = true;
            if (id === undefined) {
                id = maptalks__namespace.Util.GUID();
            }
            this.id = id;
        }
        addTo(layer) {
            if (layer && layer.type === 'ThreeLayer') {
                layer.addMesh([this]);
            }
            else {
                console.error('layer only support maptalks.ThreeLayer');
            }
            return this;
        }
        remove() {
            const layer = this.getLayer();
            if (layer) {
                layer.removeMesh([this]);
            }
            return this;
        }
        getObject3d() {
            return this.object3d;
        }
        getId() {
            return this.id;
        }
        setId(id) {
            const oldId = this.getId();
            this.id = id;
            this._fire('idchange', {
                'old': oldId,
                'new': id,
                'target': this
            });
            return this;
        }
        getType() {
            return this.type;
        }
        getOptions() {
            return this.options;
        }
        getProperties() {
            return (this.options || {}).properties;
        }
        setProperties(property) {
            const old = Object.assign({}, this.getProperties());
            this.options.properties = property;
            this._fire('propertieschange', {
                'old': old,
                'new': property,
                'target': this
            });
            return this;
        }
        getLayer() {
            return this.options.layer;
        }
        // eslint-disable-next-line consistent-return
        getMap() {
            const layer = this.getLayer();
            if (layer) {
                return layer.getMap();
            }
        }
        // eslint-disable-next-line consistent-return
        getCenter() {
            const options = this.getOptions();
            const { coordinate, lineString, polygon } = options;
            if (coordinate) {
                return coordinate instanceof maptalks__namespace.Coordinate ? coordinate : new maptalks__namespace.Coordinate(coordinate);
            }
            else {
                const geometry = polygon || lineString;
                if (geometry && geometry.getCenter) {
                    return geometry.getCenter();
                }
            }
        }
        getAltitude() {
            return this.getOptions().altitude;
        }
        /**
         * Different objects need to implement their own methods
         * @param {*} altitude
         */
        setAltitude(altitude) {
            if (maptalks__namespace.Util.isNumber(altitude)) {
                const z = this.getLayer().altitudeToVector3(altitude, altitude).x;
                this.getObject3d().position.z = z;
                this.options.altitude = altitude;
                if (this.pickObject3d) {
                    this.pickObject3d.position.z = z;
                }
                //fix merged mesh
                if (this._baseObjects && Array.isArray(this._baseObjects)) {
                    for (let i = 0, len = this._baseObjects.length; i < len; i++) {
                        if (this._baseObjects[i]) {
                            this._baseObjects[i].getObject3d().position.z = z;
                        }
                    }
                }
            }
            return this;
        }
        supportHeight() {
            return this.getOptions().heightEnable;
        }
        getHeight() {
            const { height } = this.getOptions();
            return maptalks__namespace.Util.isNumber(height) ? height : 0;
        }
        setHeight(height) {
            if (!maptalks__namespace.Util.isNumber(height) || this._baseObjects || !this.supportHeight()) {
                return this;
            }
            const layer = this.getLayer();
            if (!layer) {
                return this;
            }
            const { geometry } = this.getObject3d();
            if (geometry instanceof THREE__namespace.BufferGeometry) {
                const { position } = geometry.attributes || {};
                if (!position) {
                    return this;
                }
                const array = position.array;
                let min = Infinity, max = -Infinity;
                for (let i = 0, len = array.length; i < len; i += 3) {
                    const z = array[i + 2];
                    min = Math.min(z, min);
                    max = Math.max(z, max);
                }
                const middle = (min + max) / 2;
                let z = layer.altitudeToVector3(height, height).x;
                // z>0
                z = Math.max(z, 0.000001);
                for (let i = 0, len = array.length; i < len; i += 3) {
                    if (array[i + 2] > middle) {
                        array[i + 2] = z;
                    }
                }
                geometry.attributes.position.needsUpdate = true;
                geometry.computeBoundingBox();
                geometry.computeBoundingSphere();
                this.getOptions().height = height;
            }
            return this;
        }
        show() {
            //  in zoom range
            if (this._zoomVisible) {
                this.getObject3d().visible = true;
                this._fire('show');
            }
            this._visible = true;
            return this;
        }
        hide() {
            this.getObject3d().visible = false;
            this._fire('hide');
            this._visible = false;
            return this;
        }
        isVisible() {
            return (!!this.getObject3d().visible);
        }
        /**
         *  Different objects need to implement their own methods
         */
        getSymbol() {
            return this.getObject3d().material;
        }
        /**
         *  Different objects need to implement their own methods
         * @param {*} material
         */
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                material.vertexColors = this.getObject3d().material.vertexColors;
                const old = this.getObject3d().material.clone();
                this.getObject3d().material = material;
                this._fire('symbolchange', {
                    'old': old,
                    'new': material,
                    'target': this
                });
            }
            return this;
        }
        setInfoWindow(options) {
            this.removeInfoWindow();
            this.infoWindow = new maptalks__namespace.ui.InfoWindow(options);
            this.infoWindow.addTo(this);
            return this;
        }
        getInfoWindow() {
            return this.infoWindow;
        }
        openInfoWindow(coordinate) {
            coordinate = coordinate || this.getCenter();
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            // eslint-disable-next-line no-unused-expressions
            (coordinate && this.infoWindow && this.infoWindow.show(coordinate));
            return this;
        }
        closeInfoWindow() {
            // eslint-disable-next-line no-unused-expressions
            (this.infoWindow && this.infoWindow.hide());
            return this;
        }
        removeInfoWindow() {
            // eslint-disable-next-line no-unused-expressions
            if (this.infoWindow) {
                this.infoWindow.remove();
                delete this.infoWindow;
            }
            return this;
        }
        setToolTip(content, options) {
            this.removeToolTip();
            this.toolTip = new maptalks__namespace.ui.ToolTip(content, options);
            this.toolTip.addTo(this);
            return this;
        }
        getToolTip() {
            return this.toolTip;
        }
        openToolTip(coordinate) {
            coordinate = coordinate || this.getCenter();
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            // eslint-disable-next-line no-unused-expressions
            (coordinate && this.toolTip && this.toolTip.show(coordinate));
            return this;
        }
        closeToolTip() {
            // eslint-disable-next-line no-unused-expressions
            (this.toolTip && this.toolTip.hide());
            return this;
        }
        removeToolTip() {
            // eslint-disable-next-line no-unused-expressions
            if (this.toolTip) {
                this.toolTip.remove();
                delete this.toolTip;
            }
            return this;
        }
        /**
         * different components should implement their own animation methods
         * @param {*} options
         * @param {*} cb
         */
        // eslint-disable-next-line no-unused-vars
        animateShow(options = {}, cb) {
            if (this._showPlayer) {
                this._showPlayer.cancel();
            }
            if (maptalks__namespace.Util.isFunction(options)) {
                options = {};
                cb = options;
            }
            const duration = options['duration'] || 1000, easing = options['easing'] || 'out';
            const player = this._showPlayer = maptalks__namespace.animation.Animation.animate({
                'scale': 1
            }, {
                'duration': duration,
                'easing': easing
            }, frame => {
                const scale = frame.styles.scale;
                if (scale > 0) {
                    this.getObject3d().scale.z = scale;
                }
                if (cb) {
                    cb(frame, scale);
                }
            });
            player.play();
            return player;
        }
        getMinZoom() {
            return this.getOptions().minZoom;
        }
        getMaxZoom() {
            return this.getOptions().maxZoom;
        }
        isAsynchronous() {
            return this.getOptions().asynchronous;
        }
        get bloom() {
            return this.getOptions().bloom;
        }
        fire(eventType, param) {
            this._fire(eventType, param);
            if (this._vt && this._vt.onSelectMesh) {
                this._vt.onSelectMesh(eventType, param);
            }
            return this;
        }
        config() {
            return this;
        }
        setPickObject3d(object3d) {
            this.pickObject3d = object3d;
            this.pickObject3d['__parent'] = this;
            return this;
        }
        /**
         * more method support
         * @param {*} options
         */
        /**
         *
         * @param {*} options
         */
        _initOptions(options) {
            this.options = maptalks__namespace.Util.extend({}, OPTIONS$k, options);
            return this;
        }
        _createMesh(geometry, material) {
            this.object3d = new THREE__namespace.Mesh(geometry, material);
            this.object3d['__parent'] = this;
            return this;
        }
        _createInstancedMesh(geometry, material, count) {
            this.object3d = new THREE__namespace.InstancedMesh(geometry, material, count);
            this.object3d['__parent'] = this;
            return this;
        }
        _createGroup() {
            this.object3d = new THREE__namespace.Group();
            this.object3d['__parent'] = this;
            return this;
        }
        _createLine(geometry, material) {
            this.object3d = new THREE__namespace.Line(geometry, material);
            // (this.object3d as THREE.Line).computeLineDistances();
            this._computeLineDistances(geometry);
            this.object3d['__parent'] = this;
            return this;
        }
        _createLine2(geometry, material) {
            this.object3d = new Line2(geometry, material);
            this.object3d.computeLineDistances();
            this.object3d['__parent'] = this;
            return this;
        }
        // eslint-disable-next-line no-unused-vars
        _createPoints(geometry, material) {
            //Serving for particles
            this.object3d = new THREE__namespace.Points(geometry, material);
            this.object3d['__parent'] = this;
            return this;
        }
        _createLineSegments(geometry, material) {
            this.object3d = new THREE__namespace.LineSegments(geometry, material);
            // (this.object3d as THREE.LineSegments).computeLineDistances();
            this._computeLineDistances(geometry);
            this.object3d['__parent'] = this;
            return this;
        }
        /**
         * rewrite three.js computeLineDistances ,1.7 speed
         * @param geometry
         */
        _computeLineDistances(geometry) {
            const position = geometry.attributes.position.array;
            const count = geometry.attributes.position.count;
            const lineDistances = new Float32Array(count);
            lineDistances[0] = 0;
            const start = new THREE__namespace.Vector3(0, 0, 0), end = new THREE__namespace.Vector3(0, 0, 0);
            for (let i = 1; i < count; i++) {
                const idx = (i - 1) * 3;
                start.x = position[idx];
                start.y = position[idx + 1];
                start.z = position[idx + 2];
                const idx1 = i * 3;
                end.x = position[idx1];
                end.y = position[idx1 + 1];
                end.z = position[idx1 + 2];
                const distance = end.distanceTo(start);
                lineDistances[i] = lineDistances[i - 1] + distance;
            }
            addAttribute(geometry, 'lineDistance', new THREE__namespace.BufferAttribute(lineDistances, 1));
        }
    }

    function mergeBufferGeometries(geometries) {
        const { position, normal, uv, indices } = mergeBufferGeometriesAttribute(geometries);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        const color = new Float32Array(position.length);
        color.fill(1, 0, position.length);
        addAttribute(bufferGeomertry, 'color', new THREE__namespace.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        if (uv && uv.length) {
            addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        }
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    function mergeBufferGeometriesAttribute(geometries) {
        const attributes = {}, attributesLen = {};
        for (let i = 0; i < geometries.length; ++i) {
            const geometry = geometries[i];
            for (const name in geometry) {
                if (attributes[name] === undefined) {
                    attributes[name] = [];
                    attributesLen[name] = 0;
                }
                attributes[name].push(geometry[name]);
                attributesLen[name] += geometry[name].length;
            }
        }
        // merge attributes
        const mergedGeometry = {};
        let indexOffset = 0;
        const mergedIndex = new Uint32Array(attributesLen['indices']);
        for (const name in attributes) {
            if (name === 'indices') {
                const indices = attributes[name];
                let iIndex = 0;
                for (let i = 0, len = indices.length; i < len; i++) {
                    const index = indices[i];
                    for (let j = 0, len1 = index.length; j < len1; j++) {
                        mergedIndex[iIndex] = index[j] + indexOffset;
                        iIndex++;
                        // mergedIndex.push(index[j] + indexOffset);
                    }
                    indexOffset += attributes['position'][i].length / 3;
                }
            }
            else {
                const mergedAttribute = mergeBufferAttributes(attributes[name], attributesLen[name]);
                if (!mergedAttribute)
                    return null;
                mergedGeometry[name] = mergedAttribute;
            }
        }
        mergedGeometry['indices'] = mergedIndex;
        return mergedGeometry;
    }
    function mergeBufferAttributes(attributes, arrayLength) {
        const array = new Float32Array(arrayLength);
        let offset = 0;
        for (let i = 0; i < attributes.length; ++i) {
            array.set(attributes[i], offset);
            offset += attributes[i].length;
        }
        return array;
    }
    function generateBufferGeometry(data) {
        //arraybuffer data
        const { position, normal, uv, indices } = data;
        // const color = new Float32Array(position.length);
        // color.fill(1, 0, position.length);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        // addAttribute(bufferGeomertry, 'color', new THREE.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(new Float32Array(normal), 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(position), 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(new Float32Array(uv), 2));
        bufferGeomertry.setIndex(new THREE__namespace.BufferAttribute(new Uint32Array(indices), 1));
        return bufferGeomertry;
    }
    function generatePickBufferGeometry(geometry) {
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'normal', geometry.getAttribute('normal'));
        addAttribute(bufferGeomertry, 'position', geometry.getAttribute('position').clone());
        bufferGeomertry.setIndex(geometry.getIndex());
        return bufferGeomertry;
    }
    let defaultBufferGeometry;
    function getDefaultBufferGeometry() {
        if (!defaultBufferGeometry) {
            const SIZE = 0.000001;
            defaultBufferGeometry = new THREE__namespace.BoxBufferGeometry(SIZE, SIZE, SIZE);
        }
        return defaultBufferGeometry;
    }
    getDefaultBufferGeometry();

    var MergeGeometryUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        mergeBufferGeometries: mergeBufferGeometries,
        mergeBufferGeometriesAttribute: mergeBufferGeometriesAttribute,
        generateBufferGeometry: generateBufferGeometry,
        generatePickBufferGeometry: generatePickBufferGeometry,
        getDefaultBufferGeometry: getDefaultBufferGeometry
    });

    const barGeometryCache = {};
    const defaultBoxGeometry = new THREE__namespace.BoxBufferGeometry(1, 1, 1);
    defaultBoxGeometry.translate(0, 0, 0.5);
    const topColor$1 = new THREE__namespace.Color('#fff'), bottomColor$1 = new THREE__namespace.Color('#fff');
    function getDefaultCylinderBufferGeometry(radialSegments = 6) {
        if (!barGeometryCache[radialSegments]) {
            const geometry = new THREE__namespace.CylinderBufferGeometry(1, 1, 1, radialSegments, 1);
            geometry.rotateX(Math.PI / 2);
            geometry.translate(0, 0, 0.5);
            geometry.rotateZ(Math.PI / 6);
            barGeometryCache[radialSegments] = geometry;
        }
        return barGeometryCache[radialSegments];
    }
    /**
     * Reuse Geometry   , Meter as unit
     * @param {*} property
     */
    // eslint-disable-next-line no-unused-vars
    function getGeometry(property) {
        const { height, radialSegments, radius } = property;
        const geometry = getDefaultCylinderBufferGeometry(radialSegments).clone();
        geometry.scale(radius, radius, height);
        return geometry;
    }
    /**
     * init Colors
     * @param {*} geometry
     * @param {*} color
     * @param {*} _topColor
     */
    function initVertexColors$1(geometry, color, _topColor, key = 'y', v = 0) {
        let offset = 0;
        if (key === 'y') {
            offset = 1;
        }
        else if (key === 'z') {
            offset = 2;
        }
        const position = geometry.attributes.position.array;
        const len = position.length;
        bottomColor$1.setStyle(color);
        topColor$1.setStyle(_topColor);
        const colors = new Float32Array(len);
        for (let i = 0; i < len; i += 3) {
            const y = position[i + offset];
            if (y > v) {
                colors[i] = topColor$1.r;
                colors[i + 1] = topColor$1.g;
                colors[i + 2] = topColor$1.b;
                // colors.push(topColor.r, topColor.g, topColor.b);
            }
            else {
                colors[i] = bottomColor$1.r;
                colors[i + 1] = bottomColor$1.g;
                colors[i + 2] = bottomColor$1.b;
                // colors.push(bottomColor.r, bottomColor.g, bottomColor.b);
            }
        }
        addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
        return colors;
    }
    function mergeBarGeometry(geometries) {
        const attributes = [];
        const len = geometries.length;
        let colorLen = 0;
        for (let i = 0; i < len; i++) {
            const { color } = geometries[i].attributes;
            if (color) {
                colorLen += color.array.length;
            }
        }
        const colors = new Float32Array(colorLen);
        let offset = 0;
        for (let i = 0, len = geometries.length; i < len; i++) {
            const { color, normal, position, uv } = geometries[i].attributes;
            const index = geometries[i].index;
            if (color) {
                colors.set(color.array, offset);
                offset += color.array.length;
                // for (let j = 0, len1 = color.array.length; j < len1; j++) {
                //     colors.push(color.array[j]);
                // }
            }
            attributes.push({
                // color: color.array,
                normal: normal.array,
                uv: uv.array,
                position: position.array,
                indices: index.array
            });
        }
        const bufferGeometry = mergeBufferGeometries(attributes);
        if (colors.length) {
            addAttribute(bufferGeometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            // for (let i = 0, len = colors.length; i < len; i++) {
            //     bufferGeometry.attributes.color.array[i] = colors[i];
            // }
        }
        for (let i = 0, len = geometries.length; i < len; i++) {
            geometries[i].dispose();
        }
        return bufferGeometry;
    }
    function getDefaultBoxGeometry() {
        return defaultBoxGeometry;
    }

    const OPTIONS$j = {
        radius: 10,
        height: 100,
        radialSegments: 6,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class Bar extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$j, options, { layer, coordinate });
            super();
            this._initOptions(options);
            const { height, radius, topColor, bottomColor, altitude } = options;
            options.height = layer.altitudeToVector3(height, height).x;
            options.radius = layer.distanceToVector3(radius, radius).x;
            // Meter as unit
            options['_radius'] = this.options['radius'];
            options['_height'] = this.options['height'];
            const geometry = getGeometry(options);
            if (topColor) {
                initVertexColors$1(geometry, bottomColor, topColor, 'z', options.height / 2);
                material.vertexColors = getVertexColors();
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Bar';
        }
    }

    /* eslint-disable indent */
    const TYPES = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];
    function getGeoJSONType(feature) {
        return feature.geometry ? feature.geometry.type : null;
    }
    function isGeoJSON(feature) {
        const type = getGeoJSONType(feature);
        if (type) {
            for (let i = 0, len = TYPES.length; i < len; i++) {
                if (TYPES[i] === type) {
                    return true;
                }
            }
        }
        return false;
    }
    function isGeoJSONPolygon(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[4] || type === TYPES[5])) {
            return true;
        }
        return false;
    }
    function isGeoJSONLine(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[2] || type === TYPES[3])) {
            return true;
        }
        return false;
    }
    function isGeoJSONPoint(feature) {
        const type = getGeoJSONType(feature);
        if (type && (type === TYPES[0] || type === TYPES[1])) {
            return true;
        }
        return false;
    }
    function isGeoJSONMulti(feature) {
        const type = getGeoJSONType(feature);
        if (type) {
            if (type.indexOf('Multi') > -1) {
                return true;
            }
        }
        return false;
    }
    function getGeoJSONCoordinates(feature) {
        return feature.geometry ? feature.geometry.coordinates : [];
    }
    function getGeoJSONCenter(feature, out) {
        const type = getGeoJSONType(feature);
        if (!type || !feature.geometry) {
            return null;
        }
        const geometry = feature.geometry;
        const coordinates = geometry.coordinates;
        if (!coordinates) {
            return null;
        }
        // const coords: Array<Array<number>> = [];
        let sumX = 0, sumY = 0, coordLen = 0;
        switch (type) {
            case 'Point': {
                sumX = coordinates[0];
                sumY = coordinates[1];
                // coords.push(coordinates as Array<number>);
                coordLen++;
                break;
            }
            case 'MultiPoint':
            case 'LineString': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    sumX += coordinates[i][0];
                    sumY += coordinates[i][1];
                    coordLen++;
                    // coords.push(coordinates[i] as Array<number>);
                }
                break;
            }
            case 'MultiLineString':
            case 'Polygon': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    for (let j = 0, len1 = coordinates[i].length; j < len1; j++) {
                        // coords.push((coordinates[i] as Array<Array<number>>)[j]);
                        sumX += coordinates[i][j][0];
                        sumY += coordinates[i][j][1];
                        coordLen++;
                    }
                }
                break;
            }
            case 'MultiPolygon': {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    for (let j = 0, len1 = coordinates[i].length; j < len1; j++) {
                        for (let m = 0, len2 = coordinates[i][j].length; m < len2; m++) {
                            // coords.push(((coordinates[i] as Array<Array<Array<number>>>)[j])[m]);
                            sumX += coordinates[i][j][m][0];
                            sumY += coordinates[i][j][m][1];
                            coordLen++;
                        }
                    }
                }
                break;
            }
        }
        const x = sumX / coordLen, y = sumY / coordLen;
        if (out) {
            out.x = x;
            out.y = y;
            return out;
        }
        return new maptalks__namespace.Coordinate(x, y);
    }
    function spliteGeoJSONMulti(feature) {
        const type = getGeoJSONType(feature);
        if (!type || !feature.geometry) {
            return null;
        }
        const geometry = feature.geometry;
        const properties = feature.properties || {};
        const coordinates = geometry.coordinates;
        if (!coordinates) {
            return null;
        }
        const features = [];
        let fType;
        switch (type) {
            case 'MultiPoint': {
                fType = 'Point';
                break;
            }
            case 'MultiLineString': {
                fType = 'LineString';
                break;
            }
            case 'MultiPolygon': {
                fType = 'Polygon';
                break;
            }
        }
        if (fType) {
            for (let i = 0, len = coordinates.length; i < len; i++) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: fType,
                        coordinates: coordinates[i]
                    },
                    properties
                });
            }
        }
        else {
            features.push(feature);
        }
        return features;
    }

    var GeoJSONUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isGeoJSON: isGeoJSON,
        isGeoJSONPolygon: isGeoJSONPolygon,
        isGeoJSONLine: isGeoJSONLine,
        isGeoJSONPoint: isGeoJSONPoint,
        isGeoJSONMulti: isGeoJSONMulti,
        getGeoJSONCoordinates: getGeoJSONCoordinates,
        getGeoJSONCenter: getGeoJSONCenter,
        spliteGeoJSONMulti: spliteGeoJSONMulti
    });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var polyExtrude$2 = {exports: {}};

    /*!
     * poly-extrude v0.0.7
      */

    (function (module, exports) {
    (function (global, factory) {
        factory(exports) ;
    })(commonjsGlobal, (function (exports) {
        var earcut$2 = {exports: {}};

        earcut$2.exports = earcut;

        earcut$2.exports["default"] = earcut;

        function earcut(data, holeIndices, dim) {
          dim = dim || 2;
          var hasHoles = holeIndices && holeIndices.length,
              outerLen = hasHoles ? holeIndices[0] * dim : data.length,
              outerNode = linkedList(data, 0, outerLen, dim, true),
              triangles = [];
          if (!outerNode || outerNode.next === outerNode.prev) return triangles;
          var minX, minY, maxX, maxY, x, y, invSize;
          if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim); // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox

          if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
              x = data[i];
              y = data[i + 1];
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            } // minX, minY and invSize are later used to transform coords into integers for z-order calculation


            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
          }

          earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
          return triangles;
        } // create a circular doubly linked list from polygon points in the specified winding order


        function linkedList(data, start, end, dim, clockwise) {
          var i, last;

          if (clockwise === signedArea(data, start, end, dim) > 0) {
            for (i = start; i < end; i += dim) {
              last = insertNode(i, data[i], data[i + 1], last);
            }
          } else {
            for (i = end - dim; i >= start; i -= dim) {
              last = insertNode(i, data[i], data[i + 1], last);
            }
          }

          if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
          }

          return last;
        } // eliminate colinear or duplicate points


        function filterPoints(start, end) {
          if (!start) return start;
          if (!end) end = start;
          var p = start,
              again;

          do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
              removeNode(p);
              p = end = p.prev;
              if (p === p.next) break;
              again = true;
            } else {
              p = p.next;
            }
          } while (again || p !== end);

          return end;
        } // main ear slicing loop which triangulates a polygon (given as a linked list)


        function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
          if (!ear) return; // interlink polygon nodes in z-order

          if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
          var stop = ear,
              prev,
              next; // iterate through ears, slicing them one by one

          while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
              // cut off the triangle
              triangles.push(prev.i / dim);
              triangles.push(ear.i / dim);
              triangles.push(next.i / dim);
              removeNode(ear); // skipping the next vertex leads to less sliver triangles

              ear = next.next;
              stop = next.next;
              continue;
            }

            ear = next; // if we looped through the whole remaining polygon and can't find any more ears

            if (ear === stop) {
              // try filtering points and slicing again
              if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1); // if this didn't work, try curing all small self-intersections locally
              } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2); // as a last resort, try splitting the remaining polygon into two
              } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
              }

              break;
            }
          }
        } // check whether a polygon node forms a valid ear with adjacent nodes


        function isEar(ear) {
          var a = ear.prev,
              b = ear,
              c = ear.next;
          if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
          // now make sure we don't have other points inside the potential ear

          var p = ear.next.next;

          while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
          }

          return true;
        }

        function isEarHashed(ear, minX, minY, invSize) {
          var a = ear.prev,
              b = ear,
              c = ear.next;
          if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
          // triangle bbox; min & max are calculated like this for speed

          var minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x,
              minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y,
              maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x,
              maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y; // z-order range for the current triangle bbox;

          var minZ = zOrder(minTX, minTY, minX, minY, invSize),
              maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
          var p = ear.prevZ,
              n = ear.nextZ; // look for points inside the triangle in both directions

          while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
            if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
          } // look for remaining points in decreasing z-order


          while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
          } // look for remaining points in increasing z-order


          while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
          }

          return true;
        } // go through all polygon nodes and cure small local self-intersections


        function cureLocalIntersections(start, triangles, dim) {
          var p = start;

          do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
              triangles.push(a.i / dim);
              triangles.push(p.i / dim);
              triangles.push(b.i / dim); // remove two nodes involved

              removeNode(p);
              removeNode(p.next);
              p = start = b;
            }

            p = p.next;
          } while (p !== start);

          return filterPoints(p);
        } // try splitting polygon into two and triangulate them independently


        function splitEarcut(start, triangles, dim, minX, minY, invSize) {
          // look for a valid diagonal that divides the polygon into two
          var a = start;

          do {
            var b = a.next.next;

            while (b !== a.prev) {
              if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b); // filter colinear points around the cuts

                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next); // run earcut on each half

                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
              }

              b = b.next;
            }

            a = a.next;
          } while (a !== start);
        } // link every hole into the outer loop, producing a single-ring polygon without holes


        function eliminateHoles(data, holeIndices, outerNode, dim) {
          var queue = [],
              i,
              len,
              start,
              end,
              list;

          for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
          }

          queue.sort(compareX); // process holes from left to right

          for (i = 0; i < queue.length; i++) {
            outerNode = eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
          }

          return outerNode;
        }

        function compareX(a, b) {
          return a.x - b.x;
        } // find a bridge between vertices that connects hole with an outer ring and and link it


        function eliminateHole(hole, outerNode) {
          var bridge = findHoleBridge(hole, outerNode);

          if (!bridge) {
            return outerNode;
          }

          var bridgeReverse = splitPolygon(bridge, hole); // filter collinear points around the cuts

          var filteredBridge = filterPoints(bridge, bridge.next);
          filterPoints(bridgeReverse, bridgeReverse.next); // Check if input node was removed by the filtering

          return outerNode === bridge ? filteredBridge : outerNode;
        } // David Eberly's algorithm for finding a bridge between hole and outer polygon


        function findHoleBridge(hole, outerNode) {
          var p = outerNode,
              hx = hole.x,
              hy = hole.y,
              qx = -Infinity,
              m; // find a segment intersected by a ray from the hole's leftmost point to the left;
          // segment's endpoint with lesser x will be potential connection point

          do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
              var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);

              if (x <= hx && x > qx) {
                qx = x;

                if (x === hx) {
                  if (hy === p.y) return p;
                  if (hy === p.next.y) return p.next;
                }

                m = p.x < p.next.x ? p : p.next;
              }
            }

            p = p.next;
          } while (p !== outerNode);

          if (!m) return null;
          if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint
          // look for points inside the triangle of hole point, segment intersection and endpoint;
          // if there are no points found, we have a valid connection;
          // otherwise choose the point of the minimum angle with the ray as connection point

          var stop = m,
              mx = m.x,
              my = m.y,
              tanMin = Infinity,
              tan;
          p = m;

          do {
            if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
              tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

              if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
                m = p;
                tanMin = tan;
              }
            }

            p = p.next;
          } while (p !== stop);

          return m;
        } // whether sector in vertex m contains sector in vertex p in the same coordinates


        function sectorContainsSector(m, p) {
          return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
        } // interlink polygon nodes in z-order


        function indexCurve(start, minX, minY, invSize) {
          var p = start;

          do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
          } while (p !== start);

          p.prevZ.nextZ = null;
          p.prevZ = null;
          sortLinked(p);
        } // Simon Tatham's linked list merge sort algorithm
        // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html


        function sortLinked(list) {
          var i,
              p,
              q,
              e,
              tail,
              numMerges,
              pSize,
              qSize,
              inSize = 1;

          do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
              numMerges++;
              q = p;
              pSize = 0;

              for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
              }

              qSize = inSize;

              while (pSize > 0 || qSize > 0 && q) {
                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                  e = p;
                  p = p.nextZ;
                  pSize--;
                } else {
                  e = q;
                  q = q.nextZ;
                  qSize--;
                }

                if (tail) tail.nextZ = e;else list = e;
                e.prevZ = tail;
                tail = e;
              }

              p = q;
            }

            tail.nextZ = null;
            inSize *= 2;
          } while (numMerges > 1);

          return list;
        } // z-order of a point given coords and inverse of the longer side of data bbox


        function zOrder(x, y, minX, minY, invSize) {
          // coords are transformed into non-negative 15-bit integer range
          x = 32767 * (x - minX) * invSize;
          y = 32767 * (y - minY) * invSize;
          x = (x | x << 8) & 0x00FF00FF;
          x = (x | x << 4) & 0x0F0F0F0F;
          x = (x | x << 2) & 0x33333333;
          x = (x | x << 1) & 0x55555555;
          y = (y | y << 8) & 0x00FF00FF;
          y = (y | y << 4) & 0x0F0F0F0F;
          y = (y | y << 2) & 0x33333333;
          y = (y | y << 1) & 0x55555555;
          return x | y << 1;
        } // find the leftmost node of a polygon ring


        function getLeftmost(start) {
          var p = start,
              leftmost = start;

          do {
            if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
            p = p.next;
          } while (p !== start);

          return leftmost;
        } // check if a point lies within a convex triangle


        function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
          return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
        } // check if a diagonal between two polygon nodes is valid (lies in polygon interior)


        function isValidDiagonal(a, b) {
          return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && ( // dones't intersect other edges
          locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && ( // locally visible
          area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
          equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
        } // signed area of a triangle


        function area(p, q, r) {
          return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        } // check if two points are equal


        function equals(p1, p2) {
          return p1.x === p2.x && p1.y === p2.y;
        } // check if two segments intersect


        function intersects(p1, q1, p2, q2) {
          var o1 = sign(area(p1, q1, p2));
          var o2 = sign(area(p1, q1, q2));
          var o3 = sign(area(p2, q2, p1));
          var o4 = sign(area(p2, q2, q1));
          if (o1 !== o2 && o3 !== o4) return true; // general case

          if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1

          if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1

          if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2

          if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

          return false;
        } // for collinear points p, q, r, check if point q lies on segment pr


        function onSegment(p, q, r) {
          return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
        }

        function sign(num) {
          return num > 0 ? 1 : num < 0 ? -1 : 0;
        } // check if a polygon diagonal intersects any polygon segments


        function intersectsPolygon(a, b) {
          var p = a;

          do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
            p = p.next;
          } while (p !== a);

          return false;
        } // check if a polygon diagonal is locally inside the polygon


        function locallyInside(a, b) {
          return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
        } // check if the middle point of a polygon diagonal is inside the polygon


        function middleInside(a, b) {
          var p = a,
              inside = false,
              px = (a.x + b.x) / 2,
              py = (a.y + b.y) / 2;

          do {
            if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
            p = p.next;
          } while (p !== a);

          return inside;
        } // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
        // if one belongs to the outer ring and another to a hole, it merges it into a single ring


        function splitPolygon(a, b) {
          var a2 = new Node(a.i, a.x, a.y),
              b2 = new Node(b.i, b.x, b.y),
              an = a.next,
              bp = b.prev;
          a.next = b;
          b.prev = a;
          a2.next = an;
          an.prev = a2;
          b2.next = a2;
          a2.prev = b2;
          bp.next = b2;
          b2.prev = bp;
          return b2;
        } // create a node and optionally link it with previous one (in a circular doubly linked list)


        function insertNode(i, x, y, last) {
          var p = new Node(i, x, y);

          if (!last) {
            p.prev = p;
            p.next = p;
          } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
          }

          return p;
        }

        function removeNode(p) {
          p.next.prev = p.prev;
          p.prev.next = p.next;
          if (p.prevZ) p.prevZ.nextZ = p.nextZ;
          if (p.nextZ) p.nextZ.prevZ = p.prevZ;
        }

        function Node(i, x, y) {
          // vertex index in coordinates array
          this.i = i; // vertex coordinates

          this.x = x;
          this.y = y; // previous and next vertex nodes in a polygon ring

          this.prev = null;
          this.next = null; // z-order curve value

          this.z = null; // previous and next nodes in z-order

          this.prevZ = null;
          this.nextZ = null; // indicates whether this is a steiner point

          this.steiner = false;
        } // return a percentage difference between the polygon area and its triangulation area;
        // used to verify correctness of triangulation


        earcut.deviation = function (data, holeIndices, dim, triangles) {
          var hasHoles = holeIndices && holeIndices.length;
          var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
          var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));

          if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
              var start = holeIndices[i] * dim;
              var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
              polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
          }

          var trianglesArea = 0;

          for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
          }

          return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
        };

        function signedArea(data, start, end, dim) {
          var sum = 0;

          for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
          }

          return sum;
        } // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts


        earcut.flatten = function (data) {
          var dim = data[0][0].length,
              result = {
            vertices: [],
            holes: [],
            dimensions: dim
          },
              holeIndex = 0;

          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
              for (var d = 0; d < dim; d++) {
                result.vertices.push(data[i][j][d]);
              }
            }

            if (i > 0) {
              holeIndex += data[i - 1].length;
              result.holes.push(holeIndex);
            }
          }

          return result;
        };

        var earcut$1 = earcut$2.exports;

        /**
         * https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-clockwise/index.ts
         * @param {*} ring
         * @returns
         */
        function isClockwise(ring) {
          var sum = 0;
          var i = 1;
          var prev;
          var cur;
          var len = ring.length;

          while (i < len) {
            prev = cur || ring[0];
            cur = ring[i];
            sum += (cur[0] - prev[0]) * (cur[1] + prev[1]);
            i++;
          }

          return sum > 0;
        }

        function v3Sub(out, v1, v2) {
          out[0] = v1[0] - v2[0];
          out[1] = v1[1] - v2[1];
          out[2] = v1[2] - v2[2];
          return out;
        }

        function v3Normalize(out, v) {
          var x = v[0];
          var y = v[1];
          var z = v[2];
          var d = Math.sqrt(x * x + y * y + z * z) || 1;
          out[0] = x / d;
          out[1] = y / d;
          out[2] = z / d;
          return out;
        }

        function v3Cross(out, v1, v2) {
          var ax = v1[0],
              ay = v1[1],
              az = v1[2],
              bx = v2[0],
              by = v2[1],
              bz = v2[2];
          out[0] = ay * bz - az * by;
          out[1] = az * bx - ax * bz;
          out[2] = ax * by - ay * bx;
          return out;
        }

        function generateNormal(indices, position) {
          function v3Set(p, a, b, c) {
            p[0] = a;
            p[1] = b;
            p[2] = c;
          }

          var p1 = [];
          var p2 = [];
          var p3 = [];
          var v21 = [];
          var v32 = [];
          var n = [];
          var len = indices.length;
          var normals = new Float32Array(position.length);
          var f = 0;

          while (f < len) {
            // const i1 = indices[f++] * 3;
            // const i2 = indices[f++] * 3;
            // const i3 = indices[f++] * 3;
            // const i1 = indices[f];
            // const i2 = indices[f + 1];
            // const i3 = indices[f + 2];
            var a = indices[f],
                b = indices[f + 1],
                c = indices[f + 2];
            var i1 = a * 3,
                i2 = b * 3,
                i3 = c * 3;
            v3Set(p1, position[i1], position[i1 + 1], position[i1 + 2]);
            v3Set(p2, position[i2], position[i2 + 1], position[i2 + 2]);
            v3Set(p3, position[i3], position[i3 + 1], position[i3 + 2]);
            v3Sub(v32, p3, p2);
            v3Sub(v21, p1, p2);
            v3Cross(n, v32, v21); // Already be weighted by the triangle area

            for (var _i = 0; _i < 3; _i++) {
              normals[i1 + _i] += n[_i];
              normals[i2 + _i] += n[_i];
              normals[i3 + _i] += n[_i];
            }

            f += 3;
          }

          var i = 0;
          var l = normals.length;

          while (i < l) {
            v3Set(n, normals[i], normals[i + 1], normals[i + 2]);
            v3Normalize(n, n);
            normals[i] = n[0] || 0;
            normals[i + 1] = n[1] || 0;
            normals[i + 2] = n[2] || 0;
            i += 3;
          }

          return normals;
        }
        function merge(results) {
          if (results.length === 1) {
            var _result = {
              position: results[0].position,
              normal: results[0].normal,
              uv: results[0].uv,
              indices: results[0].indices,
              results: results
            };
            return _result;
          }

          var plen = 0,
              ilen = 0;

          for (var i = 0, len = results.length; i < len; i++) {
            var _results$i = results[i],
                position = _results$i.position,
                indices = _results$i.indices;
            plen += position.length;
            ilen += indices.length;
          }

          var result = {
            position: new Float32Array(plen),
            normal: new Float32Array(plen),
            uv: new Float32Array(plen / 3 * 2),
            indices: new Uint32Array(ilen),
            results: results
          };
          var pOffset = 0,
              pCount = 0,
              iIdx = 0,
              uvOffset = 0;

          for (var _i2 = 0, _len = results.length; _i2 < _len; _i2++) {
            var _results$_i = results[_i2],
                _position = _results$_i.position,
                _indices = _results$_i.indices,
                normal = _results$_i.normal,
                uv = _results$_i.uv;
            result.position.set(_position, pOffset);
            result.normal.set(normal, pOffset);
            result.uv.set(uv, uvOffset);
            var j = 0;
            var len1 = _indices.length;

            while (j < len1) {
              var pIndex = _indices[j] + pCount;
              result.indices[iIdx] = pIndex;
              iIdx++;
              j++;
            }

            uvOffset += uv.length;
            pOffset += _position.length;
            pCount += _position.length / 3;
          }

          return result;
        }
        function radToDeg(rad) {
          return rad * 180 / Math.PI;
        }
        function degToRad(angle) {
          return angle / 180 * Math.PI;
        } // https://github.com/mrdoob/three.js/blob/16f13e3b07e31d0e9a00df7c3366bbe0e464588c/src/geometries/ExtrudeGeometry.js?_pjax=%23js-repo-pjax-container#L736

        function generateSideWallUV(uvs, vertices, indexA, indexB, indexC, indexD) {
          var idx1 = indexA * 3,
              idx2 = indexB * 3,
              idx3 = indexC * 3,
              idx4 = indexD * 3;
          var a_x = vertices[idx1];
          var a_y = vertices[idx1 + 1];
          var a_z = vertices[idx1 + 2];
          var b_x = vertices[idx2];
          var b_y = vertices[idx2 + 1];
          var b_z = vertices[idx2 + 2];
          var c_x = vertices[idx3];
          var c_y = vertices[idx3 + 1];
          var c_z = vertices[idx3 + 2];
          var d_x = vertices[idx4];
          var d_y = vertices[idx4 + 1];
          var d_z = vertices[idx4 + 2];

          if (Math.abs(a_y - b_y) < Math.abs(a_x - b_x)) {
            uvs.push(a_x, 1 - a_z);
            uvs.push(b_x, 1 - b_z);
            uvs.push(c_x, 1 - c_z);
            uvs.push(d_x, 1 - d_z);
          } else {
            uvs.push(a_y, 1 - a_z);
            uvs.push(b_y, 1 - b_z);
            uvs.push(c_y, 1 - c_z);
            uvs.push(d_y, 1 - d_z);
          }
        }

        function extrudePolygons(polygons, options) {
          options = Object.assign({}, {
            depth: 2
          }, options);
          var results = polygons.map(function (polygon) {
            for (var i = 0, len = polygon.length; i < len; i++) {
              var ring = polygon[i];
              validateRing(ring);

              if (i === 0) {
                if (!isClockwise(ring)) {
                  polygon[i] = ring.reverse();
                }
              } else if (isClockwise(ring)) {
                polygon[i] = ring.reverse();
              }

              if (isClosedRing(ring)) {
                ring.splice(ring.length - 1, 1);
              }
            }

            var result = flatVertices(polygon, options);
            result.polygon = polygon;
            var triangles = earcut$1(result.flatVertices, result.holes, 2);
            generateTopAndBottom$1(result, triangles);
            generateSides$1(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.index);
            result.uv = new Float32Array(result.uvs);
            result.normal = generateNormal(result.indices, result.position);
            return result;
          });
          var result = merge(results);
          result.polygons = polygons;
          return result;
        }

        function generateTopAndBottom$1(result, triangles) {
          var index = [];
          var count = result.count;

          for (var i = 0, len = triangles.length; i < len; i += 3) {
            // top
            var a = triangles[i],
                b = triangles[i + 1],
                c = triangles[i + 2];
            index[i] = a;
            index[i + 1] = b;
            index[i + 2] = c; // bottom

            var idx = len + i;
            var a1 = count + a,
                b1 = count + b,
                c1 = count + c;
            index[idx] = a1;
            index[idx + 1] = b1;
            index[idx + 2] = c1;
          }

          result.index = index;
        }

        function generateSides$1(result, options) {
          var points = result.points,
              index = result.index,
              polygon = result.polygon,
              uvs = result.uvs;
          var z = options.depth;

          for (var i = 0, len = polygon.length; i < len; i++) {
            var ring = polygon[i];
            var j = 0;
            var len1 = ring.length;

            while (j < len1) {
              var v1 = ring[j];
              var v2 = ring[j + 1];

              if (j === len1 - 1) {
                v2 = ring[0];
              }

              var idx = points.length / 3;
              var x1 = v1[0],
                  y1 = v1[1],
                  x2 = v2[0],
                  y2 = v2[1];
              points.push(x1, y1, z, x2, y2, z, x1, y1, 0, x2, y2, 0);
              var a = idx + 2,
                  b = idx + 3,
                  c = idx,
                  d = idx + 1; // points.push(p3, p4, p1, p2);

              index.push(a, c, b, c, d, b); // index.push(c, d, b);

              generateSideWallUV(uvs, points, a, b, c, d);
              j++;
            }
          }
        }

        function calPolygonPointsCount(polygon) {
          var count = 0;
          var i = 0;
          var len = polygon.length;

          while (i < len) {
            count += polygon[i].length;
            i++;
          }

          return count;
        }

        function flatVertices(polygon, options) {
          var count = calPolygonPointsCount(polygon);
          var len = polygon.length;
          var holes = [],
              flatVertices = new Float32Array(count * 2),
              points = [],
              uvs = [];
          var pOffset = count * 3,
              uOffset = count * 2;
          var z = options.depth;
          var idx0 = 0,
              idx1 = 0,
              idx2 = 0;

          for (var i = 0; i < len; i++) {
            var ring = polygon[i];

            if (i > 0) {
              holes.push(idx0 / 2);
            }

            var j = 0;
            var len1 = ring.length;

            while (j < len1) {
              var c = ring[j];
              var x = c[0],
                  y = c[1];
              flatVertices[idx0++] = x;
              flatVertices[idx0++] = y; // top vertices

              points[idx1] = x;
              points[idx1 + 1] = y;
              points[idx1 + 2] = z; // bottom vertices

              points[pOffset + idx1] = x;
              points[pOffset + idx1 + 1] = y;
              points[pOffset + idx1 + 2] = 0;
              uvs[idx2] = x;
              uvs[idx2 + 1] = y;
              uvs[uOffset + idx2] = x;
              uvs[uOffset + idx2 + 1] = y;
              idx1 += 3;
              idx2 += 2;
              j++;
            }
          }

          return {
            flatVertices: flatVertices,
            holes: holes,
            points: points,
            count: count,
            uvs: uvs
          };
        }

        function validateRing(ring) {
          if (!isClosedRing(ring)) {
            ring.push(ring[0]);
          }
        }

        function isClosedRing(ring) {
          var len = ring.length;
          var _ring$ = ring[0],
              x1 = _ring$[0],
              y1 = _ring$[1],
              _ring = ring[len - 1],
              x2 = _ring[0],
              y2 = _ring[1];
          return x1 === x2 && y1 === y2;
        }

        function extrudePolylines(lines, options) {
          options = Object.assign({}, {
            depth: 2,
            lineWidth: 1
          }, options);
          var results = lines.map(function (line) {
            var result = expandLine(line, options);
            result.line = line;
            generateTopAndBottom(result, options);
            generateSides(result, options);
            result.position = new Float32Array(result.points);
            result.indices = new Uint32Array(result.index);
            result.uv = new Float32Array(result.uvs);
            result.normal = generateNormal(result.indices, result.position);
            return result;
          });
          var result = merge(results);
          result.lines = lines;
          return result;
        }

        function generateTopAndBottom(result, options) {
          var z = options.depth;
          var points = [],
              index = [],
              uvs = [];
          var leftPoints = result.leftPoints,
              rightPoints = result.rightPoints;
          var i = 0,
              len = leftPoints.length;

          while (i < len) {
            // top left
            var idx0 = i * 3;
            var _leftPoints$i = leftPoints[i],
                x1 = _leftPoints$i[0],
                y1 = _leftPoints$i[1];
            points[idx0] = x1;
            points[idx0 + 1] = y1;
            points[idx0 + 2] = z; // top right

            var _rightPoints$i = rightPoints[i],
                x2 = _rightPoints$i[0],
                y2 = _rightPoints$i[1];
            var idx1 = len * 3 + idx0;
            points[idx1] = x2;
            points[idx1 + 1] = y2;
            points[idx1 + 2] = z; // bottom left

            var idx2 = len * 2 * 3 + idx0;
            points[idx2] = x1;
            points[idx2 + 1] = y1;
            points[idx2 + 2] = 0; // bottom right

            var idx3 = len * 2 * 3 + len * 3 + idx0;
            points[idx3] = x2;
            points[idx3 + 1] = y2;
            points[idx3 + 2] = 0;
            i++;
          }

          i = 0;
          len = points.length;

          while (i < len) {
            var x = points[i],
                y = points[i + 1];
            uvs.push(x, y);
            i += 3;
          }

          i = 0;
          len = leftPoints.length;

          while (i < len - 1) {
            // top
            // left1 left2 right1,right2
            var a1 = i,
                b1 = i + 1,
                c1 = a1 + len,
                d1 = b1 + len;
            index.push(a1, c1, b1);
            index.push(c1, d1, b1); // bottom
            // left1 left2 right1,right2

            var len2 = len * 2;
            var a2 = i + len2,
                b2 = a2 + 1,
                c2 = a2 + len,
                d2 = b2 + len;
            index.push(a2, c2, b2);
            index.push(c2, d2, b2);
            i++;
          }

          result.index = index;
          result.points = points;
          result.uvs = uvs;
        }

        function generateSides(result, options) {
          var points = result.points,
              index = result.index,
              leftPoints = result.leftPoints,
              rightPoints = result.rightPoints,
              uvs = result.uvs;
          var z = options.depth;
          var rings = [leftPoints, rightPoints];

          function addOneSideIndex(v1, v2) {
            var idx = points.length / 3;
            points.push(v1[0], v1[1], z, v2[0], v2[1], z, v1[0], v1[1], 0, v2[0], v2[1], 0);
            var a = idx + 2,
                b = idx + 3,
                c = idx,
                d = idx + 1;
            index.push(a, c, b, c, d, b);
            generateSideWallUV(uvs, points, a, b, c, d);
          }

          for (var i = 0, _len = rings.length; i < _len; i++) {
            var ring = rings[i];

            if (i > 0) {
              ring = ring.map(function (p) {
                return p;
              });
              ring = ring.reverse();
            }

            var j = 0;
            var len1 = ring.length - 1;

            while (j < len1) {
              var v1 = ring[j];
              var v2 = ring[j + 1];
              addOneSideIndex(v1, v2);
              j++;
            }
          }

          var len = leftPoints.length;
          var vs = [rightPoints[0], leftPoints[0], leftPoints[len - 1], rightPoints[len - 1]];

          for (var _i = 0; _i < vs.length; _i += 2) {
            var _v = vs[_i],
                _v2 = vs[_i + 1];
            addOneSideIndex(_v, _v2);
          }
        }

        var TEMPV1 = {
          x: 0,
          y: 0
        },
            TEMPV2 = {
          x: 0,
          y: 0
        };

        function expandLine(line, options) {
          var preAngle = 0;
          var radius = options.lineWidth / 2;
          var points = [],
              leftPoints = [],
              rightPoints = [];
          var len = line.length;
          var i = 0;

          while (i < len - 1) {
            var _p = line[i],
                _p2 = line[i + 1];
            var dy = _p2[1] - _p[1],
                dx = _p2[0] - _p[0];
            var _rAngle = 0;
            var rad = Math.atan(dy / dx);
            var angle = radToDeg(rad);
            preAngle = angle;

            if (i === 0) {
              _rAngle = angle;
              _rAngle -= 90;
            } else {
              var p0 = line[i - 1];
              TEMPV1.x = p0[0] - _p[0];
              TEMPV1.y = p0[1] - _p[1];
              TEMPV2.x = _p2[0] - _p[0];
              TEMPV2.y = _p2[1] - _p[1];
              var vAngle = getAngle(TEMPV1, TEMPV2);
              _rAngle = angle - vAngle / 2;
            }

            var _rRad = degToRad(_rAngle);

            var _calOffsetPoint = calOffsetPoint(_rRad, radius, _p),
                _op = _calOffsetPoint[0],
                _op2 = _calOffsetPoint[1];

            points.push(_op, _op2);

            if (leftOnLine(_op, _p, _p2)) {
              leftPoints.push(_op);
              rightPoints.push(_op2);
            } else {
              leftPoints.push(_op2);
              rightPoints.push(_op);
            }

            i++;
          }

          var rAngle = preAngle;
          rAngle -= 90;
          var rRad = degToRad(rAngle);
          var p1 = line[len - 2];
          var p2 = line[len - 1];

          var _calOffsetPoint2 = calOffsetPoint(rRad, radius, p2),
              op1 = _calOffsetPoint2[0],
              op2 = _calOffsetPoint2[1];

          points.push(op1, op2);

          if (leftOnLine(op1, p1, p2)) {
            leftPoints.push(op1);
            rightPoints.push(op2);
          } else {
            leftPoints.push(op2);
            rightPoints.push(op1);
          }

          return {
            offsetPoints: points,
            leftPoints: leftPoints,
            rightPoints: rightPoints
          };
        }

        function calOffsetPoint(rad, radius, p) {
          var x = p[0],
              y = p[1];
          var x1 = Math.cos(rad) * radius,
              y1 = Math.sin(rad) * radius;
          var p1 = [x + x1, y + y1];
          var rad1 = rad += Math.PI;
          var x2 = Math.cos(rad1) * radius,
              y2 = Math.sin(rad1) * radius;
          var p2 = [x + x2, y + y2];
          return [p1, p2];
        }

        var getAngle = function getAngle(_ref, _ref2) {
          var x1 = _ref.x,
              y1 = _ref.y;
          var x2 = _ref2.x,
              y2 = _ref2.y;
          var dot = x1 * x2 + y1 * y2;
          var det = x1 * y2 - y1 * x2;
          var angle = Math.atan2(det, dot) / Math.PI * 180;
          return (angle + 360) % 360;
        };

        function leftOnLine(p, p1, p2) {
          var x1 = p1[0],
              y1 = p1[1];
          var x2 = p2[0],
              y2 = p2[1];
          var x = p[0],
              y = p[1];
          return (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1 > 0;
        }

        exports.extrudePolygons = extrudePolygons;
        exports.extrudePolylines = extrudePolylines;

        Object.defineProperty(exports, '__esModule', { value: true });

    }));

    }(polyExtrude$2, polyExtrude$2.exports));

    var polyExtrude = /*@__PURE__*/getDefaultExportFromCjs(polyExtrude$2.exports);

    var polyExtrude$1 = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': polyExtrude
    }, [polyExtrude$2.exports]);

    //Using cache to reduce computation
    function distanceToVector3(distance, layer, cache = {}) {
        if (cache[distance] === undefined) {
            cache[distance] = layer.distanceToVector3(distance, distance).x;
        }
        return cache[distance];
    }
    function altitudeToVector3(altitude, layer, cache = {}) {
        if (cache[altitude] === undefined) {
            cache[altitude] = layer.altitudeToVector3(altitude, altitude).x;
        }
        return cache[altitude];
    }
    /**
     *Get the center point of the point set
     * @param {*} coordinates
     */
    function getCenterOfPoints(coordinates = []) {
        let sumX = 0, sumY = 0;
        const len = coordinates.length;
        for (let i = 0; i < len; i++) {
            const { coordinate, lnglat, lnglats, xy, xys } = coordinates[i];
            const c = coordinate || lnglat || lnglats || xy || xys || coordinates[i];
            let x, y;
            if (Array.isArray(c)) {
                x = c[0];
                y = c[1];
            }
            else if (c instanceof maptalks__namespace.Coordinate) {
                x = c.x;
                y = c.y;
            }
            sumX += x;
            sumY += y;
        }
        return new maptalks__namespace.Coordinate(sumX / len, sumY / len);
    }
    function setBottomHeight(geometry, bottomHeight, layer, cache) {
        if (bottomHeight === undefined || typeof bottomHeight !== 'number' || bottomHeight === 0) {
            return 0;
        }
        let position;
        if (geometry instanceof THREE__namespace.BufferGeometry) {
            position = geometry.attributes.position.array;
        }
        else if (Array.isArray(geometry) || geometry instanceof Float32Array) {
            position = geometry;
        }
        else {
            position = geometry.position;
        }
        let h = 0;
        if (position) {
            if (cache) {
                if (cache[bottomHeight] === undefined) {
                    cache[bottomHeight] = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                }
                h = cache[bottomHeight];
            }
            else {
                h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
            }
            const len = position.length;
            if (position[0] instanceof THREE__namespace.Vector3) {
                for (let i = 0; i < len; i++) {
                    position[i].z += h;
                }
            }
            else {
                for (let i = 0; i < len; i += 3) {
                    position[i + 2] += h;
                }
            }
        }
        return h;
    }
    function getGeometriesColorArray(geometriesAttributes) {
        const len = geometriesAttributes.length;
        let colorsLen = 0;
        for (let i = 0; i < len; i++) {
            const { count } = geometriesAttributes[i].position;
            colorsLen += count;
        }
        return new Float32Array(colorsLen * 3);
    }
    function coordiantesToArrayBuffer(coordiantes = []) {
        const len = coordiantes.length;
        const array = new Float64Array(len * 2);
        for (let i = 0; i < len; i++) {
            let x, y;
            const c = coordiantes[i];
            if (c.x) {
                x = c.x;
                y = c.y;
            }
            else {
                x = c[0];
                y = c[1];
            }
            array[i * 2] = x;
            array[i * 2 + 1] = y;
        }
        return array.buffer;
    }

    const topColor = new THREE__namespace.Color('#fff'), bottomColor = new THREE__namespace.Color('#fff');
    /**
     * this is for ExtrudeMesh util
     */
    /**
     * Fix the bug in the center of multipoygon
     * @param {maptalks.Polygon} polygon
     * @param {*} layer
     */
    // export function toShape(datas = []) {
    //     const shapes = [];
    //     for (let i = 0, len = datas.length; i < len; i++) {
    //         const { outer, holes } = datas[i];
    //         const shape = [outer];
    //         if (holes && holes.length) {
    //             for (let j = 0, len1 = holes.length; j < len1; j++) {
    //                 shape.push(holes[j]);
    //             }
    //         }
    //         shapes.push(shape);
    //     }
    //     return shapes;
    // }
    /**
     *  Support custom center point
     * @param {maptalks.Polygon|maptalks.MultiPolygon} polygon
     * @param {*} height
     * @param {*} layer
     */
    function getExtrudeGeometry(polygon, height, layer, center) {
        const { position, normal, uv, indices } = getExtrudeGeometryParams(polygon, height, layer, center);
        const color = new Float32Array(position.length);
        color.fill(1, 0, position.length);
        const bufferGeomertry = new THREE__namespace.BufferGeometry();
        addAttribute(bufferGeomertry, 'color', new THREE__namespace.BufferAttribute(color, 3));
        addAttribute(bufferGeomertry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(bufferGeomertry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(bufferGeomertry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        bufferGeomertry.setIndex(new THREE__namespace.Uint32BufferAttribute(indices, 1));
        return bufferGeomertry;
    }
    function getExtrudeGeometryParams(polygon, height, layer, center, centerPt, altCache) {
        const datas = getPolygonPositions(polygon, layer, center, centerPt, false);
        const shapes = datas;
        //Possible later use of geojson
        if (!shapes)
            return null;
        //Reduce height and repeat calculation
        if (altCache) {
            if (altCache[height] == null) {
                altCache[height] = layer.altitudeToVector3(height, height).x;
            }
            height = altCache[height];
        }
        else {
            height = layer.altitudeToVector3(height, height).x;
        }
        const { position, normal, uv, indices } = polyExtrude$2.exports.extrudePolygons(shapes, {
            depth: height
        });
        return {
            position, normal, uv, indices
        };
    }
    /**
     *
     * @param {*} geometry
     * @param {*} color
     * @param {*} _topColor
     */
    function initVertexColors(geometry, color, _topColor, minZ) {
        if (minZ === undefined) {
            minZ = 0;
        }
        const position = geometry.attributes.position.array;
        const len = position.length;
        bottomColor.setStyle(color);
        topColor.setStyle(_topColor);
        let colors;
        if (Array.isArray(minZ)) {
            let colorLen = 0;
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { count } = minZ[i].position;
                colorLen += count * 3;
            }
            colors = new Float32Array(colorLen);
        }
        else {
            colors = new Float32Array(position.length);
        }
        if (Array.isArray(minZ)) {
            for (let i = 0, len = minZ.length; i < len; i++) {
                const { middleZ, start, end } = minZ[i].position;
                for (let j = start; j < end; j += 3) {
                    const z = position[j + 2];
                    if (z > middleZ) {
                        colors[j] = topColor.r;
                        colors[j + 1] = topColor.g;
                        colors[j + 2] = topColor.b;
                    }
                    else {
                        colors[j] = bottomColor.r;
                        colors[j + 1] = bottomColor.g;
                        colors[j + 2] = bottomColor.b;
                    }
                }
            }
        }
        else {
            for (let i = 0; i < len; i += 3) {
                const z = position[i + 2];
                if (z > minZ) {
                    colors[i] = topColor.r;
                    colors[i + 1] = topColor.g;
                    colors[i + 2] = topColor.b;
                }
                else {
                    colors[i] = bottomColor.r;
                    colors[i + 1] = bottomColor.g;
                    colors[i + 2] = bottomColor.b;
                }
            }
        }
        addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
        return colors;
    }
    /**
     *
     * @param {*} polygon
     * @param {*} layer
     * @param {*} center
     */
    function getPolygonPositions(polygon, layer, center, centerPt, isArrayBuff = false) {
        if (!polygon) {
            return null;
        }
        let datas = [];
        if (polygon instanceof maptalks__namespace.MultiPolygon) {
            datas = polygon.getGeometries().map(p => {
                return getSinglePolygonPositions(p, layer, center || polygon.getCenter(), centerPt, isArrayBuff);
            });
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            const data = getSinglePolygonPositions(polygon, layer, center || polygon.getCenter(), centerPt, isArrayBuff);
            datas.push(data);
        }
        else if (isGeoJSONPolygon(polygon)) {
            // const cent = getGeoJSONCenter(polygon);
            if (!isGeoJSONMulti(polygon)) {
                const data = getSinglePolygonPositions(polygon, layer, center || getGeoJSONCenter(polygon), centerPt, isArrayBuff);
                datas.push(data);
            }
            else {
                const fs = spliteGeoJSONMulti(polygon);
                for (let i = 0, len = fs.length; i < len; i++) {
                    datas.push(getSinglePolygonPositions(fs[i], layer, center || getGeoJSONCenter(polygon), centerPt, isArrayBuff));
                }
            }
        }
        return datas;
    }
    function getSinglePolygonPositions(polygon, layer, center, centerPt, isArrayBuff = false) {
        let shell, holes;
        //it is pre for geojson,Possible later use of geojson
        if (isGeoJSONPolygon(polygon)) {
            const coordinates = getGeoJSONCoordinates(polygon);
            shell = coordinates[0];
            holes = coordinates.slice(1, coordinates.length);
            center = center || getGeoJSONCenter(polygon);
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            shell = polygon.getShell();
            holes = polygon.getHoles();
            center = center || polygon.getCenter();
        }
        centerPt = centerPt || layer.coordinateToVector3(center);
        let outer;
        if (isArrayBuff) {
            outer = layer.coordinatiesToGLFloatArray(shell, centerPt).positons2d;
        }
        else {
            outer = layer.coordinatiesToGLArray(shell, centerPt);
        }
        const data = [(isArrayBuff ? outer.buffer : outer)];
        if (holes && holes.length > 0) {
            for (let i = 0, len = holes.length; i < len; i++) {
                let pts;
                if (isArrayBuff) {
                    pts = layer.coordinatiesToGLFloatArray(holes[i], centerPt).positons2d;
                }
                else {
                    pts = layer.coordinatiesToGLArray(holes[i], centerPt);
                }
                data.push((isArrayBuff ? pts.buffer : pts));
            }
        }
        return data;
    }
    function getPolygonArrayBuffer(polygon) {
        if (!polygon) {
            return null;
        }
        let datas = [];
        if (polygon instanceof maptalks__namespace.MultiPolygon) {
            datas = polygon.getGeometries().map(p => {
                return getSinglePolygonArrayBuffer(p, false);
            });
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            const data = getSinglePolygonArrayBuffer(polygon, false);
            datas.push(data);
        }
        else if (isGeoJSONPolygon(polygon)) {
            // const cent = getGeoJSONCenter(polygon);
            if (!isGeoJSONMulti(polygon)) {
                const data = getSinglePolygonArrayBuffer(polygon, true);
                datas.push(data);
            }
            else {
                const fs = spliteGeoJSONMulti(polygon);
                for (let i = 0, len = fs.length; i < len; i++) {
                    datas.push(getSinglePolygonArrayBuffer(fs[i], true));
                }
            }
        }
        return datas;
    }
    function getSinglePolygonArrayBuffer(polygon, isGeoJSON) {
        let shell, holes;
        //it is pre for geojson,Possible later use of geojson
        if (isGeoJSON) {
            const coordinates = getGeoJSONCoordinates(polygon);
            shell = coordinates[0];
            holes = coordinates.slice(1, coordinates.length);
        }
        else if (polygon instanceof maptalks__namespace.Polygon) {
            shell = polygon.getShell();
            holes = polygon.getHoles();
        }
        const outer = coordiantesToArrayBuffer(shell);
        const data = [outer];
        if (holes && holes.length > 0) {
            for (let i = 0, len = holes.length; i < len; i++) {
                const pts = coordiantesToArrayBuffer(holes[i]);
                data.push(pts);
            }
        }
        return data;
    }

    var ExtrudeUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getExtrudeGeometry: getExtrudeGeometry,
        getExtrudeGeometryParams: getExtrudeGeometryParams,
        initVertexColors: initVertexColors,
        getPolygonPositions: getPolygonPositions,
        getSinglePolygonPositions: getSinglePolygonPositions,
        getPolygonArrayBuffer: getPolygonArrayBuffer,
        getSinglePolygonArrayBuffer: getSinglePolygonArrayBuffer
    });

    const COMMA = ',';
    /**
     *
     * @param {maptalks.LineString} lineString
     * @param {ThreeLayer} layer
     */
    function getLinePosition(lineString, layer, center, hasVectorArray = true) {
        const positionsV = [];
        let positions, positions2d;
        if (Array.isArray(lineString) && lineString[0] instanceof THREE__namespace.Vector3) {
            for (let i = 0, len = lineString.length; i < len; i++) {
                const v = lineString[i];
                positionsV.push(v);
            }
        }
        else {
            if (Array.isArray(lineString)) {
                lineString = new maptalks__namespace.LineString(lineString);
            }
            const z = 0;
            //support geojson
            let coordinates, cent;
            if (isGeoJSON(lineString)) {
                coordinates = getGeoJSONCoordinates(lineString);
                if (!center) {
                    cent = getGeoJSONCenter(lineString);
                }
            }
            else if (lineString instanceof maptalks__namespace.LineString) {
                coordinates = lineString.getCoordinates();
                if (!center) {
                    cent = lineString.getCenter();
                }
            }
            const centerPt = layer.coordinateToVector3(center || cent);
            if (hasVectorArray) {
                for (let i = 0, len = coordinates.length; i < len; i++) {
                    const coordinate = coordinates[i];
                    const v = layer.coordinateToVector3(coordinate, z).sub(centerPt);
                    // positions.push(v.x, v.y, v.z);
                    positionsV.push(v);
                }
            }
            else {
                const result = layer.coordinatiesToGLFloatArray(coordinates, centerPt);
                positions = result.positions;
                positions2d = result.positons2d;
            }
        }
        if (!hasVectorArray) {
            return {
                positions,
                positionsV,
                positions2d,
                arrayBuffer: positions2d.buffer
            };
        }
        positions2d = new Float32Array(positionsV.length * 2);
        positions = new Float32Array(positionsV.length * 3);
        for (let i = 0, len = positionsV.length; i < len; i++) {
            const idx = i * 3;
            const v = positionsV[i];
            positions[idx] = v.x;
            positions[idx + 1] = v.y;
            positions[idx + 2] = v.z;
            const idx1 = i * 2;
            positions2d[idx1] = v.x;
            positions2d[idx1 + 1] = v.y;
        }
        return {
            positions,
            positionsV,
            positions2d,
            arrayBuffer: positions2d.buffer
        };
    }
    /**
     *
     * @param {maptalks.LineString} lineString
     * @param {Number} lineWidth
     * @param {Number} depth
     * @param {ThreeLayer} layer
     */
    function getExtrudeLineGeometry(lineString, lineWidth = 1, depth = 1, layer, center) {
        const { indices, position, normal, uv } = getExtrudeLineParams(lineString, lineWidth, depth, layer, center);
        const geometry = new THREE__namespace.BufferGeometry();
        addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(geometry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(geometry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE__namespace.BufferAttribute(indices, 1));
        return geometry;
    }
    /**
     *
     * @param {Array[Array]} chunkLines
     * @param {*} layer
     */
    function getChunkLinesPosition(chunkLines, layer, positionMap, centerPt) {
        const positions = [], positionsV = [], lnglats = [];
        for (let i = 0, len = chunkLines.length; i < len; i++) {
            const line = chunkLines[i];
            for (let j = 0, len1 = line.length; j < len1; j++) {
                const lnglat = line[j];
                if (lnglats.length > 0) {
                    const key = lnglat.join(COMMA).toString();
                    const key1 = lnglats[lnglats.length - 1].join(COMMA).toString();
                    if (key !== key1) {
                        lnglats.push(lnglat);
                    }
                }
                else {
                    lnglats.push(lnglat);
                }
            }
        }
        const z = 0;
        for (let i = 0, len = lnglats.length; i < len; i++) {
            const lnglat = lnglats[i];
            let v;
            const key = lnglat.join(COMMA).toString();
            if (positionMap && positionMap[key]) {
                v = positionMap[key];
            }
            else {
                v = layer.coordinateToVector3(lnglat, z).sub(centerPt);
            }
            positionsV.push(v);
            positions.push(v.x, v.y, v.z);
        }
        return {
            positions: positions,
            positionsV: positionsV,
            lnglats: lnglats
        };
    }
    /**
     *
     * @param {*} lineString
     * @param {*} lineWidth
     * @param {*} depth
     * @param {*} layer
     */
    function getExtrudeLineParams(lineString, lineWidth = 1, depth = 1, layer, center) {
        const positions = getLinePosition(lineString, layer, center).positionsV;
        const ps = [];
        for (let i = 0, len = positions.length; i < len; i++) {
            const p = positions[i];
            ps.push([p.x, p.y]);
        }
        const { indices, position, normal, uv } = polyExtrude$2.exports.extrudePolylines([ps], {
            lineWidth: lineWidth,
            depth: depth
        });
        return {
            position: position,
            normal: normal,
            indices: indices,
            uv
        };
    }
    function LineStringSplit(lineString) {
        let lineStrings = [], center;
        if (lineString instanceof maptalks__namespace.MultiLineString) {
            lineStrings = lineString.getGeometries();
            center = lineString.getCenter();
        }
        else if (lineString instanceof maptalks__namespace.LineString) {
            lineStrings.push(lineString);
            center = lineString.getCenter();
        }
        else if (isGeoJSON(lineString)) {
            center = getGeoJSONCenter(lineString);
            if (isGeoJSONMulti(lineString)) {
                lineStrings = spliteGeoJSONMulti(lineString);
            }
            else {
                lineStrings.push(lineString);
            }
        }
        return {
            lineStrings,
            center
        };
    }
    function setLineSegmentPosition(position, positionsV) {
        for (let i = 0, len = positionsV.length; i < len; i++) {
            const v = positionsV[i];
            if (i > 0 && i < len - 1) {
                position.push(v.x, v.y, v.z);
            }
            position.push(v.x, v.y, v.z);
        }
    }
    function getLineSegmentPosition(ps) {
        const position = new Float32Array(ps.length * 2 - 6);
        let j = 0;
        for (let i = 0, len = ps.length / 3; i < len; i++) {
            const x = ps[i * 3], y = ps[i * 3 + 1], z = ps[i * 3 + 2];
            if (i > 0 && i < len - 1) {
                const idx = j * 3;
                position[idx] = x;
                position[idx + 1] = y;
                position[idx + 2] = z;
                j++;
            }
            const idx = j * 3;
            position[idx] = x;
            position[idx + 1] = y;
            position[idx + 2] = z;
            j++;
        }
        return position;
    }
    function mergeLinePositions(positionsList) {
        let len = 0;
        const l = positionsList.length;
        if (l === 1) {
            return positionsList[0];
        }
        for (let i = 0; i < l; i++) {
            len += positionsList[i].length;
        }
        const position = new Float32Array(len);
        let offset = 0;
        for (let i = 0; i < l; i++) {
            position.set(positionsList[i], offset);
            offset += positionsList[i].length;
        }
        return position;
    }
    function getLineArrayBuffer(lineString) {
        if (lineString instanceof maptalks__namespace.LineString) {
            return coordiantesToArrayBuffer(lineString.getCoordinates());
        }
        else if (isGeoJSONLine(lineString)) {
            return coordiantesToArrayBuffer(lineString.geometry.coordinates);
        }
    }
    let defaultGeometry;
    function getDefaultLineGeometry() {
        if (!defaultGeometry) {
            defaultGeometry = new THREE__namespace.BufferGeometry();
            addAttribute(defaultGeometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(3), 3));
        }
        return defaultGeometry;
    }

    var LineUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getLinePosition: getLinePosition,
        getExtrudeLineGeometry: getExtrudeLineGeometry,
        getChunkLinesPosition: getChunkLinesPosition,
        getExtrudeLineParams: getExtrudeLineParams,
        LineStringSplit: LineStringSplit,
        setLineSegmentPosition: setLineSegmentPosition,
        getLineSegmentPosition: getLineSegmentPosition,
        mergeLinePositions: mergeLinePositions,
        getLineArrayBuffer: getLineArrayBuffer,
        getDefaultLineGeometry: getDefaultLineGeometry
    });

    // eslint-disable-next-line quotes
    const workerName$1 = '__maptalks.three__';
    function getWorkerName$1() {
        return workerName$1;
    }

    let MeshActor;
    if (maptalks__namespace.worker) {
        MeshActor = class extends maptalks__namespace.worker.Actor {
            test(info, cb) {
                //send data to worker thread
                this.send(info, null, cb);
            }
            pushQueue(q = {}) {
                const { type, data, callback, layer, key, center, lineStrings, options, id } = q;
                let params;
                if (type.indexOf('ExtrudePolygon') > -1) {
                    params = gengerateExtrudePolygons(data, center, layer, options);
                }
                else if (type === 'ExtrudeLines') {
                    params = gengerateExtrudeLines(data, center, layer, lineStrings);
                }
                else if (type === 'Point') ;
                else if (type === 'Line' || type === 'FatLine') {
                    params = gengerateLines(data, center, layer, lineStrings, options);
                }
                else if (type === 'Lines' || type === 'FatLines') {
                    params = gengerateLines(data, center, layer, lineStrings);
                }
                else if (type === 'ExtrudeLine') {
                    params = gengerateExtrudeLines(data, center, layer, lineStrings, options);
                }
                if (!params) {
                    console.error(`not support '${type}' worker`);
                    return;
                }
                this.send({ type, datas: params.datas, glRes: params.glRes, matrix: params.matrix, center: params.center }, params.transfer, function (err, message) {
                    if (err) {
                        console.error(err);
                    }
                    message.key = key;
                    message.id = id;
                    callback(message);
                });
            }
        };
    }
    var actor$1;
    function getActor() {
        if (!maptalks__namespace.worker) {
            console.error('maptalks.worker is not defined,You can\'t use ThreeVectorTileLayer');
        }
        if (!actor$1 && MeshActor) {
            actor$1 = new MeshActor(getWorkerName$1());
        }
        return actor$1;
    }
    /**
     *
     * @param distance
     * @param layer
     * @param altCache
     * @returns
     */
    function getDistance(distance, layer, altCache = {}) {
        if (distance !== undefined && typeof distance === 'number' && distance !== 0) {
            if (altCache[distance] === undefined) {
                altCache[distance] = layer.distanceToVector3(distance, distance).x;
            }
            return altCache[distance];
        }
        return 0;
    }
    function getAltitude(altitude, layer, altCache = {}) {
        if (altitude !== undefined && typeof altitude === 'number' && altitude !== 0) {
            if (altCache[altitude] === undefined) {
                altCache[altitude] = layer.altitudeToVector3(altitude, altitude).x;
            }
            return altCache[altitude];
        }
        return 0;
    }
    /**
     * generate extrudepolygons data for worker
     * @param {*} polygons
     * @param {*} layer
     */
    function gengerateExtrudePolygons(polygons = [], center, layer, options = []) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const len = polygons.length;
        const datas = [], transfer = [], altCache = {};
        for (let i = 0; i < len; i++) {
            const polygon = polygons[i];
            const p = polygon;
            const properties = options[i] ? options[i] : (isGeoJSONPolygon(p) ? p['properties'] : p.getProperties() || {});
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let data;
            if (isMercator) {
                data = getPolygonArrayBuffer(polygon);
            }
            else {
                data = getPolygonPositions(polygon, layer, properties.center || center, centerPt, true);
            }
            for (let j = 0, len1 = data.length; j < len1; j++) {
                const d = data[j];
                for (let m = 0, len2 = d.length; m < len2; m++) {
                    //ring
                    transfer.push(d[m]);
                }
            }
            let height = properties.height || 1;
            let bottomHeight = properties.bottomHeight || 0;
            height = getAltitude(height, layer, altCache);
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const d = {
                id: properties.id,
                data,
                height,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
            //delete Internal properties
            if (p._properties) {
                delete p._properties;
            }
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    /**
     * generate ExtrudeLines data for worker
     * @param {*} lineStringList
     * @param {*} center
     * @param {*} layer
     */
    function gengerateExtrudeLines(lineStringList, center, layer, lineStrings, options = []) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const datas = [], transfer = [], cache = {}, altCache = {};
        const len = lineStringList.length;
        for (let i = 0; i < len; i++) {
            const multiLineString = lineStringList[i];
            const properties = options[i] ? options[i] : (isGeoJSONLine(lineStrings[i]) ? lineStrings[i]['properties'] : lineStrings[i].getProperties() || {});
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let width = properties.width || 1;
            let height = properties.height || 1;
            let bottomHeight = properties.bottomHeight || 0;
            width = getDistance(width, layer, cache);
            height = getAltitude(height, layer, altCache);
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const data = [];
            for (let j = 0, len1 = multiLineString.length; j < len1; j++) {
                const lineString = multiLineString[j];
                let arrayBuffer;
                if (isMercator) {
                    arrayBuffer = getLineArrayBuffer(lineString);
                }
                else {
                    arrayBuffer = getLinePosition(lineString, layer, center, false).arrayBuffer;
                }
                transfer.push(arrayBuffer);
                data.push(arrayBuffer);
            }
            const d = {
                id: properties.id,
                data,
                height,
                width,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }
    /**
     * generate Lines data for worker
     * @param lineStringList
     * @param center
     * @param layer
     * @param lineStrings
     * @param options
     * @returns
     */
    function gengerateLines(lineStringList, center, layer, lineStrings, options = []) {
        const isMercator = layer.isMercator();
        let glRes, matrix;
        if (isMercator) {
            const map = layer.getMap();
            glRes = map.getGLRes();
            matrix = map.getSpatialReference().getTransformation().matrix;
        }
        let centerPt;
        if (center) {
            centerPt = layer.coordinateToVector3(center);
        }
        const datas = [], transfer = [], altCache = {};
        const len = lineStringList.length;
        for (let i = 0; i < len; i++) {
            const multiLineString = lineStringList[i];
            const properties = options[i] ? options[i] : (isGeoJSONLine(lineStrings[i]) ? lineStrings[i]['properties'] : lineStrings[i].getProperties() || {});
            if (!center) {
                centerPt = layer.coordinateToVector3(properties.center);
            }
            let bottomHeight = properties.bottomHeight || 0;
            bottomHeight = getAltitude(bottomHeight, layer, altCache);
            const data = [];
            for (let j = 0, len1 = multiLineString.length; j < len1; j++) {
                const lineString = multiLineString[j];
                if (isMercator) {
                    const arrayBuffer = getLineArrayBuffer(lineString);
                    data.push(arrayBuffer);
                    data.push(arrayBuffer);
                }
                else {
                    const arrayBuffer = getLinePosition(lineString, layer, center, false).arrayBuffer;
                    transfer.push(arrayBuffer);
                    data.push(arrayBuffer);
                }
            }
            const d = {
                id: properties.id,
                data,
                bottomHeight
            };
            if (isMercator) {
                d.center = [centerPt.x, centerPt.y];
            }
            datas.push(d);
        }
        return {
            datas,
            transfer,
            glRes,
            matrix,
            center: isMercator ? [centerPt.x, centerPt.y] : null
        };
    }

    function getDatas(queues) {
        return queues.map(q => {
            return q.data;
        });
    }
    function getOptions(queues) {
        return queues.map(q => {
            return q.baseObject.getOptions();
        });
    }
    class BaseObjectTask {
        constructor() {
            this.queueMap = {};
            this.tempQueue = [];
            this.time = this.getCurrentTime();
            this.deQueueCount = 5;
            this.resultQueue = [];
        }
        getActor() {
            return getActor();
        }
        getCurrentTime() {
            return maptalks__namespace.Util.now();
        }
        loop() {
            this.deQueue();
        }
        push(data) {
            this.tempQueue.push(data);
            if (data.id) {
                this.queueMap[data.id] = data;
            }
            return this;
        }
        reset() {
            this.time = this.getCurrentTime();
            this.tempQueue = [];
            return this;
        }
        pushResult(result) {
            if (!result) {
                return;
            }
            if (!Array.isArray(result)) {
                result = [result];
            }
            result.forEach(d => {
                this.resultQueue.push(d);
            });
            return this;
        }
        deQueue() {
            if (!this.resultQueue.length) {
                return this;
            }
            const count = this.deQueueCount;
            const resultList = this.resultQueue.slice(0, count) || [];
            resultList.forEach(result => {
                const { id } = result;
                if (this.queueMap[id]) {
                    const { baseObject } = this.queueMap[id];
                    if (baseObject && baseObject._workerLoad) {
                        baseObject._workerLoad(result);
                    }
                    delete this.queueMap[id];
                }
            });
            this.resultQueue.splice(0, count);
            return this;
        }
    }
    class ExtrudePolygonTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'ExtrudePolygon',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudePolygonsTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'ExtrudePolygons',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        center: queue.center,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudeLineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'ExtrudeLine',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class ExtrudeLinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'ExtrudeLines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class LineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 200;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'Line',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class LinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'Lines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    class FatLineTask extends BaseObjectTask {
        constructor() {
            super();
            this.deQueueCount = 100;
        }
        loop() {
            const t = this.getCurrentTime();
            if ((t - this.time >= 32 || this.tempQueue.length >= 1000) && this.tempQueue.length) {
                const actor = getActor();
                actor.pushQueue({
                    type: 'FatLine',
                    layer: this.tempQueue[0].layer,
                    data: getDatas(this.tempQueue),
                    options: getOptions(this.tempQueue),
                    lineStrings: this.tempQueue.map(q => {
                        return q.lineString;
                    }),
                    callback: (result) => {
                        this.pushResult(result);
                    }
                });
                this.reset();
            }
            super.loop();
        }
    }
    class FatLinesTask extends BaseObjectTask {
        loop() {
            if (this.tempQueue.length) {
                const actor = getActor();
                this.tempQueue.forEach(queue => {
                    actor.pushQueue({
                        id: queue.id,
                        type: 'FatLines',
                        layer: queue.layer,
                        data: queue.data,
                        key: queue.key,
                        lineStrings: queue.lineStrings,
                        center: queue.center,
                        callback: (result) => {
                            this.pushResult(result);
                        }
                    });
                });
                this.reset();
            }
            super.loop();
        }
    }
    const ExtrudePolygonTaskIns = new ExtrudePolygonTask();
    const ExtrudePolygonsTaskIns = new ExtrudePolygonsTask();
    const ExtrudeLineTaskIns = new ExtrudeLineTask();
    const ExtrudeLinesTaskIns = new ExtrudeLinesTask();
    const LineTaskIns = new LineTask();
    const LinesTaskIns = new LinesTask();
    const FatLineTaskIns = new FatLineTask();
    const FatLinesTaskIns = new FatLinesTask();
    const BaseObjectTaskManager = {
        isRunning: false,
        tasks: [],
        addTask: (taskIns) => {
            if (taskIns) {
                BaseObjectTaskManager.tasks.push(taskIns);
            }
        },
        removeTask: (taskIns) => {
            BaseObjectTaskManager.tasks.splice(BaseObjectTaskManager.tasks.indexOf(taskIns), 1);
        },
        loop() {
            ExtrudePolygonTaskIns.loop();
            ExtrudePolygonsTaskIns.loop();
            ExtrudeLineTaskIns.loop();
            ExtrudeLinesTaskIns.loop();
            LineTaskIns.loop();
            LinesTaskIns.loop();
            FatLineTaskIns.loop();
            FatLinesTaskIns.loop();
            BaseObjectTaskManager.tasks.forEach(taskIns => {
                if (taskIns && taskIns.loop) {
                    taskIns.loop();
                }
            });
            maptalks__namespace.Util.requestAnimFrame(BaseObjectTaskManager.loop);
        },
        star() {
            if (!BaseObjectTaskManager.isRunning) {
                BaseObjectTaskManager.isRunning = true;
                BaseObjectTaskManager.loop();
            }
        }
    };

    function initColors(cs) {
        const colors = [];
        if (cs && cs.length) {
            cs.forEach(color => {
                color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                colors.push(color.r, color.g, color.b);
            });
        }
        return colors;
    }
    const OPTIONS$i = {
        altitude: 0,
        bottomHeight: 0,
        colors: null
    };
    /**
     *
     */
    class Line extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$i, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { lineStrings, center } = LineStringSplit(lineString);
            const { asynchronous } = options;
            let geometry;
            if (asynchronous) {
                geometry = getDefaultLineGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                LineTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    key: options.key,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const positionList = [];
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const lineString = lineStrings[i];
                    const { positions } = getLinePosition(lineString, layer, center, false);
                    positionList.push(getLineSegmentPosition(positions));
                }
                const position = mergeLinePositions(positionList);
                geometry = new THREE__namespace.BufferGeometry();
                addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
                setBottomHeight(geometry, options.bottomHeight, layer);
                const colors = initColors(options.colors);
                if (colors && colors.length) {
                    addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3));
                    material.vertexColors = getVertexColors();
                }
            }
            this._createLineSegments(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'Line';
        }
        _workerLoad(result) {
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(result.position), 3));
            const colors = initColors(this.getOptions().colors);
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (colors && colors.length) {
                addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3));
                material.vertexColors = getVertexColors();
            }
            this._computeLineDistances(geometry);
            object3d.geometry = geometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$h = {
        bottomHeight: 0,
        width: 3,
        height: 1,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class ExtrudeLine extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$h, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { height, width, bottomColor, topColor, bottomHeight, altitude, asynchronous } = options;
            const h = layer.altitudeToVector3(height, height).x;
            const w = layer.distanceToVector3(width, width).x;
            const { lineStrings, center } = LineStringSplit(lineString);
            let geometry;
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                ExtrudeLineTaskIns.push({
                    id,
                    data: lineStrings,
                    layer,
                    center,
                    lineString,
                    baseObject: this
                });
            }
            else {
                const extrudeParams = [];
                let minZ = 0;
                const cache = {};
                for (let i = 0, len = lineStrings.length; i < len; i++) {
                    const attribute = getExtrudeLineParams(lineStrings[i], w, h, layer, center);
                    minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                    extrudeParams.push(attribute);
                }
                geometry = mergeBufferGeometries(extrudeParams);
                if (topColor) {
                    initVertexColors(geometry, bottomColor, topColor, minZ + h / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            // const center = (isGeoJSON(lineString) ? getGeoJSONCenter(lineString) : lineString.getCenter());
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'ExtrudeLine';
        }
        _workerLoad(result) {
            const bufferGeometry = generateBufferGeometry(result);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors(bufferGeometry, bottomColor, topColor, h + extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$g = {
        altitude: 0,
        height: 1,
        bottomHeight: 0,
        topColor: null,
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    /**
     *
     */
    class ExtrudePolygon extends BaseObject {
        constructor(polygon, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$g, options, { layer, polygon });
            super();
            this._initOptions(options);
            const { height, topColor, bottomColor, altitude, bottomHeight, asynchronous } = options;
            let geometry;
            const center = (isGeoJSONPolygon(polygon) ? getGeoJSONCenter(polygon) : polygon.getCenter());
            if (asynchronous) {
                geometry = getDefaultBufferGeometry();
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                ExtrudePolygonTaskIns.push({
                    data: polygon,
                    layer,
                    id,
                    baseObject: this
                });
            }
            else {
                geometry = getExtrudeGeometry(polygon, height, layer);
                const h = setBottomHeight(geometry, bottomHeight, layer);
                if (topColor) {
                    const extrudeH = layer.altitudeToVector3(height, height).x;
                    initVertexColors(geometry, bottomColor, topColor, h + extrudeH / 2);
                    material.vertexColors = getVertexColors();
                }
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this.type = 'ExtrudePolygon';
        }
        _workerLoad(data) {
            const bufferGeometry = generateBufferGeometry(data);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                const layer = this.getLayer();
                const h = layer.altitudeToVector3(bottomHeight, bottomHeight).x;
                const extrudeH = layer.altitudeToVector3(height, height).x;
                initVertexColors(bufferGeometry, bottomColor, topColor, h + extrudeH / 2);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$f = {
        altitude: 0,
        coordinate: null
    };
    /**
     * Model container
     */
    class Model extends BaseObject {
        constructor(model, options = {}, layer) {
            if (!options.coordinate) {
                console.warn('coordinate is null,it is important to locate the model');
                options.coordinate = layer.getMap().getCenter();
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$f, options, { layer, model });
            super();
            this._initOptions(options);
            this._createGroup();
            this.getObject3d().add(model);
            const { altitude, coordinate } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Model';
        }
    }

    const PI = Math.PI / 180;
    const R = 6378137;
    const MINLENGTH = 1;
    function formatLineArray(polyline) {
        const lnglats = polyline.getCoordinates();
        return lnglats.map(lnglat => {
            return lnglat.toArray();
        });
    }
    function degreesToRadians(d) {
        return d * PI;
    }
    function distance(c1, c2) {
        if (!c1 || !c2) {
            return 0;
        }
        if (!Array.isArray(c1)) {
            c1 = c1.toArray();
        }
        if (!Array.isArray(c2)) {
            c2 = c2.toArray();
        }
        let b = degreesToRadians(c1[1]);
        const d = degreesToRadians(c2[1]), e = b - d, f = degreesToRadians(c1[0]) - degreesToRadians(c2[0]);
        b = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(e / 2), 2) + Math.cos(b) * Math.cos(d) * Math.pow(Math.sin(f / 2), 2)));
        b *= R;
        return Math.round(b * 1E5) / 1E5;
    }
    function lineLength(polyline) {
        let lnglatArray = polyline;
        if (!Array.isArray(polyline)) {
            lnglatArray = formatLineArray(polyline);
        }
        let l = 0;
        for (let i = 0, len = lnglatArray.length; i < len - 1; i++) {
            l += distance(lnglatArray[i], lnglatArray[i + 1]);
        }
        return l;
    }
    function getPercentLngLat(l, length) {
        const { len, c1, c2 } = l;
        const dx = c2[0] - c1[0], dy = c2[1] - c1[1];
        const percent = length / len;
        const lng = c1[0] + percent * dx;
        const lat = c1[1] + percent * dy;
        return [lng, lat];
    }
    /**
     * This is not an accurate line segment cutting method, but rough, in order to speed up the calculation,
     * the correct cutting algorithm can be referred to. http://turfjs.org/docs/#lineChunk
     * @param {*} cs
     * @param {*} lineChunkLength
     */
    function lineSlice(cs, lineChunkLength = 10) {
        lineChunkLength = Math.max(lineChunkLength, MINLENGTH);
        if (!Array.isArray(cs)) {
            cs = formatLineArray(cs);
        }
        const LEN = cs.length;
        let list = [];
        let totalLen = 0;
        for (let i = 0; i < LEN - 1; i++) {
            const len = distance(cs[i], cs[i + 1]);
            const floorlen = Math.floor(len);
            list.push({
                c1: cs[i],
                len: floorlen,
                c2: cs[i + 1]
            });
            totalLen += floorlen;
        }
        if (totalLen <= lineChunkLength) {
            const lnglats = list.map(d => {
                return [d.c1, d.c2];
            });
            return lnglats;
        }
        if (list.length === 1) {
            if (list[0].len <= lineChunkLength) {
                return [
                    [list[0].c1, list[0].c2]
                ];
            }
        }
        const LNGLATSLEN = list.length;
        const first = list[0];
        let idx = 0;
        let currentLngLat;
        let currentLen = 0;
        const lines = [];
        let lls = [first.c1];
        while (idx < LNGLATSLEN) {
            const { len, c2 } = list[idx];
            currentLen += len;
            if (currentLen < lineChunkLength) {
                lls.push(c2);
                if (idx === LNGLATSLEN - 1) {
                    lines.push(lls);
                }
                idx++;
            }
            if (currentLen === lineChunkLength) {
                lls.push(c2);
                currentLen = 0;
                lines.push(lls);
                //next
                lls = [c2];
                idx++;
            }
            if (currentLen > lineChunkLength) {
                const offsetLen = (len - currentLen + lineChunkLength);
                currentLngLat = getPercentLngLat(list[idx], offsetLen);
                lls.push(currentLngLat);
                lines.push(lls);
                currentLen = 0;
                list[idx].c1 = currentLngLat;
                list[idx].len = len - offsetLen;
                //next
                lls = [];
                lls.push(currentLngLat);
            }
        }
        return lines;
    }

    var GeoUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        distance: distance,
        lineLength: lineLength,
        lineSlice: lineSlice
    });

    const MAX_POINTS = 1000;
    /**
     *
     * @param {THREE.BufferGeometry} geometry
     * @param {*} ps
     * @param {*} norls
     * @param {*} indices
     */
    function setExtrudeLineGeometryAttribute(geometry, ps, norls, indices) {
        const len = ps.length;
        geometry.attributes.normal.count = len;
        geometry.attributes.position.count = len;
        const positions = geometry.attributes.position.array;
        const normals = geometry.attributes.normal.array;
        for (let i = 0; i < len; i++) {
            positions[i] = ps[i];
            normals[i] = norls[i];
        }
        // geometry.index.array = new Uint16Array(indices.length);
        geometry.index.count = indices.length;
        // geometry.index.needsUpdate = true;
        for (let i = 0, len1 = indices.length; i < len1; i++) {
            geometry.index.array[i] = indices[i];
        }
        // geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
        // geometry.setDrawRange(0, len / 3);
    }
    const OPTIONS$e = {
        trail: 5,
        chunkLength: 50,
        width: 2,
        height: 1,
        speed: 1,
        altitude: 0,
        interactive: false,
        heightEnable: true
    };
    /**
     *
     */
    class ExtrudeLineTrail extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$e, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { width, height, altitude, speed, chunkLength, trail } = options;
            let center, coordinates;
            if (isGeoJSON(lineString)) {
                center = getGeoJSONCenter(lineString);
                coordinates = getGeoJSONCoordinates(lineString);
            }
            else {
                center = lineString.getCenter();
                coordinates = lineString;
            }
            const chunkLines = lineSlice(coordinates, chunkLength);
            const centerPt = layer.coordinateToVector3(center);
            //cache position for  faster computing,reduce double counting
            const positionMap = {};
            for (let i = 0, len = chunkLines.length; i < len; i++) {
                const chunkLine = chunkLines[i];
                for (let j = 0, len1 = chunkLine.length; j < len1; j++) {
                    const lnglat = chunkLine[j];
                    const key = lnglat.join(',').toString();
                    if (!positionMap[key]) {
                        positionMap[key] = layer.coordinateToVector3(lnglat).sub(centerPt);
                    }
                }
            }
            const positions = getChunkLinesPosition(chunkLines.slice(0, 1), layer, positionMap, centerPt).positionsV;
            //generate geometry
            const geometry = new THREE__namespace.BufferGeometry();
            const ps = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            const norls = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
            const inds = new Uint16Array(MAX_POINTS);
            addAttribute(geometry, 'position', (new THREE__namespace.BufferAttribute(ps, 3)));
            addAttribute(geometry, 'normal', (new THREE__namespace.BufferAttribute(norls, 3)));
            geometry.setIndex(new THREE__namespace.BufferAttribute(inds, 1));
            const lineWidth = layer.distanceToVector3(width, width).x;
            const depth = layer.altitudeToVector3(height, height).x;
            const params = getExtrudeLineParams(positions, lineWidth, depth, layer);
            setExtrudeLineGeometryAttribute(geometry, params.position, params.normal, params.indices);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            this._params = {
                index: 0,
                chunkLines,
                geometries: [],
                layer,
                trail: Math.max(1, trail),
                lineWidth,
                depth,
                speed: Math.min(1, speed),
                idx: 0,
                loaded: false,
                positionMap,
                centerPt
            };
            this._init(this._params);
            this.type = 'ExtrudeLineTrail';
        }
        /**
         * Follow-up support for adding webworker
         * @param {*} params
         */
        _init(params) {
            const { layer, trail, lineWidth, depth, chunkLines, positionMap, centerPt } = params;
            const len = chunkLines.length, geometries = [];
            for (let i = 0; i < len; i++) {
                const lines = chunkLines.slice(i, i + trail);
                const ps = getChunkLinesPosition(lines, layer, positionMap, centerPt).positionsV;
                geometries.push(getExtrudeLineParams(ps, lineWidth, depth, layer));
            }
            this._params.geometries = geometries;
            this._params.loaded = true;
        }
        _animation() {
            const { index, geometries, speed, idx, chunkLines, trail, lineWidth, depth, loaded, layer, positionMap, centerPt } = this._params;
            if (!loaded)
                return;
            const i = Math.round(index);
            if (i > idx) {
                this._params.idx++;
                let p = geometries[i];
                //if not init, this is will running
                if (!p) {
                    const lines = chunkLines.slice(i, i + trail);
                    const ps = getChunkLinesPosition(lines, layer, positionMap, centerPt).positionsV;
                    p = getExtrudeLineParams(ps, lineWidth, depth, layer);
                    geometries[i] = p;
                }
                const object3d = this.getObject3d();
                setExtrudeLineGeometryAttribute(object3d.geometry, p.position, p.normal, p.indices);
                object3d.geometry.attributes.position.needsUpdate = true;
                object3d.geometry.attributes.normal.needsUpdate = true;
                object3d.geometry.index.needsUpdate = true;
            }
            if (index >= chunkLines.length - 1) {
                this._params.index = -1;
                this._params.idx = -1;
            }
            this._params.index += speed;
        }
    }

    const EVENTS$1 = ['click', 'mousemove', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].join(' ').toString();
    const defaultMaterial = new THREE__namespace.MeshBasicMaterial();
    defaultMaterial.vertexColors = getVertexColors();
    /**
     * This is for the merger, MergedExtrudeMesh,Points ...
     * @param {*} Base
     */
    const MergedMixin = (Base) => {
        return class extends Base {
            // this._faceMap=[];
            // this._baseObjects = [];
            // this._datas = [];
            // this.faceIndex = null;
            // this.index=null;
            // this._geometriesAttributes = [];
            // this._geometryCache = geometry.clone();
            // this.isHide = false;
            /**
             *
             * @param {*} baseObjects
             */
            _initBaseObjectsEvent(baseObjects) {
                if (baseObjects && Array.isArray(baseObjects) && baseObjects.length) {
                    for (let i = 0, len = baseObjects.length; i < len; i++) {
                        const baseObject = baseObjects[i];
                        this._proxyEvent(baseObject);
                    }
                }
                return this;
            }
            /**
             *Events representing the merge
             * @param {*} baseObject
             */
            _proxyEvent(baseObject) {
                baseObject.on('add', (e) => {
                    this._showGeometry(e.target, true);
                });
                baseObject.on('remove', (e) => {
                    this._showGeometry(e.target, false);
                });
                baseObject.on('mouseout', (e) => {
                    this._mouseover = false;
                    this.fire('mouseout', Object.assign({}, e, { target: this, selectMesh: (this.getSelectMesh ? this.getSelectMesh() : null) }));
                    // this._showGeometry(e.target, false);
                });
                baseObject.on(EVENTS$1, (e) => {
                    this.fire(e.type, Object.assign({}, e, { target: this, selectMesh: (this.getSelectMesh ? this.getSelectMesh() : null) }));
                });
            }
            /**
             * Get the index of the monomer to be hidden
             * @param {*} attribute
             */
            _getHideGeometryIndex(attribute) {
                const indexs = [];
                let count = 0;
                for (let i = 0, len = this._geometriesAttributes.length; i < len; i++) {
                    if (this._geometriesAttributes[i].hide === true) {
                        indexs.push(i);
                        count += this._geometriesAttributes[i][attribute].count;
                    }
                }
                return {
                    indexs,
                    count
                };
            }
            /**
             * update geometry attributes
             * @param {*} bufferAttribute
             * @param {*} attribute
             */
            _updateAttribute(bufferAttribute, attribute) {
                const { indexs } = this._getHideGeometryIndex(attribute);
                const array = this._geometryCache.attributes[attribute].array;
                const len = array.length;
                for (let i = 0; i < len; i++) {
                    bufferAttribute.array[i] = array[i];
                }
                let value = NaN;
                if (this.getObject3d() instanceof THREE__namespace.LineSegments) {
                    value = 0;
                }
                for (let j = 0; j < indexs.length; j++) {
                    const index = indexs[j];
                    const { start, end } = this._geometriesAttributes[index][attribute];
                    for (let i = start; i < end; i++) {
                        bufferAttribute.array[i] = value;
                    }
                }
                return this;
            }
            /**
             * show or hide monomer
             * @param {*} baseObject
             * @param {*} isHide
             */
            _showGeometry(baseObject, isHide) {
                let index;
                if (baseObject) {
                    index = baseObject.getOptions().index;
                }
                if (index != null) {
                    const geometryAttributes = this._geometriesAttributes[index];
                    const { hide } = geometryAttributes;
                    if (hide === isHide) {
                        return this;
                    }
                    geometryAttributes.hide = isHide;
                    const buffGeom = this.getObject3d().geometry;
                    this._updateAttribute(buffGeom.attributes.position, 'position');
                    // this._updateAttribute(buffGeom.attributes.normal, 'normal', 3);
                    // this._updateAttribute(buffGeom.attributes.color, 'color', 3);
                    // this._updateAttribute(buffGeom.attributes.uv, 'uv', 2);
                    buffGeom.attributes.position.needsUpdate = true;
                    // buffGeom.attributes.color.needsUpdate = true;
                    // buffGeom.attributes.normal.needsUpdate = true;
                    // buffGeom.attributes.uv.needsUpdate = true;
                    this.isHide = isHide;
                }
                return this;
            }
            /**
             * Get selected monomer
             */
            // eslint-disable-next-line consistent-return
            getSelectMesh() {
                const index = this._getIndex();
                if (index != null) {
                    return {
                        data: this._datas[index],
                        baseObject: this._baseObjects[index]
                    };
                }
            }
            _getIndex(faceIndex) {
                if (faceIndex == null) {
                    faceIndex = this.faceIndex || this.index;
                }
                return faceIndex;
            }
            _init() {
                const pick = this.getLayer().getPick();
                this.on('add', () => {
                    pick.add(this.pickObject3d);
                });
                this.on('remove', () => {
                    pick.remove(this.pickObject3d);
                });
            }
            //Different objects need to implement their own methods
            _setPickObject3d() {
                if (!this._colorMap) {
                    return;
                }
                // multiplexing geometry
                const geometry = this._geometryCache || this.getObject3d().geometry.clone();
                const pick = this.getLayer().getPick();
                const { _geometriesAttributes } = this;
                const len = _geometriesAttributes.length;
                const colors = getGeometriesColorArray(_geometriesAttributes);
                let cIndex = 0;
                for (let i = 0; i < len; i++) {
                    const color = pick.getColor();
                    const colorIndex = color.getHex();
                    this._colorMap[colorIndex] = i;
                    const { count } = _geometriesAttributes[i].position;
                    this._datas[i].colorIndex = colorIndex;
                    for (let j = 0; j < count; j++) {
                        colors[cIndex] = color.r;
                        colors[cIndex + 1] = color.g;
                        colors[cIndex + 2] = color.b;
                        cIndex += 3;
                    }
                }
                addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
                // const material = new THREE.MeshBasicMaterial();
                // material.vertexColors = THREE.VertexColors;
                const color = pick.getColor();
                const colorIndex = color.getHex();
                const mesh = new THREE__namespace.Mesh(geometry, defaultMaterial);
                mesh.position.copy(this.getObject3d().position);
                mesh['_colorIndex'] = colorIndex;
                this.setPickObject3d(mesh);
            }
        };
    };

    const OPTIONS$d = {
        altitude: 0,
        height: 1,
        bottomHeight: 0,
        topColor: null,
        bottomColor: '#2d2f61',
    };
    const TEMP_COORD$1 = new maptalks__namespace.Coordinate(0, 0);
    class ExtrudePolygons extends MergedMixin(BaseObject) {
        constructor(polygons, options, material, layer) {
            if (!Array.isArray(polygons)) {
                polygons = [polygons];
            }
            const len = polygons.length;
            if (len === 0) {
                console.error('polygons is empty');
            }
            // const centers = [];
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0; i < len; i++) {
                const polygon = polygons[i];
                const center = (polygon.getCenter ? polygon.getCenter() : getGeoJSONCenter(polygon, TEMP_COORD$1));
                let x, y;
                if (Array.isArray(center)) {
                    x = center[0];
                    y = center[1];
                }
                else if (center instanceof maptalks__namespace.Coordinate) {
                    x = center.x;
                    y = center.y;
                }
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            // Get the center point of the point set
            const center = new maptalks__namespace.Coordinate((minX + maxX) / 2, (minY + maxY) / 2);
            options = maptalks__namespace.Util.extend({}, OPTIONS$d, options, { layer, polygons, coordinate: center });
            const { topColor, bottomColor, altitude, asynchronous } = options;
            let bufferGeometry;
            const extrudePolygons = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                ExtrudePolygonsTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: polygons,
                    baseObject: this
                });
            }
            else {
                const centerPt = layer.coordinateToVector3(center);
                const geometries = [];
                let psIndex = 0;
                const altCache = {};
                for (let i = 0; i < len; i++) {
                    const polygon = polygons[i];
                    const properties = (isGeoJSONPolygon(polygon) ? polygon['properties'] : polygon.getProperties() || {});
                    const height = properties.height || 1;
                    const bottomHeight = properties.bottomHeight || 0;
                    const buffGeom = getExtrudeGeometryParams(polygon, height, layer, center, centerPt, altCache);
                    geometries.push(buffGeom);
                    const minZ = setBottomHeight(buffGeom, bottomHeight, layer, altCache);
                    // const extrudePolygon = new ExtrudePolygon(polygon, Object.assign({}, options, { height, index: i }), material, layer);
                    // extrudePolygons.push(extrudePolygon);
                    const { position, normal, uv, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3; uv.length / 2;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ + altCache[height] / 2,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // // color: {
                        // //     count: colorCount,
                        // //     start: colorIndex,
                        // //     end: colorIndex + colorCount * 3,
                        // // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
                if (topColor) {
                    initVertexColors(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                    material.vertexColors = getVertexColors();
                }
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudePolygons;
            this._datas = polygons;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudePolygons);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'ExtrudePolygons';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const polygon = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONPolygon(polygon) ? polygon.properties : polygon.getProperties(), { index });
                    this._baseObjects[index] = new ExtrudePolygon(polygon, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            object3d.geometry = bufferGeometry;
            object3d.material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    function positionsConvert(worldPoints, altitude = 0, layer) {
        const vectors = [], cache = {};
        for (let i = 0, len = worldPoints.length; i < len; i += 3) {
            let x = worldPoints[i], y = worldPoints[i + 1], z = worldPoints[i + 2];
            if (altitude > 0) {
                z += altitudeToVector3(altitude, layer, cache);
            }
            vectors.push(new THREE__namespace.Vector3(x, y, z));
        }
        return vectors;
    }
    function vectors2Pixel(worldPoints, size, camera, altitude = 0, layer) {
        if (!(worldPoints[0] instanceof THREE__namespace.Vector3)) {
            worldPoints = positionsConvert(worldPoints, altitude, layer);
        }
        const pixels = worldPoints.map(worldPoint => {
            return vector2Pixel(worldPoint, size, camera);
        });
        return pixels;
    }
    // eslint-disable-next-line camelcase
    function vector2Pixel(world_vector, size, camera) {
        // eslint-disable-next-line camelcase
        const vector = world_vector.project(camera);
        const halfWidth = size.width / 2;
        const halfHeight = size.height / 2;
        const result = {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight)
        };
        return result;
    }

    var IdentifyUtil = /*#__PURE__*/Object.freeze({
        __proto__: null,
        vectors2Pixel: vectors2Pixel,
        vector2Pixel: vector2Pixel
    });

    const OPTIONS$c = {
        altitude: 0,
        height: 0,
        color: null
    };
    const vector$1 = new THREE__namespace.Vector3();
    class Point extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$c, options, { layer, coordinate });
            super();
            let { height, altitude, color, size } = options;
            const vs = [], colors = [];
            if (color) {
                color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                colors.push(color.r, color.g, color.b);
            }
            const z = layer.altitudeToVector3(height, height).x;
            const v = layer.coordinateToVector3(coordinate, z);
            vs.push(0, 0, v.z);
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.Float32BufferAttribute(vs, 3, true));
            if (colors.length) {
                addAttribute(geometry, 'color', new THREE__namespace.Float32BufferAttribute(colors, 3, true));
            }
            if (size !== undefined) {
                addAttribute(geometry, 'size', new THREE__namespace.Float32BufferAttribute([size], 1, true));
            }
            options.positions = v;
            this._initOptions(options);
            this._createPoints(geometry, material);
            const z1 = layer.altitudeToVector3(altitude, altitude).x;
            const v1 = new THREE__namespace.Vector3(v.x, v.y, z1);
            this.getObject3d().position.copy(v1);
            this.type = 'Point';
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         */
        identify(coordinate) {
            const layer = this.getLayer(), size = this.getMap().getSize(), camera = this.getLayer().getCamera(), positions = this.getOptions().positions, altitude = this.getOptions().altitude;
            //Size of points
            let pointSize = this.getObject3d().material.size;
            if (pointSize === undefined) {
                pointSize = this.options.size || 1;
            }
            const pixel = this.getMap().coordToContainerPoint(coordinate);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            vector$1.x = positions.x;
            vector$1.y = positions.y;
            vector$1.z = positions.z + z;
            //3D vector to screen coordinates
            const p = vector2Pixel(vector$1, size, camera);
            //Distance between two points
            const distance = Math.sqrt(Math.pow(pixel.x - p.x, 2) + Math.pow(pixel.y - p.y, 2));
            return (distance <= pointSize / 2);
        }
    }

    const ROW = 30, COL = 30;
    function contains(b, p) {
        const { minx, miny, maxx, maxy } = b;
        const [x, y] = p;
        if (minx <= x && x <= maxx && miny <= y && y <= maxy) {
            return true;
        }
        return false;
    }
    class BBox {
        constructor(minlng, minlat, maxlng, maxlat) {
            this.minlng = minlng;
            this.minlat = minlat;
            this.maxlng = maxlng;
            this.maxlat = maxlat;
            this.minx = Infinity;
            this.miny = Infinity;
            this.maxx = -Infinity;
            this.maxy = -Infinity;
            this.coordinates = [];
            this.positions = [];
            this.indexs = [];
            this.key = null;
        }
        /**
         *
         * @param {*} map
         */
        updateBBoxPixel(map) {
            let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
            const { minlng, minlat, maxlng, maxlat } = this;
            [
                [minlng, minlat],
                [minlng, maxlat],
                [maxlng, minlat],
                [maxlng, maxlat]
            ].map(lnglat => {
                return new maptalks__namespace.Coordinate(lnglat);
            }).map(coordinate => {
                return map.coordToContainerPoint(coordinate);
            }).forEach(pixel => {
                minx = Math.min(minx, pixel.x);
                miny = Math.min(miny, pixel.y);
                maxx = Math.max(maxx, pixel.x);
                maxy = Math.max(maxy, pixel.y);
            });
            this.minx = minx;
            this.miny = miny;
            this.maxx = maxx;
            this.maxy = maxy;
            return this;
        }
        /**
         *Determine whether a point is included
         * @param {*} c
         */
        containsCoordinate(c) {
            let lng, lat;
            if (Array.isArray(c)) {
                lng = c[0];
                lat = c[1];
            }
            else if (c instanceof maptalks__namespace.Coordinate) {
                lng = c.x;
                lat = c.y;
            }
            const { minlng, minlat, maxlng, maxlat } = this;
            return (minlng <= lng && lng <= maxlng && minlat <= lat && lat <= maxlat);
        }
        /**
         *Judge rectangle intersection
         * @param {*} pixel
         * @param {*} size
         */
        isRecCross(pixel, size) {
            const { x, y } = pixel;
            const rec = {
                minx: x - size / 2,
                miny: y - size / 2,
                maxx: x + size / 2,
                maxy: y + size / 2
            };
            const { minx, miny, maxx, maxy } = rec;
            if (contains(this, [minx, miny]) ||
                contains(this, [minx, maxy]) ||
                contains(this, [maxx, miny]) ||
                contains(this, [maxx, maxy]) ||
                contains(rec, [this.minx, this.miny]) ||
                contains(rec, [this.minx, this.maxy]) ||
                contains(rec, [this.maxx, this.miny]) ||
                contains(rec, [this.maxx, this.maxy])) {
                return true;
            }
            return false;
        }
        /**
         *generate grids
         * @param {*} minlng
         * @param {*} minlat
         * @param {*} maxlng
         * @param {*} maxlat
         */
        static initGrids(minlng, minlat, maxlng, maxlat) {
            const grids = [], offsetX = maxlng - minlng, offsetY = maxlat - minlat;
            const averageX = offsetX / COL, averageY = offsetY / ROW;
            let x = minlng, y = minlat;
            for (let i = 0; i < COL; i++) {
                x = minlng + i * averageX;
                for (let j = 0; j < ROW; j++) {
                    y = minlat + j * averageY;
                    const bounds = new BBox(x, y, x + averageX, y + averageY);
                    bounds.key = j + '-' + i;
                    grids.push(bounds);
                }
            }
            return { grids, averageX, averageY, ROWS: ROW, COLS: COL };
        }
    }

    const OPTIONS$b = {
        altitude: 0
    };
    const vector = new THREE__namespace.Vector3();
    function roundFun(value, n) {
        const tempValue = Math.pow(10, n);
        return Math.round(value * tempValue) / tempValue;
    }
    /**
     *points
     */
    class Points extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$b, options, { layer, points });
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0, len = points.length; i < len; i++) {
                const { coordinate } = points[i];
                let x, y;
                if (Array.isArray(coordinate)) {
                    x = coordinate[0];
                    y = coordinate[1];
                }
                else if (coordinate instanceof maptalks__namespace.Coordinate) {
                    x = coordinate.x;
                    y = coordinate.y;
                }
                points[i].coords = [x, y];
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            const centerPt = layer.coordinateToVector3([(minX + maxX) / 2, (minY + maxY) / 2]);
            const { grids, averageX, averageY, ROWS, COLS } = BBox.initGrids(minX, minY, maxX, maxY);
            grids.length;
            const vs = new Float32Array(points.length * 3), vectors = [], colors = new Float32Array(points.length * 3), sizes = new Float32Array(points.length), pointMeshes = [], geometriesAttributes = [];
            const cache = {};
            let maxSize = 0;
            let hasColor = false, hasSize = false;
            const TEMP_VECTOR = new THREE__namespace.Vector3(0, 0, 0);
            for (let i = 0, len = points.length; i < len; i++) {
                let { coordinate, height, color, size, coords } = points[i];
                const idx = i * 3;
                if (color) {
                    hasColor = true;
                    color = (color instanceof THREE__namespace.Color ? color : new THREE__namespace.Color(color));
                    colors[idx] = color.r;
                    colors[idx + 1] = color.g;
                    colors[idx + 2] = color.b;
                }
                if (size) {
                    hasSize = true;
                    sizes[i] = size;
                    maxSize = Math.max(maxSize, size);
                }
                const z = altitudeToVector3(height, layer, cache);
                const v = layer.coordinateToVector3(coordinate, z);
                TEMP_VECTOR.x = v.x;
                TEMP_VECTOR.y = v.y;
                TEMP_VECTOR.z = v.z;
                TEMP_VECTOR.sub(centerPt);
                // const v1 = v.clone().sub(centerPt);
                vs[idx] = TEMP_VECTOR.x;
                vs[idx + 1] = TEMP_VECTOR.y;
                vs[idx + 2] = TEMP_VECTOR.z;
                vectors.push(v);
                geometriesAttributes[i] = {
                    position: {
                        count: 1,
                        start: i * 3,
                        end: i * 3 + 3
                    },
                    hide: false
                };
                let row = roundFun(((coords[1] - minY) / averageY), 4);
                let col = roundFun(((coords[0] - minX) / averageX), 4);
                row -= 1;
                col -= 1;
                row = Math.max(0, row);
                col = Math.max(0, col);
                row = Math.ceil(row);
                col = Math.ceil(col);
                const gridIndex = col * ROWS + row;
                if (grids[gridIndex]) {
                    grids[gridIndex].positions.push(v);
                    grids[gridIndex].indexs.push(i);
                }
                // for (let j = 0; j < gridslen; j++) {
                //     if (grids[j].containsCoordinate(coordinate)) {
                //         // grids[j].coordinates.push(coordinate);
                //         grids[j].positions.push(v);
                //         grids[j].indexs.push(i);
                //         console.log(j, gridIndex);
                //         break;
                //     }
                // }
            }
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(vs, 3, true));
            if (hasColor) {
                addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            }
            if (hasSize) {
                addAttribute(geometry, 'size', new THREE__namespace.BufferAttribute(sizes, 1, true));
            }
            //for identify
            options.positions = vectors;
            super();
            this._initOptions(options);
            this._createPoints(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            this._baseObjects = pointMeshes;
            this._datas = points;
            this.faceIndex = null;
            this._geometriesAttributes = geometriesAttributes;
            this._geometryCache = geometry.clone();
            this.isHide = false;
            this._initBaseObjectsEvent(pointMeshes);
            this._grids = grids;
            this._bindMapEvents();
            this.type = 'Points';
            this.maxSize = maxSize;
        }
        _bindMapEvents() {
            const map = this.getMap();
            const events = 'zoomstart zooming zoomend movestart moving moveend pitch rotate';
            this.on('add', () => {
                this._updateGrids();
                map.on(events, this._updateGrids, this);
            });
            this.on('remove', () => {
                map.off(events, this._updateGrids, this);
            });
        }
        _updateGrids() {
            const map = this.getMap();
            this._grids.forEach(b => {
                if (b.indexs.length) {
                    b.updateBBoxPixel(map);
                }
            });
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this.faceIndex;
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const data = this._datas[index];
                    const { coordinate, height, color, size } = data;
                    this._baseObjects[index] = new Point(coordinate, { height, index, color, size }, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        /**
       *
       * @param {maptalks.Coordinate} coordinate
       */
        identify(coordinate) {
            const layer = this.getLayer(), size = this.getMap().getSize(), camera = this.getLayer().getCamera(), altitude = this.getOptions().altitude, map = this.getMap();
            const z = layer.altitudeToVector3(altitude, altitude).x;
            let pointSize = this.getObject3d().material.size;
            const isDynamicSize = pointSize === undefined;
            const pixel = map.coordToContainerPoint(coordinate);
            const bs = [];
            this._grids.forEach(b => {
                if (b.indexs.length) {
                    if (b.isRecCross(pixel, isDynamicSize ? this.maxSize : pointSize)) {
                        bs.push(b);
                    }
                }
            });
            if (bs.length < 1) {
                return false;
            }
            for (let i = 0, len = bs.length; i < len; i++) {
                for (let len1 = bs[i].positions.length, j = len1 - 1; j >= 0; j--) {
                    if (isDynamicSize) {
                        pointSize = this._datas[bs[i].indexs[j]].size || 1;
                    }
                    const v = bs[i].positions[j];
                    vector.x = v.x;
                    vector.y = v.y;
                    vector.z = v.z + z;
                    const p = vector2Pixel(vector, size, camera);
                    const distance = Math.sqrt(Math.pow(pixel.x - p.x, 2) + Math.pow(pixel.y - p.y, 2));
                    if (distance <= pointSize / 2) {
                        this.faceIndex = bs[i].indexs[j];
                        return true;
                    }
                }
            }
            return false;
        }
    }

    const OPTIONS$a = {
        coordinate: '',
        radius: 10,
        height: 100,
        radialSegments: 6,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
    };
    /**
     * merged bars
     */
    class Bars extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            const len = points.length;
            const center = getCenterOfPoints(points);
            const centerPt = layer.coordinateToVector3(center);
            const geometries = [], bars = [], geometriesAttributes = [];
            let psIndex = 0;
            const cache = {}, altCache = {};
            for (let i = 0; i < len; i++) {
                const opts = maptalks__namespace.Util.extend({ index: i }, OPTIONS$a, points[i]);
                const { radius, radialSegments, altitude, topColor, bottomColor, height, coordinate } = opts;
                const r = distanceToVector3(radius, layer, cache);
                const h = altitudeToVector3(height, layer, altCache);
                const alt = altitudeToVector3(altitude, layer, altCache);
                const buffGeom = getGeometry({ radius: r, height: h, radialSegments });
                if (topColor) {
                    initVertexColors$1(buffGeom, bottomColor, topColor, 'z', h / 2);
                    material.vertexColors = getVertexColors();
                }
                // buffGeom.rotateX(Math.PI / 2);
                const v = layer.coordinateToVector3(coordinate).sub(centerPt);
                const parray = buffGeom.attributes.position.array;
                for (let j = 0, len1 = parray.length; j < len1; j += 3) {
                    parray[j + 2] += alt;
                    parray[j] += v.x;
                    parray[j + 1] += v.y;
                    parray[j + 2] += v.z;
                }
                geometries.push(buffGeom);
                const bar = new Bar(coordinate, opts, material, layer);
                bars.push(bar);
                buffGeom.index.count / 3;
                const psCount = buffGeom.attributes.position.count; 
                //  colorCount = buffGeom.attributes.color.count,
                buffGeom.attributes.normal.count; buffGeom.attributes.uv.count;
                geometriesAttributes[i] = {
                    position: {
                        count: psCount,
                        start: psIndex,
                        end: psIndex + psCount * 3,
                    },
                    // normal: {
                    //     count: normalCount,
                    //     start: normalIndex,
                    //     end: normalIndex + normalCount * 3,
                    // },
                    // // color: {
                    // //     count: colorCount,
                    // //     start: colorIndex,
                    // //     end: colorIndex + colorCount * 3,
                    // // },
                    // uv: {
                    //     count: uvCount,
                    //     start: uvIndex,
                    //     end: uvIndex + uvCount * 2,
                    // },
                    hide: false
                };
                psIndex += psCount * 3;
            }
            super();
            options = maptalks__namespace.Util.extend({}, { altitude: 0, layer, points }, options);
            this._initOptions(options);
            const geometry = mergeBarGeometry(geometries);
            this._createMesh(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = bars;
            this._datas = points;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(geometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(bars);
            this._setPickObject3d();
            this._init();
            this.type = 'Bars';
        }
        // eslint-disable-next-line no-unused-vars
        identify() {
            return this.picked;
        }
    }

    const OPTIONS$9 = {
        width: 3,
        height: 1,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61'
    };
    class ExtrudeLines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$9, options, { layer, lineStrings, coordinate: center });
            const { altitude, topColor, bottomColor, asynchronous } = options;
            let bufferGeometry;
            const extrudeLines = [], geometriesAttributes = [];
            super();
            if (asynchronous) {
                bufferGeometry = getDefaultBufferGeometry();
                ExtrudeLinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this
                });
            }
            else {
                const geometries = [];
                let psIndex = 0;
                const cache = {}, altCache = {};
                for (let i = 0; i < len; i++) {
                    const lineString = lineStrings[i];
                    const opts = maptalks__namespace.Util.extend({}, OPTIONS$9, isGeoJSON(lineString) ? lineString['properties'] : lineString.getProperties(), { index: i });
                    const { height, width, bottomHeight } = opts;
                    const w = distanceToVector3(width, layer, cache);
                    const h = altitudeToVector3(height, layer, altCache);
                    const lls = lineStringList[i];
                    const extrudeParams = [];
                    let minZ = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const attribute = getExtrudeLineParams(lls[m], w, h, layer, center);
                        minZ = setBottomHeight(attribute, bottomHeight, layer, cache);
                        extrudeParams.push(attribute);
                    }
                    const buffGeom = mergeBufferGeometriesAttribute(extrudeParams);
                    geometries.push(buffGeom);
                    // const extrudeLine = new ExtrudeLine(lineString, opts, material, layer);
                    // extrudeLines.push(extrudeLine);
                    const { position, normal, indices } = buffGeom;
                    indices.length / 3;
                    const psCount = position.length / 3; 
                    //  colorCount = buffGeom.attributes.color.count,
                    normal.length / 3;
                    geometriesAttributes[i] = {
                        position: {
                            middleZ: minZ + h / 2,
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        // normal: {
                        //     count: normalCount,
                        //     start: normalIndex,
                        //     end: normalIndex + normalCount * 3,
                        // },
                        // color: {
                        //     count: colorCount,
                        //     start: colorIndex,
                        //     end: colorIndex + colorCount * 3,
                        // },
                        // uv: {
                        //     count: uvCount,
                        //     start: uvIndex,
                        //     end: uvIndex + uvCount * 2,
                        // },
                        hide: false
                    };
                    psIndex += psCount * 3;
                    // colorIndex += colorCount * 3;
                    // uvIndex += uvCount * 2;
                }
                bufferGeometry = mergeBufferGeometries(geometries);
                if (topColor) {
                    initVertexColors(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                    material.vertexColors = getVertexColors();
                }
            }
            this._initOptions(options);
            this._createMesh(bufferGeometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            //Face corresponding to monomer
            // this._faceMap = faceMap;
            this._baseObjects = extrudeLines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(extrudeLines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'ExtrudeLines';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = Object.assign({}, this.options, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties(), { index });
                    this._baseObjects[index] = new ExtrudeLine(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const bufferGeometry = generateBufferGeometry(result);
            this._geometryCache = generatePickBufferGeometry(bufferGeometry);
            const { topColor, bottomColor, bottomHeight, height } = this.getOptions();
            const object3d = this.getObject3d();
            const material = object3d.material;
            if (topColor) {
                initVertexColors(bufferGeometry, bottomColor, topColor, geometriesAttributes);
                material.vertexColors = getVertexColors();
            }
            this.getObject3d().geometry = bufferGeometry;
            this.getObject3d().material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$8 = {
        altitude: 0,
        colors: null
    };
    /**
     *
     */
    class Lines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$8, options, { layer, lineStrings, coordinate: center });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            let geometry;
            const lines = [], cache = {};
            let geometriesAttributes = [], psIndex = 0, positionList = [];
            if (asynchronous) {
                geometry = getDefaultLineGeometry();
                LinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    layer,
                    key: options.key,
                    center,
                    data: lineStringList,
                    lineStrings,
                    baseObject: this
                });
            }
            else {
                for (let i = 0; i < len; i++) {
                    const lls = lineStringList[i];
                    let psCount = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const properties = (isGeoJSONLine(lls[m]) ? lls[m]['properties'] : lls[m].getProperties() || {});
                        const { positions } = getLinePosition(lls[m], layer, center, false);
                        setBottomHeight(positions, properties.bottomHeight, layer, cache);
                        psCount += (positions.length / 3 * 2 - 2);
                        positionList.push(getLineSegmentPosition(positions));
                    }
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                const position = mergeLinePositions(positionList);
                geometry = new THREE__namespace.BufferGeometry();
                addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
            }
            this._createLineSegments(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = lines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this.index = null;
            this._geometryCache = geometry.clone();
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(lines);
            if (!asynchronous) {
                this._setPickObject3d();
                this._init();
            }
            this.type = 'Lines';
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = maptalks__namespace.Util.extend({}, this.getOptions(), { index }, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties());
                    this._baseObjects[index] = new Line(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        _setPickObject3d() {
            if (!this._colorMap) {
                return;
            }
            const geometry = this._geometryCache || this.getObject3d().geometry.clone();
            const pick = this.getLayer().getPick();
            const { _geometriesAttributes } = this;
            const len = _geometriesAttributes.length;
            const colors = getGeometriesColorArray(_geometriesAttributes);
            let cIndex = 0;
            for (let i = 0; i < len; i++) {
                const color = pick.getColor();
                const colorIndex = color.getHex();
                this._colorMap[colorIndex] = i;
                const { count } = _geometriesAttributes[i].position;
                this._datas[i].colorIndex = colorIndex;
                for (let j = 0; j < count; j++) {
                    colors[cIndex] = color.r;
                    colors[cIndex + 1] = color.g;
                    colors[cIndex + 2] = color.b;
                    cIndex += 3;
                }
            }
            addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            const material = this.getObject3d().material.clone();
            material.color.set('#fff');
            material.vertexColors = getVertexColors();
            const color = pick.getColor();
            const colorIndex = color.getHex();
            const mesh = new THREE__namespace.LineSegments(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh['_colorIndex'] = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        _workerLoad(result) {
            const { position, geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const geometry = new THREE__namespace.BufferGeometry();
            addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(new Float32Array(position), 3));
            this._computeLineDistances(geometry);
            this._geometryCache = geometry.clone();
            this.getObject3d().geometry = geometry;
            this.getObject3d().material.needsUpdate = true;
            this._setPickObject3d();
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    /*

    Global sharing

    */
    //Maximum concurrent
    const MAX = 10;
    const waitingQueue = [];
    const currentQueue = [];
    function getQueues() {
        return {
            waitingQueue,
            currentQueue
        };
    }
    /**
     *
     * @param {*} key
     * @param {*} url
     * @param {*} callback
     * @param {*} img
     * @param {*} vt
     */
    function pushQueue(key, url, callback, img, vt) {
        // url += `?key=${key}`;
        const q = {
            key,
            url,
            callback,
            img,
            vt
        };
        if (currentQueue.length < MAX) {
            currentQueue.push(q);
            vt.loopMessage(q);
        }
        else {
            waitingQueue.push(q);
        }
    }
    /**
     *
     * @param {*} index
     */
    function outQueue(index) {
        const callback = deleteQueueItem(waitingQueue, index);
        if (callback) {
            callback(index);
        }
    }
    /**
     *
     * @param {*} queArray
     * @param {*} index
     */
    function deleteQueueItem(queArray, index) {
        for (let i = 0, len = queArray.length; i < len; i++) {
            const q = queArray[i];
            if (q) {
                const { key, callback } = q;
                if (index === key) {
                    queArray.splice(i, 1);
                    return callback;
                }
            }
        }
        return null;
    }
    /**
     *
     * @param {*} key
     * @param {*} vt
     */
    function nextLoop(key, vt) {
        deleteQueueItem(currentQueue, key);
        if (waitingQueue.length) {
            currentQueue.push(waitingQueue[0]);
            waitingQueue.splice(0, 1);
            const last = currentQueue[currentQueue.length - 1];
            vt.loopMessage(last);
        }
    }

    const canvas$1 = document.createElement('canvas');
    const SIZE = 256;
    canvas$1.width = canvas$1.height = SIZE;
    let DEFAULT_IMAGE;
    function generateImage$1(key, debug = false) {
        if (DEFAULT_IMAGE) {
            return DEFAULT_IMAGE;
        }
        const ctx = canvas$1.getContext('2d');
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.save();
        DEFAULT_IMAGE = canvas$1.toDataURL();
        return DEFAULT_IMAGE;
    }
    function createCanvas(width = 1, height = 1) {
        let canvas;
        if (typeof document === 'undefined') ;
        else {
            canvas = document.createElement('canvas');
            if (width) {
                canvas.width = width;
            }
            if (height) {
                canvas.height = height;
            }
        }
        return canvas;
    }

    /**
     *
     */
    class BaseVectorTileLayer extends maptalks__namespace.TileLayer {
        constructor(url, options = {}) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, options));
            this._opts = null;
            this._layer = null;
            this.material = null;
            this.getMaterial = null;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._layerLaodTime = new Date().getTime();
        }
        isAsynchronous() {
            return this._opts.worker;
        }
        /**
         *get current all baseobject
         */
        getBaseObjects() {
            const loadTiles = this._loadTiles;
            const baseos = [];
            for (let key in loadTiles) {
                const baseobjects = this._baseObjectKeys[key];
                if (baseobjects && Array.isArray(baseobjects) && baseobjects.length) {
                    for (let i = 0, len = baseobjects.length; i < len; i++) {
                        baseos.push(baseobjects[i]);
                    }
                }
            }
            return baseos;
        }
        /**
       * This method should be overridden for event handling
       * @param {*} type
       * @param {*} e
       */
        // eslint-disable-next-line no-unused-vars
        onSelectMesh(type, e) {
        }
        /**
       * this is can override
       * @param {*} index
       * @param {*} json
       */
        // eslint-disable-next-line no-unused-vars
        formatBaseObjects(index, json) {
            return [];
        }
        //queue loop
        // eslint-disable-next-line no-unused-vars
        loopMessage(q) {
        }
        /**
        *
        * @param {*} q
        */
        getTileData(q) {
            const { key, url, callback, img } = q;
            maptalks__namespace.Ajax.getJSON(url, {}, function (error, res) {
                if (error) {
                    console.error(error);
                    callback(key, null, img);
                }
                else {
                    callback(key, res, img);
                }
            });
        }
        _getCurentTileKeys() {
            const tileGrids = this.getTiles().tileGrids || [];
            const keys = [], keysMap = {};
            for (let i = 0, len = tileGrids.length; i < len; i++) {
                const d = tileGrids[i];
                const tiles = d.tiles || [];
                for (let j = 0, len1 = tiles.length; j < len1; j++) {
                    const { id } = tiles[j];
                    keys.push(id);
                    keysMap[id] = true;
                }
            }
            return { keys, keysMap };
        }
        _isLoad() {
            const { keys } = this._getCurentTileKeys();
            const keys1 = Object.keys(this._renderer.tilesInView);
            if (keys.length === keys1.length) {
                return true;
            }
            return false;
        }
        _layerOnLoad() {
            // This event will be triggered multiple times per unit time
            const time = new Date().getTime();
            const offsetTime = time - this._layerLaodTime;
            if (offsetTime < 20) {
                return;
            }
            this._layerLaodTime = time;
            const tilesInView = this._renderer.tilesInView, loadTiles = this._loadTiles, threeLayer = this._layer, keys = this._baseObjectKeys;
            const tilesInViewLen = Object.keys(tilesInView).length, loadTilesLen = Object.keys(loadTiles).length;
            const needsRemoveBaseObjects = [];
            if (tilesInViewLen && loadTilesLen) {
                for (let index in loadTiles) {
                    if (!tilesInView[index]) {
                        if (keys[index]) {
                            (keys[index] || []).forEach(baseobject => {
                                needsRemoveBaseObjects.push(baseobject);
                            });
                        }
                    }
                }
            }
            if (needsRemoveBaseObjects.length) {
                threeLayer.removeMesh(needsRemoveBaseObjects, false);
            }
            if (tilesInViewLen && loadTilesLen) {
                for (let index in tilesInView) {
                    if (!loadTiles[index]) {
                        if (keys[index]) {
                            const baseobject = keys[index];
                            threeLayer.addMesh(baseobject);
                        }
                        else {
                            const { x, y, z } = this._getXYZOfIndex(index);
                            this.getTileUrl(x, y, z);
                        }
                    }
                }
            }
            this._loadTiles = Object.assign({}, tilesInView);
            this._diffCache();
        }
        _init() {
        }
        _workerLoad(e) {
            const baseobject = e.target;
            const img = baseobject._img;
            img.currentCount++;
            if (img.currentCount === img.needCount) {
                img.src = generateImage$1(img._key, this._opts.debug);
            }
        }
        _generateBaseObjects(index, res, img) {
            if (res && img) {
                const { keysMap } = this._getCurentTileKeys();
                //not in current ,ignore
                if (!keysMap[index]) {
                    img.src = generateImage$1(index, this._opts.debug);
                    return;
                }
                const baseobjects = this.formatBaseObjects(index, res);
                if (baseobjects.length) {
                    img.needCount = baseobjects.length;
                    img.currentCount = 0;
                    for (let i = 0, len = baseobjects.length; i < len; i++) {
                        const baseobject = baseobjects[i];
                        baseobject._img = img;
                        baseobject._vt = this;
                        if (!this.isVisible()) {
                            baseobject.hide();
                        }
                        this._cachetile(index, baseobject);
                        if (!baseobject.isAsynchronous()) {
                            img.currentCount++;
                        }
                    }
                    this._layer.addMesh(baseobjects, false);
                    if (img.needCount === img.currentCount) {
                        img.src = generateImage$1(index, this._opts.debug);
                    }
                    if (this.isAsynchronous()) {
                        baseobjects.filter(baseobject => {
                            return baseobject.isAsynchronous();
                        }).forEach(baseobject => {
                            baseobject.on('workerload', this._workerLoad, this);
                        });
                    }
                    else {
                        img.src = generateImage$1(index, this._opts.debug);
                    }
                }
                else {
                    img.src = generateImage$1(index, this._opts.debug);
                }
                this._loadTiles[index] = true;
            }
            else if (img) {
                img.src = generateImage$1(index, this._opts.debug);
            }
        }
        _diffCache() {
            // if (this._layer.getMap().isInteracting()) {
            //     return;
            // }
            if (Object.keys(this._baseObjectKeys).length > this._renderer.tileCache.max) {
                const tileCache = this._renderer.tileCache.data;
                const tilesInView = this._renderer.tilesInView;
                const needsRemoveBaseObjects = [];
                for (let index in this._baseObjectKeys) {
                    if (!tileCache[index] && !tilesInView[index]) {
                        (this._baseObjectKeys[index] || []).forEach(baseobject => {
                            if (baseobject.isAdd) {
                                needsRemoveBaseObjects.push(baseobject);
                            }
                        });
                        this._diposeBaseObject(index);
                        delete this._baseObjectKeys[index];
                    }
                }
                // Batch deletion can have better performance
                if (needsRemoveBaseObjects.length) {
                    this._layer.removeMesh(needsRemoveBaseObjects, false);
                }
            }
        }
        _diposeBaseObject(index) {
            const baseobjects = this._baseObjectKeys[index];
            if (baseobjects && baseobjects.length) {
                baseobjects.forEach(baseobject => {
                    baseobject.getObject3d().geometry.dispose();
                    if (baseobject._geometryCache) {
                        baseobject._geometryCache.dispose();
                    }
                    const bos = baseobject._baseObjects;
                    if (bos && bos.length) {
                        bos.forEach(bo => {
                            bo.getObject3d().geometry.dispose();
                            bo = null;
                        });
                    }
                    baseobject._datas = null;
                    baseobject._geometriesAttributes = null;
                    baseobject._faceMap = null;
                    baseobject._colorMap = null;
                    if (baseobject.pickObject3d) {
                        baseobject.pickObject3d.geometry.dispose();
                        // baseobject.pickObject3d.material.dispose();
                    }
                    baseobject = null;
                });
            }
        }
        _cachetile(index, baseobject) {
            if (!this._baseObjectKeys[index]) {
                this._baseObjectKeys[index] = [];
            }
            this._baseObjectKeys[index].push(baseobject);
        }
        _getXYZOfIndex(index) {
            const splitstr = index.indexOf('_') > -1 ? '_' : '-';
            let [y, x, z] = index.split(splitstr).slice(1, 4);
            const x1 = parseInt(x);
            const y1 = parseInt(y);
            const z1 = parseInt(z);
            return { x: x1, y: y1, z: z1 };
        }
        _getTileExtent(x, y, z) {
            const map = this.getMap(), res = map._getResolution(z), tileConfig = this._getTileConfig(), tileExtent = tileConfig.getTilePrjExtent(x, y, res);
            return tileExtent;
        }
        /**
         *
         * @param {} x
         * @param {*} y
         * @param {*} z
         */
        _getTileLngLatExtent(x, y, z) {
            const tileExtent = this._getTileExtent(x, y, z);
            let max = tileExtent.getMax(), min = tileExtent.getMin();
            const map = this.getMap();
            const projection = map.getProjection();
            min = projection.unproject(min);
            max = projection.unproject(max);
            return new maptalks__namespace.Extent(min, max);
        }
    }

    const OPTIONS$7 = {
        worker: false
    };
    /**
     *Provide a simple data loading layer with large amount of data
     */
    class ThreeVectorTileLayer extends BaseVectorTileLayer {
        constructor(url, options = {}, getMaterial, layer) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, OPTIONS$7, options));
            this._opts = options;
            this._layer = layer;
            this.getMaterial = getMaterial;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._layerLaodTime = new Date().getTime();
            this._init();
        }
        /**
         * this is can override
         * @param {*} index
         * @param {*} json
         */
        formatBaseObjects(index, json) {
            const opts = this._opts, baseobjects = [];
            const asynchronous = this.isAsynchronous();
            for (let layerName in json) {
                const geojson = json[layerName] || {};
                let features;
                if (Array.isArray(geojson)) {
                    features = geojson;
                }
                else if (geojson.type === 'FeatureCollection') {
                    features = geojson.features;
                }
                if (features && features.length) {
                    const polygons = [], lineStrings = [], points = [];
                    for (let i = 0, len = features.length; i < len; i++) {
                        const feature = features[i];
                        if (isGeoJSONPolygon(feature)) {
                            polygons.push(feature);
                        }
                        else if (isGeoJSONLine(feature)) {
                            const fs = spliteGeoJSONMulti(feature);
                            for (let j = 0, len1 = fs.length; j < len1; j++) {
                                lineStrings.push(fs[j]);
                            }
                        }
                        else if (isGeoJSONPoint(feature)) {
                            const fs = spliteGeoJSONMulti(feature);
                            for (let j = 0, len1 = fs.length; j < len1; j++) {
                                points.push(maptalks__namespace.Util.extend({}, fs[j].properties, fs[j], { coordinate: getGeoJSONCoordinates(fs[j]) }));
                            }
                        }
                    }
                    if (polygons.length) {
                        const material = this._getMaterial(layerName, polygons, index, geojson);
                        if (material) {
                            const extrudepolygons = this._layer.toExtrudePolygons(polygons, maptalks__namespace.Util.extend({}, { topColor: '#fff', layerName, asynchronous, key: index }, opts), material);
                            baseobjects.push(extrudepolygons);
                        }
                    }
                    if (lineStrings.length) {
                        const material = this._getMaterial(layerName, lineStrings, index, geojson);
                        if (material && (material instanceof THREE__namespace.LineBasicMaterial || material instanceof THREE__namespace.LineDashedMaterial)) {
                            const lines = this._layer.toLines(lineStrings, maptalks__namespace.Util.extend({}, { layerName, asynchronous }, opts), material);
                            baseobjects.push(lines);
                        }
                    }
                    if (points.length) {
                        const material = this._getMaterial(layerName, points, index, geojson);
                        if (material && material instanceof THREE__namespace.PointsMaterial) {
                            const ps = this._layer.toPoints(points, maptalks__namespace.Util.extend({}, { layerName, asynchronous }, opts), material);
                            baseobjects.push(ps);
                        }
                    }
                }
            }
            return baseobjects;
        }
        //queue loop
        loopMessage(q) {
            const { currentQueue } = getQueues();
            if (currentQueue.length > 0) {
                this.getTileData(q);
            }
        }
        _init() {
            this.on('layerload', this._layerOnLoad);
            this.on('add', () => {
                if (this._add === false) {
                    const baseobjects = this.getBaseObjects();
                    this._layer.addMesh(baseobjects);
                }
                this._add = true;
                /**
                 * layerload have a bug ,Sometimes it doesn't trigger,I don't know why
                 * Add heartbeat detection mechanism
                 */
                this.intervalId = setInterval(() => {
                    if (this._isLoad() && (!this._layer.getMap().isInteracting())) {
                        this.fire('layerload');
                    }
                }, 1000);
            });
            this.on('remove', () => {
                this._add = false;
                const baseobjects = this.getBaseObjects();
                this._layer.removeMesh(baseobjects);
                clearInterval(this.intervalId);
            });
            this.on('show', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.show();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.show();
                    });
                }
            });
            this.on('hide', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.hide();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.hide();
                    });
                }
            });
            this.on('renderercreate', (e) => {
                e.renderer.loadTile = function loadTile(tile) {
                    var tileSize = this.layer.getTileSize();
                    var tileImage = new Image();
                    tileImage.width = tileSize['width'];
                    tileImage.height = tileSize['height'];
                    tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
                    tileImage.onerror = this.onTileError.bind(this, tileImage, tile);
                    this.loadTileImage(tileImage, tile['url'], tile.id);
                    return tileImage;
                };
                e.renderer.deleteTile = function (tile) {
                    if (!tile || !tile.image) {
                        return;
                    }
                    tile.image.onload = null;
                    tile.image.onerror = null;
                    const tileinfo = tile.info || {};
                    outQueue(tileinfo.id);
                };
                e.renderer.loadTileImage = (img, url, key) => {
                    img._key = key;
                    pushQueue(key, url, (index, json, image) => {
                        // img.src = generateImage(key, this._opts.debug);
                        this._generateBaseObjects(index, json, image);
                        nextLoop(index, this);
                    }, img, this);
                };
            });
        }
        _getMaterial(layerName, data, index, geojson) {
            if (this.getMaterial && maptalks__namespace.Util.isFunction(this.getMaterial)) {
                return this.getMaterial(layerName, data, index, geojson);
            }
            return null;
        }
    }

    function getPlaneGeometryAttribute(width, height, devideW, devideH) {
        const dx = width / devideW, dy = height / devideH;
        const minX = -width / 2, maxY = height / 2, minY = -height / 2;
        const len = (devideW + 1) * (devideH + 1);
        const position = new Float32Array(len * 3), uv = new Float32Array(len * 2), normal = new Float32Array(len * 3), tempIndex = new Uint32Array(len * 10);
        let index = 0, uIndex = 0, iIndex = 0;
        for (let j = 0; j <= devideH; j++) {
            for (let i = 0; i <= devideW; i++) {
                const x = minX + dx * i;
                const y = maxY - dy * j;
                position[index] = x;
                position[index + 1] = y;
                position[index + 2] = 0;
                normal[index] = 0;
                normal[index + 1] = 0;
                normal[index + 2] = 1;
                const uvx = (x - minX) / width, uvy = (y - minY) / height;
                uv[uIndex] = uvx;
                uv[uIndex + 1] = uvy;
                index += 3;
                uIndex += 2;
                if (i < devideW && j < devideH) {
                    const a = j * (devideW + 1) + i, b = a + 1, c = (devideW + 1) * (j + 1) + i, d = c + 1;
                    tempIndex[iIndex] = a;
                    tempIndex[iIndex + 1] = c;
                    tempIndex[iIndex + 2] = b;
                    tempIndex[iIndex + 3] = c;
                    tempIndex[iIndex + 4] = d;
                    tempIndex[iIndex + 5] = b;
                    iIndex += 6;
                }
            }
        }
        const indexArray = new Uint32Array(iIndex);
        for (let i = 0, len = indexArray.length; i < len; i++) {
            indexArray[i] = tempIndex[i];
        }
        return {
            position,
            uv,
            normal,
            indexs: indexArray
        };
    }
    function getPlaneGeometry(width, height, devideW, devideH) {
        const { position, uv, normal, indexs } = getPlaneGeometryAttribute(width, height, devideW, devideH);
        const geometry = new THREE__namespace.BufferGeometry();
        addAttribute(geometry, 'position', new THREE__namespace.BufferAttribute(position, 3));
        addAttribute(geometry, 'normal', new THREE__namespace.BufferAttribute(normal, 3));
        addAttribute(geometry, 'uv', new THREE__namespace.BufferAttribute(uv, 2));
        geometry.setIndex(new THREE__namespace.BufferAttribute(indexs, 1));
        return geometry;
    }

    // import { addAttribute } from './util/ThreeAdaptUtil';
    const textureLoader = new THREE__namespace.TextureLoader();
    const canvas = document.createElement('canvas'), tileSize = 256;
    function getRGBData(image, width = tileSize, height = tileSize) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        return ctx.getImageData(0, 0, width, height).data;
    }
    function generateImage(image) {
        if (!image) {
            return null;
        }
        let img;
        if (typeof image === 'string') {
            img = new Image();
            img.src = image;
        }
        else if (image instanceof HTMLCanvasElement) {
            img = new Image();
            img.src = image.toDataURL();
        }
        else if (image instanceof Image) {
            img = new Image();
            img.src = image.src;
            img.crossOrigin = image.crossOrigin;
        }
        if (img && !img.crossOrigin) {
            img.crossOrigin = 'Anonymous';
        }
        return img;
    }
    const OPTIONS$6 = {
        interactive: false,
        altitude: 0,
        image: null,
        imageWidth: 256,
        imageHeight: 256,
        texture: null
    };
    /**
     *
     */
    class Terrain extends BaseObject {
        constructor(extent, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$6, options, { layer, extent });
            const { texture, image, altitude, imageHeight, imageWidth } = options;
            if (!image) {
                console.error('not find image');
            }
            if (!(extent instanceof maptalks__namespace.Extent)) {
                extent = new maptalks__namespace.Extent(extent);
            }
            const { xmin, ymin, xmax, ymax } = extent;
            const coords = [
                [xmin, ymin],
                [xmin, ymax],
                [xmax, ymax],
                [xmax, ymin]
            ];
            let vxmin = Infinity, vymin = Infinity, vxmax = -Infinity, vymax = -Infinity;
            coords.forEach(coord => {
                const v = layer.coordinateToVector3(coord);
                const { x, y } = v;
                vxmin = Math.min(x, vxmin);
                vymin = Math.min(y, vymin);
                vxmax = Math.max(x, vxmax);
                vymax = Math.max(y, vymax);
            });
            const w = Math.abs(vxmax - vxmin), h = Math.abs(vymax - vymin);
            const rgbImg = generateImage(image), img = generateImage(texture);
            // const geometry = new THREE.PlaneBufferGeometry(w, h, imageWidth - 1, imageHeight - 1);
            const geometry = getPlaneGeometry(w, h, imageWidth - 1, imageHeight - 1);
            super();
            this._initOptions(options);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(extent.getCenter(), z);
            this.getObject3d().position.copy(v);
            material.transparent = true;
            if (rgbImg) {
                material.opacity = 0;
                rgbImg.onload = () => {
                    const width = imageWidth, height = imageHeight;
                    const imgdata = getRGBData(rgbImg, width, height);
                    let idx = 0;
                    const cache = {};
                    //rgb to height  https://docs.mapbox.com/help/troubleshooting/access-elevation-data/
                    for (let i = 0, len = imgdata.length; i < len; i += 4) {
                        const R = imgdata[i], G = imgdata[i + 1], B = imgdata[i + 2];
                        const height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1);
                        const z = altitudeToVector3(height, layer, cache);
                        geometry.attributes.position.array[idx * 3 + 2] = z;
                        idx++;
                    }
                    geometry.attributes.position.needsUpdate = true;
                    if (img) {
                        textureLoader.load(img.src, (texture) => {
                            material.map = texture;
                            material.opacity = 1;
                            material.needsUpdate = true;
                        });
                    }
                    else {
                        material.opacity = 1;
                    }
                };
                rgbImg.onerror = function () {
                    console.error(`not load ${rgbImg.src}`);
                };
            }
            this.type = 'Terrain';
        }
    }

    const OPTIONS$5 = {
        // worker: false
        scale: 1,
        tileDivisor: 4
    };
    /**
     *
     */
    class TerrainVectorTileLayer extends BaseVectorTileLayer {
        constructor(url, options = {}, material, layer) {
            super(maptalks__namespace.Util.GUID(), maptalks__namespace.Util.extend({ urlTemplate: url }, OPTIONS$5, options));
            this._opts = options;
            this._layer = layer;
            this.material = material;
            this._baseObjectKeys = {};
            this._loadTiles = {};
            this._add = null;
            this._imgQueue = {};
            this._layerLaodTime = new Date().getTime();
            this._init();
        }
        isAsynchronous() {
            return false;
        }
        /**
         * this is can override
         * @param {*} index
         * @param {*} json
         */
        formatBaseObjects(index, image) {
            const opts = this.options, baseobjects = [];
            const { scale, tileDivisor } = opts;
            const { x, y, z } = this._getXYZOfIndex(index);
            const zoom = this.getMap().getZoom();
            const texture = this.getTileUrl(x, y, z);
            const [imageWidth, imageHeight] = this.options.tileSize;
            const extent = this._getTileLngLatExtent(x, y, z);
            const material = this.material.clone();
            if ((z + 1) >= Math.round(zoom)) {
                const terrain = new Terrain(extent, {
                    image,
                    imageWidth: imageWidth / tileDivisor,
                    imageHeight: imageHeight / tileDivisor,
                    texture
                }, material, this._layer);
                terrain.getObject3d().scale.set(scale, scale, 1);
                baseobjects.push(terrain);
            }
            return baseobjects;
        }
        //queue loop
        loopMessage(q) {
            this.getTileData(q);
        }
        _init() {
            this.on('layerload', this._layerOnLoad);
            this.on('add', () => {
                if (this._add === false) {
                    const baseobjects = this.getBaseObjects();
                    this._layer.addMesh(baseobjects);
                }
                this._add = true;
                /**
                 * layerload have a bug ,Sometimes it doesn't trigger,I don't know why
                 * Add heartbeat detection mechanism
                 */
                this.intervalId = setInterval(() => {
                    if (this._isLoad() && (!this._layer.getMap().isInteracting())) {
                        this.fire('layerload');
                    }
                }, 1000);
            });
            this.on('remove', () => {
                this._add = false;
                const baseobjects = this.getBaseObjects();
                this._layer.removeMesh(baseobjects);
                clearInterval(this.intervalId);
            });
            this.on('show', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.show();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.show();
                    });
                }
            });
            this.on('hide', () => {
                const baseobjects = this.getBaseObjects();
                baseobjects.forEach(baseobject => {
                    baseobject.hide();
                });
                for (let key in this._baseObjectKeys) {
                    const baseobjects = this._baseObjectKeys[key] || [];
                    baseobjects.forEach(baseobject => {
                        baseobject.hide();
                    });
                }
            });
            this.on('renderercreate', (e) => {
                e.renderer.loadTile = function loadTile(tile) {
                    var tileSize = this.layer.getTileSize();
                    var tileImage = new Image();
                    tileImage.width = tileSize['width'];
                    tileImage.height = tileSize['height'];
                    tileImage.onload = this.onTileLoad.bind(this, tileImage, tile);
                    tileImage.onerror = this.onTileError.bind(this, tileImage, tile);
                    this.loadTileImage(tileImage, tile['url'], tile.id);
                    return tileImage;
                };
                e.renderer.deleteTile = (tile) => {
                    if (!tile || !tile.image) {
                        return;
                    }
                    tile.image.onload = null;
                    tile.image.onerror = null;
                    const tileinfo = tile.info || {};
                    const rgbImage = this._imgQueue[tileinfo.id];
                    if (rgbImage) {
                        rgbImage.src = '';
                        rgbImage.onload = null;
                        rgbImage.onerror = null;
                        delete this._imgQueue[tileinfo.id];
                    }
                };
                e.renderer.loadTileImage = (img, url, key) => {
                    img._key = key;
                    const rgbImage = new Image();
                    this._imgQueue[key] = rgbImage;
                    const q = {
                        key,
                        url,
                        rgbImage,
                        callback: (index, rgbImage, image) => {
                            this._generateBaseObjects(index, rgbImage, image);
                        },
                        img,
                        vt: this
                    };
                    this.loopMessage(q);
                };
            });
        }
    }

    /*!
     * Code from baidu mapv
     * License: BSD-3
     * https://github.com/huiyan-fe/mapv
     *
     */
    /**
     * Category
     * @param {Object} [options]   Available options:
     *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
     */
    function Intensity(options) {
        options = options || {};
        this.gradient = options.gradient || {
            0.25: 'rgba(0, 0, 255, 1)',
            0.55: 'rgba(0, 255, 0, 1)',
            0.85: 'rgba(255, 255, 0, 1)',
            1.0: 'rgba(255, 0, 0, 1)'
        };
        this.maxSize = options.maxSize || 35;
        this.minSize = options.minSize || 0;
        this.max = options.max || 100;
        this.min = options.min || 0;
        this.initPalette();
    }
    Intensity.prototype.setMax = function (value) {
        this.max = value || 100;
    };
    Intensity.prototype.setMin = function (value) {
        this.min = value || 0;
    };
    Intensity.prototype.setMaxSize = function (maxSize) {
        this.maxSize = maxSize || 35;
    };
    Intensity.prototype.setMinSize = function (minSize) {
        this.minSize = minSize || 0;
    };
    Intensity.prototype.initPalette = function () {
        var gradient = this.gradient;
        var canvas = createCanvas(256, 1);
        var paletteCtx = this.paletteCtx = canvas.getContext('2d');
        var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, 256, 1);
    };
    Intensity.prototype.getColor = function (value) {
        var imageData = this.getImageData(value);
        return 'rgba(' + imageData[0] + ', ' + imageData[1] + ', ' + imageData[2] + ', ' + imageData[3] / 256 + ')';
    };
    Intensity.prototype.getImageData = function (value) {
        var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;
        if (value === undefined) {
            return imageData;
        }
        var max = this.max;
        var min = this.min;
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        var index = Math.floor((value - min) / (max - min) * (256 - 1)) * 4;
        return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
    };
    /**
     * @param Number value
     * @param Number max of value
     * @param Number max of size
     * @param Object other options
     */
    Intensity.prototype.getSize = function (value) {
        var size = 0;
        var max = this.max;
        var min = this.min;
        var maxSize = this.maxSize;
        var minSize = this.minSize;
        if (value > max) {
            value = max;
        }
        if (value < min) {
            value = min;
        }
        if (max > min) {
            size = minSize + (value - min) / (max - min) * (maxSize - minSize);
        }
        else {
            return maxSize;
        }
        return size;
    };
    Intensity.prototype.getLegend = function (options) {
        var gradient = this.gradient;
        var width = options.width || 20;
        var height = options.height || 180;
        var canvas = createCanvas(width, height);
        var paletteCtx = canvas.getContext('2d');
        var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);
        for (var key in gradient) {
            lineGradient.addColorStop(parseFloat(key), gradient[key]);
        }
        paletteCtx.fillStyle = lineGradient;
        paletteCtx.fillRect(0, 0, width, height);
        return canvas;
    };

    /*!
     * Code from baidu mapv
     * License: BSD-3
     * https://github.com/huiyan-fe/mapv
     *
     */
    function createCircle(size) {
        var shadowBlur = size / 2;
        var r2 = size + shadowBlur;
        var offsetDistance = 10000;
        var circle = createCanvas(r2 * 2, r2 * 2);
        var context = circle.getContext('2d');
        context.shadowBlur = shadowBlur;
        context.shadowColor = 'black';
        context.shadowOffsetX = context.shadowOffsetY = offsetDistance;
        context.beginPath();
        context.arc(r2 - offsetDistance, r2 - offsetDistance, size, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        return circle;
    }
    function colorize(pixels, gradient, options) {
        var max = getMax(options);
        var min = getMin(options);
        var diff = max - min;
        var range = options.range || null;
        var jMin = 0;
        var jMax = 1024;
        if (range && range.length === 2) {
            jMin = (range[0] - min) / diff * 1024;
        }
        if (range && range.length === 2) {
            jMax = (range[1] - min) / diff * 1024;
        }
        var maxOpacity = options.maxOpacity || 0.8;
        var minOpacity = options.minOpacity || 0;
        // var range = options.range;
        for (var i = 3, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i] * 4; // get gradient color from opacity value
            if (pixels[i] / 256 > maxOpacity) {
                pixels[i] = 256 * maxOpacity;
            }
            if (pixels[i] / 256 < minOpacity) {
                pixels[i] = 256 * minOpacity;
            }
            if (j && j >= jMin && j <= jMax) {
                pixels[i - 3] = gradient[j];
                pixels[i - 2] = gradient[j + 1];
                pixels[i - 1] = gradient[j + 2];
            }
            else {
                pixels[i] = 0;
            }
        }
    }
    function getMax(options) {
        var max = options.max || 100;
        return max;
    }
    function getMin(options) {
        var min = options.min || 0;
        return min;
    }
    function drawGray(context, dataSet, options) {
        var max = getMax(options);
        // var min = getMin(options);
        // console.log(max)
        var size = options._size || options.size || 13;
        var circle = createCircle(size);
        var circleHalfWidth = circle.width / 2;
        var circleHalfHeight = circle.height / 2;
        var data = dataSet;
        var dataOrderByAlpha = {};
        data.forEach(function (item) {
            var count = item.count === undefined ? 1 : item.count;
            var alpha = Math.min(1, count / max).toFixed(2);
            dataOrderByAlpha[alpha] = dataOrderByAlpha[alpha] || [];
            dataOrderByAlpha[alpha].push(item);
        });
        for (var i in dataOrderByAlpha) {
            if (isNaN(i))
                continue;
            var _data = dataOrderByAlpha[i];
            context.beginPath();
            if (!options.withoutAlpha) {
                context.globalAlpha = i;
            }
            // context.strokeStyle = intensity.getColor(i * max);
            _data.forEach(function (item) {
                var coordinates = item.coordinate;
                var count = item.count === undefined ? 1 : item.count;
                context.globalAlpha = count / max;
                context.drawImage(circle, coordinates[0] - circleHalfWidth, coordinates[1] - circleHalfHeight);
            });
        }
    }
    function draw(context, data, options) {
        if (context.canvas.width <= 0 || context.canvas.height <= 0) {
            return;
        }
        var strength = options.strength || 0.3;
        context.strokeStyle = 'rgba(0,0,0,' + strength + ')';
        // var shadowCanvas = new Canvas(context.canvas.width, context.canvas.height);
        var shadowCanvas = createCanvas(context.canvas.width, context.canvas.height);
        var shadowContext = shadowCanvas.getContext('2d');
        shadowContext.scale(devicePixelRatio, devicePixelRatio);
        options = options || {};
        // var data = dataSet instanceof DataSet ? dataSet.get() : dataSet;
        context.save();
        var intensity = new Intensity({
            gradient: options.gradient
        });
        drawGray(shadowContext, data, options);
        // return false;
        if (!options.absolute) {
            var colored = shadowContext.getImageData(0, 0, context.canvas.width, context.canvas.height);
            colorize(colored.data, intensity.getImageData(), options);
            context.putImageData(colored, 0, 0);
            context.restore();
        }
        intensity = null;
        shadowCanvas = null;
    }
    var HeatMapUitl = {
        draw,
        drawGray,
        colorize
    };

    const OPTIONS$4 = {
        altitude: 0,
        interactive: false,
        min: 0,
        max: 100,
        size: 13,
        gradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)' },
        gridScale: 0.5
    };
    const CANVAS_MAX_SIZE = 2048;
    /**
     *
     */
    class HeatMap extends BaseObject {
        constructor(data, options, material, layer) {
            if (!Array.isArray(data)) {
                data = [data];
            }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            const vs = [];
            //Calculate bbox
            for (let i = 0, len = data.length; i < len; i++) {
                const { coordinate, lnglat, xy } = data[i];
                const coord = coordinate || lnglat || xy;
                if (!coord) {
                    console.warn('not find coordinate');
                    continue;
                }
                const v = layer.coordinateToVector3(coord);
                vs.push(v);
                const { x, y } = v;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
            options = maptalks__namespace.Util.extend({}, OPTIONS$4, options, { layer, points: data });
            // Calculate canvas width and height
            let { gridScale, altitude } = options;
            const offsetX = Math.abs(maxX - minX), offsetY = Math.abs(maxY - minY);
            const maxOffset = Math.max((offsetX * gridScale), (offsetY * gridScale));
            if (maxOffset > CANVAS_MAX_SIZE) {
                console.warn(`gridScale: ${gridScale} it's too big. I hope it's a smaller value,canvas max size is ${CANVAS_MAX_SIZE}* ${CANVAS_MAX_SIZE}`);
                const offset = maxOffset / gridScale;
                gridScale = CANVAS_MAX_SIZE / offset;
            }
            const canvasWidth = Math.ceil(offsetX * gridScale), canvasHeight = Math.ceil(offsetY * gridScale);
            const scaleX = canvasWidth / offsetX, scaleY = canvasHeight / offsetY;
            const pixels = [];
            for (let i = 0, len = vs.length; i < len; i++) {
                const v = vs[i];
                v.x -= minX;
                v.y -= minY;
                v.x *= scaleX;
                v.y *= scaleY;
                v.y = canvasHeight - v.y;
                //for heat draw data
                pixels.push({
                    coordinate: [v.x, v.y],
                    count: data[i].count
                });
            }
            let shadowCanvas = createCanvas(canvasWidth, canvasHeight);
            let shadowContext = shadowCanvas.getContext('2d');
            // shadowContext.scale(devicePixelRatio, devicePixelRatio);
            HeatMapUitl.drawGray(shadowContext, pixels, options);
            const colored = shadowContext.getImageData(0, 0, shadowContext.canvas.width, shadowContext.canvas.height);
            let maxAlpha = -Infinity;
            const blackps = new Float32Array(colored.data.length / 4), alphas = new Float32Array(colored.data.length / 4);
            for (let i = 3, len = colored.data.length, j = 0; i < len; i += 4) {
                const alpha = colored.data[i];
                maxAlpha = Math.max(maxAlpha, alpha);
                alphas[j] = alpha;
                //Points that do not need to be drawn
                if (alpha <= 0) {
                    blackps[j] = 1;
                }
                j++;
            }
            const intensity = new Intensity({
                gradient: options.gradient
            });
            HeatMapUitl.colorize(colored.data, intensity.getImageData(), options);
            shadowCanvas = null;
            shadowContext = null;
            // const geometry = new THREE.PlaneBufferGeometry(offsetX, offsetY, canvasWidth - 1, canvasHeight - 1);
            const geometry = getPlaneGeometry(offsetX, offsetY, canvasWidth - 1, canvasHeight - 1);
            const index = geometry.getIndex().array;
            const position = geometry.attributes.position.array;
            // Index of the points that really need to be drawn
            const colors = new Float32Array(position.length);
            const tempIndex = new Uint32Array(position.length * 6);
            const color = new THREE__namespace.Color();
            let iIndex = 0;
            for (let i = 0, len = position.length, j = 0, len1 = index.length, m = 0, len2 = colored.data.length, n = 0; i < Math.max(len, len1, len2); i += 3) {
                if (i < len) {
                    const alpha = alphas[n];
                    if (alpha > 0) {
                        position[i + 2] = alpha / maxAlpha;
                    }
                }
                if (j < len1) {
                    const a = index[j], b = index[j + 1], c = index[j + 2];
                    if ((!blackps[a]) || (!blackps[b]) || (!blackps[c])) {
                        tempIndex[iIndex] = a;
                        tempIndex[iIndex + 1] = b;
                        tempIndex[iIndex + 2] = c;
                        iIndex += 3;
                    }
                }
                if (m < len2) {
                    const r = colored.data[m], g = colored.data[m + 1], b = colored.data[m + 2]; // a = colored.data[i + 3];
                    const rgb = `rgb(${r},${g},${b})`;
                    color.setStyle(rgb);
                    colors[j] = color.r;
                    colors[j + 1] = color.g;
                    colors[j + 2] = color.b;
                }
                j += 3;
                m += 4;
                n++;
            }
            const filterIndex = new Uint32Array(iIndex);
            for (let i = 0; i < iIndex; i++) {
                filterIndex[i] = tempIndex[i];
            }
            geometry.setIndex(new THREE__namespace.BufferAttribute(filterIndex, 1));
            addAttribute(geometry, 'color', new THREE__namespace.BufferAttribute(colors, 3, true));
            material.vertexColors = getVertexColors();
            super();
            this._initOptions(options);
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            this.getObject3d().position.copy(new THREE__namespace.Vector3((minX + maxX) / 2, (minY + maxY) / 2, z));
            this.type = 'HeatMap';
        }
    }

    const color = new THREE__namespace.Color();
    let colorIndex = 1;
    /**
     *https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes_gpu.html
     */
    class GPUPick {
        constructor(layer) {
            this.object3ds = [];
            this.layer = layer;
            this.camera = layer.getCamera();
            this.renderer = layer.getThreeRenderer();
            this.pickingTexture = new THREE__namespace.WebGLRenderTarget(1, 1);
            this.pickingScene = new THREE__namespace.Scene();
        }
        getColor() {
            color.setHex(colorIndex);
            colorIndex++;
            return color;
        }
        add(object3d) {
            if (object3d) {
                const colorIndex = object3d['_colorIndex'];
                if (colorIndex) {
                    this.object3ds[colorIndex] = object3d;
                    this.pickingScene.add(object3d);
                }
            }
            return this;
        }
        remove(object3d) {
            if (object3d) {
                const colorIndex = object3d['_colorIndex'];
                if (colorIndex) {
                    this.object3ds[colorIndex] = null;
                    this.pickingScene.remove(object3d);
                }
            }
            return this;
        }
        isEmpty() {
            if (this.pickingScene.children.length === 0) {
                return true;
            }
            for (let i = 0, len = this.pickingScene.children.length; i < len; i++) {
                const mesh = this.pickingScene.children[i];
                if (mesh) {
                    const object3d = mesh['__parent'];
                    if (object3d && object3d.getOptions().interactive === true) {
                        return false;
                    }
                }
            }
            return true;
        }
        pick(pixel) {
            if (!pixel) {
                return;
            }
            if (this.isEmpty()) {
                return;
            }
            const { camera, renderer, pickingTexture, pickingScene, object3ds, layer } = this;
            const len = this.pickingScene.children.length;
            // reset all object3d picked
            for (let i = 0; i < len; i++) {
                const object3d = this.pickingScene.children[i];
                if (object3d && object3d['__parent']) {
                    object3d['__parent'].picked = false;
                }
            }
            //resize size
            const { width, height } = layer._getRenderer().canvas;
            const pw = pickingTexture.width, ph = pickingTexture.height;
            if (width !== pw || height !== ph) {
                pickingTexture.setSize(width, height);
            }
            //render the picking scene off-screen
            // set the view offset to represent just a single pixel under the mouse
            // camera.setViewOffset(width, height, mouse.x, mouse.y, 1, 1);
            // render the scene
            renderer.setRenderTarget(pickingTexture);
            renderer.clear();
            renderer.render(pickingScene, camera);
            // clear the view offset so rendering returns to normal
            // camera.clearViewOffset();
            //create buffer for reading single pixel
            const pixelBuffer = new Uint8Array(4);
            //read the pixel
            const { x, y } = pixel;
            const devicePixelRatio = window.devicePixelRatio;
            const offsetX = (x * devicePixelRatio), offsetY = (pickingTexture.height - y * devicePixelRatio);
            renderer.readRenderTargetPixels(pickingTexture, Math.round(offsetX), Math.round(offsetY), 1, 1, pixelBuffer);
            //interpret the pixel as an ID
            const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
            const object3d = object3ds[id];
            if (object3d) {
                if (object3d['__parent']) {
                    object3ds[id]['__parent'].picked = true;
                }
            }
            else {
                //for merged mesh
                for (let i = 0; i < len; i++) {
                    const object3d = this.pickingScene.children[i];
                    if (object3d && object3d['__parent']) {
                        const parent = object3d['__parent'];
                        if (parent._colorMap && parent._colorMap[id] != null) {
                            parent.picked = true;
                            parent.index = parent._colorMap[id];
                            break;
                        }
                    }
                }
            }
            renderer.setRenderTarget(null);
        }
    }

    const OPTIONS$3 = {
        bottomHeight: 0,
        altitude: 0
    };
    class FatLine extends BaseObject {
        constructor(lineString, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$3, options, { layer, lineString });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            const { lineStrings, center } = LineStringSplit(lineString);
            const geometry = new LineGeometry();
            let position;
            if (asynchronous) {
                const id = maptalks__namespace.Util.GUID();
                this.getOptions().id = id;
                this.getOptions().center = center;
                FatLineTaskIns.push({
                    id,
                    data: lineStrings,
                    lineString,
                    center,
                    layer,
                    baseObject: this
                });
            }
            else {
                const positionList = [], cache = {};
                for (let m = 0, le = lineStrings.length; m < le; m++) {
                    const positions = getLinePosition(lineStrings[m], layer, center, false).positions;
                    setBottomHeight(positions, options.bottomHeight, layer, cache);
                    positionList.push(getLineSegmentPosition(positions));
                }
                position = mergeLinePositions(positionList);
                geometry.setPositions(position);
            }
            this._setMaterialRes(layer, material);
            this._createLine2(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            if (!asynchronous) {
                this._setPickObject3d(position, material.linewidth);
                this._init();
            }
            this.type = 'FatLine';
        }
        _init() {
            const pick = this.getLayer().getPick();
            this.on('add', () => {
                pick.add(this.pickObject3d);
            });
            this.on('remove', () => {
                pick.remove(this.pickObject3d);
            });
        }
        _setMaterialRes(layer, material) {
            const map = layer.getMap();
            const size = map.getSize();
            const width = size.width, height = size.height;
            material.resolution.set(width, height);
        }
        _setPickObject3d(ps, linewidth) {
            // if (!this._colorMap) {
            //     return;
            // }
            const geometry = new LineGeometry();
            geometry.setPositions(ps);
            const pick = this.getLayer().getPick();
            const color = pick.getColor();
            const colors = [];
            for (let i = 0, len = ps.length / 3; i < len; i++) {
                colors.push(color.r, color.g, color.b);
            }
            geometry.setColors(colors);
            const material = new LineMaterial({
                color: '#fff',
                // side: THREE.BackSide,
                linewidth,
                vertexColors: getVertexColors()
            });
            this._setMaterialRes(this.getLayer(), material);
            const colorIndex = color.getHex();
            const mesh = new Line2(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh._colorIndex = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                const size = this.getMap().getSize();
                const width = size.width, height = size.height;
                material.resolution.set(width, height);
                this.getObject3d().material = material;
            }
            return this;
        }
        _workerLoad(result) {
            const position = new Float32Array(result.position);
            const object3d = this.getObject3d();
            object3d.geometry.setPositions(position);
            object3d.computeLineDistances();
            this._setPickObject3d(position, object3d.material.linewidth);
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$2 = {
        altitude: 0,
        colors: null
    };
    /**
     *
     */
    class FatLines extends MergedMixin(BaseObject) {
        constructor(lineStrings, options, material, layer) {
            if (!Array.isArray(lineStrings)) {
                lineStrings = [lineStrings];
            }
            const centers = [], lineStringList = [];
            const len = lineStrings.length;
            for (let i = 0; i < len; i++) {
                const lineString = lineStrings[i];
                const result = LineStringSplit(lineString);
                centers.push(result.center);
                lineStringList.push(result.lineStrings);
            }
            // Get the center point of the point set
            const center = getCenterOfPoints(centers);
            options = maptalks__namespace.Util.extend({}, OPTIONS$2, options, { layer, lineStrings, coordinate: center });
            super();
            this._initOptions(options);
            const { asynchronous } = options;
            const geometry = new LineGeometry();
            const lines = [], cache = {};
            let geometriesAttributes = [], psIndex = 0, positionList = [];
            let position;
            let newPosition;
            if (asynchronous) {
                FatLinesTaskIns.push({
                    id: maptalks__namespace.Util.GUID(),
                    data: lineStringList,
                    key: options.key,
                    center,
                    layer,
                    baseObject: this,
                    lineStrings
                });
            }
            else {
                //LineSegmentsGeometry
                for (let i = 0; i < len; i++) {
                    const lls = lineStringList[i];
                    let psCount = 0;
                    for (let m = 0, le = lls.length; m < le; m++) {
                        const properties = (isGeoJSONLine(lls[m]) ? lls[m]['properties'] : lls[m].getProperties() || {});
                        const { positions } = getLinePosition(lls[m], layer, center, false);
                        setBottomHeight(positions, properties.bottomHeight, layer, cache);
                        psCount += (positions.length / 3 * 2 - 2);
                        positionList.push(getLineSegmentPosition(positions));
                    }
                    geometriesAttributes[i] = {
                        position: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        instanceStart: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        instanceEnd: {
                            count: psCount,
                            start: psIndex,
                            end: psIndex + psCount * 3,
                        },
                        hide: false
                    };
                    psIndex += psCount * 3;
                }
                position = mergeLinePositions(positionList);
                geometry.setPositions(position);
            }
            this._setMaterialRes(layer, material);
            this._createLine2(geometry, material);
            const { altitude } = options;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = layer.coordinateToVector3(center, z);
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = lines;
            this._datas = lineStrings;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this.index = null;
            this._geometryCache = new LineGeometry();
            if (!asynchronous) {
                newPosition = new Float32Array(position);
                this._geometryCache.setPositions(newPosition);
            }
            this._colorMap = {};
            this.isHide = false;
            this._initBaseObjectsEvent(lines);
            if (!asynchronous) {
                this._setPickObject3d(newPosition, material.linewidth);
                this._init();
            }
            this.type = 'FatLines';
        }
        _setMaterialRes(layer, material) {
            const map = layer.getMap();
            const size = map.getSize();
            const width = size.width, height = size.height;
            material.resolution.set(width, height);
        }
        _setPickObject3d(ps, linewidth) {
            if (!this._colorMap) {
                return;
            }
            const geometry = this._geometryCache || new LineGeometry();
            geometry.setPositions(ps);
            const pick = this.getLayer().getPick();
            const { _geometriesAttributes } = this;
            const colors = getGeometriesColorArray(_geometriesAttributes);
            let cIndex = 0;
            for (let i = 0, len = _geometriesAttributes.length; i < len; i++) {
                const color = pick.getColor();
                const colorIndex = color.getHex();
                this._colorMap[colorIndex] = i;
                const { count } = _geometriesAttributes[i].position;
                this._datas[i].colorIndex = colorIndex;
                for (let j = 0; j < count; j++) {
                    colors[cIndex] = color.r;
                    colors[cIndex + 1] = color.g;
                    colors[cIndex + 2] = color.b;
                    cIndex += 3;
                }
            }
            geometry.setColors(colors);
            const material = new LineMaterial({
                // color: color.getStyle(),
                // side: THREE.BackSide,
                color: '#fff',
                linewidth,
                vertexColors: getVertexColors()
                // dashed: false
            });
            this._setMaterialRes(this.getLayer(), material);
            const color = pick.getColor();
            const colorIndex = color.getHex();
            const mesh = new Line2(geometry, material);
            mesh.position.copy(this.getObject3d().position);
            mesh._colorIndex = colorIndex;
            this.setPickObject3d(mesh);
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
        setSymbol(material) {
            if (material && material instanceof THREE__namespace.Material) {
                material.needsUpdate = true;
                const size = this.getMap().getSize();
                const width = size.width, height = size.height;
                material.resolution.set(width, height);
                this.getObject3d().material = material;
            }
            return this;
        }
        // eslint-disable-next-line consistent-return
        getSelectMesh() {
            const index = this._getIndex();
            if (index != null) {
                if (!this._baseObjects[index]) {
                    const lineString = this._datas[index];
                    const opts = maptalks__namespace.Util.extend({}, this.getOptions(), { index }, isGeoJSONLine(lineString) ? lineString.properties : lineString.getProperties());
                    this._baseObjects[index] = new FatLine(lineString, opts, this.getObject3d().material, this.getLayer());
                    this._proxyEvent(this._baseObjects[index]);
                }
                return {
                    data: this._datas[index],
                    baseObject: this._baseObjects[index]
                };
            }
        }
        /**
           * update geometry attributes
           * @param {*} bufferAttribute
           * @param {*} attribute
           */
        _updateAttribute(bufferAttribute, attribute) {
            const { indexs } = this._getHideGeometryIndex(attribute);
            const array = this._geometryCache.attributes[attribute].array;
            const len = array.length;
            for (let i = 0; i < len; i++) {
                bufferAttribute.array[i] = array[i];
            }
            let value = -100000;
            for (let j = 0; j < indexs.length; j++) {
                const index = indexs[j];
                const { start, end } = this._geometriesAttributes[index][attribute];
                for (let i = start; i < end; i++) {
                    bufferAttribute.array[i] = value;
                }
            }
            return this;
        }
        _showGeometry(baseObject, isHide) {
            let index;
            if (baseObject) {
                index = baseObject.getOptions().index;
            }
            if (index != null) {
                const geometryAttributes = this._geometriesAttributes[index];
                const { hide } = geometryAttributes;
                if (hide === isHide) {
                    return this;
                }
                geometryAttributes.hide = isHide;
                const buffGeom = this.getObject3d().geometry;
                this._updateAttribute(buffGeom.attributes.instanceStart, 'instanceStart');
                this._updateAttribute(buffGeom.attributes.instanceEnd, 'instanceEnd');
                // this._updateAttribute(buffGeom.attributes.instanceDistanceStart, 'instanceDistanceStart');
                // this._updateAttribute(buffGeom.attributes.instanceDistanceEnd, 'instanceDistanceEnd');
                buffGeom.attributes.instanceStart.data.needsUpdate = true;
                buffGeom.attributes.instanceEnd.data.needsUpdate = true;
                // buffGeom.attributes.instanceDistanceStart.data.needsUpdate = true;
                // buffGeom.attributes.instanceDistanceEnd.data.needsUpdate = true;
                this.isHide = isHide;
            }
            return this;
        }
        _workerLoad(result) {
            const { geometriesAttributes } = result;
            // this._faceMap = faceMap;
            this._geometriesAttributes = geometriesAttributes;
            const object3d = this.getObject3d();
            const position = new Float32Array(result.position);
            const newPosition = new Float32Array(position);
            object3d.geometry.setPositions(new Float32Array(position));
            this._geometryCache.setPositions(newPosition);
            this._setPickObject3d(newPosition, object3d.material.linewidth);
            this._init();
            if (this.isAdd) {
                const pick = this.getLayer().getPick();
                pick.add(this.pickObject3d);
            }
            this._fire('workerload', { target: this });
        }
    }

    const OPTIONS$1 = {
        radius: 10,
        height: 100,
        altitude: 0,
        topColor: '',
        bottomColor: '#2d2f61',
        heightEnable: true
    };
    class Box extends BaseObject {
        constructor(coordinate, options, material, layer) {
            options = maptalks__namespace.Util.extend({}, OPTIONS$1, options, { layer, coordinate });
            super();
            this._initOptions(options);
            const { height, radius, topColor, bottomColor, altitude } = options;
            const h = layer.altitudeToVector3(height, height).x;
            const r = layer.distanceToVector3(radius, radius).x;
            const geometry = getDefaultBoxGeometry().clone();
            geometry.scale(r * 2, r * 2, h);
            if (topColor) {
                initVertexColors$1(geometry, bottomColor, topColor, 'z', h / 2);
                material.vertexColors = getVertexColors();
            }
            this._createMesh(geometry, material);
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const position = layer.coordinateToVector3(coordinate, z);
            this.getObject3d().position.copy(position);
            this.type = 'Box';
        }
    }

    const OPTIONS = {
        radius: 10,
        height: 100,
        altitude: 0,
        topColor: null,
        bottomColor: '#2d2f61',
    };
    class Boxs extends MergedMixin(BaseObject) {
        constructor(points, options, material, layer) {
            if (!Array.isArray(points)) {
                points = [points];
            }
            const len = points.length;
            const center = getCenterOfPoints(points);
            const centerPt = layer.coordinateToVector3(center);
            const geometries = [], bars = [], geometriesAttributes = [];
            let psIndex = 0;
            const cache = {}, altCache = {};
            for (let i = 0; i < len; i++) {
                const opts = maptalks__namespace.Util.extend({ index: i }, OPTIONS, points[i]);
                const { radius, altitude, topColor, bottomColor, height, coordinate } = opts;
                const r = distanceToVector3(radius, layer, cache);
                const h = altitudeToVector3(height, layer, altCache);
                const alt = altitudeToVector3(altitude, layer, altCache);
                const buffGeom = getDefaultBoxGeometry().clone();
                buffGeom.scale(r * 2, r * 2, h);
                if (topColor) {
                    initVertexColors$1(buffGeom, bottomColor, topColor, 'z', h / 2);
                    material.vertexColors = getVertexColors();
                }
                const v = layer.coordinateToVector3(coordinate).sub(centerPt);
                const parray = buffGeom.attributes.position.array;
                for (let j = 0, len1 = parray.length; j < len1; j += 3) {
                    parray[j + 2] += alt;
                    parray[j] += v.x;
                    parray[j + 1] += v.y;
                    parray[j + 2] += v.z;
                }
                geometries.push(buffGeom);
                const bar = new Box(coordinate, opts, material, layer);
                bars.push(bar);
                buffGeom.index.count / 3;
                const psCount = buffGeom.attributes.position.count; 
                //  colorCount = buffGeom.attributes.color.count,
                buffGeom.attributes.normal.count; buffGeom.attributes.uv.count;
                geometriesAttributes[i] = {
                    position: {
                        count: psCount,
                        start: psIndex,
                        end: psIndex + psCount * 3,
                    },
                    // normal: {
                    //     count: normalCount,
                    //     start: normalIndex,
                    //     end: normalIndex + normalCount * 3,
                    // },
                    // // color: {
                    // //     count: colorCount,
                    // //     start: colorIndex,
                    // //     end: colorIndex + colorCount * 3,
                    // // },
                    // uv: {
                    //     count: uvCount,
                    //     start: uvIndex,
                    //     end: uvIndex + uvCount * 2,
                    // },
                    hide: false
                };
                psIndex += psCount * 3;
            }
            super();
            options = maptalks__namespace.Util.extend({}, { altitude: 0, layer, points }, options);
            this._initOptions(options);
            const geometry = mergeBarGeometry(geometries);
            this._createMesh(geometry, material);
            const altitude = options.altitude;
            const z = layer.altitudeToVector3(altitude, altitude).x;
            const v = centerPt.clone();
            v.z = z;
            this.getObject3d().position.copy(v);
            // this._faceMap = faceMap;
            this._baseObjects = bars;
            this._datas = points;
            this._geometriesAttributes = geometriesAttributes;
            this.faceIndex = null;
            this._geometryCache = generatePickBufferGeometry(geometry);
            this.isHide = false;
            this._colorMap = {};
            this._initBaseObjectsEvent(bars);
            this._setPickObject3d();
            this._init();
            this.type = 'Boxs';
        }
        // eslint-disable-next-line no-unused-vars
        identify(coordinate) {
            return this.picked;
        }
    }

    var earcut$2 = {exports: {}};

    earcut$2.exports = earcut;
    earcut$2.exports.default = earcut;

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode || outerNode.next === outerNode.prev) return triangles;

        var minX, minY, maxX, maxY, x, y, invSize;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area$1(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) break;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertex leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, invSize);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area$1(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area$1(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area$1(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area$1(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area$1(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return filterPoints(p);
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            outerNode = eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        var bridge = findHoleBridge(hole, outerNode);
        if (!bridge) {
            return outerNode;
        }

        var bridgeReverse = splitPolygon(bridge, hole);

        // filter collinear points around the cuts
        var filteredBridge = filterPoints(bridge, bridge.next);
        filterPoints(bridgeReverse, bridgeReverse.next);

        // Check if input node was removed by the filtering
        return outerNode === bridge ? filteredBridge : outerNode;
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m;

        do {
            if (hx >= p.x && p.x >= mx && hx !== p.x &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if (locallyInside(p, hole) &&
                    (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        } while (p !== stop);

        return m;
    }

    // whether sector in vertex m contains sector in vertex p in the same coordinates
    function sectorContainsSector(m, p) {
        return area$1(m.prev, m, p.prev) < 0 && area$1(p.next, m, m.next) < 0;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }
                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and inverse of the longer side of data bbox
    function zOrder(x, y, minX, minY, invSize) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
               (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
                (area$1(a.prev, a, b.prev) || area$1(a, b.prev, b)) || // does not create opposite-facing sectors
                equals(a, b) && area$1(a.prev, a, a.next) > 0 && area$1(b.prev, b, b.next) > 0); // special zero-length case
    }

    // signed area of a triangle
    function area$1(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        var o1 = sign(area$1(p1, q1, p2));
        var o2 = sign(area$1(p1, q1, q2));
        var o3 = sign(area$1(p2, q2, p1));
        var o4 = sign(area$1(p2, q2, q1));

        if (o1 !== o2 && o3 !== o4) return true; // general case

        if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
        if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

        return false;
    }

    // for collinear points p, q, r, check if point q lies on segment pr
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area$1(a.prev, a, a.next) < 0 ?
            area$1(a, b, a.next) >= 0 && area$1(a, a.prev, b) >= 0 :
            area$1(a, b, a.prev) < 0 || area$1(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                    (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };

    var earcut$1 = earcut$2.exports;

    /*
     (c) 2017, Vladimir Agafonkin
     Simplify.js, a high-performance JS polyline simplification library
     mourner.github.io/simplify-js
    */

    // to suit your point format, run search/replace for '.x' and '.y';
    // for 3D version, see 3d branch (configurability would draw significant performance overhead)

    // square distance between 2 points
    function getSqDist(p1, p2) {

        var dx = p1[0] - p2[0],
            dy = p1[1] - p2[1];

        return dx * dx + dy * dy;
    }

    // square distance from a point to a segment
    function getSqSegDist(p, p1, p2) {

        var x = p1[0],
            y = p1[1],
            dx = p2[0] - x,
            dy = p2[1] - y;

        if (dx !== 0 || dy !== 0) {

            var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = p2[0];
                y = p2[1];

            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = p[0] - x;
        dy = p[1] - y;

        return dx * dx + dy * dy;
    }
    // rest of the code doesn't care about point format

    // basic distance-based simplification
    function simplifyRadialDist(points, sqTolerance) {

        var prevPoint = points[0],
            newPoints = [prevPoint],
            point;

        for (var i = 1, len = points.length; i < len; i++) {
            point = points[i];

            if (getSqDist(point, prevPoint) > sqTolerance) {
                newPoints.push(point);
                prevPoint = point;
            }
        }

        if (prevPoint !== point) newPoints.push(point);

        return newPoints;
    }

    function simplifyDPStep(points, first, last, sqTolerance, simplified) {
        var maxSqDist = sqTolerance,
            index;

        for (var i = first + 1; i < last; i++) {
            var sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }

    // simplification using Ramer-Douglas-Peucker algorithm
    function simplifyDouglasPeucker(points, sqTolerance) {
        var last = points.length - 1;

        var simplified = [points[0]];
        simplifyDPStep(points, 0, last, sqTolerance, simplified);
        simplified.push(points[last]);

        return simplified;
    }

    // both algorithms combined for awesome performance
    function simplify(points, tolerance, highestQuality) {

        if (points.length <= 2) return points;

        var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

        points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
        points = simplifyDouglasPeucker(points, sqTolerance);

        return points;
    }

    function dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }
    function v2Dot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }

    function normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z);
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }

    function v2Normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const d = Math.sqrt(x * x + y * y);
        out[0] = x / d;
        out[1] = y / d;
        return out;
    }

    function scale(out, v, s) {
        out[0] = v[0] * s;
        out[1] = v[1] * s;
        out[2] = v[2] * s;
        return out;
    }

    function scaleAndAdd(out, v1, v2, s) {
        out[0] = v1[0] + v2[0] * s;
        out[1] = v1[1] + v2[1] * s;
        out[2] = v1[2] + v2[2] * s;
        return out;
    }

    function v2Add(out, v1, v2) {
        out[0] = v1[0] + v2[0];
        out[1] = v1[1] + v2[1];
        return out;
    }

    function v3Sub(out, v1, v2) {
        out[0] = v1[0] - v2[0];
        out[1] = v1[1] - v2[1];
        out[2] = v1[2] - v2[2];
        return out;
    }

    function v3Normalize(out, v) {
        const x = v[0];
        const y = v[1];
        const z = v[2];
        const d = Math.sqrt(x * x + y * y + z * z);
        out[0] = x / d;
        out[1] = y / d;
        out[2] = z / d;
        return out;
    }

    function v3Cross(out, v1, v2) {
        var ax = v1[0], ay = v1[1], az = v1[2],
            bx = v2[0], by = v2[1], bz = v2[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    const rel = [];
    // start and end must be normalized
    function slerp(out, start, end, t) {
        // https://keithmaggio.wordpress.com/2011/02/15/math-magician-lerp-slerp-and-nlerp/
        const cosT = dot(start, end);
        const theta = Math.acos(cosT) * t;

        scaleAndAdd(rel, end, start, -cosT);
        normalize(rel, rel);// start and rel Orthonormal basis

        scale(out, start, Math.cos(theta));
        scaleAndAdd(out, out, rel, Math.sin(theta));

        return out;
    }

    function lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4, out, writeOffset) {
        const dx1 = x2 - x1;
        const dx2 = x4 - x3;
        const dy1 = y2 - y1;
        const dy2 = y4 - y3;

        const cross = dy2 * dx1 - dx2 * dy1;
        const tmp1 = y1 - y3;
        const tmp2 = x1 - x3;
        const t1 = (dx2 * tmp1 - dy2 * tmp2) / cross;
        // const t2 = (dx1 * tmp1 - dy1 * tmp2) / cross;

        if (out) {
            writeOffset = writeOffset || 0;
            out[writeOffset] = x1 + t1 * (x2 - x1);
            out[writeOffset + 1] = y1 + t1 * (y2 - y1);
        }

        return t1;
    }

    function area(points, start, end) {
        // Signed polygon area
        const n = end - start;
        if (n < 3) {
            return 0;
        }
        let area = 0;
        for (let i = (end - 1) * 2, j = start * 2; j < end * 2;) {
            const x0 = points[i];
            const y0 = points[i + 1];
            const x1 = points[j];
            const y1 = points[j + 1];
            i = j;
            j += 2;
            area += x0 * y1 - x1 * y0;
        }

        return area;
    }

    // TODO fitRect x, y are negative?

    function triangulate(vertices, holes, dimensions = 2) {
        return earcut$1(vertices, holes, dimensions);
    }
    function flatten(data) {
        return earcut$1.flatten(data);
    }

    const v1 = [];
    const v2 = [];
    const v = [];

    function innerOffsetPolygon(
        vertices, out, start, end, outStart, offset, miterLimit, close,
        removeIntersections,
        // offsetLines
    ) {
        const checkMiterLimit = miterLimit != null;
        let cursor = outStart;
        let indicesMap = null;
        if (checkMiterLimit) {
            indicesMap = new Uint32Array(end - start);
        }
        let prevOffsetX;
        let prevOffsetY;
        let prevCursor;
        let tmpIntersection = [];

        for (let i = start; i < end; i++) {
            const nextIdx = i === end - 1 ? start : i + 1;
            const prevIdx = i === start ? end - 1 : i - 1;
            const x1 = vertices[prevIdx * 2];
            const y1 = vertices[prevIdx * 2 + 1];
            const x2 = vertices[i * 2];
            const y2 = vertices[i * 2 + 1];
            const x3 = vertices[nextIdx * 2];
            const y3 = vertices[nextIdx * 2 + 1];

            v1[0] = x2 - x1;
            v1[1] = y2 - y1;
            v2[0] = x3 - x2;
            v2[1] = y3 - y2;

            v2Normalize(v1, v1);
            v2Normalize(v2, v2);

            checkMiterLimit && (indicesMap[i] = cursor);

            let needCheckIntersection = false;
            let offsetX;
            let offsetY;
            if (!close && i === start) {
                v[0] = v2[1];
                v[1] = -v2[0];
                v2Normalize(v, v);
                prevOffsetX = out[cursor * 2] = x2 + v[0] * offset;
                prevOffsetY = out[cursor * 2 + 1] = y2 + v[1] * offset;
                prevCursor = cursor;

                // offsetLines && offsetLines.push([x2, y2, prevOffsetX, prevOffsetY, cursor])
                cursor++;
            }
            else if (!close && i === end - 1) {
                v[0] = v1[1];
                v[1] = -v1[0];
                v2Normalize(v, v);

                offsetX = x2 + v[0] * offset;
                offsetY = y2 + v[1] * offset;

                needCheckIntersection = true;
            }
            else {
                // PENDING Why using sub will lost the direction info.
                v2Add(v, v2, v1);
                const tmp = v[1];
                v[1] = -v[0];
                v[0] = tmp;

                v2Normalize(v, v);

                const cosA = v2Dot(v, v2);
                const sinA = Math.sqrt(1 - cosA * cosA);
                // PENDING
                // Make sure it's offset lines instead of vertices.
                const miter = offset * Math.min(10, 1 / sinA);

                const isCovex = offset * cosA < 0;

                if (checkMiterLimit && (1 / sinA) > miterLimit && isCovex) {
                    // No need to check line intersection on the outline.
                    const mx = x2 + v[0] * offset;
                    const my = y2 + v[1] * offset;
                    const halfA = Math.acos(sinA) / 2;
                    const dist = Math.tan(halfA) * Math.abs(offset);
                    out[cursor * 2] = mx + v[1] * dist;
                    out[cursor * 2 + 1] = my - v[0] * dist;
                    cursor++;
                    out[cursor * 2] = mx - v[1] * dist;
                    out[cursor * 2 + 1] = my + v[0] * dist;
                    cursor++;
                }
                else {
                    offsetX = x2 + v[0] * miter;
                    offsetY = y2 + v[1] * miter;
                    needCheckIntersection = true;
                }

                if (needCheckIntersection) {
                    // TODO Handle with whole.
                    if (removeIntersections && prevOffsetX != null) {
                        // Greedy, only check with previous offset line
                        // PENDING: Is it necessary to check with other lines?
                        const t = lineIntersection(
                            x1, y1, prevOffsetX, prevOffsetY,
                            x2, y2, offsetX, offsetY, tmpIntersection, 0
                        );
                        // Use a eplison
                        if (t >= -1e-2 && t <= 1 + 1e-2) {
                            // Update previous offset points.
                            out[prevCursor * 2] = offsetX = tmpIntersection[0];
                            out[prevCursor * 2 + 1] = offsetY = tmpIntersection[1];
                        }
                    }

                    prevOffsetX = out[cursor * 2] = offsetX;
                    prevOffsetY = out[cursor * 2 + 1] = offsetY;
                    prevCursor = cursor;

                    // offsetLines && offsetLines.push([x2, y2, offsetX, offsetY, cursor])

                    cursor++;
                }
            }
        }


        return indicesMap;
    }



    function innerOffsetPolyline(
        vertices, out, start, end, outStart, offset, miterLimit, close
    ) {
        const checkMiterLimit = miterLimit != null;
        let outOff = outStart;
        let indicesMap = null;
        if (checkMiterLimit) {
            indicesMap = new Uint32Array(end - start);
        }
        for (let i = start; i < end; i++) {
            const nextIdx = i === end - 1 ? start : i + 1;
            const prevIdx = i === start ? end - 1 : i - 1;
            const x1 = vertices[prevIdx * 2];
            const y1 = vertices[prevIdx * 2 + 1];
            const x2 = vertices[i * 2];
            const y2 = vertices[i * 2 + 1];
            const x3 = vertices[nextIdx * 2];
            const y3 = vertices[nextIdx * 2 + 1];

            v1[0] = x2 - x1;
            v1[1] = y2 - y1;
            v2[0] = x3 - x2;
            v2[1] = y3 - y2;

            v2Normalize(v1, v1);
            v2Normalize(v2, v2);

            checkMiterLimit && (indicesMap[i] = outOff);
            if (!close && i === start) {
                v[0] = v2[1];
                v[1] = -v2[0];
                v2Normalize(v, v);
                out[outOff * 2] = x2 + v[0] * offset;
                out[outOff * 2 + 1] = y2 + v[1] * offset;
                outOff++;
            }
            else if (!close && i === end - 1) {
                v[0] = v1[1];
                v[1] = -v1[0];
                v2Normalize(v, v);
                out[outOff * 2] = x2 + v[0] * offset;
                out[outOff * 2 + 1] = y2 + v[1] * offset;
                outOff++;
            }
            else {
                // PENDING Why using sub will lost the direction info.
                v2Add(v, v2, v1);
                const tmp = v[1];
                v[1] = -v[0];
                v[0] = tmp;

                v2Normalize(v, v);

                const cosA = v2Dot(v, v2);
                const sinA = Math.sqrt(1 - cosA * cosA);
                // PENDING
                const miter = offset * Math.min(10, 1 / sinA);

                const isCovex = offset * cosA < 0;

                if (checkMiterLimit && (1 / sinA) > miterLimit && isCovex) {
                    const mx = x2 + v[0] * offset;
                    const my = y2 + v[1] * offset;
                    const halfA = Math.acos(sinA) / 2;
                    const dist = Math.tan(halfA) * Math.abs(offset);
                    out[outOff * 2] = mx + v[1] * dist;
                    out[outOff * 2 + 1] = my - v[0] * dist;
                    outOff++;
                    out[outOff * 2] = mx - v[1] * dist;
                    out[outOff * 2 + 1] = my + v[0] * dist;
                    outOff++;
                }
                else {
                    out[outOff * 2] = x2 + v[0] * miter;
                    out[outOff * 2 + 1] = y2 + v[1] * miter;
                    outOff++;
                }
            }
        }

        return indicesMap;
    }

    function offsetPolygon(vertices, holes, offset, miterLimit, close) {
        const offsetVertices = miterLimit != null ? [] : new Float32Array(vertices.length);
        const exteriorSize = (holes && holes.length) ? holes[0] : vertices.length / 2;

        innerOffsetPolygon(
            vertices, offsetVertices, 0, exteriorSize, 0, offset, miterLimit, close, true
        );

        if (holes) {
            for (let i = 0; i < holes.length; i++) {
                const start = holes[i];
                const end = holes[i + 1] || vertices.length / 2;
                innerOffsetPolygon(
                    vertices, offsetVertices, start, end,
                    miterLimit != null ? offsetVertices.length / 2 : start,
                    offset, miterLimit, close, false
                );
            }
        }

        // TODO holes
        // Remove intersections of offseted polygon
        // let len = offsetLines.length;
        // let tmpIntersection = [];
        // for (let i = 0; i < len; i++) {
        //     const line1 = offsetLines[i];
        //     for (let k = i + 1; k < len; k++) {
        //         const line2 = offsetLines[k];

        //         const t = lineIntersection(
        //             line1[0], line1[1], line1[2], line1[3],
        //             line2[0], line2[1], line2[2], line2[3], tmpIntersection, 0
        //         );
        //         // Use a eplison
        //         if (t >= -1e-2 && t <= 1 + 1e-2) {
        //             const cursor1 = line1[4] * 2;
        //             const cursor2 = line2[4] * 2;
        //             // Update
        //             offsetVertices[cursor1] = offsetVertices[cursor2] = line1[2] = line2[2] = tmpIntersection[0];
        //             offsetVertices[cursor1 + 1] = offsetVertices[cursor2 + 1] = line1[3] = line2[3]= tmpIntersection[1];
        //         }
        //     }
        // }
        return offsetVertices;
    }

    function reversePoints(points, stride, start, end) {
        for (let i = 0; i < Math.floor((end - start) / 2); i++) {
            for (let j = 0; j < stride; j++) {
                const a = (i + start) * stride + j;
                const b = (end - i - 1) * stride + j;
                const tmp = points[a];
                points[a] = points[b];
                points[b] = tmp;
            }
        }

        return points;
    }

    function convertToClockwise(vertices, holes) {
        let polygonVertexCount = vertices.length / 2;
        let start = 0;
        let end = holes && holes.length ? holes[0] : polygonVertexCount;
        if (area(vertices, start, end) > 0) {
            reversePoints(vertices, 2, start, end);
        }
        for (let h = 1; h < (holes ? holes.length : 0) + 1; h++) {
            start = holes[h - 1];
            end = holes[h] || polygonVertexCount;
            if (area(vertices, start, end) < 0) {
                reversePoints(vertices, 2, start, end);
            }
        }
    }

    function normalizeOpts(opts) {

        opts.depth = opts.depth || 1;
        opts.bevelSize = opts.bevelSize || 0;
        opts.bevelSegments = opts.bevelSegments == null ? 2 : opts.bevelSegments;
        opts.smoothBevel = opts.smoothBevel || false;
        opts.simplify = opts.simplify || 0;

        if (opts.smoothSide == null) {
            opts.smoothSide = 'auto';
        }
        if (opts.smoothSideThreshold == null) {
            opts.smoothSideThreshold = 0.9;
        }

        // Normalize bevel options.
        if (typeof opts.depth === 'number') {
            opts.bevelSize = Math.min(!(opts.bevelSegments > 0) ? 0 : opts.bevelSize, opts.depth / 2);
        }
        if (!(opts.bevelSize > 0)) {
            opts.bevelSegments = 0;
        }
        opts.bevelSegments = Math.round(opts.bevelSegments);

        const boundingRect = opts.boundingRect;
        opts.translate = opts.translate || [0, 0];
        opts.scale = opts.scale || [1, 1];
        if (opts.fitRect) {
            let targetX = opts.fitRect.x == null
                ? (boundingRect.x || 0)
                : opts.fitRect.x;
            let targetY = opts.fitRect.y == null
                ? (boundingRect.y || 0)
                : opts.fitRect.y;
            let targetWidth = opts.fitRect.width;
            let targetHeight = opts.fitRect.height;
            if (targetWidth == null) {
                if (targetHeight != null) {
                    targetWidth = targetHeight / boundingRect.height * boundingRect.width;
                }
                else {
                    targetWidth = boundingRect.width;
                    targetHeight = boundingRect.height;
                }
            }
            else if (targetHeight == null) {
                targetHeight = targetWidth / boundingRect.width * boundingRect.height;
            }
            opts.scale = [
                targetWidth / boundingRect.width,
                targetHeight / boundingRect.height
            ];
            opts.translate = [
                (targetX - boundingRect.x) * opts.scale[0],
                (targetY - boundingRect.y) * opts.scale[1]
            ];
        }
    }

    function generateNormal(indices, position) {

        function v3Set(p, a, b, c) {
            p[0] = a; p[1] = b; p[2] = c;
        }

        const p1 = [];
        const p2 = [];
        const p3 = [];

        const v21 = [];
        const v32 = [];

        const n = [];

        const len = indices.length;
        const normals = new Float32Array(position.length);

        for (let f = 0; f < len;) {
            const i1 = indices[f++] * 3;
            const i2 = indices[f++] * 3;
            const i3 = indices[f++] * 3;

            v3Set(p1, position[i1], position[i1 + 1], position[i1 + 2]);
            v3Set(p2, position[i2], position[i2 + 1], position[i2 + 2]);
            v3Set(p3, position[i3], position[i3 + 1], position[i3 + 2]);

            v3Sub(v21, p1, p2);
            v3Sub(v32, p2, p3);
            v3Cross(n, v21, v32);
            // Already be weighted by the triangle area
            for (let i = 0; i < 3; i++) {
                normals[i1 + i] = normals[i1 + i] + n[i];
                normals[i2 + i] = normals[i2 + i] + n[i];
                normals[i3 + i] = normals[i3 + i] + n[i];
            }
        }

        for (var i = 0; i < normals.length;) {
            v3Set(n, normals[i], normals[i + 1], normals[i + 2]);
            v3Normalize(n, n);
            normals[i++] = n[0];
            normals[i++] = n[1];
            normals[i++] = n[2];

        }

        return normals;
    }
    // 0,0----1,0
    // 0,1----1,1
    const quadToTriangle = [
        [0, 0], [1, 0], [1, 1],
        [0, 0], [1, 1], [0, 1]
    ];

    function ringDistance(vertices, start, end) {
        let distance = 0;
        let preX = vertices[start], preY = vertices[start + 1];
        const firstX = preX, firstY = preY;
        for (let i = start + 2; i < end; i += 2) {
            const x = vertices[i], y = vertices[i + 1];
            distance += Math.sqrt((x - preX) * (x - preX) + (y - preY) * (y - preY));
            preX = x;
            preY = y;
        }
        distance += Math.sqrt((preX - firstX) * (preX - firstX) + (preY - firstY) * (preY - firstY));
        return distance;
    }

    // Add side vertices and indices. Include bevel.
    function addExtrudeSide(
        out, { vertices, topVertices, splittedMap, depth, rect }, start, end,
        cursors, opts
    ) {
        const ringVertexCount = end - start;

        const splitBevel = opts.smoothBevel ? 1 : 2;
        const bevelSize = Math.min(depth / 2, opts.bevelSize);
        const bevelSegments = opts.bevelSegments;
        const vertexOffset = cursors.vertex;
        const ringPerimeter = cursors.ringPerimeter;
        const size = Math.max(rect.width, rect.height, depth, ringPerimeter);

        function isDuplicateVertex(idx) {
            const nextIdx = (idx + 1) % ringVertexCount;
            const x0 = vertices[idx * 2];
            const y0 = vertices[idx * 2 + 1];
            const x1 = vertices[nextIdx * 2];
            const y1 = vertices[nextIdx * 2 + 1];
            return x0 === x1 && y0 === y1;
        }

        // Side vertices
        if (bevelSize > 0) {
            const v0 = [0, 0, 1];
            const v1 = [];
            const v2 = [0, 0, -1];
            const v = [];

            let ringCount = 0;
            let vLen = new Float32Array(ringVertexCount);
            for (let k = 0; k < 2; k++) {
                const z = (k === 0 ? (depth - bevelSize) : bevelSize);
                for (let s = 0; s <= bevelSegments * splitBevel; s++) {
                    let uLen = 0;
                    let prevX;
                    let prevY;
                    for (let i = 0; i < ringVertexCount; i++) {
                        const idx = (i % ringVertexCount + start) * 2;
                        const rawIdx = splittedMap ? splittedMap[idx / 2] * 2 : idx;
                        v1[0] = vertices[idx] - topVertices[rawIdx];
                        v1[1] = vertices[idx + 1] - topVertices[rawIdx + 1];
                        v1[2] = 0;
                        const l = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
                        v1[0] /= l;
                        v1[1] /= l;

                        const t = (Math.floor(s / splitBevel) + (s % splitBevel)) / bevelSegments;
                        k === 0 ? slerp(v, v0, v1, t)
                            : slerp(v, v1, v2, t);

                        const t2 = k === 0 ? t : 1 - t;
                        const a = bevelSize * Math.sin(t2 * Math.PI / 2);
                        const b = l * Math.cos(t2 * Math.PI / 2);

                        // ellipse radius
                        const r = bevelSize * l / Math.sqrt(a * a + b * b);

                        const x = v[0] * r + topVertices[rawIdx];
                        const y = v[1] * r + topVertices[rawIdx + 1];
                        const zz = v[2] * r + z;
                        out.position[cursors.vertex * 3] = x;
                        out.position[cursors.vertex * 3 + 1] = y;
                        out.position[cursors.vertex * 3 + 2] = zz;

                        // TODO Cache and optimize
                        if (i > 0) {
                            uLen += Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                        }
                        if (s > 0 || k > 0) {
                            let tmp = (cursors.vertex - ringVertexCount) * 3;
                            let prevX2 = out.position[tmp];
                            let prevY2 = out.position[tmp + 1];
                            let prevZ2 = out.position[tmp + 2];

                            vLen[i] += Math.sqrt(
                                (prevX2 - x) * (prevX2 - x)
                                + (prevY2 - y) * (prevY2 - y)
                                + (prevZ2 - zz) * (prevZ2 - zz)
                            );
                        }
                        out.uv[cursors.vertex * 2] = uLen / size;
                        out.uv[cursors.vertex * 2 + 1] = vLen[i] / size;

                        prevX = x;
                        prevY = y;
                        cursors.vertex++;

                        // Just ignore this face if vertex are duplicted in `splitVertices`
                        if (isDuplicateVertex(i)) {
                            continue;
                        }
                        if ((splitBevel > 1 && (s % splitBevel)) || (splitBevel === 1 && s >= 1)) {
                            for (let f = 0; f < 6; f++) {
                                const m = (quadToTriangle[f][0] + i) % ringVertexCount;
                                const n = quadToTriangle[f][1] + ringCount;
                                out.indices[cursors.index++] = (n - 1) * ringVertexCount + m + vertexOffset;
                            }
                        }
                    }

                    ringCount++;
                }
            }
        }
        else {
            for (let k = 0; k < 2; k++) {
                const z = k === 0 ? depth - bevelSize : bevelSize;
                let uLen = 0;
                let prevX;
                let prevY;
                for (let i = 0; i < ringVertexCount; i++) {
                    const idx = (i % ringVertexCount + start) * 2;
                    const x = vertices[idx];
                    const y = vertices[idx + 1];
                    out.position[cursors.vertex * 3] = x;
                    out.position[cursors.vertex * 3 + 1] = y;
                    out.position[cursors.vertex * 3 + 2] = z;
                    if (i > 0) {
                        uLen += Math.sqrt((prevX - x) * (prevX - x) + (prevY - y) * (prevY - y));
                    }
                    out.uv[cursors.vertex * 2] = uLen / size;
                    out.uv[cursors.vertex * 2 + 1] = z / size;
                    prevX = x;
                    prevY = y;

                    cursors.vertex++;
                }
            }
        }
        // Connect the side
        const sideStartRingN = bevelSize > 0 ? (bevelSegments * splitBevel + 1) : 1;
        for (let i = 0; i < ringVertexCount; i++) {
            // Just ignore this face if vertex are duplicted in `splitVertices`
            if (isDuplicateVertex(i)) {
                continue;
            }
            for (let f = 0; f < 6; f++) {
                const m = (quadToTriangle[f][0] + i) % ringVertexCount;
                const n = quadToTriangle[f][1] + sideStartRingN;
                out.indices[cursors.index++] = (n - 1) * ringVertexCount + m + vertexOffset;
            }
        }
    }

    function addTopAndBottom({ indices, topVertices, rect, depth }, out, cursors, opts) {
        if (topVertices.length <= 4) {
            return;
        }

        const vertexOffset = cursors.vertex;
        // Top indices
        const indicesLen = indices.length;
        for (let i = 0; i < indicesLen; i++) {
            out.indices[cursors.index++] = vertexOffset + indices[i];
        }
        const size = Math.max(rect.width, rect.height);
        // Top and bottom vertices
        for (let k = 0; k < (opts.excludeBottom ? 1 : 2); k++) {
            for (let i = 0; i < topVertices.length; i += 2) {
                const x = topVertices[i];
                const y = topVertices[i + 1];
                out.position[cursors.vertex * 3] = x;
                out.position[cursors.vertex * 3 + 1] = y;
                out.position[cursors.vertex * 3 + 2] = (1 - k) * depth;

                out.uv[cursors.vertex * 2] = (x - rect.x) / size;
                out.uv[cursors.vertex * 2 + 1] = (y - rect.y) / size;
                cursors.vertex++;
            }
        }
        // Bottom indices
        if (!opts.excludeBottom) {
            const vertexCount = topVertices.length / 2;
            for (let i = 0; i < indicesLen; i += 3) {
                for (let k = 0; k < 3; k++) {
                    out.indices[cursors.index++] = vertexOffset + vertexCount + indices[i + 2 - k];
                }
            }
        }
    }

    /**
     * Split vertices for sharp side.
     */
    function splitVertices(vertices, holes, smoothSide, smoothSideThreshold) {
        const isAutoSmooth = smoothSide == null || smoothSide === 'auto';
        if (smoothSide === true) {
            return { vertices, holes };
        }
        const newVertices = [];
        const newHoles = holes && [];
        const count = vertices.length / 2;
        const v1 = [];
        const v2 = [];

        // Map of splitted index to raw index
        const splittedMap = [];

        let start = 0;
        let end = 0;

        const polysCount = (holes ? holes.length : 0) + 1;
        for (let h = 0; h < polysCount; h++) {
            if (h === 0) {
                end = holes && holes.length ? holes[0] : count;
            }
            else {
                start = holes[h - 1];
                end = holes[h] || count;
            }

            for (let i = start; i < end; i++) {
                const x2 = vertices[i * 2];
                const y2 = vertices[i * 2 + 1];
                const nextIdx = i === end - 1 ? start : i + 1;
                const x3 = vertices[nextIdx * 2];
                const y3 = vertices[nextIdx * 2 + 1];

                if (isAutoSmooth) {
                    const prevIdx = i === start ? end - 1 : i - 1;
                    const x1 = vertices[prevIdx * 2];
                    const y1 = vertices[prevIdx * 2 + 1];

                    v1[0] = x1 - x2;
                    v1[1] = y1 - y2;
                    v2[0] = x3 - x2;
                    v2[1] = y3 - y2;

                    v2Normalize(v1, v1);
                    v2Normalize(v2, v2);

                    const angleCos = v2Dot(v1, v2) * 0.5 + 0.5;

                    if ((1 - angleCos) > smoothSideThreshold) {
                        newVertices.push(x2, y2);
                        splittedMap.push(i);
                    }
                    else {
                        newVertices.push(x2, y2, x2, y2);
                        splittedMap.push(i, i);
                    }
                }
                else {
                    newVertices.push(x2, y2, x2, y2);
                    splittedMap.push(i, i);
                }
            }

            if (h < polysCount - 1 && newHoles) {
                newHoles.push(newVertices.length / 2);
            }
        }

        return {
            vertices: new Float32Array(newVertices),
            splittedMap,
            holes: newHoles
        };
    }

    function innerExtrudeTriangulatedPolygon(preparedData, opts) {
        let indexCount = 0;
        let vertexCount = 0;

        for (let p = 0; p < preparedData.length; p++) {
            const { indices, vertices, splittedMap, topVertices, depth } = preparedData[p];
            const bevelSize = Math.min(depth / 2, opts.bevelSize);
            const bevelSegments = !(bevelSize > 0) ? 0 : opts.bevelSegments;

            const holes = preparedData[p].holes || [];

            indexCount += indices.length * (opts.excludeBottom ? 1 : 2);
            vertexCount += topVertices.length / 2 * (opts.excludeBottom ? 1 : 2);
            const ringCount = 2 + bevelSegments * 2;

            let start = 0;
            let end = 0;
            for (let h = 0; h < holes.length + 1; h++) {
                if (h === 0) {
                    end = holes.length ? holes[0] : vertices.length / 2;
                }
                else {
                    start = holes[h - 1];
                    end = holes[h] || vertices.length / 2;
                }

                const faceEnd = splittedMap ? splittedMap[end - 1] + 1 : end;
                const faceStart = splittedMap ? splittedMap[start] : start;
                indexCount += (faceEnd - faceStart) * 6 * (ringCount - 1);

                const sideRingVertexCount = end - start;
                vertexCount += sideRingVertexCount * ringCount
                    // Double the bevel vertex number if not smooth
                    + (!opts.smoothBevel ? bevelSegments * sideRingVertexCount * 2 : 0);
            }
        }

        const data = {
            position: new Float32Array(vertexCount * 3),
            indices: new (vertexCount > 0xffff ? Uint32Array : Uint16Array)(indexCount),
            uv: new Float32Array(vertexCount * 2)
        };

        const cursors = {
            vertex: 0, index: 0, ringPerimeter: 0
        };

        for (let d = 0; d < preparedData.length; d++) {
            addTopAndBottom(preparedData[d], data, cursors, opts);
        }

        for (let d = 0; d < preparedData.length; d++) {
            const { holes, vertices } = preparedData[d];
            const vertexCount = vertices.length / 2;

            let start = 0;
            let end = (holes && holes.length) ? holes[0] : vertexCount;
            cursors.ringPerimeter = ringDistance(preparedData[d].topVertices, start, end);
            // Add exterior
            addExtrudeSide(data, preparedData[d], start, end, cursors, opts);
            // Add holes
            if (holes) {
                for (let h = 0; h < holes.length; h++) {
                    start = holes[h];
                    end = holes[h + 1] || vertexCount;
                    cursors.ringPerimeter = ringDistance(preparedData[d].topVertices, start, end);
                    addExtrudeSide(data, preparedData[d], start, end, cursors, opts);
                }
            }
        }

        // Wrap uv
        for (let i = 0; i < data.uv.length; i++) {
            const val = data.uv[i];
            if (val > 0 && Math.round(val) === val) {
                data.uv[i] = 1;
            }
            else {
                data.uv[i] = val % 1;
            }
        }

        data.normal = generateNormal(data.indices, data.position);
        // PENDING
        data.boundingRect = preparedData[0] && preparedData[0].rect;

        return data;
    }

    function convertPolylineToTriangulatedPolygon(polyline, polylineIdx, opts) {
        const lineWidth = opts.lineWidth;
        const pointCount = polyline.length;
        const points = new Float32Array(pointCount * 2);
        const translate = opts.translate || [0, 0];
        const scale = opts.scale || [1, 1];
        for (let i = 0, k = 0; i < pointCount; i++) {
            points[k++] = polyline[i][0] * scale[0] + translate[0];
            points[k++] = polyline[i][1] * scale[1] + translate[1];
        }

        if (area(points, 0, pointCount) < 0) {
            reversePoints(points, 2, 0, pointCount);
        }

        const insidePoints = [];
        const outsidePoints = [];
        const miterLimit = opts.miterLimit;
        const outsideIndicesMap = innerOffsetPolyline(
            points, outsidePoints, 0, pointCount, 0, -lineWidth / 2, miterLimit, false);
        reversePoints(points, 2, 0, pointCount);
        const insideIndicesMap = innerOffsetPolyline(
            points, insidePoints, 0, pointCount, 0, -lineWidth / 2, miterLimit, false);

        const polygonVertexCount = (insidePoints.length + outsidePoints.length) / 2;
        const polygonVertices = new Float32Array(polygonVertexCount * 2);

        let offset = 0;
        const outsidePointCount = outsidePoints.length / 2;
        for (let i = 0; i < outsidePoints.length; i++) {
            polygonVertices[offset++] = outsidePoints[i];
        }
        for (let i = 0; i < insidePoints.length; i++) {
            polygonVertices[offset++] = insidePoints[i];
        }

        // Built indices
        const indices = new (polygonVertexCount > 0xffff ? Uint32Array : Uint16Array)(
            ((pointCount - 1) * 2 + (polygonVertexCount - pointCount * 2)) * 3
        );
        let off = 0;
        for (let i = 0; i < pointCount - 1; i++) {
            const i2 = i + 1;
            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i];
            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i] - 1;
            indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;

            indices[off++] = outsidePointCount - 1 - outsideIndicesMap[i];
            indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;
            indices[off++] = insideIndicesMap[i] + outsidePointCount;

            if (insideIndicesMap[i2] - insideIndicesMap[i] === 2) {
                indices[off++] = insideIndicesMap[i] + 2 + outsidePointCount;
                indices[off++] = insideIndicesMap[i] + 1 + outsidePointCount;
                indices[off++] = outsidePointCount - outsideIndicesMap[i2] - 1;
            }
            else if (outsideIndicesMap[i2] - outsideIndicesMap[i] === 2) {
                indices[off++] = insideIndicesMap[i2] + outsidePointCount;
                indices[off++] = outsidePointCount - 1 - (outsideIndicesMap[i] + 1);
                indices[off++] = outsidePointCount - 1 - (outsideIndicesMap[i] + 2);
            }
        }

        const topVertices = opts.bevelSize > 0
            ? offsetPolygon(polygonVertices, [], opts.bevelSize, null, true) : polygonVertices;
        const boundingRect = opts.boundingRect;

        const res = splitVertices(polygonVertices, null, opts.smoothSide, opts.smoothSideThreshold);
        return {
            vertices: res.vertices,
            rawVertices: topVertices,
            splittedMap: res.splittedMap,
            indices,
            topVertices,
            rect: {
                x: boundingRect.x * scale[0] + translate[0],
                y: boundingRect.y * scale[1] + translate[1],
                width: boundingRect.width * scale[0],
                height: boundingRect.height * scale[1],
            },
            depth: typeof opts.depth === 'function' ? opts.depth(polylineIdx) : opts.depth,
            holes: []
        };
    }

    function removeClosePointsOfPolygon(polygon, epsilon) {
        const newPolygon = [];
        for (let k = 0; k < polygon.length; k++) {
            const points = polygon[k];
            const newPoints = [];
            const len = points.length;
            let x1 = points[len - 1][0];
            let y1 = points[len - 1][1];
            let dist = 0;
            for (let i = 0; i < len; i++) {
                let x2 = points[i][0];
                let y2 = points[i][1];
                const dx = x2 - x1;
                const dy = y2 - y1;
                dist += Math.sqrt(dx * dx + dy * dy);
                if (dist > epsilon) {
                    newPoints.push(points[i]);
                    dist = 0;
                }
                x1 = x2;
                y1 = y2;
            }
            if (newPoints.length >= 3) {
                newPolygon.push(newPoints);
            }
        }
        return newPolygon.length > 0 ? newPolygon : null;
    }

    function simplifyPolygon(polygon, tolerance) {
        const newPolygon = [];
        for (let k = 0; k < polygon.length; k++) {
            let points = polygon[k];
            points = simplify(points, tolerance, true);
            if (points.length >= 3) {
                newPolygon.push(points);
            }
        }
        return newPolygon.length > 0 ? newPolygon : null;
    }
    /**
     *
     * @param {Array} polygons Polygons array that match GeoJSON MultiPolygon geometry.
     * @param {Object} [opts]
     * @param {number|Function} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     *
     * @return {Object} {indices, position, uv, normal, boundingRect}
     */
    function extrudePolygon(polygons, opts) {

        opts = Object.assign({}, opts);

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        for (let i = 0; i < polygons.length; i++) {
            updateBoundingRect(polygons[i][0], min, max);
        }
        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        normalizeOpts(opts);

        const preparedData = [];
        const translate = opts.translate || [0, 0];
        const scale = opts.scale || [1, 1];
        const boundingRect = opts.boundingRect;
        const transformdRect = {
            x: boundingRect.x * scale[0] + translate[0],
            y: boundingRect.y * scale[1] + translate[1],
            width: boundingRect.width * scale[0],
            height: boundingRect.height * scale[1],
        };

        const epsilon = Math.min(
            boundingRect.width, boundingRect.height
        ) / 1e5;
        for (let i = 0; i < polygons.length; i++) {
            let newPolygon = removeClosePointsOfPolygon(polygons[i], epsilon);
            if (!newPolygon) {
                continue;
            }
            const simplifyTolerance = opts.simplify / Math.max(scale[0], scale[1]);
            if (simplifyTolerance > 0) {
                newPolygon = simplifyPolygon(newPolygon, simplifyTolerance);
            }
            if (!newPolygon) {
                continue;
            }

            const { vertices, holes, dimensions } = earcut$1.flatten(newPolygon);

            for (let k = 0; k < vertices.length;) {
                vertices[k] = vertices[k++] * scale[0] + translate[0];
                vertices[k] = vertices[k++] * scale[1] + translate[1];
            }

            convertToClockwise(vertices, holes);

            if (dimensions !== 2) {
                throw new Error('Only 2D polygon points are supported');
            }
            const topVertices = opts.bevelSize > 0
                ? offsetPolygon(vertices, holes, opts.bevelSize, null, true) : vertices;
            const indices = triangulate(topVertices, holes, dimensions);
            const res = splitVertices(vertices, holes, opts.smoothSide, opts.smoothSideThreshold);

            preparedData.push({
                indices,
                vertices: res.vertices,
                rawVertices: vertices,
                topVertices,
                holes: res.holes,
                splittedMap: res.splittedMap,
                rect: transformdRect,
                depth: typeof opts.depth === 'function' ? opts.depth(i) : opts.depth
            });
        }
        return innerExtrudeTriangulatedPolygon(preparedData, opts);
    }
    /**
     *
     * @param {Array} polylines Polylines array that match GeoJSON MultiLineString geometry.
     * @param {Object} [opts]
     * @param {number} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {boolean} [opts.lineWidth = 1]
     * @param {boolean} [opts.miterLimit = 2]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     * @param {Object} [opts.boundingRect]
     * @return {Object} {indices, position, uv, normal, boundingRect}
     */
    function extrudePolyline(polylines, opts) {

        opts = Object.assign({}, opts);

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];
        for (let i = 0; i < polylines.length; i++) {
            updateBoundingRect(polylines[i], min, max);
        }
        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        normalizeOpts(opts);
        const scale = opts.scale || [1, 1];

        if (opts.lineWidth == null) {
            opts.lineWidth = 1;
        }
        if (opts.miterLimit == null) {
            opts.miterLimit = 2;
        }
        const preparedData = [];
        // Extrude polyline to polygon
        for (let i = 0; i < polylines.length; i++) {
            let newPolyline = polylines[i];
            const simplifyTolerance = opts.simplify / Math.max(scale[0], scale[1]);
            if (simplifyTolerance > 0) {
                newPolyline = simplify(newPolyline, simplifyTolerance, true);
            }
            preparedData.push(convertPolylineToTriangulatedPolygon(newPolyline, i, opts));
        }

        return innerExtrudeTriangulatedPolygon(preparedData, opts);
    }

    function updateBoundingRect(points, min, max) {
        for (let i = 0; i < points.length; i++) {
            min[0] = Math.min(points[i][0], min[0]);
            min[1] = Math.min(points[i][1], min[1]);
            max[0] = Math.max(points[i][0], max[0]);
            max[1] = Math.max(points[i][1], max[1]);
        }
    }

    /**
     *
     * @param {Object} geojson
     * @param {Object} [opts]
     * @param {number} [opts.depth]
     * @param {number} [opts.bevelSize = 0]
     * @param {number} [opts.bevelSegments = 2]
     * @param {number} [opts.simplify = 0]
     * @param {boolean} [opts.smoothSide = 'auto']
     * @param {boolean} [opts.smoothSideThreshold = 0.9]    // Will not smooth sharp side.
     * @param {boolean} [opts.smoothBevel = false]
     * @param {boolean} [opts.excludeBottom = false]
     * @param {boolean} [opts.lineWidth = 1]
     * @param {boolean} [opts.miterLimit = 2]
     * @param {Object} [opts.fitRect] translate and scale will be ignored if fitRect is set
     * @param {Array} [opts.translate]
     * @param {Array} [opts.scale]
     * @param {Object} [opts.boundingRect]
     * @return {Object} {polyline: {indices, position, uv, normal}, polygon: {indices, position, uv, normal}}
     */

    // TODO Not merge feature
    function extrudeGeoJSON(geojson, opts) {

        opts = Object.assign({}, opts);

        const polylines = [];
        const polygons = [];

        const polylineFeatureIndices = [];
        const polygonFeatureIndices = [];

        const min = [Infinity, Infinity];
        const max = [-Infinity, -Infinity];

        for (let i = 0; i < geojson.features.length; i++) {
            const feature = geojson.features[i];
            const geometry = feature.geometry;
            if (geometry && geometry.coordinates) {
                switch (geometry.type) {
                    case 'LineString':
                        polylines.push(geometry.coordinates);
                        polylineFeatureIndices.push(i);
                        updateBoundingRect(geometry.coordinates, min, max);
                        break;
                    case 'MultiLineString':
                        for (let k = 0; k < geometry.coordinates.length; k++) {
                            polylines.push(geometry.coordinates[k]);
                            polylineFeatureIndices.push(i);
                            updateBoundingRect(geometry.coordinates[k], min, max);
                        }
                        break;
                    case 'Polygon':
                        polygons.push(geometry.coordinates);
                        polygonFeatureIndices.push(i);
                        updateBoundingRect(geometry.coordinates[0], min, max);
                        break;
                    case 'MultiPolygon':
                        for (let k = 0; k < geometry.coordinates.length; k++) {
                            polygons.push(geometry.coordinates[k]);
                            polygonFeatureIndices.push(i);
                            updateBoundingRect(geometry.coordinates[k][0], min, max);
                        }
                        break;
                }
            }
        }

        opts.boundingRect = opts.boundingRect || {
            x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]
        };

        const originalDepth = opts.depth;
        return {
            polyline: extrudePolyline(polylines, Object.assign(opts, {
                depth: function (idx) {
                    if (typeof originalDepth === 'function') {
                        return originalDepth(
                            geojson.features[polylineFeatureIndices[idx]]
                        );
                    }
                    return originalDepth;
                }
            })),
            polygon: extrudePolygon(polygons, Object.assign(opts, {
                depth: function (idx) {
                    if (typeof originalDepth === 'function') {
                        return originalDepth(
                            geojson.features[polygonFeatureIndices[idx]]
                        );
                    }
                    return originalDepth;
                }
            }))
        };
    }

    var main = /*#__PURE__*/Object.freeze({
        __proto__: null,
        triangulate: triangulate,
        flatten: flatten,
        offsetPolygon: offsetPolygon,
        extrudePolygon: extrudePolygon,
        extrudePolyline: extrudePolyline,
        extrudeGeoJSON: extrudeGeoJSON
    });

    // eslint-disable-next-line quotes
    const workerCode = `(function(n){"use strict";
/*!
   * poly-extrude v0.0.7
    */var t={exports:{}};function r(n,t,r){r=r||2;var o,u,v,x,h,l,c,y=t&&t.length,d=y?t[0]*r:n.length,g=e(n,0,d,r,!0),m=[];if(!g||g.next===g.prev)return m;if(y&&(g=function(n,t,r,a){var o,u,v,x=[];for(o=0,u=t.length;o<u;o++)(v=e(n,t[o]*a,o<u-1?t[o+1]*a:n.length,a,!1))===v.next&&(v.steiner=!0),x.push(p(v));for(x.sort(f),o=0;o<x.length;o++)r=i(r=s(x[o],r),r.next);return r}(n,t,g,r)),n.length>80*r){o=v=n[0],u=x=n[1];for(var w=r;w<d;w+=r)(h=n[w])<o&&(o=h),(l=n[w+1])<u&&(u=l),h>v&&(v=h),l>x&&(x=l);c=0!==(c=Math.max(v-o,x-u))?1/c:0}return a(g,m,r,o,u,c),m}function e(n,t,r,e,i){var a,o;if(i===z(n,t,r,e)>0)for(a=t;a<r;a+=e)o=A(a,n[a],n[a+1],o);else for(a=r-e;a>=t;a-=e)o=A(a,n[a],n[a+1],o);return o&&g(o,o.next)&&(F(o),o=o.next),o}function i(n,t){if(!n)return n;t||(t=n);var r,e=n;do{if(r=!1,e.steiner||!g(e,e.next)&&0!==d(e.prev,e,e.next))e=e.next;else{if(F(e),(e=t=e.prev)===e.next)break;r=!0}}while(r||e!==t);return t}function a(n,t,r,e,f,s,h){if(n){!h&&s&&function(n,t,r,e){var i=n;do{null===i.z&&(i.z=l(i.x,i.y,t,r,e)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next}while(i!==n);i.prevZ.nextZ=null,i.prevZ=null,function(n){var t,r,e,i,a,o,u,v,x=1;do{for(r=n,n=null,a=null,o=0;r;){for(o++,e=r,u=0,t=0;t<x&&(u++,e=e.nextZ);t++);for(v=x;u>0||v>0&&e;)0!==u&&(0===v||!e||r.z<=e.z)?(i=r,r=r.nextZ,u--):(i=e,e=e.nextZ,v--),a?a.nextZ=i:n=i,i.prevZ=a,a=i;r=e}a.nextZ=null,x*=2}while(o>1)}(i)}(n,e,f,s);for(var p,c,y=n;n.prev!==n.next;)if(p=n.prev,c=n.next,s?u(n,e,f,s):o(n))t.push(p.i/r),t.push(n.i/r),t.push(c.i/r),F(n),n=c.next,y=c.next;else if((n=c)===y){h?1===h?a(n=v(i(n),t,r),t,r,e,f,s,2):2===h&&x(n,t,r,e,f,s):a(i(n),t,r,e,f,s,1);break}}}function o(n){var t=n.prev,r=n,e=n.next;if(d(t,r,e)>=0)return!1;for(var i=n.next.next;i!==n.prev;){if(c(t.x,t.y,r.x,r.y,e.x,e.y,i.x,i.y)&&d(i.prev,i,i.next)>=0)return!1;i=i.next}return!0}function u(n,t,r,e){var i=n.prev,a=n,o=n.next;if(d(i,a,o)>=0)return!1;for(var u=i.x<a.x?i.x<o.x?i.x:o.x:a.x<o.x?a.x:o.x,v=i.y<a.y?i.y<o.y?i.y:o.y:a.y<o.y?a.y:o.y,x=i.x>a.x?i.x>o.x?i.x:o.x:a.x>o.x?a.x:o.x,f=i.y>a.y?i.y>o.y?i.y:o.y:a.y>o.y?a.y:o.y,s=l(u,v,t,r,e),h=l(x,f,t,r,e),p=n.prevZ,y=n.nextZ;p&&p.z>=s&&y&&y.z<=h;){if(p!==n.prev&&p!==n.next&&c(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&d(p.prev,p,p.next)>=0)return!1;if(p=p.prevZ,y!==n.prev&&y!==n.next&&c(i.x,i.y,a.x,a.y,o.x,o.y,y.x,y.y)&&d(y.prev,y,y.next)>=0)return!1;y=y.nextZ}for(;p&&p.z>=s;){if(p!==n.prev&&p!==n.next&&c(i.x,i.y,a.x,a.y,o.x,o.y,p.x,p.y)&&d(p.prev,p,p.next)>=0)return!1;p=p.prevZ}for(;y&&y.z<=h;){if(y!==n.prev&&y!==n.next&&c(i.x,i.y,a.x,a.y,o.x,o.y,y.x,y.y)&&d(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function v(n,t,r){var e=n;do{var a=e.prev,o=e.next.next;!g(a,o)&&m(a,e,e.next,o)&&b(a,o)&&b(o,a)&&(t.push(a.i/r),t.push(e.i/r),t.push(o.i/r),F(e),F(e.next),e=n=o),e=e.next}while(e!==n);return i(e)}function x(n,t,r,e,o,u){var v=n;do{for(var x=v.next.next;x!==v.prev;){if(v.i!==x.i&&y(v,x)){var f=Z(v,x);return v=i(v,v.next),f=i(f,f.next),a(v,t,r,e,o,u),void a(f,t,r,e,o,u)}x=x.next}v=v.next}while(v!==n)}function f(n,t){return n.x-t.x}function s(n,t){var r=function(n,t){var r,e=t,i=n.x,a=n.y,o=-1/0;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){var u=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>o){if(o=u,u===i){if(a===e.y)return e;if(a===e.next.y)return e.next}r=e.x<e.next.x?e:e.next}}e=e.next}while(e!==t);if(!r)return null;if(i===o)return r;var v,x=r,f=r.x,s=r.y,l=1/0;e=r;do{i>=e.x&&e.x>=f&&i!==e.x&&c(a<s?i:o,a,f,s,a<s?o:i,a,e.x,e.y)&&(v=Math.abs(a-e.y)/(i-e.x),b(e,n)&&(v<l||v===l&&(e.x>r.x||e.x===r.x&&h(r,e)))&&(r=e,l=v)),e=e.next}while(e!==x);return r}(n,t);if(!r)return t;var e=Z(r,n),a=i(r,r.next);return i(e,e.next),t===r?a:t}function h(n,t){return d(n.prev,n,t.prev)<0&&d(t.next,n,n.next)<0}function l(n,t,r,e,i){return(n=1431655765&((n=858993459&((n=252645135&((n=16711935&((n=32767*(n-r)*i)|n<<8))|n<<4))|n<<2))|n<<1))|(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=32767*(t-e)*i)|t<<8))|t<<4))|t<<2))|t<<1))<<1}function p(n){var t=n,r=n;do{(t.x<r.x||t.x===r.x&&t.y<r.y)&&(r=t),t=t.next}while(t!==n);return r}function c(n,t,r,e,i,a,o,u){return(i-o)*(t-u)-(n-o)*(a-u)>=0&&(n-o)*(e-u)-(r-o)*(t-u)>=0&&(r-o)*(a-u)-(i-o)*(e-u)>=0}function y(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!function(n,t){var r=n;do{if(r.i!==n.i&&r.next.i!==n.i&&r.i!==t.i&&r.next.i!==t.i&&m(r,r.next,n,t))return!0;r=r.next}while(r!==n);return!1}(n,t)&&(b(n,t)&&b(t,n)&&function(n,t){var r=n,e=!1,i=(n.x+t.x)/2,a=(n.y+t.y)/2;do{r.y>a!=r.next.y>a&&r.next.y!==r.y&&i<(r.next.x-r.x)*(a-r.y)/(r.next.y-r.y)+r.x&&(e=!e),r=r.next}while(r!==n);return e}(n,t)&&(d(n.prev,n,t.prev)||d(n,t.prev,t))||g(n,t)&&d(n.prev,n,n.next)>0&&d(t.prev,t,t.next)>0)}function d(n,t,r){return(t.y-n.y)*(r.x-t.x)-(t.x-n.x)*(r.y-t.y)}function g(n,t){return n.x===t.x&&n.y===t.y}function m(n,t,r,e){var i=M(d(n,t,r)),a=M(d(n,t,e)),o=M(d(r,e,n)),u=M(d(r,e,t));return i!==a&&o!==u||(!(0!==i||!w(n,r,t))||(!(0!==a||!w(n,e,t))||(!(0!==o||!w(r,n,e))||!(0!==u||!w(r,t,e)))))}function w(n,t,r){return t.x<=Math.max(n.x,r.x)&&t.x>=Math.min(n.x,r.x)&&t.y<=Math.max(n.y,r.y)&&t.y>=Math.min(n.y,r.y)}function M(n){return n>0?1:n<0?-1:0}function b(n,t){return d(n.prev,n,n.next)<0?d(n,t,n.next)>=0&&d(n,n.prev,t)>=0:d(n,t,n.prev)<0||d(n,n.next,t)<0}function Z(n,t){var r=new P(n.i,n.x,n.y),e=new P(t.i,t.x,t.y),i=n.next,a=t.prev;return n.next=t,t.prev=n,r.next=i,i.prev=r,e.next=r,r.prev=e,a.next=e,e.prev=a,e}function A(n,t,r,e){var i=new P(n,t,r);return e?(i.next=e.next,i.prev=e,e.next.prev=i,e.next=i):(i.prev=i,i.next=i),i}function F(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function P(n,t,r){this.i=n,this.x=t,this.y=r,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function z(n,t,r,e){for(var i=0,a=t,o=r-e;a<r;a+=e)i+=(n[o]-n[a])*(n[a+1]+n[o+1]),o=a;return i}t.exports=r,t.exports.default=r,r.deviation=function(n,t,r,e){var i=t&&t.length,a=i?t[0]*r:n.length,o=Math.abs(z(n,0,a,r));if(i)for(var u=0,v=t.length;u<v;u++){var x=t[u]*r,f=u<v-1?t[u+1]*r:n.length;o-=Math.abs(z(n,x,f,r))}var s=0;for(u=0;u<e.length;u+=3){var h=e[u]*r,l=e[u+1]*r,p=e[u+2]*r;s+=Math.abs((n[h]-n[p])*(n[l+1]-n[h+1])-(n[h]-n[l])*(n[p+1]-n[h+1]))}return 0===o&&0===s?0:Math.abs((s-o)/o)},r.flatten=function(n){for(var t=n[0][0].length,r={vertices:[],holes:[],dimensions:t},e=0,i=0;i<n.length;i++){for(var a=0;a<n[i].length;a++)for(var o=0;o<t;o++)r.vertices.push(n[i][a][o]);i>0&&(e+=n[i-1].length,r.holes.push(e))}return r};var E=t.exports;function L(n){for(var t,r,e=0,i=1,a=n.length;i<a;)t=r||n[0],e+=((r=n[i])[0]-t[0])*(r[1]+t[1]),i++;return e>0}function I(n,t,r){return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],n}function H(n,t){var r=t[0],e=t[1],i=t[2],a=Math.sqrt(r*r+e*e+i*i)||1;return n[0]=r/a,n[1]=e/a,n[2]=i/a,n}function U(n,t){function r(n,t,r,e){n[0]=t,n[1]=r,n[2]=e}for(var e,i,a,o,u,v,x,f,s,h=[],l=[],p=[],c=[],y=[],d=[],g=n.length,m=new Float32Array(t.length),w=0;w<g;){var M=3*n[w],b=3*n[w+1],Z=3*n[w+2];r(h,t[M],t[M+1],t[M+2]),r(l,t[b],t[b+1],t[b+2]),r(p,t[Z],t[Z+1],t[Z+2]),I(y,p,l),I(c,h,l),e=d,a=c,o=void 0,u=void 0,v=void 0,x=void 0,f=void 0,s=void 0,o=(i=y)[0],u=i[1],v=i[2],x=a[0],f=a[1],s=a[2],e[0]=u*s-v*f,e[1]=v*x-o*s,e[2]=o*f-u*x;for(var A=0;A<3;A++)m[M+A]+=d[A],m[b+A]+=d[A],m[Z+A]+=d[A];w+=3}for(var F=0,P=m.length;F<P;)r(d,m[F],m[F+1],m[F+2]),H(d,d),m[F]=d[0]||0,m[F+1]=d[1]||0,m[F+2]=d[2]||0,F+=3;return m}function j(n){if(1===n.length)return{position:n[0].position,normal:n[0].normal,uv:n[0].uv,indices:n[0].indices,results:n};for(var t=0,r=0,e=0,i=n.length;e<i;e++){var a=n[e],o=a.position,u=a.indices;t+=o.length,r+=u.length}for(var v={position:new Float32Array(t),normal:new Float32Array(t),uv:new Float32Array(t/3*2),indices:new Uint32Array(r),results:n},x=0,f=0,s=0,h=0,l=0,p=n.length;l<p;l++){var c=n[l],y=c.position,d=c.indices,g=c.normal,m=c.uv;v.position.set(y,x),v.normal.set(g,x),v.uv.set(m,h);for(var w=0,M=d.length;w<M;){var b=d[w]+f;v.indices[s]=b,s++,w++}h+=m.length,x+=y.length,f+=y.length/3}return v}function O(n){return 180*n/Math.PI}function W(n){return n/180*Math.PI}function k(n,t,r,e,i,a){var o=3*r,u=3*e,v=3*i,x=3*a,f=t[o],s=t[o+1],h=t[o+2],l=t[u],p=t[u+1],c=t[u+2],y=t[v],d=t[v+1],g=t[v+2],m=t[x],w=t[x+1],M=t[x+2];Math.abs(s-p)<Math.abs(f-l)?(n.push(f,1-h),n.push(l,1-c),n.push(y,1-g),n.push(m,1-M)):(n.push(s,1-h),n.push(p,1-c),n.push(d,1-g),n.push(w,1-M))}function V(n,t){t=Object.assign({},{depth:2},t);var r=n.map((function(n){for(var r=0,e=n.length;r<e;r++){var i=n[r];_(i),0===r?L(i)||(n[r]=i.reverse()):L(i)&&(n[r]=i.reverse()),q(i)&&i.splice(i.length-1,1)}var a=function(n,t){for(var r=function(n){var t=0,r=0,e=n.length;for(;r<e;)t+=n[r].length,r++;return t}(n),e=n.length,i=[],a=new Float32Array(2*r),o=[],u=[],v=3*r,x=2*r,f=t.depth,s=0,h=0,l=0,p=0;p<e;p++){var c=n[p];p>0&&i.push(s/2);for(var y=0,d=c.length;y<d;){var g=c[y],m=g[0],w=g[1];a[s++]=m,a[s++]=w,o[h]=m,o[h+1]=w,o[h+2]=f,o[v+h]=m,o[v+h+1]=w,o[v+h+2]=0,u[l]=m,u[l+1]=w,u[x+l]=m,u[x+l+1]=w,h+=3,l+=2,y++}}return{flatVertices:a,holes:i,points:o,count:r,uvs:u}}(n,t);return a.polygon=n,function(n,t){for(var r=[],e=n.count,i=0,a=t.length;i<a;i+=3){var o=t[i],u=t[i+1],v=t[i+2];r[i]=o,r[i+1]=u,r[i+2]=v;var x=a+i,f=e+o,s=e+u,h=e+v;r[x]=f,r[x+1]=s,r[x+2]=h}n.index=r}(a,E(a.flatVertices,a.holes,2)),function(n,t){for(var r=n.points,e=n.index,i=n.polygon,a=n.uvs,o=t.depth,u=0,v=i.length;u<v;u++)for(var x=i[u],f=0,s=x.length;f<s;){var h=x[f],l=x[f+1];f===s-1&&(l=x[0]);var p=r.length/3,c=h[0],y=h[1],d=l[0],g=l[1];r.push(c,y,o,d,g,o,c,y,0,d,g,0);var m=p+2,w=p+3,M=p,b=p+1;e.push(m,M,w,M,b,w),k(a,r,m,w,M,b),f++}}(a,t),a.position=new Float32Array(a.points),a.indices=new Uint32Array(a.index),a.uv=new Float32Array(a.uvs),a.normal=U(a.indices,a.position),a})),e=j(r);return e.polygons=n,e}function _(n){q(n)||n.push(n[0])}function q(n){var t=n.length,r=n[0],e=r[0],i=r[1],a=n[t-1],o=a[0],u=a[1];return e===o&&i===u}function R(n,t){t=Object.assign({},{depth:2,lineWidth:1},t);var r=n.map((function(n){var r=function(n,t){var r=0,e=t.lineWidth/2,i=[],a=[],o=[],u=n.length,v=0;for(;v<u-1;){var x=n[v],f=n[v+1],s=f[1]-x[1],h=f[0]-x[0],l=0,p=O(Math.atan(s/h));if(r=p,0===v)l=p,l-=90;else{var c=n[v-1];S.x=c[0]-x[0],S.y=c[1]-x[1],B.x=f[0]-x[0],B.y=f[1]-x[1],l=p-D(S,B)/2}var y=C(W(l),e,x),d=y[0],g=y[1];i.push(d,g),G(d,x,f)?(a.push(d),o.push(g)):(a.push(g),o.push(d)),v++}var m=r,w=W(m-=90),M=n[u-2],b=n[u-1],Z=C(w,e,b),A=Z[0],F=Z[1];i.push(A,F),G(A,M,b)?(a.push(A),o.push(F)):(a.push(F),o.push(A));return{offsetPoints:i,leftPoints:a,rightPoints:o}}(n,t);return r.line=n,function(n,t){var r=t.depth,e=[],i=[],a=[],o=n.leftPoints,u=n.rightPoints,v=0,x=o.length;for(;v<x;){var f=3*v,s=o[v],h=s[0],l=s[1];e[f]=h,e[f+1]=l,e[f+2]=r;var p=u[v],c=p[0],y=p[1],d=3*x+f;e[d]=c,e[d+1]=y,e[d+2]=r;var g=2*x*3+f;e[g]=h,e[g+1]=l,e[g+2]=0;var m=2*x*3+3*x+f;e[m]=c,e[m+1]=y,e[m+2]=0,v++}v=0,x=e.length;for(;v<x;){var w=e[v],M=e[v+1];a.push(w,M),v+=3}v=0,x=o.length;for(;v<x-1;){var b=v,Z=v+1,A=b+x,F=Z+x;i.push(b,A,Z),i.push(A,F,Z);var P=v+2*x,z=P+1,E=P+x,L=z+x;i.push(P,E,z),i.push(E,L,z),v++}n.index=i,n.points=e,n.uvs=a}(r,t),function(n,t){var r=n.points,e=n.index,i=n.leftPoints,a=n.rightPoints,o=n.uvs,u=t.depth,v=[i,a];function x(n,t){var i=r.length/3;r.push(n[0],n[1],u,t[0],t[1],u,n[0],n[1],0,t[0],t[1],0);var a=i+2,v=i+3,x=i,f=i+1;e.push(a,x,v,x,f,v),k(o,r,a,v,x,f)}for(var f=0,s=v.length;f<s;f++){var h=v[f];f>0&&(h=(h=h.map((function(n){return n}))).reverse());for(var l=0,p=h.length-1;l<p;){x(h[l],h[l+1]),l++}}for(var c=i.length,y=[a[0],i[0],i[c-1],a[c-1]],d=0;d<y.length;d+=2){x(y[d],y[d+1])}}(r,t),r.position=new Float32Array(r.points),r.indices=new Uint32Array(r.index),r.uv=new Float32Array(r.uvs),r.normal=U(r.indices,r.position),r})),e=j(r);return e.lines=n,e}var S={x:0,y:0},B={x:0,y:0};function C(n,t,r){var e=r[0],i=r[1],a=[e+Math.cos(n)*t,i+Math.sin(n)*t],o=n+=Math.PI;return[a,[e+Math.cos(o)*t,i+Math.sin(o)*t]]}var D=function(n,t){var r=n.x,e=n.y,i=t.x,a=t.y,o=r*i+e*a,u=r*a-e*i;return(Math.atan2(u,o)/Math.PI*180+360)%360};function G(n,t,r){var e=t[0],i=t[1],a=r[0],o=r[1];return(i-o)*n[0]+(a-e)*n[1]+e*o-a*i>0}var J={x:0,y:0},K={x:0,y:0};function N(n,t,r,e){for(var i=n.length,a=0;a<i;a++){var o=n[a].data;t=n[a].center||t;for(var u=0,v=o.length;u<v;u++)for(var x=o[u],f=0,s=x.length;f<s;f++)n[a].data[u][f]=Q(x[f],t,r,e)}}function Q(n,t,r,e){for(var i,a=[],o=0,u=(i=r?new Float64Array(n):new Float32Array(n)).length;o<u;o+=2){var v=i[o],x=i[o+1];if(t&&r&&e){J.x=v,J.y=x;var f=en(J,K);J.x=f.x,J.y=f.y,v=(f=an(e,J,r,K)).x,x=f.y,v-=t[0],x-=t[1]}a.push([v,x])}return a}function T(n,t){void 0===t&&(t=!1);for(var r=n.length,e=[],i=[],a=0,o=0;o<r;o++){var u=t?Y(n[o]):X(n[o]),v=n[o].bottomHeight||0,x=u.position;i.push(u);var f=x.length/3;e[o]={position:{middleZ:v+(n[o].height||0)/2,count:f,start:a,end:a+3*f},hide:!1},a+=3*f}var s=function(n){for(var t={},r={},e=0;e<n.length;++e){var i=n[e];for(var a in i)void 0===t[a]&&(t[a]=[],r[a]=0),t[a].push(i[a]),r[a]+=i[a].length}var o={},u=0,v=[];for(var x in t)if("indices"===x)for(var f=t[x],s=0,h=f.length;s<h;s++){for(var l=f[s],p=0,c=l.length;p<c;p++)v.push(l[p]+u);u+=t.position[s].length/3}else{var y=$(t[x],r[x]);if(!y)return null;o[x]=y}return o.indices=new Uint32Array(v),o}(i),h=s.position,l=s.normal,p=s.uv,c=s.indices;return{position:h.buffer,normal:l.buffer,uv:p.buffer,indices:c.buffer,geometriesAttributes:e}}function X(n){var t=n.data,r=n.height,e=n.bottomHeight,i=V(t,{depth:r}),a=i.position,o=i.normal,u=i.uv,v=i.indices;return nn(a,e),{position:a,normal:o,uv:u,indices:v}}function Y(n){var t=n.data,r=n.height,e=n.width,i=n.bottomHeight,a=R(t,{lineWidth:e,depth:r}),o=a.position,u=a.normal,v=a.uv,x=a.indices;return nn(o,i),{position:o,normal:u,uv:v,indices:x}}function $(n,t){for(var r=new Float32Array(t),e=0,i=0;i<n.length;++i)r.set(n[i],e),e+=n[i].length;return r}function nn(n,t){if(void 0!==t&&"number"==typeof t&&0!==t)for(var r=0,e=n.length;r<e;r+=3)n[r+2]+=t}var tn=Math.PI/180,rn=6378137*Math.PI/180;function en(n,t){var r,e=85.0511287798,i=n.x,a=Math.max(Math.min(e,n.y),-e);r=0===a?0:Math.log(Math.tan((90+a)*tn/2))/tn;var o=i*rn,u=r*rn;return t?(t.x=o,t.y=u,t):{x:o,y:u}}function an(n,t,r,e){var i=n[0]*(t.x-n[2])/r,a=-n[1]*(t.y-n[3])/r;return e?(e.x=i,e.y=a,e):{x:i,y:a}}function on(n){void 0===n&&(n=[]);for(var t=n.length,r=new Float32Array(3*t),e=0;e<t;e++){var i=n[e],a=3*e;r[a]=i[0],r[a+1]=i[1]}return r}function un(n){for(var t=new Float32Array(2*n.length-6),r=0,e=0,i=n.length/3;e<i;e++){var a=n[3*e],o=n[3*e+1],u=n[3*e+2];if(e>0&&e<i-1){var v=3*r;t[v]=a,t[v+1]=o,t[v+2]=u,r++}var x=3*r;t[x]=a,t[x+1]=o,t[x+2]=u,r++}return t}function vn(n){var t=0,r=n.length;if(1===r)return n[0];for(var e=0;e<r;e++)t+=n[e].length;for(var i=new Float32Array(t),a=0,o=0;o<r;o++)i.set(n[o],a),a+=n[o].length;return i}n.initialize=function(){},n.onmessage=function(n,t){var r=n.data,e=r.type,i=r.datas,a=r.glRes,o=r.matrix,u=r.center;if("ExtrudePolygons"===e){N(i,u,a,o);var v=T(i);t(null,v,[v.position,v.normal,v.uv,v.indices])}else if("ExtrudeLines"===e){for(var x=0,f=i.length;x<f;x++)for(var s=0,h=i[x].data.length;s<h;s++)i[x].data[s]=Q(i[x].data[s],i[x].center||u,a,o);var l=T(i,!0);t(null,l,[l.position,l.normal,l.uv,l.indices])}else if("ExtrudePolygon"===e){var p=[],c=[];i.forEach((function(n){var t=[n];N(t,u,a,o);var r=T(t),e=r.position,i=r.normal,v=r.uv,x=r.indices;p.push({id:n.id,position:e,normal:i,uv:v,indices:x}),c.push(e,i,v,x)})),t(null,p,c)}else if("Line"===e||"FatLine"===e){for(var y=[],d=[],g=0,m=i.length;g<m;g++){for(var w=[],M=0,b=i[g].data.length;M<b;M++){i[g].data[M]=Q(i[g].data[M],i[g].center||u,a,o);var Z=on(i[g].data[M]);w.push(un(Z))}var A=vn(w);nn(A,i[g].bottomHeight),y.push({id:i[g].id,position:A.buffer}),d.push(A.buffer)}t(null,y,d)}else if("Lines"===e||"FatLines"===e){for(var F=0,P=[],z=[],E=0,L=[],I=0,H=i.length;I<H;I++){for(var U=0,j=0,O=i[I].data.length;j<O;j++){i[I].data[j]=Q(i[I].data[j],i[I].center||u,a,o);var W=on(i[I].data[j]);nn(W,i[I].bottomHeight),U+=W.length/3*2-2,L.push(un(W))}var k=U;P[I]=[F,F+k],F+=k,z[I]={position:{count:U,start:E,end:E+3*U},hide:!1},"FatLines"===e&&(z[I].instanceStart={count:U,start:E,end:E+3*U},z[I].instanceEnd={count:U,start:E,end:E+3*U}),E+=3*U}var V=vn(L);t(null,{id:i.id,position:V.buffer,geometriesAttributes:z,faceMap:P},[V.buffer])}else if("ExtrudeLine"===e){for(var _=0,q=i.length;_<q;_++)for(var R=0,S=i[_].data.length;R<S;R++)i[_].data[R]=Q(i[_].data[R],i[_].center||u,a,o);var B=[],C=[];i.forEach((function(n){var t=T([n],!0),r=t.position,e=t.normal,i=t.uv,a=t.indices;B.push({id:n.id,position:r,normal:e,uv:i,indices:a}),C.push(r,e,i,a)})),t(null,B,C)}},Object.defineProperty(n,"__esModule",{value:!0})})`;
    const workerName = '__maptalks.three__';
    function getWorkerName() {
        return workerName;
    }
    function getWorkerCode() {
        return workerCode;
    }

    const fetchDataWorkerKey = '__maptalks.three.fetchdata__';
    function fetchDataWorkerCode(exports) {
        const tasks = [], taskings = [], concurrentCount = 5;
        exports.initialize = function () {
        };
        exports.onmessage = function (message, postResponse) {
            const data = message.data;
            const task = {
                url: data,
                postResponse,
                abort: false
            };
            loopTask(task);
        };
        function loopTask(task) {
            if (task.abort) {
                taskings.splice(taskings.indexOf(task), 1);
                if (tasks.length) {
                    taskings.push(tasks[0]);
                    tasks.splice(0, 1);
                    fetchData(taskings[taskings.length - 1]);
                }
            }
            else if (taskings.length < concurrentCount) {
                taskings.push(task);
                fetchData(task);
            }
            else {
                tasks.push(task);
            }
        }
        function fetchData(task) {
            fetch(task.url).then(res => res.text()).then((json) => {
                const blob = new Blob([json], { type: 'application/json' });
                blob.arrayBuffer().then(arrayBuffer => {
                    task.postResponse(null, arrayBuffer, [arrayBuffer]);
                    task.abort = true;
                    loopTask(task);
                });
            }).catch(error => {
                console.error(error);
                task.abort = true;
                loopTask(task);
            });
        }
    }
    var actor;
    function getFetchDataActor() {
        if (!maptalks__namespace.worker) {
            console.error('maptalks.worker is not defined,You can\'t use');
        }
        if (!actor) {
            actor = new maptalks__namespace.worker.Actor(fetchDataWorkerKey);
        }
        return actor;
    }

    const options = {
        'renderer': 'gl',
        'doubleBuffer': false,
        'glOptions': null,
        'geometryEvents': true,
        'identifyCountOnEvent': 0,
        'forceRenderOnZooming': true,
        'loopRenderCount': 50
    };
    const RADIAN = Math.PI / 180;
    const LINEPRECISIONS = [
        [4000, 220],
        [2000, 100],
        [1000, 30],
        [500, 15],
        [100, 5],
        [50, 2],
        [10, 1],
        [5, 0.7],
        [2, 0.1],
        [1, 0.05],
        [0.5, 0.02],
        [0.4, 0.01],
        [0.1, 0.005],
        [0.05, 0.002],
        [0.01, 0.001]
    ];
    const EVENTS = [
        'mousemove',
        'click',
        'mousedown',
        'mouseup',
        'dblclick',
        'contextmenu',
        'touchstart',
        'touchmove',
        'touchend'
    ];
    const TEMP_COORD = new maptalks__namespace.Coordinate(0, 0);
    const TEMP_POINT = new maptalks__namespace.Point(0, 0);
    const KEY_FBO = '__webglFramebuffer';
    // const MATRIX4 = new THREE.Matrix4();
    /**
     * A Layer to render with THREE.JS (http://threejs.org), the most popular library for WebGL. <br>
     *
     * @classdesc
     * A layer to render with THREE.JS
     * @example
     *  var layer = new maptalks.ThreeLayer('three');
     *
     *  layer.prepareToDraw = function (gl, scene, camera) {
     *      var size = map.getSize();
     *      return [size.width, size.height]
     *  };
     *
     *  layer.draw = function (gl, view, scene, camera, width,height) {
     *      //...
     *  };
     *  layer.addTo(map);
     * @class
     * @category layer
     * @extends {maptalks.CanvasLayer}
     * @param {String|Number} id - layer's id
     * @param {Object} options - options defined in [options]{@link maptalks.ThreeLayer#options}
     */
    class ThreeLayer extends maptalks__namespace.CanvasLayer {
        constructor(id, options) {
            super(id, options);
            this._animationBaseObjectMap = {};
            this._needsUpdate = true;
            this._mousemoveTimeOut = 0;
            this._baseObjects = [];
            this._delayMeshes = [];
            this.type = 'ThreeLayer';
        }
        isMercator() {
            const map = this.getMap();
            if (!map) {
                return false;
            }
            const sp = map.getSpatialReference();
            const prj = sp._projection, res = sp._resolutions;
            if (prj && prj.code === 'EPSG:3857' && res && res.length && Math.floor(res[0]) === 156543 && map.getGLRes) {
                return true;
            }
            return false;
        }
        isRendering() {
            const map = this.getMap();
            if (!map) {
                return false;
            }
            return map.isInteracting() || map.isAnimating();
        }
        prepareToDraw(...args) {
        }
        /**
         * Draw method of ThreeLayer
         * In default, it calls renderScene, refresh the camera and the scene
         */
        draw(gl, view, scene, camera, timeStamp, context) {
            this.renderScene(context, this);
        }
        /**
         * Draw method of ThreeLayer when map is interacting
         * In default, it calls renderScene, refresh the camera and the scene
         */
        drawOnInteracting(gl, view, scene, camera, event, timeStamp, context) {
            this.renderScene(context, this);
        }
        /**
         * Convert a geographic coordinate to THREE Vector3
         * @param  {maptalks.Coordinate} coordinate - coordinate
         * @param {Number} [z=0] z value
         * @return {THREE.Vector3}
         */
        coordinateToVector3(coordinate, z = 0) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const isArray = Array.isArray(coordinate);
            if (isArray) {
                TEMP_COORD.x = coordinate[0];
                TEMP_COORD.y = coordinate[1];
            }
            else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            const res = getGLRes(map);
            const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
            return new THREE__namespace.Vector3(p.x, p.y, z);
        }
        coordinatiesToGLFloatArray(coordinaties, centerPt) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const res = getGLRes(map);
            const len = coordinaties.length;
            const array = new Float32Array(len * 2);
            const array3d = new Float32Array(len * 3);
            for (let i = 0; i < len; i++) {
                let coordinate = coordinaties[i];
                const isArray = Array.isArray(coordinate);
                if (isArray) {
                    TEMP_COORD.x = coordinate[0];
                    TEMP_COORD.y = coordinate[1];
                }
                else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                    coordinate = new maptalks__namespace.Coordinate(coordinate);
                }
                const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
                p.x -= centerPt.x;
                p.y -= centerPt.y;
                const idx = i * 2;
                array[idx] = p.x;
                array[idx + 1] = p.y;
                const idx1 = i * 3;
                array3d[idx1] = p.x;
                array3d[idx1 + 1] = p.y;
                array3d[idx1 + 2] = 0;
            }
            return {
                positions: array3d,
                positons2d: array
            };
        }
        coordinatiesToGLArray(coordinaties, centerPt) {
            const map = this.getMap();
            if (!map) {
                return null;
            }
            const res = getGLRes(map);
            const len = coordinaties.length;
            const array = new Array(len);
            for (let i = 0; i < len; i++) {
                let coordinate = coordinaties[i];
                const isArray = Array.isArray(coordinate);
                if (isArray) {
                    TEMP_COORD.x = coordinate[0];
                    TEMP_COORD.y = coordinate[1];
                }
                else if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                    coordinate = new maptalks__namespace.Coordinate(coordinate);
                }
                const p = coordinateToPoint(map, isArray ? TEMP_COORD : coordinate, res, TEMP_POINT);
                p.x -= centerPt.x;
                p.y -= centerPt.y;
                array[i] = [p.x, p.y];
            }
            return array;
        }
        /**
         * Convert geographic distance to THREE Vector3
         * @param  {Number} w - width
         * @param  {Number} h - height
         * @return {THREE.Vector3}
         */
        distanceToVector3(w, h, coord) {
            if ((w === 0 && h === 0) || (!maptalks__namespace.Util.isNumber(w) || !maptalks__namespace.Util.isNumber(h))) {
                return new THREE__namespace.Vector3(0, 0, 0);
            }
            const map = this.getMap();
            const res = getGLRes(map);
            let center = coord || map.getCenter();
            if (!(center instanceof maptalks__namespace.Coordinate)) {
                center = new maptalks__namespace.Coordinate(center);
            }
            const target = map.locate(center, w, h);
            const p0 = coordinateToPoint(map, center, res), p1 = coordinateToPoint(map, target, res);
            const x = Math.abs(p1.x - p0.x) * maptalks__namespace.Util.sign(w);
            const y = Math.abs(p1.y - p0.y) * maptalks__namespace.Util.sign(h);
            return new THREE__namespace.Vector3(x, y, 0);
        }
        altitudeToVector3(altitude, altitude1, coord) {
            if ((altitude === 0) || (!maptalks__namespace.Util.isNumber(altitude))) {
                return new THREE__namespace.Vector3(0, 0, 0);
            }
            const map = this.getMap();
            if (map.altitudeToPoint) {
                const res = getGLRes(map);
                let z = map.altitudeToPoint(altitude, res);
                if (altitude < 0 && z > 0) {
                    z = -z;
                }
                return new THREE__namespace.Vector3(z, z, 0);
            }
            return this.distanceToVector3(altitude, altitude, coord);
        }
        /**
         * Convert a Polygon or a MultiPolygon to THREE shape
         * @param  {maptalks.Polygon|maptalks.MultiPolygon} polygon - polygon or multipolygon
         * @return {THREE.Shape}
         */
        toShape(polygon) {
            if (!polygon) {
                return null;
            }
            if (polygon instanceof maptalks__namespace.MultiPolygon) {
                return polygon.getGeometries().map(c => this.toShape(c));
            }
            const center = polygon.getCenter();
            const centerPt = this.coordinateToVector3(center);
            const shell = polygon.getShell();
            const outer = shell.map(c => {
                const vector = this.coordinateToVector3(c).sub(centerPt);
                return new THREE__namespace.Vector2(vector.x, vector.y);
            });
            const shape = new THREE__namespace.Shape(outer);
            const holes = polygon.getHoles();
            if (holes && holes.length > 0) {
                shape.holes = holes.map(item => {
                    const pts = item.map(c => {
                        const vector = this.coordinateToVector3(c).sub(centerPt);
                        return new THREE__namespace.Vector2(vector.x, vector.y);
                    });
                    return new THREE__namespace.Shape(pts);
                });
            }
            return shape;
        }
        /**
         * todo   This should also be extracted as a component
         * @param {*} polygon
         * @param {*} altitude
         * @param {*} material
         * @param {*} height
         */
        toExtrudeMesh(polygon, altitude, material, height) {
            if (!polygon) {
                return null;
            }
            if (polygon instanceof maptalks__namespace.MultiPolygon) {
                return polygon.getGeometries().map(c => this.toExtrudeMesh(c, altitude, material, height));
            }
            const rings = polygon.getCoordinates();
            rings.forEach(ring => {
                const length = ring.length;
                for (let i = length - 1; i >= 1; i--) {
                    if (ring[i].equals(ring[i - 1])) {
                        ring.splice(i, 1);
                    }
                }
            });
            polygon.setCoordinates(rings);
            const shape = this.toShape(polygon);
            const center = this.coordinateToVector3(polygon.getCenter());
            height = maptalks__namespace.Util.isNumber(height) ? height : altitude;
            height = this.altitudeToVector3(height, height).x;
            const amount = this.altitudeToVector3(altitude, altitude).x;
            //{ amount: extrudeH, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
            const config = { 'bevelEnabled': false, 'bevelSize': 1 };
            const name = parseInt(THREE__namespace.REVISION) >= 93 ? 'depth' : 'amount';
            config[name] = height;
            const geom = new THREE__namespace.ExtrudeGeometry(shape, config);
            let buffGeom = geom;
            if (THREE__namespace.BufferGeometry.prototype.fromGeometry) {
                buffGeom = new THREE__namespace.BufferGeometry();
                buffGeom.fromGeometry(geom);
            }
            const mesh = new THREE__namespace.Mesh(buffGeom, material);
            mesh.position.set(center.x, center.y, amount - height);
            return mesh;
        }
        /**
         *
         * @param {maptalks.Polygon|maptalks.MultiPolygon} polygon
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toExtrudePolygon(polygon, options, material) {
            return new ExtrudePolygon(polygon, options, material, this);
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toBar(coordinate, options, material) {
            return new Bar(coordinate, options, material, this);
        }
        /**
        *
        * @param {maptalks.LineString} lineString
        * @param {Object} options
        * @param {THREE.LineMaterial} material
        */
        toLine(lineString, options, material) {
            return new Line(lineString, options, material, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {Object} options
         * @param {THREE.Material} material
         */
        toExtrudeLine(lineString, options, material) {
            return new ExtrudeLine(lineString, options, material, this);
        }
        /**
         *
         * @param {THREE.Mesh|THREE.Group} model
         * @param {Object} options
         */
        toModel(model, options) {
            return new Model(model, options, this);
        }
        /**
         *
         * @param {maptalks.LineString} lineString
         * @param {*} options
         * @param {THREE.Material} material
         */
        toExtrudeLineTrail(lineString, options, material) {
            return new ExtrudeLineTrail(lineString, options, material, this);
        }
        /**
         *
         * @param {*} polygons
         * @param {*} options
         * @param {*} material
         */
        toExtrudePolygons(polygons, options, material) {
            return new ExtrudePolygons(polygons, options, material, this);
        }
        /**
         *
         * @param {maptalks.Coordinate} coordinate
         * @param {*} options
         * @param {*} material
         */
        toPoint(coordinate, options, material) {
            return new Point(coordinate, options, material, this);
        }
        /**
         *
         * @param {Array} points
         * @param {*} options
         * @param {*} material
         */
        toPoints(points, options, material) {
            return new Points(points, options, material, this);
        }
        /**
         *
         * @param {Array} points
         * @param {*} options
         * @param {*} material
         */
        toBars(points, options, material) {
            return new Bars(points, options, material, this);
        }
        /**
         *
         * @param {Array[maptalks.LineString]} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toExtrudeLines(lineStrings, options, material) {
            return new ExtrudeLines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {Array[maptalks.LineString]} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toLines(lineStrings, options, material) {
            return new Lines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {*} url
         * @param {*} options
         * @param {*} getMaterial
         * @param {*} worker
         */
        toThreeVectorTileLayer(url, options, getMaterial) {
            return new ThreeVectorTileLayer(url, options, getMaterial, this);
        }
        /**
         *
         * @param {*} extent
         * @param {*} options
         * @param {*} material
         */
        toTerrain(extent, options, material) {
            return new Terrain(extent, options, material, this);
        }
        /**
         *
         * @param {*} url
         * @param {*} options
         * @param {*} material
         */
        toTerrainVectorTileLayer(url, options, material) {
            return new TerrainVectorTileLayer(url, options, material, this);
        }
        /**
         *
         * @param {*} data
         * @param {*} options
         * @param {*} material
         */
        toHeatMap(data, options, material) {
            return new HeatMap(data, options, material, this);
        }
        /**
         *
         * @param {*} lineString
         * @param {*} options
         * @param {*} material
         */
        toFatLine(lineString, options, material) {
            return new FatLine(lineString, options, material, this);
        }
        /**
         *
         * @param {*} lineStrings
         * @param {*} options
         * @param {*} material
         */
        toFatLines(lineStrings, options, material) {
            return new FatLines(lineStrings, options, material, this);
        }
        /**
         *
         * @param {*} coorindate
         * @param {*} options
         * @param {*} material
         */
        toBox(coorindate, options, material) {
            return new Box(coorindate, options, material, this);
        }
        /**
         *
         * @param {*} points
         * @param {*} options
         * @param {*} material
         */
        toBoxs(points, options, material) {
            return new Boxs(points, options, material, this);
        }
        getBaseObjects() {
            return this.getMeshes().filter((mesh => {
                return mesh instanceof BaseObject;
            }));
        }
        getMeshes() {
            const scene = this.getScene();
            if (!scene) {
                return [];
            }
            const meshes = [];
            for (let i = 0, len = scene.children.length; i < len; i++) {
                const child = scene.children[i];
                if (child instanceof THREE__namespace.Object3D && !(child instanceof THREE__namespace.Camera)) {
                    meshes.push(child['__parent'] || child);
                }
            }
            return meshes;
        }
        clear() {
            return this.clearMesh();
        }
        clearMesh() {
            const scene = this.getScene();
            if (!scene) {
                return this;
            }
            for (let i = scene.children.length - 1; i >= 0; i--) {
                const child = scene.children[i];
                if (child instanceof THREE__namespace.Object3D && !(child instanceof THREE__namespace.Camera)) {
                    scene.remove(child);
                    const parent = child['__parent'];
                    if (parent && parent instanceof BaseObject) {
                        parent.isAdd = false;
                        parent._fire('remove', { target: parent });
                        delete this._animationBaseObjectMap[child.uuid];
                    }
                }
            }
            return this;
        }
        lookAt(vector) {
            const renderer = this._getRenderer();
            if (renderer) {
                renderer.context.lookAt(vector);
            }
            return this;
        }
        getCamera() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.camera;
            }
            return null;
        }
        getScene() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.scene;
            }
            return null;
        }
        renderScene(context, layer) {
            const renderer = this._getRenderer();
            if (renderer) {
                renderer.clearCanvas();
                renderer.renderScene(context);
                //外部调用时，直接redraw
                if (!layer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        loop(render = false) {
            const delayMeshes = this._delayMeshes;
            if (!delayMeshes.length) {
                return;
            }
            const map = this.getMap();
            if (!map || map.isAnimating() || map.isInteracting()) {
                return;
            }
            const loopRenderCount = this.options.loopRenderCount || 50;
            const meshes = delayMeshes.slice(0, loopRenderCount);
            if (meshes) {
                this.addMesh(meshes, render);
            }
            delayMeshes.splice(0, loopRenderCount);
        }
        renderPickScene() {
            const renderer = this._getRenderer();
            if (renderer) {
                const pick = renderer.pick;
                if (pick) {
                    pick.pick(this._containerPoint);
                }
            }
            return this;
        }
        getThreeRenderer() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.context;
            }
            return null;
        }
        getPick() {
            const renderer = this._getRenderer();
            if (renderer) {
                return renderer.pick;
            }
            return null;
        }
        delayAddMesh(meshes) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            for (let i = 0, len = meshes.length; i < len; i++) {
                this._delayMeshes.push(meshes[i]);
            }
            return this;
        }
        /**
         * add object3ds
         * @param {BaseObject} meshes
         */
        addMesh(meshes, render = true) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            const scene = this.getScene();
            meshes.forEach(mesh => {
                if (mesh instanceof BaseObject) {
                    scene.add(mesh.getObject3d());
                    if (!mesh.isAdd) {
                        mesh.isAdd = true;
                        mesh._fire('add', { target: mesh });
                    }
                    if (mesh._animation && maptalks__namespace.Util.isFunction(mesh._animation)) {
                        this._animationBaseObjectMap[mesh.getObject3d().uuid] = mesh;
                    }
                }
                else if (mesh instanceof THREE__namespace.Object3D) {
                    scene.add(mesh);
                }
            });
            this._zoomend();
            if (render) {
                const renderer = this._getRenderer();
                if (renderer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        /**
         * remove object3ds
         * @param {BaseObject} meshes
         */
        removeMesh(meshes, render = true) {
            if (!meshes)
                return this;
            if (!Array.isArray(meshes)) {
                meshes = [meshes];
            }
            const scene = this.getScene();
            meshes.forEach(mesh => {
                if (mesh instanceof BaseObject) {
                    scene.remove(mesh.getObject3d());
                    if (mesh.isAdd) {
                        mesh.isAdd = false;
                        mesh._fire('remove', { target: mesh });
                    }
                    if (mesh._animation && maptalks__namespace.Util.isFunction(mesh._animation)) {
                        delete this._animationBaseObjectMap[mesh.getObject3d().uuid];
                    }
                    const delayMeshes = this._delayMeshes;
                    if (delayMeshes.length) {
                        for (let i = 0, len = delayMeshes.length; i < len; i++) {
                            if (delayMeshes[i] === mesh) {
                                delayMeshes.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                else if (mesh instanceof THREE__namespace.Object3D) {
                    scene.remove(mesh);
                }
            });
            if (render) {
                const renderer = this._getRenderer();
                if (renderer) {
                    renderer.setToRedraw();
                }
            }
            return this;
        }
        _initRaycaster() {
            if (!this._raycaster) {
                this._raycaster = new THREE__namespace.Raycaster();
                this._mouse = new THREE__namespace.Vector2();
            }
            return this;
        }
        getRaycaster() {
            return this._raycaster;
        }
        /**
         *
         * @param {Coordinate} coordinate
         * @param {Object} options
         * @return {Array}
         */
        identify(coordinate, options) {
            if (!coordinate) {
                console.error('coordinate is null,it should be Coordinate');
                return [];
            }
            if (Array.isArray(coordinate)) {
                coordinate = new maptalks__namespace.Coordinate(coordinate);
            }
            if (!(coordinate instanceof maptalks__namespace.Coordinate)) {
                console.error('coordinate type is error,it should be Coordinate');
                return [];
            }
            const p = this.getMap().coordToContainerPoint(coordinate);
            this._containerPoint = p;
            const { x, y } = p;
            this._initRaycaster();
            this.fire('identify', { coordinate, options });
            const raycaster = this._raycaster, mouse = this._mouse, camera = this.getCamera(), scene = this.getScene(), size = this.getMap().getSize();
            //fix Errors will be reported when the layer is not initialized
            if (!scene) {
                return [];
            }
            const width = size.width, height = size.height;
            mouse.x = (x / width) * 2 - 1;
            mouse.y = -(y / height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            raycaster.layers.enableAll();
            //set linePrecision for THREE.Line
            setRaycasterLinePrecision(raycaster, this._getLinePrecision(this.getMap().getResolution()));
            const children = [], hasidentifyChildren = [];
            scene.children.forEach(mesh => {
                const parent = mesh['__parent'];
                if (parent && parent.getOptions) {
                    const baseObject = parent;
                    const interactive = baseObject.getOptions().interactive;
                    if (interactive && baseObject.isVisible()) {
                        //If baseobject has its own hit detection
                        if (baseObject.identify && maptalks__namespace.Util.isFunction(baseObject.identify)) {
                            hasidentifyChildren.push(baseObject);
                        }
                        else {
                            children.push(mesh);
                        }
                    }
                }
                else if (mesh instanceof THREE__namespace.Mesh || mesh instanceof THREE__namespace.Group) {
                    children.push(mesh);
                }
            });
            let baseObjects = [];
            const intersects = raycaster.intersectObjects(children, true);
            if (intersects && Array.isArray(intersects) && intersects.length) {
                baseObjects = intersects.map(intersect => {
                    let object = intersect.object;
                    const instanceId = intersect.instanceId;
                    object = this._recursionMesh(object) || {};
                    const baseObject = object['__parent'] || object;
                    baseObject.faceIndex = intersect.faceIndex;
                    baseObject.index = intersect.index;
                    baseObject.intersect = intersect;
                    if (maptalks__namespace.Util.isNumber(instanceId)) {
                        baseObject.instanceId = instanceId;
                    }
                    return baseObject;
                });
            }
            this.renderPickScene();
            if (hasidentifyChildren.length) {
                hasidentifyChildren.forEach(baseObject => {
                    // baseObject identify
                    if (baseObject.identify(coordinate)) {
                        baseObjects.push(baseObject);
                    }
                });
            }
            const len = baseObjects.length;
            for (let i = 0; i < len; i++) {
                if (baseObjects[i]) {
                    for (let j = i + 1; j < len; j++) {
                        if (baseObjects[i] === baseObjects[j]) {
                            baseObjects.splice(j, 1);
                        }
                    }
                }
            }
            options = maptalks__namespace.Util.extend({}, options);
            const count = options['count'];
            return (maptalks__namespace.Util.isNumber(count) && count > 0 ? baseObjects.slice(0, count) : baseObjects);
        }
        /**
        * Recursively finding the root node of mesh,Until it is scene node
        * @param {*} mesh
        */
        _recursionMesh(mesh) {
            while (mesh && ((mesh.parent !== this.getScene()))) {
                mesh = mesh.parent;
            }
            return mesh;
        }
        //get Line Precision by Resolution
        _getLinePrecision(res = 10) {
            for (let i = 0, len = LINEPRECISIONS.length; i < len; i++) {
                const [resLevel, precision] = LINEPRECISIONS[i];
                if (res > resLevel) {
                    return precision;
                }
            }
            return 0.01;
        }
        /**
         * fire baseObject events
         * @param {*} e
         */
        _identifyBaseObjectEvents(e) {
            if (!this.options.geometryEvents) {
                return this;
            }
            const map = this.map || this.getMap();
            //When map interaction, do not carry out mouse movement detection, which can have better performance
            if (map.isInteracting() || !map.options.geometryEvents || map._ignoreEvent(e)) {
                return this;
            }
            const eventType = e.type;
            e = map._getEventParams ? map._getEventParams(e) : this._getEventParams(e);
            e.type = eventType;
            const { type, coordinate } = e;
            const now = maptalks__namespace.Util.now();
            if (this._mousemoveTimeOut && type === 'mousemove') {
                if (now - this._mousemoveTimeOut < 64) {
                    return this;
                }
            }
            this._mousemoveTimeOut = now;
            // map.resetCursor('default');
            const identifyCountOnEvent = this.options['identifyCountOnEvent'];
            let count = Math.max(0, maptalks__namespace.Util.isNumber(identifyCountOnEvent) ? identifyCountOnEvent : 0);
            if (count === 0) {
                count = Infinity;
            }
            const baseObjects = this.identify(coordinate, { count });
            const scene = this.getScene();
            if (baseObjects.length === 0 && scene) {
                for (let i = 0, len = scene.children.length; i < len; i++) {
                    const child = scene.children[i] || {};
                    const parent = child['__parent'];
                    if (parent) {
                        parent.fire('empty', Object.assign({}, e, { target: parent }));
                    }
                }
            }
            function showInfoWindow(baseObject, eventType) {
                eventType = eventType || type;
                const infoWindow = baseObject.getInfoWindow();
                if (infoWindow && (!infoWindow._owner)) {
                    infoWindow.addTo(baseObject);
                }
                const infoOptions = infoWindow ? infoWindow.options : {};
                const autoOpenOn = infoOptions['autoOpenOn'] || 'click';
                if (autoOpenOn === eventType) {
                    baseObject.openInfoWindow(coordinate);
                    baseObject.fire('showinfowindow', { infoWindow });
                }
            }
            if (type === 'mousemove') {
                // if (baseObjects.length) {
                //     map.setCursor('pointer');
                // }
                // mouseout objects
                const outBaseObjects = [];
                if (this._baseObjects) {
                    this._baseObjects.forEach(baseObject => {
                        let isOut = true;
                        baseObjects.forEach(baseO => {
                            if (baseObject === baseO) {
                                isOut = false;
                            }
                        });
                        if (isOut) {
                            outBaseObjects.push(baseObject);
                        }
                    });
                }
                outBaseObjects.forEach(baseObject => {
                    if (baseObject && baseObject instanceof BaseObject) {
                        // reset _mouseover status
                        // Deal with the mergedmesh
                        if (baseObject.getSelectMesh) {
                            if (!baseObject.isHide) {
                                baseObject._mouseover = false;
                                baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout', selectMesh: null }));
                                baseObject.closeToolTip();
                            }
                        }
                        else {
                            baseObject._mouseover = false;
                            baseObject.fire('mouseout', Object.assign({}, e, { target: baseObject, type: 'mouseout' }));
                            baseObject.closeToolTip();
                        }
                    }
                });
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        if (!baseObject._mouseover) {
                            baseObject.fire('mouseover', Object.assign({}, e, { target: baseObject, type: 'mouseover', selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                            baseObject._mouseover = true;
                            showInfoWindow(baseObject, 'mouseover');
                        }
                        baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        // tooltip
                        const tooltip = baseObject.getToolTip();
                        if (tooltip && (!tooltip._owner)) {
                            tooltip.addTo(baseObject);
                        }
                        baseObject.openToolTip(coordinate);
                        showInfoWindow(baseObject);
                    }
                });
                this._baseObjects = baseObjects;
            }
            else {
                baseObjects.forEach(baseObject => {
                    if (baseObject instanceof BaseObject) {
                        baseObject.fire(type, Object.assign({}, e, { target: baseObject, selectMesh: (baseObject.getSelectMesh ? baseObject.getSelectMesh() : null) }));
                        showInfoWindow(baseObject);
                    }
                });
            }
            return this;
        }
        _getEventParams(e) {
            const map = this.getMap();
            const eventParam = {
                domEvent: e
                // type: e.type
            };
            if (!map) {
                return eventParam;
            }
            const actual = e.touches && e.touches.length > 0 ? e.touches[0] : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : e;
            if (actual) {
                const getEventContainerPoint = maptalks__namespace.DomUtil.getEventContainerPoint;
                const containerPoint = getEventContainerPoint(actual, map._containerDOM);
                eventParam['coordinate'] = map.containerPointToCoordinate(containerPoint);
                eventParam['containerPoint'] = containerPoint;
                eventParam['viewPoint'] = map.containerPointToViewPoint(containerPoint);
                eventParam['pont2d'] = map._containerPointToPoint(containerPoint);
            }
            return eventParam;
        }
        /**
         *map zoom event
         */
        _zoomend() {
            const scene = this.getScene();
            if (!scene) {
                return;
            }
            const zoom = this.getMap().getZoom();
            scene.children.forEach(mesh => {
                const parent = mesh['__parent'];
                if (parent && parent.getOptions) {
                    const baseObject = parent;
                    if (baseObject.zoomChange && maptalks__namespace.Util.isFunction(baseObject.zoomChange)) {
                        baseObject.zoomChange(zoom);
                    }
                    const minZoom = baseObject.getMinZoom(), maxZoom = baseObject.getMaxZoom();
                    if (zoom < minZoom || zoom > maxZoom) {
                        if (baseObject.isVisible()) {
                            baseObject.getObject3d().visible = false;
                        }
                        baseObject._zoomVisible = false;
                    }
                    else if (minZoom <= zoom && zoom <= maxZoom) {
                        if (baseObject._visible) {
                            baseObject.getObject3d().visible = true;
                        }
                        baseObject._zoomVisible = true;
                    }
                }
            });
        }
        _getGeometryEventMapPanel() {
            const map = this.map || this.getMap();
            const dom = map._panels.allLayers || map._containerDOM;
            return dom;
        }
        onAdd() {
            super.onAdd();
            const map = this.map || this.getMap();
            if (!map)
                return this;
            const dom = this._getGeometryEventMapPanel();
            maptalks__namespace.DomUtil.on(dom, EVENTS.join(' '), this._identifyBaseObjectEvents, this);
            this._needsUpdate = true;
            if (!this._animationBaseObjectMap) {
                this._animationBaseObjectMap = {};
            }
            map.on('zooming zoomend', this._zoomend, this);
            return this;
        }
        onRemove() {
            super.onRemove();
            const map = this.map || this.getMap();
            if (!map)
                return this;
            const dom = this._getGeometryEventMapPanel();
            maptalks__namespace.DomUtil.off(dom, EVENTS.join(' '), this._identifyBaseObjectEvents, this);
            map.off('zooming zoomend', this._zoomend, this);
            return this;
        }
        _callbackBaseObjectAnimation() {
            const layer = this;
            if (layer._animationBaseObjectMap) {
                for (const uuid in layer._animationBaseObjectMap) {
                    const baseObject = layer._animationBaseObjectMap[uuid];
                    baseObject._animation();
                }
            }
            return this;
        }
        /**
         * To make map's 2d point's 1 pixel euqal with 1 pixel on XY plane in THREE's scene:
         * 1. fov is 90 and camera's z is height / 2 * scale,
         * 2. if fov is not 90, a ratio is caculated to transfer z to the equivalent when fov is 90
         * @return {Number} fov ratio on z axis
         */
        _getFovRatio() {
            const map = this.getMap();
            const fov = map.getFov();
            return Math.tan(fov / 2 * RADIAN);
        }
    }
    ThreeLayer.mergeOptions(options);
    class ThreeRenderer extends maptalks__namespace.renderer.CanvasLayerRenderer {
        constructor() {
            super(...arguments);
            this._renderTime = 0;
            this._renderTarget = null;
        }
        getPrepareParams() {
            return [this.scene, this.camera];
        }
        getDrawParams() {
            return [this.scene, this.camera];
        }
        _drawLayer() {
            super._drawLayer.apply(this, arguments);
            // this.renderScene();
        }
        hitDetect() {
            return false;
        }
        createCanvas() {
            super.createCanvas();
            this.createContext();
        }
        createContext() {
            if (this.canvas.gl && this.canvas.gl.wrap) {
                this.gl = this.canvas.gl.wrap();
            }
            else {
                const layer = this.layer;
                const attributes = layer.options.glOptions || {
                    alpha: true,
                    depth: true,
                    antialias: true,
                    stencil: true,
                    preserveDrawingBuffer: false
                };
                attributes.preserveDrawingBuffer = true;
                this.gl = this.gl || this._createGLContext(this.canvas, attributes);
            }
            this._initThreeRenderer();
            this.layer.onCanvasCreate(this.context, this.scene, this.camera);
        }
        _initThreeRenderer() {
            this.matrix4 = new THREE__namespace.Matrix4();
            const renderer = new THREE__namespace.WebGLRenderer({ 'context': this.gl, alpha: true });
            renderer.autoClear = false;
            renderer.setClearColor(new THREE__namespace.Color(1, 1, 1), 0);
            renderer.setSize(this.canvas.width, this.canvas.height);
            renderer.clear();
            // renderer.canvas = this.canvas;
            this.context = renderer;
            const scene = this.scene = new THREE__namespace.Scene();
            const map = this.layer.getMap();
            const fov = map.getFov() * Math.PI / 180;
            const camera = this.camera = new THREE__namespace.PerspectiveCamera(fov, map.width / map.height, map.cameraNear, map.cameraFar);
            camera.matrixAutoUpdate = false;
            this._syncCamera();
            scene.add(camera);
            this.pick = new GPUPick(this.layer);
            BaseObjectTaskManager.star();
        }
        onCanvasCreate() {
            super.onCanvasCreate();
        }
        resizeCanvas(canvasSize) {
            if (!this.canvas) {
                return;
            }
            let size, map = this.getMap();
            if (!canvasSize) {
                size = map.getSize();
            }
            else {
                size = canvasSize;
            }
            // const r = maptalks.Browser.retina ? 2 : 1;
            const r = map.getDevicePixelRatio ? map.getDevicePixelRatio() : (maptalks__namespace.Browser.retina ? 2 : 1);
            const canvas = this.canvas;
            //retina support
            canvas.height = r * size['height'];
            canvas.width = r * size['width'];
            if (this.layer._canvas && canvas.style) {
                canvas.style.width = size.width + 'px';
                canvas.style.height = size.height + 'px';
            }
            this.context.setSize(canvas.width, canvas.height);
        }
        clearCanvas() {
            if (!this.canvas) {
                return;
            }
            this.context.clear();
        }
        prepareCanvas() {
            if (!this.canvas) {
                this.createCanvas();
            }
            else {
                this.clearCanvas();
            }
            this.layer.fire('renderstart', { 'context': this.context });
            return null;
        }
        renderScene(context) {
            // const time = maptalks.Util.now();
            // Make sure to execute only once in a frame
            // if (time - this._renderTime >= 16) {
            //     this.layer._callbackBaseObjectAnimation();
            //     this._renderTime = time;
            // }
            this.layer._callbackBaseObjectAnimation();
            this._syncCamera();
            // 把 WebglRenderTarget 中的 framebuffer 替换为 GroupGLLayer 中的 fbo
            // 参考: https://stackoverflow.com/questions/55082573/use-webgl-texture-as-a-three-js-texture-map
            // 实现有点 hacky，需要留意 three 版本变动 对它的影响
            if (context && context.renderTarget) {
                const { width, height } = context.renderTarget.fbo;
                if (!this._renderTarget) {
                    this._renderTarget = new THREE__namespace.WebGLRenderTarget(width, height, {
                        // depthTexture: new THREE.DepthTexture(width, height, THREE.UnsignedInt248Type)
                        depthBuffer: false
                    });
                    // 绘制一次以后，才会生成 framebuffer 对象
                    this.context.setRenderTarget(this._renderTarget);
                    this.context.render(this.scene, this.camera);
                }
                else {
                    // 这里不能setSize，因为setSize中会把原有的fbo dipose掉
                    // this._renderTarget.setSize(width, height);
                    this._renderTarget.viewport.set(0, 0, width, height);
                    this._renderTarget.scissor.set(0, 0, width, height);
                }
                const renderTargetProps = this.context.properties.get(this._renderTarget);
                const threeCreatedFBO = renderTargetProps[KEY_FBO];
                // 用GroupGLLayer的webgl fbo对象替换WebglRenderTarget的fbo对象
                renderTargetProps[KEY_FBO] = context.renderTarget.getFramebuffer(context.renderTarget.fbo);
                this.context.setRenderTarget(this._renderTarget);
                const bloomEnable = context.bloom === 1 && context.sceneFilter;
                const object3ds = this.scene.children || [];
                //reset all object3ds layers
                for (let i = 0, len = object3ds.length; i < len; i++) {
                    if (!object3ds[i] || !object3ds[i].layers) {
                        continue;
                    }
                    object3ds[i].layers.set(0);
                }
                if (bloomEnable) {
                    const sceneFilter = context.sceneFilter;
                    //符合当前渲染帧的条件的分组到layer=1
                    for (let i = 0, len = object3ds.length; i < len; i++) {
                        if (!object3ds[i] || !object3ds[i].layers) {
                            continue;
                        }
                        const parent = object3ds[i]['__parent'];
                        object3ds[i]['bloom'] = false;
                        //判断当前ojbect3d是否开启bloom
                        if (parent) {
                            object3ds[i]['bloom'] = parent.bloom;
                        }
                        let layer = 0;
                        //当object3d找不到parent(baseobject)时，也加入当前渲染帧，这种情况的一般都是灯光对象
                        //sceneFilter 用来过滤符合当前模式的meshes
                        if (object3ds[i] && sceneFilter(object3ds[i]) || !parent) {
                            layer = 1;
                        }
                        object3ds[i].layers.set(layer);
                    }
                }
                this.camera.layers.set(bloomEnable ? 1 : 0);
                this.context.render(this.scene, this.camera);
                renderTargetProps[KEY_FBO] = threeCreatedFBO;
            }
            else {
                this.context.render(this.scene, this.camera);
            }
            this.context.setRenderTarget(null);
            this.completeRender();
        }
        remove() {
            delete this._drawContext;
            if (this._renderTarget) {
                this._renderTarget.dispose();
                delete this._renderTarget;
            }
            super.remove();
        }
        _syncCamera() {
            const map = this.getMap();
            const camera = this.camera;
            camera.matrix.elements = map.cameraWorldMatrix;
            camera.projectionMatrix.elements = map.projMatrix;
            //https://github.com/mrdoob/three.js/commit/d52afdd2ceafd690ac9e20917d0c968ff2fa7661
            if (this.matrix4.invert) {
                camera.projectionMatrixInverse.elements = this.matrix4.copy(camera.projectionMatrix).invert().elements;
                //r95 no projectionMatrixInverse properties
            }
            else if (camera.projectionMatrixInverse) {
                camera.projectionMatrixInverse.elements = this.matrix4.getInverse(camera.projectionMatrix).elements;
            }
        }
        _createGLContext(canvas, options) {
            const names = ['webgl2', 'webgl', 'experimental-webgl'];
            let context = null;
            /* eslint-disable no-empty */
            for (let i = 0; i < names.length; ++i) {
                try {
                    context = canvas.getContext(names[i], options);
                }
                catch (e) { }
                if (context) {
                    break;
                }
            }
            return context;
            /* eslint-enable no-empty */
        }
    }
    ThreeLayer.registerRenderer('gl', ThreeRenderer);
    function getGLRes(map) {
        return map.getGLRes ? map.getGLRes() : map.getGLZoom();
    }
    function coordinateToPoint(map, coordinate, res, out) {
        if (map.coordToPointAtRes) {
            return map.coordToPointAtRes(coordinate, res, out);
        }
        return map.coordinateToPoint(coordinate, res, out);
    }
    if (maptalks__namespace.registerWorkerAdapter) {
        maptalks__namespace.registerWorkerAdapter(getWorkerName(), getWorkerCode());
        maptalks__namespace.registerWorkerAdapter(fetchDataWorkerKey, fetchDataWorkerCode);
    }

    exports.BaseObject = BaseObject;
    exports.BaseObjectTask = BaseObjectTask;
    exports.BaseObjectTaskManager = BaseObjectTaskManager;
    exports.ExtrudeUtil = ExtrudeUtil;
    exports.GeoJSONUtil = GeoJSONUtil;
    exports.GeoUtil = GeoUtil;
    exports.IdentifyUtil = IdentifyUtil;
    exports.LineMaterial = LineMaterial;
    exports.LineUtil = LineUtil;
    exports.MergeGeometryUtil = MergeGeometryUtil;
    exports.MergedMixin = MergedMixin;
    exports.ThreeLayer = ThreeLayer;
    exports.ThreeRenderer = ThreeRenderer;
    exports.geometryExtrude = main;
    exports.getFetchDataActor = getFetchDataActor;
    exports.polyextrude = polyExtrude$1;

    Object.defineProperty(exports, '__esModule', { value: true });

    typeof console !== 'undefined' && console.log('maptalks.three v0.29.0');

}));
//# sourceMappingURL=maptalks.three.js.map
