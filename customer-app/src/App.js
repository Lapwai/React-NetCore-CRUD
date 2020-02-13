import React from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import "./App.css";
import axios from "axios";

export default class App extends React.Component {
  state = {
    customers: [],
    newCustomerData: {
      name: "",
      address: ""
    },
    editCustomerData: {
      id: "",
      name: "",
      address: ""
    },
    newCustomerModal: false,
    editCustomerModal: false
  };
  componentWillMount() {
    this._refreshCustomers();
  }
  toggleNewCustomerModal() {
    this.setState({
      newCustomerModal: !this.state.newCustomerModal
    });
    // this.state.newCustomerModal = true;
  }
  toggleEditCustomerModal() {
    this.setState({
      editCustomerModal: !this.state.editCustomerModal
    });
    // this.state.newCustomerModal = true;
  }
  addCustomer() {
    axios
      .post("http://localhost:51227/api/customers", this.state.newCustomerData)
      .then(response => {
        let { customers } = this.state;
        customers.push(response.data);
        this.setState({
          customers,
          newCustomerModal: false,
          newCustomerData: {
            name: "",
            address: ""
          }
        });
      });
  }
  updateCustomer() {
    let { name, address } = this.state.editCustomerData;
    axios
      .put(
        "http://localhost:51227/api/customers/" +
          this.state.editCustomerData.id,
        {
          name,
          address
        }
      )
      .then(response => {
        this._refreshCustomers();
        console.log(response.data);
      });
    this.setState({
      editCustomerModal: false,
      editCustomerData: { id: "", name: "", address: "" }
    });
  }
  editCustomer(id, name, address) {
    this.setState({
      editCustomerData: {
        id,
        name,
        address
      },
      editCustomerModal: !this.state.editCustomerModal
    });
  }
  deleteCustomer(id) {
    axios
      .delete("http://localhost:51227/api/customers/" + id)
      .then(response => {
        this._refreshCustomers();
      });
  }
  _refreshCustomers() {
    axios.get("http://localhost:51227/api/customers").then(response => {
      this.setState({
        customers: response.data
      });
    });
  }

  render() {
    let customers = this.state.customers.map(customer => {
      return (
        <tr key={customer.id}>
          <td>{customer.name}</td>
          <td>{customer.address}</td>
          <td>
            <Button
              color="success"
              size="sm"
              className="mr-2"
              onClick={this.editCustomer.bind(
                this,
                customer.id,
                customer.name,
                customer.address
              )}
            >
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={this.deleteCustomer.bind(this, customer.id)}
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <div className="container">
        <h3>Customer</h3>
        <Button
          className="my-3"
          color="primary"
          onClick={this.toggleNewCustomerModal.bind(this)}
        >
          Add Customer
        </Button>
        <Modal
          isOpen={this.state.newCustomerModal}
          toggle={this.toggleNewCustomerModal.bind(this)}
        >
          <ModalHeader toggle={this.toggleNewCustomerModal.bind(this)}>
            Add a New Customer
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.newCustomerData.name}
                onChange={e => {
                  let { newCustomerData } = this.state;
                  newCustomerData.name = e.target.value;
                  this.setState({ newCustomerData });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                id="address"
                value={this.state.newCustomerData.address}
                onChange={e => {
                  let { newCustomerData } = this.state;
                  newCustomerData.address = e.target.value;
                  this.setState({ newCustomerData });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addCustomer.bind(this)}>
              Create
            </Button>{" "}
            <Button
              color="secondary"
              onClick={this.toggleNewCustomerModal.bind(this)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Edit Modal */}
        <Modal
          isOpen={this.state.editCustomerModal}
          toggle={this.toggleEditCustomerModal.bind(this)}
        >
          <ModalHeader toggle={this.toggleEditCustomerModal.bind(this)}>
            Edit Customer
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.editCustomerData.name}
                onChange={e => {
                  let { editCustomerData } = this.state;
                  editCustomerData.name = e.target.value;
                  this.setState({ editCustomerData });
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                id="address"
                value={this.state.editCustomerData.address}
                onChange={e => {
                  let { editCustomerData } = this.state;
                  editCustomerData.address = e.target.value;
                  this.setState({ editCustomerData });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateCustomer.bind(this)}>
              Edit
            </Button>{" "}
            <Button
              color="secondary"
              onClick={this.toggleEditCustomerModal.bind(this)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{customers}</tbody>
        </Table>
      </div>
    );
  }
}
