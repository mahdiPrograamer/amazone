import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import LoadingBox from "../components/loadingBox/loadingBox";
import MessageBox from "../components/massageBox/massageBox";
import { Card, Col, Row } from "react-bootstrap";
import { summaryDataHandler } from "../stateManagment/reducer/thirdReducer";

export const Dashbord = (props) => {
  const { users, orders, dailyOrder, categories, isLoading, err, userData } =
    props;

  useEffect(() => {
    props.summaryDataHandler(userData.token);
  }, []);

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  console.log(dailyOrder);
  return (
    <div>
      <h1>Dashboard</h1>
      {isLoading ? (
        <LoadingBox />
      ) : err ? (
        <MessageBox variant="danger">{err}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {users && users[0] ? users[0].numUsers : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {orders && users[0] ? orders[0].numOrders : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    ${orders && users[0] ? orders[0].totalSales.toFixed(2) : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <h2 className="h2-custom">Sales</h2>
            <div className="area-chart">
              {dailyOrder.length === 0 ? (
                <MessageBox>No Sale</MessageBox>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={400}
                    data={dailyOrder}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Row>
          <Row>
            <h2 className="h2-custom">Categories</h2>
            <div className="area-chart">
              {categories.length === 0 ? (
                <MessageBox>No Category</MessageBox>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={400}>
                    <Pie
                      dataKey="count"
                      nameKey="_id"
                      isAnimationActive={false}
                      data={categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    />

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Row>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.summarySlice.users,
    orders: state.summarySlice.orders,
    dailyOrder: state.summarySlice.dailyOrders,
    categories: state.summarySlice.categories,
    isLoading: state.summarySlice.isLoading,
    err: state.summarySlice.err,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    summaryDataHandler: (token) => summaryDataHandler(dispatch, token),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashbord);
