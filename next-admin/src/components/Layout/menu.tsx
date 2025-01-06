import {
    FundOutlined,
    BarChartOutlined,
    DesktopOutlined,
    ScheduleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import React from 'react';
const getNavList = () => {
    return [
        {
            key: '/',
            icon: <DesktopOutlined />,
            label: '可视化大屏',
            children: [
                {
                    key: '/dashboard',
                    icon: <BarChartOutlined />,
                    label: '自定义报表'
                },
                {
                    key: '/dashboard/monitor',
                    icon: <FundOutlined />,
                    label: '可视化流程编排'
                }
            ]
        },
        {
            key: '/user',
            icon: <UserOutlined />,
            label: '用户管理'
        },
        {
            key: '/order',
            icon: <ScheduleOutlined />,

            label: '订单列表'
        }, {
            key: '/dwjsc',
            icon: <ScheduleOutlined />,

            label: '文件上传'
        },

    ]
}

export default getNavList