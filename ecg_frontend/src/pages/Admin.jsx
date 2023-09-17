/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useGlobalState } from "../components/UserContext.jsx";
import { Table } from "antd";
import Column from "antd/es/table/Column";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { MdDelete } from "react-icons/md";
import { Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useGlobalState("user");
  const [blink, setBlink] = useState(false);
  const [showBlinkingText, setShowBlinkingText] = useState(true);
  const [data, setData] = useState([]);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const [createUserID, setCreateUserID] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [createFall, setCreateFall] = useState("");
  const [createUrine, setCreateUrine] = useState("");
  const [updateUserID, setUpdateUserID] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateFall, setUpdateFall] = useState("");
  const [updateUrine, setUpdateUrine] = useState("");
  const nav = useNavigate();

  const createPatient = () => {
    api
      .post(
        "/patients",
        {
          user_id: createUserID,
          message: createMessage,
          fall_detection: createFall,
          urine_detection: createUrine,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Successfully created patient");
        setModal2Open(false);
      })
      .catch((error) => {
        console.log(error);
        setModal2Open(false);
        toast.error("Failed to create patient");
      });
  };
  const updatePatient = () => {
    api
      .put(
        `/patients/12`,
        {
          user_id: updateUserID,
          message: updateMessage,
          fall_detection: updateFall,
          urine_detection: updateUrine,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((response) => {
        setModal3Open(false);
        toast.success("Successfully updated patient details");
      })
      .catch((error) => {
        console.log(error);
        setModal3Open(false);
        toast.error("Failed to update patient details");
      });
  };
  const deletePatient = (id) => {};

  const filterDuplicates = (data) => {
    const filteredData = {};

    data.forEach((item) => {
      filteredData[item.user_id] = item;
    });

    return Object.values(filteredData);
  };

  useEffect(() => {
    if (user.role !== 2) {
      nav("/");
    }
  }, []);

  useEffect(() => {
    if (showBlinkingText) {
      const blinkTimeout = setTimeout(() => {
        setShowBlinkingText((prev) => !prev);
      }, 5 * 60 * 1000); // 2 minutes in milliseconds

      return () => clearTimeout(blinkTimeout);
    }
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowBlinkingText(true);
      setBlink((prevBlink) => !prevBlink);
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/patients`)
      .then((res) => {
        const filteredData = filterDuplicates(res.data);
        setData(filteredData);
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
      <div className="flex items-center justify-end pr-12 gap-x-4 my-6">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="colored"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 py-2 px-3 rounded-md text-white font-medium shadow-md"
          onClick={() => setModal2Open(true)}
        >
          Create New Patient
        </button>
        <button
          className="bg-orange-400 hover:bg-orange-500 py-2 px-3 rounded-md text-white font-medium shadow-md"
          onClick={() => setModal3Open(true)}
        >
          Update Patient Details
        </button>
      </div>
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
          {/* <Column
            title="Action"
            dataIndex="action"
            render={(action, record) => {
              return (
                <button
                  className="flex gap-x-2 justify-center items-center bg-red-700 p-2 rounded-md text-white hover:bg-red-800"
                  onClick={() => deletePatient(record.user_id)}
                >
                  Delete <MdDelete />
                </button>
              );
            }}
          ></Column> */}
        </Table>
        <Modal
          title="Create a new patient"
          centered
          open={modal2Open}
          okText={"Create"}
          onOk={createPatient}
          onCancel={() => setModal2Open(false)}
        >
          <div>
            <form>
              <div className="grid md:grid-cols-3 md:gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="user_id_create"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="user_id_create"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                    onChange={(e) => setCreateUserID(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="fall_detection_create"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Fall Detection
                  </label>
                  <input
                    type="text"
                    id="fall_detection_create"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => setCreateFall(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="urine_detection_create"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Urine Detection
                  </label>
                  <input
                    type="text"
                    id="urine_detection_create"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => setCreateUrine(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message_create"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Message
                </label>
                <textarea
                  type="text"
                  id="message_create"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={(e) => setCreateMessage(e.target.value)}
                />
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          title="Update patient details"
          centered
          open={modal3Open}
          okText={"Update"}
          onOk={updatePatient}
          onCancel={() => setModal3Open(false)}
        >
          <div>
            <form>
              <div className="grid md:grid-cols-3 md:gap-6">
                <div className="mb-6">
                  <label
                    htmlFor="user_id_update"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="user_id_update"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                    onChange={(e) => setUpdateUserID(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="fall_detection_update"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Fall Detection
                  </label>
                  <input
                    type="text"
                    id="fall_detection_update"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => setUpdateFall(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="urine_detection_update"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Urine Detection
                  </label>
                  <input
                    type="text"
                    id="urine_detection_update"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => setUpdateUrine(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message_update"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Message
                </label>
                <textarea
                  type="text"
                  id="message_update"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  onChange={(e) => setUpdateMessage(e.target.value)}
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
