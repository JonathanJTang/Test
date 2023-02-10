import React from "react";
import "./styles.css";

import CreateServiceForm from "./createServiceForm";
import Service from "../Service";
import { getAllServices, removeService } from "../../actions/apiRequests";

/* Services component */
class Services extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      servicesList: [],
      showCreatePosting: false,
      filter: "all",
      filterkey: "",
    };
  }

  async componentDidMount() {
    // Fetch list of posts from server
    const servicesList = await getAllServices();
    if (servicesList !== undefined) {
      // Server call succeeded
      this.setState({ servicesList: servicesList });
    }
  }

  handleClick = () => {
    this.setState({ showCreatePosting: true });
  };

  createPostingHandler = (updatedPostings) => {
    this.setState({ showCreatePosting: false, servicesList: updatedPostings });
  };

  setFilter = (e) => {
    this.setState({ filter: e.target.value, filterkey: "" });
  };

  setFilterTag = (tag) => {
    this.setState({ filter: "tag", filterkey: tag });
  };

  handleFilterFieldChange = (e) => {
    this.setState({ filterkey: e.target.value });
  };

  filterUser = (service) => {
    return service.owner.actualName
      .toLowerCase()
      .includes(this.state.filterkey.toLowerCase());
  };

  filterTag = (service) => {
    return service.tags.some((tag) =>
      tag.toLowerCase().includes(this.state.filterkey.toLowerCase())
    );
  };

  render() {
    let filtered = this.state.servicesList;

    // Filter if applicable
    const filters = { username: this.filterUser, tag: this.filterTag };
    if (this.state.filter !== "all" && this.state.filterkey !== "") {
      filtered = this.state.servicesList.filter(filters[this.state.filter]);
    }

    return (
      <div className="posts">
        <div className="trade-header">
          <h2>
            Offer or receive services such as pet sitting and matchmaking!
          </h2>
          <h4>Looking for a specific service? Filter by poster name or tag!</h4>
          {this.state.showCreatePosting ? (
            <CreateServiceForm
              servicesList={this.state.servicesList}
              parentStateUpdater={this.createPostingHandler}
            />
          ) : (
            <button
              className="pawfriends-styled-button"
              onClick={this.handleClick}
            >
              Add a service
            </button>
          )}
        </div>
        <div className="postsList">
          <div className="filter">
            <select value={this.state.filter} onChange={this.setFilter}>
              <option value="all">All</option>
              <option value="username">Username</option>
              <option value="tag">Tag</option>
            </select>
            {this.state.filter !== "all" && (
              <input
                value={this.state.filterkey}
                onChange={this.handleFilterFieldChange}
              />
            )}
          </div>
          {this.state.servicesList &&
            filtered.map((service, index) => (
              <Service
                key={service._id}
                service={service}
                serviceArrayIndex={index}
                setFilterTag={this.setFilterTag}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default Services;
