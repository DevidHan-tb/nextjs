'use client';
import { Table, theme } from 'antd';
import { Space, Tag, type TableProps } from 'antd';
import axios from '@/utils/axios';
import AvaForm from './AvaForm';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
interface DataType {
  key: string;
  name: string;
  role: number;
  desc: string;
  tags: string[];
  password: string;
  email: string;
}
export default function User() {
  const [data, setData] = useState<DataType[]>([]);
  const { token } = theme.useToken();
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      fixed: 'left',
      width: 100
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => role === '1' ? '超级管理员' : '开发者'
    },
    {
      title: '简介',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '标签',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];
  const listStyle: React.CSSProperties = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12
  };
  const datas = async () => {
    const res = await axios.get('ztx/login')
    setData(res.data.data)
  }
  useEffect(() => {
    datas()
  }, [])
  return (
    <Layout curActive='/user'>
      <main >
        <div >
          <AvaForm />
          <div style={listStyle}>
            <h3>用户列表</h3>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} scroll={{ x: 1000 }} />
          </div>
        </div>
      </main>
    </Layout>

  );
}
