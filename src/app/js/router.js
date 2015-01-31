var React = require("react");
var page = require("page");

var Router = React.createClass({
    // Render the current component
    render: function() {
        return this.state.component;
    },

    // Start with an empty div
    getInitialState: function() {
        return {
            component: <div />
        };
    },

    // Define our routes
    componentDidMount: function() {
        page("/", (ctx) => {
            console.log("At ", ctx);
            this.setState({
                component: <div>
                    <h1>Homepage</h1>
                    <a href="/haha">HAHA</a>
                </div>
            });
        });

        page("/haha", (ctx) => {
            console.log("At ", ctx);
            this.setState({
                component: <h1>HAHA</h1>
            });
        });

        page.start();
    }
});

module.exports = Router;

