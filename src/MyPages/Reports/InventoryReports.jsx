import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import { aasraListAPI } from "../../api/dropdowns";
import { stockList, stockItemDetail } from "../../api/user";
import useLogout from "../../util/useLogout";
import { RUPEES_SYMBOL } from "../../Constant";

const InventoryReports = () => {
  const logout = useLogout();
  const userDetails = JSON.parse(localStorage.getItem("userDetail")); // Retrieve user details from local storage
  const userType = userDetails ? userDetails.user_type : "";
  const [searchText, setSearchText] = useState("");
  // const [aasraId, setAasraId] = useState(null);
  const [itemCol, setItemCol] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [aasraList, setAasraList] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm();
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };

  const fetchList = async (data) => {
    const bodyData = {
      aasra_id: data?.aasraId?.value || null ,
      spare_id: data?.spareType?.value || null,
      startDate: data?.startDate
        ? new Date(
          new Date(data.startDate).setDate(
            new Date(data.startDate).getDate() + 1
          )
        ).toISOString()
        : null,
      endDate: data?.endDate
        ? new Date(
          new Date(data.endDate).setDate(new Date(data.endDate).getDate())
        ).toISOString()
        : null,
    };
    // console.log(bodyData,data, "data");

    try {
      const response = await stockList(bodyData,tokenHeader);
      if (response.data.status === "success") {
        // console.log("res", response.data.data);
        setTableData(response.data.data);
        toast.success(response.data.message);
        // setAasraId(bodyData.aasra_id); // Store aasra_id in state
      } else if (response.data.status === "failed") {
        toast.error(response.data.message);
        setTableData([" "]);
      } else if (response.data.status === "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }
    return bodyData;
  };

  useEffect(() => {
    getAasraList();
  }, []);

  const getAasraList = async () => {
    try {
      const res = await aasraListAPI({}, tokenHeader);
      if (res.data.status === "success") {
        setAasraList(res.data.data);
      } else if (res.data.status == "failed") {
        setAasraList([]);
        toast.error(res.data.message);
      } else if (res.data.status == "expired") {
        logout(res.data.message);
      }
    } catch (err) {
      console.log("catch", err);
    }
  };

  const handleRowClick = async (row) => {
    // Logic to open the second table
    // console.log("Row clicked: ", row);
    // You can either show the new table or fetch new data for it
    const bodyDataa = {
      aasra_id: row?.aasra_id,
      item_id: row?.item_id,
    };

    // console.log(bodyDataa, "data");
    try {
      const response = await stockItemDetail(bodyDataa);
      if (response.data.status === "success") {
        setItemData(response.data.data);
        toast.success(response.data.message);
      } else if (response.data.status == "failed") {
        toast.error(response.data.message);
        setItemData([" "])
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (err) {
      console.log("error", err.message);
    }

    setItemCol(true);
  };

  // const [tableData, setTableData] = useState([
  //   {
  //     sr_no: 1,
  //     aasra_id: 1,
  //     aasra_name: "aasra name",
  //     issue_date: "12-12-2024",
  //     description: "some description",
  //     warranty: "25-12-2024",
  //     email: "test@gmail.com",
  //     status: "Done",
  //   },
  //   {
  //     sr_no:2,
  //     aasra_id:2,
  //     aasra_name:'aas name',
  //     issue_date:'12-12-2024',
  //     description:'some one description',
  //     warranty:'25-12-2024',
  //     email:'testone@gmail.com',
  //     status:'Pending'

  //   },
  //   {
  //     sr_no:3,
  //     aasra_id:3,
  //     aasra_name:'my name',
  //     issue_date:'12-12-2024',
  //     description:'some your description',
  //     warranty:'25-12-2024',
  //     email:'testtwo@gmail.com',
  //     status:'Open'

  //   }
  // ]);
  // const [tableColumn, setTableColumn] = useState([
  //   {
  //     name: "Sr No.",
  //     selector: (row) => row.sr_no,
  //     sortable: false,
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  //   {
  //     name: "Aasra ID",
  //     selector: (row) => row.aasra_id,
  //     sortable: true,
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  //   {
  //     name: "Aasra Name",
  //     selector: (row) => row.aasra.name_of_org,
  //     sortable: true,
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  //   {
  //     name: "	Date of Issued",
  //     selector: (row) => row.issue_date,
  //     sortable: true,
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  //   {
  //     name: "Description",
  //     selector: (row) => row.description,
  //     sortable: true,
  //     hide: 370,
  //     minWidth: "190px",
  //     wrap: true,
  //   },
  //   {
  //     name: "Warranty",
  //     selector: (row) => row.warranty,
  //     sortable: true,
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  //   {
  //     name: "Remark",
  //     selector: (row) => row.email,
  //     sortable: true,
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  //   {
  //     name: "Status",
  //     selector: (row) => (
  //       <span
  //         className={
  //           row.status == "Done"
  //             ? "badge badge-light-success"
  //             : row.status == "Pending"
  //             ? "badge badge-light-warning"
  //             : "badge badge-light-primary"
  //         }
  //       >
  //         {row.status}
  //       </span>
  //     ),
  //     hide: 370,
  //     minWidth: "190px",
  //   },
  // ]);

  const adminColumns = [
    {
      name: "Aasra ID",
      selector: (row) => row.aasra_id || "-",
      sortable: true,
      hide: 370,
      width: "90px",
    },
    {
      name: "Aasra Name",
      selector: (row) => row.aasra?.name_of_org || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },

    {
      name: "Additional Info",
      selector: (row) => row.aasra?.additionalInfo || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "Address",
      selector: (row) => row.aasra?.address || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "Adhaar No",
      selector: (row) => row.aasra?.adhaar_no || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Agreement of Rupee",
      selector: (row) => row.aasra?.agreement_of_rupee || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Amount",
      selector: (row) => `${RUPEES_SYMBOL}${row.aasra?.amount || "-"}`,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Area Sqft",
      selector: (row) => row.aasra?.area_sqft || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Bank Address",
      selector: (row) => row.aasra?.bank_address || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Bank Name",
      selector: (row) => row.aasra?.bank_name || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Branch Name",
      selector: (row) => row.aasra?.branch_name || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },

    {
      name: "DD Bank",
      selector: (row) => row.aasra?.dd_bank || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "DD Number",
      selector: (row) => row.aasra?.dd_number || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },

    {
      name: "District",
      selector: (row) => row.aasra?.district || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Email",
      selector: (row) => row.aasra?.email || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
      wrap: true,
    },
    {
      name: "IFSC Code",
      selector: (row) => row.aasra?.ifsc_code || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },

    {
      name: "Market Survey No",
      selector: (row) => row.aasra?.market_survey_no || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Mobile No",
      selector: (row) => row.aasra?.mobile_no || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "PAN No",
      selector: (row) => row.aasra?.pan_no || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "PIN",
      selector: (row) => row.aasra?.pin || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Place",
      selector: (row) => row.aasra?.place || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Reg Certificate No",
      selector: (row) => row.aasra?.regCertificate_no || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },

    {
      name: "State",
      selector: (row) => row.aasra?.state || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Telephone No",
      selector: (row) => row.aasra?.telephone_no || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
    {
      name: "Unique Code",
      selector: (row) => row.aasra?.unique_code || "-",
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
  ];
  const userColumns = [
    {
      name: "Aasra Name",
      selector: (row) => row?.aasraName,
      sortable: true,
      hide: 370,
      wrap:true
    },
    {
      name: "Item Name",
      selector: (row) => `${row.part_number} - ${row.item_name}` || "",
      sortable: true,
      hide: 370,
      minWidth: "400px",
      wrap: true,
      cell: (row) => (
        <button
          style={{
            background: "none",
            border: "none",
            color: "#797be5",
            // textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => handleRowClick(row)}
        >
          {`${row?.part_number} - ${row.item_name}`}
        </button>
      ),
    },

    {
      name: "Unit Price",
      selector: (row) => `${RUPEES_SYMBOL} ${row.price}`,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },
    {
      name: "Stock In",
      selector: (row) => row.stock_in,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },
    {
      name: "Stock Out",
      selector: (row) => row.stock_out,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },

    {
      name: "Available Stock",
      selector: (row) => row.available_stock,
      sortable: true,
      hide: 370,
      minWidth: "190px",
    },
  ];
  const itemColumns = [
    {
      name: "Item Name",
      selector: (row) => `${row.item_name}`,
      sortable: true,
      hide: 370,
      minWidth: "400px",
      wrap: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },
    {
      name: "Stock In",
      selector: (row) => row.stock_in,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },
    {
      name: "Stock Out",
      selector: (row) => row.stock_out,
      sortable: true,
      hide: 370,
      minWidth: "120px",
    },
    {
      name: "Time",
      selector: (row) => row.createdAt,
      sortable: true,
      hide: 370,
      minWidth: "250px",
      wrap: true,
    },
    // {
    //   name: "Available Stock",
    //   selector: (row) => row.available_stock || "",
    //   sortable: true,
    //   hide: 370,
    //   minWidth: "190px",
    // },
  ];

  const itemNameDetails = () => { };

  const columns =
    userType === "S" || userType === "A" ? adminColumns : userColumns;

  const handleAasraChange = (selectedOption) => {
    setValue("aasra", selectedOption || "");
    trigger("aasra");
  };

  // useEffect(() => {
  //   const data = {};
  //   console.log(data,"ppp")
  //   fetchList(data);
  // }, []);


  const handleBackClick = () => {
    // Logic to handle the "Back" button
    // console.log("Back button clicked");
    // You can reset the columns or navigate to a previous page
    // setColumns(userColumns); // Example: Go back to userColumns
    setItemCol(false);
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Inventory Reports"
        parent=""
        title="Inventory Reports"
      />

      {/* {(userType == "S" || userType == "A") && 
      <Card>
        <CardBody>
          <Row>
            <Col sm="4">
              <Label className="from-label" htmlFor="aasra">
                Please select aasra to see inventory
              </Label>
              <div className="form-control-wrap">
                <Select
                  className=""
                  id="aasra"
                  options={aasraList}
                  {...register("aasra", {
                    required: "please select aasra",
                  })}
                  onChange={handleAasraChange}
                  value={watch("aasra")}
                />
                {errors.aasra && (
                  <span
                    className="invalid"
                    style={{
                      color: "#e85347",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    {errors.aasra.message}
                  </span>
                )}
              </div>
            </Col>
          </Row>{" "}
        </CardBody>
      </Card>} */}

      <Col sm="12">
        {itemCol ? (
          <>
            <MyDataTable
              export
              SearchCall
              // serachButton
              aasraType
              spareType
              // dateFilter
              onFormSubmit={fetchList}
              search="search by item name/item id"
              name={"Inventory Reports"}
              fileName={"Inventory Reports"}
              title="Inventory Reports List"
              data={itemData}
              isLoading={isLoading}
              back={handleBackClick}
              columns={itemColumns}
            />
          </>
        ) : (
          <MyDataTable
            export
            SearchCall
            // serachButton
            aasraType
            spareType
            // dateFilter
            onFormSubmit={fetchList}
            search="search by item name/item id"
            name={"Inventory Reports"}
            fileName={"Items Reports"}
            title="Inventory Reports List"
            data={tableData}
            isLoading={isLoading}
            columns={userColumns}
          />
        )}
      </Col>
    </>
  );
};

export default InventoryReports;
