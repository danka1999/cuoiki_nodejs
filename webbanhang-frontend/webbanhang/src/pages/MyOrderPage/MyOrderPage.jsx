import React, {  useCallback, useEffect } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { dataTagSymbol, useQuery } from '@tanstack/react-query';
import * as OrderService from '../../service/OrderService';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './styled';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'


const MyOrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const {state} = location
    console.log(location)
    const fetchMyOrder = useCallback(async () => {
        const res = await OrderService.getOrderByUserId(state?.id, state?.token);
        return res.data;
    }, []);

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: fetchMyOrder, enabled: !!(state?.id && state?.token) });
    const { isPending, data } = queryOrder;
    
    const mutation = useMutationHooks(
        (data) => {
            const {id, token, orderItems } = data
            const res = OrderService.cancelOrder(id, token,orderItems)
            return res
        }
    )

    const handleCancerOrder = (order) => {
        mutation.mutate({id: order._id, token: state?.token, orderItems: order?.orderItems}, {
            onSuccess: () => {
                queryOrder.refetch()
            }
        })
    }

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`,{
            state: {
                token: state?.token

            }
        })
    }
    const {isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel} = mutation
    useEffect(() => {
        if(isSuccessCancel && dataCancel?.status === 'OK'){
            message.success()
        }else if (isErrorCancel){
            message.error()
        }
    }, [isErrorCancel, isSuccessCancel])

    const renderProduct = (data) => {
        return data?.map((order) => {
          return <WrapperHeaderItem key={order?._id}> 
                  <img src={order?.image} 
                    style={{
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px'
                    }}
                  />
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px'
                  }}>{order?.name}</div>
                  <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
                </WrapperHeaderItem>
              })
      }

    console.log(data?.orderItems)
    return (
        <Loading isPending={isPending || isPendingCancel}>
            <WrapperContainer>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                    {data?.map((order) => {
                        return (
                            <WrapperItemOrder key={order?._id}>
                                <WrapperStatus>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                                    <div>
                                        <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                                        <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                                    </div>
                                    <div>
                                        <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                                        <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                                    </div>
                                </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                <WrapperFooterItem>
                                    
                                    <div>
                                        <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                                        <span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>{convertPrice(order?.totalPrice)}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        
                                        <ButtonComponent
                                            onClick={() => handleCancerOrder(order)}
                                            styleButton={{
                                                background: "rgb(255, 57, 69)",
                                                height: "36px",
                                            
                                                border: '1px solid #9255FD',
                                                borderRadius: "4px",
                                            }}
                                            
                                            textButton="Hủy đơn hàng"
                                            styleTextButton={{
                                                color: '#fff', fontSize: '14px'
                                            }}
                                        ></ButtonComponent>

                                        
                                        <ButtonComponent
                                    onClick={() => handleDetailsOrder(order?._id)}
                                    styleButton={{
                                        background: "#fff",
                                        height: "36px",
                                        border: '1px solid #9255FD',
                                        borderRadius: "4px",
                                    }}
                                    
                                    textButton="Xem chi tiết"
                                    styleTextButton={{
                                        color: 'blue', fontSize: '14px'
                                    }}
                                ></ButtonComponent>
                                    </div>
                                </WrapperFooterItem>
                            </WrapperItemOrder>
                            )
                        })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>
    );
};

export default MyOrderPage;