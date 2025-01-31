import React, { useEffect, useState } from "react";
import { FaEdit, FaLock, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  Row,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import { createUserAPI, getUserListAPI } from "../../api/user";
import MyDataTable from "../../Components/MyComponents/MyDataTable";
import useLogout from "../../util/useLogout";

const UserMaster = () => {
  const [user_type, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(""); // New state for mobile
  const [status, setStatus] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useLogout();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedUsers = JSON.parse(localStorage.getItem('users'));
  //   if (storedUsers) {
  //     setUsers(storedUsers);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('users', JSON.stringify(users));
  // }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await getUserListAPI(); // Fetch users from API
      if (response.data.status === "success") {
        setIsLoading(false);
        setUsers(response.data.data); // Set fetched users to state
      } else if (response.data.status == "failed") {
        toast.error(response.data.message);
      } else if (response.data.status == "expired") {
        logout(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
      mobile,
      user_type,
      name,
      status,
    };

    try {
      if (isEditing) {
        setUsers(
          users.map((user) =>
            user.id === editUserId ? { ...user, ...formData } : user
          )
        );
        setIsEditing(false);
        setEditUserId(null);
      } else {

        // const existingUser = users.find(user => user.email === email || user.mobile === mobile);
        // if (existingUser) {
        //   console.error('User with the same email or mobile already exists.');
        //   return;
        // }

        const response = await createUserAPI(formData);
        if (response.data.status === "success") {
          setUsers((prevUsers) => [
            ...prevUsers,
            { ...formData, id: response.data.data.id },
          ]);
          fetchUsers();
        } else if (response.data.status == "failed") {
          toast.error(response.data.message);
        } else if (response.data.status == "expired") {
          logout(response.data.message);
        }
        
      }
      clearForm();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const clearForm = () => {
    setUserType("");
    setName("");
    setEmail("");
    setPassword("");
    setMobile("");
    setStatus("");
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEdit = (row) => {
    setUserType(row.user_type);
    setName(row.name);
    setEmail(row.email);
    setPassword(row.password); // Usually, you don't display the password for editing
    setMobile(row.mobile);
    setStatus(row.status);
    setIsEditing(true);
    setEditUserId(row.id);
    setIsFormVisible(true);
  };

  const columns = [
    { name: "User Type", selector: (row) => <div>
      <span>{
        
        row.userTypeName=='C'?"Customer":null}
        {row.userTypeName=='S'?"Super Admin":null}
        {row.userTypeName=='AC'?"Aasra Center":null}
       { row.userTypeName=='A'?"Admin":null}</span>
    </div>, sortable: true },
    { name: "Username", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Password", selector: (row) => row.password, sortable: true },
    { name: "Mobile", selector: (row) => row.mobile, sortable: true }, // New column for mobile
    {
      name: "Status",
      selector: (row) => (row.status === true ? "Active" : "Inactive"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button color="link" onClick={() => handleEdit(row)}>
            <FaEdit size={16} />
          </Button>
          <Button color="link" onClick={() => handleDelete(row.id)}>
            <FaTrash size={16} />
          </Button>
          <Button color="link" onClick={() => handlePermissions(row)}>
            <FaLock size={16} />
          </Button>
        </>
      ),
    },
  ];

  // const filterData = users.filter((userObj) =>
  //   userObj.userTypeName.toLowerCase().includes(text.toLowerCase()) ||
  //   userObj.name.toLowerCase().includes(text.toLowerCase()) ||
  //   userObj.email.toLowerCase().includes(text.toLowerCase()) ||
  //   userObj.mobile.toLowerCase().includes(text.toLowerCase()) // Filter for mobile
  // );

  const handlePermissions = (row) => {
    navigate(`${process.env.PUBLIC_URL}/user/permission`, {
      state: { user: row },
    });
    // navigate({
    //   pathname: `${process.env.PUBLIC_URL}/user/permissions`,
    //   state: { user: row },
    // });
  };

  return (
    <>
      <Breadcrumbs mainTitle="User master" parent="Pages" title="User master" />
      <Container fluid={true}>
        <Row>
          <Col
            className="mb-2"
            sm="12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div>
              <Button color="primary" onClick={toggleForm}>
                {isFormVisible ? (
                  <i className="fa fa-minus" />
                ) : (
                  <i className="fa fa-plus" />
                )}
              </Button>
            </div>
          </Col>

          {isFormVisible && (
            <Col sm="12">
              <Form onSubmit={handleSubmit}>
                <Col sm="12">
                  <Card>
                    <CardHeader>
                      <h5>{"Create User"}</h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <div className="col-md-4">
                          <Label className="form-label" htmlFor="userType">
                            User Type
                          </Label>
                          <Input
                            className="form-control"
                            type="select"
                            id="user_Type"
                            value={user_type}
                            onChange={(e) => setUserType(e.target.value)}
                          >
                            <option value="">Select User Type</option>
                            <option value="A">Admin</option>
                          </Input>
                        </div>
                        <div className="col-md-4">
                          <Label className="form-label" htmlFor="username">
                            Username
                          </Label>
                          <Input
                            className="form-control"
                            type="text"
                            id="name"
                            placeholder="Enter username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <Label className="form-label" htmlFor="email">
                            Email
                          </Label>
                          <Input
                            className="form-control"
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <Label className="form-label" htmlFor="password">
                            Password
                          </Label>
                          <Input
                            className="form-control"
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <Label className="form-label" htmlFor="mobile">
                            Mobile
                          </Label>
                          <Input
                            className="form-control"
                            type="text"
                            id="mobile"
                            placeholder="Enter mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <Label className="form-label" htmlFor="status">
                            Status
                          </Label>
                          <Input
                            className="form-control"
                            type="select"
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </Input>
                        </div>
                        <div className="col-12">
                          <Button type="submit" color="primary">
                            Submit
                          </Button>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Form>
            </Col>
          )}
        </Row>
        <MyDataTable
          export
          search="Search By Name / Mobile Number"
          name="User"
          title="User List"
          columns={columns}
          isLoading={isLoading}
          data={users}
        />
      </Container>
    </>
  );
};
export default UserMaster;
