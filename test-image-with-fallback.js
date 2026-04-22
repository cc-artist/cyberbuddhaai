"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ImageWithFallback_1 = require("./src/components/ImageWithFallback");
var TestComponent = function () {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(ImageWithFallback_1.default, { src: "/temple-images/fHPlMoqxg.jpg", alt: "Test Image", className: "w-full h-full object-cover" })));
};
exports.default = TestComponent;
