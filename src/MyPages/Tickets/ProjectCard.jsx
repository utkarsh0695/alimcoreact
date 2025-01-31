import React from "react";
import { Col, Row, Progress } from "reactstrap";
import { H6, Image, LI, P, UL } from "../../AbstractElements";
import { Comment, Done, Issues, Resolved } from "../../Constant";
import { Link } from "react-router-dom";
// import im from "../../assets"

const ProjectCard = ({ item }) => {
  return (
    <Col className="col-xxl-3" md="6">
      <div className="project-box">
        <span
          className={`badge ${
            item.status == "Pending"
              ? "badge-warning"
              : item.status == "Done"
              ? "badge-success"
              : "badge-primary"
          }`}
        >
          {item.status}
        </span>
        <Link style={{ marginBottom: "150px " }} to="/ticket-detail" state={{ticket:item}}>
          {" "}
          <h6 className="mb-0">
            {"Ticket Id : "}
            {item.ticket_id}
          </h6>
        </Link>
        <div className="media">
          <div className="media-body">
            <P className="me-2">{item.product_name}</P>
          </div>
        </div>
        <P>{item.description}</P>
        <Row className="details">
          <Col xs="6">
            <span>{`Customer Name`} </span>
          </Col>
          <Col
            xs="6"
            className={item.badge === "Done" ? "font-success" : "font-primary"}
          >
            {item.customer_name}
          </Col>
          <Col xs="6">
            {" "}
            <span>{`Status`}</span>
          </Col>
          <Col
            xs="6"
            className={item.status == "Done" ? "font-success"  : item.status=="Pending"? "font-warning": "font-primary"}
          >
            {item.status}
          </Col>
          <Col xs="6">
            {" "}
            <span>{`Date `}</span>
          </Col>
          <Col
            xs="6"
            className={item.status == "Done" ? "font-success"  : item.status=="Pending"? "font-warning": "font-primary"}
          >
            {item.appointment_date}
          </Col>
          {/* <Col xs='6'>
            {' '}
            <span>{`Warranty`}</span>
          </Col>
          <Col xs='6' className={item.badge === 'Done' ? 'font-success' : 'font-primary'}>
            {item.comment}
          </Col> */}
        </Row>
        <hr />
        <div className="project-status mt-4">
          <div className="media mb-0">
            <P>{item.percentage}% </P>
            <div className="media-body text-end">
              <span className={item.status == "Done" ? "font-success"  : item.status=="Pending"? "font-warning": "font-primary"}>{item.status}</span>
            </div>
          </div>
          {item.percentage == "100" ? (
            <Progress
              className="sm-progress-bar"
              color="success"
              value={item.percentage}
              style={{ height: "5px" }}
            />
          ):null}
          { item.percentage=="10"? (
            <Progress
              className="sm-progress-bar"
              striped
              color="warning"
              value={item.percentage}
              style={{ height: "5px" }}
            />
          ):null}
            { item.percentage=="50"? (
            <Progress
              className="sm-progress-bar"
              striped
              color="primary"
              value={item.percentage}
              style={{ height: "5px" }}
            />
          ):null}
        </div>
      </div>
    </Col>
  );
};

export default ProjectCard;
