import { Container } from "react-bootstrap";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import "./App.scss";
import styles from "./App.module.scss";
import { useLocation } from "react-router-dom";

function App(props) {
  const location = useLocation();
  const url = location?.pathname;
  const src = require("./images/red-christmas-ball-icon-44144.png");
  const greetingsYears = [
    "2022",
    "2021",
    "2020",
    "2019",
    "2017",
    "2015",
    "2014",
    "2012",
    "2011",
    "2009",
    "2008",
  ];
  const currentYear = greetingsYears[0];
  const getNavLink = (linkText) => {
    const isActive =
      (linkText === currentYear && url === "/") || url === "/" + linkText;
    return (
      <Nav.Link
        key={linkText}
        className={
          isActive ? "happy-holidays-active" : "happy-holidays-inactive"
        }
        href={linkText}
      >
        {linkText}
      </Nav.Link>
    );
  };
  return (
    <div className={styles.app}>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/" className={styles.brand}>
            <img
              src={src}
              width="32"
              height="32"
              className="d-inline-block align-top"
              alt="Christmas ornament"
            />
            <span style={{ color: "green" }}>Happy Holidays!</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />

          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              {greetingsYears.map((year) => getNavLink(year))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className={styles.appContent}>{props.children}</div>
    </div>
  );
}

export default App;
