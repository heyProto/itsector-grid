import React from 'react';
import ReactModal from 'react-modal';
import axios from "axios";
import moment from "moment";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);

    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      languageTexts: undefined,
      siteConfigs: this.props.siteConfigs,
      activeCounter: 1,
      translateValue: 50,
      visible: false
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.tags =
        this.tagMap[this.props.dataJSON.data.language] ||
        this.tagMap["English"];
    }

    this.state = stateVar;
    this.afterOpen = this.afterOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  componentDidMount() {
    if (this.state.fetchingData) {
      console.log(this.props.dataURL);
      let items_to_fetch = [axios.get(this.props.dataURL)];

      axios.all(items_to_fetch).then(
        axios.spread(card => {
          let stateVar = {
            fetchingData: false,
            dataJSON: card.data,
            activeCounter: 1,
            tags:
              this.tagMap[card.data.data.language] || this.tagMap["English"],
          };
          this.setState(stateVar);
        })
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON,
        tags:
          this.tagMap[nextProps.dataJSON.data.language] ||
          this.tagMap["English"],
      });
    }
  }

  afterOpen() {
    this.setState({
      visible: true
    })

    document.body.style['overflow-y'] = 'hidden';
  }

  handleRequestClose() {
    this.setState({
      visible: false
    })
    document.body.style['overflow-y'] = 'auto';
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
    let tabs = this.state.tags.tabs;
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
    console.log(array, "Array");
  }

  renderTabContent(tab) {
    let data = this.props.data
    switch (tab) {
      case 2:
        let description = this.state.dataJSON.data.description_of_incident;
        return <p>{description}</p>;
      case 1:
        let data = this.state.dataJSON.data;
        return (
          <div>
            <div className="half-width-parameter">
              <div className="single-parameter">
                <div className="parameter-label">Position</div>
                <p>{data.leadership_role}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  Company
                </div>
                <p>{data.company}</p>
              </div>
              <div className="single-parameter">
                <div className="parameter-label">
                  Verified
                </div>
                <p>{data.verified}</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="single-parameter">
              <div className="parameter-label">{this.state.tags.source}</div>
              <p>
                <a href={data.link_1} target="_blank">
                  {data.link_1}
                </a>
              </p>
              <p>
                <a href={data.link_2} target="_blank">
                  {data.link_2}
                </a>
              </p>
            </div>
            <div className="single-parameter">
              <div className="parameter-label">
                {this.state.tags.last_updated}
              </div>
              <p>{this.formatDate(data.last_updated, data.language)}</p>
            </div>
          </div>
        );
      case 4:
          if (this.state.dataJSON.data.videos && this.state.dataJSON.data.images) {
            return (
              <div className="sliders">
                <Slider width={540} urls={this.state.dataJSON.data.images} type="image" />
                <Slider width={540} urls={this.state.dataJSON.data.videos} type="video" hidden={true} />
              </div>          
            );
          }
          else if (this.state.dataJSON.data.images) {
            return (
              <Slider width={540} urls={this.state.dataJSON.data.images} type="image" />
            )
          }
          else {
            let message = this.state.tags.no_images;
            return (
              message
            );
          }
          
      case 5:
        if (this.state.dataJSON.data.videos && this.state.dataJSON.data.images) {
          return (
            <div className="sliders">
              <Slider width={540} urls={this.state.dataJSON.data.images} type="image" hidden={true} />
              <Slider width={540} urls={this.state.dataJSON.data.videos} type="video"/>
            </div>          
          );
        }
        else if (this.state.dataJSON.data.videos) {
          return (
            <Slider width={540} urls={this.state.dataJSON.data.videos} type="video" />
          )
        }
        else {
          let message = this.state.tags.no_videos;
          return (
            message
          );
        } 
        break;
    }
  }

  renderCol7() {
    if (this.state.fetchingData) {
      return <div>Loading</div>;
    } else {
      let data = this.props.data

      return (
        <ReactModal
        isOpen={this.props.showModal}
        onAfterOpen={this.afterOpen}
        onRequestClose={((e) => {
          this.handleRequestClose(e);
          this.props.closeModal(e);
        })}
        closeTimeoutMS={0}
        overlayClassName="protograph-modal-overlay"
        className="proto-col col-7 protograph-modal"
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={false}
        shouldReturnFocusAfterClose={true}
        style={{display: block}}
        role="dialog"
        parentSelector={() => document.body}
        aria={{
          labelledby: "heading",
          describedby: "full_description"
        }}
      >
        <div
          className="protograph-close-modal"
          onClick={((e) => {
            this.handleRequestClose(e);
            this.props.closeModal(e);
          })}
        >
          <div className="protograph-close-text"><i className="remove icon"></i></div>
        </div>
        <div id="protograph_modal_card"><div id="protograph_div" className="protograph-col7-mode">
          <div className="news-card">
            <div className="card-title">
              {data.name}
            </div>
            {data.leadership_role}, {data.company}
            <div className="card-tabs">{this.renderTabs()}</div>
            <div className="tab-content">
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer">
              <img
                className="logo-img"
                src={
                  "https://cdn.protograph.pykih.com/79c10f895565f79dca4b/is_logo.jpeg"
                }
              />
            </div>
          </div>
        </div>
        </div>
        </ReactModal>
        
      );
    }
  }

  renderCol4() {
    if (this.state.fetchingData) {
      return <div>Loading</div>;
    } else {
      let data = this.state.dataJSON.data
      return (
        <ReactModal
        isOpen={this.props.showModal}
        onAfterOpen={this.afterOpen}
        onRequestClose={((e) => {
          this.handleRequestClose(e);
          this.props.closeModal(e);
        })}
        closeTimeoutMS={0}
        overlayClassName="protograph-modal-overlay"
        className="proto-col col-7 protograph-modal"
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={false}
        shouldReturnFocusAfterClose={true}
        role="dialog"
        parentSelector={() => document.body}
        aria={{
          labelledby: "heading",
          describedby: "full_description"
        }}
      >
        <div
          className="protograph-close-modal"
          onClick={((e) => {
            this.handleRequestClose(e);
            this.props.closeModal(e);
          })}
        >
          <div className="protograph-close-text"><i className="remove icon"></i></div>
        </div>
        <div id="protograph_modal_card">
        <div id="protograph_div" className="protograph-col4-mode">
          {/* content */}
          <div className="news-card news-card-mobile">
            <button className="card-date" disabled="true">
              {date}
            </button>
            <div className="card-title">
              {data.name}
            </div>
            <div className="card-tabs card-tabs-mobile">
              {this.renderTabs()}
            </div>
            <div className="tab-content">
              {this.renderTabContent(this.state.activeCounter)}
            </div>
            <div className="card-footer card-footer-mobile">
              <img
                className="logo-img"
                src={
                  "https://cdn.protograph.pykih.com/79c10f895565f79dca4b/is_logo.jpeg"
                }
              />
            </div>
          </div>
        </div>
        </div>
      </ReactModal>
        
      );
    }
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
