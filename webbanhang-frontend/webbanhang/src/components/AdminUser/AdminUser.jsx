import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./styled";
import {Button, Form, Space} from 'antd'
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons'
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import ModalComponent from "../ModalComponent/ModalCompent";
import Loading from "../LoadingComponent/Loading";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { getBase64 } from "../../utils";
import * as message from '../../components/Message/Message'
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from '../../service/UserService'
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { render } from "react-dom";

const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const user = useSelector((state) => state?.user)

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''

    })

    const [form] = Form.useForm();


    const mutationUpdate = useMutationHooks(
    (data) => {
        const {
        id,
        token,
        ...rests } = data
        
    const res = UserService.updateUser(
        id, token, {...rests})
        return res
    }
  )

  const mutationDelete = useMutationHooks(
    (data) => {
        const {
        id,
        token,
        } = data
        
    const res = UserService.deleteUser(
        id, token)
        return res
    }
  )



    const getAllUser = async () => {
        try {
            const res = await UserService.getAllUser(user?.access_token)
            return res
            
        } catch (error) {
            console.log(error)
             throw error;
        }
    }
    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected)
        if(res?.data){
            setStateUserDetails({
                name: res?.data.name,
                email: res?.data.email,
                phone: res?.data.phone,
                isAdmin: res?.data.isAdmin,
                address: res?.data.address,
                avatar: res?.data.avatar
            })
        }
        setIsPendingUpdate(false)
    }
    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    },[form, stateUserDetails])

    useEffect(()=>  {
        if(rowSelected){
            setIsPendingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    },[rowSelected])

    const handleDetailsProduct = async () => {
        setIsOpenDrawer(true)
    }
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccesUpdated, isError: isErrorUpdated} = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccesDeleted, isError: isErrorDeleted} = mutationDelete
    


    const queryUser = useQuery({
            queryKey: ['user'],
            queryFn: getAllUser,
});
    const isFetchingUser = useIsFetching(['users']) 
    const { isPending: isPendingUsers, data: users} = queryUser
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{color: 'red', fontSize:'30px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined style={{color: 'orange', fontSize:'30px',cursor: 'pointer'}} onClick={handleDetailsProduct}/>
            </div>
        )
    }



const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex
  ) => {
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
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ''}`}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys)[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: text =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });




const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    ...getColumnSearchProps('name')
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: (a, b) => a.email.length - b.email.length,
    ...getColumnSearchProps('email')
  },
  {
    title: 'Address',
    dataIndex: 'address',
    sorter: (a, b) => a.address.length - b.address.length,
    ...getColumnSearchProps('address')
  },
  {
    title: 'Admin',
    dataIndex: 'isAdmin',
    filters: [
        {
            text: 'True',
            value: true,
        },
        {
            text: 'False',
            value: false,
        },
        
    ],
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    sorter: (a, b) => a.phone - b.phone,
    ...getColumnSearchProps('phone')
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: renderAction
    }
  
];
const dataTable= users?.data.length && users?.data?.map((user)=> {
  return {...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'}
})

    useEffect(()=>{
        if(isSuccesDeleted && dataDeleted?.status === 'OK'){
            message.success()
            handleCancel()
        }else if (isErrorDeleted){
            message.error()
        }
    },[isSuccesDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false
        })
        form.resetFields()
    }

    useEffect(()=>{
        if(isSuccesUpdated && dataUpdated?.status === 'OK'){
            message.success()
            setIsOpenDrawer(false);
        }else if (isErrorUpdated){
            message.error()
        }
    },[isSuccesUpdated])

    const handleCancelDelete = () =>{
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        setIsModalOpenDelete(false)
        mutationDelete.mutate({
            id: rowSelected,
            token: user?.access_token},
            {
                onSettled: () => {
                    queryUser.refetch()
                }
            }
        )
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false
        })
        form.resetFields()
    }

    const handleOnchangeDetails = (e) =>{
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
        }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }
    const onUpdateUser = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetails}, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
  
    }
    return (
        <div>
          <WrapperHeader>Quản lý người dùng</WrapperHeader>
          <div style={{ marginTop: '20px' }}>
            <TableComponent columns={columns} isPending={isFetchingUser} data={dataTable} onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  setRowSelected(record._id)
                }
              };
            }} />
          </div>
          <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
            <Loading isPending={isPendingUpdate || isPendingUpdated}>
    
              <Form
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                onFinish={onUpdateUser}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <InputComponent value={stateUserDetails?.name} onChange={handleOnchangeDetails} name="name" />
                </Form.Item>
    
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <InputComponent value={stateUserDetails?.email} onChange={handleOnchangeDetails} name="email" />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: 'Please input your  phone!' }]}
                >
                  <InputComponent value={stateUserDetails?.phone} onChange={handleOnchangeDetails} name="phone" />
                </Form.Item>
    
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: 'Please input your  address!' }]}
                >
                  <InputComponent value={stateUserDetails?.address} onChange={handleOnchangeDetails} name="address" />
                </Form.Item>
    
                <Form.Item
                  label="Avatar"
                  name="avatar"
                  rules={[{ required: true, message: 'Please input your image!' }]}
                >
                  <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                    <Button >Select File</Button>
                    {stateUserDetails?.avatar && (
                      <img src={stateUserDetails?.avatar} style={{
                        height: '60px',
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '10px'
                      }} alt="avatar" />
                    )}
                  </WrapperUploadFile>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Apply
                  </Button>
                </Form.Item>
              </Form>
            </Loading>
          </DrawerComponent>
          <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
            <Loading isPending={isPendingDeleted}>
              <div>Bạn có chắc xóa tài khoản này không?</div>
            </Loading>
          </ModalComponent>
        </div>
      )
}  

export default AdminUser