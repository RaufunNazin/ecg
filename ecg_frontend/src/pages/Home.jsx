/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Table } from "antd";
import api from "../api";
import { useGlobalState } from "../components/UserContext";
import Column from "antd/es/table/Column";
import "../App.css";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useGlobalState("user");
  const [blink, setBlink] = useState(false);
  const [showBlinkingText, setShowBlinkingText] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if(showBlinkingText){
      const blinkTimeout = setTimeout(() => {
        setShowBlinkingText((prev) => !prev);
      }, 5 * 60 * 1000); // 2 minutes in milliseconds
  
      return () => clearTimeout(blinkTimeout);
    }
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowBlinkingText(true)
      setBlink((prevBlink) => !prevBlink);
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/patients/${user.id}`)
      .then((res) => {
        setData([res.data]);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <Navbar />
      <div className="mt-5 mx-8 shadow-md">
        <Table
          loading={loading}
          dataSource={data}
          rowKey="id"
          pagination={false}
          style={{ overflowX: "auto" }}
        >
          <Column
            title="Name"
            dataIndex="name"
            render={(name, record) => {
              return <div>{user.name}</div>;
            }}
          ></Column>
          <Column title="Message" dataIndex="message"></Column>
          <Column title="Fall Detection" dataIndex="fall_detection"></Column>
          <Column title="Urine Detection" dataIndex="urine_detection"></Column>
          <Column title="ECG" dataIndex="ecg"></Column>
          <Column
            title="Side Change"
            dataIndex="side_change"
            render={(side, record) => {
              return showBlinkingText ? (
                <span
                  className={`bg-green-500 p-2 rounded-md text-white font-medium ${
                    blink ? "blink-text" : ""
                  }`}
                >
                  Side Change
                </span>
              ) : null;
            }}
          ></Column>
        </Table>
      </div>
    </div>
  );
};

export default Home;
