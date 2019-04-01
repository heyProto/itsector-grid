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
      tabs: ["Tweets"],
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
        let data2 = this.props.data;
        let widthFactor =
          300 /
          Math.max(
            data2.caste_discrimination,
            data2.womens_rights,
            data2.religious_intolerance,
            data2.lgbtqi_rights,
            data2.foe,
            data2.farm_crisis,
            data2.workers_rights
          );
        widthFactor = widthFactor == Infinity ? 0 : widthFactor;
        return (
          <div className="graph-container">
            <div className="graph">
              <div className="categories">
                <div className="category">Caste Discrimination</div>
                <div className="category">Women's Rights</div>
                <div className="category">Religious Intolerance</div>
                <div className="category">LGBTQI Rights</div>
                <div className="category">FoE</div>
                <div className="category">Farm Crisis</div>
                <div className="category">Workers Rights</div>
              </div>
              <div className="bars">
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.caste_discrimination * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{
                      width: 300 - data2.caste_discrimination * widthFactor,
                    }}
                  />
                </div>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.womens_rights * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{ width: 300 - data2.womens_rights * widthFactor }}
                  />
                </div>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.religious_intolerance * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{
                      width: 300 - data2.religious_intolerance * widthFactor,
                    }}
                  />
                </div>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.lgbtqi_rights * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{ width: 300 - data2.lgbtqi_rights * widthFactor }}
                  />
                </div>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.foe * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{ width: 300 - data2.foe * widthFactor }}
                  />
                </div>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.farm_crisis * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{ width: 300 - data2.farm_crisis * widthFactor }}
                  />
                </div>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{ width: data2.workers_rights * widthFactor }}
                  />
                  <div
                    className="alt-bar"
                    style={{ width: 300 - data2.workers_rights * widthFactor }}
                  />
                </div>
              </div>
              <div className="labels">
                <div className="chart-label">{data2.caste_discrimination}</div>
                <div className="chart-label">{data2.womens_rights}</div>
                <div className="chart-label">{data2.religious_intolerance}</div>
                <div className="chart-label">{data2.lgbtqi_rights}</div>
                <div className="chart-label">{data2.foe}</div>
                <div className="chart-label">{data2.farm_crisis}</div>
                <div className="chart-label">{data2.workers_rights}</div>
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
                  {data.name}
                  <a href={data.twitter_handle} target="_blank"><img src="https://cdn.protograph.pykih.com/Assets/social-icons/twitter-outline.png" style={{width: '20px', verticalAlign: 'text-bottom', marginLeft: '10px'}}></img></a>
                </div>
                {data.leadership_role},{" "}
                {data.company_url ? <a href={data.company_url} target="_blank">
                  {data.company}
                </a> : data.company}
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
                  {data.name}
                  <a href={data.twitter_handle} target="_blank"><img src="https://cdn.protograph.pykih.com/Assets/social-icons/twitter-outline.png" style={{width: '20px', verticalAlign: 'text-bottom', marginLeft: '10px'}}></img></a>
                </div>
                {data.leadership_role},{" "}
                {data.company_url ? <a href={data.company_url} target="_blank">
                  {data.company}
                </a> : data.company}
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
