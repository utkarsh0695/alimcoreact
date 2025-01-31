import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { paymentList } from "../../api/user";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";
import { Breadcrumbs } from "../../AbstractElements";
import { RUPEES_SYMBOL } from "../../Constant";
import { Col, Row } from "reactstrap";



const PaymentList = () => {
  const logout = useLogout();
  const [data, setData] = useState([]);
  const userToken = localStorage.getItem("accessToken");
  const fetchList = async () => {
    const response = await paymentList()
    if (response.data.status == 'success') {
      setData(response.data.data)
    } else if (response.data.status == "failed") {
      toast.error(response.data.message);
      setData([])
    } else if (response.data.status == "expired") {
      logout(response.data.message);
    }

  }
  // useEffect(() => {
  //   fetchList()
  // }, [])

  const columns = [
    {
      name: "Aasra Name",
      selector: (row) => row.aasraName,
      sortable: true,
      width: "150px",
      wrap:true
    },
    {
      name: "Aasra Code",
      selector: (row) => row.uniqueCode,
      sortable: true,
      width: "150px",
      wrap:true
    },
    {
      name: 'Ticket ID',
      selector: (row) => row.ticket_id,
      sortable: true,
      // width: "200px",
    },
    {
      name: 'Receipt No',
      selector: (row) => row.receipt_no,
      sortable: true,
      // width: "200px",
    },
    {
      name: 'Payment Mode',
      selector: (row) => row.payment_mode,
      sortable: true,
      // width: "200px",
    },
    {
      name: 'Service Charge',
      selector: (row) => row.serviceCharge,
      sortable: true,
      // width: "200px",
    },
    {
      name: 'Discount',
      selector: (row) => row.discount,
      sortable: true,
      // width: "200px",
    },
    // {
    //   name: 'Order Date',
    //   selector: (row) => new Date(row.order_date).toLocaleDateString(),
    //   sortable: true,
    //   // width: "200px",
    // },
    {
      name: 'Total Amount',
      selector: (row) => `${row.total_amount}`,
      sortable: true,
      // width: "200px",
    },

    // {
    //   name: 'Order Status',
    //   selector: (row) => (
    //     <span
    //       className={
    //         row.order_status === "Close" ||  row.order_status === "Received" 
    //           ? "badge badge-light-success"
    //           : row.order_status === "Pending"

    //             ? "badge badge-light-warning"
    //             : "badge badge-light-primary"
    //       }
    //     >
    //       {row.order_status ?? "-"}
    //     </span>
    //   ),
    //   sortable: true,
    //   // width: "200px",
    // },
    // {
    //   name: 'Order Dispatch Status',
    //   selector: (row) => row.order_status,
    //   sortable: true,
    //   // width: "200px",
    // },
    // {
    //   name: 'Paid Amount',
    //   selector: (row) => row.paid_amount,
    //   sortable: true,
    //   width: "200px",
    // },
    // {
    //   name: 'Payment Date',
    //   selector: (row) => new Date(row.payment_date).toLocaleDateString(),
    //   sortable: true,
    //   width: "200px",
    // },



  ];
  const onFormSubmit = (data) => {
    const token = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + `${userToken}`,
      },
    };
    const searchData = {
      aasra_id: data.aasraId?.value || null,
      startDate: data.startDate ? new Date(new Date(data.startDate).setDate(new Date(data.startDate).getDate() + 1)).toISOString() : null,
      endDate: data.endDate ? new Date(new Date(data.endDate).setDate(new Date(data.endDate).getDate())).toISOString() : null
    };
    paymentList(searchData, token)
      .then((res) => {
        if (res.data.status === "success") {
          setData(res?.data?.data);
          toast.success(res.data.message);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
          setData([])
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  }


  return (

    <>
      <Breadcrumbs
        mainTitle=" Aasra Payment Reports"
        parent=""
        title=" Aasra Payment Reports"
      />
      <Row>
        <Col sm="12">
          <MyDataTable
            export
            SearchCall
            aasraType
            dateFilter
            onFormSubmit={onFormSubmit}
            search="search by ticket id/receipt no"
            name='Transaction'
            fileName='Aasra Payment Reports List'
            title='Aasra Payment Reports List'
            columns={columns}
            data={data}
          />
        </Col>
      </Row>
    </>
  )
}

export default PaymentList;