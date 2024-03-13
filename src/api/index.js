import request from '../utils/request';

function getInitInfo() {
    return request({
        url: '/api/initInfo',
        method: 'get',
    });
}

function editMessage(data) {
    return request({
        url: '/api/editMsg',
        method: 'post',
        data,
    });
}

function getGraph() {
    return request({
        url: '/api/temp_graph',
        method: 'get',
    })
}

function selectSingleNode(data) {
    return request({
        url: '/api/select_single_node',
        method: 'post',
        data
    });
}

function selectMultiNode(data) {
    return request({
        url: '/api/select_multi_node',
        method: 'post',
        data
    });
}

function searchKey(data) {
    return request({
        url: '/api/search',
        method: 'post',
        data,
    });
}
function expandNode(data) {
    console.log('expandNode', data);
    return request({
        url: '/api/expand',
        method: 'post',
        data,
    });
}
function collapseNode(data) {
    return request({
        url: '/api/collapse',
        method: 'post',
        data,
    });
}

function listCommands(data) {
    return request({
        url: '/api/listCommands',
        data,
        method: 'post',
    });
}

function saveOrUpdateCommand(data) {
    return request({
        url: '/api/saveCommand',
        data,
        method: 'post',
    });
}
function deleteCommand(data) {
    return request({
        url: '/api/deleteCommand',
        data,
        method: 'post',
    });
}
function getPrefixTree() {
    return request({
        url: '/api/searchInitData',
        method: 'get',
    })
}
export {getInitInfo, editMessage, getGraph, selectSingleNode, selectMultiNode, searchKey, expandNode, collapseNode, listCommands, saveOrUpdateCommand, deleteCommand, getPrefixTree};