import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { createUserAPI, getUserListAPI, updateStatus } from "../../api/user";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";
import Select from "react-select";
import { userTypeAPI } from "../../api/dropdowns";
import ToolTip from "../../CommonElements/ToolTips/ToolTip";
import Required from "../../Components/MyComponents/Required";
import UserDetailUpdate from "../../Components/MyComponents/Modal/UserDetailUpdate";
import MobileUpdate from "../../Components/MyComponents/Modal/MobileUpdate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Master = () => {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCustomer, setisOpenCustomer] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState();
  const [rowData, setRowData] = useState();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("accessToken");
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm();
  const fetchUsers = async () => {
    setIsLoading(true); // Set loading to true when fetching users
    try {
      const response = await getUserListAPI(); // Fetch users from API
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setUsers(response.data.data); // Set fetched users to state
      } else if (response.data.status === "failed") {
        toast.error(response.data.message);
      } else if (response.data.status === "expired") {
        logout(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false); // Always set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    reset();
  };

  const handleEdit = (row) => {
    console.log(user, "userrr");
    console.log(row, "roww");

    window.scroll(0, 0);
    setIsOpen(true);
    setIsEditing(true);
    setEditUserId(row.id);
    setValue("name", row.name);
    setValue("email", row.email);
    setValue("password", row.password);
    setValue("user_type", row.userTypeName);
    setValue("user_type", { label: row.userTypeName, value: row.userTypeName });
    setValue("mobile", row.mobile);
    setValue("status", row.status);
    // Assuming row.user_type_id has a value, e.g., 'AC'
    const userType = row?.user_type_id; // Get the value from the selected option

    // Find the matching user object
    const selectedUser = user.find((u) => u.user_type === userType);

    setValue("user_type", {
      label: selectedUser.label,
      value: selectedUser.value,
    });
  };
  const handleUpdate = (row) => {
    if (row?.user_type_id === "AC") {
      setUserDetailModalOpen(true); // Open the UserDetailUpdate modal
      setUserId(row?.id);
      setRowData(row);
    } else if (row?.user_type_id === "C") {
      setisOpenCustomer(true); // Open the CustomerDetailUpdate modal
      setUserId(row?.id);
      setRowData(row);
    }
    if (row?.user_type_id === "A" || row?.user_type_id === "S") {
      window.scroll(0, 0);
      setIsOpen(true);
      setIsEditing(true);
      setEditUserId(row.id);
      setValue("name", row.name);
      setValue("email", row.email);
      setValue("password", row.password);
      setValue("user_type", row.userTypeName);
      setValue("mobile", row.mobile);
      setValue("status", row.status);
    }
  };

  const onFormSubmit = async (formData) => {
    // return false
    try {
      if (isEditing) {
        setIsEditing(false);
        setEditUserId(null);
        reset();
        setIsOpen(false);
        setIsLoading(false); // Set loading to false after editing
      } else {
        const data = {
          user_type: formData.user_type.user_type,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          status: formData.status,
          name: formData.name,
        };
        // console.log(data);

        const response = await createUserAPI(data, tokenHeader);
        if (response.data.status === "success") {
          setIsOpen(false);
          await fetchUsers(); // Fetch latest users after creation
          reset();
          toast.success(response.data.message);
        } else if (response.data.status == "failed") {
          toast.error(response.data.message);
        } else if (response.data.status == "expired") {
          logout(response.data.message);
        }
      }
    } catch (err) {
      setIsLoading(false); // Ensure loading is stopped on error
      console.log(err.message);
    }
  };

  const handlePermissions = (row) => {
    navigate(`${process.env.PUBLIC_URL}/user/permission`, {
      state: { user: row },
    });
  };

  // Opens the modal and sets the selected user ID
  const handleDelete = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const toggleStatus = async () => {
    try {
      const data = {
        id: selectedUserId,
      };
      const response = await updateStatus(data);
      if (response.data.status === "success") {
        setIsModalOpen(false);
        await fetchUsers();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    } finally {
      setIsModalOpen(false);
    }
  };

  // Closes the modal without changing status
  const cancelUpdate = () => {
    setIsModalOpen(false);
  };
  // Closes the modal without changing status
  const handleClose = () => {
    setUserDetailModalOpen(false);
    setisOpenCustomer(false);
  };

  const columns = [
    {
      name: "User Type",
      selector: (row) => (
        <div>
          <span>
            {row.user_type_id == "C" ? "Customer" : null}
            {row.user_type_id == "S" ? "Super Admin" : null}
            {row.user_type_id == "AC" ? "Aasra Center" : null}
            {row.user_type_id == "A" ? "Admin" : null}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Name",
      width: "250px",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
      width: "250px",
    },
    { name: "Password", selector: (row) => row.password, sortable: true },
    { name: "Username", selector: (row) => row.unique_code, sortable: true },
    { name: "Mobile", selector: (row) => row.mobile, sortable: true }, // New column for mobile
    {
      name: "Status",
      selector: (row) => (
        <span
          className={
            row.status === true
              ? "badge badge-light-success"
              : "badge badge-light-danger"
          }
        >
          {row.status === true ? "Active" : "InActive"}
        </span>
      ),

      sortable: true,
    },
    ...(userDetail?.user_type === "S"
      ? [
          {
            name: "Actions",
            cell: (row) => (
              <div>
                {row?.user_type_id === "S" ? null : (
                  <>
                    <Button
                      id={"edit-" + row.id}
                      outline
                      color={`warning`}
                      size={`xs`}
                      className={`me-1`}
                      onClick={() => handleEdit(row)}
                      disabled={row.user_type_id === "S" || "AC" || "C"}
                    >
                      {" "}
                      <i className="fa fa-edit"></i>
                    </Button>
                    <ToolTip
                      id={"edit-" + row.id}
                      name={"Edit User"}
                      option={"top"}
                    />
                    {row?.user_type_id == "AC" || row?.user_type_id == "C" ? (
                      <>
                        <Button
                          id={"update-" + row.id}
                          outline
                          color={`primary`}
                          size={`xs`}
                          className={`me-1`}
                          onClick={() => handleUpdate(row)}
                          disabled={row.user_type_id === "S"}
                        >
                          <i className="fa fa-key"></i>
                        </Button>
                        <ToolTip
                          id={"update-" + row.id}
                          name={"Update"}
                          option={"top"}
                        />
                      </>
                    ) : null}
                  </>
                )}
                <Button
                  id={"status-" + row.id}
                  outline
                  color={`danger`}
                  size={`xs`}
                  className={`me-1`}
                  disabled={row?.user_type_id == "S"}
                  onClick={() => handleDelete(row.id)}
                >
                  {" "}
                  <i className="fa fa-ban"></i>
                </Button>
                <ToolTip
                  id={"status-" + row.id}
                  name={"Enable/Disable"}
                  option={"top"}
                />
                {!row?.status ||
                row?.user_type_id == "AC" ||
                row?.user_type_id == "S" ||
                row?.user_type_id == "C" ? null : (
                  <>
                    <Button
                      id={"permissions-" + row.id}
                      outline
                      color={`primary`}
                      size={`xs`}
                      onClick={() => handlePermissions(row)}
                    >
                      {" "}
                      <i className="fa fa-lock"></i>
                    </Button>
                    <ToolTip
                      id={"permissions-" + row.id}
                      name={"Set Permission"}
                      option={"top"}
                    />
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  useEffect(() => {
    getUserType();
  }, []);

  const getUserType = () => {
    userTypeAPI({}, tokenHeader)
      .then((res) => {
        if (res.data.status == "success") {
          const a = res?.data?.data?.data.map((item) => ({
            value: item.user_type,
            label: item.label,
            id: item.id,
            user_type: item.user_type,
          }));
          setUser(a);
        } else if (res.data.status == "failed") {
          toast.error(res.data.message);
        } else if (res.data.status == "expired") {
          logout(res.data.message);
        }
      })
      .catch((err) => {
        console.log("catch", err);
      });
  };
  const handleUserChange = (selectedOption) => {
    setValue("user_type", selectedOption);
    trigger("user_type");
    console.log(selectedOption);
  };

  return (
    <>
      <Breadcrumbs mainTitle="User" parent="User" title="Add User" />
      <Container fluid={true}>
        {userDetail?.user_type == "S" ? (
          <Row>
            <Col
              className="mb-2"
              sm="12"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div>
                <Button color="primary" onClick={handleOpen}>
                  {isOpen ? (
                    <i className="fa fa-minus" />
                  ) : (
                    <i className="fa fa-plus" />
                  )}
                </Button>
              </div>
            </Col>
            {isOpen && (
              <Col sm="12">
                <Form className="" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col sm="12">
                    <Card>
                      <CardHeader>
                        <h5>Add User</h5>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col md={4}>
                            <div className="form-group">
                              <Label className="from-label" htmlFor="user_Type">
                                Usertype <Required />
                              </Label>
                              <Select
                                className="select"
                                type="select"
                                id="user_Type"
                                options={user}
                                {...register("user_type", {
                                  required: "Please select user type",
                                })}
                                onChange={handleUserChange}
                                value={watch("user_type")}
                              />
                              {errors.user_type && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors?.user_type?.message}
                                </span>
                              )}
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="form-group">
                              <Label className="from-label" htmlFor="name">
                                Username
                                <Required />
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  placeholder="Enter Username"
                                  type="text"
                                  id="name"
                                  {...register("name", {
                                    required: "name is required",
                                    pattern: {
                                      value: /^[a-zA-Z ]*$/,
                                      message: "Only alphabets are allowed.",
                                    },
                                  })}
                                  className="form-control"
                                  value={watch("name")}
                                  onChange={(e) => {
                                    setValue("name", e.target.value);
                                    trigger("name");
                                  }}
                                />
                                {errors.name && (
                                  <span
                                    className="invalid"
                                    style={{
                                      color: "#e85347",
                                      fontSize: "11px",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {errors?.name?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="form-group">
                              <Label className="from-label" htmlFor="email">
                                Email <Required />
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  placeholder="Enter Email"
                                  type="text"
                                  id="email"
                                  {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                                      message: "Invalid email address",
                                    },
                                  })}
                                  className="form-control"
                                  value={watch("email")}
                                  onChange={(e) => {
                                    setValue("email", e.target.value);
                                    trigger("email");
                                  }}
                                />
                                {errors.email && (
                                  <span
                                    className="invalid"
                                    style={{
                                      color: "#e85347",
                                      fontSize: "11px",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {errors?.email?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="form-group">
                              <Label className="from-label" htmlFor="password">
                                Password <Required />
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  placeholder="Enter Password"
                                  type="text"
                                  id="password"
                                  {...register("password", {
                                    required: "password is required",
                                    //   },
                                    minLength: {
                                      value: 6,
                                      message:
                                        "Password must be at least 6 characters long.",
                                    },
                                    maxLength: {
                                      value: 20,
                                      message:
                                        "Password cannot exceed 20 characters.",
                                    },
                                  })}
                                  className="form-control"
                                  value={watch("password")}
                                  onChange={(e) => {
                                    setValue("password", e.target.value);
                                    trigger("password");
                                  }}
                                />
                                {errors.password && (
                                  <span
                                    className="invalid"
                                    style={{
                                      color: "#e85347",
                                      fontSize: "11px",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {errors?.password?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="form-group">
                              <Label className="from-label" htmlFor="mobile">
                                Mobile Number <Required />
                              </Label>
                              <div className="form-control-wrap">
                                <input
                                  placeholder="Enter Your Mobile Number"
                                  type="text"
                                  id="mobile"
                                  {...register("mobile", {
                                    required: "Mobile Number is required",
                                    pattern: {
                                      value: /^[6789]\d{9}$/,
                                      message: "Invalid mobile number.",
                                    },
                                  })}
                                  className="form-control"
                                  value={watch("mobile")}
                                  onChange={(e) => {
                                    setValue("mobile", e.target.value);
                                    trigger("mobile");
                                  }}
                                />
                                {errors.mobile && (
                                  <span
                                    className="invalid"
                                    style={{
                                      color: "#e85347",
                                      fontSize: "11px",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {errors?.mobile?.message}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="form-group">
                              <Label className="from-label" htmlFor="status">
                                Status <Required />
                              </Label>
                              <Input
                                className=""
                                id="status"
                                type="select"
                                {...register("status", {
                                  required: "Please Select status",
                                })}
                                onChange={(e) => {
                                  setValue("status", e.target.value);
                                  trigger("status");
                                }}
                                value={watch("status")}
                              >
                                <option value="">Select Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </Input>
                              {errors.status && (
                                <span
                                  className="invalid"
                                  style={{
                                    color: "#e85347",
                                    fontSize: "11px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {errors.status.message}
                                </span>
                              )}
                            </div>
                          </Col>

                          <Row>
                            <Col md="2" className={`mt-3`}>
                              <div
                                className="form-group"
                                style={{ verticalAlign: "bottom" }}
                              >
                                <Button
                                  color="primary"
                                  size="md"
                                  type="submit"
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <Spinner size="sm" color="light" />
                                  ) : (
                                    "Submit"
                                  )}
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Form>
              </Col>
            )}
          </Row>
        ) : null}

        <MyDataTable
          search="search by name / mobile number / email"
          export
          name="Users"
          title="Users-List"
          isLoading={isLoading}
          columns={columns}
          data={users}
        />
      </Container>
      <Modal isOpen={isModalOpen} toggle={cancelUpdate}>
        <ModalHeader toggle={cancelUpdate}>Confirm Status Change</ModalHeader>
        <ModalBody>
          Are you sure you want to change the status of this user?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleStatus}>
            Yes
          </Button>{" "}
          <Button color="secondary" onClick={cancelUpdate}>
            No
          </Button>
        </ModalFooter>
      </Modal>
      <UserDetailUpdate
        isOpen={userDetailModalOpen}
        handleClose={handleClose}
        isUploading={false}
        id={userId}
        fetchUsers={fetchUsers}
        rowData={rowData}
      />{" "}
      <MobileUpdate
        isOpenCustomer={isOpenCustomer}
        handleClose={handleClose}
        isUploading={false}
        id={userId}
        fetchUsers={fetchUsers}
        rowData={rowData}
      />{" "}
    </>
  );
};

export default Master;
