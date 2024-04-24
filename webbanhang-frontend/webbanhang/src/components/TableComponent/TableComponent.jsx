import React from "react";
import {Table} from 'antd';
import Loading from "../LoadingComponent/Loading";

const TableComponent = (props) => {
  const {selectionType = 'checkbox', data=[], isPending= false, columns=[]} = props


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
    return(
          <Loading isPending={isPending}>
            <Table 
                rowSelection={{
                type: selectionType,
                ...rowSelection,
            }}  
                columns={columns}
                dataSource={data}
                {...props}
            />
          </Loading>
    )
}

export default TableComponent