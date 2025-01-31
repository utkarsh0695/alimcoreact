import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Row
} from "reactstrap";
import { Breadcrumbs, Btn, Image, LI, UL } from "../../AbstractElements";
import { Date } from "../../Constant";
import { chatMessageListAPI, createNewChatAPI } from "../../api/ticket";
import ticketImg from "../../assets/svg/tickets.svg";
import { LuRefreshCcw } from "react-icons/lu";
import { BsTicketPerforated } from "react-icons/bs";
import { playNotificationSound } from "../../util/myFunction";
const Chat = () => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const userToken = localStorage.getItem("accessToken");
  const tokenHeader = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + `${userToken}`,
    },
  };
  const [ticketData, setTicketData] = useState([
    { id: 1, ticket_id: 12564285, status: "Done" },
    { id: 2, ticket_id: 1256285, status: "Pending" },
    { id: 4, ticket_id: 1264285, status: "Open" },
  ]);
  const [selectedChat, setSelectedChat] = useState([
    // { id: 1, sender: "admin", time: Date, message: "some message1" },
    // { id: 2, sender: "self", time: Date, message: "some response message1" },
    // { id: 1, sender: "admin", time: Date, message: "some message1" },
    // { id: 2, sender: "self", time: Date, message: "some response message2" },
    // { id: 1, sender: "admin", time: Date, message: "some message2" },
    // { id: 2, sender: "self", time: Date, message: "some response message3" },
    // { id: 2, sender: "self", time: Date, message: "some response message4" },
  ]);
  const changeChatClick = (e, item) => {
    // console.log("chat ticket clicked", e, item);
  };
  const abortControllerRef = useRef(null);

  // useEffect(() => {
  //   return () => {
  //     if (abortControllerRef.current) {
  //       abortControllerRef.current.abort();
  //     }
  //   };
  // }, []);

  const handleMessageChange = (message) => {
    setMessageInput(message);
  };
  useEffect(() => {
    getMessageList();
  }, [])

  // setInterval(function () {
  //   getMessageList();
  // }, 60000);


  let abortController;
  useEffect(() => {
    const intervalId = setInterval(() => {
      getMessageList();
    }, 60000);
    // Cleanup function to clear the interval and abort any ongoing request
    return () => {
      clearInterval(intervalId);
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const getMessageList = () => {
    // Abort any previous request if it exists
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController instance for the current request
    abortController = new AbortController();
    const { signal } = abortController;
    chatMessageListAPI({
      "ticket_id": location?.state?.state?.ticket_id
    }, tokenHeader, { signal }
    )
      .then((res) => {
        if (res.data.status == "success") {
          // toast.success(res.data.message)
          // console.log("res", res.data.data)
          setSelectedChat(res.data.data.ticketData)
          // playNotificationSound()
        } else {
          toast.error(res.data.message)
        }
      }).catch((err) => {
        console.log("err", err)
      })

  }


  const handleMessagePress = (e) => {
    if (e.key === 'Enter' || e === 'send') {

      var container = document.querySelector('.chat-history');
      setTimeout(function () {
        container.scrollBy({ top: 200, behavior: 'smooth' });
      }, 310);

      // let currentUserId = currentUserr.id;
      // let selectedUserId = selectedUserr.id;
      // let selectedUserName = selectedUserr.name;

      if (messageInput.length > 0) {
        setSelectedChat([...selectedChat, { id: 2, sender: "self", time: Date, message: messageInput },])
        const data = {
          message: messageInput,
          ticket_id: location?.state?.state?.ticket_id
        }
        createNewChatAPI(data, tokenHeader).then((res) => {
          if (res.data.status == "success") {
            // toast.success(res.data.message)
            getMessageList()
            setMessageInput('');
            // setSelectedChat(res.data.data.ticketData)
          } else {
            toast.error(res.data.message)
          }
        }).catch((err) => {
          console.log("err", err)
        })

        // sendMessageAsyn(currentUserId, selectedUserId, messageInput, chatss);

        // setTimeout(() => {
        //     const replyMessage =
        //         'Hey This is ' +
        //         selectedUserName +
        //         ', Sorry I busy right now, I will text you later';
        //     if (selectedUserr.online === true)
        //         document.querySelector('.status-circle').classList.add('online');
        //     selectedUserr.online = true;
        //     replyByUserAsyn(currentUserId, selectedUserId, replyMessage, chatss);
        // }, 5000);
      }
    }
  };
  const handleRefresh = () => {
    getMessageList()
  }
  return (
    <>
      <Breadcrumbs mainTitle="Chat" parent="" title="Chat" />
      <div className="container-fluid">
        <Row>
          {/* <Col className="call-chat-sidebar">
            <Card>
              <CardBody className="chat-body">
                <div className="chat-box">
                  <div className="chat-left-aside">
                    <div className="media">
                    <Image
                          attrImage={{
                            className: "rounded-circle user-image",
                            src: ticketImg,
                            alt: "",
                          }}
                        />
                      <div className="about">
                        <Link to={`${process.env.PUBLIC_URL}/ticket-detail`}>
                          <div className="name f-w-600">{"ticket no"}</div>
                        </Link>
                        <div className="status">{"ticket"}</div>
                      </div>
                    </div>
                    <div className="people-list" id="people-list">
                      <div className="search">
                        <Form className="theme-form">
                          <FormGroup className="form-group">
                            <Input
                              className="form-control"
                              type="text"
                              placeholder="search"
                            />
                            <i className="fa fa-search"></i>
                          </FormGroup>
                        </Form>
                      </div>
                      {ticketData && ticketData?.length > 0 ? (
                        <>
                          <UL
                            attrUL={{
                              className: "simple-list list custom-scrollbar",
                            }}
                          >
                            {ticketData?.map((item, index) => (
                              <LI
                                attrLI={{
                                  style: { backgroundColor: "transparent" },
                                  className: `clearfix border-0 `,
                                  onClick: (e) => changeChatClick(e, item.id),
                                }}
                                key={item.id}
                              >
                                <Image
                                  attrImage={{
                                    className: "rounded-circle user-image",
                                    src: ticketImg,
                                    alt: "",
                                  }}
                                />
                                <div className="about">
                                  <div className="name">{item.ticket_id}</div>
                                  <div className="status">{item.status}</div>
                                </div>
                              </LI>
                            ))}
                          </UL>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col> */}
          <Col className="call-chat-body">
            <Card>
              <CardBody className="p-0">
                <Row className="chat-box">
                  <Col className="pe-0 chat-right-aside">
                    <div className="chat">
                      <div
                        className="chat-header  clearfix p-3"
                        style={{ justifyContent: "left!important" }}
                      >
                        <span className="ticketIcon">

                          <BsTicketPerforated fontSize={"25px"} style={{marginTop:"10px",color:"#fbbc04"}} />
                        </span>
                        {/* <Image
                          attrImage={{
                            className: "rounded-circle",
                            src: ticketImg,
                            alt: "",
                          }}
                        /> */}
                        <div className="media-body">
                          <div className="about">
                            <div className="name">{location?.state?.state?.product_name}</div>
                            <div className="status digits">
                              {location?.state?.state?.appointment_date}
                            </div>
                          </div>
                        </div>
                        <div className="refresh">
                          <Button
                            outline
                            color="success"
                            type="button"
                            onClick={() => handleRefresh()}
                            size="xs"
                          >
                            <LuRefreshCcw style={{ height: '1rem', width: '1rem', paddingTop: "5px" }} size={'sm'} />

                          </Button>
                        </div>
                      </div>
                      <div className="chat-history  chat-msg-box custom-scrollbar">
                        <UL attrUL={{ className: "simple-list" }}>
                          {selectedChat && selectedChat.length > 0 ? (
                            <>
                              {selectedChat.map((item, index) => (
                                <>
                                  <LI
                                    attrLI={{ className: "clearfix border-0" }}
                                    key={index}
                                  >
                                    <div
                                      className={`message  ${item.sender != "self"
                                        ? "my-message "
                                        : "other-message pull-right bg-primary text-white"
                                        }`}
                                    >
                                      <div className="message-data text-end">
                                        <span
                                          className={`message-data-time  ${item.sender != "self"
                                            ? " "
                                            : "text-white"
                                            }`}
                                        >
                                          {item.time}
                                        </span>
                                      </div>
                                      {item.message}
                                    </div>
                                  </LI>
                                </>
                              ))}
                            </>
                          ) : (
                            ""
                          )}
                        </UL>
                      </div>
                      <div className="chat-message clearfix">
                        <Row>
                          <Col xl="12" className="d-flex">
                            <InputGroup className="text-box">
                              <Input
                                type="text"
                                className="form-control input-txt-bx"
                                placeholder="Type a message......"
                                value={messageInput}
                                onKeyPress={(e) => handleMessagePress(e)}
                                onChange={(e) =>
                                  handleMessageChange(e.target.value)
                                }
                              />
                              <Btn
                                attrBtn={{
                                  color: "primary",
                                  onClick: () => handleMessagePress("send"),
                                }}
                              >
                                Send
                              </Btn>
                            </InputGroup>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Chat;
