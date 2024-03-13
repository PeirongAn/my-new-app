import React from 'react';
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
 
  getItem('节点操作', 'nodeOpt', <AppstoreOutlined />, [
    getItem('添加节点', 'addNode'),
    getItem('删除节点', 'delNode'),
    getItem('重命名节点', 'renameNode'),
   
  ]),
  {
    type: 'divider',
  },
  getItem('边操作', 'edgeOpt', <SettingOutlined />, [
    getItem('添加边', 'addEdge'),
    getItem('删除边', 'delEdge'),
    getItem('重命名边', 'renameEdge'),
  ]),
];
const OperationMenu = ({operationCb}) => {
  const onClick = (e) => {
    console.log('click ', e);
    operationCb(e.key);
  };
  return (
    <Menu
      onClick={onClick}
      defaultOpenKeys={['nodeOpt', 'edgeOpt']}
      mode="inline"
      items={items}
    />
  );
};
export default OperationMenu;