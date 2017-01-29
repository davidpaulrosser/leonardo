import * as GL from 'core/GL';
import { extensions } from 'core/Capabilities';
import BufferAttribute from './BufferAttribute';
import Face from './Face';
import Vector3 from 'math/Vector3';
import Vector2 from 'math/Vector2';
import { ERROR_EXTENSION_ANGLE_INSTANCE_ARRAYS } from 'core/Messages';
import { warn } from 'utils/Console';

let gl;

export default class Geometry {
	constructor(vertices, indices, normals, uvs, colors) {
		gl = GL.get();
		this.bufferVertices = vertices;
		this.bufferIndices = indices;
		this.bufferNormals = normals;
		this.bufferUvs = uvs;
		this.bufferColors = colors;
		this.attributes = {};
		this.attributesInstanced = {};

		// Vertex positions
		if (this.bufferVertices) {
			this.addAttribute('aVertexPosition', gl.ARRAY_BUFFER, vertices, 3);
			this.generateVertices();
		}

		// Vertex indices
		if (this.bufferIndices) {
			this.addAttribute('aIndex', gl.ELEMENT_ARRAY_BUFFER, indices, 1, false);
			this.generateFaces();
		}

		// Vertex normals
		if (this.bufferNormals) {
			this.addAttribute('aVertexNormal', gl.ARRAY_BUFFER, normals, 3);
		}

		// uvs
		if (this.bufferUvs) {
			this.addAttribute('aUv', gl.ARRAY_BUFFER, uvs, 2);
			this.generateUvs();
		}

		// Vertex colors
		if (this.bufferColors) {
			this.addAttribute('aVertexColor', gl.ARRAY_BUFFER, colors, 3);
		}
	}

	addAttribute(name, type, data, count, shaderAttribute) {
		gl = GL.get();
		this.attributes[name] = new BufferAttribute(gl, type, data, count, shaderAttribute);
	}

	addInstancedBufferAttribute(name, value, count) {
		gl = GL.get();
		if (!extensions.angleInstanceArraysSupported) {
			warn(ERROR_EXTENSION_ANGLE_INSTANCE_ARRAYS);
			return;
		}
		this.attributesInstanced[name] = new BufferAttribute(gl, gl.ARRAY_BUFFER, value, count);
	}

	generateVertices() {
		this.vertices = [];
		for (let i = 0; i < this.bufferVertices.length; i += 3) {
			const a = this.bufferVertices[i];
			const b = this.bufferVertices[i + 1];
			const c = this.bufferVertices[i + 2];
			const vertex = new Vector3(a, b, c);
			this.vertices.push(vertex);
		}
	}

	generateFaces() {
		this.faces = [];
		for (let i = 0; i < this.bufferIndices.length; i += 3) {
			const ia = this.bufferIndices[i];
			const ib = this.bufferIndices[i + 1];
			const ic = this.bufferIndices[i + 2];
			const a = this.vertices[ia];
			const b = this.vertices[ib];
			const c = this.vertices[ic];

			const face = new Face(ia, ib, ic, a, b, c);
			this.faces.push(face);
		}
	}

	generateUvs() {
		this.uvs = [];
		for (let i = 0; i < this.bufferUvs.length; i += 2) {
			const a = this.bufferUvs[i];
			const b = this.bufferUvs[i + 1];

			const uv = new Vector2(a, b);
			this.uvs.push(uv);
		}
	}

	dispose() {
		gl = GL.get();
		// Dispose attributes and buffers
		Object.keys(this.attributes).forEach(attributeName => {
			console.log('attributeName', attributeName);
			this.attributes[attributeName].dispose(gl);
			delete this.attributes[attributeName];
		});
		Object.keys(this.attributesInstanced).forEach(attributeName => {
			this.attributesInstanced[attributeName].dispose(gl);
			delete this.attributesInstanced[attributeName];
		});
		delete this.attributes;
		delete this.attributesInstanced;
	}
}
