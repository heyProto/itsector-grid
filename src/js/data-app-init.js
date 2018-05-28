ProtoGraph.initDataApp = function () {
    var x = new ProtoGraph.Card.toMaps(),
        streams = ProtoGraph.streams,
        page = ProtoGraph.page;

    x.init({
        selector: document.querySelector('#card-list-div'),
        dataURL: streams.Grid.url,
        topoURL: 'https://duxxuzyhk2mdg.cloudfront.net/data/india-topo.json',
        chartOptions: {
            height: 700,
            defaultCircleColor: '#cd1713'
        },
        filterConfigurationJSON: {
            colors: {
                house_color: ProtoGraph.site['house_colour'],
                text_color: '#343434',
                active_text_color: ProtoGraph.site['house_colour'],
                filter_summary_text_color: ProtoGraph.site['reverse_font_colour']
            },
            selected_heading: 'FILTERS',
            reset_filter_text: 'Reset'
        },
        filters: [
            {
                "alias": "Year",
                "propName": "year"
            },
            {
                "alias": "Context/Bias Indicator",
                "propName": "pretext_to_incident"
            },
            {
                "alias": "Party in Power",
                "propName": "party_in_power"
            },
            {
                "alias": "Type of Assault",
                "propName": "type_of_assault"
            },
            {
                "alias": "Source",
                "propName": "type_of_source"
            },
            {
                "alias": "Is FIR resgistered?",
                "propName": "is_fir_registered"
            }
        ]
    });
    x.renderLaptop();
}