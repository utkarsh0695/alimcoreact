import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { Card } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { getUserPermissionAPI, updateUserPermissionAPI } from "../../api/user";
import CustomCheckbox from "../../CommonElements/Checkbox/index";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";
import { useNavigate } from "react-router";


const Permission = () => {
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formChanged, setFormChanged] = useState(false);
  const [allCreateChecked, setAllCreateChecked] = useState(false);
  const [allReadChecked, setAllReadChecked] = useState(false);
  const [allUpdateChecked, setAllUpdateChecked] = useState(false);
  const [allDeleteChecked, setAllDeleteChecked] = useState(false);
  const location = useLocation();
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const title = location.state.user.name;
  const navigate = useNavigate()
  useEffect(() => {
    const id = location.state.user.id;
    const data = {
      user_id: id,
    };
    fetchUserPermission(data);
  }, []);



  const fetchUserPermission = async (data) => {
    setIsLoading(true)
    const response = await getUserPermissionAPI(data, tokenHeader);
    if (response.data.status === "success") {
      setIsLoading(false);
      setData(response.data.data);
    } else if (response.data.status == "failed") {
      setIsLoading(false);
      toast.error(response.data.message);
    } else if (response.data.status == "expired") {
      logout(response.data.message);
    }
  };
  const handleCheckboxChange = (row, permission) => {
    setData((prevState) =>
      prevState.map((dataRow) =>
        dataRow.menu_id === row.menu_id
          ? { ...dataRow, [permission]: !dataRow[permission] }
          : dataRow
      )
    );
    setFormChanged(true);
  };
  const handleSubmit = async () => {
    setIsLoading(true)
    const id = location.state.user.id;
    const formData = {
      user_id: id,
      permissions: data
    }
    setIsLoading(true)
    // return false;
    try {
      const response = await updateUserPermissionAPI(formData)
      if (response.data.status === 'success') {
        setIsLoading(false)
        toast.success(response.data.message)
        navigate(`${process.env.PUBLIC_URL}/user/add-user`)
      } else if (response.data.status == "failed") {
        setIsLoading(false);
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log('error', err.message);

    }
  };
  const handleHeaderCheckboxChange = (
    permission,
    setAllChecked,
    allChecked
  ) => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setData((prevState) =>
      prevState.map((dataRow) => ({
        ...dataRow,
        [permission]: newValue,
      }))
    );
    setFormChanged(true);
  };
  const columns = [
    {
      name: "Menu",
      selector: (row) => row?.menu_name,
      sortable: true,
    },
    {
      name: "sub Menu",
      selector: (row) => row?.sub_menu,
      sortable: true,
    },
    {
      name: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CustomCheckbox
            checked={allCreateChecked}
            onChange={() =>
              handleHeaderCheckboxChange(
                "isCreate",
                setAllCreateChecked,
                allCreateChecked
              )
            }
            style={{ marginRight: "8px" }}
          />
          Create
        </div>
      ),
      cell: (row) => (
        <CustomCheckbox
          checked={row.isCreate}
          onChange={() => handleCheckboxChange(row, "isCreate")}
        />
      ),
      sortable: false,
    },
    {
      name: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CustomCheckbox
            checked={allReadChecked}
            onChange={() =>
              handleHeaderCheckboxChange(
                "isView",
                setAllReadChecked,
                allReadChecked
              )
            }
            style={{ marginRight: "8px" }}
          />
          Read
        </div>
      ),
      cell: (row) => (
        <CustomCheckbox
          checked={row.isView}
          onChange={() => handleCheckboxChange(row, "isView")}
        />
      ),
      sortable: false,
    },
    {
      name: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CustomCheckbox
            checked={allUpdateChecked}
            onChange={() =>
              handleHeaderCheckboxChange(
                "isUpdate",
                setAllUpdateChecked,
                allUpdateChecked
              )
            }
            style={{ marginRight: "8px" }}
          />
          Update
        </div>
      ),
      cell: (row) => (
        <CustomCheckbox
          checked={row.isUpdate}
          onChange={() => handleCheckboxChange(row, "isUpdate")}
        />
      ),
      sortable: false,
    },
    // {
    //   name: (
    //     <div style={{ display: 'flex', alignItems: 'center' }}>
    //       <CustomCheckbox
    //         checked={allDeleteChecked}
    //         onChange={() => handleHeaderCheckboxChange('isDelete', setAllDeleteChecked, allDeleteChecked)}
    //         style={{ marginRight: '8px' }}
    //       />
    //       Delete
    //     </div>
    //   ),
    //   cell: (row) => (
    //     <CustomCheckbox
    //       checked={row.isDelete}
    //       onChange={() => handleCheckboxChange(row, 'isDelete')}
    //     />
    //   ),
    //   sortable: false,
    // },
  ];
  return (
    <>
      <Breadcrumbs
        mainTitle="Permission"
        parent="Pages"
        title="User permission"
      />
      <Card className="mt-3"></Card>
      <MyDataTable
        export
        name={"Permission"}
        isLoading={isLoading}
        title={title}
        columns={columns}
        data={data}
        onClick={handleSubmit}
      />
    </>
  );
};

export default Permission;
