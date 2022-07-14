import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { FetchAllUser } from "../services/UserService";
import ReactPaginate from "react-paginate";
import ModalAddNew from "./ModalAddNew";
import ModalEditUsers from "./ModalEditUsers";
import ModalDeleteUser from "./ModalDeleteUser";
import _ from "lodash";
import { debounce } from "lodash";
import "./TableUser.scss";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from "react-toastify";
const TableUsers = (props) => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowAddNew, setShowAddNew] = useState(false);

  const [isShowEdit, setShowEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({}); // luu gia tri khi click

  const [isShowDelete, setIsShowDelete] = useState(false);
  const [dataUserDelete, setDataUserDelete] = useState({});

  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [pageCurrent, setPageCurrent] = useState(0);

  const [dataExport, setDataExport] = useState([]);

  //================DONG MODAL======================================
  const handleClose = () => {
    setShowAddNew(false);
    setShowEdit(false);
    setIsShowDelete(false);
  };

  //===============Them user==============================================
  const handleUpdateUsers = (user) => {
    setListUsers([...listUsers, user]);
  };

  //=================Hien thi ten len Modal=====================================
  useEffect(() => {
    getUsers(1);
  }, []);

  //================Get data len table========================================
  const getUsers = async (page) => {
    let res = await FetchAllUser(page);
    if (res && res.data) {
      setTotalUsers(res.total);
      setListUsers(res.data);
      setTotalPages(res.total_pages);
    }
  };

  //===============next and prev trang=======================================
  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
    setPageCurrent(+event.selected + 1);
  };

  //================SU kien an nut Edit===========================================
  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setShowEdit(true);
  };

  //================ Su kien an nut confirm trong modal edit=======================
  const handleEditFromModal = (user) => {
    let cloneListUser = _.clone(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);
    cloneListUser[index].first_name = user.first_name;
    setListUsers(cloneListUser);
  };

  //================Su kien an nut Delete========================================
  const handleDeleteUser = (user) => {
    setIsShowDelete(true);
    setDataUserDelete(user);
    console.log(">>>>>>>>..CHeck", dataUserDelete.email);
  };

  //===============SU kien an nut confirm trong delete======================
  const handleDeleteFromModal = (id) => {
    let cloneListUser = _.clone(listUsers);
    cloneListUser = cloneListUser.filter((item) => item.id !== id);
    setListUsers(cloneListUser);
  };

  //====================Su kien sap xep theo id va name===========================
  const handleSort = (sortBy, sortField) => {
    setSortField(sortField);
    setSortBy(sortBy);
    let cloneListUser = _.clone(listUsers);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]); // su dung lodash de sort theo thuoc tinh theo asc - desc
    setListUsers(cloneListUser);
  };

  //==================SEARCH_EMAIL=========================================
  const handleSearch = debounce((e) => {
    console.log(e.target.value);
    let term = e.target.value;
    if (term) {
      let cloneListUser = _.clone(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      setListUsers(cloneListUser);
    } else {
      getUsers(pageCurrent);
    }
  }, 500);

  //================EXPORT_CSV==============================================
  const getUserExport = (event, done) => {
    let results = [];
    if (listUsers && listUsers.length > 0) {
      results.push(["Id", "Email", "First Name", "Last Name"]);
      listUsers.map((item) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        results.push(arr);
      });
      setDataExport(results);
      done();
    }
  };

  //==================IMPORT_CSV===========================================
  const handleImportCSV = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("Only accept csv file");
        return;
      }
      Papa.parse(file, {
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Not found data Header CSV file");
              } else {
                let result = [];
                rawCSV.map((item, index) => {
                  let obj = {};
                  if (index > 0 && item.length === 3) {
                    obj.email = item[0];
                    obj.first_name = item[1];
                    obj.last_name = item[2];
                    result.push(obj);
                  }
                });
                setListUsers(result);
              }
            } else {
              toast.error("Not found data on CSV file");
            }
          } else {
            toast.error("Not found data on CSV file");
          }
        },
      });
    }
  };

  return (
    <>
      <div className="my-3 add-new d-sm-flex">
        <span className="">List Users</span>
        <div className="group-btns">
          <label htmlFor="myfile" className="btn btn-warning">
            <i className="fa-solid fa-file-import"></i>
            Import
          </label>
          <input
            id="myfile"
            type="file"
            multiple
            hidden
            onChange={(e) => handleImportCSV(e)}
          />
          <CSVLink
            filename={"users.csv"}
            className="btn btn-primary"
            data={dataExport}
            asyncOnClick={true}
            onClick={getUserExport}
          >
            <i className="fa-solid fa-download"></i>
            Export
          </CSVLink>
          <button
            className="btn btn-success "
            onClick={() => setShowAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"></i>
            Add new
          </button>
        </div>
      </div>
      <div className="col-12 col-sm-4 my-3">
        <input
          className="input-Search"
          type="text"
          placeholder="Search Email...."
          onChange={(e) => handleSearch(e)}
        />
      </div>
      <div className="customize-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID</span>
                  <span>
                    <i
                      onClick={() => handleSort("desc", "id")}
                      className="fa-solid fa-arrow-down-long"
                    ></i>
                    <i
                      onClick={() => handleSort("asc", "id")}
                      className="fa-solid fa-arrow-up-long"
                    ></i>
                  </span>
                </div>
              </th>
              <th>Email</th>
              <th>
                <div className="sort-header">
                  <span>First Name</span>
                  <span>
                    <i
                      onClick={() => handleSort("desc", "first_name")}
                      className="fa-solid fa-arrow-down-long"
                    ></i>
                    <i
                      onClick={() => handleSort("asc", "first_name")}
                      className="fa-solid fa-arrow-up-long"
                    ></i>
                  </span>
                </div>
              </th>
              <th>Last Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => (
                <tr key={`user-${index}`}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>
                    <button
                      className="btn btn-warning mx-3"
                      onClick={() => handleEditUser(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link"
        previousClassName="page-item"
        nextLinkClassName="page-link"
        nextClassName="page-item"
        breakLinkClassName="page-link"
        breakClassName="page-item"
        containerClassName="pagination"
        activeClassName="active"
      />
      <ModalAddNew
        show={isShowAddNew}
        handleClose={handleClose}
        handleUpdateUsers={handleUpdateUsers}
      />
      <ModalEditUsers
        show={isShowEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleUpdateUsers={handleUpdateUsers}
        handleEditFromModal={handleEditFromModal}
      />
      <ModalDeleteUser
        show={isShowDelete}
        handleClose={handleClose}
        handleUpdateUsers={handleUpdateUsers}
        dataUserDelete={dataUserDelete}
        handleDeleteFromModal={handleDeleteFromModal}
      />
    </>
  );
};

export default TableUsers;
