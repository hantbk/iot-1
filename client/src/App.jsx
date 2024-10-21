import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table,notification } from 'antd';
import Highlighter from 'react-highlight-words';
import "./App.css";
import { getAllDevices } from './api';
import Popup from './Component/Popup';
import PopupUpdate from './Component/PopupUpdate';

const App = () => {

  const [isClick, setIsClick] = useState(false);
  const [isClickUpdate, setIsClickUpdate] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({});
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };




  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => {
            confirm({ closeDropdown: false });
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
          }}>
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'ID Thiết bị',
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: '30%',
      ...getColumnSearchProps('deviceId'),
    },
    {
      title: 'ID Qrcode',
      dataIndex: 'qrCodeId',
      key: 'qrCodeId',
      width: '30%',
      ...getColumnSearchProps('qrCodeId'),
    },
    {
      title: 'Qr Code',
      dataIndex: 'qrCodeValue',
      key: 'qrCodeValue',
      ...getColumnSearchProps('qrCodeValue'),
      sorter: (a, b) => a.qrCodeValue.length - b.qrCodeValue.length,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const handleRowClick = (record) => {
    console.log(record)
    setSelected(record); // Lưu thiết bị đã chọn
    console.log("abc",selected);
    setIsClickUpdate(!isClickUpdate); // Mở popup
  };

  const fetchData = async () => {
    try {
      const devices = await getAllDevices();
      setData(devices);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, [isClick, isClickUpdate]);

  return (
    <>
      {isClick && (
        <>
          <div className="overlay"></div> {/* Overlay click closes the popup */}
          <Popup onClose={() => setIsClick(!isClick)}/>
        </>
      )}
      {isClickUpdate && (
        <>
          <div className="overlay"></div> {/* Overlay click closes the popup */}
          <PopupUpdate onCloseUpdate={() => setIsClickUpdate(!isClickUpdate)} device = {selected}/>
        </>
      )}
      <div className='App'>
        <Button type="primary" className='button' onClick={() => setIsClick(true)} tac = "Thêm">Thêm thiết bị</Button>
        <Table columns={columns} dataSource={data} onRow={(record) => ({
            onClick: () => handleRowClick(record), // Thêm onClick vào từng dòng
          })}/>
      </div>
    </>
  );
};

export default App;
