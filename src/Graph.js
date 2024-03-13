import Cytoscape from 'cytoscape';
import COSEBilkent from 'cytoscape-cose-bilkent';
import React, { useEffect, useState } from 'react';
import { getGraph } from './api';
import CytoscapeComponent from 'react-cytoscapejs';
import {Input} from 'antd';
import './App.css';

Cytoscape.use(COSEBilkent);

const NodeType = {
  intent: 'intent',
  collection: 'collection',
  entity: 'entity',
  up: 'up',
  down: 'down',
} 
const LinkType = {
  Cluster: 'Cluster',
  Highlight: 'Highlight',
  Common: 'Common',
};
const colorPalettes = {
  intent: 'rgb(213, 64, 98)', 
  collection: 'rgb(255, 163, 108)', 
  root: 'rgb(235, 220, 135)', 
  entity: 'rgb(121, 147, 81)'
};

const linkPalettes = {
  common: 'rgb(235,235,235)',
  highlight: 'rgb(184,184,184)',
  cluster: 'rgb(235,235,235)',
  warn: '#ff0000',

}

const defaultColor = 'rgb(184,184,184)';
const nodeSize = 120;
const initData =  [
  { data: { id: 'one', label: 'Node 1', type: NodeType.intent, selected: true }, position: { x: 0, y: 0 } },
  { data: { id: 'two', label: 'Node 2', type: NodeType.collection, selected: false }, position: { x: 100, y: 0 } },
  { data: { id: 'three', label: 'Node 3', type: NodeType.entity, selected: false }, position: { x: 100, y: 0 } },
  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
];

