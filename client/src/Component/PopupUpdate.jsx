// Component/Popup.js
import './Popup.css'; // Thêm file CSS cho Popup
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Radio, Space } from 'antd';
import { createDevices, DeleteDevice, getDevicesById, UpdateDevice } from '../api';

const PopupUpdate = ({ onCloseUpdate,device }) => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('horizontal');
    const onFormLayoutChange = ({ layout }) => {
      setFormLayout(layout);
    };

    const [isEdit, setIsEdit] = useState(false);

    

    const [formData, setFormData] = useState({
    })


    const getDeviceById = async() =>{
        try {
            const res = await getDevicesById(device.deviceId);
            console.log(res);
            setFormData(res);
        } catch (error) {
            
        }
    }
    const handleClickSua = () =>{
        setIsEdit(true);
    }

    const handleUpdate= async() =>{
        try {
          const res = await UpdateDevice(formData.deviceId,formData);
          onCloseUpdate()
          alert("Cập nhật thiết bị thành công")
        } catch (error) {
          alert("Cập nhật thiết bị không thành công")
          throw error;
        }
    }

    const handleDelete= async() =>{
        try {
          const res = await DeleteDevice(formData.deviceId,formData);
          onCloseUpdate()
          alert("Xoá thiết bị thành công")
        } catch (error) {
          alert("Xoá thiết bị không thành công")
          throw error;
        }
    }

    useEffect(() =>{
        getDeviceById()
    }, [])

    console.log(device.deviceId)
    return (
        
        <div className="popup">
            {
                (
                    <Form
                        layout={formLayout}
                        form={form}
                        initialValues={{
                            layout: formLayout,
                        }}
                        onValuesChange={onFormLayoutChange}
                        style={{
                            maxWidth: formLayout === 'inline' ? 'none' : 600,
                        }}
                        >
                        <Form.Item label="Mã thiết bị">
                            <Input  placeholder="Mã thiết bị " 
                                    name='deviceId'
                                    value={formData.deviceId}
                                    onChange={(e) => setFormData((prev) => ({
                                        ...prev,
                                        deviceId: e.target.value,
                                    }))}
                                    disabled
                            />
                        </Form.Item>
                        <Form.Item label="ID Mã QR">
                            <Input  placeholder="ID Mã QR" 
                                    value={formData.qrCodeId}
                                    onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            qrCodeId: e.target.value,
                                    }))}
                                    disabled = {!isEdit}
                            />
                        </Form.Item>
                        <Form.Item label="Mã QR">
                            <Input  placeholder="Mã QR" 
                                    value={formData.qrCodeValue}
                                    onChange={(e) => setFormData((prev) => ({
                                        ...prev,
                                        qrCodeValue: e.target.value,
                                    }))}
                                    disabled = {!isEdit}
                            />
                        </Form.Item>
                        <Form.Item  style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {isEdit === false
                                ?
                                (
                                    <Space>
                                        <Button type="primary"  onClick={handleClickSua}>Sửa </Button>
                                        <Button type="primary" danger onClick={handleDelete}> Xoá </Button>
                                        <Button  danger onClick={onCloseUpdate}> Huỷ </Button>
                                    </Space>
                                )
                                :
                                (
                                    <Space>
                                        <Button type="primary"  onClick={handleUpdate}>Thay đổi </Button>
                                        <Button  danger onClick={onCloseUpdate}> Huỷ </Button>
                                    </Space>
                                )
                            }
                        </Form.Item>
                    </Form>
                )
            
            }
        </div>
    );
};

export default PopupUpdate;
