import React, { useEffect, useState, useCallback, useRef } from 'react'
import { MessageOutlined } from '@ant-design/icons'
import { List, Avatar, message, Space } from 'antd'
import VirtualList from 'rc-virtual-list'
import './App.css'
// import 'antd/dist/antd.css';

interface UserItem {
  date: string
  from: string
  id: number
  image: string
  reads: number
  title: string
}
const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
)
const App = () => {
  const [data, setData] = useState([])
  const ContainerHeight = 800
  const batchSize = 10000 // 每次加载的项目数
  const listRef = useRef<HTMLDivElement>(null);

  const appendData = useCallback(() => {
    const currentScrollTop = listRef.current?.scrollTop || 0;
    fetch(
      `https://mock.apifox.com/m1/4552128-4200391-default/news?num=${batchSize}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData((prevData) => {
          const newData = prevData.concat(res.list);
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop = currentScrollTop;
            }
          }, 0);
          return newData;
        });
        message.success(`${res.list.length} more items loaded!`)
      })
  }, [batchSize])

  // 加载数据
  useEffect(() => {
    appendData()
  }, [appendData])

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    // Refer to: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#problems_and_solutions
    if (
      Math.abs(
        e.currentTarget.scrollHeight -
          e.currentTarget.scrollTop -
          ContainerHeight
      ) <= 1
    ) {
      appendData()
    }
  }

  return (
    <List itemLayout="vertical">
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="email"
        onScroll={onScroll}
      >
        {(item: UserItem) => (
          <List.Item
            key={item.id}
            className='list'
            actions={[
              <IconText
                icon={MessageOutlined}
                text={`${item.reads} ${item.from}`}
                key={item.id}
              />,
              <Space>{item.date}</Space>
            ]}
            extra={
              <img width={150} src={item.image} alt="logo" />
            }
          >
            {/* {item.title} */}
            <List.Item.Meta
              title={<a href="https://ant.design">{item.title}</a>}
            />
          </List.Item>
        )}
      </VirtualList>
    </List>
  )
}

export default App
// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         <Animation from={1} to={0} duration={1000} render={(opacity) => (
//             <p style={{opacity:opacity}}>文本隐藏动画</p>
//           )}
//         />
//       </div>
//     )
//   }
// }
