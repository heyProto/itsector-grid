import React from "react";
import ReactModal from "react-modal";
import axios from "axios";
import moment from "moment";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    let stateVar = {
      dataJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      activeCounter: 1,
      tabs: ["Overview", "Details", "Sources"],
      translateValue: 50,
      visible: false,
    };

    this.state = stateVar;

    this.afterOpen = this.afterOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  afterOpen() {
    this.setState({
      visible: true,
    });

    document.body.style["overflow-y"] = "hidden";
  }

  handleRequestClose() {
    this.setState({
      visible: false,
    });
    document.body.style["overflow-y"] = "auto";
  }

  formatDate(date, language) {
    if (date) {
      switch (language) {
        case "Hindi":
          moment.locale("hi");
          break;
        case "English":
        default:
          moment.locale("en");
      }

      let localDate = moment(date);
      return localDate.format("LL");
    } else return "-";
  }

  selectTab(tab) {
    this.setState({ activeCounter: tab + 1 });
  }

  renderTabs() {
    let tabs = this.state.tabs;
    let tabNames;
    let tabClass;

    tabNames = tabs.map((card, i) => {
      tabClass =
        this.state.activeCounter == i + 1
          ? this.state.mode == "col-7"
            ? "single-tab active"
            : "single-tab single-tab-mobile active"
          : this.state.mode == "col-7"
          ? "single-tab"
          : "single-tab single-tab-mobile";
      return (
        <div
          key={i.toString()}
          className={tabClass}
          style={{ cursor: "pointer" }}
          onClick={() => this.selectTab(i)}
        >
          {tabs[i]}
        </div>
      );
    });
    return tabNames;
  }

  removeArrElem(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

  renderTabContent(tab) {
    let data = this.props.data;
    switch (tab) {
      case 1:
        return (
          <div className="card-content-div">
            <div>  
              <div className="full-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">Summary</div>
                  <p>{data.summary ? data.summary : 'Not available'}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">Judgment</div>
                  <p>{data.judgment ? data.judgment : 'Not available'}</p>
                </div>
              </div>
              </div>
            </div>
        );
        case 2:
        return (
          <div className="card-content-div">
            <div>  
              <div className="full-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">Value of fine</div>
                  <p>{data.value ? data.value : 'Not available'}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">Violation location</div>
                  <p>{data.violation_location ? data.violation_location : 'Not available'}</p>
                </div>
                <div className="single-parameter">
                  <div className="parameter-label">Relevant authority</div>
                  <p>{data.relevant_authority ? data.relevant_authority : 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        );
        case 3:
        return (
          <div className="card-content-div">
            <div>  
              <div className="full-width-parameter">
                <div className="single-parameter">
                  <div className="parameter-label">Source of information</div>
                  <p><a href={data.headline}>{data.source ? data.source : 'Not available'}</a></p>
                </div>
              </div>
            </div>
          </div>
        );
        break;
    }
  }

  renderCol7() {
    let data = this.props.data;

    return (
      <ReactModal
        isOpen={this.props.showModal}
        onAfterOpen={this.afterOpen}
        onRequestClose={e => {
          this.handleRequestClose(e);
          this.props.closeModal(e);
        }}
        closeTimeoutMS={0}
        overlayClassName="protograph-modal-overlay"
        className="proto-col col-7 protograph-modal"
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={false}
        shouldReturnFocusAfterClose={true}
        style={{ display: "block" }}
        role="dialog"
        parentSelector={() => document.body}
        aria={{
          labelledby: "heading",
          describedby: "full_description",
        }}
      >
        <div
          className="protograph-close-modal"
          onClick={e => {
            this.handleRequestClose(e);
            this.props.closeModal(e);
          }}
        >
          <div className="protograph-close-text">
            <i className="remove icon" />
          </div>
        </div>
        {data && (
          <div id="protograph_modal_card">
            <div id="protograph_div" className="protograph-col7-mode">
              <div className="news-card">
                <div className="card-title">
                  <a href={data.company_url}>{data.company_name}</a>
                </div>
                <span class="card-subtitle">{data.sector} - {data.violation_type}</span>
                <div className="card-tabs">{this.renderTabs()}</div>
                <div className="tab-content">
                  {this.renderTabContent(this.state.activeCounter)}
                </div>
                <div className="card-footer">
                  <img
                    className="logo-img"
                    src={
                      "https://www.responsiblebiz.org/images/oxfamirbi/0c1c355e14de082d/6260.png"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {!data && <div>Loading</div>}
      </ReactModal>
    );
  }

  renderCol4() {
    let data = this.props.data;
    return (
      <ReactModal
        isOpen={this.props.showModal}
        onAfterOpen={this.afterOpen}
        onRequestClose={e => {
          this.handleRequestClose(e);
          this.props.closeModal(e);
        }}
        closeTimeoutMS={0}
        overlayClassName="protograph-modal-overlay"
        className="proto-col col-7 protograph-modal"
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={false}
        shouldReturnFocusAfterClose={true}
        role="dialog"
        style={{ display: "block" }}
        parentSelector={() => document.body}
        aria={{
          labelledby: "heading",
          describedby: "full_description",
        }}
      >
        <div
          className="protograph-close-modal"
          onClick={e => {
            this.handleRequestClose(e);
            this.props.closeModal(e);
          }}
        >
          <div className="protograph-close-text">
            <i className="remove icon" />
          </div>
        </div>
        {data && (
          <div id="protograph_modal_card">
            <div id="protograph_div" className="protograph-col7-mode">
              <div className="news-card">
                <div className="card-title">
                <a href={data.company_url} target="_blank">{data.company_name}</a>
                </div>
                <span class="card-subtitle">{data.sector} - {data.violation_type}</span>
                <div className="card-tabs">{this.renderTabs()}</div>
                <div className="tab-content">
                  {this.renderTabContent(this.state.activeCounter)}
                </div>
                <div className="card-footer">
                  <img
                    className="logo-img"
                    src={
                      "https://www.responsiblebiz.org/images/oxfamirbi/0c1c355e14de082d/6260.png"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {!data && <div>Loading</div>}
      </ReactModal>
    );
  }

  render() {
    switch (this.props.mode) {
      case "col7":
        return this.renderCol7();
        break;
      case "col4":
        return this.renderCol4();
        break;
    }
  }
}
