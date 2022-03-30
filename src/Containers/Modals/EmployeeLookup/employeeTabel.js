import React, { useEffect, useState } from "react";
import { Table } from "antd";

const EmployeeTabel = (props) => {
  const [state, setState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    clonedEmployeeList: [],
    selectedRow: "",
  });

  useEffect(() => {
    let updatedData = props.tabelData.map((item) => ({
      ...item,
      key: item.employeeCode,
    }));
    let checkedRow = props.tabelData.find((item) => item.checked === true);
    if (checkedRow) {
      checkedRow = checkedRow.employeeCode;
    } else {
      checkedRow = "";
    }
    setState((prev) => ({
      ...prev,
      selectedRow: checkedRow !== undefined ? checkedRow : "",
    }));
    setState((prev) => ({ ...prev, clonedEmployeeList: updatedData }));
  }, [props]);

  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setState((prev) => ({
      ...prev,
      filteredInfo: filters,
      sortedInfo: sorter,
    }));
  };

  const handleCheckbox = (e, data) => {};

  const rowSelection = {
    selectedRowKeys: [state.selectedRow],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      props.handleCheckbox("", selectedRows[0]);
    },
  };

  let { sortedInfo, filteredInfo } = state;
  sortedInfo = sortedInfo || {};
  filteredInfo = filteredInfo || {};

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      sortDirections: ["descend", "ascend"],
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      sortOrder: sortedInfo.columnKey === "firstName" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sortDirections: ["descend", "ascend"],
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortOrder: sortedInfo.columnKey === "lastName" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      sortDirections: ["descend", "ascend"],
      key: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      sortOrder: sortedInfo.columnKey === "department" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Position",
      dataIndex: "position",
      sortDirections: ["descend", "ascend"],
      key: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
      sortOrder: sortedInfo.columnKey === "position" && sortedInfo.order,
      ellipsis: true,
    },
  ];

  return (
    <>
      <Table
        rowSelection={{
          type: "radio",

          ...rowSelection,
        }}
        columns={columns}
        dataSource={state.clonedEmployeeList}
        // dataSource={props.tabelData}
        onChange={handleChange}
      />
    </>
  );
};

export default EmployeeTabel;
