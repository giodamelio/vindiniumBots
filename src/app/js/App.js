var React = require("react");
var Router = require("react-router");
var Bootstrap = require("react-bootstrap");
var ReactRouterBootstrap = require("react-router-bootstrap");

var RouteHandler = Router.RouteHandler,
    Navbar = Bootstrap.Navbar,
    Nav = Bootstrap.Nav,
    NavItemLink = ReactRouterBootstrap.NavItemLink;

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Navbar inverse="true">
                    <Nav>
                        <NavItemLink to="dashboard">Dashboard</NavItemLink>
                        <NavItemLink to="haha">haha</NavItemLink>
                    </Nav>
                </Navbar>
                <RouteHandler/>
            </div>
        );
    }
});

module.exports = App;