const MyApp = () => {
  const [elements, setElements] = useState(initData)
  const [updateNodeName, setUpdateNodeName] = useState('');

  useEffect(() => {
    getGraph().then((res) => {
      console.log('res', res);
      const nodes = res.data.nodes.map((node) => {
        return { data: { id: node.id, label: node.label, type: node.type, selected: false } }
      });
      const edges = res.data.edges.map((edge) => {
        return { data: { source: edge.source, target: edge.target, label: edge.label } }
      });
      setElements([...nodes, ...edges] );
    });
  }, []);
  const layout = { name: 'cose-bilkent' };
  console.log('layout', layout)
  const cyRef = React.useRef(null);
  const getInfo = () => {
    const cy = cyRef.current;
    const selectedNodes = cy.nodes(":selected");

  // 遍历选中的节点并获取信息
      selectedNodes.forEach(function(node){
      console.log("Selected Node ID: " + node.id());
      console.log("Selected Node Data: ", node.data());
    });
  }
  const addLinkFlag = React.useRef(false);
  const selectedNodes = React.useRef([]);
  const addLink = () => {
    const cy = cyRef.current;
    const selectedNodes = cy.nodes(":selected");
    if(selectedNodes.length === 2){
        cy.add({ data: { source: selectedNodes[0].id(), target: selectedNodes[1].id(), label: 'Edge from Node1 to Node3' } });
        // cy.layout({ name: 'grid' }).run();
        // cancel selection
        cy.nodes().unselect();
        
    }
  }
  const registListener = () => {
    const cy = cyRef.current;
    cy.off('tap', 'node');
  
    cy.on('tap', function(evt){
      if( evt.target === cy ){
        const infoPanel = document.getElementById('infoPanel');
        infoPanel.style.display = 'none';
      }
    });

    cy.on('tap', 'node', function(evt){
      const node = evt.target;
      selectedNodes.current.push(node.id());
      
      console.log('tapped ', selectedNodes.current.length);
      const infoPanel = document.getElementById('infoPanel');
      const renderedPosition = node.renderedPosition();
      const panelWidth = document.getElementById('infoPanel').offsetWidth;

      // 显示面板并更新其位置
      infoPanel.style.display = 'block';
      infoPanel.style.left = (renderedPosition.x - panelWidth - 20) + 'px'; // 20是节点到面板的距离
      infoPanel.style.top = renderedPosition.y + 'px';
      infoPanel.innerHTML = `<p>选中节点: ${selectedNodes.current.length !== 2}</p>
        <button id="btnInfo">显示信息</button>
        <button id="btnAddEdge" ${selectedNodes.current.length !== 2 ? 'disabled' : ''}>添加边</button>
        <button id="btnRemove">删除节点</button>`;
      if(selectedNodes.current.length === 2 && addLinkFlag.current){
          cy.add({ data: { source: selectedNodes.current[0], target: selectedNodes.current[1], label: 'Edge from Node1 to Node3' } });
          addLinkFlag.current = false;
          selectedNodes.current = [];
          infoPanel.style.display = 'none';
      }
      // 显示节点信息
      document.getElementById('btnInfo').addEventListener('click', function(){
          alert(`节点信息：\nID: ${node.id()}\nName: ${node.data('name')}`);
      });

      // 添加边（需要实现选择另一个节点的逻辑）
      document.getElementById('btnAddEdge').addEventListener('click', function(){
          // 此处添加添加边的逻辑
          addLinkFlag.current = true;
          cy.add({
            group: 'edges',
            data: { source: selectedNodes.current[0], target: selectedNodes.current[1] }
        });
        selectedNodes.current = [];
        infoPanel.style.display = 'none';
      });

      // 删除节点
      document.getElementById('btnRemove').addEventListener('click', function(){
          node.remove();
          document.getElementById('selectionPanel').innerHTML = `<p>点击节点以查看信息。</p>`;
      });
    });
  }

  const styleSheet = [
    {
      selector: "node",
      style: {
        
        "font-size": "14px",
        "text-valign": "center",
        // "font-weight": "bold",
        "text-halign": "center",
        "background-color": "#fff",
        "color": "#555",
        "overlay-padding": "6px",
        "z-index": "10",
        "border-width": "2px",
        "border-color": defaultColor,
        width: nodeSize,
        height: nodeSize,
        "text-outline-width": 1,
        "text-outline-color": '#fff',
        "text-outline-opacity": 0.1,
        "overlay-color": "#FACD37",
        opacity: 0.5,
      }
    },
    {
      selector: `node[type='${NodeType.intent}']`,
      style: {
        content: "data(label)",
        borderColor: colorPalettes.intent,  
        color: colorPalettes.intent, 
        width: nodeSize * 1.5,
        height: nodeSize * 1.5,
        fontSize: '14px',
      }
    },
    {
      selector: '.node-selecting',
      style: {
        opacity: 1,
      }
    },
    {
      selector: `.${NodeType.intent}-selected`,
      style: {
        content: "data(label)",
        "border-color": colorPalettes.intent,   
        backgroundColor: colorPalettes.intent,
        color: '#000',
        opacity: 1,
      }
    },
    {
      selector: `.${NodeType.entity}-selected`,
      style: {
        content: "data(label)",
        "border-color": colorPalettes.entity,   
        backgroundColor: colorPalettes.entity,
        color: '#000',
        opacity: 1,
      }
    },
    {
      selector: `.${NodeType.collection}-selected`,
      style: {
        content: "data(label)",
        "border-color": colorPalettes.collection,   
        backgroundColor: colorPalettes.collection,
        color: '#000',
        opacity: 1,
      }
    },
    {
      selector: `node[type='${NodeType.entity}']`,
      style: {
        content: "data(label)",
        "border-color": colorPalettes.entity,
      
      }
    },
    {
      selector: `node[type='${NodeType.collection}']`,
      style: {
        content: "data(label)",
        "border-color": colorPalettes.collection,
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": linkPalettes.common,
        "curve-style": "bezier",
        // 设置显示箭头
        "target-arrow-shape": "triangle",
        // 设置中间显示text
        "target-arrow-color": linkPalettes.common,
        "label": "data(label)",
        // 设置字体大小
        "font-size": "14px",
        // 设置字体颜色
        "color": "#000",

      }
    },
    {
      selector: '.edge-selected', 
      style: {
        'line-style': 'dashed',
        width: 5,
        "line-color": linkPalettes.highlight,
        "target-arrow-color": linkPalettes.highlight,
        "target-arrow-shape": "triangle",
      }
    },
    {
      selector: `edge[type='${LinkType.Common}']`,
      style: {
        "line-color": linkPalettes.common,
        "target-arrow-color": linkPalettes.common,
        "target-arrow-shape": "triangle",
      }
    },
    {
      selector: '.edge-unselected', 
      style: {
        width: 3,
      }
    },
    {
      selector: `edge[type='${LinkType.Highlight}']`,
      style: {
        "line-color": linkPalettes.highlight,
        "target-arrow-color": linkPalettes.highlight,
        "target-arrow-shape": "triangle",
      }
    },
    {
      selector: `edge[type='${LinkType.Cluster}']`,
      style: {
        "line-color": linkPalettes.cluster,
      }
    },
    {
      selector: `.hide`,
      style: {
        display: 'none',
      }
    },
  ];

  const getHint = () => {
    return '请输入节点名称：'
  }

  const getInputComp = () => {
    return <Input value={updateNodeName} onChange={(e) => setUpdateNodeName(e.target.value) }/>
  }

  return (
    <div className='h-full w-full'>
      <div className="flex  items-center" style={{height: 100}}>
        <div>{getHint()}</div>
        <div>{getInputComp()}</div>
      </div>
      <CytoscapeComponent cy={cy => {cyRef.current = cy; registListener();}} elements={elements} style={{ width: '100%', height: '100%' }} layout={layout} stylesheet={styleSheet} />

    <div id="infoPanel" className="info-panel"/>
    </div>
  )
}
export default MyApp;