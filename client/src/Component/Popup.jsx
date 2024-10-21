// Component/Popup.js
import './Popup.css'; // Thêm file CSS cho Popup
import React, { useState } from 'react';
import { Button, Form, Input, Radio, Space } from 'antd';
import { createDevices } from '../api';

const Popup = ({ onClose }) => {
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('horizontal');
    const onFormLayoutChange = ({ layout }) => {
      setFormLayout(layout);
    };

    

    const [formData, setFormData] = useState({
        deviceId: "",
        qrCodeId: "",
        qrCodeValue: ""
    })

    const handleCreateForm = async() =>{
        try {
          const res = await createDevices(formData);
          onClose()
          alert("Thêm thiết bị thành công")
        } catch (error) {
          alert("Thêm thiết bị không thành công")
          throw error;
        }
    }
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
                            />
                        </Form.Item>
                        <Form.Item label="ID Mã QR">
                            <Input  placeholder="ID Mã QR" 
                                    value={formData.qrCodeId}
                                    onChange={(e) => setFormData((prev) => ({
                                            ...prev,
                                            qrCodeId: e.target.value,
                                    }))}
                            />
                        </Form.Item>
                        <Form.Item label="Mã QR">
                            <Input  placeholder="Mã QR" 
                                    value={formData.qrCodeValue}
                                    onChange={(e) => setFormData((prev) => ({
                                        ...prev,
                                        qrCodeValue: e.target.value,
                                    }))}
                            />
                        </Form.Item>
                        <Form.Item  style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Space>
                                <Button type="primary" onClick={handleCreateForm}>Thêm</Button>
                                <Button type="primary" danger onClick={onClose}> Huỷ </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                )
            
            }
        </div>
    );
};

export default Popup;
