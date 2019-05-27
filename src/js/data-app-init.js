ProtoGraph.initDataApp = function() {
  var x = new ProtoGraph.Card.toMaps(),
    streams = ProtoGraph.streams,
    page = ProtoGraph.page;

  x.init({
    selector: document.querySelector("#card-list-div"),
    dataURL: "https://cdn.protograph.pykih.com/69869f9d017573b26162/data.json",
    topoURL: "https://cdn.protograph.pykih.com/69869f9d017573b26162/india-topo.json",
    chartOptions: {
      height: 700,
      defaultCircleColor: ProtoGraph.site["house_colour"],
    },
    filterConfigurationJSON: {
      colors: {
        house_color: ProtoGraph.site["house_colour"],
        text_color: "#343434",
        active_text_color: ProtoGraph.site["house_colour"],
        filter_summary_text_color: ProtoGraph.site["reverse_font_colour"],
      },
      selected_heading: "FILTERS",
      reset_filter_text: "Reset",
    },
    filters: [
      {
        alias: "Sector",
        propName: "sector",
      },
      {
        alias: "Company Name",
        propName: "company_name",
      },
      {
        alias: "Violation Type",
        propName: "violation_type",
      },
      {
        alias: "Relevant Authority",
        propName: "relevant_authority",
      }]
  });
  x.renderLaptop();
};
