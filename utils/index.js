"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getRandomNumber = exports.formatMessage = void 0;
const formatMessage = (message) => {
    return `**${message}**`;
};
exports.formatMessage = formatMessage;
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomNumber = getRandomNumber;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
